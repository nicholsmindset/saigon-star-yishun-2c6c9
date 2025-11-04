'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Configuration
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const BUCKET_NAME = 'business-images'

// Types
interface UploadResult {
  success: boolean
  imageId?: string
  imageUrl?: string
  error?: string
}

interface DeleteResult {
  success: boolean
  error?: string
}

interface ReorderResult {
  success: boolean
  error?: string
}

interface ImageData {
  id: string
  url: string
  caption: string | null
  display_order: number
  is_primary: boolean
  created_at: string
}

/**
 * Upload a new image for a business
 * Validates file size, type, and ownership before uploading to Supabase Storage
 */
export async function uploadBusinessImage(
  businessId: string,
  formData: FormData
): Promise<UploadResult> {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'You must be logged in to upload images' }
  }

  // Verify user owns this business
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('claimed_by, is_featured')
    .eq('id', businessId)
    .single()

  if (businessError || !business) {
    return { success: false, error: 'Business not found' }
  }

  if (business.claimed_by !== user.id) {
    return { success: false, error: 'You do not have permission to upload images for this business' }
  }

  // Get the image file
  const file = formData.get('image') as File
  const caption = formData.get('caption') as string | null

  if (!file) {
    return { success: false, error: 'No image file provided' }
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: 'Image file size must be less than 5MB' }
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: 'Only JPEG, PNG, and WebP images are allowed' }
  }

  // Check image count limit
  const { data: existingImages, error: countError } = await supabase
    .from('images')
    .select('id')
    .eq('business_id', businessId)

  if (countError) {
    return { success: false, error: 'Failed to check image count' }
  }

  const maxImages = business.is_featured ? 8 : 1
  if (existingImages && existingImages.length >= maxImages) {
    return {
      success: false,
      error: `Maximum ${maxImages} image${maxImages > 1 ? 's' : ''} allowed for ${business.is_featured ? 'featured' : 'standard'} listings`
    }
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${businessId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return { success: false, error: 'Failed to upload image to storage' }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName)

  // Determine display order (next in sequence)
  const displayOrder = existingImages ? existingImages.length : 0

  // Determine if this should be the primary image
  const isPrimary = existingImages ? existingImages.length === 0 : true

  // Save image record to database
  const { data: imageData, error: dbError } = await supabase
    .from('images')
    .insert({
      business_id: businessId,
      url: publicUrl,
      caption: caption || null,
      display_order: displayOrder,
      is_primary: isPrimary
    })
    .select('id')
    .single()

  if (dbError) {
    console.error('Database insert error:', dbError)

    // Cleanup: Delete uploaded file from storage
    await supabase.storage.from(BUCKET_NAME).remove([fileName])

    return { success: false, error: 'Failed to save image record' }
  }

  // Revalidate relevant paths
  revalidatePath(`/business/${businessId}`)
  revalidatePath(`/dashboard/edit/${businessId}`)
  revalidatePath('/dashboard')

  return {
    success: true,
    imageId: imageData.id,
    imageUrl: publicUrl
  }
}

/**
 * Delete an image for a business
 * Removes from both storage and database
 */
