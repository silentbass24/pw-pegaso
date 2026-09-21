/*
  Align every framework demo with the jQWidgets version this SDK ships.

  What it does
    Angular  package.json -> "jqwidgets-ng": "^<v>"
             + global typings wired in, because jqwidgets-ng's component typings
               reference the `jqwidgets` namespace and the `jqx` global, which the
               package does not pull in through its own types entry.
             + demos left on an older Angular are lifted to the Angular 19
               toolchain (jqwidgets-ng 27 peer-requires Angular >= 19), and any
               NgModule bootstrap is converted to a standalone component, because
               components are standalone by default from Angular 19 on.
    React    package.json -> "jqwidgets-scripts": "^<v>"
    Vue      package.json -> "jqwidgets-scripts": "^<v>"

  Usage
    node scripts/align-demo-versions.js               # apply
    node scripts/align-demo-versions.js --dry-run     # report only
    node scripts/align-demo-versions.js --version 27.1.0
    node scripts/align-demo-versions.js --only Angular/grid/defaultfunctionality

  No dependencies beyond Node.js itself. Safe to re-run: every step is idempotent.
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DEMOS = path.join(ROOT, 'demos');
const argv = process.argv.slice(2);
const DRY = argv.includes('--dry-run');
const onlyIdx = argv.indexOf('--only');
const ONLY = onlyIdx >= 0 ? argv[onlyIdx + 1] : null;
const verIdx = argv.indexOf('--version');

function sdkVersion() {
    if (verIdx >= 0 && argv[verIdx + 1]) return argv[verIdx + 1];
    const m = fs.readFileSync(path.join(ROOT, 'ReleaseNotes.txt'), 'utf8').match(/jQWidgets v([\d.]+) Release/);
    if (!m) throw new Error('Could not read the version from ReleaseNotes.txt; pass --version');
    return m[1];
}
const VERSION = sdkVersion();
const RANGE = '^' + VERSION;

// The Angular 19 toolchain the current demos use. Stragglers are lifted onto it.
const NG_DEPS = {
    '@angular/animations': '^19.0.0', '@angular/common': '^19.0.0', '@angular/compiler': '^19.0.0',
    '@angular/core': '^19.0.0', '@angular/forms': '^19.0.0', '@angular/platform-browser': '^19.0.0',
    '@angular/platform-browser-dynamic': '^19.0.0', '@angular/router': '^19.0.0',
    'jqwidgets-ng': RANGE, rxjs: '^7.8.1', tslib: '^2.5.0', 'zone.js': '~0.15.0'
};
const NG_DEV_DEPS = {
    '@angular-devkit/build-angular': '^19.0.0', '@angular/cli': '^19.0.0',
    '@angular/compiler-cli': '^19.0.0', typescript: '~5.5.0'
};
const DEAD_DEV_DEPS = ['codelyzer', 'tslint', 'protractor', 'karma-jasmine-html-reporter', 'ts-node',
    'karma', 'karma-chrome-launcher', 'karma-coverage-istanbul-reporter', 'karma-jasmine', 'jasmine-core',
    'jasmine-spec-reporter', '@types/jasmine', '@types/jasminewd2'];

const TYPINGS_REF = '/// <reference path="../node_modules/jqwidgets-ng/jqwidgets.d.ts" />';
const GLOBALS_BODY = `/*
 * Global jQWidgets typings: the \`jqx\` object (dataAdapter, filter, ...) and the
 * \`jqwidgets\` namespace that the jqwidgets-ng component typings refer to.
 */
