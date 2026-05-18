'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { type OnChangeFn, type PaginationState } from '@tanstack/react-table'
import { toast } from 'sonner'

import { MediaUrlInput } from '@admin/components/form/media-url-input'
import { DeleteAlertDialog } from '@admin/components/shared/delete-alert-dialog'
import { TableListLayout } from '@admin/components/shared/table-list-layout'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { type CloudinaryResource } from '@/lib/cloudinary'

import { mediaApi } from '../../api/media'
import { AddMediaDialog } from './add-media-dialog'
import { getColumns, getFileName } from './columns'
import { MediaDetailsDialog } from './media-details-dialog'

const DEFAULT_PAGE_SIZE = 30

interface PageProps {
  title: string
  pathname: string
  resource: string
}

export function MediaPage({ title, pathname, resource }: PageProps) {
  const [deleteTarget, setDeleteTarget] = useState<CloudinaryResource | null>(null)
  const [renameTarget, setRenameTarget] = useState<CloudinaryResource | null>(null)
  const [detailsTarget, setDetailsTarget] = useState<CloudinaryResource | null>(null)
  const [renameInput, setRenameInput] = useState('')

  const [addIsOpen, setAddIsOpen] = useState(false)

  const [replaceDialog, setReplaceDialog] = useState<{
    isOpen: boolean
    target: CloudinaryResource | null
    url: string
    isUploading: boolean
  }>({ isOpen: false, target: null, url: '', isUploading: false })

  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const cursorsRef = useRef<Map<number, string | undefined>>(new Map([[0, undefined]]))

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    setPageIndex(0)
    cursorsRef.current = new Map([[0, undefined]])
  }, [debouncedSearch, pageSize])

  const cursor = cursorsRef.current.get(pageIndex)

  const queryClient = useQueryClient()

  const { data, refetch, isError, error, isFetching, isRefetching } = useQuery({
    queryKey: [resource, debouncedSearch, pageIndex, pageSize],
    queryFn: async () => {
      const result = await mediaApi.getPaginated(cursor, debouncedSearch || undefined, pageSize)
      if (result.next_cursor) {
        cursorsRef.current.set(pageIndex + 1, result.next_cursor)
      }
      return result
    },
    placeholderData: keepPreviousData,
  })

  const pageCount = data?.total_count
    ? Math.ceil(data.total_count / pageSize)
    : data?.next_cursor
      ? pageIndex + 2
      : pageIndex + 1

  const onPaginationChange = useCallback<OnChangeFn<PaginationState>>(
    (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater

      if (newPagination.pageSize !== pageSize) {
        setPageSize(newPagination.pageSize)
        return
      }

      if (!cursorsRef.current.has(newPagination.pageIndex)) return

      setPageIndex(newPagination.pageIndex)
    },
    [pageIndex, pageSize]
  )

  useEffect(() => {
    if (isError && error) {
      console.error('UseQuery Error in Media Manager:', error)
      toast.error(error instanceof Error ? error.message : 'Error loading media')
    }
  }, [isError, error])

  const processUrl = useCallback(
    async (
      url: string,
      targetPublicId?: string,
      displayName?: string,
      isReplace: boolean = false
    ) => {
      if (!url) return

      try {
        if (displayName) {
          const parts = url.split('/')
          const publicIdWithExt = parts[parts.length - 1]
          const publicId = publicIdWithExt.split('.')[0]

          if (displayName) {
            try {
              await mediaApi.rename(publicId, displayName)
            } catch {}
          }

          if (targetPublicId) {
            try {
              await mediaApi.delete(targetPublicId)
            } catch {}
          }
        } else if (targetPublicId) {
          if (targetPublicId) {
            try {
              await mediaApi.delete(targetPublicId)
            } catch {}
          }
        }

        toast.success(
          isReplace || targetPublicId ? 'Media replaced' : 'Media uploaded successfully'
        )
        await new Promise((r) => setTimeout(r, 2000))
        await queryClient.invalidateQueries({ queryKey: [resource], exact: false })
      } catch {
        toast.error('Error processing image')
      }
    },
    [queryClient, resource]
  )

  const handleCancelUpload = async (url: string) => {
    if (url) {
      try {
        const parts = url.split('/')
        const publicIdWithExt = parts[parts.length - 1]
        const publicId = publicIdWithExt.split('.')[0]
        await mediaApi.delete(publicId)
      } catch {
        console.error('Error deleting discarded image')
      }
    }
  }

  const [isRenaming, setIsRenaming] = useState(false)

  const handleRename = async () => {
    if (!renameInput.trim() || !renameTarget) return

    setIsRenaming(true)
    const target = renameTarget
    try {
      await mediaApi.rename(target.public_id, renameInput.trim())
      toast.success('Name updated')
      await new Promise((r) => setTimeout(r, 2000))
      await queryClient.invalidateQueries({ queryKey: [resource], exact: false })
      setRenameTarget(null)
    } catch {
      toast.error('Error updating name')
    } finally {
      setIsRenaming(false)
    }
  }

  const columns = getColumns({
    onDelete: setDeleteTarget,
    onReplace: (img) => {
      setReplaceDialog({ isOpen: true, target: img, url: '', isUploading: false })
    },
    onRename: (img) => {
      setRenameTarget(img)
      setRenameInput(img.display_name || '')
      setIsRenaming(false)
    },
  })

  const deleteDescription =
    deleteTarget?.usedIn && deleteTarget.usedIn.length > 0
      ? `Media in use in: ${deleteTarget.usedIn.join(', ')}. If you delete it, references will be broken.`
      : 'This action cannot be undone. The media will be removed from Cloudinary.'

  return (
    <>
      <TableListLayout
        title={title}
        pathname={pathname}
        resource={resource}
        description="Manage all assets uploaded to Cloudinary"
        columns={columns}
        data={data?.resources}
        searchPlaceholder="Search by name..."
        externalSearch={{ value: searchInput, onChange: setSearchInput }}
        onRowClick={(row) => setDetailsTarget(row)}
        showAddButton={true}
        onCreate={() => setAddIsOpen(true)}
        onRefresh={refetch}
        isFetching={isFetching && !isRefetching}
        isRefetching={isRefetching}
        serverPagination={{
          pageIndex,
          pageSize,
          pageCount,
          totalElements: data?.total_count ?? 0,
          onPaginationChange,
        }}
      />

      <AddMediaDialog
        open={addIsOpen}
        onClose={() => setAddIsOpen(false)}
        onConfirm={async (url, displayName) => {
          await processUrl(url, undefined, displayName)
        }}
      />

      <Dialog
        open={replaceDialog.isOpen}
        onOpenChange={(open) => {
          if (!open && !replaceDialog.isUploading) {
            handleCancelUpload(replaceDialog.url)
            setReplaceDialog({ isOpen: false, target: null, url: '', isUploading: false })
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Replace media</DialogTitle>
            <DialogDescription className="sr-only">
              Enter the new URL to replace the selected image.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <MediaUrlInput
              value={replaceDialog.url}
              onChange={(url) => setReplaceDialog((prev) => ({ ...prev, url }))}
              disabled={replaceDialog.isUploading}
              hideCloudinaryPicker
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                handleCancelUpload(replaceDialog.url)
                setReplaceDialog({ isOpen: false, target: null, url: '', isUploading: false })
              }}
              disabled={replaceDialog.isUploading}
            >
              Cancel
            </Button>
            <Button
              disabled={!replaceDialog.url || replaceDialog.isUploading}
              onClick={async () => {
                if (!replaceDialog.url || !replaceDialog.target) return
                setReplaceDialog((prev) => ({ ...prev, isUploading: true }))
                await processUrl(replaceDialog.url, replaceDialog.target.public_id, undefined, true)
                setReplaceDialog({ isOpen: false, target: null, url: '', isUploading: false })
              }}
            >
              {replaceDialog.isUploading ? (
                <>
                  <Spinner className="size-4" />
                  Replacing
                </>
              ) : (
                'Replace'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {renameTarget && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open && !isRenaming) setRenameTarget(null)
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Set media name</DialogTitle>
              <DialogDescription className="sr-only">
                Define the visible name for the image in the administrator.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative flex aspect-video w-full max-w-sm items-center justify-center overflow-hidden rounded-md border bg-muted/50">
                  {renameTarget.resource_type === 'video' || renameTarget.format === 'mp4' ? (
                    <video
                      src={renameTarget.secure_url}
                      className="max-h-full max-w-full object-contain"
                      muted
                      autoPlay
                      loop
                    />
                  ) : (
                    <img
                      src={renameTarget.secure_url}
                      alt={renameTarget.display_name || 'Preview'}
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rename-display-name">Display Name</Label>
                <Input
                  id="rename-display-name"
                  placeholder="Image name"
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && renameInput.trim() && !isRenaming) {
                      handleRename()
                    }
                  }}
                  autoFocus
                  disabled={isRenaming}
                />
                <p className="text-xs text-muted-foreground">
                  This name appears in the listing and search.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRenameTarget(null)} disabled={isRenaming}>
                Cancel
              </Button>
              <Button disabled={!renameInput.trim() || isRenaming} onClick={handleRename}>
                {isRenaming ? (
                  <>
                    <Spinner className="size-4" />
                    Saving
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {deleteTarget !== null && (
        <DeleteAlertDialog
          open
          onClose={() => setDeleteTarget(null)}
          title={`Delete "${deleteTarget.display_name || getFileName(deleteTarget.public_id)}"?`}
          description={deleteDescription}
          onConfirm={() => mediaApi.delete(deleteTarget.public_id)}
          queryKey={[resource]}
          successMessage="Media deleted successfully"
          errorMessage="Error deleting media"
        />
      )}

      <MediaDetailsDialog
        open={detailsTarget !== null}
        onClose={() => setDetailsTarget(null)}
        media={detailsTarget}
        onDelete={(img) => setDeleteTarget(img)}
        onReplace={(img) =>
          setReplaceDialog({ isOpen: true, target: img, url: '', isUploading: false })
        }
        onRename={(img) => {
          setRenameTarget(img)
          setRenameInput(img.display_name || '')
          setIsRenaming(false)
        }}
      />
    </>
  )
}
