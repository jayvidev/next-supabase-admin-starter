import type { LucideIcon } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

const iconRegistry = LucideIcons as unknown as Record<string, LucideIcon>

export function getLucideIcon(iconName: string): LucideIcon | null {
  if (!iconName) return null
  const pascalName = iconName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
  return iconRegistry[pascalName] ?? null
}
