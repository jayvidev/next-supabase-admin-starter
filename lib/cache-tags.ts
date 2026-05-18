export const cacheTags = {
  hero: 'hero',
  sectionHeaders: 'section_headers',
  siteSettings: 'site_settings',
  headerSettings: 'header_settings',
  footerSettings: 'footer_settings',
} as const

export type CacheTag = (typeof cacheTags)[keyof typeof cacheTags]

export const allLandingTags: CacheTag[] = Object.values(cacheTags)
