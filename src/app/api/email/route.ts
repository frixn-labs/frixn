import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/ratelimit'

const resend = new Resend(process.env.RESEND_API_KEY)

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
    const { endpoint, to, subject, html, fromName, replyTo, attachments } = body

    if (!endpoint) {
      const response = NextResponse.json({ error: 'Missing endpoint in request body' }, { status: 400 })
      limitResult.headers.forEach((val, key) => response.headers.set(key, val))
      return response
    }

    if (!to || !subject || !html) {
      const response = NextResponse.json({ error: 'Missing required fields: to, subject, html' }, { status: 400 })
      limitResult.headers.forEach((val, key) => response.headers.set(key, val))
      return response
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('Error: RESEND_API_KEY is not configured')
      const response = NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
      limitResult.headers.forEach((val, key) => response.headers.set(key, val))
      return response
    }

    // Build the from address
    const fromEmail = endpoint.includes('updates') ? 'updates@frixn.in' : 'noreply@frixn.in'
    const from = fromName ? `${fromName} <${fromEmail}>` : fromEmail

    // Build attachment list — support remote URL paths
    type ResendAttachment = { filename: string; path?: string; content?: Buffer }
    const resendAttachments: ResendAttachment[] = []
    if (Array.isArray(attachments)) {
      for (const att of attachments) {
        if (att.path && (att.path.startsWith('http://') || att.path.startsWith('https://'))) {
          resendAttachments.push({ filename: att.filename, path: att.path })
        } else if (att.content) {
          resendAttachments.push({ filename: att.filename, content: att.content })
        }
      }
    }

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      reply_to: replyTo,
      attachments: resendAttachments.length > 0 ? resendAttachments : undefined,
    })

    if (error) {
      console.error('Resend API Error:', error)
      const response = NextResponse.json({ error: 'Failed to send email', detail: error }, { status: 500 })
      limitResult.headers.forEach((val, key) => response.headers.set(key, val))
      return response
    }

    const successResponse = NextResponse.json({ success: true, messageId: data?.id })
    limitResult.headers.forEach((val, key) => successResponse.headers.set(key, val))
    return successResponse

  } catch (error: any) {
    console.error('Error in email route:', error)
    const errorResponse = NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    limitResult.headers.forEach((val, key) => errorResponse.headers.set(key, val))
    return errorResponse
  }
}
