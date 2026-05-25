-- Run this exactly as provided in your Supabase SQL Editor:
create table frixn.products (
  id uuid not null default gen_random_uuid (),
  org_id uuid null,
  products text[] null,
  created_at timestamp with time zone null default now(),
  constraint products_pkey primary key (id),
  constraint products_org_id_fkey foreign KEY (org_id) references frixn.organizations (id) on delete CASCADE
) TABLESPACE pg_default;

-- Setup full realtime tracking for Array merging
ALTER TABLE frixn.products REPLICA IDENTITY FULL;

-- Add table to publication if not already syncing all tables
ALTER PUBLICATION supabase_realtime ADD TABLE frixn.products;
