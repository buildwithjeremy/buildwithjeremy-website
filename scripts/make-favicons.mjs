#!/usr/bin/env node
/**
 * Favicon set for buildwithjeremy.com, made from Jeremy's transparent headshot.
 *
 * WHY THIS EXISTS
 * Until 2026-10-19 the site shipped Astro's stock favicon. BWJ is a first-person brand
 * with no logo mark, so the icon is Jeremy's face on a brand-blue (#5565f1) circle.
 *
 * HOW SMALL SIZES STAY READABLE
 * The head is framed with room around it (shoulders showing) so it does not crowd the
 * circle. At 16-48px the master gets local contrast (CLAHE) before shrinking and a light
 * sharpen after, so eyes, brows and the smile survive. Sizes 96px and up are a plain
 * Lanczos downscale. Apple touch is full-bleed (iOS fills transparency with black and
 * applies its own mask).
 *
 * sharp is not a direct dependency: it ships with Astro (image service) and is hoisted.
 *
 * Run: node scripts/make-favicons.mjs "<path to transparent headshot PNG>"
 * (writes into public/, commit the outputs). Framing constants assume the 1714x2000
 * 2026 headshot; re-check FACE_CX/SPAN/TOP for a new photo.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = process.argv[2];
if (!SRC || !fs.existsSync(SRC)) throw new Error('Pass the transparent headshot PNG as the first argument.');

const PUBLIC = path.resolve(import.meta.dirname, '..', 'public');
const BRAND = '#5565f1';
const FACE_CX = 840; // horizontal centre of the face in the source
const SPAN = 1750; // source px across the icon (bigger = smaller head, more room)
const TOP = -120; // source y at the top of the icon (negative = headroom above the hair)
const MASTER = 512;

/** The person, cropped and scaled to MASTER px, on transparency. */
async function person() {
  const pad = 600;
  const padded = await sharp(SRC)
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  return sharp(padded)
    .extract({ left: Math.round(FACE_CX - SPAN / 2) + pad, top: TOP + pad, width: SPAN, height: SPAN })
    .resize(MASTER, MASTER)
    .toBuffer();
}

const svg = (body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${MASTER}" height="${MASTER}">${body}</svg>`);
const half = MASTER / 2;

/** Round icon: brand circle, person clipped to it, transparent corners. */
async function roundMaster(p) {
  const onCircle = await sharp(svg(`<circle cx="${half}" cy="${half}" r="${half}" fill="${BRAND}"/>`)).composite([{ input: p }]).png().toBuffer();
  return sharp(onCircle).composite([{ input: svg(`<circle cx="${half}" cy="${half}" r="${half}"/>`), blend: 'dest-in' }]).png().toBuffer();
}

/** Square icon: full-bleed brand background for Apple touch. */
async function squareMaster(p) {
  return sharp(svg(`<rect width="100%" height="100%" fill="${BRAND}"/>`)).composite([{ input: p }]).png().toBuffer();
}

/** Small sizes: local contrast before shrinking, light sharpen after. */
async function small(master, px) {
  const flat = await sharp(master).flatten({ background: BRAND }).clahe({ width: 64, height: 64, maxSlope: 3 }).toBuffer();
  const alpha = await sharp(master).extractChannel(3).toBuffer();
  const lifted = await sharp(flat).joinChannel(alpha).png().toBuffer();
  return sharp(lifted).resize(px, px, { kernel: 'lanczos3' }).sharpen({ sigma: px <= 16 ? 0.5 : 0.7, m1: 1, m2: 2 }).png({ compressionLevel: 9 }).toBuffer();
}

// Palette PNG keeps 192-512px icons to tens of KB instead of hundreds.
const large = (master, px) => sharp(master).resize(px, px, { kernel: 'lanczos3' }).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();

/** ICO container holding PNG frames (supported by every current browser). */
function ico(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  const dir = Buffer.alloc(16 * frames.length);
  let offset = 6 + dir.length;
  frames.forEach(({ px, data }, i) => {
    const o = i * 16;
    dir.writeUInt8(px >= 256 ? 0 : px, o);
    dir.writeUInt8(px >= 256 ? 0 : px, o + 1);
    dir.writeUInt16LE(1, o + 4); // colour planes
    dir.writeUInt16LE(32, o + 6); // bits per pixel
    dir.writeUInt32LE(data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });
  return Buffer.concat([header, dir, ...frames.map((f) => f.data)]);
}

const p = await person();
const round = await roundMaster(p);
const square = await squareMaster(p);

const out = (name, data) => {
  fs.writeFileSync(path.join(PUBLIC, name), data);
  console.log(`${name.padEnd(22)} ${data.length} bytes`);
};

const f16 = await small(round, 16);
const f32 = await small(round, 32);
const f48 = await small(round, 48);
out('favicon-16x16.png', f16);
out('favicon-32x32.png', f32);
out('favicon.ico', ico([{ px: 16, data: f16 }, { px: 32, data: f32 }, { px: 48, data: f48 }]));
out('icon-192.png', await large(round, 192));
out('icon-512.png', await large(round, 512));
out('apple-touch-icon.png', await large(square, 180));
