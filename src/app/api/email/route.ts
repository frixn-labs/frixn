import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/ratelimit'

export async function POST(request: NextRequest) {
  // Apply email rate limiter: 20 requests per 1 minute by default
  const limitResult = await rateLimit(request, 'email', { limit: 20, window: '1m' })

  if (!limitResult.success) {
    return NextResponse.json(
      { error: 'Too many email requests. Please try again later.' },
      { status: 429, headers: limitResult.headers }
    )
  }

  try {
    const body = await request.json()
    const { endpoint, ...rest } = body

    if (!endpoint) {
      const response = NextResponse.json({ error: 'Missing endpoint in request body' }, { status: 400 })
      limitResult.headers.forEach((val, key) => response.headers.set(key, val))
      return response
    }

    const apiSecret = process.env.API_SECRET
    const nodeServerUrl = process.env.NODE_SERVER_URL || 'http://localhost:5000'

    if (!apiSecret) {
      console.error('Error: API_SECRET is not configured on the Next.js server')
      const response = NextResponse.json({ error: 'Server authentication configuration missing' }, { status: 500 })
      limitResult.headers.forEach((val, key) => response.headers.set(key, val))
      return response
    }

    // Parse the endpoint and construct the target URL
    let relativePath = endpoint
    if (relativePath.startsWith('http')) {
      try {
        const url = new URL(relativePath)
        relativePath = url.pathname
      } catch (e) {
        const response = NextResponse.json({ error: 'Invalid endpoint URL format' }, { status: 400 })
        limitResult.headers.forEach((val, key) => response.headers.set(key, val))
        return response
      }
    }

    // Safety check: ensure it starts with /api/email to prevent SSRF or routing requests to unauthorized paths
    if (!relativePath.startsWith('/api/email')) {
      const response = NextResponse.json({ error: 'Forbidden endpoint route' }, { status: 403 })
      limitResult.headers.forEach((val, key) => response.headers.set(key, val))
      return response
    }

    const targetUrl = `${nodeServerUrl.replace(/\/$/, '')}${relativePath}`

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiSecret}`
      },
      body: JSON.stringify(rest)
    })

    // Read response text first to handle non-JSON responses gracefully
    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      data = { message: text }
    }

    if (!response.ok) {
      const errorResponse = NextResponse.json(data || { error: `Node server returned status ${response.status}` }, { status: response.status })
      limitResult.headers.forEach((val, key) => errorResponse.headers.set(key, val))
      return errorResponse
    }

    const successResponse = NextResponse.json(data)
    limitResult.headers.forEach((val, key) => successResponse.headers.set(key, val))
    return successResponse
  } catch (error: any) {
    console.error('Error in Next.js email proxy route:', error)
    const errorResponse = NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    limitResult.headers.forEach((val, key) => errorResponse.headers.set(key, val))
    return errorResponse
  }
}
