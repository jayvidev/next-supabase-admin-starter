'use client'

import * as React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'

import { useVirtualizer } from '@tanstack/react-virtual'
import type { LucideIcon, LucideProps } from 'lucide-react'
import { DynamicIcon, dynamicIconImports, type IconName } from 'lucide-react/dynamic'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const ICONS_PER_ROW = 6
const allIconNames = Object.keys(dynamicIconImports) as IconName[]

export function sanitizeIconName(name: string): IconName {
  if (!name) return 'heart' as IconName
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .trim() as IconName
}

const IconRenderer = React.memo(({ name }: { name: IconName }) => {
  return <DynamicIcon name={sanitizeIconName(name)} className="size-4" />
})
IconRenderer.displayName = 'IconRenderer'

const IconsColumnSkeleton = () => (
  <div className="flex flex-col gap-2 w-full">
    <div className="grid grid-cols-6 gap-1.5 w-full">
      {Array.from({ length: 36 }).map((_, i) => (
        <Skeleton key={i} className="size-9 rounded-md" />
      ))}
    </div>
  </div>
)

interface IconPickerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof PopoverTrigger>, 'onSelect' | 'onOpenChange'> {
  value?: IconName
  defaultValue?: IconName
  onValueChange?: (value: IconName) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  searchable?: boolean
  searchPlaceholder?: string
  triggerPlaceholder?: string
  modal?: boolean
}

const IconPicker = React.forwardRef<React.ComponentRef<typeof PopoverTrigger>, IconPickerProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      open,
      defaultOpen,
      onOpenChange,
      children,
      searchable = true,
      searchPlaceholder = 'Search icon...',
      triggerPlaceholder = 'Seleccionar icono',
      modal = false,
      ...props
    },
    ref
  ) => {
    const [selectedIcon, setSelectedIcon] = useState<IconName | undefined>(defaultValue)
    const [isOpen, setIsOpen] = useState(defaultOpen || false)
    const [search, setSearch] = useState('')
    const [isReady, setIsReady] = useState(false)
    const parentRef = useRef<HTMLDivElement>(null)

    const filteredIcons = useMemo(() => {
      if (search.trim() === '') return allIconNames
      const q = search.toLowerCase().trim()
      return allIconNames.filter((name) => name.includes(q))
    }, [search])

    const rowCount = Math.ceil(filteredIcons.length / ICONS_PER_ROW)

    const virtualizer = useVirtualizer({
      count: rowCount,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 38,
      gap: 4,
      overscan: 5,
    })

    const handleValueChange = useCallback(
      (icon: IconName) => {
        if (value === undefined) {
          setSelectedIcon(icon)
        }
        onValueChange?.(icon)
      },
      [value, onValueChange]
    )

    const handleOpenChange = useCallback(
      (newOpen: boolean) => {
        setSearch('')
        if (open === undefined) {
          setIsOpen(newOpen)
        }
        onOpenChange?.(newOpen)

        if (newOpen) {
          setTimeout(() => {
            setIsReady(true)
            virtualizer.measure()
          }, 1)
        } else {
          setIsReady(false)
        }
      },
      [open, onOpenChange, virtualizer]
    )

    const handleIconClick = useCallback(
      (iconName: IconName) => {
        handleValueChange(iconName)
        if (open === undefined) {
          setIsOpen(false)
        }
        onOpenChange?.(false)
        setSearch('')
      },
      [handleValueChange, open, onOpenChange]
    )

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        if (parentRef.current) {
          parentRef.current.scrollTop = 0
        }
        virtualizer.scrollToOffset(0)
      },
      [virtualizer]
    )

    const currentIcon = value || selectedIcon

    return (
      <Popover open={open ?? isOpen} onOpenChange={handleOpenChange} modal={modal}>
        <PopoverTrigger ref={ref} asChild {...props}>
          {children || (
            <Button variant="outline" className="w-full justify-start gap-2">
              {currentIcon ? (
                <>
                  <DynamicIcon name={sanitizeIconName(currentIcon)} className="size-4" />
                  <span className="truncate">{currentIcon}</span>
                </>
              ) : (
                <span className="text-muted-foreground">{triggerPlaceholder}</span>
              )}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-72 p-2" align="start">
          {searchable && (
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={handleSearchChange}
              className="mb-2"
            />
          )}
          <div
            ref={parentRef}
            className="max-h-60 overflow-auto"
            style={{ scrollbarWidth: 'thin' }}
          >
            {!isReady ? (
              <IconsColumnSkeleton />
            ) : filteredIcons.length === 0 ? (
              <div className="text-center text-muted-foreground py-4 text-sm">
                No se encontraron iconos
              </div>
            ) : (
              <div
                className="relative w-full"
                style={{ height: `${virtualizer.getTotalSize()}px` }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const startIdx = virtualRow.index * ICONS_PER_ROW
                  const rowIcons = filteredIcons.slice(startIdx, startIdx + ICONS_PER_ROW)

                  return (
                    <div
                      key={virtualRow.key}
                      className={cn(
                        'absolute left-0 w-full grid gap-1.5',
                        `grid-cols-${ICONS_PER_ROW}`
                      )}
                      style={{
                        top: `${virtualRow.start}px`,
                        height: `${virtualRow.size}px`,
                        gridTemplateColumns: `repeat(${ICONS_PER_ROW}, minmax(0, 1fr))`,
                      }}
                    >
                      {rowIcons.map((iconName) => (
                        <Tooltip key={iconName}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                'size-9 rounded-md border flex items-center justify-center transition-colors',
                                'hover:bg-accent hover:text-accent-foreground',
                                currentIcon === iconName && 'bg-accent border-primary'
                              )}
                              onClick={() => handleIconClick(iconName)}
                            >
                              <IconRenderer name={iconName} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>{iconName}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          {filteredIcons.length > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              {filteredIcons.length} iconos
            </p>
          )}
        </PopoverContent>
      </Popover>
    )
  }
)
IconPicker.displayName = 'IconPicker'

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName
}

const Icon = React.forwardRef<React.ComponentRef<LucideIcon>, IconProps>(
  ({ name, ...props }, ref) => {
    return <DynamicIcon name={sanitizeIconName(name)} {...props} ref={ref} />
  }
)
Icon.displayName = 'Icon'

export { Icon, type IconName, IconPicker }
