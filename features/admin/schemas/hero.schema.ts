import { z } from 'zod'

export const heroSchema = z.object({
  title: z.string().min(1, 'Title is required'),

  pill_text: z.string().optional().default(''),
  pill_text_mobile: z.string().optional().default(''),
  bg_type: z.enum(['image', 'video']).default('image'),
  background_image_url: z.string().optional().default(''),
  video_url: z.string().optional().default(''),
  video_poster_url: z.string().optional().default(''),

  buttons: z
    .array(
      z.object({
        label: z.string().min(1, 'Label is required'),
        url: z.string().min(1, 'URL is required'),
        variant: z.enum(['primary', 'outline']).default('primary'),
      })
    )
    .max(2)
    .default([]),

  badges: z
    .array(
      z.object({
        text: z.string().min(1, 'Text is required'),
        icon_url: z.string().optional().default(''),
      })
    )
    .max(3)
    .default([]),
})

export type HeroFormValues = z.infer<typeof heroSchema>
