/*
  Remove the create-react-app files the Vite migration left behind.

  Every React demo still carries four files from its create-react-app days, none
  of which Vite ever reads:

    src/index.tsx          the old entry - calls ReactDOM.render, which React 19 removed
    src/serviceWorker.ts   only index.tsx imported it
    src/react-app-env.d.ts  /// <reference types="react-scripts" /> - not installed
    src/App.test.tsx       ReactDOM.render again, for a jest that is not installed

  vite build ignores them, so the demos build. tsc does not ignore them: tsconfig
  includes all of src, @types/react-dom 19 has no `render`, and there is no
  `react-scripts` to reference - so type-checking any React demo fails before it
  reaches the demo's own code. That is the gate the plan asks for, and these files
  make it impossible.

  This deletes the four (index.tsx only when it is the create-react-app one, not a
  real entry point) and drops the `"test": "jest"` script and @types/jest along
  with them.

  Usage
    node scripts/fix-react-cra-leftovers.js --dry-run
    node scripts/fix-react-cra-leftovers.js
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'demos', 'React-TSX');
const DRY = process.argv.includes('--dry-run');

let demos = 0, files = 0, scripts = 0;

for (const w of fs.readdirSync(BASE, { withFileTypes: true })) {
    if (!w.isDirectory() || w.name === 'node_modules') continue;
    for (const d of fs.readdirSync(path.join(BASE, w.name), { withFileTypes: true })) {
        if (!d.isDirectory()) continue;
        const dir = path.join(BASE, w.name, d.name);
        const src = path.join(dir, 'src');
        if (!fs.existsSync(path.join(src, 'main.tsx'))) continue;     // not a Vite project; leave it

        let removed = 0;
        const gone = [];
        for (const name of ['serviceWorker.ts', 'react-app-env.d.ts', 'App.test.tsx']) {
            const p = path.join(src, name);
            if (!fs.existsSync(p)) continue;
            if (!DRY) fs.unlinkSync(p);
            removed++; gone.push(name);
        }
        const index = path.join(src, 'index.tsx');
        if (fs.existsSync(index) && /serviceWorker|ReactDOM\.render\(/.test(fs.readFileSync(index, 'utf8'))) {
            if (!DRY) fs.unlinkSync(index);
            removed++; gone.push('index.tsx');
        }

        const pkgPath = path.join(dir, 'package.json');
        if (fs.existsSync(pkgPath)) {
            const raw = fs.readFileSync(pkgPath, 'utf8');
            let pkg;
            try { pkg = JSON.parse(raw); } catch (e) { pkg = null; }
            if (pkg) {
                let changed = false;
                if (pkg.scripts && pkg.scripts.test === 'jest') { delete pkg.scripts.test; changed = true; }
                for (const k of ['devDependencies', 'dependencies']) {
                    if (pkg[k] && pkg[k]['@types/jest']) { delete pkg[k]['@types/jest']; changed = true; }
                }
                if (changed) {
                    const indent = (raw.match(/\n(\s+)"/) || [, '  '])[1];
                    if (!DRY) fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, indent) + '\n');
                    scripts++;
                }
            }
        }

        if (removed) { demos++; files += removed; }
    }
}

console.log(`${files} file(s) removed from ${demos} demo(s); jest script dropped from ${scripts}${DRY ? '   (dry run, nothing written)' : ''}`);
