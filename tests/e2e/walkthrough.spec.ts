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
    for (const text of ['Over 21', 'Date of birth', 'Name', 'not shared', 'one-time ID']) {
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

test('step counter is not announced on page load', async ({ page }) => {
  // Records arrive in order, so track when each element becomes live and count
  // only text changes made to an element after that point.
  await page.addInitScript(() => {
    const w = window as unknown as { liveChanges: number };
    w.liveChanges = 0;
    const live = new WeakSet<Node>();
    new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === 'attributes' && r.attributeName === 'aria-live') live.add(r.target);
        else if (r.type !== 'attributes') {
          for (let n: Node | null = r.target; n; n = n.parentNode) {
            if (live.has(n)) w.liveChanges++;
          }
        }
      }
    }).observe(document, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['aria-live'],
    });
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const w = () => (window as unknown as { liveChanges: number }).liveChanges;
  expect(await page.evaluate(w)).toBe(0);
  // The observer does see changes the reader causes.
  await page.getByRole('button', { name: 'Next' }).click();
  expect(await page.evaluate(w)).toBeGreaterThan(0);
});

test.describe('walkthrough focus', () => {
  test('keeps focus on a visible button at the last step', async ({ page }) => {
    await page.goto('/');
    const next = page.getByRole('button', { name: 'Next' });
    await next.focus();
    for (let i = 0; i < 3; i++) await page.keyboard.press('Enter');
    const focused = await page.evaluate(() => document.activeElement?.textContent);
    expect(focused).toBe('Start again');
  });

  test('keeps focus on a visible button after going back to the first step', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Back' }).focus();
    await page.keyboard.press('Enter');
    const focused = await page.evaluate(() => document.activeElement?.textContent);
    expect(focused).toBe('Next');
  });
});
