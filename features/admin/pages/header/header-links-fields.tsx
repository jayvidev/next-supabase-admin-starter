'use client'

import { DragDropProvider } from '@dnd-kit/react'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { useFieldArray, type UseFormReturn } from 'react-hook-form'

import { getSortableData, SortableItem } from '@admin/components/form/sortable-item'
import { type HeaderFormValues } from '@admin/schemas/site-settings.schema'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { TargetInput } from './target-input'

export function HeaderLinksFields({ form }: { form: UseFormReturn<HeaderFormValues> }) {
  const headerLinks = useFieldArray({
    control: form.control,
    name: 'nav_links',
  })

  return (
    <div className="space-y-4">
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return
          const { source } = event.operation
          if (!source) return
          const sortable = getSortableData(source)
          if (!sortable || sortable.initialIndex === sortable.index) return
          headerLinks.move(sortable.initialIndex, sortable.index)
        }}
      >
        <div className="space-y-4">
          {headerLinks.fields.map((headerLink, index) => (
            <SortableItem key={headerLink.id} id={headerLink.id} index={index}>
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
                        Link {index + 1}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="size-7"
                      onClick={() => headerLinks.remove(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`nav_links.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Label</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Services" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`nav_links.${index}.href`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">Target</FormLabel>
                          <FormControl>
                            <TargetInput value={field.value} onChange={field.onChange} />
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

      {headerLinks.fields.length < 6 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full h-12"
          onClick={() =>
            headerLinks.append({ label: '', href: '', is_dropdown: false, children: [] })
          }
        >
          <Plus className="size-3.5 mr-2" />
          Add link
        </Button>
      )}
    </div>
  )
}
