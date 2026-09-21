/*
  Make the Angular demos ship the data they read.

  836 of the 863 angular.json files declare "assets": [], so nothing in
  src/assets is copied into the build. 151 demos fetch a data file from there at
  runtime - the file is sitting in the demo folder, it just never reaches the
  output - so the widget loads empty. In the chart demos the failed request then
  wedges the page: nothing further runs, not even a timer.

  This sets the standard Angular assets glob on every demo that has a src/assets
  folder:

      "assets": [{ "glob": "**\/*", "input": "src/assets", "output": "assets" }]

  Usage
    node scripts/fix-angular-assets.js --dry-run
    node scripts/fix-angular-assets.js

  No dependencies beyond Node.js. Idempotent.
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'demos', 'Angular');
const DRY = process.argv.includes('--dry-run');

const ENTRY = { glob: '**/*', input: 'src/assets', output: 'assets' };

const fixed = [];
const skipped = [];

for (const w of fs.readdirSync(BASE, { withFileTypes: true })) {
    if (!w.isDirectory() || ['node_modules', 'sampledata'].includes(w.name)) continue;
    for (const d of fs.readdirSync(path.join(BASE, w.name), { withFileTypes: true })) {
        if (!d.isDirectory()) continue;
        const dir = path.join(BASE, w.name, d.name);
        const file = path.join(dir, 'angular.json');
        if (!fs.existsSync(file)) continue;
        if (!fs.existsSync(path.join(dir, 'src', 'assets'))) continue;

        let json;
        const raw = fs.readFileSync(file, 'utf8');
        try { json = JSON.parse(raw); } catch (e) { skipped.push(w.name + '/' + d.name + ': unparseable angular.json'); continue; }

        const project = json.projects && json.projects[Object.keys(json.projects)[0]];
        const options = project && project.architect && project.architect.build && project.architect.build.options;
        if (!options) { skipped.push(w.name + '/' + d.name + ': no build options'); continue; }

        const current = options.assets;
        const alreadyThere = Array.isArray(current) && current.some(a =>
            a === 'src/assets' || (a && a.input === 'src/assets'));
        if (alreadyThere) continue;

        options.assets = [ENTRY];
        const indent = (raw.match(/\n(\s+)"/) || [, '  '])[1].length;
        if (!DRY) fs.writeFileSync(file, JSON.stringify(json, null, indent) + '\n');
        fixed.push(w.name + '/' + d.name);
    }
}

console.log(`${fixed.length} angular.json files now copy src/assets${DRY ? '   (dry run, nothing written)' : ''}`);
for (const f of fixed.slice(0, 20)) console.log('  ' + f);
if (fixed.length > 20) console.log(`  … and ${fixed.length - 20} more`);
if (skipped.length) {
    console.log(`\n${skipped.length} needed a look:`);
    for (const s of skipped.slice(0, 10)) console.log('  ! ' + s);
}
