'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { type DefaultValues, type FieldValues, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { ZodType } from 'zod'

import { revalidateLandingCache } from '@admin/actions/revalidate'

interface UseResourceFormOptions<TData, TFormValues extends FieldValues, TListItem = unknown> {
  fetchFn?: () => Promise<TData>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ZodType<TFormValues, any, any>
  defaultValues: DefaultValues<TFormValues>
  mapDataToForm?: (data: TData) => Partial<TFormValues>
  onSubmit: (values: TFormValues) => Promise<TListItem | void>
  onSuccess?: () => void
  queryKey?: string[]
  successMessage?: string
  errorMessage?: string
}

export function useResourceForm<
  TData = unknown,
  TFormValues extends FieldValues = FieldValues,
  TListItem = unknown,
>({
  fetchFn,
  schema,
  defaultValues,
  mapDataToForm,
  onSubmit,
  onSuccess,
  queryKey,
  successMessage = 'Saved successfully',
  errorMessage = 'Error saving',
}: UseResourceFormOptions<TData, TFormValues, TListItem>) {
  const queryClient = useQueryClient()
  const [data, setData] = useState<TData | null>(null)
  const [isLoading, setIsLoading] = useState(!!fetchFn)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultValuesRef = useRef(defaultValues)
  const mapDataToFormRef = useRef(mapDataToForm)
  const fetchFnRef = useRef(fetchFn)

  useEffect(() => {
    defaultValuesRef.current = defaultValues
    mapDataToFormRef.current = mapDataToForm
    fetchFnRef.current = fetchFn
  })

  const form = useForm<TFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues,
  })

  const fetchData = useCallback(async () => {
    if (!fetchFnRef.current) return
    try {
      setIsLoading(true)
      setError(null)
      const result = await fetchFnRef.current()
      setData(result)

      if (mapDataToFormRef.current && result) {
        const formValues = mapDataToFormRef.current(result)
        form.reset({ ...defaultValuesRef.current, ...formValues } as TFormValues)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error loading data'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [form])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSubmit = form.handleSubmit(
    async (values) => {
      setIsSubmitting(true)
      try {
        await onSubmit(values as TFormValues)
        toast.success(successMessage)
        form.reset(values as TFormValues)

        if (queryKey) {
          queryClient.invalidateQueries({ queryKey })
        }

        revalidateLandingCache().catch(() => {})

        onSuccess?.()
      } catch (err) {
        const message = err instanceof Error ? err.message : errorMessage
        toast.error(message)
      } finally {
        setIsSubmitting(false)
      }
    },
    (errors) => {
      console.error('Validation Errors:', errors)
    }
  )

  return { form, data, isLoading, isSubmitting, error, handleSubmit }
}
