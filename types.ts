import Stripe from "stripe"

export interface PageMeta {
  title: string
  description: string
  cardImage: string
}

export interface Customer {
  id: string /* primary key */
  stripe_customer_id?: string
}

export interface Product {
  id: string /* primary key */
  active?: boolean
  name?: string
  description?: string
  image?: string
  metadata?: Stripe.Metadata
}

export interface ProductWithPrice extends Product {
  prices?: Price[]
}

export interface UserDetails {
  id: string /* primary key */
  first_name: string
  last_name: string
  full_name?: string
  avatar_url?: string
  billing_address?: Stripe.Address
  payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type]
}

export interface Price {
  id: string /* primary key */
  product_id?: string /* foreign key to products.id */
  active?: boolean
  description?: string
  unit_amount?: number
  currency?: string
  type?: Stripe.Price.Type
  interval?: Stripe.Price.Recurring.Interval
  interval_count?: number
  trial_period_days?: number | null
  metadata?: Stripe.Metadata
  products?: Product
}

export interface PriceWithProduct extends Price {}

export interface Subscription {
  id: string /* primary key */
  user_id: string
  status?: Stripe.Subscription.Status
  metadata?: Stripe.Metadata
  price_id?: string /* foreign key to prices.id */
  quantity?: number
  cancel_at_period_end?: boolean
  created: string
  current_period_start: string
  current_period_end: string
  ended_at?: string
  cancel_at?: string
  canceled_at?: string
  trial_start?: string
  trial_end?: string
  prices?: Price
}

export type PGEssay = {
  title: string
  url: string
  date: string
  thanks: string
  content: string
  length: number
  tokens: number
  chunks: PGChunk[]
}

/**
 * Content is a generic type for embedding
 */
export type Content = {
  content: string
  url?: string
  date?: string
  title?: string
  mentions?: string[]
  length: number
  tokens: number
  chunks: Chunk[] // TODO: refactor PGChunk to be more generic
  avatar_id?: string
}

export type Chunk = {
  content: string
  content_length: number
  content_tokens: number
  original_url?: string
  original_date?: string
  embedding: number[]
}

export type PGChunk = {
  essay_title: string // FIXME: dont need title
  essay_url: string
  essay_date: string
  essay_thanks: string // FIXME: dont need thanks
  content: string
  content_length: number
  content_tokens: number
  embedding: number[]
}

export type PGJSON = {
  current_date: string
  author: string
  url: string
  length: number
  tokens: number
  essays: PGEssay[]
}

export type Avatar = {
  id: string
  username: string
  name: string
  avatar_url?: string
  bio?: string
  twitterUrl?: string
  linkedinUrl?: string
  status?: string
  owner_id?: string
  // optional
  essaysCount?: number
  repliesCount?: number
}

export type Message = {
  id: string
  from_id: string
  to_id: string
  content: string
  created_at: string
}

export interface OpenAIMessage {
  role: "user" | "system" | "assistant"
  content: string
}

export type Memo = {
  id: string
  content: string
  avatar_id: string
  created_at: string
  created_by: string
  updated_at: string
  embeddings?: string[]
}
