import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { getSiteSettings } from '@/lib/supabase/server-queries'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null)
  return {
    title: {
      default: settings?.site_name ?? 'Landing Admin Starter',
      template: '%s',
    },
    description: settings?.tagline ?? 'Next.js + Supabase landing & admin starter',
    icons: settings?.favicon_url ? { icon: settings.favicon_url } : undefined,
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen w-full overflow-x-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
