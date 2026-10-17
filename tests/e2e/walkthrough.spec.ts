import { test, expect } from '@playwright/test';

const steps = (page: import('@playwright/test').Page) => page.locator('#walkthrough [data-step]');

test.describe('age-proof walkthrough', () => {
  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('shows all four steps', async ({ page }) => {
      await page.goto('/');
      await expect(steps(page)).toHaveCount(4);
      for (const step of await steps(page).all()) await expect(step).toBeVisible();
    });
  });

  test('shows one step at a time and Next advances', async ({ page }) => {
    await page.goto('/');
    await expect(steps(page).nth(0)).toBeVisible();
    await expect(steps(page).nth(1)).toBeHidden();
    const next = page.getByRole('button', { name: 'Next' });
    for (let i = 0; i < 3; i++) await next.click();
    await expect(steps(page).nth(3)).toBeVisible();
    await expect(page.locator('#walkthrough [aria-live]')).toHaveText('Step 4 of 4');
    await page.getByRole('button', { name: 'Start again' }).click();
    await expect(steps(page).nth(0)).toBeVisible();
  });

  test('buttons work from the keyboard', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Next' }).focus();
    await page.keyboard.press('Enter');
    await expect(steps(page).nth(1)).toBeVisible();
  });

  test('final step shows what the shop receives', async ({ page }) => {
    await page.goto('/');
    const last = steps(page).nth(3);
    for (const text of ['Over 21', 'Date of birth', 'Name', 'not shared']) {
      await expect(last).toContainText(text);
    }
  });

  test('has no transitions under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const duration = await steps(page)
      .nth(0)
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(duration).toBe('0s');
  });
});
