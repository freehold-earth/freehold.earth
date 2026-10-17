import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith('.html') ? [path] : [];
  });
}

describe('built site for GitHub Pages', () => {
  it('has the custom domain CNAME', () => {
    expect(readFileSync(join(DIST, 'CNAME'), 'utf8')).toBe('freehold.earth\n');
  });

  it('has a real 404 page', () => {
    expect(existsSync(join(DIST, '404.html'))).toBe(true);
  });

  it('uses directory-style pages so /build and /build/ both work', () => {
    for (const page of ['build', 'communities', 'manifesto']) {
      expect(existsSync(join(DIST, page, 'index.html')), page).toBe(true);
    }
  });

  it('loads every asset from the site itself', () => {
    const foreign: string[] = [];
    for (const file of htmlFiles(DIST)) {
      const html = readFileSync(file, 'utf8');
      const assets = [
        ...html.matchAll(/<(?:script|img|source|iframe)[^>]+src="([^"]+)"/g),
        ...html.matchAll(
          /<link[^>]+rel="(?:stylesheet|icon|preload|modulepreload)"[^>]+href="([^"]+)"/g,
        ),
        ...html.matchAll(
          /<link[^>]+href="([^"]+)"[^>]+rel="(?:stylesheet|icon|preload|modulepreload)"/g,
        ),
      ].map((m) => m[1]);
      for (const url of assets) {
        if (/^(https?:)?\/\//.test(url)) foreign.push(`${file}: ${url}`);
      }
    }
    expect(foreign).toEqual([]);
  });

  it('names chains and contract languages only on the Build page', () => {
    const offenders: string[] = [];
    for (const file of htmlFiles(DIST)) {
      if (file.endsWith(join('build', 'index.html'))) continue;
      const text = readFileSync(file, 'utf8').replace(/<[^>]+>/g, ' ');
      for (const word of ['Cardano', 'Midnight', 'Aiken']) {
        if (text.includes(word)) offenders.push(`${file}: ${word}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
