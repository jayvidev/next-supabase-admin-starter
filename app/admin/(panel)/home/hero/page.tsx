import type { Metadata } from 'next'

import { adminRoutes } from '@admin/config/routes'
import { HeroPage } from '@admin/pages/hero'

const PATHNAME = '/admin/home/hero'
const page = adminRoutes[PATHNAME]!

export const metadata: Metadata = { title: page.title }

export default function Page() {
  return <HeroPage title={page.title} pathname={PATHNAME} />
}
