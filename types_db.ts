export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      avatars: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          name: string
          owner_id: string | null
          source: string | null
          status: string | null
          updated_at: string
          username: string
          welcome_message: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          name: string
          owner_id?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
          username: string
          welcome_message?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          owner_id?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
          username?: string
          welcome_message?: string | null
        }
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
      }
      embedding_inamori_website: {
        Row: {
          avatar_id: string | null
          content: string | null
          content_length: number | null
          content_tokens: number | null
          embedding: unknown | null
          essay_date: string | null
          essay_thanks: string | null
          essay_title: string | null
          essay_url: string | null
          id: string
        }
        Insert: {
          avatar_id?: string | null
          content?: string | null
          content_length?: number | null
          content_tokens?: number | null
          embedding?: unknown | null
          essay_date?: string | null
          essay_thanks?: string | null
          essay_title?: string | null
          essay_url?: string | null
          id: string
        }
        Update: {
          avatar_id?: string | null
          content?: string | null
          content_length?: number | null
          content_tokens?: number | null
          embedding?: unknown | null
          essay_date?: string | null
          essay_thanks?: string | null
          essay_title?: string | null
          essay_url?: string | null
          id?: string
        }
      }
      embedding_tj: {
        Row: {
          content: string | null
          content_length: number | null
          content_tokens: number | null
          embedding: unknown | null
          essay_date: string | null
          essay_thanks: string | null
          essay_title: string | null
          essay_url: string | null
          id: number
        }
        Insert: {
          content?: string | null
          content_length?: number | null
          content_tokens?: number | null
          embedding?: unknown | null
          essay_date?: string | null
          essay_thanks?: string | null
          essay_title?: string | null
          essay_url?: string | null
          id: number
        }
        Update: {
          content?: string | null
          content_length?: number | null
          content_tokens?: number | null
          embedding?: unknown | null
          essay_date?: string | null
          essay_thanks?: string | null
          essay_title?: string | null
          essay_url?: string | null
          id?: number
        }
      }
      embeddings: {
        Row: {
          avatar_id: string | null
          content: string | null
          content_length: number | null
          content_tokens: number | null
          embedding: unknown | null
          essay_date: string | null
          essay_thanks: string | null
          essay_title: string | null
          essay_url: string | null
          id: string
        }
        Insert: {
          avatar_id?: string | null
          content?: string | null
          content_length?: number | null
          content_tokens?: number | null
          embedding?: unknown | null
          essay_date?: string | null
          essay_thanks?: string | null
          essay_title?: string | null
          essay_url?: string | null
          id?: string
        }
        Update: {
          avatar_id?: string | null
          content?: string | null
          content_length?: number | null
          content_tokens?: number | null
          embedding?: unknown | null
          essay_date?: string | null
          essay_thanks?: string | null
          essay_title?: string | null
          essay_url?: string | null
          id?: string
        }
      }
      memos: {
        Row: {
          avatar_id: string | null
          content: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          embedded: boolean | null
          id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          avatar_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          embedded?: boolean | null
          id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          avatar_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          embedded?: boolean | null
          id?: string
          updated_at?: string
          updated_by?: string | null
        }
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
      }
      queries: {
        Row: {
          created_at: string
          from_id: string | null
          id: string
          message_text: string | null
          to_id: string | null
        }
        Insert: {
          created_at?: string
          from_id?: string | null
          id?: string
          message_text?: string | null
          to_id?: string | null
        }
        Update: {
          created_at?: string
          from_id?: string | null
          id?: string
          message_text?: string | null
          to_id?: string | null
        }
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          full_name: string | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id?: string
          payment_method?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      embeddings_search: {
        Args: {
          query_embedding: unknown
          similarity_threshold: number
          match_count: number
          query_to: string
        }
        Returns: {
          id: string
          avatar_id: string
          essay_title: string
          essay_url: string
          essay_date: string
          essay_thanks: string
          content: string
          content_length: number
          content_tokens: number
          similarity: number
        }[]
      }
      inamori_search: {
        Args: {
          query_embedding: unknown
          similarity_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          essay_title: string
          essay_url: string
          essay_date: string
          essay_thanks: string
          content: string
          content_length: number
          content_tokens: number
          similarity: number
        }[]
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pg_search: {
        Args: {
          query_embedding: unknown
          similarity_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          essay_title: string
          essay_url: string
          essay_date: string
          essay_thanks: string
          content: string
          content_length: number
          content_tokens: number
          similarity: number
        }[]
      }
      tj_search: {
        Args: {
          query_embedding: unknown
          similarity_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          essay_title: string
          essay_url: string
          essay_date: string
          essay_thanks: string
          content: string
          content_length: number
          content_tokens: number
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      vector_dims: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
