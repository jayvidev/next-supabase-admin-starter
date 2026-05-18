'use client'

import { Copy, ExternalLink, Pencil, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { formatBytes, formatDate, getFileName } from '@admin/pages/media/columns'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import type { CloudinaryResource } from '@/lib/cloudinary'

interface MediaDetailsDialogProps {
  open: boolean
  onClose: () => void
  media: CloudinaryResource | null
  onDelete?: (media: CloudinaryResource) => void
  onReplace?: (media: CloudinaryResource) => void
  onRename?: (media: CloudinaryResource) => void
}

export function MediaDetailsDialog({
  open,
  onClose,
  media,
  onDelete,
  onReplace,
  onRename,
}: MediaDetailsDialogProps) {
  if (!media) return null

  const fileName = getFileName(media.public_id)
  const displayName = media.display_name || fileName

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="break-all">{displayName}</DialogTitle>
          <DialogDescription>Cloudinary media details</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-[1fr_250px]">
          {/* Preview */}
          <div className="flex flex-col gap-2">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border bg-muted/50 sm:aspect-auto sm:h-100">
              {media.resource_type === 'video' || media.format === 'mp4' ? (
                <video
                  src={media.secure_url}
                  className="max-h-full max-w-full object-contain"
                  controls
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <img
                  src={media.secure_url}
                  alt={displayName}
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
            <a
              href={media.secure_url}
              target="_blank"
              rel="noreferrer"
              className="text-center text-xs text-muted-foreground hover:underline"
            >
              Open original in new tab
            </a>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4 text-sm">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Original name</Label>
              <p className="break-all font-medium leading-none">{fileName}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Public ID</Label>
              <p className="break-all font-mono text-xs text-muted-foreground">{media.public_id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Format</Label>
                <p className="font-mono uppercase">{media.format}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Size</Label>
                <p>{formatBytes(media.bytes)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Dimensions</Label>
                <p>
                  {media.width} × {media.height}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Uploaded at</Label>
                <p>{formatDate(media.created_at)}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label className="text-xs text-muted-foreground">Usage state</Label>
              <div>
                {media.usedIn === undefined ? (
                  <span className="text-xs text-muted-foreground">Unknown</span>
                ) : media.usedIn.length === 0 ? (
                  <Badge variant="muted">Unused</Badge>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <Badge variant="success" className="w-fit">
                      In use ({media.usedIn.length})
                    </Badge>
                    <ul className="list-inside list-disc text-xs text-muted-foreground">
                      {media.usedIn.map((use, i) => (
                        <li key={i}>{use}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t mt-2">
              <Label className="text-xs text-muted-foreground">Actions</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  title="Copy URL"
                  onClick={() => {
                    navigator.clipboard.writeText(media.secure_url)
                    toast.success('URL copied to clipboard')
                  }}
                >
                  <Copy className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  title="Open in new tab"
                  onClick={() => window.open(media.secure_url, '_blank')}
                >
                  <ExternalLink className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  title="Replace"
                  onClick={() => {
                    onClose()
                    onReplace?.(media)
                  }}
                >
                  <Upload className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  title="Rename"
                  onClick={() => {
                    onClose()
                    onRename?.(media)
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  title="Delete"
                  onClick={() => {
                    onClose()
                    onDelete?.(media)
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
