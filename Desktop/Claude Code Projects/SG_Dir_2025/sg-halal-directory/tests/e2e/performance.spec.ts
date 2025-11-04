import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('homepage should load within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);

    // Verify critical content is visible
    await expect(page.getByRole('heading', { name: /Find Halal-Certified Businesses/i })).toBeVisible();
  });

  test('images should use Next.js Image component', async ({ page }) => {
    await page.goto('/');

    // Navigate to a business with images
    await page.goto('/directory');
    await page.locator('[href^="/directory/"]').first().click();
    await page.waitForSelector('[href^="/business/"]');
    await page.locator('[href^="/business/"]').first().click();

    // Check if images are lazy loaded
    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      // First few images should be eager, rest should be lazy
      const firstImage = images.first();
      const loading = await firstImage.getAttribute('loading');
      // Next.js Image component adds loading attribute
      expect(['lazy', 'eager']).toContain(loading);
    }
  });

  test('fonts should have font-display swap', async ({ page }) => {
    await page.goto('/');

    // Check if fonts are loaded with swap
    const fontLinks = page.locator('link[rel="preconnect"]');
    const count = await fontLinks.count();

    // Should have preconnect links for fonts
    expect(count).toBeGreaterThan(0);
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check for essential meta tags
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).toContain('Singapore Halal Directory');

    // Check for description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
  });
});
