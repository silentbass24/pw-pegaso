/*
  Build every React demo and load it in a real browser.

  vite build only transpiles: it type-checks nothing and runs nothing, so a demo
  can build cleanly and still throw on its first render - a removed React API, a
  widget whose container is not in the document yet. This installs the
  dependencies once, then for each demo runs vite build, serves its dist/ and
  loads it in headless Edge, reporting build failures, uncaught exceptions and
  pages where #root stays empty.

  Usage
    node scripts/smoke-react-demos.js                 # every React demo
    node scripts/smoke-react-demos.js --group grid    # one widget folder
    node scripts/smoke-react-demos.js --limit 40      # a sample
    node scripts/smoke-react-demos.js --list ids.txt  # exactly these demos
    node scripts/smoke-react-demos.js --jobs 4 --work C:/jqxreact

  Writes demos/smoke-react-report.json. Exit code is non-zero if anything failed.
*/
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'demos', 'React-TSX');
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const JOBS = Math.max(1, parseInt(arg('jobs', '4'), 10));
const LIMIT = parseInt(arg('limit', '0'), 10);
const GROUP = arg('group', null);
const ONLY = arg('demo', null);
// --list <file>: one demo id per line, for re-checking exactly the ones just fixed
const LIST = arg('list', null) ? new Set(fs.readFileSync(arg('list'), 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean)) : null;
const WORK = path.resolve(arg('work', 'C:/jqxreact'));
const PAGE_MS = parseInt(arg('page-timeout', '25000'), 10);   // wall clock per page
const KEEP = argv.includes('--keep-going');

const BROWSER = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(p => fs.existsSync(p));
if (!BROWSER) { console.error('No Edge or Chrome found.'); process.exit(2); }

let demos = [];
for (const w of fs.readdirSync(BASE, { withFileTypes: true })) {
    if (!w.isDirectory() || ['node_modules', 'temp'].includes(w.name)) continue;
    if (GROUP && w.name !== GROUP) continue;
    for (const d of fs.readdirSync(path.join(BASE, w.name), { withFileTypes: true })) {
        if (!d.isDirectory() || d.name === 'node_modules') continue;
        const dir = path.join(BASE, w.name, d.name);
        if (!fs.existsSync(path.join(dir, 'package.json'))) continue;
        const id = w.name + '/' + d.name;
        if (ONLY && id !== ONLY) continue;
        if (LIST && !LIST.has(id)) continue;
        demos.push({ id, dir });
    }
}
demos.sort((a, b) => a.id.localeCompare(b.id));
if (LIMIT) {
    const step = Math.max(1, Math.floor(demos.length / LIMIT));
    demos = demos.filter((_, i) => i % step === 0).slice(0, LIMIT);
}
if (!demos.length) { console.error('no demos matched'); process.exit(2); }

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const e of fs.readdirSync(src, { withFileTypes: true })) {
        if (e.name === 'node_modules' || e.name === 'dist') continue;
        const s = path.join(src, e.name), d = path.join(dest, e.name);
        if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
    }
}
function run(cmd, args, cwd, timeoutMs) {
    return new Promise((resolve) => {
        const child = spawn(cmd, args, { cwd, shell: true, windowsHide: true });
        let out = '';
        child.stdout.on('data', d => { out += d.toString('utf8'); });
        child.stderr.on('data', d => { out += d.toString('utf8'); });
        const timer = setTimeout(() => { try { child.kill('SIGKILL'); } catch (e) {} }, timeoutMs);
        child.on('close', code => { clearTimeout(timer); resolve({ code, out }); });
        child.on('error', err => { clearTimeout(timer); resolve({ code: null, out: out + String(err) }); });
    });
}

// The page reports back over HTTP rather than through --dump-dom. A demo with a
// running animation (every chart) never lets the browser go idle, so waiting for
// it to exit and print the DOM simply hangs.
const RECORDER = `<script>
(function () {
    var errs = [];
    // Chromium reports this whenever a resize handler resizes something itself. It is a
    // notice, not a failure: the browser simply delivers the rest on the next frame.
    var benign = /^ResizeObserver loop/;
    window.addEventListener('error', function (e) { if (!e.message || benign.test(e.message)) { return; } errs.push(String(e.message)); }, true);
    window.addEventListener('unhandledrejection', function (e) { errs.push('unhandled rejection: ' + (e.reason && (e.reason.message || e.reason))); });
    var ce = console.error;
    console.error = function () { errs.push('console.error: ' + Array.prototype.join.call(arguments, ' ')); ce.apply(console, arguments); };
    var sent = false;
    function send() {
        if (sent) { return; }
        sent = true;
        var host = document.getElementById('root');
        var inner = host ? host.innerHTML : '';
        var payload = {
            errors: errs.slice(0, 3),
            rendered: inner.replace(/\\s/g, '').length,
            widget: /jqx-|<svg|<canvas/.test(inner)
        };
        try { fetch('/__result', { method: 'POST', body: JSON.stringify(payload) }); } catch (e) {}
    }
    window.addEventListener('load', function () { setTimeout(send, 2500); });
    setTimeout(send, 9000);
})();
</script>`;

