'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCoordinates, formatAddressForGeocoding } from '@/lib/geocoding'
import { sendAdminNotification, sendSubmitterConfirmation } from '@/lib/email'

export async function submitBusinessListing(formData: FormData) {
  const supabase = await createClient()

  try {
    // Extract form data
    const businessName = formData.get('businessName') as string
    const businessType = formData.get('businessType') as string
    const address = formData.get('address') as string
    const postalCode = formData.get('postalCode') as string
    const areaId = formData.get('areaId') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const website = formData.get('website') as string
    const halalCertNumber = formData.get('halalCertNumber') as string
    const halalCertExpiry = formData.get('halalCertExpiry') as string
    const description = formData.get('description') as string
    const submitterName = formData.get('submitterName') as string
    const submitterEmail = formData.get('submitterEmail') as string

    const certImage = formData.get('certImage') as File
    const businessPhoto = formData.get('businessPhoto') as File | null

    // Validate required fields
    if (!businessName || !businessType || !address || !postalCode || !areaId ||
        !halalCertNumber || !halalCertExpiry || !submitterName || !submitterEmail || !certImage) {
      return { error: 'Please fill in all required fields' }
    }

    // Generate slug from business name
    const slug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check if slug already exists
    const { data: existingBusiness } = await supabase
      .from('businesses')
      .select('id')
      .eq('slug', slug)
      .single()

    let finalSlug = slug
    if (existingBusiness) {
      // Append random number to make unique
      finalSlug = `${slug}-${Math.floor(Math.random() * 10000)}`
    }

    // Geocode the address to get coordinates
    // This runs BEFORE database insert so we can include coordinates
    const formattedAddress = formatAddressForGeocoding(address, postalCode, 'Singapore')
    const geoData = await getCoordinates(formattedAddress)

    // Log geocoding results for debugging
    if (geoData) {
      console.log(`✅ Geocoded address: ${formattedAddress}`)
      console.log(`   Coordinates: ${geoData.latitude}, ${geoData.longitude}`)
    } else {
      console.warn(`⚠️ Geocoding failed for address: ${formattedAddress}`)
      console.warn('   Business will be submitted with NULL coordinates')
    }

    // Upload halal certificate to Supabase Storage
    const certFileName = `${Date.now()}-${certImage.name.replace(/[^a-zA-Z0-9.]/g, '-')}`
    const { data: certUpload, error: certUploadError } = await supabase
      .storage
      .from('business-images')
      .upload(`certificates/${certFileName}`, certImage, {
        cacheControl: '3600',
        upsert: false
      })

    if (certUploadError) {
      console.error('Certificate upload error:', certUploadError)
      return { error: 'Failed to upload certificate image. Please try again.' }
    }

    // Get public URL for certificate
    const { data: { publicUrl: certUrl } } = supabase
      .storage
      .from('business-images')
      .getPublicUrl(`certificates/${certFileName}`)

    // Upload business photo if provided
    let businessPhotoUrl = null
    if (businessPhoto && businessPhoto.size > 0) {
      const photoFileName = `${Date.now()}-${businessPhoto.name.replace(/[^a-zA-Z0-9.]/g, '-')}`
      const { data: photoUpload, error: photoUploadError } = await supabase
        .storage
        .from('business-images')
        .upload(`photos/${photoFileName}`, businessPhoto, {
          cacheControl: '3600',
          upsert: false
        })

      if (!photoUploadError) {
        const { data: { publicUrl } } = supabase
          .storage
          .from('business-images')
          .getPublicUrl(`photos/${photoFileName}`)
        businessPhotoUrl = publicUrl
      }
    }

    // Insert business with pending status AND coordinates
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert({
        name: businessName,
        slug: finalSlug,
        business_type: businessType,
        address,
        postal_code: postalCode,
        area_id: areaId,
        phone: phone || null,
        email: email || null,
        website: website || null,
        halal_cert_number: halalCertNumber,
        halal_cert_expiry: halalCertExpiry,
        halal_cert_image_url: certUrl,
        description: description || null,
        status: 'pending',
        is_featured: false,
        submitter_name: submitterName,
        submitter_email: submitterEmail,
        submitted_at: new Date().toISOString(),
        // Add geocoded coordinates (nullable - submission succeeds even if geocoding fails)
        latitude: geoData?.latitude || null,
        longitude: geoData?.longitude || null,
      })
      .select('id')
      .single()

    if (businessError) {
      console.error('Business insert error:', businessError)

      // Clean up uploaded files on error
      await supabase.storage.from('business-images').remove([`certificates/${certFileName}`])
      if (businessPhotoUrl) {
        await supabase.storage.from('business-images').remove([`photos/${photoFileName}`])
      }

      return { error: 'Failed to submit business. Please try again.' }
    }

    // Insert business photo if uploaded
    if (businessPhotoUrl && business?.id) {
      await supabase
        .from('images')
        .insert({
          business_id: business.id,
          image_url: businessPhotoUrl,
          is_primary: true,
          display_order: 1
        })
    }

    // Fetch area name for email notifications
    const { data: areaData } = await supabase
      .from('areas')
      .select('name')
      .eq('id', areaId)
      .single()

    const areaName = areaData?.name || 'Unknown Area'
    const submittedAt = new Date().toISOString()

    // Send email notifications
    // Note: We don't block submission success on email failures
    // Emails are sent asynchronously with error logging
    try {
      // Send admin notification
      const adminEmailResult = await sendAdminNotification({
        businessName,
        businessType,
        areaName,
        submitterName,
        submitterEmail,
        halalCertNumber,
        address,
        submittedAt,
      })

      if (!adminEmailResult.success) {
        console.error('❌ Admin notification email failed:', adminEmailResult.error)
      } else {
        console.log('✅ Admin notification email sent successfully')
      }
    } catch (error) {
      console.error('❌ Failed to send admin notification:', error)
      // Continue with submission - email failure is non-critical
    }

    try {
      // Send submitter confirmation
      const submitterEmailResult = await sendSubmitterConfirmation({
        businessName,
        businessType,
        areaName,
        submitterName,
        submitterEmail,
        halalCertNumber,
        address,
        submittedAt,
      })

      if (!submitterEmailResult.success) {
        console.error('❌ Submitter confirmation email failed:', submitterEmailResult.error)
      } else {
        console.log('✅ Submitter confirmation email sent successfully')
      }
    } catch (error) {
      console.error('❌ Failed to send submitter confirmation:', error)
      // Continue with submission - email failure is non-critical
    }

    revalidatePath('/admin/businesses')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
