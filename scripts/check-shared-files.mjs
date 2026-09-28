#!/usr/bin/env node
/**
 * Shared-file drift check: buildwithjeremy-website <-> buildmysystem-website.
 *
 * The files in SHARED are byte-identical in both repos by design. The canonical
 * copy lives in buildwithjeremy-website; buildmysystem-website vendors it.
 * Edit there, copy here, run this. See docs/design-system.md in
 * buildwithjeremy-website.
 *
 * Looks for the sibling repo next to this one (../<sibling>), or at
 * SHARED_SIBLING_DIR if set. Warns on drift and always exits 0: this is a
 * nudge for humans and agents, not a build gate (CI and Vercel only ever
 * have one repo checked out).
 *
 * Run: npm run check:shared
 * This file is itself shared and must stay identical in both repos.
 */
import fs from 'node:fs';
import path from 'node:path';

const SHARED = ['src/styles/tokens.css', 'scripts/check-shared-files.mjs'];
const REPOS = ['buildwithjeremy-website', 'buildmysystem-website'];
const CANONICAL = 'buildwithjeremy-website';

const ROOT = path.resolve(import.meta.dirname, '..');
const pkgName = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).name;
const self = pkgName === 'build-my-system' ? 'buildmysystem-website' : 'buildwithjeremy-website';
const sibling = REPOS.find((r) => r !== self);
const siblingDir = process.env.SHARED_SIBLING_DIR
  ? path.resolve(process.env.SHARED_SIBLING_DIR)
  : path.resolve(ROOT, '..', sibling);

if (!fs.existsSync(path.join(siblingDir, 'package.json'))) {
  console.warn(`check:shared: sibling repo not found at ${siblingDir}; skipped.`);
  console.warn(`  Clone ${sibling} next to this repo, or set SHARED_SIBLING_DIR.`);
  process.exit(0);
}

let drift = 0;
for (const rel of SHARED) {
  const mine = path.join(ROOT, rel);
  const theirs = path.join(siblingDir, rel);
  const a = fs.existsSync(mine) ? fs.readFileSync(mine) : null;
  const b = fs.existsSync(theirs) ? fs.readFileSync(theirs) : null;
  if (a && b && a.equals(b)) {
    console.log(`  ok     ${rel}`);
    continue;
  }
  drift++;
  const why = !a ? 'missing here' : !b ? `missing in ${sibling}` : 'differs';
  console.warn(`  DRIFT  ${rel} (${why})`);
}

if (drift) {
  console.warn(
    `\ncheck:shared: ${drift} shared file(s) out of sync with ${siblingDir}.\n` +
      `  Canonical copy is ${CANONICAL}. Make the edit there, copy the file to the\n` +
      `  other repo, and ship both. If the sibling clone is just behind, pull it first.`,
  );
} else {
  console.log(`check:shared: all ${SHARED.length} shared files match ${sibling}.`);
}
process.exit(0);
