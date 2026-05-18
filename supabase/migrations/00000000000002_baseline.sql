-- Baseline schema: minimal CMS tables used by the starter admin + landing.
-- Tables: site_settings, header_settings, footer_settings, section_headers, hero,
--         seo_pages, tracking_pixels.
-- Each table: updated_at trigger + RLS (public read, authenticated full access).
-- Extend with your own migrations: `pnpm db:migration <name>`.

-- ============================================================
-- Tables
-- ============================================================

create table public.section_headers (
  id             uuid primary key default gen_random_uuid(),
  section_key    text unique not null,
  eyebrow        text,
  title          text,
  subtitle       text,
  footer_text    text,
  image_url      text,
  is_active      boolean default true,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table public.hero (
  id                    uuid primary key default gen_random_uuid(),
  pill_text             text,
  pill_text_mobile      text,
  bg_type               text default 'image',
  background_image_url  text,
  video_url             text,
  video_poster_url      text,
  buttons               jsonb default '[]'::jsonb,
  badges                jsonb default '[]'::jsonb,
  is_active             boolean default true,
  sort_order            int default 0,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create table public.site_settings (
  id              uuid primary key default gen_random_uuid(),
  site_name       text,
  tagline         text,
  logo_url        text,
  logo_dark_url   text,
  favicon_url     text,
  contact_email   text,
  contact_phone   text,
  contact_address text,
  business_hours  jsonb default '{}'::jsonb,
  social_links    jsonb default '{}'::jsonb,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table public.header_settings (
  id               uuid primary key default gen_random_uuid(),
  logo_url         text,
  nav_links        jsonb default '[]'::jsonb,
  cta_label        text,
  cta_label_mobile text,
  cta_url          text,
  is_active        boolean default true,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create table public.footer_settings (
  id             uuid primary key default gen_random_uuid(),
  logo_url       text,
  about_text     text,
  columns        jsonb default '[]'::jsonb,
  copyright_text text,
  legal_links    jsonb default '[]'::jsonb,
  is_active      boolean default true,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table public.seo_pages (
  id           uuid primary key default gen_random_uuid(),
  path         text unique not null,
  title        text,
  description  text,
  og_image_url text,
  keywords     text,
  no_index     boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table public.tracking_pixels (
  id            uuid primary key default gen_random_uuid(),
  provider      text not null,
  label         text,
  pixel_id      text,
  custom_script text,
  placement     text default 'head',
  is_active     boolean default true,
  sort_order    int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ============================================================
-- updated_at triggers
-- ============================================================
do $$
declare t text;
begin
  for t in select unnest(array[
    'section_headers','hero','site_settings','header_settings',
    'footer_settings','seo_pages','tracking_pixels'
  ]) loop
    execute format(
      'drop trigger if exists trg_set_updated_at on %I;
       create trigger trg_set_updated_at before update on %I
       for each row execute function public.set_updated_at();', t, t);
  end loop;
end $$;

-- ============================================================
-- RLS — public can read; only authenticated users can mutate.
-- Tighten in your own migration if you need role-based admin checks.
-- ============================================================
do $$
declare t text;
begin
  for t in select unnest(array[
    'section_headers','hero','site_settings','header_settings',
    'footer_settings','seo_pages','tracking_pixels'
  ]) loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "public_read" on %I;', t);
    execute format('create policy "public_read" on %I for select using (true);', t);
    execute format('drop policy if exists "auth_all" on %I;', t);
    execute format(
      'create policy "auth_all" on %I for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;
