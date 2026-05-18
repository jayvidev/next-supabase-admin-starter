'use client'

import type { ReactNode } from 'react'

import { Breadcrumbs } from '@admin/components/shared/breadcrumbs'
import { getRoute } from '@admin/config/routes'

interface FormPageLayoutProps {
  title: string
  description: string
  pathname: string
  children: ReactNode
}

export function FormPageLayout({ title, description, pathname, children }: FormPageLayoutProps) {
  const route = getRoute(pathname)
  const Icon = route?.sidebar?.icon

  return (
    <>
      <Breadcrumbs pathname={pathname} />
      <div>
        <div className="mb-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {Icon && <Icon strokeWidth={2.5} />}
            {title}
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </>
  )
}
