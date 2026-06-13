# 09 — Deploy

## Vercel

1. Push to GitHub.
2. Import the repo on Vercel.
3. Framework preset: **Next.js**. Build command: `pnpm build`. Install command: `pnpm install`.
4. Add env vars (same names as `.env.example`) under Project Settings → Environment Variables. Mark them for Production + Preview.
5. Deploy.

## Supabase production

- Use a separate Supabase project for production. Never share the dev DB.
- Link locally: `supabase link --project-ref <prod-ref>` then `pnpm db:push` to apply migrations to prod.
- Promotions: branch deploys can point at a Supabase preview branch (`supabase branches`); see Supabase docs.

## Cloudinary

- One Cloudinary account, but a per-environment folder (`my-project-prod`, `my-project-staging`). Set `NEXT_PUBLIC_CLOUDINARY_FOLDER` per environment.
- The unsigned upload preset should restrict mime types and max file size on the Cloudinary side.

## Post-deploy checklist

- `https://yourdomain/admin` redirects to login.
- `https://yourdomain/api/cloudinary/sign` returns 200 for an authenticated request (test from the admin).
- `revalidateTag` works: edit a row, refresh the site, see the update.
- Lighthouse passes on the site.
- Security headers from `next.config.ts` show in network panel.