export async function deleteBusinessImage(
  businessId: string,
  imageId: string
): Promise<DeleteResult> {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'You must be logged in to delete images' }
  }

  // Verify user owns this business
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('claimed_by')
    .eq('id', businessId)
    .single()

  if (businessError || !business) {
    return { success: false, error: 'Business not found' }
  }

  if (business.claimed_by !== user.id) {
    return { success: false, error: 'You do not have permission to delete images for this business' }
  }

  // Get image record
  const { data: image, error: imageError } = await supabase
    .from('images')
    .select('url, display_order')
    .eq('id', imageId)
    .eq('business_id', businessId)
    .single()

  if (imageError || !image) {
    return { success: false, error: 'Image not found' }
  }

  // Extract file path from URL
  const url = new URL(image.url)
  const pathParts = url.pathname.split('/')
  const filePath = pathParts.slice(pathParts.indexOf(BUCKET_NAME) + 1).join('/')

  // Delete from storage
  const { error: storageError } = await supabase
    .storage
    .from(BUCKET_NAME)
    .remove([filePath])

  if (storageError) {
    console.error('Storage delete error:', storageError)
    // Continue anyway to delete database record
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from('images')
    .delete()
    .eq('id', imageId)

  if (dbError) {
    console.error('Database delete error:', dbError)
    return { success: false, error: 'Failed to delete image record' }
  }

  // Reorder remaining images
  const { data: remainingImages } = await supabase
    .from('images')
    .select('id')
    .eq('business_id', businessId)
    .gt('display_order', image.display_order)
    .order('display_order')

  if (remainingImages && remainingImages.length > 0) {
    for (let i = 0; i < remainingImages.length; i++) {
      await supabase
        .from('images')
        .update({ display_order: image.display_order + i })
        .eq('id', remainingImages[i].id)
    }
  }

  // If deleted image was primary, make first remaining image primary
  const { data: newPrimaryCheck } = await supabase
    .from('images')
    .select('id, is_primary')
    .eq('business_id', businessId)
    .order('display_order')
    .limit(1)
    .single()

  if (newPrimaryCheck && !newPrimaryCheck.is_primary) {
    await supabase
      .from('images')
      .update({ is_primary: true })
      .eq('id', newPrimaryCheck.id)
  }

  // Revalidate relevant paths
  revalidatePath(`/business/${businessId}`)
  revalidatePath(`/dashboard/edit/${businessId}`)
  revalidatePath('/dashboard')

  return { success: true }
}

/**
 * Reorder images for a business
 * Updates display_order for multiple images
 */
export async function reorderBusinessImages(
  businessId: string,
  imageIds: string[]
): Promise<ReorderResult> {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'You must be logged in to reorder images' }
  }

  // Verify user owns this business
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('claimed_by')
    .eq('id', businessId)
    .single()

  if (businessError || !business) {
    return { success: false, error: 'Business not found' }
  }

  if (business.claimed_by !== user.id) {
    return { success: false, error: 'You do not have permission to reorder images for this business' }
  }

  // Update display_order for each image
  for (let i = 0; i < imageIds.length; i++) {
    const { error } = await supabase
      .from('images')
      .update({ display_order: i })
      .eq('id', imageIds[i])
      .eq('business_id', businessId)

    if (error) {
      console.error('Error reordering image:', error)
      return { success: false, error: 'Failed to reorder images' }
    }
  }

  // Revalidate relevant paths
  revalidatePath(`/business/${businessId}`)
  revalidatePath(`/dashboard/edit/${businessId}`)

  return { success: true }
}

/**
 * Get all images for a business
 */
export async function getBusinessImages(businessId: string): Promise<ImageData[]> {
  const supabase = await createClient()

  const { data: images, error } = await supabase
    .from('images')
    .select('*')
    .eq('business_id', businessId)
    .order('display_order')

  if (error) {
    console.error('Error fetching images:', error)
    return []
  }

  return images || []
}

/**
 * Set primary image for a business
 */
export async function setPrimaryImage(
  businessId: string,
  imageId: string
): Promise<ReorderResult> {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'You must be logged in' }
  }

  // Verify user owns this business
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('claimed_by')
    .eq('id', businessId)
    .single()

  if (businessError || !business || business.claimed_by !== user.id) {
    return { success: false, error: 'Permission denied' }
  }

  // Remove primary flag from all images
  await supabase
    .from('images')
    .update({ is_primary: false })
    .eq('business_id', businessId)

  // Set new primary image
  const { error } = await supabase
    .from('images')
    .update({ is_primary: true })
    .eq('id', imageId)
    .eq('business_id', businessId)

  if (error) {
    return { success: false, error: 'Failed to set primary image' }
  }

  revalidatePath(`/business/${businessId}`)
  revalidatePath(`/dashboard/edit/${businessId}`)

  return { success: true }
}
