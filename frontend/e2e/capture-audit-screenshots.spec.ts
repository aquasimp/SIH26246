import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Capture EN and HI screenshots at 1440 and 390 for Landing, Scenarios, and affected KPI screens', async ({ page }) => {
  test.setTimeout(90000);
  const stage = process.env.AUDIT_STAGE || 'after';
  const auditDir = path.resolve(__dirname, `../../docs/ui-audit/${stage}`);
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  const targets = [
    { url: '/', name: 'landing' },
    { url: '/overview', name: 'overview' },
    { url: '/scenarios?preset=rec01', name: 'scenarios' },
    { url: '/data-health', name: 'data-health' },
    { url: '/recommendations', name: 'recommendations' },
    { url: '/qualifications', name: 'qualifications' }
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
