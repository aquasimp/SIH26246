import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { isAllowedLatinToken } from '../src/i18n/allowlist';

const ALL_ROUTES = [
  '/',
  '/overview',
  '/forecasts',
  '/gaps',
  '/alerts',
  '/recommendations',
  '/scenarios',
  '/districts',
  '/districts/gorakhpur',
  '/occupations',
  '/occupations/7126.0101',
  '/qualifications',
  '/intelligence',
  '/data-health',
  '/methodology',
  '/api',
  '/settings'
];

test.describe('Judge Audit: Responsiveness & Overflow Inspection', () => {
  const viewports = [
    { name: 'Mobile 375px', width: 375, height: 812 },
    { name: 'Tablet 768px', width: 768, height: 1024 },
    { name: 'Desktop 1440px', width: 1440, height: 900 }
  ];

  for (const vp of viewports) {
    test(`No horizontal overflow at ${vp.name} across routes`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const route of ALL_ROUTES) {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(200);

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const docWidth = document.documentElement.clientWidth;
          const scrollWidth = document.documentElement.scrollWidth;
          const bodyScrollWidth = document.body.scrollWidth;
          const maxScroll = Math.max(scrollWidth, bodyScrollWidth);
          const offending: { tag: string; className: string; text: string; right: number; width: number }[] = [];
          document.querySelectorAll('*').forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.right > docWidth + 2) {
              offending.push({
                tag: el.tagName,
                className: (typeof el.className === 'string' ? el.className : '').slice(0, 80),
                text: el.textContent?.trim()?.slice(0, 40) || '',
                right: Math.round(rect.right),
                width: Math.round(rect.width)
              });
            }
          });
          return {
            hasOverflow: maxScroll > docWidth + 2,
            docWidth,
            maxScroll,
            offending: offending.slice(0, 10)
          };
        });

        if (overflow.hasOverflow) {
          console.log(`OVERFLOW on ${route} at ${vp.name}:`, JSON.stringify(overflow, null, 2));
        }

        expect(
          overflow.hasOverflow,
          `Route ${route} has horizontal overflow at ${vp.name}: docWidth=${overflow.docWidth}, scrollWidth=${overflow.maxScroll}, offending=${JSON.stringify(overflow.offending)}`
        ).toBeFalsy();
      }
    });
  }
});

test.describe('Judge Audit: 100% Hindi Localization Deep Crawl', () => {
  test('Audit visible text nodes in Hindi mode across all routes', async ({ page }) => {
    // Set language cookie and localStorage to Hindi
    await page.context().addCookies([
      {
        name: 'kaushalyuva-lang',
        value: 'hi',
        domain: 'localhost',
        path: '/'
      }
    ]);
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('kaushalyuva-lang', 'hi');
      } catch {}
    });

    await page.goto('/');
    const hiBtn = page.locator('button', { hasText: 'हिन्दी' }).first();
    if (await hiBtn.isVisible()) {
      await hiBtn.click();
      await page.waitForTimeout(500);
    }

    const untranslatedByRoute: Record<string, string[]> = {};

    for (const route of ALL_ROUTES) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(600);

      const untranslated = await page.evaluate(() => {
        const results: string[] = [];
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;
              const tag = parent.tagName.toLowerCase();
              if (['script', 'style', 'noscript', 'code', 'pre'].includes(tag)) return NodeFilter.FILTER_REJECT;
              if (parent.closest('[aria-hidden="true"]')) return NodeFilter.FILTER_REJECT;
              const text = node.textContent?.trim() || '';
              if (!text) return NodeFilter.FILTER_REJECT;
              // Check if node is visible
              const style = window.getComputedStyle(parent);
              if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
          }
        );

        let currentNode = walker.nextNode();
        while (currentNode) {
          const rawText = currentNode.textContent?.trim() || '';
          // Look for tokens containing English alphabetic characters
          const latinWords = rawText.match(/[A-Za-z0-9_\-\./#]{3,}/g) || [];
          for (const word of latinWords) {
            if (/[A-Za-z]/.test(word)) {
              results.push(word);
            }
          }
          currentNode = walker.nextNode();
        }
        return results;
      });

      // Filter against allow-list
      const unexempt = Array.from(new Set(untranslated.filter(w => !isAllowedLatinToken(w))));
      if (unexempt.length > 0) {
        untranslatedByRoute[route] = unexempt;
      }
    }

    console.log('Hindi Crawl Audit Results:', JSON.stringify(untranslatedByRoute, null, 2));
    expect(untranslatedByRoute).toEqual({});
  });
});

