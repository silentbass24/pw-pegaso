/*
  jQWidgets local demo server

  Serves the SDK folder over HTTP and opens the Demo Browser. Needed because
  roughly one demo in five loads its data with Ajax, which browsers block on
  file:// URLs, and because the Demo Browser's source view and StackBlitz
  export fetch files.

  Usage:
    node scripts/serve-demos.js              # http://localhost:8500/demos/index.htm
    node scripts/serve-demos.js 3000         # custom port
    node scripts/serve-demos.js --no-open    # don't launch the browser

  No dependencies beyond Node.js itself. Serves only files below the SDK root.
*/
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const noOpen = args.includes('--no-open');
let port = Number(args.find(a => /^\d+$/.test(a)) || process.env.PORT || 8500);
const START_PATH = '/demos/index.htm';

const MIME = {
    '.htm': 'text/html; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8', '.ts': 'text/plain; charset=utf-8', '.tsx': 'text/plain; charset=utf-8',
    '.vue': 'text/plain; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
    '.csv': 'text/csv; charset=utf-8', '.tsv': 'text/tab-separated-values; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
    '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject', '.otf': 'font/otf', '.pdf': 'application/pdf', '.php': 'text/plain; charset=utf-8',
    '.scss': 'text/plain; charset=utf-8', '.wasm': 'application/wasm'
};

function send(res, status, body, type) {
    res.writeHead(status, { 'Content-Type': type || 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' });
    res.end(body);
}

function listing(urlPath, dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
        .filter(e => !e.name.startsWith('.') && e.name !== 'node_modules')
        .sort((a, b) => (b.isDirectory() - a.isDirectory()) || a.name.localeCompare(b.name));
    const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const rows = entries.map(e => {
        const name = e.name + (e.isDirectory() ? '/' : '');
        return `<li><a href="${encodeURIComponent(e.name)}${e.isDirectory() ? '/' : ''}">${esc(name)}</a></li>`;
    }).join('\n');
    return `<!DOCTYPE html><meta charset="utf-8"><title>${esc(urlPath)}</title>
<style>body{font:14px system-ui,sans-serif;margin:24px;color:#1f2328}a{color:#0969da;text-decoration:none}li{padding:2px 0}h1{font-size:16px}</style>
<h1>Index of ${esc(urlPath)}</h1><p><a href="${START_PATH}">← Demo Browser</a> · <a href="../">Parent folder</a></p><ul>${rows}</ul>`;
}

const server = http.createServer((req, res) => {
    let urlPath;
    try { urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch (e) { return send(res, 400, 'Bad request'); }
    if (urlPath === '/') { res.writeHead(302, { Location: START_PATH }); return res.end(); }

    const filePath = path.normalize(path.join(ROOT, urlPath));
    if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) return send(res, 403, 'Forbidden');

    fs.stat(filePath, (err, stat) => {
        if (err) return send(res, 404, 'Not found: ' + urlPath);
        if (stat.isDirectory()) {
            if (!urlPath.endsWith('/')) { res.writeHead(301, { Location: encodeURI(urlPath) + '/' }); return res.end(); }
            for (const index of ['index.htm', 'index.html']) {
                const candidate = path.join(filePath, index);
                if (fs.existsSync(candidate)) return stream(candidate, res);
            }
            try { return send(res, 200, listing(urlPath, filePath), 'text/html; charset=utf-8'); }
            catch (e) { return send(res, 500, 'Cannot list folder'); }
        }
        stream(filePath, res);
    });
});

function stream(file, res) {
    const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
    fs.createReadStream(file).on('error', () => { res.destroy(); }).pipe(res);
}

function openBrowser(url) {
    const cmd = process.platform === 'win32' ? `start "" "${url}"` : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
    exec(cmd, () => { /* if it fails the user still has the printed URL */ });
}

function listen(attempt) {
    server.once('error', err => {
        if (err.code === 'EADDRINUSE' && attempt < 10) { port++; listen(attempt + 1); }
        else { console.error('Could not start server:', err.message); process.exit(1); }
    });
    server.listen(port, '127.0.0.1', () => {
        const url = `http://localhost:${port}${START_PATH}`;
        console.log('');
        console.log('  jQWidgets demos are being served from');
        console.log('  ' + ROOT);
        console.log('');
        console.log('  Demo Browser:  ' + url);
        console.log('  Press Ctrl+C to stop.');
        console.log('');
        if (!noOpen) openBrowser(url);
    });
}

if (!fs.existsSync(path.join(ROOT, 'demos', 'catalog.js'))) {
    console.log('demos/catalog.js not found - building it first...');
    require('./build-demo-catalog.js');
}
listen(0);
