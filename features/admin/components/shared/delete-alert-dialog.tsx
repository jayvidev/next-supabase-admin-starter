'use client'

import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { revalidateSiteCache } from '@admin/actions/revalidate'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'

interface DeleteAlertDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description: string
  onConfirm: () => Promise<void>
  queryKey?: string[]
  itemId?: number
  successMessage?: string
  errorMessage?: string
}

export function DeleteAlertDialog({
  open,
  onClose,
  title,
  description,
  onConfirm,
  queryKey,
  itemId,
  successMessage = 'Deleted successfully',
  errorMessage = 'Error deleting',
}: DeleteAlertDialogProps) {
  const queryClient = useQueryClient()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDeleting(true)
    try {
      await onConfirm()
      toast.success(successMessage)
      if (queryKey && itemId !== undefined) {
        queryClient.setQueriesData<
          { id: number }[] | { content: { id: number }[]; [key: string]: unknown }
        >({ queryKey }, (currentData) => {
          if (!currentData) return currentData
          if (Array.isArray(currentData)) {
            return currentData.filter((item) => item.id !== itemId)
          }
          if ('content' in currentData && Array.isArray(currentData.content)) {
            return {
              ...currentData,
              content: currentData.content.filter((item) => item.id !== itemId),
            }
          }
          return currentData
        })
      } else if (queryKey) {
        queryClient.invalidateQueries({ queryKey })
      }
      revalidateSiteCache().catch(() => {})
      onClose()
    } catch {
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle className="break-all">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} variant="destructive" disabled={isDeleting}>
            {isDeleting ? <Spinner /> : <Trash2 />}
            {isDeleting ? 'Deleting' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
