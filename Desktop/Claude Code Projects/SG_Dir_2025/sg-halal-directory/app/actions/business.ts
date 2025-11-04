'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitBusinessClaim(formData: FormData) {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to claim a business' }
  }

  const businessId = formData.get('businessId') as string
  const ownerName = formData.get('ownerName') as string
  const ownerEmail = formData.get('ownerEmail') as string
  const ownerPhone = formData.get('ownerPhone') as string

  // Validate required fields
  if (!businessId || !ownerName || !ownerEmail) {
    return { error: 'Please fill in all required fields' }
  }

  // Check if this business is already claimed by this user
  const { data: existingClaim } = await supabase
    .from('business_claims')
    .select('id')
    .eq('business_id', businessId)
    .eq('user_id', user.id)
    .single()

  if (existingClaim) {
    return { error: 'You have already submitted a claim for this business' }
  }

  // Insert claim
  const { error } = await supabase
    .from('business_claims')
    .insert({
      business_id: businessId,
      user_id: user.id,
      owner_name: ownerName,
      owner_email: ownerEmail,
      owner_phone: ownerPhone,
      status: 'pending'
    })

  if (error) {
    console.error('Error submitting claim:', error)
    return { error: 'Failed to submit claim. Please try again.' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateBusiness(businessId: string, formData: FormData) {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to update a business' }
  }

  // Verify user owns this business
  const { data: business } = await supabase
    .from('businesses')
    .select('claimed_by')
    .eq('id', businessId)
    .single()

  if (!business || business.claimed_by !== user.id) {
    return { error: 'You do not have permission to edit this business' }
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const website = formData.get('website') as string
  const address = formData.get('address') as string

  // Validate required fields
  if (!name || !address) {
    return { error: 'Name and address are required' }
  }

  // Update business
  const { error } = await supabase
    .from('businesses')
    .update({
      name,
      description,
      phone,
      email,
      website,
      address
    })
    .eq('id', businessId)

  if (error) {
    console.error('Error updating business:', error)
    return { error: 'Failed to update business. Please try again.' }
  }

  revalidatePath(`/business/${businessId}`)
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function getClaimedBusinesses(userId: string) {
  const supabase = await createClient()

  const { data: businesses, error } = await supabase
    .from('businesses')
    .select(`
      id,
      name,
      slug,
      business_type,
      address,
      is_featured,
      featured_expiry,
      status
    `)
    .eq('claimed_by', userId)
    .eq('status', 'approved')
    .order('name')

  if (error) {
    console.error('Error fetching claimed businesses:', error)
    return []
  }

  return businesses || []
}

export async function getPendingClaims(userId: string) {
  const supabase = await createClient()

  const { data: claims, error } = await supabase
    .from('business_claims')
    .select(`
      id,
      status,
      created_at,
      businesses (
        id,
        name,
        business_type,
        address
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching claims:', error)
    return []
  }

  return claims || []
}

export async function getBusinessForEdit(businessId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: business, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .eq('claimed_by', user.id)
    .single()

  if (error) {
    console.error('Error fetching business:', error)
    return null
  }

  return business
}
