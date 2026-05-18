'use client'

import type { ReactNode } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

interface CardGridLayoutProps {
  isLoading?: boolean
  skeletonCount?: number
  skeletonClassName?: string
  skeletonComponent?: React.ComponentType
  gridClassName?: string
  className?: string
  children: ReactNode
}

export function CardGridLayout({
  isLoading = false,
  skeletonCount = 6,
  skeletonClassName = 'h-64 w-full rounded-lg',
  skeletonComponent: SkeletonComponent,
  gridClassName,
  className,
  children,
}: CardGridLayoutProps) {
  return (
    <div className={className}>
      {children}
      {isLoading && (
        <div className={gridClassName || 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'}>
          {Array.from({ length: skeletonCount }).map((_, i) =>
            SkeletonComponent ? (
              <SkeletonComponent key={i} />
            ) : (
              <Skeleton key={i} className={skeletonClassName} />
            )
          )}
        </div>
      )}
    </div>
  )
}
