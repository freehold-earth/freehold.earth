// Renders public/og.png (1200x630) from an inline template using the self-hosted fonts.
// Run when the headline or brand changes: node scripts/make-og.mjs
import { chromium } from '@playwright/test';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
// Node 24 strips TypeScript types, so the brand file is imported directly.
import { colourVars, markShapes } from '../src/data/brand.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const font = (pkg, file) =>
  pathToFileURL(join(root, 'node_modules/@fontsource', pkg, 'files', file)).href;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
:root{${colourVars()}}
@font-face{font-family:'Inter Tight';font-weight:800;src:url(${font('inter-tight', 'inter-tight-latin-800-normal.woff2')})}
@font-face{font-family:'JetBrains Mono';font-weight:600;src:url(${font('jetbrains-mono', 'jetbrains-mono-latin-600-normal.woff2')})}
body{margin:0;width:1200px;height:630px;background:var(--clay);color:var(--ink);
  background-image:linear-gradient(color-mix(in srgb,var(--ink) 7%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--ink) 7%,transparent) 1px,transparent 1px);
  background-size:44px 44px;font-family:'Inter Tight';display:flex;flex-direction:column;justify-content:space-between;padding:72px 80px;box-sizing:border-box}
.top{display:flex;align-items:center;gap:18px;font:600 26px 'JetBrains Mono';letter-spacing:.08em}
h1{font-weight:800;font-size:96px;line-height:1;letter-spacing:-.035em;margin:0;max-width:11ch}
.foot{font:600 22px 'JetBrains Mono';letter-spacing:.07em;text-transform:uppercase}
</style></head><body>
<div class="top"><svg width="44" height="44" viewBox="0 0 22 22">${markShapes()}</svg>FREEHOLD</div>
<h1>Your data. Your rules. Your community.</h1>
<div class="foot">freehold.earth · open source · local-first</div>
</body></html>`;

const dir = mkdtempSync(join(tmpdir(), 'og-'));
const file = join(dir, 'og.html');
writeFileSync(file, html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(file).href);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(root, 'public/og.png') });
await browser.close();
console.log('Wrote public/og.png');
