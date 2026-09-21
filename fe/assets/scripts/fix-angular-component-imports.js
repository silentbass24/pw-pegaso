/*
  Import the modules a standalone component's `imports:` array refers to.

  Several demos list a module in the @Component `imports` array without importing
  the symbol - `imports: [jqxGridModule, jqxTabsModule]` where only jqxTabsModule
  was ever imported. The identifier is undefined, so Angular reports TS-991010
  ("'imports' must be an array of components, directives, pipes, or NgModules")
  and the demo does not build.

  For each such name this adds an import from the jqwidgets-ng folder that really
  exports it. A name that no package exports and that the file does not define is
  dropped from the array, with a note, since there is nothing it could refer to.

  Usage
    node scripts/fix-angular-component-imports.js --dry-run
    node scripts/fix-angular-component-imports.js
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'demos', 'Angular');
const DRY = process.argv.includes('--dry-run');

const NG = [
    path.join(ROOT, 'node_modules', 'jqwidgets-ng'),
    'C:/jqxng/_tpl/node_modules/jqwidgets-ng',
].find(p => fs.existsSync(p));
if (!NG) { console.error('jqwidgets-ng is not installed anywhere I can see'); process.exit(1); }

const home = new Map();          // exported class -> folder that declares it
for (const d of fs.readdirSync(NG)) {
    const dir = path.join(NG, d);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) {
        if (!f.endsWith('.d.ts')) continue;
        for (const m of fs.readFileSync(path.join(dir, f), 'utf8').matchAll(/export declare class ([A-Za-z0-9_]+)/g))
            home.set(m[1], d);
    }
}

// Angular's own modules that a demo may legitimately list.
const ANGULAR = {
    CommonModule: '@angular/common', NgIf: '@angular/common', NgFor: '@angular/common',
    FormsModule: '@angular/forms', ReactiveFormsModule: '@angular/forms',
    HttpClientModule: '@angular/common/http', RouterModule: '@angular/router',
    BrowserAnimationsModule: '@angular/platform-browser/animations',
};

let touched = 0, added = 0;
const dropped = [];
const unresolved = [];

function walk(dir, out) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name === 'node_modules' || e.name === 'dist') continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, out);
        else if (e.name.endsWith('.ts')) out.push(p);
    }
    return out;
}

for (const file of walk(BASE, [])) {
    let src = fs.readFileSync(file, 'utf8');
    const decorator = src.match(/@Component\s*\(\s*\{[\s\S]*?\n\s*\}\s*\)/);
    if (!decorator) continue;
    const arr = decorator[0].match(/\bimports\s*:\s*\[([^\]]*)\]/);
    if (!arr) continue;

    const listed = arr[1].split(',').map(s => s.trim()).filter(Boolean);
    if (!listed.length) continue;

    // What the file already binds: imports, and its own declarations.
    const bound = new Set();
    for (const m of src.matchAll(/import\s*\{([^}]*)\}\s*from/g))
        for (const raw of m[1].split(',')) {
            const spec = raw.trim();
            if (spec) bound.add((spec.split(/\s+as\s+/)[1] || spec).trim());
        }
    for (const m of src.matchAll(/^\s*(?:export\s+)?(?:class|const|let|var|function)\s+([A-Za-z0-9_$]+)/gm))
        bound.add(m[1]);

    const missing = listed.filter(n => /^[A-Za-z_$][\w$]*$/.test(n) && !bound.has(n));
    if (!missing.length) continue;

    const eol = src.includes('\r\n') ? '\r\n' : '\n';
    const byModule = new Map();
    const nowhere = [];
    for (const name of missing) {
        const mod = home.has(name) ? 'jqwidgets-ng/' + home.get(name) : ANGULAR[name];
        if (!mod) { nowhere.push(name); continue; }
        if (!byModule.has(mod)) byModule.set(mod, []);
        byModule.get(mod).push(name);
    }

    const id = path.relative(BASE, file).split(path.sep).slice(0, 2).join('/');

    if (byModule.size) {
        const block = [...byModule.entries()]
            .map(([mod, names]) => `import { ${names.join(', ')} } from '${mod}';`)
            .join(eol);
        // after the last existing import, so the file keeps its shape
        const imports = [...src.matchAll(/^[ \t]*import[\s{][^\n]*$/gm)];
        if (imports.length) {
            const last = imports[imports.length - 1];
            const at = last.index + last[0].length;
            src = src.slice(0, at) + eol + block + src.slice(at);
        } else {
            src = block + eol + src;
        }
        added += missing.length - nowhere.length;
    }

    if (nowhere.length) {
        // Nothing exports these, so leaving them in keeps the build broken.
        const kept = listed.filter(n => !nowhere.includes(n));
        src = src.replace(arr[0], `imports: [${kept.join(', ')}]`);
        dropped.push(`${id}: ${nowhere.join(', ')}`);
        unresolved.push(...nowhere);
    }

    touched++;
    if (!DRY) fs.writeFileSync(file, src);
    console.log(`  ${id}  +[${missing.filter(n => !nowhere.includes(n)).join(', ')}]${nowhere.length ? '  dropped [' + nowhere.join(', ') + ']' : ''}`);
}

console.log(`\n${added} import(s) added across ${touched} demo(s)${DRY ? '   (dry run, nothing written)' : ''}`);
if (dropped.length) {
    console.log(`\n${dropped.length} demo(s) listed a module nothing exports - dropped from the array:`);
    for (const d of dropped.slice(0, 20)) console.log('  ! ' + d);
}
