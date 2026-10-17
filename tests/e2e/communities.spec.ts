import { test, expect } from '@playwright/test';

test.describe('communities page', () => {
  test('leads with the datacentre argument as its h1', async ({ page }) => {
    await page.goto('/communities/');
    await expect(page.locator('h1')).toHaveText('The datacentre is yours.');
  });

  test('labels every cost as an estimate', async ({ page }) => {
    await page.goto('/communities/');
    const costs = page.locator('[data-cost]');
    expect(await costs.count()).toBeGreaterThan(0);
    for (const cost of await costs.all()) await expect(cost).toContainText('estimate');
  });

  test('is honest that the node kit is planned and offers a conversation', async ({ page }) => {
    await page.goto('/communities/');
    await expect(page.locator('[data-state="planned"]').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /talk to us/i }).first()).toBeVisible();
  });

  test('says precedents are not affiliated', async ({ page }) => {
    await page.goto('/communities/');
    await expect(page.locator('main')).toContainText('not affiliated');
  });
});