const MIME = { '.htm': 'text/html; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.csv': 'text/csv; charset=utf-8', '.tsv': 'text/tab-separated-values; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject', '.map': 'application/json' };

// Every worker gets its OWN server on its OWN port, serving its demo at the root.
//
// Serving the workers under a shared /w<slot>/ prefix looks tidier but quietly
// breaks the demos: they load their data and their bundle by path, and from /w0/
// those resolve outside the prefix and 404. At the root the URLs resolve exactly
// as they do in a real deployment, so nothing has to be rewritten.
//
// A worker parks its resolver here while its page loads.
const pending = new Map();

function serverFor(slot) {
    return http.createServer((req, res) => {
        let urlPath;
        try { urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch (e) { res.writeHead(400); return res.end('bad'); }

        if (urlPath === '/__result') {
            let body = '';
            req.on('data', c => { body += c; });
            req.on('end', () => {
                res.writeHead(204); res.end();
                const resolve = pending.get(String(slot));
                if (resolve) { pending.delete(String(slot)); try { resolve(JSON.parse(body)); } catch (e) { resolve(null); } }
            });
            return;
        }

        const rest = (urlPath === '/' || urlPath === '') ? '/index.html' : urlPath;
        const base = path.join(WORK, 'w' + slot, 'dist');
        const file = path.normalize(path.join(base, rest));
        if (!file.startsWith(base)) { res.writeHead(403); return res.end('no'); }
        fs.stat(file, (err, st) => {
            if (err || st.isDirectory()) { res.writeHead(404); return res.end('nf'); }
            const ext = path.extname(file).toLowerCase();
            res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
            if (ext === '.htm' || ext === '.html') {
                const html = fs.readFileSync(file, 'utf8').replace(/<head[^>]*>/i, mm => mm + RECORDER);
                return res.end(html);
            }
            fs.createReadStream(file).on('error', () => res.destroy()).pipe(res);
        });
    });
}

// Loads the page and waits for it to post its result, then kills the browser:
// it is not expected to exit on its own.
function browse(url, profile, slot) {
    return new Promise((resolve) => {
        let settled = false;
        const child = spawn(BROWSER, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
            '--user-data-dir=' + profile, url], { windowsHide: true });
        child.stdout.on('data', () => {});
        child.stderr.on('data', () => {});

        const finish = (value) => {
            if (settled) { return; }
            settled = true;
            pending.delete(String(slot));
            clearTimeout(timer);
            try { child.kill('SIGKILL'); } catch (e) {}
            resolve(value);
        };
        pending.set(String(slot), finish);
        const timer = setTimeout(() => finish(null), PAGE_MS);
        child.on('error', () => finish(null));
    });
}

