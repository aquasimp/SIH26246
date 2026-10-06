import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Capture Light & Dark UI Audit Screenshots for Government Presentation', async ({ page }) => {
  const auditDir = path.resolve(__dirname, '../../docs/ui-audit');
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  const routes = [
    { path: '/', name: 'hero' },
    { path: '/overview', name: 'overview' },
    { path: '/forecasts', name: 'forecasts' },
    { path: '/scenarios', name: 'scenarios' },
    { path: '/recommendations', name: 'recommendations' },
    { path: '/gaps', name: 'gaps' },
    { path: '/alerts', name: 'alerts' },
    { path: '/districts', name: 'districts' }
  ];

  for (const route of routes) {
    await page.goto(route.path);
    await page.waitForSelector('h1');
    await page.waitForTimeout(300);

    // English Light Mode
    const lightBtn = page.locator('button[aria-label="Light theme"]').first();
    if (await lightBtn.isVisible()) {
      await lightBtn.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(auditDir, `${route.name}-light-en.png`), fullPage: false });
    }

    // English Dark Mode
    const darkBtn = page.locator('button[aria-label="Dark theme"]').first();
    if (await darkBtn.isVisible()) {
      await darkBtn.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(auditDir, `${route.name}-dark-en.png`), fullPage: false });
    }

    // Hindi Dark Mode
    const hiBtn = page.locator('button', { hasText: 'हिन्दी' }).first();
    if (await hiBtn.isVisible()) {
      await hiBtn.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(auditDir, `${route.name}-dark-hi.png`), fullPage: false });
    }

    // Hindi Light Mode
    if (await lightBtn.isVisible()) {
      await lightBtn.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(auditDir, `${route.name}-light-hi.png`), fullPage: false });
    }

    // Reset back to English for next route
    const enBtn = page.locator('button', { hasText: 'EN' }).first();
    if (await enBtn.isVisible()) {
      await enBtn.click();
      await page.waitForTimeout(200);
    }
  }
});
