import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Admin client — auth operations (no schema override needed)
const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Admin client — tapconnect schema data operations
const supabaseData = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { db: { schema: 'tapconnect' } }
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      org_id, name, email, password,
      designation, phone, employee_code, is_active, photo_url
    } = body

    // ── Validate required fields ─────────────────────────────────────────────
    if (!org_id) return NextResponse.json({ error: 'Organization is required.' }, { status: 400 })
    if (!name?.trim()) return NextResponse.json({ error: 'Employee name is required.' }, { status: 400 })
    if (!email?.trim()) return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    if (!password?.trim()) return NextResponse.json({ error: 'Password is required (min 8 chars).' }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })

    // ── Step 1: Create Supabase auth user ────────────────────────────────────
    const { data: authUser, error: authError } = await supabaseAuth.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password: password,
      email_confirm: true,          // skip email confirmation
      user_metadata: {
        role: 'employee',
        full_name: name.trim(),
      },
    })

    if (authError) {
      return NextResponse.json({ error: `Auth error: ${authError.message}` }, { status: 400 })
    }

    const uid = authUser.user.id

    // ── Step 2: Insert employee with employee.id = auth uid ──────────────────
    const { data: employee, error: empError } = await supabaseData
      .from('employees')
      .insert([{
        id: uid,                                          // link employee.id → auth.users.id
        org_id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        designation: designation?.trim() || null,
        phone: phone?.trim() || null,
        employee_code: employee_code?.trim() || null,
        is_active: is_active ?? true,
        photo_url: photo_url || null,
      }])
      .select()
      .single()

    if (empError) {
      // Rollback: delete the auth user we just created
      await supabaseAuth.auth.admin.deleteUser(uid)
      return NextResponse.json({ error: `DB error: ${empError.message}` }, { status: 400 })
    }

    // ── Step 3: Provision NFC Card ───────────────────────────────────────────
    // Generate random alphanumeric UID (e.g. B7C90D6E8F2A77)
    const cardUid = Array.from({ length: 14 }, () =>
      '0123456789ABCDEF'[Math.floor(Math.random() * 16)]
    ).join('')

    // Generate card code (frx-XXXXXX)
    const cardCode = `frx-${Math.floor(100000 + Math.random() * 900000)}`

    // Construct card URL
    const orgSlug = body.org_slug || 'unnamed'
    const cardUrl = `https://www.frixn.in/sites/${orgSlug}/${uid}`

    const { error: cardError } = await supabaseData
      .from('nfc_cards')
      .insert([{
        org_id,
        employee_id: uid,
        uid: cardUid,
        card_code: cardCode,
        chip_type: 'NFC216',
        status: 'active',
        is_locked: true,
        activated_at: new Date().toISOString(),
        card_url: cardUrl
      }])

    if (cardError) {
      // Rollback: delete the employee and the auth user
      await supabaseData.from('employees').delete().eq('id', uid)
      await supabaseAuth.auth.admin.deleteUser(uid)
      return NextResponse.json({ error: `NFC Card error: ${cardError.message}` }, { status: 400 })
    }

    // ── Step 4: Insert default notification settings for employee ────────────
    const { error: notifError } = await supabaseData
      .from('notification_settings')
      .insert([{
        org_id: null,
        employee_id: uid,
        leads: true,
        taps: true,
        nfc_cards: true,
        daily_pulse: false,
        weekly_roundup: false,
        monthly_digest: false,
        invoices_receipts: false,
        upcoming_bills: false,
        additional_recipients: [email.trim().toLowerCase()]
      }])

    if (notifError) {
      // Rollback: delete nfc_cards, employees, and auth user
      await supabaseData.from('nfc_cards').delete().eq('employee_id', uid)
      await supabaseData.from('employees').delete().eq('id', uid)
      await supabaseAuth.auth.admin.deleteUser(uid)
      return NextResponse.json({ error: `Notification Settings DB error: ${notifError.message}` }, { status: 400 })
    }

    return NextResponse.json({ success: true, employee, cardUrl })

  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Unexpected error' }, { status: 500 })
  }
}
