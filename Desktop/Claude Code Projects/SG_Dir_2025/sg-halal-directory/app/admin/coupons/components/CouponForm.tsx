'use client'

import { useState } from 'react'
import { createCoupon, generateCouponCode } from '@/app/actions/admin'

export default function CouponForm() {
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [discountValue, setDiscountValue] = useState('')
  const [maxUses, setMaxUses] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleGenerateCode = async () => {
    const generatedCode = await generateCouponCode()
    setCode(generatedCode)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate
      if (!code.trim()) {
        throw new Error('Coupon code is required')
      }

      const value = parseInt(discountValue)
      if (isNaN(value) || value <= 0) {
        throw new Error('Discount value must be a positive number')
      }

      if (discountType === 'percentage' && value > 100) {
        throw new Error('Percentage discount cannot exceed 100%')
      }

      await createCoupon({
        code: code.trim(),
        discount_type: discountType,
        discount_value: value,
        max_uses: maxUses ? parseInt(maxUses) : undefined,
        valid_until: validUntil || undefined
      })

      // Reset form
      setCode('')
      setDiscountValue('')
      setMaxUses('')
      setValidUntil('')
      setSuccess(true)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">Coupon created successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coupon Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Code *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="HALALXYZ123"
                required
              />
              <button
                type="button"
                onClick={handleGenerateCode}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Generate
              </button>
            </div>
          </div>

          {/* Discount Type */}
          <div>
            <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-2">
              Discount Type *
            </label>
            <select
              id="discountType"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (SGD)</option>
            </select>
          </div>

          {/* Discount Value */}
          <div>
            <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-2">
              Discount Value *
            </label>
            <div className="relative">
              <input
                type="number"
                id="discountValue"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={discountType === 'percentage' ? '10' : '29'}
                min="1"
                max={discountType === 'percentage' ? '100' : undefined}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {discountType === 'percentage' ? '%' : 'SGD'}
                </span>
              </div>
            </div>
            {discountType === 'percentage' && (
              <p className="mt-1 text-xs text-gray-500">Max 100%</p>
            )}
          </div>

          {/* Max Uses */}
          <div>
            <label htmlFor="maxUses" className="block text-sm font-medium text-gray-700 mb-2">
              Max Uses (Optional)
            </label>
            <input
              type="number"
              id="maxUses"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Unlimited"
              min="1"
            />
            <p className="mt-1 text-xs text-gray-500">Leave blank for unlimited uses</p>
          </div>

          {/* Valid Until */}
          <div className="md:col-span-2">
            <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700 mb-2">
              Valid Until (Optional)
            </label>
            <input
              type="datetime-local"
              id="validUntil"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">Leave blank for no expiration date</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Coupon'}
          </button>
        </div>
      </form>
    </div>
  )
}
