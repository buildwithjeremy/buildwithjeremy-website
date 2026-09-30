#!/usr/bin/env node
/**
 * GA4 tracking contract check. Runs after every build (postbuild).
 *
 * WHY THIS EXISTS
 * Every GA4 event the site sends is listed in src/config/tracking.mjs. Each
 * event has a type that says how it fires and what the build can verify:
 *
 *   click         An element carries data-track="<event>" (a space-separated
 *                 list is allowed, e.g. "offer_interest cta_click") plus
 *                 data-track-<param>="<value>" attributes. The delegated
 *                 listener in src/components/GoogleAnalytics.astro sends it.
 *                 Checked: tags on built pages, params, expectations.
 *   programmatic  Fired in code (form submit, button handler, page load).
 *                 The contract names the source file and, when the code hangs
 *                 off an element, a marker attribute such as
 *                 data-track-form="quote_lead". Checked: the marker exists on
 *                 the expected pages, the source file names the event and
 *                 looks the element up by the marker ([data-track-form="..."]).
 *   embed         Fired from a third-party embed's postMessage (Calendly).
 *                 Checked: the embed container marker (data-track-embed) is on
 *                 the expected pages and the handler's code marker is in the
 *                 GA script.
 *   auto          Rule-based on every page (any outbound link, any mailto).
 *                 Checked: the rule's code marker is in the GA script.
 *
 * It also scans src/ for gtag('event', '<name>') calls and fails on any name
 * the contract does not list, so an undeclared event cannot be added quietly.
 *
 * Everything page-related is checked against dist/, so elements rendered
 * client-side are invisible here. None exist today; if you add one, render it
 * server-side or extend this script (see docs/tracking.md).
 *
 * Run: npm run check:tracking   (also runs automatically via postbuild)
 * This file is shared and must stay identical in buildwithjeremy-website and
 * buildmysystem-website (npm run check:shared).
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTRACT = 'src/config/tracking.mjs';
const GA_COMPONENT = 'src/components/GoogleAnalytics.astro';
const { TRACKING } = await import(pathToFileURL(path.join(ROOT, CONTRACT)).href);

const OUT = [path.join(ROOT, 'dist', 'client'), path.join(ROOT, 'dist')].find((d) =>
  fs.existsSync(path.join(d, 'index.html')),
);
if (!OUT) {
  console.error('check-tracking: no built index.html in dist/. Run `npm run build` first.');
  process.exit(1);
}

// ── Collect built pages: route -> html ──
const walk = (dir, keep) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p, keep) : keep(e.name) ? [p] : [];
  });
const norm = (route) => (route.replace(/\/+$/, '') || '/');
const pages = new Map();
for (const file of walk(OUT, (n) => n.endsWith('.html'))) {
  let rel = path.relative(OUT, file).split(path.sep).join('/');
  rel = rel.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
  pages.set(norm('/' + rel), fs.readFileSync(file, 'utf8'));
}

// ── Parse elements that carry data-track* attributes ──
const MARKERS = ['data-track-form', 'data-track-embed', 'data-track-source'];
const TAG = /<([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/g;
const ATTR = /([^\s=/]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/g;
function trackedElements(html) {
  const body = html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '');
  const out = [];
  for (const m of body.matchAll(TAG)) {
    if (!/\bdata-track/.test(m[2])) continue;
    const attrs = {};
    for (const a of m[2].matchAll(ATTR)) {
      attrs[a[1].toLowerCase()] = (a[2] ?? '').replace(/^["']|["']$/g, '');
    }
    const params = {};
    const markers = {};
    for (const [k, v] of Object.entries(attrs)) {
      if (MARKERS.includes(k)) markers[k] = v;
      else if (k.startsWith('data-track-')) params[k.slice('data-track-'.length).replace(/-/g, '_')] = v;
    }
    const names = 'data-track' in attrs ? attrs['data-track'].split(/\s+/).filter(Boolean) : [];
    out.push({ tag: m[1], names, params, markers, hasTrack: 'data-track' in attrs, snippet: m[0].slice(0, 140) });
  }
  return out;
}
const parseMarker = (marker) => {
  const m = /^([\w-]+)="([^"]*)"$/.exec(marker ?? '');
  return m ? { attr: m[1], value: m[2] } : null;
};

const typeOf = (ev) => ev.type ?? 'click';
const events = new Map(); // name -> entry, preferring the click entry when a name repeats
for (const e of TRACKING.events) if (!events.has(e.name) || typeOf(e) === 'click') events.set(e.name, e);
const errors = [];
const fix = (event) => `Fix: add the data-track="${event}" attribute back to that element, or update ${CONTRACT} if the change is intentional (see docs/tracking.md).`;

// ── Contract sanity ──
// A name may appear more than once only when it is sent in more than one way
// (e.g. generate_lead from a form and from Calendly); click events must be unique.
const clickNames = TRACKING.events.filter((e) => typeOf(e) === 'click').map((e) => e.name);
for (const name of new Set(clickNames)) {
  if (TRACKING.events.filter((e) => e.name === name).length > 1) errors.push(`${CONTRACT}: click event "${name}" is listed more than once. Merge the entries.`);
}
for (const ev of TRACKING.events) {
  const t = typeOf(ev);
  if (!['click', 'programmatic', 'embed', 'auto'].includes(t)) errors.push(`${CONTRACT}: event "${ev.name}" has unknown type "${t}".`);
  if ((t === 'programmatic' || t === 'embed') && ev.marker && !parseMarker(ev.marker)) {
    errors.push(`${CONTRACT}: event "${ev.name}" marker must look like data-track-form="id", got ${ev.marker}.`);
  }
  if (t === 'programmatic' && !ev.source) errors.push(`${CONTRACT}: programmatic event "${ev.name}" needs a source file.`);
  if ((t === 'auto' || t === 'embed') && !ev.codeMarker) errors.push(`${CONTRACT}: ${t} event "${ev.name}" needs a codeMarker.`);
}

// ── Click tags on every page are valid ──
const found = new Map(); // route -> elements
for (const [route, html] of pages) {
  const els = trackedElements(html);
  found.set(route, els);
  for (const el of els) {
    if (!el.hasTrack) {
      if (Object.keys(el.params).length) errors.push(`${route}: element has data-track-* params but no data-track event: ${el.snippet}`);
      continue;
    }
    if (el.names.length === 0) {
      errors.push(`${route}: empty data-track attribute: ${el.snippet}`);
      continue;
    }
    const evs = [];
    for (const name of el.names) {
      const ev = events.get(name);
      if (!ev) errors.push(`${route}: data-track="${name}" is not an event in ${CONTRACT}. Add it to the contract or fix the name. ${el.snippet}`);
      else if (typeOf(ev) !== 'click') errors.push(`${route}: data-track="${name}" is a ${typeOf(ev)} event, not a click event. Use its marker attribute instead (see docs/tracking.md). ${el.snippet}`);
      else evs.push(ev);
    }
    for (const [param, value] of Object.entries(el.params)) {
      const owners = evs.filter((ev) => ev.params?.[param]);
      if (owners.length === 0) {
        errors.push(`${route}: data-track="${el.names.join(' ')}" has undeclared param "${param}". Declare it in ${CONTRACT} or remove data-track-${param.replace(/_/g, '-')}.`);
        continue;
      }
      for (const ev of owners) {
        const spec = ev.params[param];
        if (spec.values && !spec.values.includes(value)) {
          errors.push(`${route}: event "${ev.name}" param ${param}="${value}" is not allowed. Allowed: ${spec.values.join(', ')}. Update the tag or the contract.`);
        }
      }
    }
    for (const ev of evs) {
      for (const [param, spec] of Object.entries(ev.params ?? {})) {
        if (spec.auto || param in el.params) continue;
        const req = spec.required === true ||
          (spec.requiredWhen && Object.entries(spec.requiredWhen).every(([k, v]) => [].concat(v).includes(el.params[k])));
        if (req) errors.push(`${route}: event "${ev.name}" is missing required param data-track-${param.replace(/_/g, '-')}. ${el.snippet}`);
      }
    }
  }
}

// ── Expectations ──
const routesFor = (pattern) => {
  if (pattern === '*') return [...pages.keys()];
  if (pattern.endsWith('/*')) {
    const prefix = norm(pattern.slice(0, -2)) + '/';
    return [...pages.keys()].filter((r) => r.startsWith(prefix));
  }
  return pages.has(norm(pattern)) ? [norm(pattern)] : [];
};
let checked = 0;
for (const ev of TRACKING.events) {
  const t = typeOf(ev);
  const marker = parseMarker(ev.marker);
  for (const exp of ev.expect ?? []) {
    const routes = routesFor(exp.page).filter((r) => !(exp.except ?? []).map(norm).includes(r));
    if (routes.length === 0) {
      errors.push(`Contract lists page "${exp.page}" for event "${ev.name}", but no such page was built. If the page moved or was removed, update ${CONTRACT}.`);
      continue;
    }
    for (const route of routes) {
      checked++;
      const min = exp.min ?? 1;
      if (t === 'programmatic' || t === 'embed') {
        if (!marker) continue; // page-exists only
        const n = found.get(route).filter((el) => el.markers[marker.attr] === marker.value).length;
        if (n < min) {
          errors.push(`${route}: event "${ev.name}" (${t}) needs an element with ${ev.marker} on this page, found ${n}. The code that sends it looks the element up by that attribute, so without it the event never fires. Put the attribute back, or update ${CONTRACT} if the change is intentional.`);
        }
        continue;
      }
      if (t !== 'click') continue;
      checked--;
      const mine = found.get(route).filter((el) =>
        el.names.includes(ev.name) && Object.entries(exp.where ?? {}).every(([k, v]) => el.params[k] === v));
      const whereLabel = Object.entries(exp.where ?? {}).map(([k, v]) => `data-track-${k.replace(/_/g, '-')}="${v}"`);
      const groups = exp.each
        ? ev.params[exp.each].values.map((v) => [
            [...whereLabel, `data-track-${exp.each.replace(/_/g, '-')}="${v}"`].join(' '),
            mine.filter((el) => el.params[exp.each] === v),
          ])
        : [[whereLabel.join(' '), mine]];
      for (const [label, els] of groups) {
        checked++;
        if (els.length < min) {
          errors.push(`${route}: expected at least ${min} element(s) tagged data-track="${ev.name}"${label ? ' with ' + label : ''}, found ${els.length}. ${fix(ev.name)}`);
        }
      }
    }
  }
}

// ── Scroll-depth pages exist ──
for (const page of TRACKING.scrollDepth?.pages ?? []) {
  if (!pages.has(norm(page))) {
    errors.push(`Contract enables scroll_depth on "${page}", but no such page was built. Update scrollDepth.pages in ${CONTRACT}.`);
  }
}

// ── Code markers for embed and auto events: in the built GA script ──
const GA_SCRIPT = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
const indexHtml = pages.get('/') ?? '';
const builtGa = [...indexHtml.matchAll(GA_SCRIPT)].map((m) => m[1]).find((s) => s.includes("gtag('config'"));
const gaSource = builtGa ?? fs.readFileSync(path.join(ROOT, GA_COMPONENT), 'utf8');
const gaWhere = builtGa ? 'the built GA script on /' : `${GA_COMPONENT} (no GA script in the build; set PUBLIC_GA4_ID to check the built one)`;
for (const ev of TRACKING.events) {
  if (!['auto', 'embed'].includes(typeOf(ev)) || !ev.codeMarker) continue;
  checked++;
  if (!gaSource.includes(ev.codeMarker)) {
    errors.push(`Event "${ev.name}" (${typeOf(ev)}): code marker ${JSON.stringify(ev.codeMarker)} not found in ${gaWhere}. The rule that sends it was changed or removed. Restore it, or update codeMarker in ${CONTRACT}.`);
  }
}

// ── Programmatic events: the source file sends the event and looks up its marker ──
for (const ev of TRACKING.events) {
  if (typeOf(ev) !== 'programmatic' || !ev.source) continue;
  for (const source of [].concat(ev.source)) {
    checked++;
    const file = path.join(ROOT, source);
    if (!fs.existsSync(file)) {
      errors.push(`Event "${ev.name}": source file ${source} does not exist. Update source in ${CONTRACT}.`);
      continue;
    }
    const code = fs.readFileSync(file, 'utf8');
    if (!new RegExp(`['"]${ev.name}['"]`).test(code)) {
      errors.push(`Event "${ev.name}": ${source} no longer sends it. Restore the call, or remove the event from ${CONTRACT}.`);
    }
    if (parseMarker(ev.marker) && !code.includes(`[${ev.marker}]`)) {
      errors.push(`Event "${ev.name}": ${source} must find its element by the marker selector [${ev.marker}], not by an id or class. Update the lookup or the marker in ${CONTRACT}.`);
    }
  }
}

// ── Source scan: every gtag('event', ...) name in src/ is in the contract ──
const known = new Set([...events.keys(), TRACKING.scrollDepth?.event].filter(Boolean));
const helpersByFile = new Map();
for (const ev of TRACKING.events) {
  if (!ev.helper) continue;
  for (const source of [].concat(ev.source ?? [])) helpersByFile.set(source, [...(helpersByFile.get(source) ?? []), ev.helper]);
}
const LITERAL = /['"]event['"]\s*,\s*['"]([\w-]+)['"]/g;
const DYNAMIC = /['"]event['"]\s*,\s*(?!['"\s])/g;
let scanned = 0;
for (const file of walk(path.join(ROOT, 'src'), (n) => /\.(astro|[cm]?[jt]sx?)$/.test(n))) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (rel === CONTRACT) continue;
  const code = fs.readFileSync(file, 'utf8');
  if (!/gtag|['"]event['"]\s*,/.test(code)) continue;
  scanned++;
  const lineOf = (i) => code.slice(0, i).split('\n').length;
  for (const m of code.matchAll(LITERAL)) {
    if (!known.has(m[1])) {
      errors.push(`${rel}:${lineOf(m.index)}: gtag event "${m[1]}" is not in ${CONTRACT}. Declare it (usually as a programmatic event) or remove the call.`);
    }
  }
  const helpers = helpersByFile.get(rel) ?? [];
  if (rel !== GA_COMPONENT && [...code.matchAll(DYNAMIC)].length) {
    if (helpers.length === 0) {
      const m = code.match(DYNAMIC);
      errors.push(`${rel}:${lineOf(code.indexOf(m[0]))}: gtag event with a computed name. Use a string literal, or declare the file as a programmatic source with a helper in ${CONTRACT}.`);
    }
    for (const h of helpers) {
      for (const m of code.matchAll(new RegExp(`\\b${h}\\(\\s*['"]([\\w-]+)['"]`, 'g'))) {
        if (!known.has(m[1])) errors.push(`${rel}:${lineOf(m.index)}: event "${m[1]}" sent via ${h}() is not in ${CONTRACT}. Declare it or remove the call.`);
      }
    }
  }
}

if (errors.length) {
  console.error(`\ncheck-tracking: FAILED (${errors.length} problem${errors.length === 1 ? '' : 's'})`);
  for (const e of errors) console.error('  - ' + e);
  console.error('');
  process.exit(1);
}
const total = [...found.values()].reduce((n, els) => n + els.length, 0);
console.log(`check-tracking: OK. ${TRACKING.events.length} events in the contract; ${total} tagged elements across ${pages.size} pages; ${checked} expectations met; ${scanned} source files scanned for gtag events.`);
