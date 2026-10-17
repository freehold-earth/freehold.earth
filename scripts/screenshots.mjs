// Full-page PNGs of every page for owner review. Not committed output.
// Usage: pnpm build && pnpm shots   (serves dist itself)
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const PAGES = ['/', '/build/', '/communities/', '/manifesto/', '/404.html'];
const WIDTHS = [1280, 390];
const PORT = 4323;
const OUT = process.env.SHOTS_DIR ?? join(homedir(), 'Downloads/freehold-mockups/build');

mkdirSync(OUT, { recursive: true });
const server = spawn(process.execPath, ['scripts/serve-dist.mjs'], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: 'ignore',
});
await new Promise((r) => setTimeout(r, 500));

const browser = await chromium.launch();
try {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
    for (const path of PAGES) {
      await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle' });
      const name = path === '/' ? 'home' : path.replace(/[/.]|html/g, '') || 'page';
      const file = join(OUT, `${name}-${width}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(file);
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
