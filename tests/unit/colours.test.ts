import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Every colour lives in src/data/brand.ts. Anywhere else, use the CSS tokens
// (var(--clay)) or color-mix() on them, so one edit changes the whole site.
const SOURCE_OF_TRUTH = join('src', 'data', 'brand.ts');
const ROOTS = ['src', 'scripts', 'public'];
const TEXT = /\.(astro|ts|mjs|js|css|svg|md)$/;
const RAW_COLOUR = /#[0-9a-fA-F]{3,8}\b|rgba?\(/;

function files(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return TEXT.test(name) ? [path] : [];
  });
}

describe('colours', () => {
  it('are only written out in src/data/brand.ts', () => {
    const offenders = ROOTS.flatMap(files)
      .filter((f) => f !== SOURCE_OF_TRUTH)
      .flatMap((f) =>
        readFileSync(f, 'utf8')
          .split('\n')
          .map((line, i) => [line, i] as const)
          .filter(([line]) => RAW_COLOUR.test(line.replace(/&#\d+;/g, '')))
          .map(([, i]) => `${f}:${i + 1}`),
      );
    expect(offenders).toEqual([]);
  });
});
