'use server'

import { createClient } from '@/utils/supabase/server'

export interface ClaimedBusiness {
  id: string
  name: string
  address: string
  slug: string
}

/**
 * Get all businesses claimed by a specific user
 * Used by the badge generator to show which businesses the user can create badges for
 */
export async function getClaimedBusinesses(userId: string): Promise<ClaimedBusiness[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select('id, name, address, slug')
    .eq('claimed_by', userId)
    .eq('status', 'approved')
    .order('name')

  if (error) {
    console.error('Error fetching claimed businesses:', error)
    return []
  }

  return data || []
}

/**
 * Verify if a backlink exists on a business's website
 * This would be called by a cron job or webhook to check for badge implementation
 *
 * @param businessId - The business to check
 * @returns true if backlink is found, false otherwise
 */
export async function verifyBacklink(businessId: string): Promise<boolean> {
  const supabase = await createClient()

  // Get business website URL
  const { data: business, error } = await supabase
    .from('businesses')
    .select('website, id')
    .eq('id', businessId)
    .single()

  if (error || !business?.website) {
    console.error('Error fetching business for backlink verification:', error)
    return false
  }

  try {
    // Fetch the website content
    const response = await fetch(business.website, {
      headers: {
        'User-Agent': 'Singapore Halal Directory Badge Verifier/1.0',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      console.error(`Failed to fetch website: ${response.status}`)
      return false
    }

    const html = await response.text()

    // Check if the HTML contains a link to the business detail page
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sghalaldirectory.com'
    const businessUrl = `${siteUrl}/business/${business.id}`

    // Look for the link in the HTML (case-insensitive)
    const hasBacklink = html.toLowerCase().includes(businessUrl.toLowerCase())

    return hasBacklink
  } catch (error) {
    console.error('Error verifying backlink:', error)
    return false
  }
}

/**
 * Grant free featured listing to a business after successful backlink verification
 *
 * @param businessId - The business to grant featured status
 * @param userId - The user who owns the business
 * @returns true if successful, false otherwise
 */
export async function grantFreeMonth(businessId: string, userId: string): Promise<boolean> {
  const supabase = await createClient()

  // Calculate expiry date (1 month from now)
  const now = new Date()
  const expiryDate = new Date(now)
  expiryDate.setMonth(expiryDate.getMonth() + 1)

  try {
    // Update the business to featured status
    const { error: businessError } = await supabase
      .from('businesses')
      .update({
        is_featured: true,
        featured_expiry: expiryDate.toISOString(),
      })
      .eq('id', businessId)
      .eq('claimed_by', userId) // Extra safety check

    if (businessError) {
      console.error('Error updating business featured status:', businessError)
      return false
    }

    // Create a featured listing record for tracking
    const { error: listingError } = await supabase
      .from('featured_listings')
      .insert({
        business_id: businessId,
        user_id: userId,
        stripe_payment_id: `badge_reward_${businessId}`,
        amount_paid: 0, // Free reward
        currency: 'SGD',
        duration_months: 1,
        start_date: now.toISOString(),
        expiry_date: expiryDate.toISOString(),
        coupon_code: 'BADGE_BACKLINK_REWARD',
        discount_amount: 2900, // $29 in cents
        is_active: true,
      })

    if (listingError) {
      console.error('Error creating featured listing record:', listingError)
      // Don't return false here - business was already updated
      // This is just for tracking purposes
    }

    return true
  } catch (error) {
    console.error('Error granting free month:', error)
    return false
  }
}

/**
 * Check and process badge verification for all businesses with websites
 * This would be called by a scheduled cron job (e.g., daily at midnight)
 *
 * Example cron setup:
 * - Vercel Cron: /api/cron/verify-backlinks
 * - Rate: Once per day (0 0 * * *)
 */
export async function processBacklinkVerifications(): Promise<{
  checked: number
  verified: number
  rewarded: number
}> {
  const supabase = await createClient()

  // Get all claimed businesses with websites that aren't already featured
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, website, claimed_by')
    .eq('status', 'approved')
    .not('claimed_by', 'is', null)
    .not('website', 'is', null)
    .eq('is_featured', false)

  if (error || !businesses) {
    console.error('Error fetching businesses for verification:', error)
    return { checked: 0, verified: 0, rewarded: 0 }
  }

  let verified = 0
  let rewarded = 0

  // Process each business
  for (const business of businesses) {
    try {
      const hasBacklink = await verifyBacklink(business.id)

      if (hasBacklink && business.claimed_by) {
        // Grant free month of featured listing
        const success = await grantFreeMonth(business.id, business.claimed_by)
        if (success) {
          verified++
          rewarded++
          console.log(`Granted free month to business ${business.id}`)
        }
      } else if (hasBacklink) {
        verified++
      }
    } catch (error) {
      console.error(`Error processing business ${business.id}:`, error)
    }
  }

  return {
    checked: businesses.length,
    verified,
    rewarded,
  }
}
