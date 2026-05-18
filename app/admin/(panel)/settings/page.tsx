'use client'

import { Suspense } from 'react'

import { SiteSettingsPage } from '@admin/pages/site-settings'

export default function Page() {
  return (
    <Suspense>
      <SiteSettingsPage pathname="/admin/settings" />
    </Suspense>
  )
}
