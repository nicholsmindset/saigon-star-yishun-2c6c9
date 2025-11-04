'use client'

import { useState } from 'react'
import { approveClaim, rejectClaim } from '@/app/actions/admin'

type Claim = {
  id: string
  business_id: string
  user_id: string
  owner_name: string
  owner_email: string
  owner_phone: string | null
  verification_documents: string[] | null
  status: 'pending' | 'approved' | 'rejected'
  admin_notes: string | null
  created_at: string
  business: {
    id: string
    name: string
    address: string
    business_type: string
    area: {
      name: string
    }
  }
  user: {
    id: string
    email: string
    full_name: string | null
  }
}

type ClaimsTableProps = {
  claims: Claim[]
  status: 'pending' | 'approved' | 'rejected'
}

export default function ClaimsTable({ claims, status }: ClaimsTableProps) {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectNotes, setRejectNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async (claimId: string) => {
    if (!confirm('Are you sure you want to approve this claim?')) {
      return
    }

    setIsApproving(true)
    setError(null)

    try {
      await approveClaim(claimId)
      setSelectedClaim(null)
      // Page will auto-refresh due to revalidatePath
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async (claimId: string) => {
    if (!rejectNotes.trim()) {
      setError('Please provide a reason for rejection')
      return
    }

    setIsRejecting(true)
    setError(null)

    try {
      await rejectClaim(claimId, rejectNotes)
      setSelectedClaim(null)
      setRejectNotes('')
      // Page will auto-refresh due to revalidatePath
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Claimer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              {status === 'pending' && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {claims.map((claim) => (
              <tr key={claim.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {claim.business.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {claim.business.business_type} • {claim.business.area.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {claim.business.address}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{claim.owner_name}</div>
                  <div className="text-xs text-gray-500">
                    {claim.user.full_name || 'No name'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{claim.owner_email}</div>
                  {claim.owner_phone && (
                    <div className="text-xs text-gray-500">{claim.owner_phone}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(claim.created_at).toLocaleDateString()}
                </td>
                {status === 'pending' && (
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedClaim(claim)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Review
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Review Business Claim
                </h3>
                <button
                  onClick={() => {
                    setSelectedClaim(null)
                    setRejectNotes('')
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

              {/* Business Details */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Business Details</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedClaim.business.name}</p>
                  <p><span className="font-medium">Type:</span> {selectedClaim.business.business_type}</p>
                  <p><span className="font-medium">Area:</span> {selectedClaim.business.area.name}</p>
                  <p><span className="font-medium">Address:</span> {selectedClaim.business.address}</p>
                </div>
              </div>

              {/* Claimer Details */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Claimer Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Owner Name:</span> {selectedClaim.owner_name}</p>
                  <p><span className="font-medium">Email:</span> {selectedClaim.owner_email}</p>
                  {selectedClaim.owner_phone && (
                    <p><span className="font-medium">Phone:</span> {selectedClaim.owner_phone}</p>
                  )}
                  <p><span className="font-medium">User Account:</span> {selectedClaim.user.email}</p>
                  <p className="text-xs text-gray-500">
                    Submitted: {new Date(selectedClaim.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Verification Documents */}
              {selectedClaim.verification_documents && selectedClaim.verification_documents.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Verification Documents</h4>
                  <div className="space-y-2">
                    {selectedClaim.verification_documents.map((doc, index) => (
                      <a
                        key={index}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-600 hover:text-blue-800"
                      >
                        Document {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Reject Notes Input */}
              <div className="mb-6">
                <label htmlFor="rejectNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (required for rejection)
                </label>
                <textarea
                  id="rejectNotes"
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide reason for rejection..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(selectedClaim.id)}
                  disabled={isApproving || isRejecting}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isApproving ? 'Approving...' : 'Approve Claim'}
                </button>
                <button
                  onClick={() => handleReject(selectedClaim.id)}
                  disabled={isApproving || isRejecting}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isRejecting ? 'Rejecting...' : 'Reject Claim'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
