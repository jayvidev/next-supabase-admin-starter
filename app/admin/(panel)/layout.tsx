import type { ReactNode } from 'react'

import { AdminLayout } from '@admin/layout'

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <AdminLayout>
      <div className="size-full">
        <div className="flex p-5 gap-4 flex-col max-w-384 mx-auto h-full w-full">{children}</div>
      </div>
    </AdminLayout>
  )
}
