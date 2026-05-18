import { NextRequest, NextResponse } from 'next/server'

import { config } from '@/config'

export async function DELETE(request: NextRequest) {
  const { cloudName, apiKey, apiSecret } = config.cloudinary

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 500 })
  }

  const { publicId } = await request.json()
  if (!publicId) {
    return NextResponse.json({ error: 'public_id is required' }, { status: 400 })
  }

  const timestamp = Math.floor(Date.now() / 1000)

  const { createHash } = await import('crypto')
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
  const signature = createHash('sha1').update(signatureString).digest('hex')

  const formData = new FormData()
  formData.append('public_id', publicId)
  formData.append('timestamp', String(timestamp))
  formData.append('api_key', apiKey)
  formData.append('signature', signature)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Error deleting image' }, { status: 502 })
  }

  const data = await response.json()

  if (data.result !== 'ok') {
    return NextResponse.json({ error: `Cloudinary: ${data.result}` }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
