# 06 — Auth & `proxy.ts`

## Why `proxy.ts` (not `middleware.ts`)

Next.js 16 renamed the root middleware file from `middleware.ts` to `proxy.ts`. Same exports (`export function proxy` + `export const config = { matcher }`), only the filename changed. **Do not create `middleware.ts`**.

## What `proxy.ts` does

`/proxy.ts`:

```ts
export const config = { matcher: ['/admin/:path*'] }

export async function proxy(request: NextRequest) {
  // build a Supabase server client bound to request/response cookies
  // call supabase.auth.getUser() — also refreshes the session
  // if /admin/* and no user  → redirect to /admin/login?redirect=<path>
  // if /admin/login and user → redirect to /admin
}
```

All the logic lives **inside `proxy.ts`** — do not split into `lib/supabase/middleware.ts`. The current repos do it this way and it stays trivially auditable.

## Login flow

`features/auth/pages/login/form.tsx`:

- Zod + react-hook-form.
- `createClient().auth.signInWithPassword({ email, password })`.
- On success, reads `redirect` from query and pushes there (fallback `/admin`).

## Logout

`features/admin/components/sidebar/nav-user.tsx` (and `header/profile-dropdown.tsx`) call `createClient().auth.signOut()` then `router.push('/admin/login')`.

## Adding role-based access

The shipped RLS allows any `authenticated` user full access. To add admin-only:

1. New migration: a `profiles` table joined to `auth.users` with a `role` column, or use Supabase custom claims.
2. In `proxy.ts`, after `getUser()`, fetch the role and redirect non-admins.
3. Tighten RLS: replace `auth_all` with `auth_admin` policy that checks `auth.jwt() ->> 'role' = 'admin'` (or the equivalent against `profiles`).
4. Optionally enable role-based sidebar filtering in `features/admin/components/sidebar/sidebar-data.ts` (the `isSuperAdmin` argument is already plumbed; see `marketingvip.co` for a reference implementation).
