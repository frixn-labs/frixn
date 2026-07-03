import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'

// Admin client — auth operations
const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Admin client — frixn schema data operations
const supabaseData = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { db: { schema: 'frixn' } }
)

export async function POST(req: NextRequest) {
  try {
    // 1. Session verification
    const cookieStore = await cookies()
    const activeSlug = cookieStore.get('frixn_active_slug')?.value
    if (!activeSlug) {
      return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 })
    }

    const session = await getSession(activeSlug)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 })
    }

    // 2. Parse request parameters
    const body = await req.json()
    const {
      employeeId,
      name,
      designation,
      phone,
      email,
      photo_url,
      cover_url,
      lead_form_fields,
      dept_id
    } = body

    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required.' }, { status: 400 })
    }

    // 3. Permission checks
    // An employee can only update their own profile (session.orgId represents employee_id when role is employee)
    const isSelf = session.role === 'employee' && session.orgId === employeeId
    const isAdmin = session.role === 'org_admin'

    if (!isSelf && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to edit this profile.' }, { status: 403 })
    }

    // 4. Fetch the existing employee record
    const { data: existingEmployee, error: fetchError } = await supabaseData
      .from('employees')
      .select('email')
      .eq('id', employeeId)
      .single()

    if (fetchError || !existingEmployee) {
      return NextResponse.json({ error: 'Employee profile not found.' }, { status: 404 })
    }

    // 5. Update email in Supabase Auth if it has changed
    const targetEmail = email?.trim().toLowerCase()
    if (targetEmail && targetEmail !== existingEmployee.email.trim().toLowerCase()) {
      const { error: authError } = await supabaseAuth.auth.admin.updateUserById(employeeId, {
        email: targetEmail,
        email_confirm: true
      })

      if (authError) {
        return NextResponse.json({ error: `Auth credentials update failed: ${authError.message}` }, { status: 400 })
      }
    }

    // 6. Update employee record in database
    const updatePayload: any = {}
    if (name !== undefined) updatePayload.name = name.trim()
    if (designation !== undefined) updatePayload.designation = designation.trim()
    if (phone !== undefined) updatePayload.phone = phone.trim()
    if (targetEmail !== undefined) updatePayload.email = targetEmail
    if (photo_url !== undefined) updatePayload.photo_url = photo_url
    if (cover_url !== undefined) updatePayload.cover_url = cover_url
    if (lead_form_fields !== undefined) updatePayload.lead_form_fields = lead_form_fields
    if (dept_id !== undefined) updatePayload.dept_id = dept_id || null

    const { error: dbError } = await supabaseData
      .from('employees')
      .update(updatePayload)
      .eq('id', employeeId)

    if (dbError) {
      return NextResponse.json({ error: `Database profile update failed: ${dbError.message}` }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Profile updated successfully.' })
  } catch (err: any) {
    console.error('Error in employee profile update API:', err)
    return NextResponse.json({ error: err.message || 'Unexpected server error' }, { status: 500 })
  }
}
