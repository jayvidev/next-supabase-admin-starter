# CLAUDE.md

Project conventions for AI coding agents working on this starter (and any project derived from it).

## Stack & invariants

- Next.js 16 (App Router, Turbopack). React 19. TypeScript strict. Tailwind v4.
- pnpm only (do not commit `package-lock.json` or `yarn.lock`).
- Supabase via `@supabase/ssr`. Always pick the right client:
  - `lib/supabase/server.ts` — Server Components, Server Actions, Route Handlers.
  - `lib/supabase/client.ts` — Client Components (memoized).
  - `lib/supabase/public-client.ts` — anonymous read-only landing queries.
- **Supabase is optional.** `config.supabase.enabled` auto-derives from the two env vars; when absent the app runs with auth bypassed and no DB. Guard any new Supabase caller with `if (config.supabase.enabled)`. Full behaviour in `docs/10-supabase-optional.md`. `database.types.ts` ships a committed empty baseline, so types never break without a linked project.
- **Auth/route protection lives only in `proxy.ts` at the repo root.** Next 16 renamed `middleware.ts` → `proxy.ts`. Do **not** create `middleware.ts`. Do not split into helpers — keep the Supabase client construction inline.
- Path aliases: `@admin/*`, `@landing/*`, `@auth/*`, `@/*`.

## Schema changes

Never edit SQL in the Supabase Studio SQL Editor for tracked tables.

1. `pnpm db:migration <descriptive_name>` → creates `supabase/migrations/<ts>_<name>.sql`.
2. Edit the file. Use the existing helpers: `set_updated_at()` trigger, `reorder_by_sort_order` RPC.
3. `pnpm db:push` (linked project) or `pnpm db:reset` (local) to apply.
4. `pnpm db:types` → regenerates `lib/supabase/database.types.ts`.
5. Commit migration **and** regenerated types together.

## Adding a CMS resource

Pattern (full walkthrough in `docs/03-add-resource.md`):

1. Migration: table + `updated_at` trigger + RLS (`public_read` + `auth_all`).
2. `pnpm db:types`.
3. `features/admin/api/<resource>.ts` — `getAll/getById/create/update/delete[/reorder]`.
4. `features/admin/schemas/<resource>.schema.ts` — Zod.
5. `features/admin/pages/<resource>/index.tsx` — table list or form, built from `data-table` + `useResourceForm` + `resource-dialog`.
6. `app/admin/(panel)/<route>/page.tsx` — wires the page with metadata.
7. Add the route to `features/admin/config/routes.ts` (sidebar entry).
8. Add a cache tag in `lib/cache-tags.ts`.
9. If the landing reads it, add a `getXxx` in `lib/supabase/server-queries.ts` and call `revalidateLandingCache([cacheTags.xxx])` in the form's `onSubmit`.

## Don'ts

- Don't import from `@supabase/supabase-js` directly — use the helpers in `lib/supabase/`.
- Don't add `middleware.ts` — see above.
- Don't hand-edit `lib/supabase/database.types.ts`. Regenerate.
- Don't put translatable string literals in admin forms unless the i18n branch is active.
- Don't store secrets in DB tables. Use env vars.
