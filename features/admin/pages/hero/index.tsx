'use client'

import { DragDropProvider } from '@dnd-kit/react'
import {
  GripVertical,
  Image,
  MousePointerClick,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Type,
} from 'lucide-react'
import { useFieldArray } from 'react-hook-form'

import { type Hero, heroApi } from '@admin/api/hero'
import { sectionHeadersApi } from '@admin/api/section-headers'
import { LinkInput } from '@admin/components/form/link-input'
import { MediaUrlInput } from '@admin/components/form/media-url-input'
import { getSortableData, SortableItem } from '@admin/components/form/sortable-item'
import { FormPageLayout } from '@admin/components/shared/form-page-layout'
import { FormSection } from '@admin/components/shared/form-section'
import { useResourceForm } from '@admin/hooks/use-resource-form'
import { type HeroFormValues, heroSchema } from '@admin/schemas/hero.schema'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { Json, SectionHeader } from '@/lib/supabase/database.types'

const defaultValues: HeroFormValues = {
  title: '',
  pill_text: '',
  pill_text_mobile: '',
  bg_type: 'image',
  background_image_url: '',
  video_url: '',
  video_poster_url: '',
  buttons: [],
  badges: [],
}

interface PageProps {
  title: string
  pathname: string
}

export function HeroPage({ title, pathname }: PageProps) {
  const fetchData = async (): Promise<{ hero: Hero; header: SectionHeader }> => {
    const [hero, header] = await Promise.all([heroApi.get(), sectionHeadersApi.getByKey('hero')])

    if (!header) {
      throw new Error('Hero section header not found in database')
    }

    return { hero, header }
  }

  const { form, data, isLoading, isSubmitting, handleSubmit } = useResourceForm<
    { hero: Hero; header: SectionHeader },
    HeroFormValues
  >({
    fetchFn: fetchData,
    schema: heroSchema,
    defaultValues,
    mapDataToForm: (d) => {
      const buttons = (
        Array.isArray(d.hero.buttons) ? d.hero.buttons : []
      ) as HeroFormValues['buttons']
      const badges = (Array.isArray(d.hero.badges) ? d.hero.badges : []) as HeroFormValues['badges']

      return {
        title: d.header.title ?? '',
        pill_text: d.hero.pill_text ?? '',
        pill_text_mobile: d.hero.pill_text_mobile ?? '',
        bg_type: (d.hero.bg_type as 'image' | 'video') ?? 'image',
        background_image_url: d.hero.background_image_url ?? '',
        video_url: d.hero.video_url ?? '',
        video_poster_url: d.hero.video_poster_url ?? '',
        buttons,
        badges,
      }
    },
    onSubmit: async (values) => {
      if (!data) return
      const { title, ...heroValues } = values
      await Promise.all([
        heroApi.update(data.hero.id, {
          ...heroValues,
          buttons: heroValues.buttons as unknown as Json,
          badges: heroValues.badges as unknown as Json,
        }),
        sectionHeadersApi.upsert('hero', { title }),
      ])
    },
    queryKey: ['hero-full'],
    successMessage: 'Hero configuration saved successfully',
  })

  const buttonFields = useFieldArray({ control: form.control, name: 'buttons' })
  const badgeFields = useFieldArray({ control: form.control, name: 'badges' })

  if (isLoading) {
    return (
      <FormPageLayout
        title={title}
        pathname={pathname}
        description="Configure your hero section: title, background, buttons and badges."
      >
        <div className="space-y-8 pt-4">
          {/* Content Skeleton */}
          <FormSection title="Hero Content" icon={Type} columns={1}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </FormSection>

          {/* Background Skeleton */}
          <FormSection title="Background Media" icon={Image} columns={1}>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
          </FormSection>

          {/* Buttons Skeleton */}
          <FormSection title="Action Buttons" icon={MousePointerClick} columns={1}>
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
                    <Skeleton className="h-10 w-full" />
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FormSection>

          {/* Badges Skeleton */}
          <FormSection title="Trust Badges" icon={ShieldCheck} columns={1}>
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
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </FormSection>
        </div>
      </FormPageLayout>
    )
  }

  return (
    <FormPageLayout
      title={title}
      pathname={pathname}
      description="Configure your hero section: title, background, buttons and badges."
    >
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8 pt-4">
          {/* Main Content Section */}
          <FormSection title="Hero Content" icon={Type} columns={1}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Heading (Title)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Your space, transformed in glass."
                      className="text-base font-medium resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="pill_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pill Text (Desktop)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Full informative sentence" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pill_text_mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pill Text (Mobile)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Short version" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>

          {/* Background Section */}
          <FormSection title="Background Media" icon={Image} columns={1}>
            <Tabs
              defaultValue={form.getValues('bg_type')}
              onValueChange={(v) =>
                form.setValue('bg_type', v as 'image' | 'video', { shouldDirty: true })
              }
            >
              <TabsList className="mb-4">
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
              </TabsList>
              <TabsContent value="image">
                <FormField
                  control={form.control}
                  name="background_image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MediaUrlInput value={field.value ?? ''} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="video" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="video_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-muted-foreground">Video File</FormLabel>
                        <FormControl>
                          <MediaUrlInput
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            allowedTypes={['video/mp4', 'video/webm']}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="video_poster_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-muted-foreground">
                          Poster (Thumbnail)
                        </FormLabel>
                        <FormControl>
                          <MediaUrlInput value={field.value ?? ''} onChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </FormSection>

          {/* Buttons Section */}
          <FormSection title="Action Buttons" icon={MousePointerClick} columns={1}>
            <div className="space-y-4">
              <DragDropProvider
                onDragEnd={(event) => {
                  if (event.canceled) return
                  const { source } = event.operation
                  if (!source) return
                  const sortable = getSortableData(source)
                  if (!sortable || sortable.initialIndex === sortable.index) return
                  buttonFields.move(sortable.initialIndex, sortable.index)
                }}
              >
                <div className="space-y-4">
                  {buttonFields.fields.map((field, index) => (
                    <SortableItem key={field.id} id={field.id} index={index}>
                      {({ handleRef }) => (
                        <div className="rounded-lg border bg-muted/5 p-4 space-y-4">
                          <div className="flex items-center justify-between border-b border-muted/50 pb-2">
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                ref={handleRef}
                                className="size-8 cursor-grab touch-none active:cursor-grabbing"
                              >
                                <GripVertical className="size-4" />
                              </Button>
                              <span className="text-sm font-medium text-muted-foreground">
                                Button {index + 1}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="size-7"
                              onClick={() => buttonFields.remove(index)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                            <FormField
                              control={form.control}
                              name={`buttons.${index}.label`}
                              render={({ field: f }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-muted-foreground">
                                    Label
                                  </FormLabel>
                                  <FormControl>
                                    <Input {...f} placeholder="Text" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <FormField
                                control={form.control}
                                name={`buttons.${index}.variant`}
                                render={({ field: f }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs text-muted-foreground">
                                      Style
                                    </FormLabel>
                                    <Select onValueChange={f.onChange} defaultValue={f.value}>
                                      <FormControl>
                                        <SelectTrigger className="w-full">
                                          <SelectValue />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="primary">Primary</SelectItem>
                                        <SelectItem value="outline">Outline</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`buttons.${index}.url`}
                                render={({ field: f }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs text-muted-foreground">
                                      Target
                                    </FormLabel>
                                    <FormControl>
                                      <LinkInput value={f.value} onChange={f.onChange} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </SortableItem>
                  ))}
                </div>
              </DragDropProvider>

              {buttonFields.fields.length < 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full h-12"
                  onClick={() =>
                    buttonFields.append({
                      label: 'New Button',
                      url: '#contact',
                      variant: 'primary',
                    })
                  }
                >
                  <Plus className="size-3.5 mr-2" />
                  Add button
                </Button>
              )}
            </div>
          </FormSection>

          {/* Badges Section */}
          <FormSection title="Trust Badges" icon={ShieldCheck} columns={1}>
            <div className="space-y-4">
              <DragDropProvider
                onDragEnd={(event) => {
                  if (event.canceled) return
                  const { source } = event.operation
                  if (!source) return
                  const sortable = getSortableData(source)
                  if (!sortable || sortable.initialIndex === sortable.index) return
                  badgeFields.move(sortable.initialIndex, sortable.index)
                }}
              >
                <div className="space-y-4">
                  {badgeFields.fields.map((field, index) => (
                    <SortableItem key={field.id} id={field.id} index={index}>
                      {({ handleRef }) => (
                        <div className="rounded-lg border bg-muted/5 p-4 space-y-4">
                          <div className="flex items-center justify-between border-b border-muted/50 pb-2">
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                ref={handleRef}
                                className="size-8 cursor-grab touch-none active:cursor-grabbing"
                              >
                                <GripVertical className="size-4" />
                              </Button>
                              <span className="text-sm font-medium text-muted-foreground">
                                Badge {index + 1}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="size-7"
                              onClick={() => badgeFields.remove(index)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                            <FormField
                              control={form.control}
                              name={`badges.${index}.text`}
                              render={({ field: f }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-muted-foreground">
                                    Text
                                  </FormLabel>
                                  <FormControl>
                                    <Input {...f} placeholder="Badge text" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`badges.${index}.icon_url`}
                              render={({ field: f }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-muted-foreground">
                                    Icon
                                  </FormLabel>
                                  <FormControl>
                                    <MediaUrlInput
                                      value={f.value}
                                      onChange={f.onChange}
                                      allowedTypes={[
                                        'image/jpeg',
                                        'image/png',
                                        'image/webp',
                                        'image/svg+xml',
                                      ]}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </SortableItem>
                  ))}
                </div>
              </DragDropProvider>

              {badgeFields.fields.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full h-12"
                  onClick={() => badgeFields.append({ text: 'New Badge', icon_url: '' })}
                >
                  <Plus className="size-3.5 mr-2" />
                  Add trust badge
                </Button>
              )}
            </div>
          </FormSection>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting || !form.formState.isDirty} size="lg">
              {isSubmitting ? <Spinner className="size-4" /> : <Save className="size-4" />}
              Save Settings
            </Button>
          </div>
        </form>
      </Form>
    </FormPageLayout>
  )
}
