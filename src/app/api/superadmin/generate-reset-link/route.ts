import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Admin client — auth operations (requires service role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    // Generate a password reset link
    // Type 'recovery' generates a link for the "Forgot Password" flow
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email.trim().toLowerCase(),
      options: { 
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.frixn.in'}/reset-password` 
      }
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // The reset link is in data.properties.action_link
    return NextResponse.json({ 
      success: true, 
      link: data.properties.action_link,
      email: email
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Unexpected error' }, { status: 500 })
  }
}
