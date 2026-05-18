import { SmartLink } from '@landing/components/ui/smart-link'

import type { Tables } from '@/lib/supabase/database.types'

interface FooterLink {
  label: string
  href: string
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  data: Tables<'footer_settings'> | null
}

export function Footer({ data }: FooterProps) {
  const columns: FooterColumn[] = (() => {
    if (!data?.columns) return []
    try {
      const cols = typeof data.columns === 'string' ? JSON.parse(data.columns) : data.columns
      return Array.isArray(cols) ? (cols as FooterColumn[]) : []
    } catch {
      return []
    }
  })()

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-4">
        <div className="space-y-2">
          {data?.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.logo_url} alt="Logo" className="h-8 w-auto" />
          )}
          {data?.about_text && <p className="text-sm text-muted-foreground">{data.about_text}</p>}
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 text-sm font-semibold">{col.title}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links?.map((link) => (
                <li key={link.href}>
                  <SmartLink href={link.href}>{link.label}</SmartLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {data?.copyright_text && (
        <div className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
          {data.copyright_text}
        </div>
      )}
    </footer>
  )
}
