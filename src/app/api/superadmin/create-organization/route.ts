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
      name, slug, logo_url,
      brand_color, accent_color, plan, max_employees,
      admin_name, admin_email, admin_password, admin_phone, status,
    } = body

    // ── Validate required fields ─────────────────────────────────────────────
    if (!name?.trim())          return NextResponse.json({ error: 'Organization name is required.' }, { status: 400 })
    if (!slug?.trim())          return NextResponse.json({ error: 'Slug is required.' }, { status: 400 })
    if (!admin_email?.trim())   return NextResponse.json({ error: 'Admin email is required.' }, { status: 400 })
    if (!admin_password?.trim()) return NextResponse.json({ error: 'Admin password is required (min 8 chars).' }, { status: 400 })
    if (admin_password.length < 8) return NextResponse.json({ error: 'Admin password must be at least 8 characters.' }, { status: 400 })

    // ── Step 1: Create Supabase auth user ────────────────────────────────────
    const { data: authUser, error: authError } = await supabaseAuth.auth.admin.createUser({
      email: admin_email.trim().toLowerCase(),
      password: admin_password,
      email_confirm: true,          // skip email confirmation
      user_metadata: {
        role: 'org_admin',
        org_slug: slug.trim(),
        full_name: admin_name?.trim() || '',
      },
    })

    if (authError) {
      return NextResponse.json({ error: `Auth error: ${authError.message}` }, { status: 400 })
    }

    const uid = authUser.user.id

    // ── Step 2: Insert organization with org.id = auth uid ───────────────────
    const { data: org, error: orgError } = await supabaseData
      .from('organizations')
      .insert([{
        id: uid,                                          // link org.id → auth.users.id
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        logo_url: logo_url || null,
        brand_color: brand_color || '#1A3C6E',
        accent_color: accent_color || '#E8A020',
        plan: plan || 'starter',
        max_employees: parseInt(max_employees) || 50,
        admin_name: admin_name?.trim() || null,
        admin_email: admin_email.trim().toLowerCase(),
        admin_phone: admin_phone?.trim() || null,
        status: status || 'setup',
      }])
      .select()
      .single()

    if (orgError) {
      // Rollback: delete the auth user we just created
      await supabaseAuth.auth.admin.deleteUser(uid)
      return NextResponse.json({ error: `DB error: ${orgError.message}` }, { status: 400 })
    }

    return NextResponse.json({ success: true, org })

  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Unexpected error' }, { status: 500 })
  }
}
