'use client'

import { Table } from '@tanstack/react-table'
import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { DataTableViewOptions } from './data-table-view-options'

interface ExternalSearch {
  value: string
  onChange: (value: string) => void
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchKey?: string
  searchPlaceholder?: string
  resource?: string
  externalSearch?: ExternalSearch
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder,
  resource,
  externalSearch,
}: DataTableToolbarProps<TData>) {
  const showSearch = !!externalSearch || !!searchKey

  const isFiltered = externalSearch
    ? externalSearch.value.length > 0
    : table.getState().columnFilters.length > 0

  const searchValue = externalSearch
    ? externalSearch.value
    : searchKey
      ? ((table.getColumn(searchKey)?.getFilterValue() as string) ?? '')
      : ''

  const handleSearchChange = (value: string) => {
    if (externalSearch) {
      externalSearch.onChange(value)
    } else if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue(value)
    }
  }

  const handleReset = () => {
    if (externalSearch) {
      externalSearch.onChange('')
    } else {
      table.resetColumnFilters()
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between space-x-2 gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {showSearch && (
          <div className="relative">
            <Input
              placeholder={searchPlaceholder ?? `Search…`}
              className="pl-9 pr-4 h-8 w-47.5 lg:w-67.5 text-sm"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
          </div>
        )}

        {isFiltered && (
          <Button className="border-dashed" variant="outline" onClick={handleReset}>
            Reset
            <X />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} resource={resource} />
      </div>
    </div>
  )
}
