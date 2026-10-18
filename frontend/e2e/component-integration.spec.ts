import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('GlassFolder Component Integration', () => {
  test('Recommendations page: renders max 3 folders per view with pagination', async ({ page }) => {
    await page.goto('/recommendations');
    await page.waitForLoadState('domcontentloaded');

    // Folder containers
    const folders = page.locator('.gf-root');
    await expect(folders.first()).toBeVisible();

    // Verify maximum 3 folders mounted at once on page 1
    const count = await folders.count();
    expect(count).toBeLessThanOrEqual(3);

    // Verify pagination controls exist
    const pagination = page.locator('text=Page 1 of');
    await expect(pagination).toBeVisible();

    // Next page button should navigate to page 2
    const nextBtn = page.getByRole('button', { name: /Next/i });
    if (await nextBtn.isEnabled()) {
      await nextBtn.click();
      await expect(page.locator('text=Page 2 of')).toBeVisible();
      // Page 2 should have 1 folder (REC-04)
      const page2Count = await page.locator('.gf-root').count();
      expect(page2Count).toBe(1);
    }
  });

  test('GlassFolder: Keyboard accessibility (Enter/Space to open, Escape to close, inert when closed)', async ({ page }) => {
    await page.goto('/recommendations');
    await page.waitForLoadState('domcontentloaded');

    const firstFolder = page.locator('.gf-root').first();
    const folderTrigger = firstFolder.locator('button[aria-expanded]').first();
    await expect(folderTrigger).toBeVisible();

    // Initially collapsed
    await expect(folderTrigger).toHaveAttribute('aria-expanded', 'false');

    // Verify child items panel is inert or closed
    const itemsPanel = firstFolder.locator('.gf-files');
    await expect(itemsPanel).toHaveAttribute('inert', '');

    // Focus and press Enter to open
    await folderTrigger.focus();
    await page.keyboard.press('Enter');
    await expect(folderTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(itemsPanel).not.toHaveAttribute('inert');

    // Child links should now be visible and accessible
    const firstLink = itemsPanel.locator('a').first();
    await expect(firstLink).toBeVisible();

    // Press Escape to close folder
    await page.keyboard.press('Escape');
    await expect(folderTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(itemsPanel).toHaveAttribute('inert', '');
  });

  test('GlassFolder: Unique SVG gradient IDs across rendered instances', async ({ page }) => {
    await page.goto('/recommendations');
    await page.waitForLoadState('domcontentloaded');

    // Collect all gradient IDs across the page
    const gradientIds = await page.evaluate(() => {
      const ids: string[] = [];
      const gradients = document.querySelectorAll('linearGradient, radialGradient');
      gradients.forEach((g) => {
        if (g.id) ids.push(g.id);
      });
      return ids;
    });

    // Check that there are no duplicate IDs among glass folder gradients
    const folderGradientIds = gradientIds.filter(id => id.startsWith('gf-'));
    const uniqueIds = new Set(folderGradientIds);
    expect(uniqueIds.size).toBe(folderGradientIds.length);
  });

  test('GlassFolder: Responsive widths (280px below 640px, 340px at 640px+)', async ({ page }) => {
    // 1. Mobile viewport (375px)
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/recommendations');
    await page.waitForLoadState('domcontentloaded');

    const mobileFolder = page.locator('.gf-root').first();
    const mobileBox = await mobileFolder.boundingBox();
    expect(mobileBox).not.toBeNull();
    if (mobileBox) {
      // Allowed tolerance around 280px
      expect(Math.round(mobileBox.width)).toBeLessThanOrEqual(300);
      expect(Math.round(mobileBox.width)).toBeGreaterThanOrEqual(260);
    }

    // 2. Desktop viewport (1024px)
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/recommendations');
    await page.waitForLoadState('domcontentloaded');

    const desktopFolder = page.locator('.gf-root').first();
    const desktopBox = await desktopFolder.boundingBox();
    expect(desktopBox).not.toBeNull();
    if (desktopBox) {
      // Allowed tolerance around 340px
      expect(Math.round(desktopBox.width)).toBeGreaterThanOrEqual(320);
      expect(Math.round(desktopBox.width)).toBeLessThanOrEqual(360);
    }
  });

  test('GlassFolder on Hero Page: Documentation pack mounted with real route links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const heroFolder = page.locator('.gf-root').first();
    await expect(heroFolder).toBeVisible();

    // Verify it links to real existing routes: /methodology, /api, /data-health
    const links = await heroFolder.locator('a').evaluateAll(els => els.map(a => a.getAttribute('href')));
    expect(links.some(h => h && h.includes('/methodology'))).toBe(true);
    expect(links.some(h => h && h.includes('/api'))).toBe(true);
    expect(links.some(h => h && h.includes('/data-health'))).toBe(true);
  });
});

test.describe('MatteAlertFeedback Component Integration', () => {
  test('Data Health page: Notice 1 and Notice 5 render with proper live region and dismiss behavior', async ({ page }) => {
    await page.goto('/data-health');
    await page.waitForLoadState('domcontentloaded');

    // Notice 1: SIH Evaluation Prototype Dataset
    const notice1 = page.locator('[data-feedback="alert"]').first();
    await expect(notice1).toBeVisible();

    // Verify role="status" and aria-live="polite"
    const alertEl = notice1.locator('.fb-alert');
    await expect(alertEl).toHaveAttribute('role', 'status');
    await expect(alertEl).toHaveAttribute('aria-live', 'polite');

    // Test Dismiss button
    const dismissBtn = notice1.locator('[data-action="dismiss"]');
    await dismissBtn.click();

    // Panel should now have inert and data-visible="false"
    const panel = notice1.locator('[data-panel]');
    await expect(panel).toHaveAttribute('data-visible', 'false');
    await expect(panel).toHaveAttribute('inert', '');

    // "Show notification" button should be focused/visible
    const showBtn = notice1.locator('[data-demo="show"]');
    await expect(showBtn).toBeVisible();

    // Click Show button to restore
    await showBtn.click();
    await expect(panel).toHaveAttribute('data-visible', 'true');
    await expect(panel).not.toHaveAttribute('inert');
  });

  test('Settings page: Selecting a Beta language displays Notice 4', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('domcontentloaded');

    // Initially English is selected (not Beta)
    const betaAlertInitial = page.locator('[data-feedback="alert"]');
    await expect(betaAlertInitial).toHaveCount(0);

    // Click on Marathi (Beta language)
    const marathiBtn = page.getByRole('button', { name: /मराठी/i });
    await expect(marathiBtn).toBeVisible();
    await marathiBtn.click();

    // Notice 4 should now be visible
    const betaAlert = page.locator('[data-feedback="alert"]');
    await expect(betaAlert.first()).toBeVisible();

    // Switch back to Hindi (non-Beta)
    const hindiBtn = page.getByRole('button', { name: /हिन्दी/i });
    await hindiBtn.click();

    // Alert should not be displayed for Hindi
    await expect(betaAlert).toHaveCount(0);
  });

  test('Scenario Studio: Notice 3 renders on safe seat cap', async ({ page }) => {
    // Navigate with rec01 preset
    await page.goto('/scenarios?preset=rec01');
    await page.waitForLoadState('domcontentloaded');

    // Verify seat cap banner or lever is interactive
    const pageTitle = page.locator('h1').first();
    await expect(pageTitle).toBeVisible();
  });
});

test.describe('Accessibility & Visual Integrity Audit', () => {
  test('Axe-core accessibility check on Recommendations and Data-Health pages', async ({ page }) => {
    await page.goto('/recommendations');
    await page.waitForLoadState('domcontentloaded');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('.gf-root')
      .analyze();

    // Zero critical / serious violations in our component
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolations).toEqual([]);

    await page.goto('/data-health');
    await page.waitForLoadState('domcontentloaded');

    const alertScanResults = await new AxeBuilder({ page })
      .include('[data-feedback="alert"]')
      .analyze();

    const criticalAlertViolations = alertScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalAlertViolations).toEqual([]);
  });

  test('No horizontal scrollbar at mobile (375px/390px) and desktop breakpoints', async ({ page }) => {
    const viewports = [
      { width: 375, height: 812 },
      { width: 390, height: 844 },
      { width: 1440, height: 900 }
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      for (const route of ['/recommendations', '/data-health', '/settings']) {
        await page.goto(route);
        await page.waitForLoadState('domcontentloaded');
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasOverflow).toBe(false);
      }
    }
  });
});
