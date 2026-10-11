import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Capture EN and HI screenshots at 1440 and 375 for Landing, Overview, and Scenario Studio', async ({ page }) => {
  const stage = process.env.AUDIT_STAGE || 'before';
  const auditDir = path.resolve(__dirname, `../../docs/ui-audit/${stage}`);
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  const targets = [
    { url: '/', name: 'landing' },
    { url: '/overview', name: 'overview' },
    { url: '/scenarios?preset=rec01', name: 'scenarios' }
  ];

  const viewports = [
    { name: '1440', width: 1440, height: 900 },
    { name: '375', width: 375, height: 812 }
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const t of targets) {
      // 1. English screenshot
      await page.context().addCookies([{ name: 'kaushalyuva-lang', value: 'en', domain: 'localhost', path: '/' }]);
      await page.goto(t.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      const enPath = path.join(auditDir, `${t.name}-${vp.name}-en.png`);
      await page.screenshot({ path: enPath, fullPage: false });
      console.log(`Captured: ${enPath}`);

      // 2. Hindi screenshot
      await page.context().addCookies([{ name: 'kaushalyuva-lang', value: 'hi', domain: 'localhost', path: '/' }]);
      await page.goto(t.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      const hiPath = path.join(auditDir, `${t.name}-${vp.name}-hi.png`);
      await page.screenshot({ path: hiPath, fullPage: false });
      console.log(`Captured: ${hiPath}`);
    }
  }
});
