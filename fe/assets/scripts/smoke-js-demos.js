/*
  Load every JavaScript/jQuery demo in a real browser and report the ones that
  break.

  These demos need no build step, so the only thing that ever exercises them is
  somebody opening the page - which means a broken one ships unnoticed. This
  serves the SDK, injects a small error recorder into each demo page, and loads
  every demo in headless Edge, reporting uncaught exceptions and pages that draw
  nothing at all.

  Usage
    node scripts/smoke-js-demos.js                    # every JavaScript demo
    node scripts/smoke-js-demos.js --group jqxgrid    # one widget folder
    node scripts/smoke-js-demos.js --jobs 6 --limit 100

  Writes demos/smoke-js-report.json. Exit code is non-zero if any demo threw, so
  CI can gate on it. Needs Node.js and an installed Edge or Chrome, nothing else.
*/
'use strict';

const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const JOBS = Math.max(1, parseInt(arg('jobs', '5'), 10));
const BUDGET = parseInt(arg('budget', '6000'), 10);   // virtual ms given to each page
const LIMIT = parseInt(arg('limit', '0'), 10);
const GROUP = arg('group', null);
const KEEP = argv.includes('--keep-going');

const BROWSER = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(p => fs.existsSync(p));
if (!BROWSER) { console.error('No Edge or Chrome found.'); process.exit(2); }

// ---------- the demo list, straight out of the catalog ----------
const catalogFile = path.join(ROOT, 'demos', 'catalog.js');
if (!fs.existsSync(catalogFile)) { console.error('demos/catalog.js is missing - run scripts/build-demo-catalog.js'); process.exit(2); }
const CAT = new Function(fs.readFileSync(catalogFile, 'utf8').replace('window.JQX_DEMO_CATALOG =', 'return '))();
const js = CAT.frameworks.js;
const groups = js.groups.filter(g => !GROUP || g.id === GROUP);
let demos = [];
for (const g of groups) {
    for (const d of g.demos) {
        demos.push({
            id: g.id + '/' + d.file,
            url: '/demos/' + encodeURI(js.base + '/' + g.id + '/' + d.file)
        });
    }
}
if (LIMIT) demos = demos.slice(0, LIMIT);
if (!demos.length) { console.error('no demos matched'); process.exit(2); }

// ---------- server ----------
const MIME = { '.htm': 'text/html; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.csv': 'text/csv; charset=utf-8', '.tsv': 'text/tab-separated-values; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject', '.otf': 'font/otf', '.map': 'application/json', '.php': 'text/plain; charset=utf-8', '.xlsx': 'application/octet-stream' };

// Runs before the demo's own scripts, so it sees everything they throw. What it
// collects is written into the page itself, because --dump-dom is how the result
// gets back out of the browser.
const RECORDER = `<script>
(function () {
    var errs = [];
    window.addEventListener('error', function (e) {
        // Capture phase also sees a failed <img> or <script> load, which carries
        // no message. Those are missing assets, not something the demo threw.
        if (!e.message) { return; }
        errs.push(String(e.message) + (e.filename ? ' @ ' + String(e.filename).split('/').pop() + ':' + e.lineno : ''));
    }, true);
    window.addEventListener('unhandledrejection', function (e) {
        errs.push('unhandled rejection: ' + (e.reason && (e.reason.message || e.reason)));
    });
    var ce = console.error;
    console.error = function () { errs.push('console.error: ' + Array.prototype.join.call(arguments, ' ')); ce.apply(console, arguments); };
    function report() {
        try {
            var el = document.getElementById('__smoke__') || document.createElement('div');
            el.id = '__smoke__';
            el.setAttribute('data-errors', JSON.stringify(errs.slice(0, 3)));
            el.style.display = 'none';
            if (!el.parentNode && document.body) { document.body.appendChild(el); }
        } catch (e) { /* nothing useful to do here */ }
    }
    window.addEventListener('DOMContentLoaded', function () { report(); setTimeout(report, 400); });
    window.addEventListener('load', function () { report(); setTimeout(report, 800); setTimeout(report, 2000); });
})();
</script>`;

function inject(html) {
    if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, m => m + RECORDER);
    if (/<html[^>]*>/i.test(html)) return html.replace(/<html[^>]*>/i, m => m + RECORDER);
    return RECORDER + html;
}

const server = http.createServer((req, res) => {
    let parsed;
    try { parsed = new URL(req.url, 'http://localhost'); } catch (e) { res.writeHead(400); return res.end('bad'); }
    const urlPath = decodeURIComponent(parsed.pathname);
    const file = path.normalize(path.join(ROOT, urlPath));
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('no'); }
    fs.stat(file, (err, st) => {
        if (err || st.isDirectory()) { res.writeHead(404); return res.end('nf'); }
        const ext = path.extname(file).toLowerCase();
        const type = MIME[ext] || 'application/octet-stream';
        if (ext === '.htm' || ext === '.html') {
            const text = fs.readFileSync(file, 'utf8');
            // Some demos fetch JSON from a file named .htm; injecting a script
            // into that would corrupt the response the demo is parsing.
            const looksLikeHtml = /<html|<head|<!doctype|<body/i.test(text.replace(/^﻿/, '').slice(0, 400));
            res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
            return res.end(looksLikeHtml ? inject(text) : text);
        }
        res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
        fs.createReadStream(file).on('error', () => res.destroy()).pipe(res);
    });
});

