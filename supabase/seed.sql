-- Minimal seed so a freshly-pushed DB renders the landing without empty errors.
-- Run automatically by `supabase db reset`.

insert into public.site_settings (site_name, tagline)
values ('Landing Admin Starter', 'Next.js + Supabase CMS')
on conflict do nothing;

insert into public.hero (pill_text, bg_type)
values ('New', 'image')
on conflict do nothing;

insert into public.section_headers (section_key, title, subtitle)
values ('hero', 'Welcome', 'Replace this content from the admin panel.')
on conflict (section_key) do nothing;

insert into public.header_settings (nav_links, cta_label, cta_url)
values (
  '[{"label":"Home","href":"/"},{"label":"About","href":"/about"}]'::jsonb,
  'Get started',
  '/admin'
)
on conflict do nothing;

insert into public.footer_settings (about_text, copyright_text, columns)
values (
  'Edit this from /admin/layout/footer.',
  '© 2026 Your Company',
  '[{"title":"Links","links":[{"label":"Privacy","href":"/privacy"}]}]'::jsonb
)
on conflict do nothing;
