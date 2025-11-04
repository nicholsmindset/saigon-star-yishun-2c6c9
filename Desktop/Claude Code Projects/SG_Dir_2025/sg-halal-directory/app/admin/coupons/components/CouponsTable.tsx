'use client'

import { useState } from 'react'
import { toggleCouponStatus } from '@/app/actions/admin'

type Coupon = {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  stripe_coupon_id: string | null
  max_uses: number | null
  times_used: number
  valid_from: string
  valid_until: string | null
  is_active: boolean
  created_by: string | null
  created_at: string
  creator: {
    full_name: string | null
    email: string
  } | null
}

type CouponsTableProps = {
  coupons: Coupon[]
}

export default function CouponsTable({ coupons }: CouponsTableProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleToggleStatus = async (couponId: string, currentStatus: boolean) => {
    setIsUpdating(couponId)
    setError(null)

    try {
      await toggleCouponStatus(couponId, !currentStatus)
      // Page will auto-refresh due to revalidatePath
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsUpdating(null)
    }
  }

  const formatDiscount = (type: 'percentage' | 'fixed', value: number) => {
    if (type === 'percentage') {
      return `${value}%`
    }
    return `SGD $${(value / 100).toFixed(2)}`
  }

  const isExpired = (validUntil: string | null) => {
    if (!validUntil) return false
    return new Date(validUntil) <= new Date()
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Discount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usage
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valid Until
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created By
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {coupons.map((coupon) => (
            <tr key={coupon.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                    {coupon.code}
                  </code>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {formatDiscount(coupon.discount_type, coupon.discount_value)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div>
                  <span className="font-medium">{coupon.times_used}</span>
                  {coupon.max_uses && (
                    <span className="text-gray-500"> / {coupon.max_uses}</span>
                  )}
                  {!coupon.max_uses && (
                    <span className="text-gray-500"> (unlimited)</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-sm">
                {coupon.valid_until ? (
                  <div>
                    <div className={isExpired(coupon.valid_until) ? 'text-red-600' : 'text-gray-900'}>
                      {new Date(coupon.valid_until).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(coupon.valid_until).toLocaleTimeString()}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500">No expiration</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {coupon.creator ? (
                  <div>
                    <div>{coupon.creator.full_name || 'No name'}</div>
                    <div className="text-xs text-gray-500">{coupon.creator.email}</div>
                  </div>
                ) : (
                  <span className="text-gray-500">Unknown</span>
                )}
              </td>
              <td className="px-6 py-4">
                {coupon.is_active && !isExpired(coupon.valid_until) ? (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    Inactive
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <button
                  onClick={() => handleToggleStatus(coupon.id, coupon.is_active)}
                  disabled={isUpdating === coupon.id}
                  className="text-blue-600 hover:text-blue-900 disabled:text-gray-400"
                >
                  {isUpdating === coupon.id ? (
                    'Updating...'
                  ) : coupon.is_active ? (
                    'Deactivate'
                  ) : (
                    'Activate'
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
