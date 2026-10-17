// Minimal static server for dist/ that mimics GitHub Pages: directory index.html,
// extensionless paths, and dist/404.html with a 404 status for anything missing.
// Used by Playwright because `astro preview` backgrounds itself under AI agents.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const ROOT = new URL('../dist/', import.meta.url).pathname;
const PORT = Number(process.env.PORT ?? 4322);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

async function resolveFile(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  const base = join(ROOT, safe);
  for (const candidate of [base, join(base, 'index.html'), `${base}.html`]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // try next candidate
    }
  }
  return null;
}

createServer(async (req, res) => {
  const path = new URL(req.url ?? '/', 'http://x').pathname;
  const file = await resolveFile(path);
  if (file) {
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
    return;
  }
  const notFound = await resolveFile('/404.html');
  res.writeHead(404, { 'content-type': TYPES['.html'] });
  res.end(notFound ? await readFile(notFound) : 'Not found');
}).listen(PORT, () => console.log(`Serving dist on http://localhost:${PORT}`));
