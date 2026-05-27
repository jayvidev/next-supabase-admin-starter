const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const config = {
  supabase: {
    enabled: Boolean(supabaseUrl && supabaseAnonKey),
    url: supabaseUrl || 'https://disabled.supabase.co',
    anonKey: supabaseAnonKey || 'disabled',
  },
  cloudinary: {
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
    folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || '',
  },
}
