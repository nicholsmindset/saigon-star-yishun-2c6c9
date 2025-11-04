import { test, expect } from '@playwright/test';

test.describe('Business Claim Flow', () => {
  test('should display claim business button on business page', async ({ page }) => {
    // Navigate to a business detail page (using direct URL for testing)
    await page.goto('/directory');

    // Navigate to first area
    await page.locator('[href^="/directory/"]').first().click();

    // Navigate to first business
    await page.waitForSelector('[href^="/business/"]');
    await page.locator('[href^="/business/"]').first().click();

    // Verify "Claim This Business" button exists
    await expect(page.getByRole('link', { name: /Claim This Business/i })).toBeVisible();
  });

  test('should navigate to claim business page', async ({ page }) => {
    // Navigate to claim business page directly
    await page.goto('/dashboard/claim-business');

    // Should redirect to auth or show claim form
    // Verify page loaded (will show login if not authenticated)
    await expect(page).toHaveURL(/\/(dashboard\/claim-business|auth)/);
  });

  test('should show dashboard link in navigation', async ({ page }) => {
    await page.goto('/');

    // Verify dashboard link exists in footer
    const dashboardLink = page.getByRole('link', { name: /Dashboard/i }).first();
    await expect(dashboardLink).toBeVisible();
  });
});
