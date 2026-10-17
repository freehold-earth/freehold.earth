// Turns status sources and links into GitHub API URLs so scripts/check-sources.mjs
// can confirm they still exist in the freehold repo.
import type { StatusItem } from './status';

const REPO = 'freehold-earth/freehold';
const API = `https://api.github.com/repos/${REPO}`;
const TREE_PREFIX = `https://github.com/${REPO}/tree/main/`;
const BLOB_PREFIX = `https://github.com/${REPO}/blob/main/`;

export function sourceUrl(source: string): string {
  const path = source.split('#')[0];
  if (path.startsWith('tag:')) return `${API}/git/ref/tags/${path.slice(4)}`;
  for (const prefix of [TREE_PREFIX, BLOB_PREFIX]) {
    if (path.startsWith(prefix)) return `${API}/contents/${path.slice(prefix.length)}`;
  }
  if (path.startsWith('https://')) return path;
  return `${API}/contents/${path}`;
}

export function statusUrls(items: readonly StatusItem[]): string[] {
  const raw = items.flatMap((s) => [s.source, ...(s.link ? [s.link] : [])]);
  return [...new Set(raw)].map(sourceUrl);
}
