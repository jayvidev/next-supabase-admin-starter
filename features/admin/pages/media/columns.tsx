'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Copy, ExternalLink, Pencil, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'

import {
  DataTableRowActions,
  type RowActionItem,
} from '@admin/components/data-table/data-table-row-actions'
import { withMetaLabelHeader } from '@admin/utils/with-meta-label-header'

import { Badge } from '@/components/ui/badge'
import type { CloudinaryResource } from '@/lib/cloudinary'

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getFileName(publicId: string) {
  const parts = publicId.split('/')
  return parts[parts.length - 1]
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

interface MediaColumnCallbacks {
  onDelete?: (image: CloudinaryResource) => void
  onReplace?: (image: CloudinaryResource) => void
  onRename?: (image: CloudinaryResource) => void
}

export function getColumns({
  onDelete,
  onReplace,
  onRename,
}: MediaColumnCallbacks = {}): ColumnDef<CloudinaryResource>[] {
  return [
    {
      id: 'thumbnail',
      header: 'Preview',
      enableSorting: false,
      cell: ({ row }) => {
        const isVideo = row.original.resource_type === 'video' || row.original.format === 'mp4'
        const thumbUrl = isVideo
          ? row.original.secure_url.replace(/\.[^/.]+$/, '.jpg')
          : row.original.secure_url

        return (
          <div className="relative size-10 overflow-hidden rounded-md border bg-muted/50">
            <img
              src={thumbUrl}
              alt={getFileName(row.original.public_id)}
              className="size-full object-cover"
              loading="lazy"
            />
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="flex size-5 items-center justify-center rounded-full bg-white/30 backdrop-blur-xs">
                  <div className="size-0 border-y-[3px] border-y-transparent border-l-[5px] border-l-white translate-x-0.5" />
                </div>
              </div>
            )}
          </div>
        )
      },
      size: 56,
    },
    {
      accessorKey: 'display_name',
      header: withMetaLabelHeader<CloudinaryResource>(),
      cell: ({ row }) => {
        const displayName = row.original.display_name
        const filename = getFileName(row.original.public_id)
        return (
          <div>
            <p className="max-w-[220px] truncate text-sm font-medium">{displayName || filename}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'format',
      header: withMetaLabelHeader<CloudinaryResource>(),
      cell: ({ getValue }) => (
        <span className="font-mono text-xs uppercase text-muted-foreground">
          {getValue<string>()}
        </span>
      ),
      size: 80,
    },
    {
      accessorKey: 'bytes',
      header: withMetaLabelHeader<CloudinaryResource>(),
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{formatBytes(getValue<number>())}</span>
      ),
      size: 90,
    },
    {
      accessorKey: 'created_at',
      header: withMetaLabelHeader<CloudinaryResource>(),
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{formatDate(getValue<string>())}</span>
      ),
      size: 110,
    },
    {
      id: 'dimensions',
      header: 'Dimensions',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.width} × {row.original.height}
        </span>
      ),
      size: 110,
    },
    {
      id: 'in_use',
      header: 'In Use',
      cell: ({ row }) => {
        const uses = row.original.usedIn
        if (uses === undefined) return <span className="text-xs text-muted-foreground">—</span>
        if (uses.length === 0) return <Badge variant="muted">Unused</Badge>
        return (
          <Badge variant="success" title={uses.join(', ')}>
            {uses.length} {uses.length === 1 ? 'record' : 'records'}
          </Badge>
        )
      },
      size: 110,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const image = row.original
        const items: RowActionItem[] = [
          {
            icon: Copy,
            label: 'Copy URL',
            onClick: () => {
              navigator.clipboard.writeText(image.secure_url)
              toast.success('URL copied to clipboard')
            },
          },
          {
            icon: ExternalLink,
            label: 'Open',
            onClick: () => window.open(image.secure_url, '_blank'),
          },
          {
            icon: Upload,
            label: 'Replace',
            onClick: () => onReplace?.(image),
          },
          {
            icon: Pencil,
            label: 'Rename',
            onClick: () => onRename?.(image),
          },
          {
            icon: Trash2,
            label: 'Delete',
            onClick: () => onDelete?.(image),
            variant: 'destructive',
          },
        ]
        return <DataTableRowActions items={items} />
      },
      size: 50,
    },
  ]
}
