import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 })
    }

    // Fetch org_id from the employee before deleting
    const { data: empData } = await supabaseData
      .from('employees')
      .select('org_id')
      .eq('id', id)
      .single()

    // 1. Delete all related database records first (cascade manual cleanup)
    await supabaseData.from('taps').delete().eq('employee_id', id)
    await supabaseData.from('leads').delete().eq('employee_id', id)
    await supabaseData.from('nfc_cards').delete().eq('employee_id', id)
    await supabaseData.from('notification_settings').delete().eq('employee_id', id)

    // 2. Delete employee record from custom schema
    const { error: dbError } = await supabaseData
      .from('employees')
      .delete()
      .eq('id', id)

    if (dbError) {
      return NextResponse.json({ error: `Database deletion failed: ${dbError.message}` }, { status: 400 })
    }

    // 3. Recalculate and update organization's max_employees count
    if (empData?.org_id) {
      const { count: remainingCount } = await supabaseData
        .from('employees')
        .select('id', { count: 'exact', head: true })
        .eq('org_id', empData.org_id)

      await supabaseData
        .from('organizations')
        .update({ max_employees: remainingCount || 0 })
        .eq('id', empData.org_id)
    }

    // 4. Delete auth user from auth.users (requires Service Role Key)
    const { error: authError } = await supabaseAuth.auth.admin.deleteUser(id)

    if (authError) {
      return NextResponse.json({ error: `Auth deletion failed: ${authError.message}` }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Employee and auth user deleted successfully' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 })
  }
}
