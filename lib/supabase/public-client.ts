import { createClient as createSupabaseClient } from '@supabase/supabase-js'

import { config } from '@/config'

import type { Database } from './database.types'

export const publicClient = createSupabaseClient<Database>(
  config.supabase.url,
  config.supabase.anonKey
)
