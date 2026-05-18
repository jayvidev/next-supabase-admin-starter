'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { DataTable, type ServerPaginationProps } from '@admin/components/data-table/data-table'
import { DataTableSkeleton } from '@admin/components/data-table/data-table-skeleton'
import { PageLayout } from '@admin/components/shared/page-layout'

interface ExternalSearch {
  value: string
  onChange: (value: string) => void
}

interface TableListLayoutProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data?: TData[]
  title: string
  description: string
  pathname: string
  resource: string
  searchKey?: string
  searchPlaceholder?: string
  onCreate?: () => void
  onRefresh?: () => void
  isFetching?: boolean
  isRefetching?: boolean
  showAddButton?: boolean
  onRowClick?: (row: TData) => void
  externalSearch?: ExternalSearch
  serverPagination?: ServerPaginationProps
}

export function TableListLayout<TData, TValue>({
  columns,
  data,
  title,
  description,
  pathname,
  resource,
  searchKey,
  searchPlaceholder,
  onCreate,
  onRefresh,
  isFetching = false,
  isRefetching = false,
  showAddButton = true,
  onRowClick,
  externalSearch,
  serverPagination,
}: TableListLayoutProps<TData, TValue>) {
  const isLoading = data === undefined
  const isRefreshingOrFetching = isRefetching || isFetching

  return (
    <PageLayout
      title={title}
      description={description}
      pathname={pathname}
      onCreate={onCreate}
      onRefresh={onRefresh}
      isLoading={isLoading}
      isRefreshing={isRefreshingOrFetching}
      showCreateButton={showAddButton}
    >
      {isLoading ? (
        <DataTableSkeleton columnCount={columns.length} rowCount={20} />
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          searchKey={searchKey}
          searchPlaceholder={searchPlaceholder}
          isFetchingData={isRefreshingOrFetching}
          onRowClick={onRowClick}
          resource={resource}
          externalSearch={externalSearch}
          serverPagination={serverPagination}
        />
      )}
    </PageLayout>
  )
}
