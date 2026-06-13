'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

import { allSiteTags, type CacheTag } from '@/lib/cache-tags'

export async function revalidateSiteCache(tags?: CacheTag[]) {
  const toInvalidate = tags && tags.length > 0 ? tags : allSiteTags
  for (const tag of toInvalidate) revalidateTag(tag, 'max')
  revalidatePath('/', 'layout')
}

export async function revalidateAdminCache() {
  revalidatePath('/admin', 'layout')
}

export async function revalidatePathAction(path: string) {
  revalidatePath(path)
}
