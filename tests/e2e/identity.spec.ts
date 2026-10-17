import { test, expect } from '@playwright/test';

// One-time identities are built and used by the demo (identity/src/did.ts,
// demo/apps/user-app/src/App.tsx); the site should say so, honestly.
test('homepage explains fresh identities stop tracking', async ({ page }) => {
  await page.goto('/');
  const how = page.locator('#how');
  await expect(how).toContainText('one-time identity');
  await expect(how).toContainText('One-time identities');
});

test('build identity card shows each identity piece with its status', async ({ page }) => {
  await page.goto('/build/');
  const card = page.locator('[data-layer="identity"]');
  for (const label of [
    'One-time identities',
    'Prove it was you, when you choose',
    'Untraceable funding for one-time IDs',
    'Prove it was you, anonymously',
  ]) {
    await expect(card).toContainText(label);
  }
});

test('the diagram does not suggest one identity everywhere', async ({ page }) => {
  await page.goto('/build/');
  const identity = page.locator('.diagram .identity');
  await expect(identity).toContainText('one-time');
  await expect(identity).not.toContainText('One key, through every layer');
});

test('manifesto explains one-time identities', async ({ page }) => {
  await page.goto('/manifesto/');
  await expect(page.locator('article')).toContainText('one-time identity');
});
