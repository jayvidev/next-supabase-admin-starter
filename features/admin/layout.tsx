'use client'

import { AppSidebar } from '@admin/components/sidebar/app-sidebar'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { Header } from './components/header'
import { CommandMenu } from './components/header/command-menu'

interface Props {
  children?: React.ReactNode
}

export function AdminLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
      <CommandMenu />
    </SidebarProvider>
  )
}
