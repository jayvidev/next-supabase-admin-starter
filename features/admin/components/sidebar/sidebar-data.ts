import {
  type AdminRoute,
  adminRoutes,
  type AdminUrl,
  groupTitles,
  type SidebarGroup,
  sidebarGroups,
  type SidebarSubgroup,
  subgroupMeta,
} from '@admin/config/routes'

import type { NavCollapsible, NavItem, SidebarData } from './types'

interface GetSidebarDataOptions {
  isSuperAdmin: boolean
}

export { groupTitles }

const getSidebarItemsByGroup = (
  group: SidebarGroup,
  { isSuperAdmin }: GetSidebarDataOptions
): NavItem[] => {
  const result: NavItem[] = []
  const collapsibleMap = new Map<SidebarSubgroup, NavCollapsible>()

  for (const [url, _route] of Object.entries(adminRoutes)) {
    const route = _route as AdminRoute
    if (!route.sidebar || route.sidebar.group !== group) continue
    void isSuperAdmin

    const { icon, subgroup } = route.sidebar as {
      icon: React.ElementType
      subgroup?: SidebarSubgroup
    }

    if (subgroup) {
      if (!collapsibleMap.has(subgroup)) {
        const meta = subgroupMeta[subgroup]
        const collapsible: NavCollapsible = {
          title: meta.title,
          icon: meta.icon,
          items: [],
          defaultOpen: meta.defaultOpen,
        }
        collapsibleMap.set(subgroup, collapsible)
        result.push(collapsible)
      }
      collapsibleMap.get(subgroup)!.items.push({ title: route.title, url: url as AdminUrl, icon })
    } else {
      result.push({ title: route.title, url: url as AdminUrl, icon })
    }
  }

  return result
}

export const getSidebarData = (
  options: GetSidebarDataOptions = { isSuperAdmin: true }
): SidebarData => ({
  navGroups: sidebarGroups
    .map((key) => ({
      title: groupTitles[key],
      items: getSidebarItemsByGroup(key, options),
    }))
    .filter((group) => group.items.length > 0),
})
