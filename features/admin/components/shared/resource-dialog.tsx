'use client'

import { createContext, useContext, useMemo, useState } from 'react'

import { CirclePlus, Eye, Pencil, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

export type DialogMode = 'detail' | 'edit' | 'create'

export interface FormRegistryData {
  formId: string
  canSubmit: boolean
  isSubmitting: boolean
  mode: DialogMode
  onCancel: () => void
}

interface FormRegistryContextValue {
  register: (data: FormRegistryData) => void
}

const FormRegistryContext = createContext<FormRegistryContextValue | null>(null)

export function useFormRegistry() {
  return useContext(FormRegistryContext)
}

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
} as const

const modeIcons: Record<DialogMode, React.ReactNode> = {
  detail: <Eye className="size-5 text-muted-foreground" />,
  edit: <Pencil className="size-5 text-muted-foreground" />,
  create: <CirclePlus className="size-5 text-muted-foreground" />,
}

function getTitle(mode: DialogMode, resourceName: string, itemName?: string) {
  switch (mode) {
    case 'detail':
      return itemName || `Detail: ${resourceName}`
    case 'edit':
      return `Edit ${resourceName}`
    case 'create':
      return `Create ${resourceName}`
  }
}

interface ResourceDialogProps {
  open: boolean
  onClose: () => void
  onEdit?: () => void
  isLoading?: boolean
  mode: DialogMode
  resourceName: string
  itemName?: string
  description?: string
  size?: keyof typeof sizeClasses
  detailActions?: React.ReactNode
  children: React.ReactNode
}

export function ResourceDialog({
  open,
  onClose,
  onEdit,
  isLoading = false,
  mode,
  resourceName,
  itemName,
  description,
  size = 'md',
  detailActions,
  children,
}: ResourceDialogProps) {
  const [formData, setFormData] = useState<FormRegistryData | null>(null)
  const registryValue = useMemo(() => ({ register: setFormData }), [])

  let footer: React.ReactNode = null

  if (mode === 'detail') {
    if (isLoading) {
      footer = <Skeleton className="h-10 w-24" />
    } else {
      footer = (
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {detailActions}
          {onEdit && (
            <Button onClick={onEdit}>
              <Pencil />
              Edit
            </Button>
          )}
        </>
      )
    }
  } else if (formData) {
    footer = (
      <>
        <Button
          type="button"
          variant="outline"
          onClick={formData.onCancel}
          disabled={formData.isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" form={formData.formId} disabled={!formData.canSubmit}>
          {formData.isSubmitting ? (
            <Spinner className="size-4" />
          ) : formData.mode === 'create' ? (
            <CirclePlus className="size-4" />
          ) : (
            <Save className="size-4" />
          )}
          {formData.isSubmitting
            ? formData.mode === 'create'
              ? 'Creating'
              : 'Saving'
            : formData.mode === 'create'
              ? 'Create'
              : 'Save'}
        </Button>
      </>
    )
  }

  return (
    <FormRegistryContext.Provider value={registryValue}>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent
          className={cn(sizeClasses[size], 'max-h-[90vh] flex flex-col gap-0')}
          aria-describedby={description ? undefined : ''}
        >
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-2">
              {modeIcons[mode]}
              {getTitle(mode, resourceName, itemName)}
            </DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="-mx-4 flex-1 overflow-y-auto px-4 pb-4">{children}</div>
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    </FormRegistryContext.Provider>
  )
}
