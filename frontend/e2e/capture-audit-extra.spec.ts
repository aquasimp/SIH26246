import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';

test('Capture extra audit screenshots (dark mode, mid-viewports, Tamil, hover crops)', async ({ page }) => {
  test.setTimeout(90000);
  const stage = process.env.AUDIT_STAGE || 'after-identity';
  const auditDir = path.resolve(__dirname, `../../docs/ui-audit/${stage}`);
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  // 1. Dark mode captures at 1440
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'dark');
  });

  const darkTargets = [
    { url: '/', name: 'landing' },
    { url: '/overview', name: 'overview' },
    { url: '/scenarios?preset=rec01', name: 'scenarios' },
    { url: '/gaps', name: 'gaps' },
    { url: '/data-health', name: 'data-health' },
  ];

  for (const t of darkTargets) {
    await page.goto(t.url, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    });
    await page.waitForTimeout(600);
    const p = path.join(auditDir, `${t.name}-dark-1440.png`);
    await page.screenshot({ path: p, fullPage: false });
    console.log(`Captured dark: ${p}`);
  }

  // Clear dark mode for light captures
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  });

  // 2. 1024 and 768 widths for /overview and /scenarios
  const midWidths = [
    { name: '1024', width: 1024, height: 800 },
    { name: '768', width: 768, height: 1024 },
  ];
  const midTargets = [
    { url: '/overview', name: 'overview' },
    { url: '/scenarios?preset=rec01', name: 'scenarios' },
  ];

  for (const vp of midWidths) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    for (const t of midTargets) {
      await page.goto(t.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      const p = path.join(auditDir, `${t.name}-${vp.name}-en.png`);
      await page.screenshot({ path: p, fullPage: false });
      console.log(`Captured mid-width: ${p}`);
    }
  }

  // 3. Language 'ta' for /overview at 1440
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.context().addCookies([{ name: 'kaushalyuva-lang', value: 'ta', domain: 'localhost', path: '/' }]);
  await page.goto('/overview', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const taPath = path.join(auditDir, `overview-1440-ta.png`);
  await page.screenshot({ path: taPath, fullPage: false });
  console.log(`Captured Tamil: ${taPath}`);

  // 4. Hover crop of .liquid-glass-card and nav pill
  await page.context().addCookies([{ name: 'kaushalyuva-lang', value: 'en', domain: 'localhost', path: '/' }]);
  await page.goto('/overview', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Check nav pill
  const navPill = page.locator('.floating-nav-pill, nav.floating-nav-pill, header').first();
  if (await navPill.count() > 0) {
    await navPill.hover();
    await page.waitForTimeout(300);
    const navPillPath = path.join(auditDir, `hover-nav-pill.png`);
    await navPill.screenshot({ path: navPillPath });
    console.log(`Captured nav pill hover: ${navPillPath}`);
  }

  // Check liquid-glass-card
  const card = page.locator('.liquid-glass-card, [class*="liquid-glass"]').first();
  if (await card.count() > 0) {
    await card.hover();
    await page.waitForTimeout(300);
    const cardPath = path.join(auditDir, `hover-liquid-card.png`);
    await card.screenshot({ path: cardPath });
    console.log(`Captured liquid card hover: ${cardPath}`);
  }
});

test('Automated identity quality checks (font-floor, scrollWidth, backdropFilter, preset snapshot, axe)', async ({ page }) => {
  // 1. Backdrop filters
  await page.goto('/overview', { waitUntil: 'networkidle' });
  const backdropSupported = await page.evaluate(() => {
    return {
      standard: CSS.supports('backdrop-filter', 'blur(28px)'),
      webkit: CSS.supports('-webkit-backdrop-filter', 'blur(28px)')
    };
  });
  console.log('CSS.supports backdrop-filter:', backdropSupported);

  // 2. Scenario Studio numbers with preset=rec01
  await page.goto('/scenarios?preset=rec01', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const seatsText = await page.locator('text=97').first().isVisible();
  expect(seatsText).toBeTruthy();

  // 3. Axe dark mode check on /overview
  await page.goto('/overview', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(300);
  const accessibilityScanResults = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])
    .analyze();
  expect(accessibilityScanResults.violations.filter(v => v.impact === 'critical')).toEqual([]);

  // 4. font size floor in <main> for EN (>= 11px)
  for (const route of ['/overview', '/scenarios', '/data-health']) {
    await page.context().addCookies([{ name: 'kaushalyuva-lang', value: 'en', domain: 'localhost', path: '/' }]);
    await page.goto(route, { waitUntil: 'networkidle' });
    const sub11 = await page.evaluate(() => {
      const main = document.querySelector('main');
      if (!main) return [];
      const offending: string[] = [];
      main.querySelectorAll('*').forEach((el) => {
        // Only inspect leaf text elements
        if (el.children.length === 0 && el.textContent?.trim() && !['SCRIPT', 'STYLE', 'SVG', 'PATH'].includes(el.tagName)) {
          const fs = parseFloat(window.getComputedStyle(el).fontSize);
          if (fs < 10.9) {
            offending.push(`${el.tagName}.${el.className}: "${el.textContent?.trim().slice(0, 30)}" (${fs}px)`);
          }
        }
      });
      return offending;
    });
    expect(sub11).toEqual([]);
  }

  // 5. scrollWidth === innerWidth at 390, 768, 1024, 1440 across routes
  for (const w of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width: w, height: 800 });
    for (const route of ['/overview', '/scenarios', '/data-health', '/gaps']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const overflow = await page.evaluate((width) => {
        return document.documentElement.scrollWidth <= width + 2;
      }, w);
      expect(overflow, `Overflow detected on ${route} at width ${w}`).toBeTruthy();
    }
  }

  // 6. font size floor in <main> for HI (>= 12px)
  for (const route of ['/overview', '/scenarios', '/data-health']) {
    await page.context().addCookies([{ name: 'kaushalyuva-lang', value: 'hi', domain: 'localhost', path: '/' }]);
    await page.goto(route, { waitUntil: 'networkidle' });
    const sub12 = await page.evaluate(() => {
      const main = document.querySelector('main');
      if (!main) return [];
      const offending: string[] = [];
      main.querySelectorAll('*').forEach((el) => {
        if (el.children.length === 0 && el.textContent?.trim() && !['SCRIPT', 'STYLE', 'SVG', 'PATH'].includes(el.tagName)) {
          const fs = parseFloat(window.getComputedStyle(el).fontSize);
          if (fs < 11.9) {
            offending.push(`${el.tagName}.${el.className}: "${el.textContent?.trim().slice(0, 30)}" (${fs}px)`);
          }
        }
      });
      return offending;
    });
    expect(sub12).toEqual([]);
  }
});
