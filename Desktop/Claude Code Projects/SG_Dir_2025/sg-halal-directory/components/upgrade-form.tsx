'use client';

/**
 * Featured Listing Upgrade Form Component
 *
 * Handles business selection, duration selection, coupon codes,
 * and initiates Stripe checkout for one-time featured listing payments.
 */

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { Database } from '@/types/database';

type Business = Database['public']['Tables']['businesses']['Row'] & {
  areas: { name: string } | null;
};

interface UpgradeFormProps {
  businesses: Business[];
  preselectedBusinessId?: string;
}

const PRICING = {
  1: { amount: 29, label: '1 Month', description: 'Best for testing' },
  3: { amount: 75, label: '3 Months', description: 'Save $12 - Most popular!' },
  6: { amount: 140, label: '6 Months', description: 'Save $34 - Best value!' },
};

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function UpgradeForm({
  businesses,
  preselectedBusinessId,
}: UpgradeFormProps) {
  const [selectedBusinessId, setSelectedBusinessId] = useState(
    preselectedBusinessId || ''
  );
  const [durationMonths, setDurationMonths] = useState<1 | 3 | 6>(3);
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedBusinessId) {
      setError('Please select a business to upgrade');
      return;
    }

    setIsLoading(true);

    try {
      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: selectedBusinessId,
          durationMonths,
          couponCode: couponCode.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout using the modern approach
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to start checkout'
      );
      setIsLoading(false);
    }
  };

  // Filter out already featured businesses
  const availableBusinesses = businesses.filter((b) => !b.is_featured);

  if (availableBusinesses.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <h3 className="text-lg font-semibold text-gray-900">
          No Businesses Available
        </h3>
        <p className="mt-2 text-gray-600">
          {businesses.length === 0
            ? 'You need to claim a business before you can upgrade to featured status.'
            : 'All your businesses are already featured!'}
        </p>
        <a
          href="/dashboard"
          className="mt-4 inline-block text-blue-600 hover:text-blue-700"
        >
          Go to Dashboard
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-8 shadow">
      <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Business</h2>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Business Selection */}
      <div className="mt-6">
        <label
          htmlFor="business"
          className="block text-sm font-medium text-gray-700"
        >
          Select Business
        </label>
        <select
          id="business"
          value={selectedBusinessId}
          onChange={(e) => setSelectedBusinessId(e.target.value)}
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Choose a business...</option>
          {availableBusinesses.map((business) => (
            <option key={business.id} value={business.id}>
              {business.name}
              {business.areas && ` - ${business.areas.name}`}
            </option>
          ))}
        </select>
      </div>

      {/* Duration Selection */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Select Duration
        </label>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {([1, 3, 6] as const).map((months) => {
            const pricing = PRICING[months];
            const isSelected = durationMonths === months;
            const isPopular = months === 3;

            return (
              <button
                key={months}
                type="button"
                onClick={() => setDurationMonths(months)}
                className={`relative rounded-lg border-2 p-4 text-left transition-colors ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ${pricing.amount}
                  </span>
                  <span className="text-sm text-gray-600">
                    {pricing.label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  {pricing.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Coupon Code */}
      <div className="mt-6">
        <label
          htmlFor="coupon"
          className="block text-sm font-medium text-gray-700"
        >
          Coupon Code (Optional)
        </label>
        <input
          type="text"
          id="coupon"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter code"
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 uppercase focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Have a badge program coupon? Enter it here.
        </p>
      </div>

      {/* Summary */}
      {selectedBusinessId && (
        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-900">Summary</h3>
          <dl className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Duration:</dt>
              <dd className="font-medium text-gray-900">
                {PRICING[durationMonths].label}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Price:</dt>
              <dd className="font-medium text-gray-900">
                ${PRICING[durationMonths].amount} SGD
              </dd>
            </div>
            {couponCode && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Coupon:</dt>
                <dd className="font-medium text-green-600">{couponCode}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !selectedBusinessId}
        className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Proceed to Payment'}
      </button>

      <p className="mt-4 text-center text-xs text-gray-500">
        You'll be redirected to Stripe's secure checkout. Payment is processed
        by Stripe.
      </p>
    </form>
  );
}
