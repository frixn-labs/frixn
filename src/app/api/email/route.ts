import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/ratelimit'

// Initialize Resend lazily to avoid throwing during static build generation if the environment variable is missing
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Missing API key. Pass it to the constructor `new Resend("re_123")`');
  }
  return new Resend(apiKey);
};

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

    let finalTo = to
    let finalSubject = subject
    let finalHtml = html
    let finalReplyTo = replyTo

    if (endpoint === '/api/email/onboarding' || endpoint === 'onboarding') {
      const emailVal = body.Email || body.to
      const fullNameVal = body.FullName || 'Employee'
      const onboardingLinkVal = body.OnboardingLink || body.link

      finalTo = emailVal
      finalSubject = 'Welcome to frixn'
      finalHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
          <h2 style="color: #FF3D00;">Welcome to frixn!</h2>
          <p>Hi ${fullNameVal},</p>
          <p>Your employee credentials have been created on the frixn platform.</p>
          <p>Click the button below to set up your password and complete your profile:</p>
          <div style="margin: 24px 0;">
            <a href="${onboardingLinkVal}" style="background-color: #FF3D00; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Set Up Password</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #888; font-size: 13px;">${onboardingLinkVal}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 11px; color: #999;">This is an automated system email. Please do not reply directly.</p>
        </div>
      `
    } else if (endpoint === '/api/email/recovery' || endpoint === 'recovery' || endpoint === '/api/email/forgot-password') {
      const emailVal = body.Email || body.to
      const fullNameVal = body.FullName || 'User'
      const resetLinkVal = body.ResetLink || body.link

      finalTo = emailVal
      finalSubject = 'Password Recovery Request'
      finalHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
          <h2 style="color: #FF3D00;">Password Recovery</h2>
          <p>Hi ${fullNameVal},</p>
          <p>We received a request to recover the password for your account.</p>
          <p style="margin-bottom: 24px;">Please click the button below to set a new password. This link is valid for a limited time:</p>
          <div style="margin: 24px 0;">
            <a href="${resetLinkVal}" style="background-color: #FF3D00; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Reset Password</a>
          </div>
          <p>If you did not request a password recovery, you can safely ignore this email.</p>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #888; font-size: 13px;">${resetLinkVal}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 11px; color: #999;">This is an automated system email. Please do not reply directly.</p>
        </div>
      `
    } else if (endpoint === '/api/email/sales' || endpoint === 'sales') {
      const { fullName, phone, email: orgEmail, organization, teamSize } = body

      finalTo = 'contactus@frixn.in'
      finalSubject = `New Sales Inquiry: ${organization || 'General Inquiry'}`
      finalReplyTo = orgEmail || undefined
      finalHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
          <h2 style="color: #FF3D00; border-bottom: 2px solid #FF3D00; padding-bottom: 8px; margin-top: 0;">New Sales Inquiry</h2>
          <p>A new contact form has been submitted on the frixn cinematic landing page:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px; color: #555;">Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #111;">${fullName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #111;">${phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #111;"><a href="mailto:${orgEmail || ''}" style="color: #FF3D00; text-decoration: none;">${orgEmail || 'N/A'}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Organization:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #111;">${organization || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Team Size:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #111;">${teamSize || 'N/A'}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 11px; color: #999; margin: 0;">Captured from the frixn.in sales contact form.</p>
        </div>
      `
    }

    if (!finalTo || !finalSubject || !finalHtml) {
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

    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from,
      to: finalTo,
      subject: finalSubject,
      html: finalHtml,
      replyTo: finalReplyTo,
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
