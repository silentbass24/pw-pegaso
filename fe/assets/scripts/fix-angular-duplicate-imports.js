/*
  Drop repeated names from the demos' import statements.

  TypeScript rejects the same name being imported twice (TS2300: Duplicate
  identifier), and the demos collected duplicates two ways: within one statement
  ("import { jqxScrollBarModule, jqxScrollBarComponent, jqxScrollBarModule }") and
  across two statements that pull the same symbol from the same module.

  Only an exact same-name-same-module repeat is removed. A name imported from two
  DIFFERENT modules is a real conflict that needs a human, so it is reported and
  left alone.

  Usage
    node scripts/fix-angular-duplicate-imports.js --dry-run
    node scripts/fix-angular-duplicate-imports.js
    node scripts/fix-angular-duplicate-imports.js --base demos/React
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const BASE = path.resolve(ROOT, arg('base', 'demos/Angular'));
const DRY = argv.includes('--dry-run');

// A named-import statement, captured line by line so the file's layout survives.
const IMPORT = /^([ \t]*)import\s*\{([^}]*)\}\s*from\s*(['"])([^'"]+)\3\s*;?[ \t]*$/;

let touched = 0, removed = 0;
const conflicts = [];

function walk(dir, out) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name === 'node_modules' || e.name === 'dist') continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, out);
        else if (/\.tsx?$/.test(e.name)) out.push(p);
    }
    return out;
}

for (const file of walk(BASE, [])) {
    const src = fs.readFileSync(file, 'utf8');
    const eol = src.includes('\r\n') ? '\r\n' : '\n';
    const lines = src.split(/\r?\n/);
    const seen = new Map();            // imported name -> module it came from
    let changed = false;

    for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(IMPORT);
        if (!m) continue;
        const [, indent, body, q, mod] = m;

        const kept = [];
        for (const raw of body.split(',')) {
            const spec = raw.trim();
            if (!spec) continue;
            // "X as Y" binds Y; that is the name that can collide.
            const bound = (spec.split(/\s+as\s+/)[1] || spec).trim();
            if (!seen.has(bound)) { seen.set(bound, mod); kept.push(spec); continue; }
            if (seen.get(bound) === mod) { removed++; changed = true; continue; }   // exact repeat
            conflicts.push(`${path.relative(ROOT, file)}: ${bound} from both ${seen.get(bound)} and ${mod}`);
            kept.push(spec);
        }

        // Every name was a repeat: the statement itself is redundant.
        lines[i] = kept.length
            ? `${indent}import { ${kept.join(', ')} } from ${q}${mod}${q};`
            : null;
    }

    if (!changed) continue;
    touched++;
    if (!DRY) fs.writeFileSync(file, lines.filter(l => l !== null).join(eol));
    console.log('  ' + path.relative(ROOT, file).split(path.sep).join('/'));
}

console.log(`\n${removed} duplicate import(s) removed from ${touched} file(s)${DRY ? '   (dry run, nothing written)' : ''}`);
if (conflicts.length) {
    console.log(`\n${conflicts.length} same name from two different modules - left for a human:`);
    for (const c of conflicts.slice(0, 20)) console.log('  ! ' + c);
}
