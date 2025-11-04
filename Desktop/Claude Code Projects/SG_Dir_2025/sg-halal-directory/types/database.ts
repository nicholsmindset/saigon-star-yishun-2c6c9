// TypeScript types for Singapore Halal Directory database schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          is_admin: boolean
          is_business_owner: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          is_admin?: boolean
          is_business_owner?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          is_admin?: boolean
          is_business_owner?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      areas: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          meta_title: string | null
          meta_description: string | null
          latitude: number | null
          longitude: number | null
          business_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          meta_title?: string | null
          meta_description?: string | null
          latitude?: number | null
          longitude?: number | null
          business_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          meta_title?: string | null
          meta_description?: string | null
          latitude?: number | null
          longitude?: number | null
          business_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          name: string
          slug: string
          business_type: string
          description: string | null
          address: string
          postal_code: string | null
          phone: string | null
          email: string | null
          website: string | null
          latitude: number | null
          longitude: number | null
          area_id: string | null
          halal_certification: string | null
          certification_number: string | null
          is_featured: boolean
          featured_expiry: string | null
          claimed_by: string | null
          is_verified: boolean
          status: 'pending' | 'approved' | 'rejected'
          submitted_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          business_type: string
          description?: string | null
          address: string
          postal_code?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          latitude?: number | null
          longitude?: number | null
          area_id?: string | null
          halal_certification?: string | null
          certification_number?: string | null
          is_featured?: boolean
          featured_expiry?: string | null
          claimed_by?: string | null
          is_verified?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          submitted_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          business_type?: string
          description?: string | null
          address?: string
          postal_code?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          latitude?: number | null
          longitude?: number | null
          area_id?: string | null
          halal_certification?: string | null
          certification_number?: string | null
          is_featured?: boolean
          featured_expiry?: string | null
          claimed_by?: string | null
          is_verified?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          submitted_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      business_claims: {
        Row: {
          id: string
          business_id: string
          user_id: string
          owner_name: string
          owner_email: string
          owner_phone: string | null
          verification_documents: string[] | null
          status: 'pending' | 'approved' | 'rejected'
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id: string
          owner_name: string
          owner_email: string
          owner_phone?: string | null
          verification_documents?: string[] | null
          status?: 'pending' | 'approved' | 'rejected'
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string
          owner_name?: string
          owner_email?: string
          owner_phone?: string | null
          verification_documents?: string[] | null
          status?: 'pending' | 'approved' | 'rejected'
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      featured_listings: {
        Row: {
          id: string
          business_id: string
          user_id: string
          stripe_payment_id: string
          stripe_charge_id: string | null
          amount_paid: number
          currency: string
          duration_months: 1 | 3 | 6
          start_date: string
          expiry_date: string
          coupon_code: string | null
          discount_amount: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id: string
          stripe_payment_id: string
          stripe_charge_id?: string | null
          amount_paid: number
          currency?: string
          duration_months: 1 | 3 | 6
          start_date?: string
          expiry_date: string
          coupon_code?: string | null
          discount_amount?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string
          stripe_payment_id?: string
          stripe_charge_id?: string | null
          amount_paid?: number
          currency?: string
          duration_months?: 1 | 3 | 6
          start_date?: string
          expiry_date?: string
          coupon_code?: string | null
          discount_amount?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      images: {
        Row: {
          id: string
          business_id: string
          url: string
          caption: string | null
          display_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          url: string
          caption?: string | null
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          url?: string
          caption?: string | null
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      coupon_codes: {
        Row: {
          id: string
          code: string
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          stripe_coupon_id: string | null
          max_uses: number | null
          times_used: number
          valid_from: string
          valid_until: string | null
          is_active: boolean
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          stripe_coupon_id?: string | null
          max_uses?: number | null
          times_used?: number
          valid_from?: string
          valid_until?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          discount_type?: 'percentage' | 'fixed'
          discount_value?: number
          stripe_coupon_id?: string | null
          max_uses?: number | null
          times_used?: number
          valid_from?: string
          valid_until?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
