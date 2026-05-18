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

export async function GET(request: NextRequest) {
  const { cloudName, apiKey, apiSecret } = config.cloudinary

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Cloudinary is not configured on the server' },
      { status: 500 }
    )
  }

  const { searchParams } = request.nextUrl
  const nextCursor = searchParams.get('next_cursor')
  const maxResults = searchParams.get('max_results') || '100'
  const folder = (searchParams.get('folder') || '').replace(/[^a-zA-Z0-9\-_./]/g, '')
  const rawSearch = (searchParams.get('search') || '').trim()

  const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')

  let expression = ''
  if (folder && rawSearch) {
    const sanitized = sanitizeTag(rawSearch)
    expression = `folder:${folder} AND (public_id:${sanitized}* OR tags:${sanitized}*)`
  } else if (folder) {
    expression = `folder:${folder}`
  } else if (rawSearch) {
    const sanitized = sanitizeTag(rawSearch)
    expression = `public_id:${sanitized}* OR tags:${sanitized}*`
  }

  const body: Record<string, unknown> = {
    max_results: Number(maxResults),
    sort_by: [{ created_at: 'desc' }],
    with_field: ['context', 'tags'],
  }
  if (expression) body.expression = expression
  if (nextCursor) body.next_cursor = nextCursor

  const searchResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    }
  )

  if (!searchResponse.ok) {
    const errorData = await searchResponse.json().catch(() => ({}))
    return NextResponse.json(
      { error: 'Error fetching images from Cloudinary', details: errorData },
      { status: 502 }
    )
  }

  const data = await searchResponse.json()
  return NextResponse.json(data)
}
