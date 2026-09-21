/*
  Stop the Vue demos fetching their sample data generator off the internet.

  210 of the 814 Vue demos load this in index.htm:

      <script src="https://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/generatedata.js"></script>

  generatedata() supplies the rows for most of them, so with no network - on a plane,
  behind a proxy, on a build agent, or simply after that URL moves - the demo throws
  "generatedata is not defined" and renders nothing. The SDK already ships the same
  file at demos/sampledata/generatedata.js.

  This copies it next to each demo that needs it and points index.htm at the copy.

  Usage
    node scripts/fix-vue-generatedata.js --dry-run
    node scripts/fix-vue-generatedata.js
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'demos', 'Vue.js');
const DRY = process.argv.includes('--dry-run');

const SOURCE = [
    path.join(ROOT, 'demos', 'sampledata', 'generatedata.js'),
    path.join(ROOT, 'demos', 'Angular', 'sampledata', 'generatedata.js'),
].find(p => fs.existsSync(p));
if (!SOURCE) { console.error('no local generatedata.js in the SDK'); process.exit(1); }

const REMOTE = /<script\s+src="https?:\/\/[^"]*\/generatedata\.js"\s*>\s*<\/script>/gi;

let touched = 0;

for (const w of fs.readdirSync(BASE, { withFileTypes: true })) {
    if (!w.isDirectory() || ['node_modules', 'temp'].includes(w.name)) continue;
    for (const d of fs.readdirSync(path.join(BASE, w.name), { withFileTypes: true })) {
        if (!d.isDirectory()) continue;
        const dir = path.join(BASE, w.name, d.name);
        const htm = path.join(dir, 'index.htm');
        if (!fs.existsSync(htm)) continue;

        const before = fs.readFileSync(htm, 'utf8');
        const after = before.replace(REMOTE, '<script src="generatedata.js"></script>');
        if (after === before) continue;

        if (!DRY) {
            fs.copyFileSync(SOURCE, path.join(dir, 'generatedata.js'));
            fs.writeFileSync(htm, after);
        }
        touched++;
        console.log('  ' + w.name + '/' + d.name);
    }
}

console.log(`\n${touched} demo(s) now load generatedata.js locally${DRY ? '   (dry run, nothing written)' : ''}`);
