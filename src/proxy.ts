import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/ratelimit'

export default async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // 1. Apply Rate Limiting to specific API routes
  if (pathname.startsWith('/api/')) {
    let rateLimitResult = { success: true, headers: new Headers() }

    if (pathname === '/api/auth/login') {
      rateLimitResult = await rateLimit(request, 'login', {
        limit: 5,
        window: '15m'
      })
    } else if (pathname === '/api/leads') {
      rateLimitResult = await rateLimit(request, 'leads', {
        limit: 10,
        window: '1m'
      })
    } else if (pathname === '/api/email') {
      rateLimitResult = await rateLimit(request, 'email', {
        limit: 20,
        window: '1m'
      })
    }

    if (!rateLimitResult.success) {
      return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': rateLimitResult.headers.get('Retry-After') || '60',
        },
      })
    }
  }

  // 2. Existing Proxy/Rewrite Logic
  const host = request.nextUrl.hostname
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  const responseOptions = {
    request: {
      headers: requestHeaders,
    }
  }

  // Root/www domains → serve landing page without rewrite
  if (
    host === 'frixn.in' ||
    host === 'www.frixn.in' ||
    host === 'localhost' ||
    host.endsWith('.vercel.app')
  ) {
    return NextResponse.next(responseOptions)
  }

  // Extract org slug from subdomain
  // appaswamy.frixn.in → slug = "appaswamy"
  let slug: string | null = null

  if (host.endsWith('.frixn.in')) {
    slug = host.replace('.frixn.in', '')
    if (slug.startsWith('www.')) {
      slug = slug.replace('www.', '')
    }
  }

  if (!slug) {
    return NextResponse.next(responseOptions)
  }

  // Pass API routes through without rewriting
  if (pathname.startsWith('/api/')) {
    return NextResponse.next(responseOptions)
  }

  // appaswamy.frixn.in  →  /sites/appaswamy/admin/dashboard
  if (pathname === '/') {
    url.pathname = `/sites/${slug}/admin/dashboard`
    return NextResponse.rewrite(url, responseOptions)
  }

  // appaswamy.frixn.in/admin/employees  →  /sites/appaswamy/admin/employees
  if (pathname.startsWith('/admin')) {
    url.pathname = `/sites/${slug}${pathname}`
    return NextResponse.rewrite(url, responseOptions)
  }

  // appaswamy.frixn.in/65a7aaf7-...  →  /sites/appaswamy/65a7aaf7-...
  url.pathname = `/sites/${slug}${pathname}`
  return NextResponse.rewrite(url, responseOptions)
}

export const config = {
  matcher: ['/:path*'],
}
