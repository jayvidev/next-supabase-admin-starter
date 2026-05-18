import type { Tables } from '@/lib/supabase/database.types'

interface HeroProps {
  data: Tables<'hero'>
  header: Tables<'section_headers'> | null
}

export function Hero({ data, header }: HeroProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 text-center">
      {data.pill_text && (
        <span className="inline-block rounded-full border px-3 py-1 text-xs text-muted-foreground">
          {data.pill_text}
        </span>
      )}
      <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
        {header?.title ?? 'Welcome'}
      </h1>
      {header?.subtitle && (
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{header.subtitle}</p>
      )}
    </section>
  )
}
