import { createClient } from '@/lib/supabase/client'
import type { SectionHeader, UpdateTables } from '@/lib/supabase/database.types'

export type { SectionHeader } from '@/lib/supabase/database.types'

const supabase = createClient()

export const sectionHeadersApi = {
  async getByKey(key: string): Promise<SectionHeader | null> {
    const { data, error } = await supabase
      .from('section_headers')
      .select('*')
      .eq('section_key', key)
      .maybeSingle()
    if (error) throw new Error(error.message)
    return data
  },
  async upsert(
    section_key: string,
    values: UpdateTables<'section_headers'>
  ): Promise<SectionHeader> {
    const { data, error } = await supabase
      .from('section_headers')
      .upsert(
        { section_key, ...values, updated_at: new Date().toISOString() },
        { onConflict: 'section_key' }
      )
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },
}
