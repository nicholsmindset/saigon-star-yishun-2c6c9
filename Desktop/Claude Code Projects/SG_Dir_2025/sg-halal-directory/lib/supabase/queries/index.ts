/**
 * Supabase query utilities for fetching business and area data
 * Handles mapping between hardcoded geographic slugs and Supabase UUIDs
 */

import { SupabaseClient } from '@supabase/supabase-js';

export interface Business {
  id: string;
  name: string;
  slug: string;
  business_type: string;
  description: string | null;
  address: string;
  postal_code: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  area_id: string | null;
  halal_certification: string | null;
  certification_number: string | null;
  is_featured: boolean;
  featured_expiry: string | null;
  claimed_by: string | null;
  is_verified: boolean;
  status: string;
  submitted_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Area {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  latitude: number | null;
  longitude: number | null;
  business_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Get area UUID from slug (e.g., 'raffles-place' -> UUID)
 * Used to map hardcoded geographic hierarchy to Supabase UUIDs
 */
export async function getAreaIdBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from('areas')
    .select('id')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error(`Area not found for slug: ${slug}`, error);
    return null;
  }

  return data.id;
}

/**
 * Get businesses for a specific subarea
 * Filters by area ID, status, and optionally featured status
 * Results sorted by featured first, then by name
 */
export async function getBusinessesByAreaSlug(
  supabase: SupabaseClient,
  areaSlug: string,
  options?: {
    limit?: number;
    offset?: number;
    onlyFeatured?: boolean;
  }
): Promise<Business[]> {
  const areaId = await getAreaIdBySlug(supabase, areaSlug);

  if (!areaId) {
    return [];
  }

  let query = supabase
    .from('businesses')
    .select('*')
    .eq('area_id', areaId)
    .eq('status', 'approved') // RLS policy handles this, but explicit for clarity
    .order('is_featured', { ascending: false })
    .order('name', { ascending: true });

  if (options?.onlyFeatured) {
    query = query.eq('is_featured', true);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching businesses for area ${areaSlug}:`, error);
    return [];
  }

  return data || [];
}

/**
 * Get single business by ID
 */
export async function getBusinessById(
  supabase: SupabaseClient,
  businessId: string
): Promise<Business | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .eq('status', 'approved')
    .single();

  if (error || !data) {
    console.error(`Business not found: ${businessId}`, error);
    return null;
  }

  return data;
}

/**
 * Get featured businesses for an area
 * Used for homepage highlights or area highlights
 */
export async function getFeaturedBusinessesByAreaSlug(
  supabase: SupabaseClient,
  areaSlug: string,
  limit: number = 6
): Promise<Business[]> {
  return getBusinessesByAreaSlug(supabase, areaSlug, {
    limit,
    onlyFeatured: true
  });
}

/**
 * Get area details by slug
 */
export async function getAreaBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<Area | null> {
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error(`Area not found for slug: ${slug}`, error);
    return null;
  }

  return data;
}

/**
 * Search businesses by keyword and optional area
 * Used for search functionality
 */
export async function searchBusinesses(
  supabase: SupabaseClient,
  keyword: string,
  options?: {
    areaSlug?: string;
    limit?: number;
    offset?: number;
  }
): Promise<Business[]> {
  let query = supabase
    .from('businesses')
    .select('*')
    .eq('status', 'approved')
    .or(`name.ilike.%${keyword}%,business_type.ilike.%${keyword}%,address.ilike.%${keyword}%`);

  if (options?.areaSlug) {
    const areaId = await getAreaIdBySlug(supabase, options.areaSlug);
    if (areaId) {
      query = query.eq('area_id', areaId);
    }
  }

  query = query
    .order('is_featured', { ascending: false })
    .order('name', { ascending: true });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error searching businesses:', error);
    return [];
  }

  return data || [];
}
