import NextTopLoader from 'nextjs-toploader'
import type { ReactNode } from 'react'

import './globals.css'

import '@fontsource-variable/onest'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NextTopLoader color="var(--color-primary)" height={2} easing="linear" showSpinner={false} />
      {children}
    </>
  )
}
