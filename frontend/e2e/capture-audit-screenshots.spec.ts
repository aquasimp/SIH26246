import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Capture EN and HI screenshots at 1440 and 390 for Landing and Scenario Studio', async ({ page }) => {
  const auditDir = path.resolve(__dirname, '../../docs/ui-audit');
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  const targets = [
    { url: '/', name: 'landing' },
    { url: '/scenarios?preset=rec01', name: 'scenarios' }
  ];

  const viewports = [
    { name: '1440', width: 1440, height: 900 },
    { name: '390', width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const t of targets) {
      // 1. English screenshot
      await page.context().addCookies([{ name: 'kaushalyuva-lang', value: 'en', domain: 'localhost', path: '/' }]);
      await page.goto(t.url, { waitUntil: 'networkidle' });
      const enBtn = page.locator('button', { hasText: 'EN' }).first();
      if (await enBtn.isVisible()) {
        await enBtn.click();
        await page.waitForTimeout(300);
      }
      await page.waitForTimeout(400);
      const enPath = path.join(auditDir, `${t.name}-${vp.name}-en.png`);
      await page.screenshot({ path: enPath, fullPage: false });
      console.log(`Captured: ${enPath}`);

      // 2. Hindi screenshot
      await page.context().addCookies([{ name: 'kaushalyuva-lang', value: 'hi', domain: 'localhost', path: '/' }]);
      await page.goto(t.url, { waitUntil: 'networkidle' });
      const hiBtn = page.locator('button', { hasText: 'हिन्दी' }).first();
      if (await hiBtn.isVisible()) {
        await hiBtn.click();
        await page.waitForTimeout(300);
      }
      await page.waitForTimeout(400);
      const hiPath = path.join(auditDir, `${t.name}-${vp.name}-hi.png`);
      await page.screenshot({ path: hiPath, fullPage: false });
      console.log(`Captured: ${hiPath}`);
    }
  }
});

