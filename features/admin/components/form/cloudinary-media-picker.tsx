'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Check, ImageIcon, Search, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { config } from '@/config'
import { type CloudinaryResource, listImages, uploadImage } from '@/lib/cloudinary'
import { cn } from '@/lib/utils'

const MAX_SIZE = 2 * 1024 * 1024
const DEFAULT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
]

interface CloudinaryMediaPickerProps {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
  allowedTypes?: string[]
}

export function CloudinaryMediaPicker({
  open,
  onClose,
  onSelect,
  allowedTypes = DEFAULT_TYPES,
}: CloudinaryMediaPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<CloudinaryResource[]>([])
  const [filteredImages, setFilteredImages] = useState<CloudinaryResource[]>([])
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isOnlyVideo = allowedTypes.every((t) => t.includes('video'))
  const hasVideo = allowedTypes.some((t) => t.includes('video'))
  const allowsImage = allowedTypes.some((t) => t.includes('image'))
  const labelPrefix = isOnlyVideo ? 'video' : hasVideo && allowsImage ? 'media' : 'image'

  const fetchImages = useCallback(async (cursor?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await listImages(cursor, 35, config.cloudinary.uploadPreset)
      setImages((prev) => (cursor ? [...prev, ...result.resources] : result.resources))
      setNextCursor(result.next_cursor)
      setHasMore(!!result.next_cursor)
    } catch {
      setError('Could not load media. Check Cloudinary configuration in environment variables.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setImages([])
      setSelectedUrl(null)
      setSearchQuery('')
      setNextCursor(undefined)
      fetchImages()
    }
  }, [open, fetchImages])

  useEffect(() => {
    let filtered = images

    const allowsImages = allowedTypes.some((t) => t.includes('image'))
    const allowsVideos = allowedTypes.some((t) => t.includes('video'))

    if (allowsImages && !allowsVideos) {
      filtered = filtered.filter((img) => img.resource_type === 'image')
    } else if (allowsVideos && !allowsImages) {
      filtered = filtered.filter((img) => img.resource_type === 'video')
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (img) =>
          img.public_id.toLowerCase().includes(q) ||
          (img.display_name && img.display_name.toLowerCase().includes(q))
      )
    }

    setFilteredImages(filtered)
  }, [searchQuery, images, allowedTypes])

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl)
      onClose()
    }
  }

  const handleLoadMore = () => {
    if (nextCursor) fetchImages(nextCursor)
  }

  const processAndUpload = useCallback(
    async (file: File) => {
      setError(null)

      if (!allowedTypes.includes(file.type)) {
        setError('File type not allowed')
        return
      }

      setIsUploading(true)
      const fileToUpload = file

      try {
        if (file.size > MAX_SIZE) {
          setError('File is too large')
          setIsUploading(false)
          return
        }

        const { secure_url: url } = await uploadImage(fileToUpload)
        // Wait a bit for Cloudinary to process
        await new Promise((r) => setTimeout(r, 2000))
        await fetchImages()
        setSelectedUrl(url)
      } catch {
        setError(`Error uploading ${labelPrefix}. Please try again.`)
      } finally {
        setIsUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    },
    [allowedTypes, fetchImages, labelPrefix]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processAndUpload(file)
  }

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileName = (publicId: string) => {
    const parts = publicId.split('/')
    return parts[parts.length - 1]
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent
        className="flex max-h-[92vh] w-full max-w-[90vw] sm:max-w-[90vw] xl:max-w-7xl flex-col"
        aria-describedby=""
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="size-5 text-muted-foreground" />
            Select {labelPrefix}
          </DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Spinner className="size-4" />
                Uploading
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Upload new
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedTypes.join(',')}
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {error && (
            <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {isLoading && images.length === 0 ? (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <ImageIcon className="size-10 opacity-30" />
              <p className="text-sm">
                {searchQuery
                  ? `No ${labelPrefix}s match your search`
                  : `No ${labelPrefix}s uploaded yet`}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
                {filteredImages.map((img) => {
                  const isSelected = selectedUrl === img.secure_url
                  const imgIsVideo = img.resource_type === 'video' || img.format === 'mp4'
                  return (
                    <button
                      key={img.public_id}
                      type="button"
                      onClick={() => setSelectedUrl(isSelected ? null : img.secure_url)}
                      className={cn(
                        'group relative aspect-square overflow-hidden rounded-lg border-2 bg-muted/40 transition-all cursor-pointer',
                        isSelected
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-transparent hover:border-muted-foreground/30'
                      )}
                    >
                      {imgIsVideo ? (
                        <div className="relative flex size-full items-center justify-center bg-black">
                          <img
                            src={img.secure_url.replace(/\.[^/.]+$/, '.jpg')}
                            alt={img.display_name || getFileName(img.public_id)}
                            className="size-full object-cover opacity-60 transition-transform group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex size-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/50">
                              <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-4 text-white"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[7px] font-bold tracking-wider text-white uppercase">
                            Video
                          </span>
                        </div>
                      ) : (
                        <img
                          src={img.secure_url}
                          alt={img.display_name || getFileName(img.public_id)}
                          className="size-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      )}

                      <div
                        className={cn(
                          'absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-black/70 to-transparent px-2 pb-1.5 pt-4 text-left transition-transform group-hover:translate-y-0',
                          isSelected && 'translate-y-0'
                        )}
                      >
                        <p className="truncate text-[10px] font-medium text-white">
                          {img.display_name || getFileName(img.public_id)}
                        </p>
                        <p className="text-[9px] text-white/70">{formatBytes(img.bytes)}</p>
                      </div>

                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-primary shadow-md">
                          <Check className="size-3 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {hasMore && !searchQuery && (
                <div className="mt-6 flex justify-center pb-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner className="mr-2" />
                        Loading
                      </>
                    ) : (
                      'Load more'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="justify-between sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedUrl
              ? `1 ${labelPrefix} selected`
              : `${filteredImages.length} ${labelPrefix}${filteredImages.length === 1 ? '' : 's'}`}
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" size="sm" disabled={!selectedUrl} onClick={handleConfirm}>
              <Check className="size-4" />
              Select
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
