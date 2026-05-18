// AUTO-GENERATED — do not edit by hand.
// Regenerate after running migrations:  pnpm db:types
// (Initial file shipped as a reference shape; replace it once your project is linked.)

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      hero: {
        Row: {
          id: string
          pill_text: string | null
          pill_text_mobile: string | null
          background_image_url: string | null
          video_url: string | null
          buttons: Json
          bg_type: string | null
          video_poster_url: string | null
          badges: Json
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pill_text?: string | null
          pill_text_mobile?: string | null
          background_image_url?: string | null
          video_url?: string | null
          buttons?: Json
          bg_type?: string | null
          video_poster_url?: string | null
          badges?: Json
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pill_text?: string | null
          pill_text_mobile?: string | null
          background_image_url?: string | null
          video_url?: string | null
          buttons?: Json
          bg_type?: string | null
          video_poster_url?: string | null
          badges?: Json
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      stats: {
        Row: {
          id: string
          label: string
          value: string
          icon_before_url: string | null
          icon_after_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          label: string
          value: string
          icon_before_url?: string | null
          icon_after_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          label?: string
          value?: string
          icon_before_url?: string | null
          icon_after_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      why_vertex_items: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          tag: string
          title: string
          description: string | null
          image_url: string
          cta_label: string | null
          cta_url: string | null
          variant: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tag: string
          title: string
          description?: string | null
          image_url: string
          cta_label?: string | null
          cta_url?: string | null
          variant?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tag?: string
          title?: string
          description?: string | null
          image_url?: string
          cta_label?: string | null
          cta_url?: string | null
          variant?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      design_preview: {
        Row: {
          id: string
          image_with_glass_url: string | null
          image_without_glass_url: string | null
          features: Json
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          image_with_glass_url?: string | null
          image_without_glass_url?: string | null
          features?: Json
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          image_with_glass_url?: string | null
          image_without_glass_url?: string | null
          features?: Json
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      how_it_works_steps: {
        Row: {
          id: string
          step_number: number | null
          title: string
          description: string | null
          icon: string | null
          image_url: string | null
          is_active: boolean
          is_default_open: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          step_number?: number | null
          title: string
          description?: string | null
          icon?: string | null
          image_url?: string | null
          is_active?: boolean
          is_default_open?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          step_number?: number | null
          title?: string
          description?: string | null
          icon?: string | null
          image_url?: string | null
          is_active?: boolean
          is_default_open?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      commercial_tier: {
        Row: {
          id: string
          title: string | null
          description: string | null
          image_url: string | null
          features: Json
          cta_label: string | null
          cta_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title?: string | null
          description?: string | null
          image_url?: string | null
          features?: Json
          cta_label?: string | null
          cta_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string | null
          description?: string | null
          image_url?: string | null
          features?: Json
          cta_label?: string | null
          cta_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          id: string
          image_url: string | null
          category: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          image_url?: string | null
          category?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          image_url?: string | null
          category?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          name: string
          role: string | null
          company: string | null
          quote: string
          image_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role?: string | null
          company?: string | null
          quote: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string | null
          company?: string | null
          quote?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      cta_banner: {
        Row: {
          id: string
          eyebrow: string | null
          title: string | null
          cta_label: string | null
          cta_url: string | null
          background_image_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          eyebrow?: string | null
          title?: string | null
          cta_label?: string | null
          cta_url?: string | null
          background_image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          eyebrow?: string | null
          title?: string | null
          cta_label?: string | null
          cta_url?: string | null
          background_image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      section_headers: {
        Row: {
          id: string
          section_key: string
          eyebrow: string | null
          title: string | null
          subtitle: string | null
          footer_text: string | null
          contact_hours: string | null
          contact_note: string | null
          contact_area: string | null
          contact_badges: Json | null
          steps: Json | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_key: string
          eyebrow?: string | null
          title?: string | null
          subtitle?: string | null
          footer_text?: string | null
          contact_hours?: string | null
          contact_note?: string | null
          contact_area?: string | null
          contact_badges?: Json | null
          steps?: Json
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_key?: string
          eyebrow?: string | null
          title?: string | null
          subtitle?: string | null
          footer_text?: string | null
          contact_hours?: string | null
          contact_note?: string | null
          contact_area?: string | null
          contact_badges?: Json | null
          steps?: Json
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          site_name: string | null
          tagline: string | null
          logo_url: string | null
          logo_dark_url: string | null
          favicon_url: string | null
          contact_email: string | null
          contact_phone: string | null
          contact_address: string | null
          business_hours: Json
          social_links: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          site_name?: string | null
          tagline?: string | null
          logo_url?: string | null
          logo_dark_url?: string | null
          favicon_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_address?: string | null
          business_hours?: Json
          social_links?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          site_name?: string | null
          tagline?: string | null
          logo_url?: string | null
          logo_dark_url?: string | null
          favicon_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_address?: string | null
          business_hours?: Json
          social_links?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      header_settings: {
        Row: {
          id: string
          logo_url: string | null
          nav_links: Json
          cta_label: string | null
          cta_label_mobile: string | null
          cta_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          logo_url?: string | null
          nav_links?: Json
          cta_label?: string | null
          cta_label_mobile?: string | null
          cta_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          logo_url?: string | null
          nav_links?: Json
          cta_label?: string | null
          cta_label_mobile?: string | null
          cta_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      footer_settings: {
        Row: {
          id: string
          logo_url: string | null
          about_text: string | null
          columns: Json
          copyright_text: string | null
          legal_links: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          logo_url?: string | null
          about_text?: string | null
          columns?: Json
          copyright_text?: string | null
          legal_links?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          logo_url?: string | null
          about_text?: string | null
          columns?: Json
          copyright_text?: string | null
          legal_links?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          id: string
          path: string
          title: string | null
          description: string | null
          og_image_url: string | null
          keywords: string | null
          no_index: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          path: string
          title?: string | null
          description?: string | null
          og_image_url?: string | null
          keywords?: string | null
          no_index?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          path?: string
          title?: string | null
          description?: string | null
          og_image_url?: string | null
          keywords?: string | null
          no_index?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tracking_pixels: {
        Row: {
          id: string
          provider: string
          label: string | null
          pixel_id: string | null
          custom_script: string | null
          placement: string
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider: string
          label?: string | null
          pixel_id?: string | null
          custom_script?: string | null
          placement?: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider?: string
          label?: string | null
          pixel_id?: string | null
          custom_script?: string | null
          placement?: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: {
      reorder_by_sort_order: {
        Args: {
          p_table: string
          p_items: string
        }
        Returns: void
      }
    }
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Hero = Tables<'hero'>
export type Stat = Tables<'stats'>
export type WhyVertexItem = Tables<'why_vertex_items'>
export type Service = Tables<'services'>
export type DesignPreview = Tables<'design_preview'>
export type HowItWorksStep = Tables<'how_it_works_steps'>
export type CommercialTier = Tables<'commercial_tier'>
export type GalleryItem = Tables<'gallery_items'>
export type Testimonial = Tables<'testimonials'>
export type Faq = Tables<'faqs'>
export type CtaBanner = Tables<'cta_banner'>
export type SectionHeader = Tables<'section_headers'>
export type SiteSettings = Tables<'site_settings'>
export type HeaderSettings = Tables<'header_settings'>
export type FooterSettings = Tables<'footer_settings'>
export type SeoPage = Tables<'seo_pages'>
export type TrackingPixel = Tables<'tracking_pixels'>
