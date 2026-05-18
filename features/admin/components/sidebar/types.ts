import type { AdminUrl } from '@admin/config/routes'

interface BaseNavItem {
  title: string
  badge?: string
  icon?: React.ElementType
}

type NavLink = BaseNavItem & {
  url: AdminUrl
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: AdminUrl })[]
  url?: never
  defaultOpen?: boolean
}

type NavItem = NavCollapsible | NavLink

interface NavGroup {
  title: string
  items: NavItem[]
}

interface SidebarData {
  navGroups: NavGroup[]
}

export type { NavCollapsible, NavGroup, NavItem, NavLink, SidebarData }
