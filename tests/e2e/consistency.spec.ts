import { test, expect, type Page } from '@playwright/test';

const PAGES = ['/', '/build/', '/communities/', '/manifesto/'];

const sections = (page: Page) =>
  page.locator('main > section').evaluateAll((els) =>
    els.map((el) => {
      const s = getComputedStyle(el);
      return { bg: s.backgroundColor, grid: s.backgroundImage !== 'none' };
    }),
  );

test('the first nav item goes to the top of the homepage', async ({ page }) => {
  await page.goto('/communities/');
  await expect(
    page.getByRole('navigation', { name: 'Main' }).getByRole('link').first(),
  ).toHaveAttribute('href', '/');
});

test('intro tagline and title sit at the same height on every page', async ({ page }) => {
  const tops: string[] = [];
  for (const path of PAGES) {
    await page.goto(path);
    const hero = page.locator('main > section').first();
    const kicker = await hero.locator('.kicker').boundingBox();
    const title = await hero.locator('h1').boundingBox();
    tops.push(`${Math.round(kicker!.y)}/${Math.round(title!.y)}`);
  }
  expect(new Set(tops).size, tops.join(' ')).toBe(1);
});

test('each page has its own intro colour, shared with its header', async ({ page }) => {
  const colours: string[] = [];
  for (const path of PAGES) {
    await page.goto(path);
    const header = await page
      .locator('header.site-header')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    const [hero] = await sections(page);
    expect(header, path).toBe(hero.bg);
    expect(hero.grid, path).toBe(true);
    colours.push(hero.bg);
  }
  expect(new Set(colours).size).toBe(PAGES.length);
  // Manifesto uses the deeper sage chosen by the owner.
  expect(colours[3]).toBe('rgb(174, 191, 156)');
});

test('every page ends with the dark status section, then the clay call to action', async ({
  page,
}) => {
  const ends: string[] = [];
  for (const path of PAGES) {
    await page.goto(path);
    const all = await sections(page);
    ends.push(
      all
        .slice(-2)
        .map((s) => s.bg)
        .join(' > '),
    );
  }
  expect(new Set(ends).size, ends.join(' | ')).toBe(1);
  // Soil then clay. Not green then gold: over the black footer that reads as a flag.
  expect(ends[0]).toBe('rgb(43, 36, 32) > rgb(212, 115, 74)');
});

test('light body sections always carry the plot grid', async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    const bare = (await sections(page))
      .slice(1)
      .filter((s) => s.bg === 'rgb(246, 239, 228)' && !s.grid);
    expect(bare, path).toEqual([]);
  }
});

test('status tags stay close to their labels', async ({ page }) => {
  for (const path of ['/', '/build/', '/communities/']) {
    await page.goto(path);
    const gaps = await page.locator('.status-wrap:has(.item)').evaluateAll((els) =>
      els.map((el) => {
        // Measure from the end of the words, not the edge of the label's box.
        const range = document.createRange();
        range.selectNodeContents(el.querySelector('.item')!);
        const textRight = Math.max(...[...range.getClientRects()].map((r) => r.right));
        return el.querySelector('.tag')!.getBoundingClientRect().left - textRight;
      }),
    );
    expect(Math.max(...gaps), path).toBeLessThan(200);
  }
});
