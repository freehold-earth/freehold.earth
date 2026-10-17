import { test, expect, type Page } from '@playwright/test';

const box = async (page: Page, selector: string) => (await page.locator(selector).boundingBox())!;

// Position relative to the walkthrough box, so page scrolling doesn't matter.
const within = async (page: Page, selector: string) => {
  const [outer, inner] = [await box(page, '#walkthrough figure'), await box(page, selector)];
  return { x: Math.round(inner.x - outer.x), y: Math.round(inner.y - outer.y) };
};

test.describe('walkthrough keeps its size and controls in place', () => {
  test('same height and button positions on every step', async ({ page }) => {
    await page.goto('/');
    const fig = '#walkthrough figure';
    const first = await box(page, fig);
    const nextAt = await within(page, '#walkthrough button:text-is("Next")');
    const heights = [first.height];
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Next' }).click();
      heights.push((await box(page, fig)).height);
    }
    expect(new Set(heights.map(Math.round)).size).toBe(1);
    const restartAt = await within(page, '#walkthrough button:text-is("Start again")');
    expect(restartAt).toEqual(nextAt);
  });
});

for (const width of [375, 402]) {
  test(`main nav fits on one row at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const tops = await page
      .getByRole('navigation', { name: 'Main' })
      .locator('a')
      .evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
    expect(new Set(tops).size).toBe(1);
  });
}

for (const path of ['/', '/build/', '/communities/']) {
  test(`status tags sit on the same line as their label on ${path}`, async ({ page }) => {
    await page.goto(path);
    const offsets = await page.locator('.status-wrap').evaluateAll((els) =>
      els.map((el) => {
        const label = el.querySelector('.item')!.getBoundingClientRect();
        const tag = el.querySelector('.tag')!.getBoundingClientRect();
        return Math.abs(label.top - tag.top);
      }),
    );
    expect(offsets.length).toBeGreaterThan(0);
    expect(Math.max(...offsets)).toBeLessThan(6);
  });
}
