import { NextRequest, NextResponse } from 'next/server'
import { setSession } from '@/lib/auth'
import { rateLimit } from '@/lib/ratelimit'

export async function POST(request: NextRequest) {
  // Apply login rate limiter: 5 attempts per 15 minutes by default
  const limitResult = await rateLimit(request, 'login', { limit: 5, window: '15m' })

  if (!limitResult.success) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429, headers: limitResult.headers }
    )
  }

  try {
    const { orgId, orgSlug, role, accessToken } = await request.json()
    
    // Set the cookie via the server component utility
    await setSession(orgSlug, orgId, role, accessToken)
    
    const response = NextResponse.json({ success: true })
    limitResult.headers.forEach((val, key) => response.headers.set(key, val))
    return response
  } catch (error) {
    const response = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    limitResult.headers.forEach((val, key) => response.headers.set(key, val))
    return response
  }
}
