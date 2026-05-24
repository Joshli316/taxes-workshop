const { test, expect } = require('@playwright/test');

test('navigate all 13 slides', async ({ page }) => {
  await page.goto('/');
  for (let i = 1; i <= 13; i++) {
    await expect(page.locator('.slide.active')).toHaveAttribute('id', `slide-${i}`);
    if (i < 13) {
      if (i === 6) await page.click('#reveal-btn-6');
      if (i === 10) {
        await page.click('#reveal-btn-q1');
        await page.click('#reveal-btn-q2');
      }
      await page.click('#nextBtn');
    }
  }
});

test('language toggle persists across navigation', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('#langToggle')).toHaveText('中文');
  await page.click('#langToggle');
  await expect(page.locator('#langToggle')).toHaveText('EN');
  await page.goto('/resources.html');
  await expect(page.locator('#langToggle')).toHaveText('EN');
});

test('reveal button gates activity slide advance', async ({ page }) => {
  await page.goto('/');
  for (let i = 0; i < 5; i++) await page.click('#nextBtn');
  await expect(page.locator('.slide.active')).toHaveAttribute('id', 'slide-6');
  await expect(page.locator('#nextBtn')).toBeDisabled();
  await page.click('#reveal-btn-6');
  await expect(page.locator('#nextBtn')).toBeEnabled();
});

test('quiz multi-phase reveal works', async ({ page }) => {
  await page.goto('/');
  for (let i = 0; i < 5; i++) await page.click('#nextBtn');
  await page.click('#reveal-btn-6');
  for (let i = 0; i < 4; i++) await page.click('#nextBtn');
  await expect(page.locator('.slide.active')).toHaveAttribute('id', 'slide-10');
  await expect(page.locator('#nextBtn')).toBeDisabled();
  await page.click('#reveal-btn-q1');
  await expect(page.locator('#q1-answer')).toBeVisible();
  await expect(page.locator('#nextBtn')).toBeDisabled();
  await page.click('#reveal-btn-q2');
  await expect(page.locator('#q2-answer')).toBeVisible();
  await expect(page.locator('#nextBtn')).toBeEnabled();
});

test('home button returns to slide 1', async ({ page }) => {
  await page.goto('/');
  await page.click('#nextBtn');
  await page.click('#nextBtn');
  await expect(page.locator('.slide.active')).toHaveAttribute('id', 'slide-3');
  await page.click('#homeBtn');
  await expect(page.locator('.slide.active')).toHaveAttribute('id', 'slide-1');
});

test('no console errors on either page', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`); });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.goto('/resources.html');
  await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]);
});