function browse(url, profile) {
    return new Promise((resolve) => {
        const child = spawn(BROWSER, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
            '--user-data-dir=' + profile, '--virtual-time-budget=' + BUDGET, '--dump-dom', url],
            { windowsHide: true });
        let out = '';
        child.stdout.on('data', d => { out += d.toString('utf8'); });
        child.stderr.on('data', () => {});
        const timer = setTimeout(() => { try { child.kill('SIGKILL'); } catch (e) {} }, BUDGET + 45000);
        child.on('close', () => { clearTimeout(timer); resolve(out); });
        child.on('error', () => { clearTimeout(timer); resolve(''); });
    });
}

function classify(id, dom) {
    const r = { id, errors: [], widget: false, note: '' };
    if (!dom) { r.errors.push('the browser returned nothing for this page'); return r; }
    const m = dom.match(/id="__smoke__"[^>]*data-errors="([^"]*)"/);
    if (m) {
        try {
            const decoded = m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");
            r.errors = JSON.parse(decoded);
        } catch (e) { /* leave empty */ }
    } else { r.note = 'recorder did not report'; }
    r.widget = /jqx-|<svg|<canvas/.test(dom);
    if (!r.widget) {
        const body = (dom.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [, ''])[1].replace(/<[^>]+>/g, '').trim();
        if (body.length < 60) r.note = 'blank page';
    }
    return r;
}

async function run(port) {
    const tmp = path.join(os.tmpdir(), 'jqx-js-smoke');
    fs.mkdirSync(tmp, { recursive: true });
    // Profiles are reused: a fresh one per launch makes headless Edge hang.
    const profiles = [];
    for (let i = 0; i < JOBS; i++) profiles.push(path.join(tmp, 'profile' + i));

    console.log(`${demos.length} JavaScript demos, ${JOBS} browsers in parallel\n`);
    const started = Date.now();
    const results = [];
    let next = 0, done = 0;

    async function worker(slot) {
        while (next < demos.length) {
            const d = demos[next++];
            const dom = await browse(`http://127.0.0.1:${port}${d.url}`, profiles[slot]);
            if (process.env.JQX_SMOKE_DUMP) {
                fs.writeFileSync(path.join(tmp, d.id.replace(/[\/]/g, '_') + '.dump.html'), dom || '');
            }
            results.push(classify(d.id, dom));
            done++;
            if (done % 25 === 0 || done === demos.length) {
                const mins = (Date.now() - started) / 60000;
                const rate = done / Math.max(mins, 0.01);
                const left = ((demos.length - done) / Math.max(rate, 0.01)).toFixed(0);
                const bad = results.filter(r => r.errors.length).length;
                console.log(`  ${done}/${demos.length}   ${bad} with errors   [${mins.toFixed(1)} min, ~${left} min left]`);
            }
        }
    }
    await Promise.all(profiles.map((_, i) => worker(i)));
    server.close();

    results.sort((a, b) => a.id.localeCompare(b.id));
    const broken = results.filter(r => r.errors.length);
    const noWidget = results.filter(r => !r.errors.length && !r.widget);

    console.log('');
    console.log(`checked ${results.length} demos in ${((Date.now() - started) / 60000).toFixed(1)} min`);
    console.log(`  threw an error  : ${broken.length}`);
    console.log(`  drew no widget  : ${noWidget.length}`);

    // A narrowed run (--group/--limit) writes beside the full report rather than over
    // it, so a one-widget check never destroys a whole sweep's results.
    const partial = Boolean(GROUP || LIMIT);
    const reportName = partial ? 'smoke-js-report.partial.json' : 'smoke-js-report.json';
    fs.writeFileSync(path.join(ROOT, 'demos', reportName),
        JSON.stringify({ checked: results.length, partial, broken, noWidget: noWidget.map(r => ({ id: r.id, note: r.note })) }, null, 1));

    if (broken.length) {
        console.log('\nDemos that threw:\n');
        const byMessage = {};
        for (const r of broken) {
            const key = (r.errors[0] || '').replace(/[0-9a-f]{8,}/g, '#').replace(/:\d+/g, ':#').slice(0, 110);
            (byMessage[key] = byMessage[key] || []).push(r.id);
        }
        for (const [msg, ids] of Object.entries(byMessage).sort((a, b) => b[1].length - a[1].length)) {
            console.log('  ' + ids.length + 'x  ' + msg);
            console.log('        ' + ids.slice(0, 6).join(', ') + (ids.length > 6 ? ` … +${ids.length - 6}` : ''));
        }
    }
    if (noWidget.length) {
        console.log('\nDrew nothing (worth an eyeball, not necessarily broken):');
        console.log('  ' + noWidget.slice(0, 30).map(r => r.id).join(', ') + (noWidget.length > 30 ? ` … +${noWidget.length - 30}` : ''));
    }
    console.log('\nfull report: demos/' + reportName);
    process.exit(broken.length && !KEEP ? 1 : 0);
}

let port = 8610;
server.on('error', e => {
    if (e.code === 'EADDRINUSE' && port < 8660) { server.listen(++port, '127.0.0.1'); }
    else { console.error(e.message); process.exit(2); }
});
server.listen(port, '127.0.0.1', () => run(port));
