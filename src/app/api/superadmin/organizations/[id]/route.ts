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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { plan, status } = body

    if (!plan && !status) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    // Fetch current org to check status transition
    const { data: currentOrg, error: fetchError } = await supabaseData
      .from('organizations')
      .select('status')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const updateData: any = {}
    if (plan) updateData.plan = plan
    if (status) updateData.status = status

    // If changing from setup to active, calculate and set max_employees
    if (currentOrg.status === 'setup' && status === 'active') {
      const { count } = await supabaseData
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', id)
        
      updateData.max_employees = count || 0
    }

    const { data, error } = await supabaseData
      .from('organizations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 1. Delete from organizations table
    // Note: If cascading is set up, this might delete everything. 
    // If not, we might need to delete related data manually.
    // Based on the 'create-organization' route, organization.id = auth.users.id
    
    const { error: dbError } = await supabaseData
      .from('organizations')
      .delete()
      .eq('id', id)

    if (dbError) {
      return NextResponse.json({ error: `DB deletion failed: ${dbError.message}` }, { status: 400 })
    }

    // 2. Delete the Auth User
    const { error: authError } = await supabaseAuth.auth.admin.deleteUser(id)

    if (authError) {
      // Even if auth deletion fails, the organization record is gone from the 'frixn' schema.
      // But we should report it.
      return NextResponse.json({ error: `Auth deletion failed: ${authError.message}` }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Organization and admin user deleted successfully' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 })
  }
}