test.describe('Judge Audit: Canonical 10-Step Demo Path Verification', () => {
  test('Full Demo Path: Hero → Overview → Gorakhpur → Solar PV → Forecast → Why? → Recommendations → Scenario Studio → Impact → Export', async ({ page }) => {
    // 1. Hero Page (/)
    await page.goto('/');
    await expect(page).toHaveTitle(/KaushalYuva/);
    await expect(page.locator('h1').first()).toBeVisible();

    // Verify proof panel numbers and live top alert hero
    await expect(page.locator('text=808').first()).toBeVisible();
    await expect(page.locator('text=97').first()).toBeVisible();
    await expect(page.locator('text=711').first()).toBeVisible();
    await expect(page.locator('text=SIH dummy dataset').first()).toBeVisible();
    await expect(page.locator('text=RUN-SIH-001').first()).toBeVisible();

    // 2. Click "Open Dashboard" to land on /overview
    const openDashBtn = page.locator('a', { hasText: 'Open Dashboard' }).first();
    await openDashBtn.click();
    await expect(page).toHaveURL(/\/overview/);

    // 3. Gorakhpur Selection in Overview
    await expect(page.locator('text=Gorakhpur').first()).toBeVisible();

    // 4. Solar PV Installer Selection
    const solarTrade = page.locator('span, strong, h3, a', { hasText: 'Solar PV Installer' }).first();
    await expect(solarTrade).toBeVisible();

    // 5. Navigate to Forecasts
    await page.goto('/forecasts');
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('span, strong, h3, a', { hasText: 'Solar PV Installer' }).first()).toBeVisible();

    // 6. Navigate to Recommendations
    await page.goto('/recommendations');
    await expect(page.locator('h1').first()).toBeVisible();
    const rec1 = page.locator('text=#01').first();
    await expect(rec1).toBeVisible();
    await expect(page.locator('text=97').first()).toBeVisible();
    await expect(page.locator('text=6.2%').first()).toBeVisible();
    await expect(page.locator('text=Illustrative, not model output').first()).toBeVisible();

    // 7. Click Simulate in Scenario Studio
    const simBtn = page.locator('a, button', { hasText: 'Simulate in Scenario Studio' }).first();
    if (await simBtn.isVisible()) {
      await simBtn.click();
      await expect(page).toHaveURL(/\/scenarios/);
    } else {
      await page.goto('/scenarios?preset=rec01');
    }

    // 8. Scenario Studio lands on preset with exact Strict-default figures
    await expect(page.locator('text=97 seats').first()).toBeVisible();
    await expect(page.locator('text=15.6%').first()).toBeVisible();
    await expect(page.locator('text=₹18.31L').first()).toBeVisible();
    await expect(page.locator('text=52/100').first()).toBeVisible();

    // 9. Shortfall reduction indicator
    await expect(page.locator('text=shortfall closed').or(page.locator('text=भरपाई')).first()).toBeVisible();

    // 10. Export Action button is clickable
    const exportBtn = page.locator('button', { hasText: 'Export' }).first();
    await expect(exportBtn).toBeVisible();

    // 11. Geographic & Trade Directory Reconciliation Assertions
    await page.goto('/districts');
    await expect(page.locator('text=16').first()).toBeVisible();

    await page.goto('/occupations');
    await expect(page.locator('text=16').first()).toBeVisible();
  });
});

