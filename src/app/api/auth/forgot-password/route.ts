import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/ratelimit'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: {
      schema: 'frixn'
    }
  }
)

export async function POST(req: NextRequest) {
  // Apply email rate limiter: 20 requests per 1 minute by default
  const limitResult = await rateLimit(req, 'email', { limit: 20, window: '1m' })

  if (!limitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: limitResult.headers }
    )
  }

  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      const response = NextResponse.json({ error: 'Email is required.' }, { status: 400 })
      limitResult.headers.forEach((val, key) => response.headers.set(key, val))
      return response
    }

    const cleanEmail = email.trim().toLowerCase()

    // 1. Generate the recovery link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: cleanEmail,
      options: { 
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.frixn.in'}/reset-password` 
      }
    })

    if (linkError) {
      const response = NextResponse.json({ error: linkError.message }, { status: 400 })
      limitResult.headers.forEach((val, key) => response.headers.set(key, val))
      return response
    }

    const actionLink = linkData.properties.action_link

    // 2. Fetch the user details to personalize the email
    let fullName = 'User'
    const { data: employee } = await supabaseAdmin
      .from('employees')
      .select('name')
      .eq('email', cleanEmail)
      .maybeSingle()

    if (employee?.name) {
      fullName = employee.name
    }

    // 3. Send email using Resend API key config check
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      // In development mode, if RESEND_API_KEY is not configured, we return the generated link
      // in the response so it is easy to test the recovery flow locally.
      console.warn(`Forgot Password API: RESEND_API_KEY is not configured. Returning debugLink in response.`)
      const successResponse = NextResponse.json({
        success: true,
        message: 'Recovery link generated.',
        debugLink: actionLink
      })
      limitResult.headers.forEach((val, key) => successResponse.headers.set(key, val))
      return successResponse
    }

    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    const fromEmail = 'noreply@frixn.in'
    const from = `frixn Security <${fromEmail}>`

    const emailSubject = 'Password Recovery Request'
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
        <h2 style="color: #FF3D00;">Password Recovery</h2>
        <p>Hi ${fullName},</p>
        <p>We received a request to recover the password for your account.</p>
        <p style="margin-bottom: 24px;">Please click the button below to set a new password. This link is valid for a limited time:</p>
        <div style="margin: 24px 0;">
          <a href="${actionLink}" style="background-color: #FF3D00; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you did not request a password recovery, you can safely ignore this email.</p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #888; font-size: 13px;">${actionLink}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 11px; color: #999;">This is an automated system email. Please do not reply directly.</p>
      </div>
    `

    const { error: resendError } = await resend.emails.send({
      from,
      to: cleanEmail,
      subject: emailSubject,
      html: emailHtml
    })

    if (resendError) {
      console.error('Resend API Error during password recovery:', resendError)
      const response = NextResponse.json({ error: 'Failed to send recovery email. Please contact support.' }, { status: 500 })
      limitResult.headers.forEach((val, key) => response.headers.set(key, val))
      return response
    }

    const successResponse = NextResponse.json({ success: true, message: 'Recovery email sent successfully.' })
    limitResult.headers.forEach((val, key) => successResponse.headers.set(key, val))
    return successResponse

  } catch (error: any) {
    console.error('Error in forgot password route:', error)
    const errorResponse = NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    limitResult.headers.forEach((val, key) => errorResponse.headers.set(key, val))
    return errorResponse
  }
}
