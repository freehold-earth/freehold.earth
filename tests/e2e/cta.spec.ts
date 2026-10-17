import { test, expect } from '@playwright/test';

const REPO_URL = 'https://github.com/freehold-earth/freehold';

test.describe('homepage calls to action', () => {
  test('gated CTAs say coming soon and point at the repo', async ({ page }) => {
    await page.goto('/');
    const gated = page.locator('[data-gated="true"]');
    expect(await gated.count()).toBeGreaterThan(0);
    for (const el of await gated.all()) {
      await expect(el).toContainText('Coming soon');
      await expect(el.locator(`a[href="${REPO_URL}"]`)).toHaveCount(1);
    }
  });

  test('every internal link in main resolves', async ({ page, request }) => {
    await page.goto('/');
    const hrefs = await page
      .locator('main a[href^="/"]')
      .evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute('href')!))]);
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      const res = await request.get(href.split('#')[0] || '/');
      expect(res.status(), href).toBe(200);
    }
  });

  test('hero offers see it work and builder doors', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('#hero');
    await expect(hero.getByRole('link', { name: 'See it work' })).toHaveAttribute(
      'href',
      '#see-it-work',
    );
    await expect(hero.getByRole('link', { name: "I'm a builder" })).toHaveAttribute(
      'href',
      '/build/',
    );
  });

  test('anchored sections exist', async ({ page }) => {
    await page.goto('/');
    for (const id of ['how', 'see-it-work', 'datacentre', 'get-involved', 'status', 'why-now']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });
});
