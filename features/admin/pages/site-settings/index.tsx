'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { FormPageLayout } from '@admin/components/shared/form-page-layout'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { GeneralTab } from './general-tab'
import { SeoTab } from './seo-tab'
import { TrackingTab } from './tracking-tab'

type SettingsTab = 'general' | 'seo' | 'tracking'

export function SiteSettingsPage({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentPathname = usePathname()

  const tab = (searchParams.get('tab') as SettingsTab) ?? 'general'

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', value)
    router.replace(`${currentPathname}?${params.toString()}`)
  }

  return (
    <FormPageLayout title="Settings" description="Configure site-wide settings" pathname={pathname}>
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
            </CardHeader>
            <CardContent>
              <GeneralTab />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <SeoTab />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle>Tracking Pixels</CardTitle>
            </CardHeader>
            <CardContent>
              <TrackingTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FormPageLayout>
  )
}
