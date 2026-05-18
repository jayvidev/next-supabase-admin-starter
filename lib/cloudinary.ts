import { config } from '@/config'

export interface CloudinaryResource {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: 'image' | 'video' | 'raw'
  bytes: number
  created_at: string
  display_name?: string
  context?: { custom?: { display_name?: string } }
  usedIn?: string[]
}

export interface CloudinaryListResult {
  resources: CloudinaryResource[]
  next_cursor?: string
  total_count?: number
}

export function isCloudinaryConfigured(): boolean {
  return config.cloudinary.cloudName.length > 0 && config.cloudinary.uploadPreset.length > 0
}

export async function uploadImage(
  file: File,
  publicId?: string
): Promise<{ secure_url: string; public_id: string }> {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary not configured')
  }

  const formData = new FormData()
  formData.append('file', file)

  if (publicId) {
    const timestamp = Math.round(new Date().getTime() / 1000).toString()
    const paramsToSign = {
      public_id: publicId,
      timestamp,
    }

    const signResponse = await fetch('/api/cloudinary/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paramsToSign }),
    })

    if (!signResponse.ok) {
      throw new Error('Error obtaining signature for overwrite')
    }

    const { signature, apiKey } = await signResponse.json()

    formData.append('api_key', apiKey)
    formData.append('timestamp', timestamp)
    formData.append('signature', signature)
    formData.append('public_id', publicId)
  } else {
    formData.append('upload_preset', config.cloudinary.uploadPreset)
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/auto/upload`,
    { method: 'POST', body: formData }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || 'Error uploading to Cloudinary')
  }

  const data = await response.json()
  return { secure_url: data.secure_url, public_id: data.public_id }
}

export async function listImages(
  nextCursor?: string,
  maxResults = 500,
  folder?: string,
  search?: string
): Promise<CloudinaryListResult> {
  const params = new URLSearchParams({ max_results: String(maxResults) })
  if (nextCursor) params.set('next_cursor', nextCursor)
  if (folder) params.set('folder', folder)
  if (search) params.set('search', search)

  const response = await fetch(`/api/cloudinary/images?${params}`)
  if (!response.ok) {
    throw new Error('Error fetching images from server')
  }
  return response.json()
}

export async function deleteImage(publicId: string): Promise<void> {
  const response = await fetch('/api/cloudinary/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId }),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Error deleting media')
  }
}
