#!/usr/bin/env node
/**
 * Proof-claim guard.
 *
 * WHY THIS EXISTS
 * On 2026-09-19 an audit against the proof bank found /operations-consulting/ and
 * /ai-automation-consulting/ both serving "20+ systems built" in their credential
 * byline. The approved figure is "30+ client engagements to date" (Build Suite: 34
 * as of 2026-09-17). Nothing on this repo checked outward claims at all. The sibling
 * BMS repo had a pricing guard, but a price guard cannot see a proof claim.
 *
 * THE RULE
 * Every outward-facing claim traces to ~/Documents/BWJ-Marketing/proof/proof-points.md.
 * APPROVED claims may be used as written, RETIRED claims are "remove on sight", and
 * NEEDS DECISION claims do not go out at all.
 *
 * This guard cannot read that file (different repo), so it encodes the RETIRED list
 * as patterns. When a claim is retired or approved over there, update BANNED here in
 * the same change.
 *
 * Run: npm run check:claims   (also runs automatically via prebuild)
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src');

/** RETIRED or unsourced claims. Any of these reaching a build is a bug. */
const BANNED = [
  { re: /\$\s?[0-9.]+\s?M\+?\s*(client\s+)?(revenue|arr)\s+enabled/i,
    why: 'RETIRED: "$XM+ revenue enabled" is conflicting and unsourced. See proof-points.md NEEDS DECISION.' },
  { re: /(revenue|arr)\s+enabled/i,
    why: 'RETIRED: "revenue enabled" is an unfalsifiable attribution claim. Say what was measured instead.' },
  { re: /\b(20|17)\s?\+?\s*(custom\s+)?systems?\s+(built|shipped|delivered)|\b(built|shipped|delivered)\s+(20|17)\s?\+?\s*(custom\s+)?systems?\b/i,
    why: 'SUPERSEDED: the approved engagement count is "30+ client engagements to date" (Build Suite: 34 as of 2026-09-17).' },
  { re: /value:\s*['"](20|17)\s?\+?['"]\s*,\s*label:\s*['"][^'"]*systems?\b/i,
    why: 'SUPERSEDED (stat split across value/label): the approved engagement count is "30+ client engagements to date".' },
  { re: /100%\s+client\s+satisfaction/i,
    why: 'UNSOURCED: no such metric is measured. The approved analogue is "100% Job Success Score on Upwork, Top Rated".' },
  { re: /\$10K\+\s*earned|\b17\s+projects\b/i,
    why: 'RETIRED: stale by an order of magnitude against actual lifetime revenue.' },
  { re: /\$\s?0\s+down|\bzero\s+down\b(?!time)|we\s+build\s+it\s+for\s+free|we\s+invest\s+the\s+build\s+cost/i,
    why: 'RETIRED 2026-08-28 with the pricing change. The client pays to start.' },
  { re: /building\s+software\s+at\s+google/i,
    why: 'MISSTATED: the approved wording is "12 years at Google in operations, programs, and product launches".' },
];

/**
 * Week-denominated timeframes, warn-only.
 *
 * The proof bank retires promised delivery timeframes ("We do not quote a timeframe
 * before scoping"). But on this site the distinction needs a human: "From intake to
 * delivery in 1-3 weeks" is a promise, while "the sprint is 2 weeks" is the definition
 * of a productised service. Sorting those is Jeremy's call, tracked as Build Suite
 * work. Deliberately broad -- this list is an INVENTORY, so over-reporting is cheaper
 * than missing one. Move the real promises into BANNED once the copy is settled.
 */
const WARN = [
  { re: /\b[0-9]+(?:\s*(?:to|-|–)\s*[0-9]+)?\s*(?:wk|weeks?)\b/i,
    why: 'Week-denominated timeframe -- delivery promises are retired in the proof bank, pending the copy decision.' },
];

/**
 * Nothing is skipped by content type. Design scratch and unused component variants
 * still get checked: on the BMS repo this exact class of bug reached production
 * through a directory its pricing guard had been told to ignore.
 */
const SKIP_DIRS = new Set(['_archive', 'node_modules']);
const SKIP_FILES = new Set();

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name), out);
    } else if (/\.(astro|ts|tsx|md|mdx)$/.test(e.name)) {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

/**
 * Blank out comment spans while preserving line numbers, so a comment that
 * *documents* a retired claim does not trip the guard.
 */
function stripComments(text) {
  return text.replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

const violations = [];
const warnings = [];
// public/llms.txt is outward-facing and is the page AI crawlers read first, so it
// gets the same check as src/.
const LLMS = path.join(ROOT, 'public', 'llms.txt');
const files = [...walk(SRC), ...(fs.existsSync(LLMS) ? [LLMS] : [])];

for (const file of files) {
  const rel = file.startsWith(SRC + path.sep) ? path.relative(SRC, file) : path.relative(ROOT, file);
  if (SKIP_FILES.has(rel)) continue;
  const lines = stripComments(fs.readFileSync(file, 'utf8')).split('\n');

  lines.forEach((line, i) => {
    if (/^\s*\/\//.test(line)) return; // single-line comments may discuss retired claims
    for (const { re, why } of BANNED) {
      if (re.test(line)) violations.push({ rel, line: i + 1, why, text: line.trim().slice(0, 110) });
    }
    for (const { re, why } of WARN) {
      if (re.test(line)) warnings.push({ rel, line: i + 1, why, text: line.trim().slice(0, 110) });
    }
  });
}

if (warnings.length) {
  console.warn(`\n  claims guard — ${warnings.length} week-denominated timeframe(s), warn-only:\n`);
  for (const w of warnings) console.warn(`  ${w.rel}:${w.line}  ${w.text}`);
  console.warn('');
}

if (violations.length) {
  console.error('\n  CLAIMS GUARD FAILED — retired or unsourced claims found\n');
  for (const v of violations) {
    console.error(`  ${v.rel}:${v.line}`);
    console.error(`     ${v.text}`);
    console.error(`     ${v.why}\n`);
  }
  console.error('  Every outward claim must trace to proof/proof-points.md in BWJ-Marketing.');
  console.error('  If a claim was just approved there, update BANNED in scripts/check-claims.mjs.\n');
  process.exit(1);
}

console.log(`  claims guard OK — ${BANNED.length} retired claims checked across ${files.length} files`);
