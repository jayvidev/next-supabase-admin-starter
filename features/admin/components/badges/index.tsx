import type { VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

import { Badge, badgeVariants } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type BadgeVariant = VariantProps<typeof badgeVariants>['variant']

export type StatusBadgeMeta = {
  label: string
  icon: ReactNode
  variant: BadgeVariant
}

export const statusBadges: Record<string, StatusBadgeMeta> = {
  true: {
    label: 'Active',
    icon: <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />,
    variant: 'success',
  },
  false: {
    label: 'Inactive',
    icon: <span className="size-1.5 rounded-full border border-current" aria-hidden="true" />,
    variant: 'danger',
  },
}

export function getStatusBadge(isActive: boolean): StatusBadgeMeta {
  return statusBadges[String(isActive)]
}

export function StatusBadge({ isActive, className }: { isActive: boolean; className?: string }) {
  const status = getStatusBadge(isActive)
  return (
    <Badge variant={status.variant} className={cn('gap-1.5 px-2.5 py-1 rounded-full', className)}>
      {status.icon}
      {status.label}
    </Badge>
  )
}
