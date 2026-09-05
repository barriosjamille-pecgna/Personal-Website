-- Fairyworld portfolio schema
-- Run this in the Supabase SQL editor for a new project.
-- All tables are public-read (this is a public portfolio site) and
-- writes are left unrestricted here for simplicity; lock `insert`/
-- `update`/`delete` down to an authenticated admin role before you
-- start editing content live, e.g. by adding a `using (auth.role() = 'authenticated')`
-- policy instead of the permissive ones below once you have login set up.

create table if not exists portfolio_sections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  theme_json jsonb default '{}'::jsonb,
  icon text,
  sort_order int default 0
);

create table if not exists portfolio_folders (
  id uuid primary key default gen_random_uuid(),
  section_slug text references portfolio_sections(slug) on delete cascade,
  name text not null,
  color text default '#C9A24B',
  icon text default 'folder',
  sort_order int default 0
);

create table if not exists portfolio_items (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid references portfolio_folders(id) on delete cascade,
  title text not null,
  description text,
  images text[] default '{}',
  tools text[] default '{}',
  responsibilities text,
  outcome text,
  link text,
  sort_order int default 0
);

create table if not exists writings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null default current_date,
  category text,
  body text not null,
  images text[] default '{}',
  tags text[] default '{}'
);

create table if not exists illustrations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null default current_date,
  category text,
  description text,
  image_url text
);

create table if not exists advocacy_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  body text,
  images text[] default '{}'
);

-- Row Level Security: public read on everything.
alter table portfolio_sections enable row level security;
alter table portfolio_folders enable row level security;
alter table portfolio_items enable row level security;
alter table writings enable row level security;
alter table illustrations enable row level security;
alter table advocacy_projects enable row level security;

create policy "public read sections" on portfolio_sections for select using (true);
create policy "public read folders" on portfolio_folders for select using (true);
create policy "public read items" on portfolio_items for select using (true);
create policy "public read writings" on writings for select using (true);
create policy "public read illustrations" on illustrations for select using (true);
create policy "public read advocacy" on advocacy_projects for select using (true);

-- Storage: create a public bucket named "portfolio-images" from the
-- Supabase dashboard (Storage tab) for illustration/writing images,
-- and reference the resulting public URL in image_url / images[].
