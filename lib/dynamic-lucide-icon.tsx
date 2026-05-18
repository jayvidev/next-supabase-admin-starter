'use client'

import { useEffect, useState } from 'react'

import type { LucideIcon, LucideProps } from 'lucide-react'

interface Props extends LucideProps {
  name: string
  fallback?: LucideIcon
}

function toPascalCase(name: string) {
  return name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

export function DynamicLucideIcon({ name, fallback: Fallback, ...props }: Props) {
  const [Icon, setIcon] = useState<LucideIcon | null>(null)

  useEffect(() => {
    let cancelled = false
    import('lucide-react').then((mod) => {
      if (cancelled) return
      const icon = (mod as unknown as Record<string, LucideIcon>)[toPascalCase(name)]
      if (icon) setIcon(() => icon)
    })
    return () => {
      cancelled = true
    }
  }, [name])

  if (!Icon) return Fallback ? <Fallback {...props} /> : null
  return <Icon {...props} />
}
