import {
  House,
  Images,
  LayoutDashboard,
  LayoutPanelTop,
  ListEnd,
  Monitor,
  Settings,
} from 'lucide-react'

export const sidebarGroups = ['layout', 'home', 'library', 'system'] as const
export type SidebarGroup = (typeof sidebarGroups)[number]

export const sidebarSubgroups = ['sections', 'layout'] as const
export type SidebarSubgroup = (typeof sidebarSubgroups)[number]

export const subgroupMeta: Record<
  SidebarSubgroup,
  { title: string; icon: React.ElementType; defaultOpen?: boolean }
> = {
  sections: { title: 'Home', icon: House, defaultOpen: true },
  layout: { title: 'Layout', icon: LayoutDashboard, defaultOpen: true },
}

export type AdminRoute = {
  title: string
  resource?: string
  sidebar?: {
    icon: React.ElementType
    group: SidebarGroup
    subgroup?: SidebarSubgroup
  }
}

export const adminRoutes = {
  '/admin/layout/header': {
    title: 'Header',
    resource: 'header_settings',
    sidebar: { icon: LayoutPanelTop, group: 'layout', subgroup: 'layout' },
  },
  '/admin/layout/footer': {
    title: 'Footer',
    resource: 'footer_settings',
    sidebar: { icon: ListEnd, group: 'layout', subgroup: 'layout' },
  },
  '/admin/home/hero': {
    title: 'Hero',
    resource: 'hero',
    sidebar: { icon: Monitor, group: 'home', subgroup: 'sections' },
  },
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
  layout: 'Layout',
  home: 'Home',
  library: 'Library',
  system: 'System',
}
