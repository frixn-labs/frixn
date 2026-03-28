import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''

  // Strip port for local dev
  const host = hostname.split(':')[0]

  // Main domains — serve landing page as-is
  const mainDomains = ['envitra.in', 'www.envitra.in', 'localhost']
  if (mainDomains.includes(host)) {
    return NextResponse.next()
  }

  // Detect subdomain: e.g. "appaswamy" from "appaswamy.envitra.in"
  // Also handles subdomains on Vercel preview URLs like appaswamy.envitra-landing.vercel.app
  let slug: string | null = null

  if (host.endsWith('.envitra.in')) {
    slug = host.replace('.envitra.in', '')
  } else if (host.includes('.') && !host.endsWith('.vercel.app')) {
    // e.g. appaswamy.someotherdomain.in
    slug = host.split('.')[0]
  }

  // If no slug detected, fall through to normal routing (landing page)
  if (!slug) {
    return NextResponse.next()
  }

  // Rewrite all requests under a subdomain into /sites/[slug]/...
  const pathname = url.pathname

  // e.g. appaswamy.envitra.in/ → /sites/appaswamy/admin/dashboard
  if (pathname === '/') {
    url.pathname = `/sites/${slug}/admin/dashboard`
    return NextResponse.rewrite(url)
  }

  // e.g. appaswamy.envitra.in/admin/employees → /sites/appaswamy/admin/employees
  if (pathname.startsWith('/admin')) {
    url.pathname = `/sites/${slug}${pathname}`
    return NextResponse.rewrite(url)
  }

  // e.g. appaswamy.envitra.in/989ef0d3-... → /sites/appaswamy/989ef0d3-...
  // This matches employee profile by their ID / code in the URL path
  url.pathname = `/sites/${slug}${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    // Match everything except Next.js internals and static files
    '/((?!_next/|_vercel/|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|otf|mp4|webm)).*)',
  ],
}
