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

    test('has description, canonical, icon and an absolute og:image', async ({ page }) => {
      await page.goto(path);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description?.trim().length).toBeGreaterThan(20);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(path === '/404.html' ? 0 : 1);
      await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
      const og = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(og).toMatch(/^https:\/\/freehold\.earth\//);
    });

    test('focus outlines contrast with their background', async ({ page }) => {
      await page.goto(path);
      const failures = await page.evaluate(() => {
        const rgb = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number);
        const lum = ([r, g, b]: number[]) => {
          const f = (v: number) => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
          };
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        };
        const ratio = (a: number[], b: number[]) => {
          const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
          return (x + 0.05) / (y + 0.05);
        };
        const background = (el: Element | null): number[] => {
          for (; el; el = el.parentElement) {
            const c = rgb(getComputedStyle(el).backgroundColor);
            if (c.length >= 3 && (c.length < 4 || c[3] === 1)) return c.slice(0, 3);
          }
          return [255, 255, 255];
        };
        const out: string[] = [];
        for (const el of document.querySelectorAll<HTMLElement>('a[href], button')) {
          if (!el.offsetParent || getComputedStyle(el).visibility === 'hidden') continue;
          el.focus({ focusVisible: true } as FocusOptions);
          const s = getComputedStyle(el);
          if (s.outlineStyle === 'none') {
            out.push(`${el.textContent?.trim()}: no outline`);
            continue;
          }
          // The outline sits outside the element, so compare with the parent's background.
          const r = ratio(rgb(s.outlineColor).slice(0, 3), background(el.parentElement));
          if (r < 3) out.push(`${el.textContent?.trim()}: ${r.toFixed(2)}`);
        }
        return out;
      });
      expect(failures).toEqual([]);
    });

    test('does not repeat a heading', async ({ page }) => {
      await page.goto(path);
      const headings = await page.locator('main h1, main h2').allInnerTexts();
      expect(headings.length).toBe(new Set(headings).size);
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
    for (const label of ['Home', 'Communities', 'Build', 'Manifesto', 'GitHub']) {
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
