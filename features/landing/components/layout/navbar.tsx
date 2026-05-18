import Link from 'next/link'

import { SmartLink } from '@landing/components/ui/smart-link'

import type { Tables } from '@/lib/supabase/database.types'

interface NavLink {
  label: string
  href: string
}

interface NavbarProps {
  data: Tables<'header_settings'> | null
}

export function Navbar({ data }: NavbarProps) {
  const navLinks: NavLink[] = (() => {
    if (!data?.nav_links) return []
    try {
      const links = typeof data.nav_links === 'string' ? JSON.parse(data.nav_links) : data.nav_links
      return Array.isArray(links) ? (links as NavLink[]) : []
    } catch {
      return []
    }
  })()

  return (
    <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="font-semibold">
          {data?.logo_url ? <img src={data.logo_url} alt="Logo" className="h-8 w-auto" /> : 'Brand'}
        </Link>
        <ul className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <li key={link.href}>
              <SmartLink href={link.href}>{link.label}</SmartLink>
            </li>
          ))}
        </ul>
        {data?.cta_label && data.cta_url && (
          <SmartLink
            href={data.cta_url}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {data.cta_label}
          </SmartLink>
        )}
      </nav>
    </header>
  )
}
