import type { Metadata } from 'next'

import { adminRoutes } from '@admin/config/routes'
import { HeaderPage } from '@admin/pages/header'

const PATHNAME = '/admin/layout/header'
const page = adminRoutes[PATHNAME]!

export const metadata: Metadata = { title: page.title }

export default function Page() {
  return <HeaderPage pathname={PATHNAME} />
}
