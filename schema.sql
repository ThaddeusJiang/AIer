/**
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table users (
  -- UUID from auth.users
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  -- The customer's billing address, stored in JSON format.
  billing_address jsonb,
  -- Stores your customer's payment instruments.
  payment_method jsonb
);
alter table users enable row level security;
create policy "Can view own user data." on users for select using (auth.uid() = id);
create policy "Can update own user data." on users for update using (auth.uid() = id);

CREATE TABLE avatars (
  id text not null PRIMARY KEY,
  username text NOT NULL,
  name text NOT NULL,
  avatar_url text,
  status text,
  source text,
  source_twitter text,
  bio text,
  welcome_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  owner_id uuid references auth.users
);

CREATE TABLE users_mark_avatars (
  user_id uuid not null references users ,
  avatar_id text not null references avatars,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  CONSTRAINT "users_mark_avatars_pkey" primary key (user_id, avatar_id)
);

ALTER TABLE users_mark_avatars ADD CONSTRAINT "users_mark_avatars_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE users_mark_avatars ADD CONSTRAINT "users_mark_avatars_avatar_id_fkey" FOREIGN KEY (avatar_id) REFERENCES avatars(id);

CREATE OR REPLACE FUNCTION public.list_avatars_with_embeddings_count()
  RETURNS TABLE (
    id text,
    username text,
    name text,
    avatar_url text,
    status text,
    source text,
    source_twitter text,
    bio text,
    welcome_message text,
    owner_id uuid,
    count bigint
  ) AS
$$
BEGIN
  RETURN QUERY
  SELECT avatars.id, avatars.username, avatars.name, avatars.avatar_url, avatars.status, avatars.source, avatars.source_twitter, avatars.bio, avatars.welcome_message, avatars.owner_id, COUNT(*) AS count
  FROM avatars
  LEFT JOIN embeddings ON avatars.id = embeddings.avatar_id
  WHERE avatars.status = 'public'
  GROUP BY avatars.id
  ORDER BY count DESC;
END;
$$
LANGUAGE plpgsql;

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

/**
* CUSTOMERS
* Note: this is a private table that contains a mapping of user IDs to Stripe customer IDs.
*/
create table customers (
  -- UUID from auth.users
  id uuid references auth.users not null primary key,
  -- The user's customer ID in Stripe. User must not be able to update this.
  stripe_customer_id text
);
alter table customers enable row level security;
-- No policies as this is a private table that the user must not have access to.

