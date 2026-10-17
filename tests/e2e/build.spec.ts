import { test, expect } from '@playwright/test';

const TREE = 'https://github.com/freehold-earth/freehold/tree/main';

test.describe('build page', () => {
  test('lists each layer with a status and a link to its code', async ({ page }) => {
    await page.goto('/build/');
    for (const dir of ['context-store', 'agent', 'spec', 'contracts', 'zkp', 'identity']) {
      const layer = page.locator(`[data-layer="${dir}"]`);
      await expect(layer.locator('[data-state]').first()).toBeVisible();
      await expect(layer.locator(`a.code[href="${TREE}/${dir}"]`)).toHaveCount(1);
    }
  });

  test('links every status to where it can be checked in the repo', async ({ page }) => {
    await page.goto('/build/');
    const labels = page.locator('.layer .status-wrap');
    expect(await labels.count()).toBeGreaterThan(10);
    for (const label of await labels.all()) {
      await expect(label.locator('a.item')).toHaveAttribute(
        'href',
        /^https:\/\/github\.com\/freehold-earth\/freehold\/(tree|blob)\/main\//,
      );
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

  test('has a labelled layer diagram', async ({ page }) => {
    await page.goto('/build/');
    const diagram = page.locator('.diagram');
    await expect(diagram).toHaveCount(1);
    await expect(diagram).toHaveAccessibleName(/layers/i);
  });

  test('identity is a spine through every layer, each layer its own colour', async ({ page }) => {
    await page.goto('/build/');
    const result = await page.locator('.diagram').evaluate((root) => {
      const spine = root.querySelector('.spine')!.getBoundingClientRect();
      const layers = [...root.querySelectorAll('.stack li')];
      return {
        count: layers.length,
        colours: new Set(layers.map((l) => getComputedStyle(l).backgroundColor)).size,
        pierced: layers.every((l) => {
          const r = l.getBoundingClientRect();
          return (
            spine.top <= r.top &&
            spine.bottom >= r.bottom &&
            spine.left >= r.left &&
            spine.right <= r.right
          );
        }),
      };
    });
    expect(result).toEqual({ count: 4, colours: 4, pierced: true });
  });

  test('keeps diagram text readable on a 320px phone', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/build/');
    const heights = await page
      .locator('.diagram')
      .evaluate((root) =>
        [...root.querySelectorAll('text, span, p, strong')]
          .filter((el) => el.textContent?.trim())
          .map((el) => el.getBoundingClientRect().height),
      );
    expect(heights.length).toBeGreaterThan(0);
    expect(Math.min(...heights)).toBeGreaterThanOrEqual(11);
  });
});
