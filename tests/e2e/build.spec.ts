import { test, expect } from '@playwright/test';

const TREE = 'https://github.com/freehold-earth/freehold/tree/main';

test.describe('build page', () => {
  test('lists each layer with a status and a link to its code', async ({ page }) => {
    await page.goto('/build/');
    for (const dir of ['context-store', 'agent', 'spec', 'contracts', 'zkp', 'identity']) {
      const layer = page.locator(`[data-layer="${dir}"]`);
      await expect(layer.locator('[data-state]').first()).toBeVisible();
      await expect(layer.locator(`a[href="${TREE}/${dir}"]`)).toHaveCount(1);
    }
  });

  test('names the chains plainly', async ({ page }) => {
    await page.goto('/build/');
    await expect(page.locator('main')).toContainText('Cardano');
    await expect(page.locator('main')).toContainText('Midnight');
  });

  test('lists all eight decision records', async ({ page }) => {
    await page.goto('/build/');
    await expect(page.locator('[data-adr]')).toHaveCount(8);
  });

  test('has an accessible layer diagram', async ({ page }) => {
    await page.goto('/build/');
    const svg = page.locator('svg[role="img"]');
    await expect(svg).toHaveCount(1);
    await expect(svg.locator('title')).toHaveCount(1);
  });
});
