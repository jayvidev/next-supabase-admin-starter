'use client'

import { Save } from 'lucide-react'

import { siteSettingsApi } from '@admin/api/site-settings'
import { MediaUrlInput } from '@admin/components/form/media-url-input'
import { useResourceForm } from '@admin/hooks/use-resource-form'
import { generalFormSchema, type GeneralFormValues } from '@admin/schemas/site-settings.schema'

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
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'

import { FormSkeleton } from './form-skeleton'

type SiteSettingsRow = Awaited<ReturnType<typeof siteSettingsApi.getSiteSettings>>

export function GeneralTab() {
  const { form, data, isLoading, isSubmitting, handleSubmit } = useResourceForm<
    SiteSettingsRow,
    GeneralFormValues
  >({
    fetchFn: siteSettingsApi.getSiteSettings,
    schema: generalFormSchema,
    defaultValues: {
      site_name: '',
      tagline: '',
      logo_url: '',
      logo_dark_url: '',
      favicon_url: '',
      contact_email: '',
      contact_phone: '',
      contact_address: '',
    },
    mapDataToForm: (d) => ({
      site_name: d.site_name ?? '',
      tagline: d.tagline ?? '',
      logo_url: d.logo_url ?? '',
      logo_dark_url: d.logo_dark_url ?? '',
      favicon_url: d.favicon_url ?? '',
      contact_email: d.contact_email ?? '',
      contact_phone: d.contact_phone ?? '',
      contact_address: d.contact_address ?? '',
    }),
    onSubmit: async (values) => {
      if (data) await siteSettingsApi.updateSiteSettings(data.id, values)
    },
    queryKey: ['site-settings'],
  })

  if (isLoading) return <FormSkeleton rows={6} />

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="site_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Name *</FormLabel>
                <FormControl>
                  <Input placeholder="My Company" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tagline</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="logo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo (light bg)</FormLabel>
                <FormControl>
                  <MediaUrlInput value={field.value ?? ''} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logo_dark_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo (dark bg)</FormLabel>
                <FormControl>
                  <MediaUrlInput value={field.value ?? ''} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="favicon_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favicon</FormLabel>
              <FormControl>
                <MediaUrlInput value={field.value ?? ''} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="contact_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
            {isSubmitting ? <Spinner className="size-4" /> : <Save className="size-4" />}
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
