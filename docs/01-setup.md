# 01 — Setup

## Prerequisites

- Node ≥ 20
- pnpm ≥ 9
- Supabase CLI ≥ 2 (`brew install supabase/tap/supabase`)
- Docker (only if you want to run Supabase locally)
- A Cloudinary account (free tier works)

## 1. Install deps

```bash
pnpm install
```

## 2. Env vars

```bash
cp .env.example .env.local
```

Fill in:

| Var | Where to find |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same panel, `anon` key |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary dashboard → API Keys |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary dashboard → Account Details |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Settings → Upload → create an *unsigned* preset |
| `NEXT_PUBLIC_CLOUDINARY_FOLDER` | folder name to scope uploads (e.g. `my-project`) |

## 3. Supabase: choose local or remote

> **Optional.** Skip this entire step to develop without a database — leave the
> two `NEXT_PUBLIC_SUPABASE_*` vars blank and `pnpm dev` still runs (admin auth
> bypassed, no DB). Steps 3–5 only apply once you turn Supabase on. See
> [10 — Supabase (optional)](./10-supabase-optional.md).

### Option A — Local (recommended for dev)

```bash
pnpm db:start      # docker stack on :54321 (api), :54322 (db), :54323 (studio)
pnpm db:reset      # applies migrations + seed.sql
```

Point `.env.local` at the local stack (URL + anon key printed by `pnpm db:status`).

### Option B — Remote (Supabase Cloud)

```bash
supabase link --project-ref <your-ref>
pnpm db:push       # applies supabase/migrations/* to the linked project
# Optional one-time seed:  psql "$DB_URL" -f supabase/seed.sql
```

## 4. Regenerate types

```bash
pnpm db:types
```

This rewrites `lib/supabase/database.types.ts` from the linked database. **Run after every migration.**

## 5. Create an admin user

Supabase Studio → Authentication → Users → Add user (email + password). The starter ships with email signup disabled (`supabase/config.toml`), so the only way to create admins is the dashboard or CLI.

## 6. Run

```bash
pnpm dev
```

- `http://localhost:3000` — landing
- `http://localhost:3000/admin` — `proxy.ts` redirects you to `/admin/login` until authenticated.
