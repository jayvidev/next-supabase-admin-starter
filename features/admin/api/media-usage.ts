import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export const mediaUsageApi = {
  async getUsage(): Promise<Record<string, string[]>> {
    const usage: Record<string, string[]> = {}
    const addUsage = (url: string | null, label: string) => {
      if (!url) return
      if (!usage[url]) usage[url] = []
      if (!usage[url].includes(label)) {
        usage[url].push(label)
      }
    }

    const addJsonUsage = (json: unknown, label: string) => {
      if (!json) return
      const str = JSON.stringify(json)
      const matches = str.match(/https:\/\/res\.cloudinary\.com\/[^"']+/g)
      if (matches) {
        matches.forEach((url) => addUsage(url, label))
      }
    }

    const [
      { data: hero },
      { data: whyVertex },
      { data: services },
      { data: designPreview },
      { data: howItWorks },
      { data: commercialTier },
      { data: gallery },
      { data: testimonials },
      { data: ctaBanner },
      { data: siteSettings },
      { data: headerSettings },
      { data: footerSettings },
      { data: seoPages },
      { data: stats },
      { data: sectionHeaders },
    ] = await Promise.all([
      supabase
        .from('hero')
        .select('background_image_url, video_url, video_poster_url, badges, buttons'),
      supabase.from('why_vertex_items').select('image_url'),
      supabase.from('services').select('image_url'),
      supabase
        .from('design_preview')
        .select('image_with_glass_url, image_without_glass_url, features'),
      supabase.from('how_it_works_steps').select('image_url, icon'),
      supabase.from('commercial_tier').select('image_url, features'),
      supabase.from('gallery_items').select('image_url'),
      supabase.from('testimonials').select('image_url'),
      supabase.from('cta_banner').select('background_image_url'),
      supabase.from('site_settings').select('logo_url, logo_dark_url, favicon_url, social_links'),
      supabase.from('header_settings').select('logo_url'),
      supabase.from('footer_settings').select('logo_url'),
      supabase.from('seo_pages').select('og_image_url'),
      supabase.from('stats').select('icon_before_url, icon_after_url'),
      supabase.from('section_headers').select('section_key, image_url, contact_badges, steps'),
    ])

    hero?.forEach((r) => {
      addUsage(r.background_image_url, 'Hero (Background)')
      addUsage(r.video_url, 'Hero (Video)')
      addUsage(r.video_poster_url, 'Hero (Poster)')
      addJsonUsage(r.badges, 'Hero (Badges)')
      addJsonUsage(r.buttons, 'Hero (Buttons)')
    })
    whyVertex?.forEach((r) => addUsage(r.image_url, 'Why Vertex'))
    services?.forEach((r) => addUsage(r.image_url, 'Services'))
    designPreview?.forEach((r) => {
      addUsage(r.image_with_glass_url, 'Design (With Glass)')
      addUsage(r.image_without_glass_url, 'Design (Without Glass)')
      addJsonUsage(r.features, 'Design (Features)')
    })
    howItWorks?.forEach((r) => {
      addUsage(r.image_url, 'How it Works')
      addUsage(r.icon, 'How it Works (Icon)')
    })
    commercialTier?.forEach((r) => {
      addUsage(r.image_url, 'Commercial Tier')
      addJsonUsage(r.features, 'Commercial Tier (Features)')
    })
    gallery?.forEach((r) => addUsage(r.image_url, 'Gallery'))
    testimonials?.forEach((r) => {
      addUsage(r.image_url, 'Testimonials')
    })
    ctaBanner?.forEach((r) => addUsage(r.background_image_url, 'CTA Banner'))
    siteSettings?.forEach((r) => {
      addUsage(r.logo_url, 'Settings (Logo)')
      addUsage(r.logo_dark_url, 'Settings (Dark Logo)')
      addUsage(r.favicon_url, 'Settings (Favicon)')
      addJsonUsage(r.social_links, 'Settings (Social)')
    })
    headerSettings?.forEach((r) => addUsage(r.logo_url, 'Header (Logo)'))
    footerSettings?.forEach((r) => addUsage(r.logo_url, 'Footer (Logo)'))
    seoPages?.forEach((r) => addUsage(r.og_image_url, 'SEO Pages'))
    stats?.forEach((r) => {
      addUsage(r.icon_before_url, 'Stats (Icon Before)')
      addUsage(r.icon_after_url, 'Stats (Icon After)')
    })
    sectionHeaders?.forEach((r) => {
      addUsage(r.image_url, `Section (${r.section_key})`)
      addJsonUsage(r.contact_badges, 'Contact (Badges)')
      addJsonUsage(r.steps, 'Estimator (Steps)')
    })

    return usage
  },
}
