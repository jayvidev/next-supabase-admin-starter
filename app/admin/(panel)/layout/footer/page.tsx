import type { Metadata } from 'next'

import { adminRoutes } from '@admin/config/routes'
import { FooterPage } from '@admin/pages/footer'

const PATHNAME = '/admin/layout/footer'
const page = adminRoutes[PATHNAME]!

export const metadata: Metadata = { title: page.title }

export default function Page() {
  return <FooterPage pathname={PATHNAME} />
}
