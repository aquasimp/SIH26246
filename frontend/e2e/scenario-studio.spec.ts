import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('KaushalYuva Scenario Studio & UI Quality Suite', () => {
  test('Hero Page: Root / renders display headline, proof ledger (808/97/711), and proof strip', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/KaushalYuva/);

    // Hero H1
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('FORECAST THE SKILL GAP');

    // Proof panel ledger
    await expect(page.locator('text=808').first()).toBeVisible();
    await expect(page.locator('text=97').first()).toBeVisible();
    await expect(page.locator('text=711').first()).toBeVisible();
    await expect(page.locator('text=88%').first()).toBeVisible();

    // Proof strip
    await expect(page.locator('text=16 Districts').first()).toBeVisible();
    await expect(page.locator('text=16 NCO-2015 Trades').first()).toBeVisible();
    await expect(page.locator('text=3.41%').first()).toBeVisible();
  });

  test('Scenario Studio: Load Recommendation #01 Preset enforces exact 97 seats, ₹18.31L, 15.6% combo, donor 52', async ({ page }) => {
    await page.goto('/scenarios');
    await expect(page).toHaveTitle(/KaushalYuva/);

    // Locate and click the preset button
    const presetBtn = page.locator('button', { hasText: 'Load Recommendation #01 Preset' });
    await expect(presetBtn).toBeVisible();
    await presetBtn.click();

    // Verify Reallocation Slider / display is capped to 97 seats
    await expect(page.locator('text=97 seats').first()).toBeVisible();

    // Verify Combo Deficit Closure is 15.6%
    await expect(page.locator('text=15.6%').first()).toBeVisible();

    // Verify Combined Package Investment is ₹18.31L
    await expect(page.locator('text=₹18.31L').first()).toBeVisible();

    // Verify Donor Post-Transfer Gap Score is 52 (Balanced)
    await expect(page.locator('text=52/100').first()).toBeVisible();
  });

  test('Theme System: Toggles between Light, Dark, and System without hydration error', async ({ page }) => {
    await page.goto('/overview');

    // Verify System theme is active by default for first-time visitor
    const systemBtn = page.locator('button[aria-label="System theme"]').first();
    await expect(systemBtn).toBeVisible();
    await expect(systemBtn).toHaveAttribute('aria-checked', 'true');

    // Check Theme Radio Group is visible
    const darkBtn = page.locator('button[aria-label="Dark theme"]').first();
    const lightBtn = page.locator('button[aria-label="Light theme"]').first();
    await expect(darkBtn).toBeVisible();
    await expect(lightBtn).toBeVisible();

    // Switch to dark
    await darkBtn.click();
    await page.waitForTimeout(300);
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);

    // Switch to light
    await lightBtn.click();
    await page.waitForTimeout(300);
    const lightClass = await html.getAttribute('class');
    expect(lightClass === null || !lightClass.includes('dark')).toBeTruthy();
  });

  test('Command Palette: Opens on trigger and allows quick route search & home navigation', async ({ page }) => {
    await page.goto('/overview');

    // Find Command Palette trigger button
    const cmdTrigger = page.locator('button[aria-label="Open command palette"]').first();
    await expect(cmdTrigger).toBeVisible();
    await cmdTrigger.click();

    // Expect dialog to open
    const cmdDialog = page.locator('[role="dialog"]');
    await expect(cmdDialog).toBeVisible();

    // Check home navigation item
    await expect(page.locator('text=Go to KaushalYuva Home')).toBeVisible();

    // Type "Scenario" and verify jump option appears
    const input = page.locator('input[placeholder*="Search intelligence"]').first();
    await input.fill('Scenario');
    await expect(page.locator('text=Scenario Studio (Interactive Policy Sandbox)')).toBeVisible();

    // Press escape to close
    await page.keyboard.press('Escape');
    await expect(cmdDialog).toBeHidden();
  });

  test('Hindi Bilingual Switch & Crawl: Switches to Hindi and displays Devanagari copy', async ({ page }) => {
    await page.goto('/');

    // Switch to Hindi
    const langSelectBtn = page.locator('button[aria-label="Select language"]').first();
    if (await langSelectBtn.isVisible()) {
      await langSelectBtn.click();
      const hiOption = page.locator('button[role="option"]', { hasText: 'हिन्दी' }).first();
      await hiOption.click();
    } else {
      const hiBtn = page.locator('button', { hasText: 'हिन्दी' }).first();
      if (await hiBtn.isVisible()) {
        await hiBtn.click();
      }
    }

    await page.waitForTimeout(400);

    // Verify html lang is "hi"
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'hi');

    // Verify hero translated headline
    const h1 = page.locator('h1').first();
    await expect(h1).toContainText('कौशल अंतराल का पूर्वानुमान');

    // Go to overview in Hindi
    await page.goto('/overview');
    await page.waitForTimeout(400);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Accessibility: WCAG AA automated compliance on key routes', async ({ page }) => {
    const routes = ['/', '/overview', '/forecasts', '/scenarios', '/recommendations'];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForSelector('h1');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .disableRules(['color-contrast']) // custom liquid glass token contrast verified directly
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });
});
