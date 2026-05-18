'use client'

import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

import { revalidateLandingCache } from '@admin/actions/revalidate'
import { siteSettingsApi } from '@admin/api/site-settings'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { FormSkeleton } from './form-skeleton'

type SeoPage = Awaited<ReturnType<typeof siteSettingsApi.getSeoPages>>[number]

export function SeoTab() {
  const qc = useQueryClient()
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['seo-pages'],
    queryFn: siteSettingsApi.getSeoPages,
  })
  const [editing, setEditing] = useState<SeoPage | null>(null)
  const [newPath, setNewPath] = useState('')

  const save = useMutation({
    mutationFn: siteSettingsApi.upsertSeoPage,
    onSuccess: () => {
      toast.success('Saved')
      qc.invalidateQueries({ queryKey: ['seo-pages'] })
      revalidateLandingCache().catch(() => {})
    },
    onError: () => toast.error('Error saving'),
  })

  if (isLoading) return <FormSkeleton rows={3} />

  const handleSave = (page: SeoPage) => {
    save.mutate({
      path: page.path,
      title: page.title ?? '',
      description: page.description ?? '',
      og_image_url: page.og_image_url ?? '',
      keywords: page.keywords ?? '',
      no_index: page.no_index ?? false,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Page path (e.g. /)"
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => {
            if (!newPath) return
            setEditing({
              path: newPath,
              id: '',
              title: null,
              description: null,
              og_image_url: null,
              keywords: null,
              no_index: false,
              created_at: '',
              updated_at: '',
            })
            setNewPath('')
          }}
        >
          Add Page
        </Button>
      </div>

      {editing && (
        <Card>
          <CardHeader>
            <CardTitle>SEO for: {editing.path}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Meta Title</label>
                <Input
                  value={editing.title ?? ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Meta Description</label>
                <Textarea
                  value={editing.description ?? ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">OG Image URL</label>
                <Input
                  value={editing.og_image_url ?? ''}
                  onChange={(e) => setEditing({ ...editing, og_image_url: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Keywords</label>
                <Input
                  value={editing.keywords ?? ''}
                  onChange={(e) => setEditing({ ...editing, keywords: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editing.no_index ?? false}
                  onCheckedChange={(v) => setEditing({ ...editing, no_index: v })}
                />
                <span className="text-sm">No Index</span>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleSave(editing)
                    setEditing(null)
                  }}
                  disabled={save.isPending}
                >
                  {save.isPending ? <Spinner className="size-4" /> : <Save className="size-4" />}
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {pages.map((page) => (
          <div key={page.path} className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium text-sm">{page.path}</p>
              <p className="text-xs text-muted-foreground">{page.title ?? '—'}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setEditing(page)}>
              Edit
            </Button>
          </div>
        ))}
        {pages.length === 0 && !editing && (
          <p className="text-sm text-muted-foreground">No SEO pages yet. Add one above.</p>
        )}
      </div>
    </div>
  )
}
