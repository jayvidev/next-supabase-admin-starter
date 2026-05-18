import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

import { config } from '@/config'

export async function POST(request: NextRequest) {
  try {
    const { paramsToSign } = await request.json()
    const { apiSecret, apiKey } = config.cloudinary

    if (!apiSecret || !apiKey) {
      return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 500 })
    }

    const objectKeys = Object.keys(paramsToSign).sort()
    const str = objectKeys.map((k) => `${k}=${paramsToSign[k]}`).join('&') + apiSecret

    const signature = crypto.createHash('sha1').update(str).digest('hex')

    return NextResponse.json({ signature, apiKey })
  } catch (error) {
    console.error('Error signing upload:', error)
    return NextResponse.json({ error: 'Error signing parameters' }, { status: 500 })
  }
}
