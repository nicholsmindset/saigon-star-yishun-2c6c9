'use client'

import { useState } from "react"
import { updateBusiness } from "@/app/actions/business"
import { getBusinessImages } from "@/app/actions/images"
import { useRouter } from "next/navigation"
import ImageUploader from "@/app/components/ImageUploader"
import ImageManager from "@/app/components/ImageManager"

interface Business {
  id: string
  name: string
  description: string | null
  phone: string | null
  email: string | null
  website: string | null
  address: string
  business_type: string
  is_featured: boolean
}

interface ImageData {
  id: string
  url: string
  caption: string | null
  display_order: number
  is_primary: boolean
  created_at: string
}

interface EditBusinessFormProps {
  business: Business
  initialImages: ImageData[]
}

export default function EditBusinessForm({ business, initialImages }: EditBusinessFormProps) {
  const router = useRouter()
  const [name, setName] = useState(business.name)
  const [description, setDescription] = useState(business.description || "")
  const [phone, setPhone] = useState(business.phone || "")
  const [email, setEmail] = useState(business.email || "")
  const [website, setWebsite] = useState(business.website || "")
  const [address, setAddress] = useState(business.address)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [images, setImages] = useState<ImageData[]>(initialImages)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const maxImages = business.is_featured ? 8 : 1

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("phone", phone)
    formData.append("email", email)
    formData.append("website", website)
    formData.append("address", address)

    const result = await updateBusiness(business.id, formData)

    setIsSubmitting(false)

    if (result?.error) {
      setError(result.error)
    }
    // If successful, redirect is handled by the server action
  }

  const handleImagesChange = async () => {
    setIsRefreshing(true)
    const updatedImages = await getBusinessImages(business.id)
    setImages(updatedImages)
    setIsRefreshing(false)
  }

  return (
    <div className="space-y-8">
      {/* Business Images Section */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Business Images
            </h2>
            <p className="text-sm text-gray-600">
              {business.is_featured
                ? "Upload up to 8 images to showcase your business"
                : "Upload 1 image for your listing"}
            </p>
          </div>
          {business.is_featured && (
            <span className="bg-blue-500 text-white text-xs px-2.5 py-1 rounded">
              Featured
            </span>
          )}
        </div>

        {/* Existing Images */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Current Images
          </h3>
          {isRefreshing ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : (
            <ImageManager
              businessId={business.id}
              images={images}
              maxImages={maxImages}
              onImagesChange={handleImagesChange}
            />
          )}
        </div>

        {/* Upload New Images */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Upload New Images
          </h3>
          <ImageUploader
            businessId={business.id}
            currentImageCount={images.length}
            maxImages={maxImages}
            onUploadComplete={handleImagesChange}
          />
        </div>

        {/* Upgrade prompt for standard listings */}
        {!business.is_featured && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  Upgrade to Featured
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  Featured listings can upload up to 8 images, get top placement on area pages, and stand out with a blue border.
                </p>
                <a
                  href="/upgrade/featured"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                >
                  Upgrade Now
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Business Information Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Business Information
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Business Type (Read-only) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business Type
          </label>
          <input
            type="text"
            value={business.business_type}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Contact admin to change business type
          </p>
        </div>

        {/* Business Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="My Halal Restaurant"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Tell customers about your business, specialties, and what makes you unique..."
          />
          <p className="mt-1 text-xs text-gray-500">
            A good description helps customers understand what you offer
          </p>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="123 Orchard Road, Singapore 238858"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="+65 6123 4567"
          />
          <p className="mt-1 text-xs text-gray-500">
            Help customers contact you directly
          </p>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Business Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="info@mybusiness.com"
          />
          <p className="mt-1 text-xs text-gray-500">
            Public email for customer inquiries
          </p>
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="https://www.mybusiness.com"
          />
          <p className="mt-1 text-xs text-gray-500">
            Include https:// for the full URL
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
