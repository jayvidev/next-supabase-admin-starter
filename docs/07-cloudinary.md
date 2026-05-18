# 07 — Cloudinary

## Why Cloudinary (not Supabase Storage)

Supabase Storage works, but Cloudinary gives:

- automatic format/quality optimization (AVIF/WebP),
- on-the-fly transforms via URL,
- a free tier comfortable for marketing sites.

The starter wires Cloudinary; swap to Supabase Storage if your project requires it (in that case delete `app/api/cloudinary/*`, replace `CloudinaryMediaPicker`, and add a `storage` block in `supabase/config.toml`).

## Setup

1. Create a Cloudinary account.
2. Settings → Upload → **Add upload preset**, signing mode = **Unsigned**. Name it whatever you want and put it in `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
3. Settings → Upload → set a folder (`NEXT_PUBLIC_CLOUDINARY_FOLDER`) so uploads from this project stay scoped.
4. Fill `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` (server-side only).

## API routes

`app/api/cloudinary/`:

| Route | Purpose |
|---|---|
| `sign` | Returns a signed payload for direct browser uploads. |
| `images` | Lists assets in your folder (paginated). |
| `delete` | Removes an asset by `public_id`. |
| `rename` | Renames an asset. |

These are server-only because they use the API secret.

## In the admin

`features/admin/components/form/cloudinary-media-picker.tsx` and `media-url-input.tsx` open the Cloudinary widget and return a `secure_url`. Persist that URL to the database — never the raw file.

The `/admin/media` page (`features/admin/pages/media/`) lists uploads and lets you delete/rename them.
