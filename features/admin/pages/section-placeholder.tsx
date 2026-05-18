'use client'

import { Construction } from 'lucide-react'

import { Breadcrumbs } from '@admin/components/shared/breadcrumbs'
import { getRoute } from '@admin/config/routes'

interface Props {
  pathname: string
  table: string
}

export function SectionPlaceholder({ pathname, table }: Props) {
  const route = getRoute(pathname)
  const Icon = route?.sidebar?.icon
  return (
    <>
      <Breadcrumbs pathname={pathname} />
      <div className="rounded-lg border bg-card p-12 text-center flex flex-col items-center gap-3">
        <div className="bg-primary/10 text-primary p-3 rounded-full">
          {Icon ? <Icon className="size-6" /> : <Construction className="size-6" />}
        </div>
        <h1 className="text-xl font-semibold">{route?.title}</h1>
        <p className="text-muted-foreground text-sm max-w-md">
          CRUD UI for table <code className="bg-muted px-1.5 py-0.5 rounded">{table}</code> not
          implemented yet. Use Supabase Studio to edit rows in the meantime.
        </p>
      </div>
    </>
  )
}
