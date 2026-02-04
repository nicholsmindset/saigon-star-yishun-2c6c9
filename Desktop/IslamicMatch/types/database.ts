WARN: no SMS provider is enabled. Disabling phone login
Initialising login role...
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          can_manage_subscriptions: boolean | null
          can_moderate_messages: boolean | null
          can_moderate_photos: boolean | null
          can_suspend_users: boolean | null
          can_verify_profiles: boolean | null
          can_view_analytics: boolean | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          can_manage_subscriptions?: boolean | null
          can_moderate_messages?: boolean | null
          can_moderate_photos?: boolean | null
          can_suspend_users?: boolean | null
          can_verify_profiles?: boolean | null
          can_view_analytics?: boolean | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          can_manage_subscriptions?: boolean | null
          can_moderate_messages?: boolean | null
          can_moderate_photos?: boolean | null
          can_suspend_users?: boolean | null
          can_verify_profiles?: boolean | null
          can_view_analytics?: boolean | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          archived_by: string[] | null
          can_send_contact: boolean | null
          can_send_photos: boolean | null
          created_at: string | null
          id: string
          is_active: boolean | null
          match_id: string
          updated_at: string | null
          user1_id: string
          user2_id: string
          wali_has_access: boolean | null
          wali_user_id: string | null
        }
        Insert: {
          archived_by?: string[] | null
          can_send_contact?: boolean | null
          can_send_photos?: boolean | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          match_id: string
          updated_at?: string | null
          user1_id: string
          user2_id: string
          wali_has_access?: boolean | null
          wali_user_id?: string | null
        }
        Update: {
          archived_by?: string[] | null
          can_send_contact?: boolean | null
          can_send_photos?: boolean | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          match_id?: string
          updated_at?: string | null
          user1_id?: string
          user2_id?: string
          wali_has_access?: boolean | null
          wali_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_wali_user_id_fkey"
            columns: ["wali_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          biller: string
          created_at: string
          file_name: string
          file_url: string
          id: string
          invoice_date: string
          taxes: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          biller: string
          created_at?: string
          file_name: string
          file_url: string
          id?: string
          invoice_date: string
          taxes: number
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          biller?: string
          created_at?: string
          file_name?: string
          file_url?: string
          id?: string
          invoice_date?: string
          taxes?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      match_interests: {
        Row: {
          created_at: string | null
          expires_at: string | null
          from_user_id: string
          id: string
          initial_message: string | null
          interest_type: string | null
          matched_at: string | null
          requires_wali_approval: boolean | null
          responded_at: string | null
          status: string | null
          to_user_id: string
          updated_at: string | null
          viewed_at: string | null
          viewed_by_recipient: boolean | null
          wali_approval_notes: string | null
          wali_approved: boolean | null
          wali_approved_at: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          from_user_id: string
          id?: string
          initial_message?: string | null
          interest_type?: string | null
          matched_at?: string | null
          requires_wali_approval?: boolean | null
          responded_at?: string | null
          status?: string | null
          to_user_id: string
          updated_at?: string | null
          viewed_at?: string | null
          viewed_by_recipient?: boolean | null
          wali_approval_notes?: string | null
          wali_approved?: boolean | null
          wali_approved_at?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          from_user_id?: string
          id?: string
          initial_message?: string | null
          interest_type?: string | null
          matched_at?: string | null
          requires_wali_approval?: boolean | null
          responded_at?: string | null
          status?: string | null
          to_user_id?: string
          updated_at?: string | null
          viewed_at?: string | null
          viewed_by_recipient?: boolean | null
          wali_approval_notes?: string | null
          wali_approved?: boolean | null
          wali_approved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_interests_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_interests_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_preferences: {
        Row: {
          accept_converts: boolean | null
          accept_different_ethnicity: boolean | null
          accept_divorced: boolean | null
          accept_with_children: boolean | null
          age_max: number | null
          age_min: number | null
          created_at: string | null
          education_preference: string[] | null
          ethnicity_preference: string[] | null
          height_max_cm: number | null
          height_min_cm: number | null
          id: string
          income_preference: string[] | null
          language_preference: string[] | null
          madhab_preference: string[] | null
          marital_status_preference: string[] | null
          max_distance_km: number | null
          occupation_preference: string[] | null
          open_to_relocation: boolean | null
          prayer_preference: string[] | null
          preferred_cities: string[] | null
          preferred_countries: string[] | null
          religiosity_preference: string[] | null
          sect_preference: string[] | null
          smoking_acceptance: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accept_converts?: boolean | null
          accept_different_ethnicity?: boolean | null
          accept_divorced?: boolean | null
          accept_with_children?: boolean | null
          age_max?: number | null
          age_min?: number | null
          created_at?: string | null
          education_preference?: string[] | null
          ethnicity_preference?: string[] | null
          height_max_cm?: number | null
          height_min_cm?: number | null
          id?: string
          income_preference?: string[] | null
          language_preference?: string[] | null
          madhab_preference?: string[] | null
          marital_status_preference?: string[] | null
          max_distance_km?: number | null
          occupation_preference?: string[] | null
          open_to_relocation?: boolean | null
          prayer_preference?: string[] | null
          preferred_cities?: string[] | null
          preferred_countries?: string[] | null
          religiosity_preference?: string[] | null
          sect_preference?: string[] | null
          smoking_acceptance?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accept_converts?: boolean | null
          accept_different_ethnicity?: boolean | null
          accept_divorced?: boolean | null
          accept_with_children?: boolean | null
          age_max?: number | null
          age_min?: number | null
          created_at?: string | null
          education_preference?: string[] | null
          ethnicity_preference?: string[] | null
          height_max_cm?: number | null
          height_min_cm?: number | null
          id?: string
          income_preference?: string[] | null
          language_preference?: string[] | null
          madhab_preference?: string[] | null
          marital_status_preference?: string[] | null
          max_distance_km?: number | null
          occupation_preference?: string[] | null
          open_to_relocation?: boolean | null
          prayer_preference?: string[] | null
          preferred_cities?: string[] | null
          preferred_countries?: string[] | null
          religiosity_preference?: string[] | null
          sect_preference?: string[] | null
          smoking_acceptance?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          communication_status: string | null
          created_at: string | null
          id: string
          interest1_id: string | null
          interest2_id: string | null
          last_message_at: string | null
          match_score: number | null
          matched_at: string | null
          stage: string | null
          unmatched_by: string | null
          unmatched_reason: string | null
          updated_at: string | null
          user1_id: string
          user2_id: string
          wali_approved: boolean | null
          wali_notified: boolean | null
        }
        Insert: {
          communication_status?: string | null
          created_at?: string | null
          id?: string
          interest1_id?: string | null
          interest2_id?: string | null
          last_message_at?: string | null
          match_score?: number | null
          matched_at?: string | null
          stage?: string | null
          unmatched_by?: string | null
          unmatched_reason?: string | null
          updated_at?: string | null
          user1_id: string
          user2_id: string
          wali_approved?: boolean | null
          wali_notified?: boolean | null
        }
        Update: {
          communication_status?: string | null
          created_at?: string | null
          id?: string
          interest1_id?: string | null
          interest2_id?: string | null
          last_message_at?: string | null
          match_score?: number | null
          matched_at?: string | null
          stage?: string | null
          unmatched_by?: string | null
          unmatched_reason?: string | null
          updated_at?: string | null
          user1_id?: string
          user2_id?: string
          wali_approved?: boolean | null
          wali_notified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_interest1_id_fkey"
            columns: ["interest1_id"]
            isOneToOne: false
            referencedRelation: "match_interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_interest2_id_fkey"
            columns: ["interest2_id"]
            isOneToOne: false
            referencedRelation: "match_interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_unmatched_by_fkey"
            columns: ["unmatched_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          deleted_at: string | null
          flag_reason: string | null
          id: string
          is_deleted: boolean | null
          is_flagged: boolean | null
          is_read: boolean | null
          media_url: string | null
          message_type: string | null
          read_at: string | null
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          deleted_at?: string | null
          flag_reason?: string | null
          id?: string
          is_deleted?: boolean | null
          is_flagged?: boolean | null
          is_read?: boolean | null
          media_url?: string | null
          message_type?: string | null
          read_at?: string | null
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          deleted_at?: string | null
          flag_reason?: string | null
          id?: string
          is_deleted?: boolean | null
          is_flagged?: boolean | null
          is_read?: boolean | null
          media_url?: string | null
          message_type?: string | null
          read_at?: string | null
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_queue: {
        Row: {
          action_taken: string | null
          created_at: string | null
          id: string
          item_id: string
          item_type: string
          priority: number | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          id?: string
          item_id: string
          item_type: string
          priority?: number | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          id?: string
          item_id?: string
          item_type?: string
          priority?: number | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "moderation_queue_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_interest_received: boolean | null
          email_marketing: boolean | null
          email_new_match: boolean | null
          email_new_message: boolean | null
          email_wali_actions: boolean | null
          id: string
          push_interest_received: boolean | null
          push_new_match: boolean | null
          push_new_message: boolean | null
          sms_enabled: boolean | null
          sms_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_interest_received?: boolean | null
          email_marketing?: boolean | null
          email_new_match?: boolean | null
          email_new_message?: boolean | null
          email_wali_actions?: boolean | null
          id?: string
          push_interest_received?: boolean | null
          push_new_match?: boolean | null
          push_new_message?: boolean | null
          sms_enabled?: boolean | null
          sms_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_interest_received?: boolean | null
          email_marketing?: boolean | null
          email_new_match?: boolean | null
          email_new_message?: boolean | null
          email_wali_actions?: boolean | null
          id?: string
          push_interest_received?: boolean | null
          push_new_match?: boolean | null
          push_new_message?: boolean | null
          sms_enabled?: boolean | null
          sms_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          is_sent: boolean | null
          message: string
          metadata: Json | null
          notification_type: string
          read_at: string | null
          related_interest_id: string | null
          related_match_id: string | null
          related_message_id: string | null
          related_user_id: string | null
          sent_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          message: string
          metadata?: Json | null
          notification_type: string
          read_at?: string | null
          related_interest_id?: string | null
          related_match_id?: string | null
          related_message_id?: string | null
          related_user_id?: string | null
          sent_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          message?: string
          metadata?: Json | null
          notification_type?: string
          read_at?: string | null
          related_interest_id?: string | null
          related_match_id?: string | null
          related_message_id?: string | null
          related_user_id?: string | null
          sent_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_interest_id_fkey"
            columns: ["related_interest_id"]
            isOneToOne: false
            referencedRelation: "match_interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_match_id_fkey"
            columns: ["related_match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_message_id_fkey"
            columns: ["related_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_user_id_fkey"
            columns: ["related_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount_sgd: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          paid_at: string | null
          payment_method: string | null
          payment_status: string | null
          receipt_url: string | null
          refunded_at: string | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount_sgd: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: string | null
          receipt_url?: string | null
          refunded_at?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount_sgd?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: string | null
          receipt_url?: string | null
          refunded_at?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_access_log: {
        Row: {
          access_type: string | null
          accessed_at: string | null
          id: string
          photo_id: string
          viewer_id: string
        }
        Insert: {
          access_type?: string | null
          accessed_at?: string | null
          id?: string
          photo_id: string
          viewer_id: string
        }
        Update: {
          access_type?: string | null
          accessed_at?: string | null
          id?: string
          photo_id?: string
          viewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_access_log_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "user_photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_access_log_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_views: {
        Row: {
          id: string
          view_duration_seconds: number | null
          view_source: string | null
          viewed_at: string | null
          viewed_id: string
          viewer_id: string
        }
        Insert: {
          id?: string
          view_duration_seconds?: number | null
          view_source?: string | null
          viewed_at?: string | null
          viewed_id: string
          viewer_id: string
        }
        Update: {
          id?: string
          view_duration_seconds?: number | null
          view_source?: string | null
          viewed_at?: string | null
          viewed_id?: string
          viewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_views_viewed_id_fkey"
            columns: ["viewed_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          about_family: string | null
          annual_income_range: string | null
          beard_status: string | null
          bio: string | null
          build: string | null
          children_count: number | null
          children_living_with: string | null
          complexion: string | null
          created_at: string | null
          current_city: string
          current_country: string
          current_tier: string | null
          date_of_birth: string
          dietary_preferences: string[] | null
          disabilities: string | null
          education_level: string | null
          email: string
          employment_status: string | null
          ethnicity: string[] | null
          family_religiosity: string | null
          family_values: string | null
          field_of_study: string | null
          full_name: string
          gender: string
          has_children: boolean | null
          has_wali: boolean | null
          health_conditions: string | null
          height_cm: number | null
          hijab_status: string | null
          id: string
          interests_hobbies: string[] | null
          islamic_education: string[] | null
          languages_spoken: string[]
          last_active_at: string | null
          madhab: string | null
          marital_status: string
          nationality: string
          occupation: string | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          parents_marital_status: string | null
          phone: string | null
          prayer_frequency: string | null
          prefers_wali_oversight: boolean | null
          privacy_settings: Json | null
          profile_completion_percentage: number | null
          profile_status: string | null
          profile_views_count: number | null
          religiosity_level: string | null
          relocation_countries: string[] | null
          sect: string | null
          siblings_count: number | null
          smoking_status: string | null
          stripe_customer_id: string | null
          tier_expires_at: string | null
          updated_at: string | null
          verification_documents: Json | null
          verification_status: string | null
          what_looking_for: string | null
          willing_to_relocate: boolean | null
        }
        Insert: {
          about_family?: string | null
          annual_income_range?: string | null
          beard_status?: string | null
          bio?: string | null
          build?: string | null
          children_count?: number | null
          children_living_with?: string | null
          complexion?: string | null
          created_at?: string | null
          current_city: string
          current_country?: string
          current_tier?: string | null
          date_of_birth: string
          dietary_preferences?: string[] | null
          disabilities?: string | null
          education_level?: string | null
          email: string
          employment_status?: string | null
          ethnicity?: string[] | null
          family_religiosity?: string | null
          family_values?: string | null
          field_of_study?: string | null
          full_name: string
          gender: string
          has_children?: boolean | null
          has_wali?: boolean | null
          health_conditions?: string | null
          height_cm?: number | null
          hijab_status?: string | null
          id: string
          interests_hobbies?: string[] | null
          islamic_education?: string[] | null
          languages_spoken: string[]
          last_active_at?: string | null
          madhab?: string | null
          marital_status: string
          nationality: string
          occupation?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          parents_marital_status?: string | null
          phone?: string | null
          prayer_frequency?: string | null
          prefers_wali_oversight?: boolean | null
          privacy_settings?: Json | null
          profile_completion_percentage?: number | null
          profile_status?: string | null
          profile_views_count?: number | null
          religiosity_level?: string | null
          relocation_countries?: string[] | null
          sect?: string | null
          siblings_count?: number | null
          smoking_status?: string | null
          stripe_customer_id?: string | null
          tier_expires_at?: string | null
          updated_at?: string | null
          verification_documents?: Json | null
          verification_status?: string | null
          what_looking_for?: string | null
          willing_to_relocate?: boolean | null
        }
        Update: {
          about_family?: string | null
          annual_income_range?: string | null
          beard_status?: string | null
          bio?: string | null
          build?: string | null
          children_count?: number | null
          children_living_with?: string | null
          complexion?: string | null
          created_at?: string | null
          current_city?: string
          current_country?: string
          current_tier?: string | null
          date_of_birth?: string
          dietary_preferences?: string[] | null
          disabilities?: string | null
          education_level?: string | null
          email?: string
          employment_status?: string | null
          ethnicity?: string[] | null
          family_religiosity?: string | null
          family_values?: string | null
          field_of_study?: string | null
          full_name?: string
          gender?: string
          has_children?: boolean | null
          has_wali?: boolean | null
          health_conditions?: string | null
          height_cm?: number | null
          hijab_status?: string | null
          id?: string
          interests_hobbies?: string[] | null
          islamic_education?: string[] | null
          languages_spoken?: string[]
          last_active_at?: string | null
          madhab?: string | null
          marital_status?: string
          nationality?: string
          occupation?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          parents_marital_status?: string | null
          phone?: string | null
          prayer_frequency?: string | null
          prefers_wali_oversight?: boolean | null
          privacy_settings?: Json | null
          profile_completion_percentage?: number | null
          profile_status?: string | null
          profile_views_count?: number | null
          religiosity_level?: string | null
          relocation_countries?: string[] | null
          sect?: string | null
          siblings_count?: number | null
          smoking_status?: string | null
          stripe_customer_id?: string | null
          tier_expires_at?: string | null
          updated_at?: string | null
          verification_documents?: Json | null
          verification_status?: string | null
          what_looking_for?: string | null
          willing_to_relocate?: boolean | null
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      subscription_tiers: {
        Row: {
          created_at: string | null
          display_name: string
          display_order: number | null
          features: Json
          id: string
          is_active: boolean | null
          price_monthly_sgd: number | null
          price_quarterly_sgd: number | null
          price_yearly_sgd: number | null
          stripe_price_id_monthly: string | null
          stripe_price_id_quarterly: string | null
          stripe_price_id_yearly: string | null
          tier_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          display_order?: number | null
          features?: Json
          id?: string
          is_active?: boolean | null
          price_monthly_sgd?: number | null
          price_quarterly_sgd?: number | null
          price_yearly_sgd?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_quarterly?: string | null
          stripe_price_id_yearly?: string | null
          tier_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string
          display_order?: number | null
          features?: Json
          id?: string
          is_active?: boolean | null
          price_monthly_sgd?: number | null
          price_quarterly_sgd?: number | null
          price_yearly_sgd?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_quarterly?: string | null
          stripe_price_id_yearly?: string | null
          tier_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string | null
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          tier_id: string
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_cycle?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          tier_id: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_cycle?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          tier_id?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      success_stories: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          id: string
          is_public: boolean | null
          match_id: string
          photos: string[] | null
          show_names: boolean | null
          show_photos: boolean | null
          story_text: string
          title: string | null
          updated_at: string | null
          user1_id: string
          user2_id: string
          wedding_date: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          match_id: string
          photos?: string[] | null
          show_names?: boolean | null
          show_photos?: boolean | null
          story_text: string
          title?: string | null
          updated_at?: string | null
          user1_id: string
          user2_id: string
          wedding_date?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          match_id?: string
          photos?: string[] | null
          show_names?: boolean | null
          show_photos?: boolean | null
          story_text?: string
          title?: string | null
          updated_at?: string | null
          user1_id?: string
          user2_id?: string
          wedding_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "success_stories_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "success_stories_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "success_stories_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "success_stories_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_log: {
        Row: {
          activity_type: string
          created_at: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string | null
          id: string
          reason: string | null
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string | null
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string | null
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_blocks_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_blocks_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_photos: {
        Row: {
          ai_confidence: number | null
          ai_flags: Json | null
          ai_screening_passed: boolean | null
          blurred_path: string | null
          created_at: string | null
          display_order: number | null
          file_size_bytes: number | null
          height: number | null
          id: string
          is_primary: boolean | null
          mime_type: string | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_reason: string | null
          moderation_status: string | null
          storage_path: string
          thumbnail_path: string | null
          updated_at: string | null
          upload_date: string | null
          user_id: string
          visibility: string | null
          width: number | null
        }
        Insert: {
          ai_confidence?: number | null
          ai_flags?: Json | null
          ai_screening_passed?: boolean | null
          blurred_path?: string | null
          created_at?: string | null
          display_order?: number | null
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          is_primary?: boolean | null
          mime_type?: string | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          moderation_status?: string | null
          storage_path: string
          thumbnail_path?: string | null
          updated_at?: string | null
          upload_date?: string | null
          user_id: string
          visibility?: string | null
          width?: number | null
        }
        Update: {
          ai_confidence?: number | null
          ai_flags?: Json | null
          ai_screening_passed?: boolean | null
          blurred_path?: string | null
          created_at?: string | null
          display_order?: number | null
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          is_primary?: boolean | null
          mime_type?: string | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          moderation_status?: string | null
          storage_path?: string
          thumbnail_path?: string | null
          updated_at?: string | null
          upload_date?: string | null
          user_id?: string
          visibility?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_photos_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reports: {
        Row: {
          action_taken: string | null
          created_at: string | null
          description: string
          evidence_urls: string[] | null
          id: string
          report_type: string
          reported_user_id: string
          reporter_id: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          description: string
          evidence_urls?: string[] | null
          id?: string
          report_type: string
          reported_user_id: string
          reporter_id: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          description?: string
          evidence_urls?: string[] | null
          id?: string
          report_type?: string
          reported_user_id?: string
          reporter_id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wali_actions: {
        Row: {
          action_details: Json | null
          action_type: string
          created_at: string | null
          id: string
          related_match_id: string | null
          related_user_id: string | null
          wali_relationship_id: string
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          created_at?: string | null
          id?: string
          related_match_id?: string | null
          related_user_id?: string | null
          wali_relationship_id: string
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          created_at?: string | null
          id?: string
          related_match_id?: string | null
          related_user_id?: string | null
          wali_relationship_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wali_actions_related_user_id_fkey"
            columns: ["related_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wali_actions_wali_relationship_id_fkey"
            columns: ["wali_relationship_id"]
            isOneToOne: false
            referencedRelation: "wali_relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      wali_relationships: {
        Row: {
          accepted_at: string | null
          can_approve_matches: boolean | null
          can_communicate: boolean | null
          can_view_matches: boolean | null
          can_view_profile: boolean | null
          created_at: string | null
          id: string
          invited_at: string | null
          requires_approval_for: string[] | null
          status: string | null
          updated_at: string | null
          user_id: string
          wali_email: string | null
          wali_name: string | null
          wali_phone: string | null
          wali_relationship: string | null
          wali_user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          can_approve_matches?: boolean | null
          can_communicate?: boolean | null
          can_view_matches?: boolean | null
          can_view_profile?: boolean | null
          created_at?: string | null
          id?: string
          invited_at?: string | null
          requires_approval_for?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          wali_email?: string | null
          wali_name?: string | null
          wali_phone?: string | null
          wali_relationship?: string | null
          wali_user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          can_approve_matches?: boolean | null
          can_communicate?: boolean | null
          can_view_matches?: boolean | null
          can_view_profile?: boolean | null
          created_at?: string | null
          id?: string
          invited_at?: string | null
          requires_approval_for?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          wali_email?: string | null
          wali_name?: string | null
          wali_phone?: string | null
          wali_relationship?: string | null
          wali_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wali_relationships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wali_relationships_wali_user_id_fkey"
            columns: ["wali_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      calculate_match_score: {
        Args: { user1_id: string; user2_id: string }
        Returns: number
      }
      calculate_profile_completion: {
        Args: { profile_id: string }
        Returns: number
      }
      check_wali_approval_needed: {
        Args: { user_id: string }
        Returns: boolean
      }
      delete_user_account: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      expire_old_interests: { Args: never; Returns: undefined }
      export_user_data: { Args: { target_user_id: string }; Returns: Json }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_recommended_matches: {
        Args: { for_user_id: string; limit_count?: number }
        Returns: {
          match_score: number
          profile_completion: number
          profile_id: string
        }[]
      }
      gettransactionid: { Args: never; Returns: unknown }
      longtransactionsenabled: { Args: never; Returns: boolean }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

// Application-specific types

/**
 * Compatibility score breakdown for profile matching
 */
export interface CompatibilityScore {
  overall: number
  breakdown: Record<string, number>
}

/**
 * Enhanced profile with compatibility scoring
 */
export interface EnhancedProfile extends Tables<'profiles'> {
  compatibilityScore?: CompatibilityScore
  user_photos?: Array<{
    id: string
    storage_path: string
    is_primary: boolean
    moderation_status: string
    display_order: number
  }>
}

/**
 * Discovery filters for profile search
 */
export interface DiscoveryFilters {
  // Age filters
  ageMin?: number
  ageMax?: number

  // Location filters
  country?: string
  city?: string

  // Religious filters
  sect?: string[]
  religiosity?: string[]
  prayerFrequency?: string[]

  // Lifestyle filters
  education?: string[]
  occupation?: string[]
  maritalStatus?: string[]
  hasChildren?: boolean
  wantsChildren?: boolean
}

/**
 * Sort options for profile discovery
 */
export type SortOption = 'compatibility' | 'recent' | 'active' | 'verified'
