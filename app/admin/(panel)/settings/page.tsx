import type { Metadata } from 'next'

import { adminRoutes } from '@admin/config/routes'

const PATHNAME = '/admin/settings'
const page = adminRoutes[PATHNAME]!

export const metadata: Metadata = { title: page.title }

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{page.title}</h1>
      <p className="text-sm text-muted-foreground">
        Add your site settings table and form here after running{' '}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">pnpm db:types</code>.
      </p>
    </div>
  )
}
