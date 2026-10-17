// Confirms every status source and link still exists in the freehold repo
// (Review Focus 5). Runs weekly in CI and fails loudly when something moved.
// Node 24 strips TypeScript types, so the real data file is imported directly.
import { STATUS } from '../src/data/status.ts';
import { statusUrls } from '../src/data/sources.ts';

const headers = { accept: 'application/vnd.github+json', 'user-agent': 'freehold-site' };
if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const urls = statusUrls(STATUS);
const failures = [];
for (const url of urls) {
  const res = await fetch(url, { headers });
  if (!res.ok) failures.push(`${url} (${res.status})`);
}

if (failures.length) {
  console.error(`Status sources not found:\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`All ${urls.length} status sources and links found.`);
