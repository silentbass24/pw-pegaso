/*
  Build a sample of the framework demos and report which ones fail.

  Each demo is a self-contained project, so this copies it to a short working
  path first (deep node_modules trees blow past the Windows path limit), runs
  npm install and the project's own build, then reports.

  Usage
    node scripts/verify-demo-builds.js                       # 6 random demos per framework
    node scripts/verify-demo-builds.js --count 12            # more per framework
    node scripts/verify-demo-builds.js --fw angular,react    # pick frameworks
    node scripts/verify-demo-builds.js --demo Angular/grid/defaultfunctionality
    node scripts/verify-demo-builds.js --work D:/tmp/jqxbuild --keep

  Exit code is non-zero when any sampled demo fails, so CI can gate on it.
*/
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const arg = (name, dflt) => { const i = argv.indexOf('--' + name); return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt; };
const COUNT = parseInt(arg('count', '6'), 10);
const KEEP = argv.includes('--keep');
const ONLY_DEMO = arg('demo', null);
const FWS = arg('fw', 'angular,react,vue').split(',').map(s => s.trim().toLowerCase());
// Short path: deep dependency trees otherwise exceed MAX_PATH on Windows.
const WORK = path.resolve(arg('work', process.platform === 'win32' ? 'C:/jqxbuild' : path.join(os.tmpdir(), 'jqxbuild')));

const FRAMEWORKS = {
    angular: { base: 'demos/Angular', build: ['ng', 'build', '--configuration', 'production'], ok: /bundle generation complete|Initial total|Build at/ },
    react: { base: "demos/React-TSX", build: ["vite", "build"], ok: /built in/ },
    vue: { base: 'demos/Vue.js', build: ['webpack', '--config', 'webpack.config.js'], ok: /main\.bundle\.js|webpack: Compiled|Built at/ }
};

function demoDirs(base) {
    const out = [];
    const abs = path.join(ROOT, base);
    if (!fs.existsSync(abs)) return out;
    for (const w of fs.readdirSync(abs, { withFileTypes: true })) {
        if (!w.isDirectory() || ['node_modules', 'sampledata', 'temp'].includes(w.name)) continue;
        for (const d of fs.readdirSync(path.join(abs, w.name), { withFileTypes: true })) {
            if (!d.isDirectory() || d.name === 'node_modules') continue;
            const dir = path.join(abs, w.name, d.name);
            if (fs.existsSync(path.join(dir, 'package.json'))) out.push({ dir, id: `${base}/${w.name}/${d.name}` });
        }
    }
    return out;
}
function pick(list, n) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a.slice(0, n);
}
function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const e of fs.readdirSync(src, { withFileTypes: true })) {
        if (e.name === 'node_modules' || e.name === 'dist') continue;
        const s = path.join(src, e.name), d = path.join(dest, e.name);
        if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
    }
}
function run(cmd, args, cwd) {
    return execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], shell: process.platform === 'win32', timeout: 15 * 60 * 1000 });
}

const targets = [];
if (ONLY_DEMO) {
    const dir = path.join(ROOT, ONLY_DEMO);
    const fw = ONLY_DEMO.split('/')[1] === 'React-TSX' ? 'react' : ONLY_DEMO.split('/')[1] === 'Vue.js' ? 'vue' : 'angular';
    targets.push({ fw, dir, id: ONLY_DEMO });
} else {
    for (const fw of FWS) {
        const meta = FRAMEWORKS[fw];
        if (!meta) { console.error('Unknown framework: ' + fw); process.exit(2); }
        for (const d of pick(demoDirs(meta.base), COUNT)) targets.push({ fw, dir: d.dir, id: d.id });
    }
}

fs.mkdirSync(WORK, { recursive: true });
console.log(`Building ${targets.length} demos in ${WORK}\n`);
const failures = [];
let i = 0;
for (const t of targets) {
    i++;
    const meta = FRAMEWORKS[t.fw];
    const work = path.join(WORK, 'b' + i);
    process.stdout.write(`[${i}/${targets.length}] ${t.id} … `);
    try { fs.rmSync(work, { recursive: true, force: true }); } catch (e) {}
    copyDir(t.dir, work);
    let stage = 'install';
    try {
        run('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], work);
        stage = 'build';
        const out = run('npx', ['--no-install'].concat(meta.build), work);
        if (!meta.ok.test(out)) throw new Error('build produced no success marker');
        console.log('ok');
    } catch (e) {
        console.log('FAILED (' + stage + ')');
        const msg = ((e.stdout || '') + '\n' + (e.stderr || '') + '\n' + (e.message || '')).split('\n')
            .filter(l => /error|Error:|ERR!|FAILED/i.test(l)).slice(0, 4).join('\n      ');
        failures.push({ id: t.id, stage, msg: msg.trim() || String(e.message || '').slice(0, 300) });
    }
    if (!KEEP) { try { fs.rmSync(work, { recursive: true, force: true }); } catch (e) {} }
}

console.log('');
if (failures.length) {
    console.log(`${failures.length} of ${targets.length} failed:\n`);
    for (const f of failures) console.log(`  ${f.id}  [${f.stage}]\n      ${f.msg}\n`);
    process.exit(1);
}
console.log(`All ${targets.length} demos installed and built.`);
