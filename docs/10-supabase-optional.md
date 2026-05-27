# 10 — Supabase (optional)

Supabase is the database/auth provider, but the starter **boots and builds without it**. Use this to develop the landing or the admin shell before you have a project, and turn Supabase on later by adding two env vars — no code changes.

## The switch

There is no flag to maintain. `config.supabase.enabled` is **auto-derived** from the env:

```ts
// config/index.ts
enabled: Boolean(NEXT_PUBLIC_SUPABASE_URL && NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

- **Both vars set** → enabled. Auth, RLS, and queries work as documented.
- **Either missing** → disabled. The app falls back to a placeholder URL so client construction never throws, and every Supabase caller short-circuits.

## What happens when disabled

| Area | Behaviour |
|---|---|
| `proxy.ts` | Returns early — no `auth.getUser()`, so `/admin/*` is reachable without a session. |
| Login form | `onSubmit` shows "Authentication is disabled until Supabase is configured." |
| `useUser()` | Resolves to `null`, `isLoading: false`. Sidebar/header just show "Admin". |
| Logout buttons | Skip `signOut()`, still route to `/admin/login`. |
| `lib/supabase/database.types.ts` | Already a committed empty baseline — **types do not break**. You do not need `pnpm db:types` (which requires `supabase login` + a linked project) until you enable. |
| Landing queries | `server-queries.ts` ships with no live queries. Add them only after enabling. |

> Disabled = no auth gate. Don't deploy a real admin this way — it's for local dev before the DB exists.

## Enabling later

1. Create the Supabase project (or `pnpm db:start` for local).
2. Put `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
3. `pnpm db:push` (remote) or `pnpm db:reset` (local) to apply `supabase/migrations/*`.
4. `pnpm db:types` to regenerate `database.types.ts` from the live schema.
5. Create an admin user (Studio → Authentication → Users).

Restart `pnpm dev`. `enabled` flips to `true` automatically; the auth gate and queries activate.

## Why auto-detect, not a separate flag

One source of truth. A `NEXT_PUBLIC_SUPABASE_ENABLED` var could drift out of sync with the keys (enabled=true but no URL → crash). Presence of the keys *is* the intent.
