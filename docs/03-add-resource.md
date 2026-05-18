# 03 — Add a CMS resource

This is the most common workflow. Example: add an editable `testimonials` section.

## 1. Create the migration

```bash
pnpm db:migration add_testimonials
```

Edit the generated file:

```sql
create table public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  author      text not null,
  quote       text not null,
  avatar_url  text,
  is_active   boolean default true,
  sort_order  int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create trigger trg_set_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();

alter table public.testimonials enable row level security;
create policy "public_read" on public.testimonials for select using (true);
create policy "auth_all" on public.testimonials for all to authenticated
  using (true) with check (true);
```

Apply + regen types:

```bash
pnpm db:push        # or db:reset locally
pnpm db:types
```

## 2. Cache tag

`lib/cache-tags.ts`:

```ts
export const cacheTags = {
  // ...existing
  testimonials: 'testimonials',
} as const
```

## 3. API (`features/admin/api/testimonials.ts`)

```ts
import { createClient } from '@/lib/supabase/client'
import type { Tables, InsertTables, UpdateTables } from '@/lib/supabase/database.types'

const supabase = createClient()
export type Testimonial = Tables<'testimonials'>

export const testimonialsApi = {
  async getAll(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials').select('*').order('sort_order')
    if (error) throw error
    return data ?? []
  },
  async create(values: InsertTables<'testimonials'>) {
    const { data, error } = await supabase.from('testimonials').insert(values).select().single()
    if (error) throw error
    return data
  },
  async update(id: string, values: UpdateTables<'testimonials'>) {
    const { data, error } = await supabase
      .from('testimonials').update(values).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async delete(id: string) {
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (error) throw error
  },
}
```

## 4. Schema (`features/admin/schemas/testimonial.schema.ts`)

```ts
import { z } from 'zod'

export const testimonialSchema = z.object({
  author: z.string().min(1),
  quote: z.string().min(1).max(500),
  avatar_url: z.string().url().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().default(0),
})

export type TestimonialFormValues = z.infer<typeof testimonialSchema>
```

## 5. Admin page (`features/admin/pages/testimonials/index.tsx`)

Use `TableListLayout` + `DataTable` + `ResourceDialog`. See `features/admin/pages/media/` for a worked example and `features/admin/pages/hero/` for a single-record form pattern.

## 6. Wire the route

`app/admin/(panel)/home/testimonials/page.tsx`:

```tsx
import { adminRoutes } from '@admin/config/routes'
import { TestimonialsPage } from '@admin/pages/testimonials'

const PATHNAME = '/admin/home/testimonials'
const page = adminRoutes[PATHNAME]!

export const metadata = { title: page.title }
export default function Page() {
  return <TestimonialsPage pathname={PATHNAME} />
}
```

`features/admin/config/routes.ts` — add:

```ts
'/admin/home/testimonials': {
  title: 'Testimonials',
  resource: 'testimonials',
  sidebar: { icon: MessageSquare, group: 'home', subgroup: 'sections' },
},
```

(Sidebar updates automatically.)

## 7. Landing read (optional)

`lib/supabase/server-queries.ts`:

```ts
export const getTestimonials = unstable_cache(
  async () => {
    const { data } = await publicClient
      .from('testimonials').select('*').eq('is_active', true).order('sort_order')
    return data ?? []
  },
  ['testimonials'],
  { tags: [cacheTags.testimonials], revalidate: 60 * 60 }
)
```

Then render `<Testimonials data={await getTestimonials()} />` in `app/(landing)/page.tsx`.

## 8. Invalidate cache on save

When wiring the form's submit, pass the cache tag:

```ts
await testimonialsApi.update(id, values)
await revalidateLandingCache([cacheTags.testimonials])
```

(`useResourceForm` accepts a `revalidateTags` option that does this for you.)
