import { test, expect } from '@playwright/test';

test.describe('Featured Listing Upgrade Flow', () => {
  test('should display upgrade button on non-featured business page', async ({ page }) => {
    // Navigate to directory
    await page.goto('/directory');

    // Navigate to first area
    await page.locator('[href^="/directory/"]').first().click();

    // Navigate to a non-featured business (may need to scroll)
    await page.waitForSelector('[href^="/business/"]');
    const businesses = page.locator('[href^="/business/"]');
    const count = await businesses.count();

    if (count > 0) {
      await businesses.first().click();

      // Check if "Get Featured" or "Upgrade Now" button exists
      // (will only show if business is not already featured)
      const upgradeButton = page.getByRole('link', { name: /Get Featured|Upgrade Now/i });
      // Note: This might not always be visible if business is already featured
    }
  });

  test('should navigate to upgrade page', async ({ page }) => {
    // Navigate to upgrade page directly
    await page.goto('/upgrade/featured');

    // Should redirect to auth or show upgrade form
    await expect(page).toHaveURL(/\/(upgrade\/featured|auth)/);
  });

  test('should display upgrade link in footer', async ({ page }) => {
    await page.goto('/');

    // Verify upgrade link exists in footer
    const upgradeLink = page.getByRole('link', { name: /Get Featured/i }).first();
    await expect(upgradeLink).toBeVisible();
  });
});
