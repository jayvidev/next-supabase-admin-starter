import { MediaPage } from '@admin/pages/media'

export const metadata = {
  title: 'Media Library',
}

export default function Page() {
  return <MediaPage title="Media Library" pathname="/admin/media" resource="media" />
}
