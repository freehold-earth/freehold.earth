// Confirms every status source still exists in the freehold repo (Review Focus 5).
// Repo paths are checked with the contents API, `tag:` sources with the refs API.
import { readFileSync } from 'node:fs';

const REPO = 'freehold-earth/freehold';
const text = readFileSync(new URL('../src/data/status.ts', import.meta.url), 'utf8');
const sources = [...text.matchAll(/source:\s*'([^']+)'/g)].map((m) => m[1]);

const headers = { accept: 'application/vnd.github+json', 'user-agent': 'freehold-site' };
if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

function urlFor(source) {
  if (source.startsWith('https://')) return source;
  const path = source.split('#')[0];
  if (path.startsWith('tag:')) {
    return `https://api.github.com/repos/${REPO}/git/ref/tags/${path.slice(4)}`;
  }
  return `https://api.github.com/repos/${REPO}/contents/${path}`;
}

const failures = [];
for (const source of new Set(sources)) {
  const res = await fetch(urlFor(source), { headers, method: 'GET' });
  if (!res.ok) failures.push(`${source} (${res.status})`);
}

if (failures.length) {
  console.error(`Status sources not found:\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`All ${new Set(sources).size} status sources found.`);
