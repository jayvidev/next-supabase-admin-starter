import { NextRequest, NextResponse } from 'next/server'

import { config } from '@/config'

function sanitizeTag(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
}

export async function POST(request: NextRequest) {
  const { cloudName, apiKey, apiSecret } = config.cloudinary

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 500 })
  }

  const { publicId, displayName } = await request.json()
  if (!publicId || !displayName) {
    return NextResponse.json({ error: 'public_id and displayName are required' }, { status: 400 })
  }

  const tag = sanitizeTag(displayName)
  const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
  const encodedPublicId = encodeURIComponent(publicId)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload/${encodedPublicId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        display_name: displayName,
        tags: [tag],
      }),
    }
  )

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    console.error('Cloudinary update resource error:', data)
    return NextResponse.json({ error: 'Error updating name', details: data }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
