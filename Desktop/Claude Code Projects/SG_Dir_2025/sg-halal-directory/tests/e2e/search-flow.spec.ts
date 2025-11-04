import { test, expect } from '@playwright/test';

test.describe('Search Flow', () => {
  test('should search and find businesses', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Verify homepage loaded
    await expect(page.getByRole('heading', { name: /Find Halal-Certified Businesses/i })).toBeVisible();

    // Search for businesses
    await page.getByPlaceholder(/Search for halal businesses/i).fill('restaurant');
    await page.getByRole('button', { name: /Search/i }).click();

    // Verify search results page loaded
    await expect(page).toHaveURL(/\/search\?q=restaurant/);
    await expect(page.getByRole('heading', { name: /Search Results/i })).toBeVisible();
  });

  test('should navigate to area directory', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Click on Browse by Area
    await page.getByRole('link', { name: /Browse by Area/i }).first().click();

    // Verify directory page loaded
    await expect(page).toHaveURL('/directory');
    await expect(page.getByRole('heading', { name: /Browse All Areas/i })).toBeVisible();
  });

  test('should navigate to specific area page', async ({ page }) => {
    // Navigate to directory
    await page.goto('/directory');

    // Click on first area
    const firstArea = page.locator('[href^="/directory/"]').first();
    await firstArea.click();

    // Verify area page loaded with businesses
    await expect(page).toHaveURL(/\/directory\/[\w-]+/);
    await expect(page.getByRole('heading', { name: /Halal Businesses in/i })).toBeVisible();
  });

  test('should navigate to business detail page', async ({ page }) => {
    // Navigate to directory
    await page.goto('/directory');

    // Navigate to first area
    await page.locator('[href^="/directory/"]').first().click();

    // Wait for businesses to load and click first business
    await page.waitForSelector('[href^="/business/"]');
    await page.locator('[href^="/business/"]').first().click();

    // Verify business detail page loaded
    await expect(page).toHaveURL(/\/business\/[\w-]+/);
    await expect(page.getByText(/Contact Information/i)).toBeVisible();
  });
});
