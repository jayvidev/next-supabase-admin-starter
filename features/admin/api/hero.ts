import { createClient } from '@/lib/supabase/client'
import type { Hero, UpdateTables } from '@/lib/supabase/database.types'

export type { Hero } from '@/lib/supabase/database.types'

const supabase = createClient()

export const heroApi = {
  async get(): Promise<Hero> {
    const { data, error } = await supabase.from('hero').select('*').single()
    if (error) throw new Error(error.message)
    return data
  },
  async update(id: string, values: UpdateTables<'hero'>): Promise<Hero> {
    const { data, error } = await supabase
      .from('hero')
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },
}
