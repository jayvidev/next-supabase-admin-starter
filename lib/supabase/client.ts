'use client'

import { createBrowserClient } from '@supabase/ssr'

import { config } from '@/config'

import type { Database } from './database.types'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (client) return client
  client = createBrowserClient<Database>(config.supabase.url, config.supabase.anonKey)
  return client
}
