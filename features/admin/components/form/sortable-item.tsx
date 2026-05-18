'use client'

import { useSortable } from '@dnd-kit/react/sortable'

interface SortableItemProps {
  id: string | number
  index: number
  children: (props: { handleRef: React.RefCallback<HTMLElement> }) => React.ReactNode
}

interface SortableData {
  initialIndex: number
  index: number
}

export function getSortableData(source: unknown): SortableData | undefined {
  if (!source || typeof source !== 'object') return undefined
  const s = source as Record<string, unknown>
  if (
    s.sortable &&
    typeof s.sortable === 'object' &&
    s.sortable !== null &&
    'initialIndex' in s.sortable &&
    'index' in s.sortable
  ) {
    return s.sortable as SortableData
  }
  return undefined
}

export function SortableItem({ id, index, children }: SortableItemProps) {
  const { ref, handleRef, isDragging } = useSortable({
    id,
    index,
  })

  return (
    <div ref={ref} className="h-full" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children({ handleRef })}
    </div>
  )
}
