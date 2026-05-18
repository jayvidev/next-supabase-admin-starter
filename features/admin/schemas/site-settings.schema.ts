import { z } from 'zod'

export const generalFormSchema = z.object({
  site_name: z.string().min(1, 'Required'),
  tagline: z.string().optional().default(''),
  logo_url: z.string().optional().default(''),
  logo_dark_url: z.string().optional().default(''),
  favicon_url: z.string().optional().default(''),
  contact_email: z.string().optional().default(''),
  contact_phone: z.string().optional().default(''),
  contact_address: z.string().optional().default(''),
})

export type GeneralFormValues = z.infer<typeof generalFormSchema>

export const seoFormSchema = z.object({
  path: z.string().min(1, 'Required'),
  title: z.string().optional().default(''),
  description: z.string().optional().default(''),
  og_image_url: z.string().optional().default(''),
  keywords: z.string().optional().default(''),
  no_index: z.boolean().default(false),
})

export type SeoFormValues = z.infer<typeof seoFormSchema>

export const headerFormSchema = z.object({
  logo_url: z.string().optional().default(''),
  nav_links: z.array(
    z.object({
      label: z.string().min(1, 'Required'),
      href: z.string().min(1, 'Required'),
      is_dropdown: z.boolean().default(false),
      children: z
        .array(
          z.object({
            label: z.string().min(1, 'Required'),
            href: z.string().min(1, 'Required'),
          })
        )
        .default([]),
    })
  ),
  cta_label: z.string().optional().default(''),
  cta_label_mobile: z.string().optional().default(''),
  cta_url: z.string().optional().default(''),
})

export type HeaderFormValues = z.infer<typeof headerFormSchema>
export type HeaderNavLinkValues = HeaderFormValues['nav_links'][number]
export type HeaderNavChildValues = HeaderNavLinkValues['children'][number]

export const footerFormSchema = z.object({
  logo_url: z.string().optional().default(''),
  about_text: z.string().optional().default(''),
  columns: z
    .array(
      z.object({
        title: z.string().min(1, 'Required'),
        links: z.array(
          z.object({
            label: z.string().min(1, 'Required'),
            href: z.string().min(1, 'Required'),
          })
        ),
      })
    )
    .default([]),
  legal_links: z
    .array(
      z.object({
        label: z.string().min(1, 'Required'),
        href: z.string().min(1, 'Required'),
      })
    )
    .default([]),
  copyright_text: z.string().optional().default(''),
})

export type FooterFormValues = z.infer<typeof footerFormSchema>

export const trackingFormSchema = z.object({
  provider: z.string().min(1, 'Required'),
  label: z.string().optional().default(''),
  pixel_id: z.string().optional().default(''),
  custom_script: z.string().optional().default(''),
  placement: z.enum(['head', 'body']).default('head'),
  is_active: z.boolean().default(true),
})

export type TrackingFormValues = z.infer<typeof trackingFormSchema>
