'use client'

import { useState, useRef, ChangeEvent, DragEvent } from 'react'
import { uploadBusinessImage } from '@/app/actions/images'

interface ImageUploaderProps {
  businessId: string
  currentImageCount: number
  maxImages: number
  onUploadComplete: () => void
}

interface PreviewImage {
  file: File
  preview: string
  id: string
}

export default function ImageUploader({
  businessId,
  currentImageCount,
  maxImages,
  onUploadComplete
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<PreviewImage[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const remainingSlots = maxImages - currentImageCount
  const isMaxReached = currentImageCount >= maxImages

  // Validate file
  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, and WebP images are allowed'
    }

    if (file.size > maxSize) {
      return 'Image file size must be less than 5MB'
    }

    return null
  }

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    setError(null)
    const newPreviews: PreviewImage[] = []

    // Check total count including new files
    if (currentImageCount + previews.length + files.length > maxImages) {
      setError(`You can only upload ${remainingSlots} more image${remainingSlots !== 1 ? 's' : ''}`)
      return
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      // Create preview
      const preview = URL.createObjectURL(file)
      newPreviews.push({
        file,
        preview,
        id: `${Date.now()}-${i}`
      })
    }

    setPreviews([...previews, ...newPreviews])
  }

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  // Handle drag and drop
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  // Remove preview
  const removePreview = (id: string) => {
    setPreviews(previews.filter(p => p.id !== id))
    setError(null)
  }

  // Upload images
  const handleUpload = async () => {
    if (previews.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      for (const preview of previews) {
        const formData = new FormData()
        formData.append('image', preview.file)
        if (caption) {
          formData.append('caption', caption)
        }

        const result = await uploadBusinessImage(businessId, formData)

        if (!result.success) {
          setError(result.error || 'Failed to upload image')
          setIsUploading(false)
          return
        }
      }

      // Success - clear previews and refresh
      setPreviews([])
      setCaption('')
      setIsUploading(false)
      onUploadComplete()
    } catch (err) {
      console.error('Upload error:', err)
      setError('An unexpected error occurred during upload')
      setIsUploading(false)
    }
  }

  // Open file dialog
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Upload area */}
      {!isMaxReached && (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all
            ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400'}
            ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple={remainingSlots > 1}
            onChange={handleInputChange}
            className="hidden"
            disabled={isUploading}
          />

          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="text-sm text-gray-600">
              <span className="font-semibold text-emerald-600 hover:text-emerald-700">
                Click to upload
              </span>
              {' or drag and drop'}
            </div>

            <p className="text-xs text-gray-500">
              JPEG, PNG, or WebP (max 5MB)
            </p>

            <p className="text-xs font-medium text-gray-700">
              {remainingSlots} of {maxImages} image{maxImages > 1 ? 's' : ''} remaining
            </p>
          </div>
        </div>
      )}

      {/* Max reached message */}
      {isMaxReached && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            You have reached the maximum of {maxImages} image{maxImages > 1 ? 's' : ''} for this listing.
            Delete an existing image to upload a new one.
          </p>
        </div>
      )}

      {/* Image previews */}
      {previews.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((preview) => (
              <div key={preview.id} className="relative group">
                <img
                  src={preview.preview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removePreview(preview.id)}
                  disabled={isUploading}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  aria-label="Remove preview"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Caption input */}
          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
              Image Caption (Optional)
            </label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption for these images..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              disabled={isUploading}
            />
          </div>

          {/* Upload button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || previews.length === 0}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Upload {previews.length} Image{previews.length > 1 ? 's' : ''}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setPreviews([])
                setCaption('')
                setError(null)
              }}
              disabled={isUploading}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
