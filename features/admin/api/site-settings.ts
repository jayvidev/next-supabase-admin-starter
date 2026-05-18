import { createClient } from '@/lib/supabase/client'
import type {
  FooterSettings,
  HeaderSettings,
  InsertTables,
  SeoPage,
  SiteSettings,
  TrackingPixel,
  UpdateTables,
} from '@/lib/supabase/database.types'

async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createClient()
  const { data, error } = await supabase.from('site_settings').select('*').single()
  if (error) throw error
  return data
}

async function updateSiteSettings(id: string, values: UpdateTables<'site_settings'>) {
  const supabase = createClient()
  const { error } = await supabase.from('site_settings').update(values).eq('id', id)
  if (error) throw error
}

async function getHeaderSettings(): Promise<HeaderSettings> {
  const supabase = createClient()
  const { data, error } = await supabase.from('header_settings').select('*').single()
  if (error) throw error
  return data
}

async function updateHeaderSettings(id: string, values: UpdateTables<'header_settings'>) {
  const supabase = createClient()
  const { error } = await supabase.from('header_settings').update(values).eq('id', id)
  if (error) throw error
}

async function getFooterSettings(): Promise<FooterSettings> {
  const supabase = createClient()
  const { data, error } = await supabase.from('footer_settings').select('*').single()
  if (error) throw error
  return data
}

async function updateFooterSettings(id: string, values: UpdateTables<'footer_settings'>) {
  const supabase = createClient()
  const { error } = await supabase.from('footer_settings').update(values).eq('id', id)
  if (error) throw error
}

async function getSeoPages(): Promise<SeoPage[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('seo_pages').select('*').order('path')
  if (error) throw error
  return data ?? []
}

async function upsertSeoPage(values: InsertTables<'seo_pages'>) {
  const supabase = createClient()
  const { error } = await supabase.from('seo_pages').upsert(values, { onConflict: 'path' })
  if (error) throw error
}

async function getTrackingPixels(): Promise<TrackingPixel[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('tracking_pixels').select('*').order('sort_order')
  if (error) throw error
  return data ?? []
}

async function upsertTrackingPixel(
  id: string | undefined,
  values: InsertTables<'tracking_pixels'>
) {
  const supabase = createClient()
  if (id) {
    const { error } = await supabase.from('tracking_pixels').update(values).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('tracking_pixels').insert(values)
    if (error) throw error
  }
}

async function deleteTrackingPixel(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('tracking_pixels').delete().eq('id', id)
  if (error) throw error
}

export const siteSettingsApi = {
  getSiteSettings,
  updateSiteSettings,
  getHeaderSettings,
  updateHeaderSettings,
  getFooterSettings,
  updateFooterSettings,
  getSeoPages,
  upsertSeoPage,
  getTrackingPixels,
  upsertTrackingPixel,
  deleteTrackingPixel,
}
