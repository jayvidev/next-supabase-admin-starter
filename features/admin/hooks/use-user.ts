import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

export function useUser() {
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          email: data.user.email ?? '',
          name: data.user.user_metadata?.name ?? 'Admin',
        })
      }
      setIsLoading(false)
    })
  }, [])

  return { user, isLoading }
}
