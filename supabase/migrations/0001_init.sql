-- Optional: enable Supabase persistence for scan history
-- Run this if you want server-side history (requires Supabase env vars)

create table if not exists scan_history (
  id uuid primary key default gen_random_uuid(),
  barcode text,
  product_name text not null,
  brand text,
  analysis jsonb not null,
  scanned_at timestamptz not null default now()
);

create index if not exists scan_history_scanned_at_idx on scan_history (scanned_at desc);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  barcode text,
  product_name text,
  issue_type text not null,
  details text,
  created_at timestamptz not null default now()
);
