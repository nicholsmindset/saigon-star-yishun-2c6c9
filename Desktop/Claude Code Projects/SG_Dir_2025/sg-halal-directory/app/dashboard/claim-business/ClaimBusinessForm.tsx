'use client'

import { useState } from "react"
import { submitBusinessClaim } from "@/app/actions/business"
import { useRouter } from "next/navigation"

interface Business {
  id: string
  name: string
  business_type: string
  address: string
}

interface ClaimBusinessFormProps {
  businesses: Business[]
  userEmail: string
}

export default function ClaimBusinessForm({ businesses, userEmail }: ClaimBusinessFormProps) {
  const router = useRouter()
  const [selectedBusiness, setSelectedBusiness] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [ownerEmail, setOwnerEmail] = useState(userEmail)
  const [ownerPhone, setOwnerPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("businessId", selectedBusiness)
    formData.append("ownerName", ownerName)
    formData.append("ownerEmail", ownerEmail)
    formData.append("ownerPhone", ownerPhone)

    const result = await submitBusinessClaim(formData)

    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    }
  }

  const selectedBusinessData = businesses.find((b) => b.id === selectedBusiness)

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="text-green-600 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-900 mb-2">
          Claim Submitted Successfully!
        </h3>
        <p className="text-green-800 mb-4">
          Your business claim has been submitted for review. We'll notify you via email once it's been reviewed.
        </p>
        <p className="text-sm text-green-700">
          Redirecting to dashboard...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Business Selection */}
      <div>
        <label htmlFor="business" className="block text-sm font-semibold text-gray-700 mb-2">
          Select Your Business <span className="text-red-500">*</span>
        </label>
        <select
          id="business"
          value={selectedBusiness}
          onChange={(e) => setSelectedBusiness(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          required
        >
          <option value="">-- Select a business --</option>
          {businesses.map((business) => (
            <option key={business.id} value={business.id}>
              {business.name} - {business.business_type}
            </option>
          ))}
        </select>
        {selectedBusinessData && (
          <p className="mt-2 text-sm text-gray-600">
            Address: {selectedBusinessData.address}
          </p>
        )}
      </div>

      {/* Owner Name */}
      <div>
        <label htmlFor="ownerName" className="block text-sm font-semibold text-gray-700 mb-2">
          Your Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="ownerName"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="John Doe"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Please provide the name of the business owner or authorized representative
        </p>
      </div>

      {/* Owner Email */}
      <div>
        <label htmlFor="ownerEmail" className="block text-sm font-semibold text-gray-700 mb-2">
          Contact Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="ownerEmail"
          value={ownerEmail}
          onChange={(e) => setOwnerEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="john@example.com"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          We'll use this email to contact you about your claim
        </p>
      </div>

      {/* Owner Phone */}
      <div>
        <label htmlFor="ownerPhone" className="block text-sm font-semibold text-gray-700 mb-2">
          Contact Phone Number
        </label>
        <input
          type="tel"
          id="ownerPhone"
          value={ownerPhone}
          onChange={(e) => setOwnerPhone(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="+65 1234 5678"
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional - Provide if you'd like us to call you for verification
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Claim"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
        >
          Cancel
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        By submitting this claim, you confirm that you are the owner or authorized representative
        of the selected business.
      </p>
    </form>
  )
}
