-- Run this exactly as provided in your Supabase SQL Editor:
create table tapconnect.products (
  id uuid not null default gen_random_uuid (),
  org_id uuid null,
  products text[] null,
  created_at timestamp with time zone null default now(),
  constraint products_pkey primary key (id),
  constraint products_org_id_fkey foreign KEY (org_id) references tapconnect.organizations (id) on delete CASCADE
) TABLESPACE pg_default;

-- Setup full realtime tracking for Array merging
ALTER TABLE tapconnect.products REPLICA IDENTITY FULL;

-- Add table to publication if not already syncing all tables
ALTER PUBLICATION supabase_realtime ADD TABLE tapconnect.products;
