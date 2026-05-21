import { Images, Settings } from 'lucide-react'

export const sidebarGroups = ['library', 'system'] as const
export type SidebarGroup = (typeof sidebarGroups)[number]

export const sidebarSubgroups = [] as const
export type SidebarSubgroup = never

// Must be typed as a plain index signature so sidebar-data.ts compiles
// even when there are no subgroups defined yet.
export const subgroupMeta: Record<
  string,
  { title: string; icon: React.ElementType; defaultOpen?: boolean }
> = {}

export type AdminRoute = {
  title: string
  resource?: string
  sidebar?: {
    icon: React.ElementType
    group: SidebarGroup
    subgroup?: SidebarSubgroup
  }
}

/**
 * Add your own admin routes here after defining your tables.
 * Example:
 *
 * '/admin/home/hero': {
 *   title: 'Hero',
 *   resource: 'hero',
 *   sidebar: { icon: Monitor, group: 'home', subgroup: 'sections' },
 * },
 */
export const adminRoutes = {
  '/admin/media': {
    title: 'Media',
    resource: 'media',
    sidebar: { icon: Images, group: 'library' },
  },
  '/admin/settings': {
    title: 'Settings',
    resource: 'settings',
    sidebar: { icon: Settings, group: 'system' },
  },
} as const satisfies Record<string, AdminRoute>

export type AdminUrl = keyof typeof adminRoutes

export function getRoute(pathname: string): AdminRoute | undefined {
  return adminRoutes[pathname as AdminUrl]
}

export const groupTitles: Record<SidebarGroup, string> = {
  library: 'Library',
  system: 'System',
}
