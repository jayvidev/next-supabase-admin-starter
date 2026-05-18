'use client'

import { Image, Menu, MousePointerClick, Save } from 'lucide-react'

import { revalidateLandingCache } from '@admin/actions/revalidate'
import { siteSettingsApi } from '@admin/api/site-settings'
import { MediaUrlInput } from '@admin/components/form/media-url-input'
import { FormPageLayout } from '@admin/components/shared/form-page-layout'
import { FormSection } from '@admin/components/shared/form-section'
import { useResourceForm } from '@admin/hooks/use-resource-form'
import { headerFormSchema, type HeaderFormValues } from '@admin/schemas/site-settings.schema'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import type { Json } from '@/lib/supabase/database.types'

import { HeaderLinksFields } from './header-links-fields'
import { TargetInput } from './target-input'

type HeaderSettingsRow = Awaited<ReturnType<typeof siteSettingsApi.getHeaderSettings>>

function parseJson<T>(value: Json): T {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return [] as unknown as T
    }
  }
  return (value as T) || ([] as unknown as T)
}

export function HeaderPage({ pathname }: { pathname: string }) {
  const { form, data, isLoading, isSubmitting, handleSubmit } = useResourceForm<
    HeaderSettingsRow,
    HeaderFormValues
  >({
    fetchFn: siteSettingsApi.getHeaderSettings,
    schema: headerFormSchema,
    defaultValues: {
      logo_url: '',
      nav_links: [],
      cta_label: '',
      cta_label_mobile: '',
      cta_url: '',
    },
    mapDataToForm: (d) => ({
      logo_url: d.logo_url ?? '',
      nav_links: parseJson<HeaderFormValues['nav_links']>(d.nav_links),
      cta_label: d.cta_label ?? '',
      cta_label_mobile: d.cta_label_mobile ?? '',
      cta_url: d.cta_url ?? '',
    }),
    onSubmit: async (values) => {
      if (data) {
        const normalized = values.nav_links.map((link) => ({
          label: link.label,
          href: link.href,
          is_dropdown: false,
          children: [],
        }))
        await siteSettingsApi.updateHeaderSettings(data.id, {
          ...values,
          nav_links: JSON.stringify(normalized) as unknown as Json,
        })
        await revalidateLandingCache().catch(() => {})
      }
    },
    queryKey: ['header-settings'],
  })

  if (isLoading) {
    return (
      <FormPageLayout title="Header" description="Configure your site header" pathname={pathname}>
        <div className="space-y-8 pt-4">
          <FormSection title="Brand" icon={Image} columns={1}>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
          </FormSection>

          <FormSection title="Navigation Links" icon={Menu} columns={1}>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border p-4 space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-7 w-7" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FormSection>

          <FormSection title="Call to Action" icon={MousePointerClick} columns={2}>
            <div className="space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
          </FormSection>
        </div>
      </FormPageLayout>
    )
  }

  return (
    <FormPageLayout title="Header" description="Configure your site header" pathname={pathname}>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8 pt-4">
          <FormSection title="Brand" icon={Image} columns={1}>
            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Header Logo</FormLabel>
                  <FormControl>
                    <MediaUrlInput
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      allowedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Navigation Links" icon={Menu} columns={1}>
            <HeaderLinksFields form={form} />
          </FormSection>

          <FormSection title="Call to Action" icon={MousePointerClick} columns={2}>
            <FormField
              control={form.control}
              name="cta_label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Label</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Get a free quote" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cta_label_mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Mobile Label</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Quote" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cta_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Target</FormLabel>
                  <FormControl>
                    <TargetInput value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting || !form.formState.isDirty} size="lg">
              {isSubmitting ? <Spinner className="size-4" /> : <Save className="size-4" />}
              Save Configuration
            </Button>
          </div>
        </form>
      </Form>
    </FormPageLayout>
  )
}
