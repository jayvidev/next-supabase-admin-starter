# AI prompts

Copy-paste these into Claude Code / Cursor / Copilot Chat to extend the starter quickly. Replace the angle-bracket placeholders.

## Add a CRUD resource

> Add a new CMS resource called `<resource_plural>` with fields `<field1: type, field2: type, ...>`. Follow the project's conventions documented in `docs/03-add-resource.md` and `CLAUDE.md`:
> 1. Create a Supabase migration with the table, `updated_at` trigger, and RLS (`public_read` + `auth_all`).
> 2. Add a cache tag in `lib/cache-tags.ts`.
> 3. Create `features/admin/api/<resource>.ts` with `getAll/getById/create/update/delete[/reorder]`.
> 4. Create a Zod schema in `features/admin/schemas/<resource>.schema.ts`.
> 5. Create `features/admin/pages/<resource>/index.tsx` with a `TableListLayout` + `DataTable` + create/edit dialog backed by `useResourceForm`.
> 6. Wire `app/admin/(panel)/<route>/page.tsx` and add the route to `features/admin/config/routes.ts` (sidebar entry).
> 7. If used by the site, add a `get<Resource>` in `lib/supabase/server-queries.ts` and call it in `app/(site)/page.tsx`.
> Remind me to run `pnpm db:push` and `pnpm db:types`.

## Add a site section

> Create a new site section component `features/site/sections/<name>.tsx` that takes `data` from `get<Resource>()` and renders <describe layout>. Add it to `app/(site)/page.tsx` inside the existing `Promise.all`.

## Add a settings tab

> Add a new tab to `/admin/settings` called `<tab-name>`. Mirror the structure of `features/admin/pages/site-settings/general-tab.tsx`. Persist via `siteSettingsApi` (extend it if needed). Use the existing Zod schemas in `features/admin/schemas/site-settings.schema.ts` (add a new one if needed). Invalidate `cacheTags.siteSettings` on save.

## Tighten auth (role-based)

> Implement role-based admin access:
> 1. Migration: a `profiles` table joined to `auth.users` with a `role text not null default 'editor'` column. RLS: a user can only see/update their own row.
> 2. In `proxy.ts`, after `getUser()`, fetch the profile and redirect non-admins to `/admin/login` with an error param.
> 3. Replace the `auth_all` RLS policy on each table with `auth_admin` that checks the JWT or `profiles.role`.
> 4. Wire `isSuperAdmin` in `features/admin/components/sidebar/sidebar-data.ts` to hide `superAdminOnly` routes.

## Migrate to i18n

> Add `next-intl` to this project. Follow `docs/08-i18n-optional.md` exactly: create `i18n/routing.ts` + `i18n/request.ts` with locales `['es', 'en']`, defaultLocale `'es'`, `localePrefix: 'as-needed'`. Wrap `next.config.ts` with `createNextIntlPlugin`. Restructure `app/(site)/` under `[lang]/`. Generate migrations to rename existing translatable columns to `_es` and add `_en` siblings. Update Zod schemas and admin pages to use `TranslatableField`.
