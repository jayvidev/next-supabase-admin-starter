'use client'

import { CreditCard, Info, Layout, Save } from 'lucide-react'

import { revalidateLandingCache } from '@admin/actions/revalidate'
import { siteSettingsApi } from '@admin/api/site-settings'
import { MediaUrlInput } from '@admin/components/form/media-url-input'
import { FormPageLayout } from '@admin/components/shared/form-page-layout'
import { FormSection } from '@admin/components/shared/form-section'
import { useResourceForm } from '@admin/hooks/use-resource-form'
import { footerFormSchema, type FooterFormValues } from '@admin/schemas/site-settings.schema'

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
import { Textarea } from '@/components/ui/textarea'
import type { Json } from '@/lib/supabase/database.types'

import { FooterColumnsFields } from './footer-columns-fields'

type FooterSettingsRow = Awaited<ReturnType<typeof siteSettingsApi.getFooterSettings>>

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

export function FooterPage({ pathname }: { pathname: string }) {
  const { form, data, isLoading, isSubmitting, handleSubmit } = useResourceForm<
    FooterSettingsRow,
    FooterFormValues
  >({
    fetchFn: siteSettingsApi.getFooterSettings,
    schema: footerFormSchema,
    defaultValues: {
      logo_url: '',
      about_text: '',
      columns: [],
      legal_links: [],
      copyright_text: '',
    },
    mapDataToForm: (d) => ({
      logo_url: d.logo_url ?? '',
      about_text: d.about_text ?? '',
      columns: parseJson<FooterFormValues['columns']>(d.columns),
      legal_links: parseJson<FooterFormValues['legal_links']>(d.legal_links),
      copyright_text: d.copyright_text ?? '',
    }),
    onSubmit: async (values) => {
      if (data) {
        await siteSettingsApi.updateFooterSettings(data.id, {
          ...values,
          columns: JSON.stringify(values.columns) as unknown as Json,
          legal_links: JSON.stringify(values.legal_links) as unknown as Json,
        })
        await revalidateLandingCache().catch(() => {})
      }
    },
    queryKey: ['footer-settings'],
  })

  if (isLoading) {
    return (
      <FormPageLayout title="Footer" description="Configure your site footer" pathname={pathname}>
        <div className="space-y-8 pt-4">
          <FormSection title="Brand & Info" icon={Info} columns={1}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </FormSection>

          <FormSection title="Navigation Columns" icon={Layout} columns={1}>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-lg border p-4 space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-7 w-7" />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="border-t pt-4 space-y-4">
                      <Skeleton className="h-4 w-20" />
                      <div className="rounded-lg border p-4 space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-7 w-7" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                          <Skeleton className="h-6 w-6" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Skeleton className="h-3 w-10" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-3 w-10" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FormSection>

          <FormSection title="Bottom Bar" icon={CreditCard} columns={1}>
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
    <FormPageLayout title="Footer" description="Configure your site footer" pathname={pathname}>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8 pt-4">
          <FormSection title="Brand & Info" icon={Info} columns={1}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Footer Logo</FormLabel>
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
              <FormField
                control={form.control}
                name="about_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        {...field}
                        placeholder="e.g. Precision · Design · Installation..."
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>

          <FormSection title="Navigation Columns" icon={Layout} columns={1}>
            <FooterColumnsFields form={form} />
          </FormSection>

          <FormSection title="Bottom Bar" icon={CreditCard} columns={1}>
            <FormField
              control={form.control}
              name="copyright_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Copyright Text</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. © 2026 My Company LLC" {...field} />
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
