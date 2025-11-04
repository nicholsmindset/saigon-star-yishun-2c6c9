'use client'

import { useState } from 'react'
import Link from 'next/link'
import { updateBusinessStatus, makeFeatured, removeFeatured } from '@/app/actions/admin'

type Business = {
  id: string
  name: string
  slug: string
  business_type: string
  address: string
  status: 'pending' | 'approved' | 'rejected'
  is_featured: boolean
  featured_expiry: string | null
  is_verified: boolean
  created_at: string
  area: {
    name: string
    slug: string
  } | null
  claimed_by_profile: {
    full_name: string | null
    email: string
  } | null
}

type BusinessesTableProps = {
  businesses: Business[]
}

export default function BusinessesTable({ businesses }: BusinessesTableProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFeaturedModal, setShowFeaturedModal] = useState(false)
  const [featuredDuration, setFeaturedDuration] = useState<1 | 3 | 6>(1)

  const handleStatusUpdate = async (businessId: string, newStatus: 'approved' | 'rejected') => {
    if (!confirm(`Are you sure you want to ${newStatus} this business?`)) {
      return
    }

    setIsUpdating(true)
    setError(null)

    try {
      await updateBusinessStatus(businessId, newStatus)
      // Page will auto-refresh due to revalidatePath
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleMakeFeatured = async () => {
    if (!selectedBusiness) return

    setIsUpdating(true)
    setError(null)

    try {
      await makeFeatured(selectedBusiness.id, featuredDuration)
      setShowFeaturedModal(false)
      setSelectedBusiness(null)
      // Page will auto-refresh due to revalidatePath
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemoveFeatured = async (businessId: string) => {
    if (!confirm('Remove featured status from this business?')) {
      return
    }

    setIsUpdating(true)
    setError(null)

    try {
      await removeFeatured(businessId)
      // Page will auto-refresh due to revalidatePath
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Area
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {businesses.map((business) => (
              <tr key={business.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <Link
                      href={`/business/${business.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {business.name}
                    </Link>
                    <div className="text-sm text-gray-500">{business.business_type}</div>
                    <div className="text-xs text-gray-400 mt-1">{business.address}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {business.area?.name || 'No area'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(business.status)}`}>
                    {business.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {business.is_featured ? (
                    <div>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Featured
                      </span>
                      {business.featured_expiry && (
                        <div className="text-xs text-gray-500 mt-1">
                          Until {new Date(business.featured_expiry).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {business.claimed_by_profile ? (
                    <div>
                      <div className="text-gray-900">
                        {business.claimed_by_profile.full_name || 'No name'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {business.claimed_by_profile.email}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">Unclaimed</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  {business.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(business.id, 'approved')}
                        disabled={isUpdating}
                        className="text-green-600 hover:text-green-900 disabled:text-gray-400"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(business.id, 'rejected')}
                        disabled={isUpdating}
                        className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {business.status === 'approved' && !business.is_featured && (
                    <button
                      onClick={() => {
                        setSelectedBusiness(business)
                        setShowFeaturedModal(true)
                      }}
                      disabled={isUpdating}
                      className="text-blue-600 hover:text-blue-900 disabled:text-gray-400"
                    >
                      Make Featured
                    </button>
                  )}
                  {business.is_featured && (
                    <button
                      onClick={() => handleRemoveFeatured(business.id)}
                      disabled={isUpdating}
                      className="text-orange-600 hover:text-orange-900 disabled:text-gray-400"
                    >
                      Remove Featured
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Featured Duration Modal */}
      {showFeaturedModal && selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Make Business Featured
              </h3>
              <button
                onClick={() => {
                  setShowFeaturedModal(false)
                  setSelectedBusiness(null)
                  setError(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Business: <span className="font-medium">{selectedBusiness.name}</span>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Duration
              </label>
              <select
                value={featuredDuration}
                onChange={(e) => setFeaturedDuration(parseInt(e.target.value) as 1 | 3 | 6)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 Month</option>
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
              </select>
              <p className="mt-2 text-xs text-gray-500">
                This will grant featured status for the selected duration (admin override, no payment).
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowFeaturedModal(false)
                  setSelectedBusiness(null)
                  setError(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMakeFeatured}
                disabled={isUpdating}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
