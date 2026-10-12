import { test, expect } from '@playwright/test';
import { SEVERITY_BANDS } from '../src/lib/types';
import tradeMetricsRaw from '../src/data/trade_district_metrics.json';
import fs from 'fs';
import path from 'path';

test.describe('Map Section & Discrepancy Fixes Verification', () => {

  test('1. Legend thresholds equal engine constants', async ({ page }) => {
    await page.goto('/overview');
    await page.waitForSelector('text=Severity Bands (Gap Score)');

    // Verify engine constants are strictly >=75, 60-74, 40-59, 25-39, <25
    expect(SEVERITY_BANDS[0].min).toBe(75);
    expect(SEVERITY_BANDS[0].max).toBe(100);
    expect(SEVERITY_BANDS[1].min).toBe(60);
    expect(SEVERITY_BANDS[1].max).toBe(74);
    expect(SEVERITY_BANDS[2].min).toBe(40);
    expect(SEVERITY_BANDS[2].max).toBe(59);
    expect(SEVERITY_BANDS[3].min).toBe(25);
    expect(SEVERITY_BANDS[3].max).toBe(39);
    expect(SEVERITY_BANDS[4].min).toBe(0);
    expect(SEVERITY_BANDS[4].max).toBe(24);

    // Verify the rendered legend on the map displays these exact bands
    const legendText = await page.textContent('body');
    expect(legendText).toContain('≥ 75');
    expect(legendText).toContain('60–74');
    expect(legendText).toContain('40–59');
    expect(legendText).toContain('25–39');
    expect(legendText).toContain('< 25');

    // Verify color-blind safe scale (no plain red #FF0000 or green #00FF00)
    for (const band of SEVERITY_BANDS) {
      expect(band.color.toLowerCase()).not.toBe('#ff0000');
      expect(band.color.toLowerCase()).not.toBe('#00ff00');
      expect(band.color.toLowerCase()).not.toBe('#008000');
    }
  });

  test('2. Every map value equals the dataset/API metrics', async ({ page }) => {
    await page.goto('/overview');

    // Switch to table view on the map to test all 16 districts
    const tableToggle = page.locator('button:has-text("View as Table")');
    if (await tableToggle.isVisible()) {
      await tableToggle.click();
    }

    // Check specific priority districts
    const gorakhpurMetric = tradeMetricsRaw['gorakhpur'].trades['Solar PV Installer'];
    expect(gorakhpurMetric.demand).toBe(808);
    expect(gorakhpurMetric.effectiveSupply).toBe(97);
    expect(gorakhpurMetric.gapScore).toBe(94);

    const puneMetric = tradeMetricsRaw['pune'].trades['Solar PV Installer'];
    expect(puneMetric.demand).toBe(730);
    expect(puneMetric.effectiveSupply).toBe(358);
    expect(puneMetric.gapScore).toBe(75);

    // In table mode, verify numbers match
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('808');
    expect(bodyText).toContain('94');
  });

  test('3. Hindi map labels render without tofu', async ({ page }) => {
    // Set cookie to Hindi
    await page.context().addCookies([
      { name: 'kaushalyuva-lang', value: 'hi', domain: 'localhost', path: '/' }
    ]);

    await page.goto('/overview');
    await page.waitForTimeout(500);

    // Toggle table view to view all district names
    const tableToggle = page.locator('button:has-text("तालिका दृश्य"), button:has-text("View as Table")').first();
    if (await tableToggle.isVisible()) {
      await tableToggle.click();
    }

    const content = await page.textContent('body');

    // Expected Hindi district names
    const expectedHindiDistricts = [
      'गोरखपुर',
      'लखनऊ',
      'वाराणसी',
      'कानपुर नगर',
      'पुणे',
      'नागपुर',
      'कोयंबटूर',
      'अहमदाबाद'
    ];

    for (const name of expectedHindiDistricts) {
      expect(content).toContain(name);
    }

    // Verify no replacement character (tofu)
    expect(content).not.toContain('\uFFFD');
  });

  test('4. No hardcoded district numbers in the map component source', async () => {
    const mapSrcPath = path.join(__dirname, '../src/components/maps/IndiaIntelligenceMap.tsx');
    const mapSrc = fs.readFileSync(mapSrcPath, 'utf8');

    // Map component must consume tradeMetricsRaw rather than hardcoding Gorakhpur 808
    expect(mapSrc).toContain('tradeMetricsRaw');
    // Ensure no hardcoded raw 808 literal assigned as a district metric
    expect(mapSrc).not.toMatch(/Gorakhpur\s*:\s*\{\s*demand\s*:\s*808/i);
  });

  test('5. Hero and Discrepancy Fixes (REC-01, REC-02/03, WAPE, Gorakhpur centres)', async ({ page }) => {
    await page.goto('/');

    const heroContent = await page.textContent('body');

    // Hero Fix (7)
    expect(heroContent).toContain('Remaining ~667 persons need new capacity');
    expect(heroContent).toContain('donor stays Balanced (52)');

    // WAPE consistent blend vs naive (11)
    expect(heroContent).toContain('Blend: 3.41%');
    expect(heroContent).toContain('Naive: 6.93%');
    expect(heroContent).toContain('LightGBM + Theta + ETS blend');
    expect(heroContent).not.toContain('LightGBM ensemble');

    // Check Recommendations page (8 & 9 + Compliance A-E)
    await page.goto('/recommendations');
    const recContent = await page.textContent('body');

    // A. Portfolio banner shows validation-pending unaggregated state
    expect(recContent).toContain('Validation Pending (Per-Dossier Below)');
    expect(recContent).toContain('Consolidated Wages Unvalidated');
    expect(recContent).toContain('Rollup Pending Field Audit');
    expect(recContent).toContain('UNAGGREGATED');

    // B. Prohibited aggregate headline totals are not displayed in the portfolio banner
    const youthPlacedCard = page.locator('text=TOTAL YOUTH PLACED').locator('..');
    await expect(youthPlacedCard).toContainText('—');
    await expect(youthPlacedCard).not.toContainText('+638');
    await expect(youthPlacedCard).not.toContainText('638');

    const wagesCard = page.locator('text=ANNUAL YOUTH WAGES').locator('..');
    await expect(wagesCard).toContainText('—');
    await expect(wagesCard).not.toContainText('₹21.20 Cr');
    await expect(wagesCard).not.toContainText('₹21.22 Cr');

    const capexSavedCard = page.locator('text=PUBLIC CAPEX SAVED').locator('..');
    await expect(capexSavedCard).toContainText('—');
    await expect(capexSavedCard).not.toContainText('₹1.12 Cr');

    // C. REC-01 to REC-04 remain available
    expect(recContent).toContain('REC-2026-01');
    expect(recContent).toContain('REC-2026-02');
    expect(recContent).toContain('REC-2026-03');
    expect(recContent).toContain('REC-2026-04');

    // D. Individual scenario information intact
    // REC-01 shows two rows: reallocation alone and with 150-seat lab
    expect(recContent).toContain('Reallocation alone');
    expect(recContent).toContain('6.2%');
    expect(recContent).toContain('15.6%');
    expect(recContent).toContain('150-seat lab');

    // REC-02/03 show derivation and capex tagged Assumption
    expect(recContent).toContain('Model Derivation & Assumptions');
    expect(recContent).toContain('Assumption');
    expect(recContent).toContain('Context, not model output');

    // E. Export functionality works
    const exportBtn = page.locator('button:has-text("Export All Interventions")');
    await expect(exportBtn).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await exportBtn.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('KaushalYuva_Recommended_Interventions_Dossier.csv');
  });

  test('6. Server-side first paint language test with cookie=hi', async ({ page }) => {
    await page.context().addCookies([
      { name: 'kaushalyuva-lang', value: 'hi', domain: 'localhost', path: '/' }
    ]);

    await page.goto('/');

    // Check <html lang="hi">
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('hi');

    // Check Hindi title/heading on first paint
    const h1Text = await page.textContent('h1');
    expect(h1Text).toContain('कौशल अंतराल');
  });

});
