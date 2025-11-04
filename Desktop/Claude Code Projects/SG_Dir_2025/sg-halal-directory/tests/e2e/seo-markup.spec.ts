import { test, expect } from '@playwright/test';

test.describe('SEO Schema Markup Validation', () => {
  test('homepage should have Organization schema', async ({ page }) => {
    await page.goto('/');

    // Check for Organization schema
    const schemaScript = page.locator('script[type="application/ld+json"]');
    const content = await schemaScript.first().textContent();

    expect(content).toContain('"@type":"Organization"');
    expect(content).toContain('Singapore Halal Directory');
  });

  test('directory page should have BreadcrumbList and ItemList schemas', async ({ page }) => {
    await page.goto('/directory');

    // Check for schema markups
    const schemaScripts = page.locator('script[type="application/ld+json"]');
    const count = await schemaScripts.count();

    expect(count).toBeGreaterThanOrEqual(2);

    // Verify BreadcrumbList
    const schemas = await schemaScripts.allTextContents();
    const hasBreadcrumb = schemas.some(s => s.includes('"@type":"BreadcrumbList"'));
    const hasItemList = schemas.some(s => s.includes('"@type":"ItemList"'));

    expect(hasBreadcrumb).toBeTruthy();
    expect(hasItemList).toBeTruthy();
  });

  test('area page should have BreadcrumbList, ItemList, and FAQPage schemas', async ({ page }) => {
    // Navigate to first area
    await page.goto('/directory');
    await page.locator('[href^="/directory/"]').first().click();

    // Check for all three schema types
    const schemaScripts = page.locator('script[type="application/ld+json"]');
    const count = await schemaScripts.count();

    expect(count).toBeGreaterThanOrEqual(3);

    const schemas = await schemaScripts.allTextContents();
    const hasBreadcrumb = schemas.some(s => s.includes('"@type":"BreadcrumbList"'));
    const hasItemList = schemas.some(s => s.includes('"@type":"ItemList"'));
    const hasFAQ = schemas.some(s => s.includes('"@type":"FAQPage"'));

    expect(hasBreadcrumb).toBeTruthy();
    expect(hasItemList).toBeTruthy();
    expect(hasFAQ).toBeTruthy();
  });

  test('business page should have LocalBusiness and BreadcrumbList schemas', async ({ page }) => {
    // Navigate to first business
    await page.goto('/directory');
    await page.locator('[href^="/directory/"]').first().click();
    await page.waitForSelector('[href^="/business/"]');
    await page.locator('[href^="/business/"]').first().click();

    // Check for schema markups
    const schemaScripts = page.locator('script[type="application/ld+json"]');
    const count = await schemaScripts.count();

    expect(count).toBeGreaterThanOrEqual(2);

    const schemas = await schemaScripts.allTextContents();
    const hasLocalBusiness = schemas.some(s => s.includes('"@type":"LocalBusiness"'));
    const hasBreadcrumb = schemas.some(s => s.includes('"@type":"BreadcrumbList"'));

    expect(hasLocalBusiness).toBeTruthy();
    expect(hasBreadcrumb).toBeTruthy();
  });
});
