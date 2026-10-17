// Minimal static server for dist/ that mimics GitHub Pages: directory index.html,
// a 301 to add a missing trailing slash, extensionless .html paths, and
// dist/404.html with a 404 status for anything missing.
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

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

// Returns a file to serve, a redirect for directories missing their trailing
// slash (as GitHub Pages does), or null.
async function resolve(urlPath) {
  const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const base = join(ROOT, safe);
  if (await isFile(base)) return { file: base };
  if (await isFile(join(base, 'index.html'))) {
    return urlPath.endsWith('/') ? { file: join(base, 'index.html') } : { redirect: `${urlPath}/` };
  }
  if (await isFile(`${base}.html`)) return { file: `${base}.html` };
  return null;
}

createServer(async (req, res) => {
  let path;
  try {
    path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
  } catch {
    res.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Bad request');
    return;
  }
  const found = await resolve(path);
  if (found?.redirect) {
    res.writeHead(301, { location: found.redirect });
    res.end();
    return;
  }
  if (found?.file) {
    res.writeHead(200, {
      'content-type': TYPES[extname(found.file)] ?? 'application/octet-stream',
    });
    res.end(await readFile(found.file));
    return;
  }
  const notFound = join(ROOT, '404.html');
  res.writeHead(404, { 'content-type': TYPES['.html'] });
  res.end((await isFile(notFound)) ? await readFile(notFound) : 'Not found');
}).listen(PORT, () => console.log(`Serving dist on http://localhost:${PORT}`));