${TYPINGS_REF}
declare var jQuery: any;
declare var $: any;
`;

const stats = {
    angular: { bumped: 0, lifted: 0, typings: 0, standalone: 0, unchanged: 0 },
    react: { bumped: 0, unchanged: 0 }, vue: { bumped: 0, unchanged: 0 }
};
const notes = [];
const warn = [];
const orphans = [];

const read = f => fs.readFileSync(f, 'utf8');
const write = (f, text) => { if (!DRY) fs.writeFileSync(f, text); };
const exists = f => fs.existsSync(f);
function readJsonLoose(file) {
    // tsconfigs in these demos carry a leading /* comment */
    try { return JSON.parse(read(file).replace(/^\s*\/\*[\s\S]*?\*\//, '')); } catch (e) { return null; }
}
function writeJson(file, obj, indent) { write(file, JSON.stringify(obj, null, indent) + '\n'); }
function detectIndent(file) {
    const m = read(file).match(/\n([ \t]+)"/);
    return m ? (m[1] === '\t' ? '\t' : m[1].length) : 2;
}
function demoDirs(base) {
    const out = [];
    if (!exists(base)) return out;
    for (const widget of fs.readdirSync(base, { withFileTypes: true })) {
        if (!widget.isDirectory() || ['node_modules', 'sampledata', 'temp'].includes(widget.name)) continue;
        for (const demo of fs.readdirSync(path.join(base, widget.name), { withFileTypes: true })) {
            if (!demo.isDirectory() || demo.name === 'node_modules') continue;
            const dir = path.join(base, widget.name, demo.name);
            if (exists(path.join(dir, 'package.json'))) out.push({ dir, id: widget.name + '/' + demo.name });
        }
    }
    return out;
}
const matchesOnly = (base, id) => !ONLY || (base + '/' + id).replace(/\\/g, '/').endsWith(ONLY.replace(/\\/g, '/'));

/* ---------------- Angular: global typings ----------------
   The tsconfig that the build uses lists its entry files explicitly and sets
   "types": []. Its "include" is relative to the tsconfig's own folder, so for the
   demos whose tsconfig sits in src/ the existing "src/**\/*.d.ts" pattern matches
   nothing. Adding the globals file to "files" works for both layouts.        */
function ensureTypings(dir, id) {
    const srcTsconfig = path.join(dir, 'src', 'tsconfig.app.json');
    const rootTsconfig = path.join(dir, 'tsconfig.app.json');
    const tsconfig = exists(srcTsconfig) ? srcTsconfig : exists(rootTsconfig) ? rootTsconfig : null;
    if (!tsconfig) { warn.push(`Angular ${id}: no tsconfig.app.json, typings not wired`); return false; }

    const globals = path.join(dir, 'src', 'globals.d.ts');
    let changed = false;
    if (!exists(globals)) {
        write(globals, GLOBALS_BODY);
        changed = true;
    } else if (!read(globals).includes('jqwidgets-ng/jqwidgets.d.ts')) {
        write(globals, TYPINGS_REF + '\n' + read(globals));
        changed = true;
    }

    const json = readJsonLoose(tsconfig);
    if (!json) { warn.push(`Angular ${id}: could not parse ${path.basename(tsconfig)}`); return changed; }
    // Path of globals.d.ts relative to the tsconfig that must reference it.
    const rel = path.relative(path.dirname(tsconfig), globals).split(path.sep).join('/');
    json.files = json.files || [];
    if (!json.files.includes(rel)) {
        json.files.unshift(rel);
        writeJson(tsconfig, json, detectIndent(tsconfig));
        changed = true;
    }
    return changed;
}

/* ---------------- Angular: NgModule -> standalone ----------------
   From Angular 19 a component is standalone unless it says otherwise, so a
   component declared in an NgModule fails to compile. The widget modules the
   NgModule imported move onto the component; BrowserModule is bootstrap-only
   and is dropped.                                                            */
function toStandalone(dir, id) {
    const layouts = [
        { mod: 'src/app/app.module.ts', comp: 'src/app/app.component.ts', main: 'src/main.ts', from: './app/app.component' },
        { mod: 'src/app.module.ts', comp: 'src/app.component.ts', main: 'src/main.ts', from: './app.component' }
    ];
    const L = layouts.find(l => exists(path.join(dir, l.mod)));
    if (!L) return false;
    const modFile = path.join(dir, L.mod), compFile = path.join(dir, L.comp), mainFile = path.join(dir, L.main);
    if (!exists(compFile)) { warn.push(`Angular ${id}: ${L.mod} without a matching component, left alone`); return false; }

    const mod = read(modFile);
    const mainUsesModule = exists(mainFile) && /bootstrapModule\s*\(/.test(read(mainFile));

    // The great majority of demos already bootstrap a standalone component from
    // main.ts and merely carry a stale app.module.ts beside it - many of them
    // broken or importing packages that are not dependencies. Those are dead
    // code: remove the module but leave main.ts (and its providers) untouched.
    if (!mainUsesModule) {
        if (!DRY) fs.unlinkSync(modFile);
        // Some demos also carry an older duplicate entry point next to the module.
        const dupMain = path.join(dir, 'src/app/main.ts');
        if (exists(dupMain) && /bootstrapModule\s*\(/.test(read(dupMain)) && !DRY) fs.unlinkSync(dupMain);
        orphans.push(id);
        return false;
    }

    // Modules listed in the NgModule's imports, minus the bootstrap-only one.
    const importsBlock = (mod.match(/imports:\s*\[([\s\S]*?)\]/) || [])[1] || '';
    const used = importsBlock.split(',').map(s => s.trim()).filter(Boolean).filter(n => n !== 'BrowserModule');

    // Where each of those names is imported from, so the component can import them too.
    const sources = new Map();
    const importRe = /^[ \t]*import\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]\s*;?[ \t]*$/gm;
    let m;
    while ((m = importRe.exec(mod))) {
        const from = m[2];
        if (from === '@angular/core' || from === '@angular/platform-browser') continue;
        if (/^\.\.?\//.test(from) && /app\.component$/.test(from)) continue;
        for (const name of m[1].split(',').map(s => s.trim()).filter(Boolean)) {
            if (used.includes(name)) {
                if (!sources.has(from)) sources.set(from, []);
                sources.get(from).push(name);
            }
        }
    }
    const missing = used.filter(n => ![...sources.values()].flat().includes(n));
    if (missing.length) { warn.push(`Angular ${id}: could not resolve ${missing.join(', ')}, left as NgModule`); return false; }

    let comp = read(compFile);
    if (/standalone:\s*true/.test(comp)) {
        // Component is already standalone (only main.ts is stale).
    } else {
        const decorator = comp.match(/@Component\(\{/);
        if (!decorator) { warn.push(`Angular ${id}: no @Component decorator found, left as NgModule`); return false; }
        // Add the imports the NgModule used to provide. A component often already
        // imports the *Component* from the same path (jqxChatComponent from
        // jqwidgets-ng/jqxchat); the *Module* has to be merged into that same
        // statement rather than skipped or imported twice.
        for (const [from, names] of sources) {
            const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const existing = new RegExp("^[ \\t]*import\\s*\\{([^}]*)\\}\\s*from\\s*['\"]" + escaped + "['\"]\\s*;?[ \\t]*$", 'm').exec(comp);
            if (existing) {
                const have = existing[1].split(',').map(s => s.trim()).filter(Boolean);
                const add = names.filter(n => !have.includes(n));
                if (!add.length) continue;
                comp = comp.slice(0, existing.index) +
                    `import { ${have.concat(add).join(', ')} } from '${from}';` +
                    comp.slice(existing.index + existing[0].length);
                continue;
            }
            const line = `import { ${names.join(', ')} } from '${from}';\n`;
            // "import" followed by whitespace or a brace, so the decorator's own
            // "imports:" line is not mistaken for an import statement.
            const lastImport = [...comp.matchAll(/^[ \t]*import[\s{][^\n]*\n/gm)].pop();
            const at = lastImport ? lastImport.index + lastImport[0].length : 0;
            comp = comp.slice(0, at) + line + comp.slice(at);
        }
        const indent = (comp.match(/@Component\(\{\s*\n(\s*)/) || [, '    '])[1];
        comp = comp.replace(/@Component\(\{\s*\n/, `@Component({\n${indent}standalone: true,\n${indent}imports: [${used.join(', ')}],\n`);
        write(compFile, comp);
    }

    // main.ts bootstraps the component directly. Keep HttpClient if the module used it.
    const needsHttp = /HttpClientModule/.test(mod);
    const mainSrc = `import { bootstrapApplication } from '@angular/platform-browser';\n` +
        (needsHttp ? `import { provideHttpClient } from '@angular/common/http';\n` : '') +
        `import { AppComponent } from '${L.from}';\n\n` +
        `bootstrapApplication(AppComponent${needsHttp ? ', {\n    providers: [provideHttpClient()]\n}' : ''})\n    .catch(err => console.error(err));\n`;
    write(mainFile, mainSrc);
    if (!DRY) fs.unlinkSync(modFile);
    return true;
}

/* ---------------- Angular ---------------- */
for (const { dir, id } of demoDirs(path.join(DEMOS, 'Angular'))) {
    if (!matchesOnly('Angular', id)) continue;
    const file = path.join(dir, 'package.json');
    const pkg = readJsonLoose(file);
    if (!pkg) { warn.push(`Angular ${id}: unreadable package.json, skipped`); continue; }
    const indent = detectIndent(file);
    const before = JSON.stringify(pkg);
    const ngCore = (pkg.dependencies || {})['@angular/core'] || '';
    const needsLift = !/^\^19\./.test(ngCore);

    pkg.dependencies = pkg.dependencies || {};
    if (needsLift) {
        const extras = {};
        for (const [k, v] of Object.entries(pkg.dependencies)) {
            if (!(k in NG_DEPS) && !/^@angular\//.test(k)) extras[k] = v;
        }
        pkg.dependencies = Object.assign({}, NG_DEPS, extras);
        pkg.devDependencies = Object.assign({}, pkg.devDependencies, NG_DEV_DEPS);
        for (const dead of DEAD_DEV_DEPS) delete pkg.devDependencies[dead];
        notes.push(`Angular ${id}: lifted Angular ${ngCore || '?'} -> ^19.0.0`);
        stats.angular.lifted++;
    } else {
        pkg.dependencies['jqwidgets-ng'] = RANGE;
    }
    if (typeof pkg.homepage === 'string' && /stackblitz\.com\/edit\//.test(pkg.homepage)) delete pkg.homepage;

    const pkgChanged = JSON.stringify(pkg) !== before;
    if (pkgChanged) writeJson(file, pkg, indent);
    if (pkgChanged && !needsLift) stats.angular.bumped++;

    if (ensureTypings(dir, id)) stats.angular.typings++;
    if (toStandalone(dir, id)) { stats.angular.standalone++; notes.push(`Angular ${id}: NgModule -> standalone`); }
    if (!pkgChanged) stats.angular.unchanged++;
}

/* ---------------- React / Vue ---------------- */
for (const [label, baseName] of [['react', 'React-TSX'], ['vue', 'Vue.js']]) {
    for (const { dir, id } of demoDirs(path.join(DEMOS, baseName))) {
        if (!matchesOnly(baseName, id)) continue;
        const file = path.join(dir, 'package.json');
        const pkg = readJsonLoose(file);
        if (!pkg) { warn.push(`${label} ${id}: unreadable package.json, skipped`); continue; }
        const indent = detectIndent(file);
        const before = JSON.stringify(pkg);
        for (const block of ['dependencies', 'devDependencies']) {
            if (pkg[block] && pkg[block]['jqwidgets-scripts']) pkg[block]['jqwidgets-scripts'] = RANGE;
        }
        if (JSON.stringify(pkg) === before) { stats[label].unchanged++; continue; }
        writeJson(file, pkg, indent);
        stats[label].bumped++;
    }
}

console.log(`jQWidgets ${VERSION} -> demo dependencies${DRY ? '   (dry run, nothing written)' : ''}`);
console.log(`  Angular: ${stats.angular.bumped} bumped to jqwidgets-ng ${RANGE}, ${stats.angular.lifted} lifted to Angular 19, ` +
            `${stats.angular.standalone} NgModule -> standalone, ${stats.angular.typings} typings wired`);
console.log(`  React:   ${stats.react.bumped} bumped to jqwidgets-scripts ${RANGE}`);
console.log(`  Vue:     ${stats.vue.bumped} bumped to jqwidgets-scripts ${RANGE}`);
if (notes.length) { console.log('\nChanges beyond a version bump:'); for (const n of notes) console.log('  - ' + n); }
if (warn.length) { console.log('\nNeeds a look:'); for (const n of warn) console.log('  ! ' + n); }
console.log('\nNext: node scripts/build-demo-catalog.js   (the Demo Browser shows these versions)');
