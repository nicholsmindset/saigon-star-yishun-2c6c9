/**
 * Stripe Configuration for One-Time Featured Listing Charges
 *
 * This configures Stripe for ONE-TIME payments (not subscriptions)
 * for featured business listings.
 */

import Stripe from 'stripe';

// Export Stripe type for use in other files
export type { Stripe };

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

/**
 * Featured Listing Pricing Configuration (SGD cents)
 */
export const FEATURED_PRICING = {
  1: { amount: 2900, label: '1 Month', description: '1 month featured listing' },
  3: { amount: 7500, label: '3 Months', description: '3 months featured listing - Save $12!' },
  6: { amount: 14000, label: '6 Months', description: '6 months featured listing - Save $34!' },
} as const;

export type DurationMonths = keyof typeof FEATURED_PRICING;

/**
 * Calculate expiry date based on duration
 */
export function calculateExpiryDate(durationMonths: number): Date {
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
  return expiryDate;
}

/**
 * Format price for display (SGD)
 */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}
