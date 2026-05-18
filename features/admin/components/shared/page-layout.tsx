'use client'

import { CirclePlus } from 'lucide-react'
import type { ReactNode } from 'react'

import { Breadcrumbs } from '@admin/components/shared/breadcrumbs'
import { getRoute } from '@admin/config/routes'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface PageLayoutProps {
  title: string
  description: string
  pathname: string
  onCreate?: () => void
  onRefresh?: () => void
  isLoading?: boolean
  isRefreshing?: boolean
  showCreateButton?: boolean
  createDisabled?: boolean
  createTitle?: string
  children: ReactNode
}

export function PageLayout({
  title,
  description,
  pathname,
  onCreate,
  isLoading = false,
  showCreateButton = true,
  createDisabled = false,
  createTitle,
  children,
}: PageLayoutProps) {
  const route = getRoute(pathname)
  const Icon = route?.sidebar?.icon

  return (
    <>
      <Breadcrumbs pathname={pathname} />
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {Icon && <Icon strokeWidth={2.5} />}
              {title}
            </h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {showCreateButton && onCreate && (
              <Button disabled={isLoading || createDisabled} onClick={onCreate} title={createTitle}>
                {isLoading ? <Spinner /> : <CirclePlus />}
                Add
              </Button>
            )}
          </div>
        </div>
        {children}
      </div>
    </>
  )
}
