import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Capture Light & Dark UI Audit Screenshots for Government Presentation', async ({ page }) => {
  const auditDir = path.resolve(__dirname, '../../docs/ui-audit');
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  const routes = [
    { path: '/overview', name: 'overview' },
    { path: '/forecasts', name: 'forecasts' },
    { path: '/scenarios', name: 'scenarios' },
    { path: '/recommendations', name: 'recommendations' },
    { path: '/gaps', name: 'gaps' }
  ];

  for (const route of routes) {
    await page.goto(route.path);
    await page.waitForSelector('h1');
    await page.waitForTimeout(500);

    // Dark Mode
    const darkBtn = page.locator('button[aria-label="Dark theme"]').first();
    if (await darkBtn.isVisible()) {
      await darkBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(auditDir, `${route.name}-dark.png`), fullPage: false });
    }

    // Light Mode
    const lightBtn = page.locator('button[aria-label="Light theme"]').first();
    if (await lightBtn.isVisible()) {
      await lightBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(auditDir, `${route.name}-light.png`), fullPage: false });
    }
  }
});
