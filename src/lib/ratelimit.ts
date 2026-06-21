import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest } from 'next/server'

// Initialize Redis client if configuration exists
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

interface RateLimitConfig {
  limit: number
  window: string // e.g. "15m", "1m"
}

export async function rateLimit(
  req: NextRequest,
  key: string, // e.g. 'login', 'leads', 'email'
  defaultConfig: RateLimitConfig
) {
  // If Redis environment variables are missing, fail open with a warning to avoid breaking API services
  if (!redis) {
    console.warn(`Ratelimit: Upstash Redis is not configured. Skipping rate limiting for: ${key}`)
    return { success: true, headers: new Headers() }
  }

  // Load configuration from environment variables if present, or fallback to defaults
  const limit = parseInt(
    process.env[`RATE_LIMIT_${key.toUpperCase()}_MAX`] || defaultConfig.limit.toString(),
    10
  )
  const windowStr =
    process.env[`RATE_LIMIT_${key.toUpperCase()}_WINDOW`] || defaultConfig.window

  const window = windowStr.replace(/\s+/g, '') as any

  const ratelimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    analytics: true,
    prefix: `@upstash/ratelimit/${key}`,
  })

  // Retrieve client IP address
  const ip = req.headers.get('x-forwarded-for') || (req as any).ip || '127.0.0.1'
  const identifier = `${key}:${ip}`

  const { success, limit: max, reset, remaining } = await ratelimiter.limit(identifier)

  const headers = new Headers()
  headers.set('X-RateLimit-Limit', max.toString())
  headers.set('X-RateLimit-Remaining', remaining.toString())
  headers.set('X-RateLimit-Reset', reset.toString())

  if (!success) {
    const retryAfter = Math.max(0, Math.ceil((reset - Date.now()) / 1000))
    headers.set('Retry-After', retryAfter.toString())
    return { success: false, headers }
  }

  return { success: true, headers }
}
