import { test, expect } from '@playwright/test';

const ORIGINAL = 'https://github.com/freehold-earth/freehold/blob/main/docs/concepts/manifesto.md';

test.describe('manifesto', () => {
  test('is a 1,000 to 1,500 word web edition', async ({ page }) => {
    await page.goto('/manifesto/');
    const text = await page.locator('article').innerText();
    const words = text.split(/\s+/).filter(Boolean).length;
    expect(words).toBeGreaterThanOrEqual(1000);
    expect(words).toBeLessThanOrEqual(1500);
  });

  test('avoids militant language and old names', async ({ page }) => {
    await page.goto('/manifesto/');
    const text = (await page.locator('main').innerText()).toLowerCase();
    for (const banned of ['resistance', 'revolution', 'digital soul', 'pci', 'nightframe']) {
      expect(text, banned).not.toContain(banned);
    }
  });

  test('links to the full original, Build and Communities', async ({ page }) => {
    await page.goto('/manifesto/');
    await expect(page.locator(`main a[href="${ORIGINAL}"]`)).toHaveCount(1);
    await expect(page.locator('main a[href="/build/"]').first()).toBeVisible();
    await expect(page.locator('main a[href="/communities/"]').first()).toBeVisible();
  });
});
