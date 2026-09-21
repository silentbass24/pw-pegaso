/*
  Load the theme the React demos say they use.

  Every React demo's main.tsx imports only jqx.base.css, and then App.tsx sets
  theme="material-purple" on each widget. Without jqx.material-purple.css that is
  a class name pointing at nothing: the widget renders in the bare base look, which
  is not what the demo - or the screenshot on the website - shows. 606 demos.

  For each theme a demo names, this adds the matching stylesheet import right after
  the base one, as long as jqwidgets-scripts ships that theme:

      import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'
      import 'jqwidgets-scripts/jqwidgets/styles/jqx.material-purple.css'

  Usage
    node scripts/fix-react-theme-css.js --dry-run
    node scripts/fix-react-theme-css.js
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'demos', 'React-TSX');
const DRY = process.argv.includes('--dry-run');

// The themes jqwidgets-scripts ships; the SDK's own styles folder has the same set.
const STYLES = [
    path.join(ROOT, 'node_modules', 'jqwidgets-scripts', 'jqwidgets', 'styles'),
    path.join(ROOT, 'jqwidgets', 'styles'),
].find(p => fs.existsSync(p));
const shipped = new Set(fs.readdirSync(STYLES).filter(f => /^jqx\.[a-z-]+\.css$/.test(f)).map(f => f.slice(4, -4)));

const THEME = /\btheme\s*=\s*(?:\{\s*)?['"]([a-z][a-z0-9-]*)['"]/g;
const BASE_IMPORT = /^([ \t]*)import\s+['"]jqwidgets-scripts\/jqwidgets\/styles\/jqx\.base\.css['"];?[ \t]*$/m;

let touched = 0;
const perTheme = new Map();
const unknown = new Map();

for (const w of fs.readdirSync(BASE, { withFileTypes: true })) {
    if (!w.isDirectory() || w.name === 'node_modules') continue;
    for (const d of fs.readdirSync(path.join(BASE, w.name), { withFileTypes: true })) {
        if (!d.isDirectory()) continue;
        const id = w.name + '/' + d.name;
        const src = path.join(BASE, w.name, d.name, 'src');
        const main = path.join(src, 'main.tsx');
        if (!fs.existsSync(main)) continue;

        // every theme any component in the demo names
        const themes = new Set();
        for (const f of fs.readdirSync(src)) {
            if (!/\.tsx?$/.test(f) || f === 'main.tsx') continue;
            for (const m of fs.readFileSync(path.join(src, f), 'utf8').matchAll(THEME)) themes.add(m[1]);
        }
        if (!themes.size) continue;

        let text = fs.readFileSync(main, 'utf8');
        const eol = text.includes('\r\n') ? '\r\n' : '\n';
        const anchor = text.match(BASE_IMPORT);
        if (!anchor) continue;

        const lines = [];
        for (const t of themes) {
            if (t === 'base') continue;
            if (!shipped.has(t)) { unknown.set(t, (unknown.get(t) || 0) + 1); continue; }
            const imp = `import 'jqwidgets-scripts/jqwidgets/styles/jqx.${t}.css'`;
            if (text.includes(imp)) continue;
            lines.push(anchor[1] + imp);
            perTheme.set(t, (perTheme.get(t) || 0) + 1);
        }
        if (!lines.length) continue;

        const at = anchor.index + anchor[0].length;
        text = text.slice(0, at) + eol + lines.join(eol) + text.slice(at);
        touched++;
        if (!DRY) fs.writeFileSync(main, text);
    }
}

console.log(`${touched} demo(s) now load their theme${DRY ? '   (dry run, nothing written)' : ''}`);
for (const [t, n] of [...perTheme.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}x  jqx.${t}.css`);
if (unknown.size) {
    console.log('\nthemes named that jqwidgets-scripts does not ship, left alone:');
    for (const [t, n] of unknown) console.log(`  ${String(n).padStart(4)}x  ${t}`);
}
