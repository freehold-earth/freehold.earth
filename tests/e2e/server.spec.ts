import { test, expect } from '@playwright/test';

// The test server stands in for GitHub Pages, so it must behave like it.
test.describe('Pages-like test server', () => {
  test('redirects a directory without a trailing slash', async ({ request }) => {
    const res = await request.get('/build', { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(res.headers()['location']).toBe('/build/');
  });

  test('rejects a malformed URL and keeps serving', async ({ request }) => {
    expect((await request.get('/%E0')).status()).toBe(400);
    expect((await request.get('/')).status()).toBe(200);
  });

  test('serves the branded 404 for unknown paths', async ({ request }) => {
    const res = await request.get('/no-such-page/');
    expect(res.status()).toBe(404);
    expect(await res.text()).toContain('This plot is empty.');
  });
});

test('404 page is not indexed', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});
