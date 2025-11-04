'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ============================================================================
// ADMIN AUTHORIZATION HELPER
// ============================================================================

async function checkAdminAuth() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized: Please log in')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.is_admin) {
    throw new Error('Unauthorized: Admin access required')
  }

  return { supabase, user }
}

// ============================================================================
// BUSINESS CLAIMS ACTIONS
// ============================================================================

export async function getBusinessClaims(status?: 'pending' | 'approved' | 'rejected') {
  const { supabase } = await checkAdminAuth()

  let query = supabase
    .from('business_claims')
    .select(`
      *,
      business:businesses(
        id,
        name,
        address,
        business_type,
        area:areas(name)
      ),
      user:profiles!business_claims_user_id_fkey(
        id,
        email,
        full_name
      )
    `)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch claims: ${error.message}`)
  }

  return data
}

export async function approveClaim(claimId: string, adminNotes?: string) {
  const { supabase } = await checkAdminAuth()

  // Get claim details
  const { data: claim, error: claimError } = await supabase
    .from('business_claims')
    .select('business_id, user_id')
    .eq('id', claimId)
    .single()

  if (claimError || !claim) {
    throw new Error('Claim not found')
  }

  // Update claim status
  const { error: updateClaimError } = await supabase
    .from('business_claims')
    .update({
      status: 'approved',
      admin_notes: adminNotes || null
    })
    .eq('id', claimId)

  if (updateClaimError) {
    throw new Error(`Failed to approve claim: ${updateClaimError.message}`)
  }

  // Update business with claimed_by
  const { error: updateBusinessError } = await supabase
    .from('businesses')
    .update({
      claimed_by: claim.user_id,
      is_verified: true
    })
    .eq('id', claim.business_id)

  if (updateBusinessError) {
    throw new Error(`Failed to update business: ${updateBusinessError.message}`)
  }

  // Set user as business owner
  const { error: updateProfileError } = await supabase
    .from('profiles')
    .update({
      is_business_owner: true
    })
    .eq('id', claim.user_id)

  if (updateProfileError) {
    throw new Error(`Failed to update profile: ${updateProfileError.message}`)
  }

  revalidatePath('/admin/claims')
  revalidatePath('/dashboard')

  return { success: true }
}

export async function rejectClaim(claimId: string, adminNotes: string) {
  const { supabase } = await checkAdminAuth()

  const { error } = await supabase
    .from('business_claims')
    .update({
      status: 'rejected',
      admin_notes: adminNotes
    })
    .eq('id', claimId)

  if (error) {
    throw new Error(`Failed to reject claim: ${error.message}`)
  }

  revalidatePath('/admin/claims')

  return { success: true }
}

// ============================================================================
// COUPON CODES ACTIONS
// ============================================================================

export async function getCoupons() {
  const { supabase } = await checkAdminAuth()

  const { data, error } = await supabase
    .from('coupon_codes')
    .select(`
      *,
      creator:profiles!coupon_codes_created_by_fkey(full_name, email)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch coupons: ${error.message}`)
  }

  return data
}

export async function createCoupon(formData: {
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  max_uses?: number
  valid_until?: string
}) {
  const { supabase, user } = await checkAdminAuth()

  const { data, error } = await supabase
    .from('coupon_codes')
    .insert({
      code: formData.code.toUpperCase(),
      discount_type: formData.discount_type,
      discount_value: formData.discount_value,
      max_uses: formData.max_uses || null,
      valid_until: formData.valid_until || null,
      created_by: user.id,
      is_active: true
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create coupon: ${error.message}`)
  }

  revalidatePath('/admin/coupons')

  return data
}

export async function generateCouponCode(): Promise<string> {
  const prefix = 'HALAL'
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}${randomPart}`
}

export async function toggleCouponStatus(couponId: string, isActive: boolean) {
  const { supabase } = await checkAdminAuth()

  const { error } = await supabase
    .from('coupon_codes')
    .update({ is_active: isActive })
    .eq('id', couponId)

  if (error) {
    throw new Error(`Failed to update coupon: ${error.message}`)
  }

  revalidatePath('/admin/coupons')

  return { success: true }
}

// ============================================================================
// BUSINESS MANAGEMENT ACTIONS
// ============================================================================

export async function getBusinesses(filters?: {
  status?: 'pending' | 'approved' | 'rejected'
  area_id?: string
  is_featured?: boolean
}) {
  const { supabase } = await checkAdminAuth()

  let query = supabase
    .from('businesses')
    .select(`
      *,
      area:areas(name, slug),
      claimed_by_profile:profiles!businesses_claimed_by_fkey(full_name, email)
    `)
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.area_id) {
    query = query.eq('area_id', filters.area_id)
  }

  if (filters?.is_featured !== undefined) {
    query = query.eq('is_featured', filters.is_featured)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch businesses: ${error.message}`)
  }

  return data
}

export async function updateBusinessStatus(
  businessId: string,
  status: 'pending' | 'approved' | 'rejected'
) {
  const { supabase } = await checkAdminAuth()

  const { error } = await supabase
    .from('businesses')
    .update({ status })
    .eq('id', businessId)

  if (error) {
    throw new Error(`Failed to update business status: ${error.message}`)
  }

  revalidatePath('/admin/businesses')
  revalidatePath('/directory')

  return { success: true }
}

export async function makeFeatured(
  businessId: string,
  durationMonths: 1 | 3 | 6
) {
  const { supabase, user } = await checkAdminAuth()

  // Calculate expiry date
  const startDate = new Date()
  const expiryDate = new Date(startDate)
  expiryDate.setMonth(expiryDate.getMonth() + durationMonths)

  // Update business
  const { error: businessError } = await supabase
    .from('businesses')
    .update({
      is_featured: true,
      featured_expiry: expiryDate.toISOString()
    })
    .eq('id', businessId)

  if (businessError) {
    throw new Error(`Failed to feature business: ${businessError.message}`)
  }

  // Create featured listing record (with admin override payment ID)
  const { error: featuredError } = await supabase
    .from('featured_listings')
    .insert({
      business_id: businessId,
      user_id: user.id,
      stripe_payment_id: `admin_grant_${Date.now()}`,
      amount_paid: 0,
      duration_months: durationMonths,
      start_date: startDate.toISOString(),
      expiry_date: expiryDate.toISOString(),
      is_active: true
    })

  if (featuredError) {
    throw new Error(`Failed to create featured listing: ${featuredError.message}`)
  }

  revalidatePath('/admin/businesses')
  revalidatePath('/directory')

  return { success: true }
}

export async function removeFeatured(businessId: string) {
  const { supabase } = await checkAdminAuth()

  const { error } = await supabase
    .from('businesses')
    .update({
      is_featured: false,
      featured_expiry: null
    })
    .eq('id', businessId)

  if (error) {
    throw new Error(`Failed to remove featured status: ${error.message}`)
  }

  revalidatePath('/admin/businesses')
  revalidatePath('/directory')

  return { success: true }
}
