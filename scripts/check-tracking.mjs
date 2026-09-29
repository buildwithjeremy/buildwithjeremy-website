#!/usr/bin/env node
/**
 * GA4 tracking contract check. Runs after every build (postbuild).
 *
 * WHY THIS EXISTS
 * Click tracking is declarative: an element carries data-track="<event>" plus
 * data-track-<param>="<value>" attributes, and one delegated listener in
 * src/components/GoogleAnalytics.astro sends them to GA4. That survives copy and
 * layout changes, but a page rewrite can silently drop or rename a tag. This
 * script reads the contract in src/config/tracking.mjs and the BUILT html in
 * dist/, and fails the build when:
 *   1. a page the contract lists has fewer tagged elements than expected,
 *   2. a data-track value in the html is not an event in the contract,
 *   3. a data-track-* param is not declared for that event, or its value is
 *      not in the allowed list, or a required param is missing,
 *   4. a scroll-depth page in the contract was not built.
 *
 * Everything is checked against dist/, so elements rendered client-side are
 * invisible here. None exist today; if you add one, render it server-side or
 * extend this script with a source check (see docs/tracking.md).
 *
 * Run: npm run check:tracking   (also runs automatically via postbuild)
 * This file is shared and must stay identical in buildwithjeremy-website and
 * buildmysystem-website (npm run check:shared).
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const { TRACKING } = await import(pathToFileURL(path.join(ROOT, 'src', 'config', 'tracking.mjs')).href);

const OUT = [path.join(ROOT, 'dist', 'client'), path.join(ROOT, 'dist')].find((d) =>
  fs.existsSync(path.join(d, 'index.html')),
);
if (!OUT) {
  console.error('check-tracking: no built index.html in dist/. Run `npm run build` first.');
  process.exit(1);
}

// ── Collect built pages: route -> html ──
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith('.html') ? [p] : [];
  });
const norm = (route) => (route.replace(/\/+$/, '') || '/');
const pages = new Map();
for (const file of walk(OUT)) {
  let rel = path.relative(OUT, file).split(path.sep).join('/');
  rel = rel.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
  pages.set(norm('/' + rel), fs.readFileSync(file, 'utf8'));
}

// ── Parse tagged elements ──
const TAG = /<([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/g;
const ATTR = /([^\s=/]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/g;
function taggedElements(html) {
  const body = html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '');
  const out = [];
  for (const m of body.matchAll(TAG)) {
    if (!/\bdata-track/.test(m[2])) continue;
    const attrs = {};
    for (const a of m[2].matchAll(ATTR)) {
      const v = a[2] ?? '';
      attrs[a[1].toLowerCase()] = v.replace(/^["']|["']$/g, '');
    }
    const params = {};
    for (const [k, v] of Object.entries(attrs)) {
      if (k.startsWith('data-track-')) params[k.slice('data-track-'.length).replace(/-/g, '_')] = v;
    }
    out.push({ tag: m[1], event: attrs['data-track'], params, snippet: m[0].slice(0, 140) });
  }
  return out;
}

const events = new Map(TRACKING.events.map((e) => [e.name, e]));
const errors = [];
const fix = (event) => `Fix: add the data-track="${event}" attributes back to that element, or update src/config/tracking.mjs if the change is intentional (see docs/tracking.md).`;

// ── Rules 2 + 3: every tag in every page is valid ──
const found = new Map(); // route -> elements
for (const [route, html] of pages) {
  const els = taggedElements(html);
  found.set(route, els);
  for (const el of els) {
    const ev = el.event === undefined ? undefined : events.get(el.event);
    if (!el.event) {
      errors.push(`${route}: element has data-track-* params but no data-track event: ${el.snippet}`);
      continue;
    }
    if (!ev) {
      errors.push(`${route}: data-track="${el.event}" is not an event in src/config/tracking.mjs. Add it to the contract or fix the name. ${el.snippet}`);
      continue;
    }
    for (const [param, value] of Object.entries(el.params)) {
      const spec = ev.params?.[param];
      if (!spec) {
        errors.push(`${route}: event "${el.event}" has undeclared param "${param}". Declare it in src/config/tracking.mjs or remove data-track-${param.replace(/_/g, '-')}.`);
      } else if (spec.values && !spec.values.includes(value)) {
        errors.push(`${route}: event "${el.event}" param ${param}="${value}" is not allowed. Allowed: ${spec.values.join(', ')}. Update the tag or the contract.`);
      }
    }
    for (const [param, spec] of Object.entries(ev.params ?? {})) {
      if (spec.auto || param in el.params) continue;
      const req = spec.required === true ||
        (spec.requiredWhen && Object.entries(spec.requiredWhen).every(([k, v]) => [].concat(v).includes(el.params[k])));
      if (req) errors.push(`${route}: event "${el.event}" is missing required param data-track-${param.replace(/_/g, '-')}. ${el.snippet}`);
    }
  }
}

// ── Rule 1: expectations ──
const routesFor = (pattern) => {
  if (pattern.endsWith('/*')) {
    const prefix = norm(pattern.slice(0, -2)) + '/';
    return [...pages.keys()].filter((r) => r.startsWith(prefix));
  }
  return pages.has(norm(pattern)) ? [norm(pattern)] : [];
};
let checked = 0;
for (const ev of TRACKING.events) {
  for (const exp of ev.expect ?? []) {
    const routes = routesFor(exp.page).filter((r) => !(exp.except ?? []).map(norm).includes(r));
    if (routes.length === 0) {
      errors.push(`Contract lists page "${exp.page}" for event "${ev.name}", but no such page was built. If the page moved or was removed, update src/config/tracking.mjs.`);
      continue;
    }
    for (const route of routes) {
      const mine = found.get(route).filter((el) =>
        el.event === ev.name && Object.entries(exp.where ?? {}).every(([k, v]) => el.params[k] === v));
      const whereLabel = Object.entries(exp.where ?? {}).map(([k, v]) => `data-track-${k.replace(/_/g, '-')}="${v}"`);
      const groups = exp.each
        ? ev.params[exp.each].values.map((v) => [
            [...whereLabel, `data-track-${exp.each.replace(/_/g, '-')}="${v}"`].join(' '),
            mine.filter((el) => el.params[exp.each] === v),
          ])
        : [[whereLabel.join(' '), mine]];
      for (const [label, els] of groups) {
        checked++;
        const min = exp.min ?? 1;
        if (els.length < min) {
          errors.push(`${route}: expected at least ${min} element(s) tagged data-track="${ev.name}"${label ? ' with ' + label : ''}, found ${els.length}. ${fix(ev.name)}`);
        }
      }
    }
  }
}

// ── Rule 4: scroll-depth pages exist ──
for (const page of TRACKING.scrollDepth?.pages ?? []) {
  if (!pages.has(norm(page))) {
    errors.push(`Contract enables scroll_depth on "${page}", but no such page was built. Update scrollDepth.pages in src/config/tracking.mjs.`);
  }
}

if (errors.length) {
  console.error(`\ncheck-tracking: FAILED (${errors.length} problem${errors.length === 1 ? '' : 's'})`);
  for (const e of errors) console.error('  - ' + e);
  console.error('');
  process.exit(1);
}
const total = [...found.values()].reduce((n, els) => n + els.length, 0);
console.log(`check-tracking: OK. ${total} tagged elements across ${pages.size} pages; ${checked} expectations met.`);
