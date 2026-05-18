'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

import { allLandingTags, type CacheTag } from '@/lib/cache-tags'

export async function revalidateLandingCache(tags?: CacheTag[]) {
  const toInvalidate = tags && tags.length > 0 ? tags : allLandingTags
  for (const tag of toInvalidate) revalidateTag(tag, 'max')
  revalidatePath('/', 'layout')
}

export async function revalidateAdminCache() {
  revalidatePath('/admin', 'layout')
}

export async function revalidatePathAction(path: string) {
  revalidatePath(path)
}
