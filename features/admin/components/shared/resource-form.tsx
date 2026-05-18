'use client'

import { useEffect, useId } from 'react'

import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { Form } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import type { DialogMode } from './resource-dialog'
import { useFormRegistry } from './resource-dialog'

interface ResourceFormProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>
  isLoading?: boolean
  isSubmitting: boolean
  error?: string | null
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  onCancel: () => void
  children: React.ReactNode
  columns?: 1 | 2
  mode?: DialogMode
}

export function ResourceForm<TFormValues extends FieldValues>({
  form,
  isLoading = false,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
  children,
  columns = 1,
  mode = 'edit',
}: ResourceFormProps<TFormValues>) {
  const formId = useId()
  const canSubmit = mode === 'create' ? !isSubmitting : !isSubmitting && form.formState.isDirty
  const registry = useFormRegistry()

  useEffect(() => {
    registry?.register({ formId, canSubmit, isSubmitting, mode, onCancel })
  }, [registry, formId, canSubmit, isSubmitting, mode, onCancel])

  if (error) {
    return <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
  }

  if (isLoading) {
    return (
      <div className={cn('grid gap-4', columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1')}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        id={formId}
        className={cn('grid gap-4', columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1')}
        onSubmit={onSubmit}
      >
        {children}
      </form>
    </Form>
  )
}
