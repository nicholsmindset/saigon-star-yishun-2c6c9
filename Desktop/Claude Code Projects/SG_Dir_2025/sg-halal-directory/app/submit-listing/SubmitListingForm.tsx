'use client'

import { useState } from 'react'
import { submitBusinessListing } from '@/app/actions/listing'
import { useRouter } from 'next/navigation'

interface Area {
  id: string
  name: string
  slug: string
}

interface SubmitListingFormProps {
  areas: Area[]
}

const BUSINESS_TYPES = [
  'Restaurant',
  'Café',
  'Bakery',
  'Grocery Store',
  'Catering',
  'Food Court',
  'Other'
]

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

export default function SubmitListingForm({ areas }: SubmitListingFormProps) {
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    address: '',
    postalCode: '',
    areaId: '',
    phone: '',
    email: '',
    website: '',
    halalCertNumber: '',
    halalCertExpiry: '',
    description: '',
    submitterName: '',
    submitterEmail: '',
    agreeToTerms: false
  })

  const [certImage, setCertImage] = useState<File | null>(null)
  const [businessPhoto, setBusinessPhoto] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Validation helpers
  const validatePostalCode = (code: string) => {
    return /^\d{6}$/.test(code)
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string) => {
    // Singapore phone format: +65 followed by 8 digits, or just 8 digits
    return /^(\+65)?[689]\d{7}$/.test(phone.replace(/\s/g, ''))
  }

  const validateFileSize = (file: File | null) => {
    if (!file) return true
    return file.size <= MAX_FILE_SIZE
  }

  const validateFileType = (file: File | null) => {
    if (!file) return true
    return ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cert' | 'photo') => {
    const file = e.target.files?.[0] || null

    if (file) {
      // Validate file size
      if (!validateFileSize(file)) {
        setFieldErrors(prev => ({
          ...prev,
          [type]: 'File size must be less than 5MB'
        }))
        return
      }

      // Validate file type
      if (!validateFileType(file)) {
        setFieldErrors(prev => ({
          ...prev,
          [type]: 'Only JPEG and PNG files are allowed'
        }))
        return
      }
    }

    if (type === 'cert') {
      setCertImage(file)
      setFieldErrors(prev => ({ ...prev, cert: '' }))
    } else {
      setBusinessPhoto(file)
      setFieldErrors(prev => ({ ...prev, photo: '' }))
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Required field validation
    if (!formData.businessName.trim()) {
      errors.businessName = 'Business name is required'
    }
    if (!formData.businessType) {
      errors.businessType = 'Please select a business type'
    }
    if (!formData.address.trim()) {
      errors.address = 'Address is required'
    }
    if (!formData.postalCode) {
      errors.postalCode = 'Postal code is required'
    } else if (!validatePostalCode(formData.postalCode)) {
      errors.postalCode = 'Postal code must be 6 digits'
    }
    if (!formData.areaId) {
      errors.areaId = 'Please select an area'
    }
    if (!formData.halalCertNumber.trim()) {
      errors.halalCertNumber = 'Halal certification number is required'
    }
    if (!formData.halalCertExpiry) {
      errors.halalCertExpiry = 'Halal certification expiry date is required'
    } else {
      const expiryDate = new Date(formData.halalCertExpiry)
      const today = new Date()
      if (expiryDate < today) {
        errors.halalCertExpiry = 'Certification has expired. Please renew before submitting.'
      }
    }
    if (!formData.submitterName.trim()) {
      errors.submitterName = 'Your name is required'
    }
    if (!formData.submitterEmail.trim()) {
      errors.submitterEmail = 'Your email is required'
    } else if (!validateEmail(formData.submitterEmail)) {
      errors.submitterEmail = 'Please enter a valid email address'
    }
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions'
    }
    if (!certImage) {
      errors.cert = 'Halal certificate image is required'
    }

    // Optional field validation
    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid Singapore phone number'
    }
    if (formData.description.length > 200) {
      errors.description = 'Description must be 200 characters or less'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      setError('Please fix the errors below before submitting')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsSubmitting(true)

    try {
      const submitData = new FormData()

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value.toString())
      })

      // Append files
      if (certImage) {
        submitData.append('certImage', certImage)
      }
      if (businessPhoto) {
        submitData.append('businessPhoto', businessPhoto)
      }

      const result = await submitBusinessListing(submitData)

      if (result.error) {
        setError(result.error)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (result.success) {
        setSuccess(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
        <div className="text-green-600 mb-4">
          <svg
            className="w-20 h-20 mx-auto"
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
        <h3 className="text-3xl font-bold text-green-900 mb-3">
          Submission Received!
        </h3>
        <p className="text-lg text-green-800 mb-4">
          Thank you for submitting your business to Singapore Halal Directory.
        </p>
        <div className="bg-white rounded-lg p-6 mb-6 text-left">
          <h4 className="font-semibold text-gray-900 mb-3">What happens next?</h4>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">1</span>
              <span>Our admin team will review your submission and verify your halal certification</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">2</span>
              <span>You'll receive an email notification within 1-2 business days</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">3</span>
              <span>Once approved, your business will appear in search results</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">4</span>
              <span>You can then claim and manage your listing by creating an account</span>
            </li>
          </ol>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push('/directory')}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            Browse Directory
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Business Name */}
      <div>
        <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          value={formData.businessName}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            fieldErrors.businessName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Halal Brothers Restaurant"
        />
        {fieldErrors.businessName && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.businessName}</p>
        )}
      </div>

      {/* Business Type */}
      <div>
        <label htmlFor="businessType" className="block text-sm font-semibold text-gray-700 mb-2">
          Business Type <span className="text-red-500">*</span>
        </label>
        <select
          id="businessType"
          name="businessType"
          value={formData.businessType}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            fieldErrors.businessType ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">-- Select a type --</option>
          {BUSINESS_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {fieldErrors.businessType && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.businessType}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
          Address <span className="text-red-500">*</span>
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            fieldErrors.address ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., 123 Orchard Road, #01-234"
        />
        {fieldErrors.address && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.address}</p>
        )}
      </div>

      {/* Postal Code & Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 mb-2">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            maxLength={6}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              fieldErrors.postalCode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123456"
          />
          {fieldErrors.postalCode && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.postalCode}</p>
          )}
        </div>

        <div>
          <label htmlFor="areaId" className="block text-sm font-semibold text-gray-700 mb-2">
            Area <span className="text-red-500">*</span>
          </label>
          <select
            id="areaId"
            name="areaId"
            value={formData.areaId}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              fieldErrors.areaId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Select an area --</option>
            {areas.map(area => (
              <option key={area.id} value={area.id}>{area.name}</option>
            ))}
          </select>
          {fieldErrors.areaId && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.areaId}</p>
          )}
        </div>
      </div>

      {/* Phone & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              fieldErrors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+65 9123 4567"
          />
          {fieldErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Business Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              fieldErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="contact@business.com"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      {/* Website */}
      <div>
        <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">
          Website
        </label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="https://www.yourbusiness.com"
        />
      </div>

      {/* Halal Cert Number & Expiry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="halalCertNumber" className="block text-sm font-semibold text-gray-700 mb-2">
            Halal Certification Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="halalCertNumber"
            name="halalCertNumber"
            value={formData.halalCertNumber}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              fieldErrors.halalCertNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="MUIS-HCC-1234"
          />
          {fieldErrors.halalCertNumber && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.halalCertNumber}</p>
          )}
        </div>

        <div>
          <label htmlFor="halalCertExpiry" className="block text-sm font-semibold text-gray-700 mb-2">
            Halal Certification Expiry <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="halalCertExpiry"
            name="halalCertExpiry"
            value={formData.halalCertExpiry}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              fieldErrors.halalCertExpiry ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {fieldErrors.halalCertExpiry && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.halalCertExpiry}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
          Business Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          maxLength={200}
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            fieldErrors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Brief description of your business (max 200 characters)"
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.description.length}/200 characters
        </p>
        {fieldErrors.description && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
        )}
      </div>

      {/* File Uploads */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Documents</h3>

        {/* Halal Certificate */}
        <div className="mb-6">
          <label htmlFor="certImage" className="block text-sm font-semibold text-gray-700 mb-2">
            Halal Certificate Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="certImage"
            accept="image/jpeg,image/jpg,image/png"
            onChange={(e) => handleFileChange(e, 'cert')}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              fieldErrors.cert ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <p className="mt-1 text-xs text-gray-500">
            JPEG or PNG, max 5MB
          </p>
          {fieldErrors.cert && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.cert}</p>
          )}
          {certImage && (
            <p className="mt-2 text-sm text-green-600">
              ✓ {certImage.name} ({(certImage.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Business Photo */}
        <div>
          <label htmlFor="businessPhoto" className="block text-sm font-semibold text-gray-700 mb-2">
            Business Photo
          </label>
          <input
            type="file"
            id="businessPhoto"
            accept="image/jpeg,image/jpg,image/png"
            onChange={(e) => handleFileChange(e, 'photo')}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              fieldErrors.photo ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <p className="mt-1 text-xs text-gray-500">
            Optional - JPEG or PNG, max 5MB
          </p>
          {fieldErrors.photo && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.photo}</p>
          )}
          {businessPhoto && (
            <p className="mt-2 text-sm text-green-600">
              ✓ {businessPhoto.name} ({(businessPhoto.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
      </div>

      {/* Submitter Information */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="submitterName" className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="submitterName"
              name="submitterName"
              value={formData.submitterName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                fieldErrors.submitterName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John Doe"
            />
            {fieldErrors.submitterName && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.submitterName}</p>
            )}
          </div>

          <div>
            <label htmlFor="submitterEmail" className="block text-sm font-semibold text-gray-700 mb-2">
              Your Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="submitterEmail"
              name="submitterEmail"
              value={formData.submitterEmail}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                fieldErrors.submitterEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="john@example.com"
            />
            {fieldErrors.submitterEmail && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.submitterEmail}</p>
            )}
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600">
          We'll use this email to notify you about your submission status.
        </p>
      </div>

      {/* Terms and Conditions */}
      <div className="border-t border-gray-200 pt-6">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className={`mt-1 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 ${
              fieldErrors.agreeToTerms ? 'border-red-500' : ''
            }`}
          />
          <span className="text-sm text-gray-700">
            I confirm that I am authorized to submit this business and that all information provided is accurate.
            I agree to the terms and conditions of Singapore Halal Directory. <span className="text-red-500">*</span>
          </span>
        </label>
        {fieldErrors.agreeToTerms && (
          <p className="mt-1 text-sm text-red-600 ml-8">{fieldErrors.agreeToTerms}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit Business for Review'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="px-6 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
