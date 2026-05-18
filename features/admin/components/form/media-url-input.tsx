'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { ImageIcon, Upload, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { CloudinaryMediaPicker } from '@/features/admin/components/form/cloudinary-media-picker'
import { isCloudinaryConfigured, uploadImage } from '@/lib/cloudinary'
import { cn } from '@/lib/utils'

const MAX_SIZE = 10 * 1024 * 1024
const DEFAULT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
]

interface MediaUrlInputProps {
  value: string
  onChange: (value: string, file?: File) => void
  className?: string
  disabled?: boolean
  allowedTypes?: string[]
  hideCloudinaryPicker?: boolean
}

export function MediaUrlInput({
  value,
  onChange,
  className,
  disabled = false,
  allowedTypes = DEFAULT_TYPES,
  hideCloudinaryPicker = false,
}: MediaUrlInputProps) {
  const cloudinaryEnabled = isCloudinaryConfigured()
  const effectiveDisabled = disabled || !cloudinaryEnabled

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const objectUrlRef = useRef<string | null>(null)

  const isOnlyVideo = allowedTypes.every((t) => t.includes('video'))
  const hasVideo = allowedTypes.some((t) => t.includes('video'))
  const allowsImage = allowedTypes.some((t) => t.includes('image'))
  const labelPrefix = isOnlyVideo ? 'video' : hasVideo && allowsImage ? 'media' : 'image'

  const displayUrl = previewUrl || value || ''
  const hasImage = displayUrl.trim().length > 0
  const isVideoUrl =
    displayUrl.toLowerCase().match(/\.(mp4|webm|mov|ogg)$/) || displayUrl.includes('/video/upload/')

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  const uploadToCloudinary = useCallback(
    async (file: File) => {
      setIsUploading(true)
      setError(null)

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
      const localUrl = URL.createObjectURL(file)
      objectUrlRef.current = localUrl
      setPreviewUrl(localUrl)

      try {
        const { secure_url: url } = await uploadImage(file)
        onChange(url, file)
        setPreviewUrl(null)

        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current)
          objectUrlRef.current = null
        }
      } catch {
        setError(`Error uploading ${labelPrefix}. Please try again.`)
        setPreviewUrl(null)
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current)
          objectUrlRef.current = null
        }
      } finally {
        setIsUploading(false)
      }
    },
    [onChange, labelPrefix]
  )

  const getFormatText = () => {
    const formats = allowedTypes.map((t) =>
      t.split('/')[1].toUpperCase().replace('JPEG', 'JPG').replace('SVG+XML', 'SVG')
    )
    if (formats.length <= 3) return formats.join(', ')
    return `${formats.slice(0, 3).join(', ')}...`
  }

  const processFile = useCallback(
    async (file: File) => {
      setError(null)

      if (!allowedTypes.includes(file.type)) {
        setError('File type not allowed')
        return
      }

      const fileToUpload = file
      setIsUploading(true)

      try {
        if (file.size > MAX_SIZE) {
          setError('File is too large (max 10MB)')
          setIsUploading(false)
          return
        }
      } catch {
        setError('Error processing file')
        setIsUploading(false)
        return
      }

      uploadToCloudinary(fileToUpload)
    },
    [uploadToCloudinary, allowedTypes]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleRemove = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setPreviewUrl(null)
    onChange('')
    setError(null)
  }

  const handlePickerSelect = (url: string) => {
    onChange(url)
    setPreviewUrl(null)
    setError(null)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div
        onDragOver={effectiveDisabled ? undefined : handleDragOver}
        onDragLeave={effectiveDisabled ? undefined : handleDragLeave}
        onDrop={effectiveDisabled ? undefined : handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
          hasImage ? 'bg-muted/30 p-2' : 'border-muted-foreground/25 bg-muted/50 py-4',
          isDragging && 'border-primary bg-primary/5',
          effectiveDisabled && 'opacity-60',
          'min-h-40'
        )}
      >
        {hasImage ? (
          <>
            {isVideoUrl ? (
              <video
                src={displayUrl || undefined}
                className={cn('max-h-35 rounded-md object-contain', isUploading && 'opacity-50')}
                muted
                autoPlay
                loop
              />
            ) : displayUrl ? (
              <img
                src={displayUrl}
                alt="Preview"
                className={cn('max-h-35 rounded-md object-contain', isUploading && 'opacity-50')}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            ) : null}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-md bg-background/80 px-3 py-1.5 text-sm">
                  <Spinner />
                  Uploading
                </div>
              </div>
            )}
            {!isUploading && !effectiveDisabled && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 size-7"
                onClick={handleRemove}
              >
                <X className="size-4" />
              </Button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="rounded-lg border bg-muted p-2.5">
              <ImageIcon className="size-6 opacity-50" />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium">
                {!cloudinaryEnabled
                  ? 'Cloudinary not configured'
                  : disabled
                    ? `No ${labelPrefix}`
                    : isDragging
                      ? `Drop ${labelPrefix} here`
                      : `Drag ${labelPrefix} here`}
              </p>
              {!effectiveDisabled && (
                <p className="text-xs text-muted-foreground/70">{getFormatText()}</p>
              )}
            </div>
            {!effectiveDisabled && (
              <div className="flex gap-2">
                {!hideCloudinaryPicker && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPickerOpen(true)}
                  >
                    <ImageIcon className="size-4" />
                    Choose {labelPrefix}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="size-4" />
                  {hideCloudinaryPicker ? `Upload ${labelPrefix}` : 'Upload new'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {hasImage && !effectiveDisabled && !isUploading && !hideCloudinaryPicker && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setPickerOpen(true)}
        >
          <ImageIcon className="size-4" />
          Change {labelPrefix}
        </Button>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        className="hidden"
        disabled={effectiveDisabled}
        onChange={handleFileChange}
      />

      {!hideCloudinaryPicker && (
        <CloudinaryMediaPicker
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={handlePickerSelect}
          allowedTypes={allowedTypes}
        />
      )}
    </div>
  )
}
