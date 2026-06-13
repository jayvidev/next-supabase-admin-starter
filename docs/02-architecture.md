# 02 — Architecture

## Folder map

```
app/
  (site)/        # public; force-static; ISR via unstable_cache
    layout.tsx
    page.tsx
  admin/            # protected; force-dynamic
    login/
    (panel)/
      layout.tsx
      home/hero/
      layout/{header,footer}/
      media/
      settings/
  api/cloudinary/   # signed uploads, listing, deletion, rename
  layout.tsx        # root layout (generates metadata from site_settings)

features/
  admin/
    api/            # Supabase mutations per resource: get/create/update/delete[/reorder]
    schemas/        # Zod schemas mirroring DB tables
    pages/          # Page-level admin UI per resource (consumed by app/admin/(panel)/*)
    components/
      data-table/   # TanStack Table wrapper
      sidebar/      # AppSidebar + nav config
      header/       # AdminHeader + CommandMenu
      form/         # rich-text-editor, cloudinary-media-picker, sortable-item, link-input...
      shared/       # resource-form, resource-dialog, page-layout, form-section, ...
    actions/        # Server Actions (notably revalidate.ts)
    hooks/          # use-resource-form, use-user
    config/         # routes.ts (sidebar source of truth), column-labels, sections
    providers/      # QueryClient
    layout.tsx      # AdminLayout: SidebarProvider + AppSidebar + Header + content
  auth/pages/login/ # Zod + react-hook-form Supabase password login
  site/
    sections/       # data-driven site sections (start with hero.tsx)
    components/     # navbar, footer, smart-link, button

lib/supabase/
  server.ts         # createServerClient (cookies)
  client.ts         # createBrowserClient (memoized)
  public-client.ts  # anon client for site reads
  server-queries.ts # unstable_cache wrappers, one per site resource

lib/
  cache-tags.ts     # cacheTags + allSiteTags (passed to revalidateTag)
  cloudinary.ts     # SDK helpers
  slugify.ts utils.ts

config/index.ts     # central env access

proxy.ts            # Next 16: auth-protects /admin/*
supabase/           # migrations + seed + config.toml
```

## Data flow

### Read (site)

```
RSC page  →  getX() in server-queries.ts
          →  unstable_cache(key, { tags: [cacheTags.x], revalidate: 3600 })
          →  publicClient.from('x').select(...)
          →  Supabase
```

The page is `force-static`. Cached responses are tagged; the first request after a tag invalidation regenerates the page.

### Write (admin)

```
Admin form  →  useResourceForm({ onSubmit })
            →  fooApi.update(id, values)         (features/admin/api/foo.ts)
            →  createClient() Supabase (browser)
            →  RLS allows because user is authenticated
            →  revalidateSiteCache([cacheTags.foo])  (Server Action)
            →  revalidateTag + revalidatePath('/', 'layout')
```

Subsequent site requests fetch fresh data and rebuild the static output.

## Conventions

- **One file per resource per layer**: `api/foo.ts`, `schemas/foo.schema.ts`, `pages/foo/index.tsx`.
- **Sidebar = `routes.ts`**. The sidebar is generated from `adminRoutes`; adding/removing a route updates the nav automatically.
- **All cache tags live in `lib/cache-tags.ts`** to avoid typos and make `allSiteTags` exhaustive.
- **Server vs client clients**: Server Components and Route Handlers use `lib/supabase/server.ts`. Client Components use `lib/supabase/client.ts`. Anonymous site reads use `public-client.ts`.
- **Forms**: react-hook-form + Zod, wrapped by `useResourceForm` so revalidation happens after a successful submit.
- **Drag-drop**: `@dnd-kit` via the `SortableItem` helper; reorder writes go through `reorder_by_sort_order` RPC.
