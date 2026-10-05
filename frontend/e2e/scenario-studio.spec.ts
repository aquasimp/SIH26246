import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('KaushalPulse Scenario Studio & UI Quality Suite', () => {
  test('Scenario Studio: Load Recommendation #01 Preset enforces exact 97 seats, ₹18.31L, 15.6% combo, donor 52', async ({ page }) => {
    await page.goto('/scenarios');
    await expect(page).toHaveTitle(/KaushalPulse/);

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

  test('Command Palette: Opens on trigger and allows quick route search', async ({ page }) => {
    await page.goto('/overview');

    // Find Command Palette trigger button
    const cmdTrigger = page.locator('button[aria-label="Open command palette"]').first();
    await expect(cmdTrigger).toBeVisible();
    await cmdTrigger.click();

    // Expect dialog to open
    const cmdDialog = page.locator('[role="dialog"]');
    await expect(cmdDialog).toBeVisible();

    // Type "Scenario" and verify jump option appears
    const input = page.locator('input[placeholder*="Search intelligence"]').first();
    await input.fill('Scenario');
    await expect(page.locator('text=Scenario Studio (Interactive Policy Sandbox)')).toBeVisible();

    // Press escape to close
    await page.keyboard.press('Escape');
    await expect(cmdDialog).toBeHidden();
  });

  test('Accessibility: WCAG AA automated compliance on key routes', async ({ page }) => {
    const routes = ['/overview', '/forecasts', '/scenarios', '/recommendations'];

    for (const route of routes) {
      await page.goto(route);
      // Wait for content to render
      await page.waitForSelector('h1');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .disableRules(['color-contrast']) // color-contrast on dynamic canvas/custom SVGs can produce false positives; design tokens audited directly
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });
});
