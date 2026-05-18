import { config } from '@/config'
import {
  type CloudinaryListResult,
  type CloudinaryResource,
  deleteImage,
  listImages,
} from '@/lib/cloudinary'

import { mediaUsageApi } from './media-usage'

async function checkUsage(images: CloudinaryResource[]): Promise<CloudinaryResource[]> {
  if (!images.length) return []

  try {
    const usageMap = await mediaUsageApi.getUsage()

    return images.map((img) => ({
      ...img,
      usedIn: usageMap[img.secure_url] || [],
    }))
  } catch (err) {
    console.error('Error checking image usage:', err)
    return images.map((img) => ({ ...img, usedIn: [] }))
  }
}

export const mediaApi = {
  getPaginated: async (
    cursor?: string,
    search?: string,
    pageSize = 30
  ): Promise<CloudinaryListResult> => {
    const result = await listImages(
      cursor,
      pageSize,
      config.cloudinary.uploadPreset || undefined,
      search
    )
    const checkedResources = await checkUsage(result.resources)
    return {
      ...result,
      resources: checkedResources,
    }
  },

  delete: async (publicId: string): Promise<void> => {
    await deleteImage(publicId)
  },

  rename: async (publicId: string, displayName: string): Promise<void> => {
    const response = await fetch('/api/cloudinary/rename', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId, displayName }),
    })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error || 'Error renaming image')
    }
  },
}
