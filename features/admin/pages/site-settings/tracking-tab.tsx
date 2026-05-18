'use client'

import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { revalidateLandingCache } from '@admin/actions/revalidate'
import { siteSettingsApi } from '@admin/api/site-settings'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'

import { FormSkeleton } from './form-skeleton'

type TrackingPixel = Awaited<ReturnType<typeof siteSettingsApi.getTrackingPixels>>[number]

export function TrackingTab() {
  const qc = useQueryClient()
  const { data: pixels = [], isLoading } = useQuery({
    queryKey: ['tracking-pixels'],
    queryFn: siteSettingsApi.getTrackingPixels,
  })

  const toggleActive = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) => {
      const pixel = pixels.find((p) => p.id === id)
      if (!pixel) throw new Error('Pixel not found')
      return siteSettingsApi.upsertTrackingPixel(id, { ...pixel, is_active })
    },
    onSuccess: () => {
      toast.success('Updated')
      qc.invalidateQueries({ queryKey: ['tracking-pixels'] })
      revalidateLandingCache().catch(() => {})
    },
  })

  const remove = useMutation({
    mutationFn: siteSettingsApi.deleteTrackingPixel,
    onSuccess: () => {
      toast.success('Deleted')
      qc.invalidateQueries({ queryKey: ['tracking-pixels'] })
    },
  })

  const [newPixel, setNewPixel] = useState({
    provider: '',
    label: '',
    pixel_id: '',
    placement: 'head' as const,
  })

  const create = useMutation({
    mutationFn: () =>
      siteSettingsApi.upsertTrackingPixel(undefined, { ...newPixel, is_active: true }),
    onSuccess: () => {
      toast.success('Created')
      qc.invalidateQueries({ queryKey: ['tracking-pixels'] })
      setNewPixel({ provider: '', label: '', pixel_id: '', placement: 'head' })
    },
  })

  if (isLoading) return <FormSkeleton rows={3} />

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Pixel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Provider</label>
              <Input
                placeholder="GA4 / GTM / Meta / TikTok"
                value={newPixel.provider}
                onChange={(e) => setNewPixel({ ...newPixel, provider: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Label</label>
              <Input
                placeholder="Display label"
                value={newPixel.label}
                onChange={(e) => setNewPixel({ ...newPixel, label: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Pixel / Tag ID</label>
              <Input
                placeholder="G-XXXXXXXX"
                value={newPixel.pixel_id}
                onChange={(e) => setNewPixel({ ...newPixel, pixel_id: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => create.mutate()}
              disabled={!newPixel.provider || create.isPending}
            >
              {create.isPending ? <Spinner className="size-4" /> : null}
              Add Pixel
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {(pixels as TrackingPixel[]).map((pixel) => (
          <div key={pixel.id} className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <Switch
                checked={pixel.is_active ?? true}
                onCheckedChange={(v) => toggleActive.mutate({ id: pixel.id, is_active: v })}
              />
              <div>
                <p className="font-medium text-sm">{pixel.label ?? pixel.provider}</p>
                <p className="text-xs text-muted-foreground">
                  {pixel.provider} · {pixel.pixel_id ?? '—'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => remove.mutate(pixel.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        {pixels.length === 0 && (
          <p className="text-sm text-muted-foreground">No tracking pixels yet.</p>
        )}
      </div>
    </div>
  )
}