/**
* PRODUCTS
* Note: products are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create table products (
  -- Product ID from Stripe, e.g. prod_1234.
  id text primary key,
  -- Whether the product is currently available for purchase.
  active boolean,
  -- The product's name, meant to be displayable to the customer. Whenever this product is sold via a subscription, name will show up on associated invoice line item descriptions.
  name text,
  -- The product's description, meant to be displayable to the customer. Use this field to optionally store a long form explanation of the product being sold for your own rendering purposes.
  description text,
  -- A URL of the product image in Stripe, meant to be displayable to the customer.
  image text,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata jsonb
);
alter table products enable row level security;
create policy "Allow public read-only access." on products for select using (true);

/**
* PRICES
* Note: prices are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create type pricing_type as enum ('one_time', 'recurring');
create type pricing_plan_interval as enum ('day', 'week', 'month', 'year');
create table prices (
  -- Price ID from Stripe, e.g. price_1234.
  id text primary key,
  -- The ID of the prduct that this price belongs to.
  product_id text references products,
  -- Whether the price can be used for new purchases.
  active boolean,
  -- A brief description of the price.
  description text,
  -- The unit amount as a positive integer in the smallest currency unit (e.g., 100 cents for US$1.00 or 100 for ¥100, a zero-decimal currency).
  unit_amount bigint,
  -- Three-letter ISO currency code, in lowercase.
  currency text check (char_length(currency) = 3),
  -- One of `one_time` or `recurring` depending on whether the price is for a one-time purchase or a recurring (subscription) purchase.
  type pricing_type,
  -- The frequency at which a subscription is billed. One of `day`, `week`, `month` or `year`.
  interval pricing_plan_interval,
  -- The number of intervals (specified in the `interval` attribute) between subscription billings. For example, `interval=month` and `interval_count=3` bills every 3 months.
  interval_count integer,
  -- Default number of trial days when subscribing a customer to this price using [`trial_from_plan=true`](https://stripe.com/docs/api#create_subscription-trial_from_plan).
  trial_period_days integer,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata jsonb
);
alter table prices enable row level security;
create policy "Allow public read-only access." on prices for select using (true);

/**
* SUBSCRIPTIONS
* Note: subscriptions are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create type subscription_status as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');
create table subscriptions (
  -- Subscription ID from Stripe, e.g. sub_1234.
  id text primary key,
  user_id uuid references auth.users not null,
  -- The status of the subscription object, one of subscription_status type above.
  status subscription_status,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata jsonb,
  -- ID of the price that created this subscription.
  price_id text references prices,
  -- Quantity multiplied by the unit amount of the price creates the amount of the subscription. Can be used to charge multiple seats.
  quantity integer,
  -- If true the subscription has been canceled by the user and will be deleted at the end of the billing period.
  cancel_at_period_end boolean,
  -- Time at which the subscription was created.
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Start of the current period that the subscription has been invoiced for.
  current_period_start timestamp with time zone default timezone('utc'::text, now()) not null,
  -- End of the current period that the subscription has been invoiced for. At the end of this period, a new invoice will be created.
  current_period_end timestamp with time zone default timezone('utc'::text, now()) not null,
  -- If the subscription has ended, the timestamp of the date the subscription ended.
  ended_at timestamp with time zone default timezone('utc'::text, now()),
  -- A date in the future at which the subscription will automatically get canceled.
  cancel_at timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with `cancel_at_period_end`, `canceled_at` will still reflect the date of the initial cancellation request, not the end of the subscription period when the subscription is automatically moved to a canceled state.
  canceled_at timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has a trial, the beginning of that trial.
  trial_start timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has a trial, the end of that trial.
  trial_end timestamp with time zone default timezone('utc'::text, now())
);
alter table subscriptions enable row level security;
create policy "Can only view own subs data." on subscriptions for select using (auth.uid() = user_id);

/**
 * REALTIME SUBSCRIPTIONS
 * Only allow realtime listening on public tables.
 */
drop publication if exists supabase_realtime;
create publication supabase_realtime for table products, prices;

--  RUN 1st
create extension vector;

-- RUN 2nd
create table embeddings (
  id uuid primary key NOT NULL DEFAULT uuid_generate_v4(),
  avatar_id text references avatars,
  essay_title text,
  essay_url text,
  essay_date text,
  essay_thanks text,
  content text,
  content_length bigint,
  content_tokens bigint,
  embedding vector (1536)
);

create table queries (
  id uuid primary key NOT NULL DEFAULT uuid_generate_v4(),
  from_id text,
  to_id text,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RUN 3rd after running the scripts
create or replace function embeddings_search (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int,
  query_to text
)
returns table (
  id uuid,
  avatar_id text,
  essay_title text,
  essay_url text,
  essay_date text,
  essay_thanks text,
  content text,
  content_length bigint,
  content_tokens bigint,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    emb.id,
    emb.avatar_id,
    emb.essay_title,
    emb.essay_url,
    emb.essay_date,
    emb.essay_thanks,
    emb.content,
    emb.content_length,
    emb.content_tokens,
    1 - (emb.embedding <=> query_embedding) as similarity
  from embeddings AS emb
  where 1 - (emb.embedding <=> query_embedding) > similarity_threshold AND emb.avatar_id = query_to
  order by emb.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- RUN 4th
create index on embeddings
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

create table memos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  content text,
  avatar_id text references avatars,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by uuid references auth.users,
  deleted_at timestamp with time zone,
  deleted_by uuid references auth.users,
  source_url text,
  embeddings _text,
  primary key (id)
);

create table archives (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  avatar_id text references avatars,
  status text,
  expired_at timestamp with time zone default timezone('utc'::text, now()) not null,
  storage text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users
);

CREATE INDEX idx_memos_avatar_id ON memos (avatar_id);

create table tokens (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  masked_token text,
  avatar_id text references avatars,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by uuid references auth.users,
  primary key (id)
);

create unique index idx_tokens_avatar_id on tokens (avatar_id);

create table token_usages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  token_id uuid references tokens,
  api text,
  raw jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users,
  primary key (id)
);
