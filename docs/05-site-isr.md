# 05 — Site & ISR

## Render mode

`app/(site)/page.tsx` sets:

```ts
export const dynamic = 'force-static'
```

The page is generated once at build time and served from the edge cache until a tag invalidation forces a regeneration on the next request.

## Cached queries

`lib/supabase/server-queries.ts` wraps every site read with `unstable_cache`:

```ts
export const getHero = unstable_cache(
  async () => { /* ...select... */ },
  ['hero'],
  { tags: [cacheTags.hero], revalidate: 60 * 60 }
)
```

Key parts:

- **Cache key** (`['hero']`): identifies the entry within Next's data cache.
- **Tags**: how we invalidate from elsewhere. Always pull from `cacheTags`.
- **`revalidate`**: a fallback in seconds — even without an explicit invalidation, the entry is rebuilt every hour.

## Invalidation

`features/admin/actions/revalidate.ts`:

```ts
'use server'
export async function revalidateSiteCache(tags?: CacheTag[]) {
  const toInvalidate = tags && tags.length ? tags : allSiteTags
  for (const tag of toInvalidate) revalidateTag(tag, 'max')
  revalidatePath('/', 'layout')
}
```

- `revalidateTag(tag, 'max')` — kills every cached entry tagged with `tag`.
- `revalidatePath('/', 'layout')` — also bumps the layout, so any sections that read from inside layouts also refresh.

`useResourceForm({ revalidateTags: [cacheTags.hero] })` calls this for you after a successful `onSubmit`.

## Adding a new site read

1. Define a tag in `lib/cache-tags.ts`.
2. Add a `getXxx` in `server-queries.ts` using that tag.
3. Call it from `app/(site)/page.tsx` (use `Promise.all` so reads parallelize).
4. In the admin form that mutates this data, pass the tag in `revalidateTags`.

## Performance tips

- Keep `Promise.all` in `page.tsx` — never `await` reads sequentially.
- Don't pull large blob fields you won't render (`.select('id, title, image_url')` is fine).
- If a read needs auth, it doesn't belong here — it goes in an admin route.
