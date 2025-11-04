'use client'

import { useState } from 'react'
import { deleteBusinessImage, reorderBusinessImages, setPrimaryImage } from '@/app/actions/images'
import Image from 'next/image'

interface ImageData {
  id: string
  url: string
  caption: string | null
  display_order: number
  is_primary: boolean
  created_at: string
}

interface ImageManagerProps {
  businessId: string
  images: ImageData[]
  maxImages: number
  onImagesChange: () => void
}

export default function ImageManager({
  businessId,
  images,
  maxImages,
  onImagesChange
}: ImageManagerProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null)
  const [sortedImages, setSortedImages] = useState<ImageData[]>(images)

  // Update sorted images when images prop changes
  if (images !== sortedImages) {
    setSortedImages(images)
  }

  // Handle delete
  const handleDelete = async (imageId: string) => {
    setDeletingId(imageId)
    setError(null)

    const result = await deleteBusinessImage(businessId, imageId)

    if (result.success) {
      setShowDeleteModal(null)
      onImagesChange()
    } else {
      setError(result.error || 'Failed to delete image')
    }

    setDeletingId(null)
  }

  // Handle set primary
  const handleSetPrimary = async (imageId: string) => {
    setError(null)

    const result = await setPrimaryImage(businessId, imageId)

    if (result.success) {
      onImagesChange()
    } else {
      setError(result.error || 'Failed to set primary image')
    }
  }

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null) return
    setDraggedOverIndex(index)
  }

  const handleDragEnd = async () => {
    if (draggedIndex === null || draggedOverIndex === null || draggedIndex === draggedOverIndex) {
      setDraggedIndex(null)
      setDraggedOverIndex(null)
      return
    }

    // Reorder locally
    const newImages = [...sortedImages]
    const [movedImage] = newImages.splice(draggedIndex, 1)
    newImages.splice(draggedOverIndex, 0, movedImage)

    setSortedImages(newImages)
    setDraggedIndex(null)
    setDraggedOverIndex(null)

    // Save to server
    const imageIds = newImages.map(img => img.id)
    const result = await reorderBusinessImages(businessId, imageIds)

    if (!result.success) {
      setError(result.error || 'Failed to reorder images')
      setSortedImages(images) // Revert on error
    } else {
      onImagesChange()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-2 text-sm text-gray-600">No images uploaded yet</p>
        <p className="mt-1 text-xs text-gray-500">Upload up to {maxImages} image{maxImages > 1 ? 's' : ''} using the uploader below</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Image count */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          {images.length} of {maxImages} image{maxImages > 1 ? 's' : ''} uploaded
        </p>
        {images.length > 1 && (
          <p className="text-xs text-gray-500">
            Drag images to reorder
          </p>
        )}
      </div>

      {/* Images grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {sortedImages.map((image, index) => (
          <div
            key={image.id}
            draggable={images.length > 1}
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            className={`
              relative group rounded-lg overflow-hidden border-2 transition-all
              ${image.is_primary ? 'border-emerald-500' : 'border-gray-200'}
              ${draggedIndex === index ? 'opacity-50' : ''}
              ${draggedOverIndex === index ? 'ring-2 ring-emerald-400' : ''}
              ${images.length > 1 ? 'cursor-move' : ''}
            `}
          >
            {/* Primary badge */}
            {image.is_primary && (
              <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded z-10">
                Primary
              </div>
            )}

            {/* Image */}
            <div className="aspect-square relative">
              <Image
                src={image.url}
                alt={image.caption || 'Business image'}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
            </div>

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              {/* Set primary button */}
              {!image.is_primary && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(image.id)}
                  className="bg-white text-gray-700 p-2 rounded-full hover:bg-emerald-50 transition-colors"
                  title="Set as primary"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              )}

              {/* Delete button */}
              <button
                type="button"
                onClick={() => setShowDeleteModal(image.id)}
                disabled={deletingId === image.id}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                title="Delete image"
              >
                {deletingId === image.id ? (
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>

            {/* Caption */}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Image?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteModal(null)}
                disabled={deletingId !== null}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deletingId !== null}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deletingId === showDeleteModal ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Deleting...</span>
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
