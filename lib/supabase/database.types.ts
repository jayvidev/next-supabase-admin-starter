// AUTO-GENERATED — do not edit by hand. Run pnpm db:types to regenerate.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: Record<never, never>
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
