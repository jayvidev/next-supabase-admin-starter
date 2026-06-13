import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: {
    default: 'Next.js + Supabase Admin Starter',
    template: '%s | Next.js + Supabase Admin Starter',
  },
  description: 'Next.js + Supabase landing & admin starter',
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
