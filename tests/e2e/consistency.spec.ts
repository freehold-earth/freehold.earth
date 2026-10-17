import { test, expect } from '@playwright/test';

const PAGES = ['/', '/build/', '/communities/', '/manifesto/'];

test('the first nav item goes to the top of the homepage', async ({ page }) => {
  await page.goto('/communities/');
  await expect(
    page.getByRole('navigation', { name: 'Main' }).getByRole('link').first(),
  ).toHaveAttribute('href', '/');
});

test('every page opens with the same clay intro at the same height', async ({ page }) => {
  const seen: { bg: string; height: number }[] = [];
  for (const path of PAGES) {
    await page.goto(path);
    seen.push(
      await page
        .locator('main > section')
        .first()
        .evaluate((el) => ({
          bg: getComputedStyle(el).backgroundColor,
          height: Math.round(el.getBoundingClientRect().height),
        })),
    );
  }
  expect(new Set(seen.map((s) => s.bg)).size).toBe(1);
  expect(new Set(seen.map((s) => s.height)).size).toBe(1);
});

test('status tags stay close to their labels', async ({ page }) => {
  for (const path of ['/', '/build/', '/communities/']) {
    await page.goto(path);
    const gaps = await page.locator('.status-wrap:has(.item)').evaluateAll((els) =>
      els.map((el) => {
        // Measure from the end of the words, not the edge of the label's box.
        const range = document.createRange();
        range.selectNodeContents(el.querySelector('.item')!);
        const rects = [...range.getClientRects()];
        const textRight = Math.max(...rects.map((r) => r.right));
        const tag = el.querySelector('.tag')!.getBoundingClientRect();
        return tag.left - textRight;
      }),
    );
    expect(Math.max(...gaps), path).toBeLessThan(200);
  }
});
