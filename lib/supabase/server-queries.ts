import { unstable_cache } from 'next/cache'

import { cacheTags } from '@/lib/cache-tags'

import { publicClient } from './public-client'

const ONE_HOUR = 60 * 60

export const getHero = unstable_cache(
  async () => {
    const { data, error } = await publicClient.from('hero').select('*').single()
    if (error) return null
    return data
  },
  ['hero'],
  { tags: [cacheTags.hero], revalidate: ONE_HOUR }
)

export const getSectionHeader = (key: string) =>
  unstable_cache(
    async () => {
      const { data, error } = await publicClient
        .from('section_headers')
        .select('*')
        .eq('section_key', key)
        .single()
      if (error) return null
      return data
    },
    ['section_headers', key],
    { tags: [cacheTags.sectionHeaders], revalidate: ONE_HOUR }
  )()

export const getSiteSettings = unstable_cache(
  async () => {
    const { data, error } = await publicClient
      .from('site_settings')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .single()
    if (error) return null
    return data
  },
  ['site_settings'],
  { tags: [cacheTags.siteSettings], revalidate: ONE_HOUR }
)

export const getHeaderSettings = unstable_cache(
  async () => {
    const { data, error } = await publicClient.from('header_settings').select('*').single()
    if (error) return null
    return data
  },
  ['header_settings'],
  { tags: [cacheTags.headerSettings], revalidate: ONE_HOUR }
)

export const getFooterSettings = unstable_cache(
  async () => {
    const { data, error } = await publicClient.from('footer_settings').select('*').single()
    if (error) return null
    return data
  },
  ['footer_settings'],
  { tags: [cacheTags.footerSettings], revalidate: ONE_HOUR }
)
