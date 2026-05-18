'use client'

import { useEffect, useId, useState } from 'react'

import { mediaApi } from '@admin/api/media'
import { MediaUrlInput } from '@admin/components/form/media-url-input'
import { ResourceDialog, useFormRegistry } from '@admin/components/shared/resource-dialog'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface UploadFormProps {
  url: string
  displayName: string
  isUploading: boolean
  onUrlChange: (url: string, baseName: string) => void
  onDisplayNameChange: (name: string) => void
  onSubmit: () => Promise<void>
  onCancel: () => void
}

function UploadForm({
  url,
  displayName,
  isUploading,
  onUrlChange,
  onDisplayNameChange,
  onSubmit,
  onCancel,
}: UploadFormProps) {
  const formId = useId()
  const registry = useFormRegistry()
  const canSubmit = !!url && !!displayName.trim() && !isUploading

  useEffect(() => {
    registry?.register({ formId, canSubmit, isSubmitting: isUploading, mode: 'create', onCancel })
  }, [registry, formId, canSubmit, isUploading, onCancel])

  return (
    <form
      id={formId}
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault()
        if (canSubmit) await onSubmit()
      }}
    >
      <MediaUrlInput
        value={url}
        onChange={(newUrl, file) => {
          const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : ''
          onUrlChange(newUrl, baseName)
        }}
        disabled={isUploading}
        hideCloudinaryPicker
      />
      {url && (
        <div className="space-y-2">
          <Label htmlFor="upload-display-name">Display Name</Label>
          <Input
            id="upload-display-name"
            placeholder="Media name"
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            autoFocus
            disabled={isUploading}
          />
          <p className="text-xs text-muted-foreground">
            This name appears in the listing and search.
          </p>
        </div>
      )}
    </form>
  )
}

interface AddMediaDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (url: string, displayName: string) => Promise<void>
}

export function AddMediaDialog({ open, onClose, onConfirm }: AddMediaDialogProps) {
  const [url, setUrl] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleClose = async () => {
    if (isUploading) return
    if (url) {
      try {
        const parts = url.split('/')
        const publicId = parts[parts.length - 1].split('.')[0]
        await mediaApi.delete(publicId)
      } catch {
        console.error('Error deleting discarded image')
      }
    }
    setUrl('')
    setDisplayName('')
    onClose()
  }

  const handleSubmit = async () => {
    setIsUploading(true)
    try {
      await onConfirm(url, displayName.trim())
      setUrl('')
      setDisplayName('')
      onClose()
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <ResourceDialog open={open} onClose={handleClose} mode="create" resourceName="media">
      <UploadForm
        url={url}
        displayName={displayName}
        isUploading={isUploading}
        onUrlChange={(newUrl, baseName) => {
          setUrl(newUrl)
          setDisplayName((prev) => prev || baseName)
        }}
        onDisplayNameChange={setDisplayName}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </ResourceDialog>
  )
}
