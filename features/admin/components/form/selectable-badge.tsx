'use client'

import * as React from 'react'

import { type VariantProps } from 'class-variance-authority'

import { Badge, badgeVariants } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type BadgeVariant = VariantProps<typeof badgeVariants>['variant']

interface SelectableBadgeProps {
  label: string
  icon?: React.ReactNode
  selected: boolean
  onClick: () => void
  activeVariant?: BadgeVariant
  disabled?: boolean
  className?: string
}

export function SelectableBadge({
  label,
  icon,
  selected,
  onClick,
  activeVariant = 'brand',
  disabled,
  className,
}: SelectableBadgeProps) {
  return (
    <Badge
      variant={selected ? activeVariant : 'faded'}
      onClick={disabled ? undefined : onClick}
      className={cn(
        'p-3 text-xs rounded-full transition-all',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:opacity-80',
        className
      )}
    >
      {icon}
      {label}
    </Badge>
  )
}