async function main(basePort, servers) {
    fs.mkdirSync(WORK, { recursive: true });
    const tpl = path.join(WORK, '_tpl');
    if (!fs.existsSync(path.join(tpl, 'node_modules'))) {
        console.log('installing the shared dependency tree once...');
        copyDir(demos[0].dir, tpl);
        await run('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], tpl, 25 * 60 * 1000);
        if (!fs.existsSync(path.join(tpl, 'node_modules'))) { console.error('install failed'); process.exit(2); }
        console.log('done\n');
    }
    const NM = path.join(tpl, 'node_modules');

    console.log(`${demos.length} React demos, ${JOBS} in parallel\n`);
    const started = Date.now();
    const results = [];
    let next = 0, done = 0;

    async function worker(slot) {
        const w = path.join(WORK, 'w' + slot);
        const profile = path.join(WORK, 'profile' + slot);
        const port = basePort + slot;
        while (next < demos.length) {
            const d = demos[next++];
            const r = { id: d.id, errors: [], widget: false, note: '' };
            try { fs.rmSync(w, { recursive: true, force: true }); } catch (e) {}
            copyDir(d.dir, w);
            try { fs.symlinkSync(NM, path.join(w, 'node_modules'), 'junction'); } catch (e) {}

            const build = await run('npx', ['--no-install', 'vite', 'build', '--logLevel', 'error'], w, 6 * 60 * 1000);
            const bundle = path.join(w, 'dist', 'index.html');
            if (!fs.existsSync(bundle)) {
                const lines = build.out.split('\n').filter(l => /error|ERROR/i.test(l)).slice(0, 3);
                r.errors.push('build failed: ' + (lines.join(' | ').replace(/\s+/g, ' ').slice(0, 260) || 'no bundle produced'));
            } else {
                // A page that never reports back is usually the machine being busy, not the
                // demo - one more try costs seconds and keeps a load spike out of the report.
                let page = await browse(`http://127.0.0.1:${port}/`, profile, slot);
                if (!page) page = await browse(`http://127.0.0.1:${port}/`, profile, slot);
                if (!page) r.errors.push('the page never reported back within ' + Math.round(PAGE_MS / 1000) + 's');
                else {
                    r.errors = Array.isArray(page.errors) ? page.errors : [];
                    r.widget = !!page.widget;
                    // Only what React rendered counts: the build inlines jqx.base.css,
                    // whose text is full of .jqx- selectors.
                    if (!page.rendered) r.errors.push('#root is empty: the component did not render');
                }
            }
            results.push(r);
            done++;
            if (done % 10 === 0 || done === demos.length) {
                const mins = (Date.now() - started) / 60000;
                const left = ((demos.length - done) / Math.max(done / Math.max(mins, 0.01), 0.01)).toFixed(0);
                console.log(`  ${done}/${demos.length}   ${results.filter(x => x.errors.length).length} with errors   [${mins.toFixed(1)} min, ~${left} min left]`);
            }
            try { fs.rmSync(w, { recursive: true, force: true }); } catch (e) {}
        }
    }

    await Promise.all(Array.from({ length: JOBS }, (_, i) => worker(i)));
    for (const s of servers) { try { s.close(); } catch (e) {} }

    results.sort((a, b) => a.id.localeCompare(b.id));
    const broken = results.filter(r => r.errors.length);
    const noWidget = results.filter(r => !r.errors.length && !r.widget);
    console.log('');
    console.log(`checked ${results.length} demos in ${((Date.now() - started) / 60000).toFixed(1)} min`);
    console.log(`  failed          : ${broken.length}`);
    console.log(`  drew no widget  : ${noWidget.length}`);
    // A narrowed run (--demo/--group/--limit) writes beside the full report rather
    // than over it, so a one-demo diagnostic never destroys a whole sweep's results.
    const partial = Boolean(ONLY || GROUP || LIMIT || LIST);
    const reportName = partial ? 'smoke-react-report.partial.json' : 'smoke-react-report.json';
    fs.writeFileSync(path.join(ROOT, 'demos', reportName),
        JSON.stringify({ checked: results.length, broken, noWidget: noWidget.map(r => ({ id: r.id, note: r.note })) }, null, 1));

    if (broken.length) {
        console.log('\nFailures, grouped:\n');
        const by = {};
        for (const r of broken) {
            const key = (r.errors[0] || '').replace(/[0-9a-f]{8,}/g, '#').replace(/:\d+/g, ':#').slice(0, 120);
            (by[key] = by[key] || []).push(r.id);
        }
        for (const [msg, ids] of Object.entries(by).sort((a, b) => b[1].length - a[1].length)) {
            console.log('  ' + ids.length + 'x  ' + msg);
            console.log('        ' + ids.slice(0, 8).join(', ') + (ids.length > 8 ? ` … +${ids.length - 8}` : ''));
        }
    }
    console.log('\nfull report: demos/' + reportName);
    process.exit(broken.length && !KEEP ? 1 : 0);
}

// One listener per worker on consecutive ports, retried as a block if the range
// is taken, so slot N is always reachable at basePort + N.
function listenAll(basePort, attempt = 0) {
    if (attempt > 40) { console.error('no free port range found'); process.exit(2); }
    const servers = Array.from({ length: JOBS }, (_, i) => serverFor(i));
    let up = 0, failed = false;
    const retry = () => {
        if (failed) { return; }
        failed = true;
        for (const s of servers) { try { s.close(); } catch (e) {} }
        listenAll(basePort + JOBS, attempt + 1);
    };
    for (let i = 0; i < servers.length; i++) {
        servers[i].on('error', e => (e.code === 'EADDRINUSE' ? retry() : (console.error(e.message), process.exit(2))));
        servers[i].listen(basePort + i, '127.0.0.1', () => {
            if (++up === servers.length && !failed) { main(basePort, servers); }
        });
    }
}
listenAll(8880);
