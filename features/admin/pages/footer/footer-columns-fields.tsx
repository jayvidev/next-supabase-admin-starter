'use client'

import { DragDropProvider } from '@dnd-kit/react'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { useFieldArray, type UseFormReturn } from 'react-hook-form'

import { getSortableData, SortableItem } from '@admin/components/form/sortable-item'
import { type FooterFormValues } from '@admin/schemas/site-settings.schema'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { FooterColumnLinks } from './footer-column-links'

export function FooterColumnsFields({ form }: { form: UseFormReturn<FooterFormValues> }) {
  const columns = useFieldArray({
    control: form.control,
    name: 'columns',
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
          columns.move(sortable.initialIndex, sortable.index)
        }}
      >
        <div className="space-y-4">
          {columns.fields.map((columnField, index) => (
            <SortableItem key={columnField.id} id={columnField.id} index={index}>
              {({ handleRef }) => (
                <div className="rounded-lg border bg-muted/5 p-4 space-y-4 relative group">
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
                        Column {index + 1}
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="size-7"
                      onClick={() => columns.remove(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`columns.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-muted-foreground">Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Social Handle" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FooterColumnLinks form={form} columnIndex={index} />
                </div>
              )}
            </SortableItem>
          ))}
        </div>
      </DragDropProvider>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full h-12"
        onClick={() => columns.append({ title: '', links: [] })}
      >
        <Plus className="size-3.5 mr-2" />
        Add column
      </Button>
    </div>
  )
}
