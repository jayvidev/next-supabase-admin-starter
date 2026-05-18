import { Footer } from '@landing/components/layout/footer'
import { Navbar } from '@landing/components/layout/navbar'
import { Hero } from '@landing/sections/hero'

import {
  getFooterSettings,
  getHeaderSettings,
  getHero,
  getSectionHeader,
} from '@/lib/supabase/server-queries'

export const dynamic = 'force-static'

export default async function Home() {
  const [hero, heroHeader, headerSettings, footerSettings] = await Promise.all([
    getHero(),
    getSectionHeader('hero'),
    getHeaderSettings(),
    getFooterSettings(),
  ])

  return (
    <>
      <Navbar data={headerSettings} />
      <main>{hero && <Hero data={hero} header={heroHeader} />}</main>
      <Footer data={footerSettings} />
    </>
  )
}
