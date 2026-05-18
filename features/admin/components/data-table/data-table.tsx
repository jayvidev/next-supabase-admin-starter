'use client'

import * as React from 'react'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  type RowData,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClass?: string
    cellClass?: string
    resource?: string
  }
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'

interface ExternalSearch {
  value: string
  onChange: (value: string) => void
}

export interface ServerPaginationProps {
  pageIndex: number
  pageSize: number
  pageCount: number
  totalElements: number
  onPaginationChange: OnChangeFn<PaginationState>
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  isFetchingData?: boolean
  onRowClick?: (row: TData) => void
  resource?: string
  externalSearch?: ExternalSearch
  serverPagination?: ServerPaginationProps
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder,
  isFetchingData = false,
  onRowClick,
  resource,
  externalSearch,
  serverPagination,
}: DataTableProps<TData, TValue>) {
  const isServerPaginated = !!serverPagination
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const pagination = isServerPaginated
    ? { pageIndex: serverPagination.pageIndex, pageSize: serverPagination.pageSize }
    : internalPagination

  const onPaginationChange = isServerPaginated
    ? serverPagination.onPaginationChange
    : setInternalPagination

  const enhancedColumns = React.useMemo(() => {
    if (!resource) return columns
    return columns.map(
      (column): ColumnDef<TData, TValue> => ({
        ...column,
        meta: { ...column.meta, resource },
      })
    )
  }, [columns, resource])

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    pageCount: isServerPaginated ? serverPagination.pageCount : undefined,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    onPaginationChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: isServerPaginated,
    enableRowSelection: true,
  })

  return (
    <>
      <div className="space-y-4">
        <DataTableToolbar
          table={table}
          searchKey={externalSearch ? undefined : searchKey}
          searchPlaceholder={searchPlaceholder}
          resource={resource}
          externalSearch={externalSearch}
        />
        <div
          className={cn(
            'rounded-md border transition-opacity duration-200',
            isFetchingData && 'opacity-50'
          )}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn('px-4', header.column.columnDef.meta?.headerClass)}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn('table-row-animate', onRowClick && 'cursor-pointer')}
                    style={{
                      animationDelay: `${index * 0.05}s`,
                    }}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn('px-4', cell.column.columnDef.meta?.cellClass)}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-14 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="sticky bottom-0 z-10 bg-background py-4 ">
        <DataTablePagination table={table} />
      </div>
    </>
  )
}
