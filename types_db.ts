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
      archives: {
        Row: {
          avatar_id: string | null
          created_at: string
          created_by: string | null
          expired_at: string
          id: string
          status: string | null
          storage: string | null
        }
        Insert: {
          avatar_id?: string | null
          created_at?: string
          created_by?: string | null
          expired_at?: string
          id?: string
          status?: string | null
          storage?: string | null
        }
        Update: {
          avatar_id?: string | null
          created_at?: string
          created_by?: string | null
          expired_at?: string
          id?: string
          status?: string | null
          storage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "archives_avatar_id_fkey"
            columns: ["avatar_id"]
            referencedRelation: "avatars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "archives_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      avatars: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          name: string
          owner_id: string | null
          source: string | null
          source_twitter: string | null
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
          source_twitter?: string | null
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
          source_twitter?: string | null
          status?: string | null
          updated_at?: string
          username?: string
          welcome_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avatars_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      embedding_inamori_website: {
        Row: {
          avatar_id: string | null
          content: string | null
          content_length: number | null
          content_tokens: number | null
          embedding: string | null
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
          embedding?: string | null
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
          embedding?: string | null
          essay_date?: string | null
          essay_thanks?: string | null
          essay_title?: string | null
          essay_url?: string | null
          id?: string
        }
        Relationships: []
      }
      embedding_tj: {
        Row: {
          content: string | null
          content_length: number | null
          content_tokens: number | null
          embedding: string | null
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
          embedding?: string | null
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
          embedding?: string | null
          essay_date?: string | null
          essay_thanks?: string | null
          essay_title?: string | null
          essay_url?: string | null
          id?: number
        }
        Relationships: []
      }
      embeddings: {
        Row: {
          avatar_id: string | null
          content: string | null
          content_length: number | null
          content_tokens: number | null
          embedding: string | null
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
          embedding?: string | null
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
          embedding?: string | null
          essay_date?: string | null
          essay_thanks?: string | null
          essay_title?: string | null
          essay_url?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "embeddings_avatar_id_fkey"
            columns: ["avatar_id"]
            referencedRelation: "avatars"
            referencedColumns: ["id"]
          }
        ]
      }
      memos: {
        Row: {
          avatar_id: string | null
          content: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          embeddings: string[] | null
          id: string
          source_url: string | null
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
          embeddings?: string[] | null
          id?: string
          source_url?: string | null
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
          embeddings?: string[] | null
          id?: string
          source_url?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avatar_id"
            columns: ["avatar_id"]
            referencedRelation: "avatars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memos_avatar_id_fkey"
            columns: ["avatar_id"]
            referencedRelation: "avatars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memos_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memos_deleted_by_fkey"
            columns: ["deleted_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memos_updated_by_fkey"
            columns: ["updated_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
      }
      queries: {
        Row: {
          content: string | null
          created_at: string
          from_id: string | null
          id: string
          to_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          from_id?: string | null
          id?: string
          to_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          from_id?: string | null
          id?: string
          to_id?: string | null
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      token_usages: {
        Row: {
          api: string | null
          created_at: string
          created_by: string | null
          id: string
          raw: Json | null
          token_id: string | null
        }
        Insert: {
          api?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          raw?: Json | null
          token_id?: string | null
        }
        Update: {
          api?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          raw?: Json | null
          token_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "token_usages_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_usages_token_id_fkey"
            columns: ["token_id"]
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          }
        ]
      }
      tokens: {
        Row: {
          avatar_id: string | null
          created_at: string
          created_by: string | null
          id: string
          masked_token: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          avatar_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          masked_token?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          avatar_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          masked_token?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tokens_avatar_id_fkey"
            columns: ["avatar_id"]
            referencedRelation: "avatars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tokens_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tokens_updated_by_fkey"
            columns: ["updated_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      embeddings_search: {
        Args: {
          query_embedding: string
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
          query_embedding: string
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
      list_avatars_with_embeddings_count: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          username: string
          name: string
          avatar_url: string
          status: string
          source: string
          source_twitter: string
          bio: string
          welcome_message: string
          owner_id: string
          count: number
        }[]
      }
      pg_search: {
        Args: {
          query_embedding: string
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
          query_embedding: string
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
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
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
