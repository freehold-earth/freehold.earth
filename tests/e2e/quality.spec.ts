import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PAGES } from './pages';

for (const path of PAGES) {
  test.describe(`page ${path}`, () => {
    test('makes no third-party requests', async ({ page, baseURL }) => {
      const host = new URL(baseURL!).host;
      const foreign: string[] = [];
      page.on('request', (req) => {
        const url = new URL(req.url());
        if (url.protocol.startsWith('http') && url.host !== host) foreign.push(req.url());
      });
      await page.goto(path, { waitUntil: 'networkidle' });
      expect(foreign).toEqual([]);
    });

    test('has no serious accessibility issues', async ({ page }) => {
      await page.goto(path);
      const { violations } = await new AxeBuilder({ page }).analyze();
      const serious = violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''));
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
    });

    test('does not scroll horizontally at 320px', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await page.goto(path);
      const width = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(width).toBeLessThanOrEqual(320);
    });

    test('has exactly one h1 and a title', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('h1')).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(0);
    });
  });
}

test.describe('site shell', () => {
  test('header nav has every NAV label', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main' });
    for (const label of ['How it works', 'Communities', 'Build', 'Manifesto', 'GitHub']) {
      await expect(nav.getByRole('link', { name: label })).toBeVisible();
    }
  });

  test('focus is visible on links in main', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('main a').first();
    await link.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    const style = await link.evaluate((el) => {
      const s = getComputedStyle(el);
      return { style: s.outlineStyle, width: parseFloat(s.outlineWidth) };
    });
    expect(style.style).not.toBe('none');
    expect(style.width).toBeGreaterThanOrEqual(2);
  });

  test('footer states the no-tracking promise', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toContainText(
      'No trackers. No cookies. No third-party requests.',
    );
  });
});
