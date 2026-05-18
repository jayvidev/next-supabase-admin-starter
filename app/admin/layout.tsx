import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { AdminProviders } from './admin-providers'

import './globals.css'

import '@fontsource-variable/inter'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    template: '%s - Vertex Admin',
    default: 'Admin - Vertex Glass',
  },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminProviders>{children}</AdminProviders>
}
