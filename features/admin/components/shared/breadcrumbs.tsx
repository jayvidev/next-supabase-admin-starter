import { getRoute, groupTitles } from '@admin/config/routes'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface BreadcrumbsProps {
  pathname: string
}

export function Breadcrumbs({ pathname }: BreadcrumbsProps) {
  const currentRoute = getRoute(pathname)
  if (!currentRoute) return null

  const groupKey = currentRoute.sidebar?.group
  const groupName = groupKey ? groupTitles[groupKey] : undefined

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {groupName && (
          <BreadcrumbItem>
            <span className="text-muted-foreground cursor-default">{groupName}</span>
          </BreadcrumbItem>
        )}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{currentRoute.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
