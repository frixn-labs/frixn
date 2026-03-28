import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { org_id, employee_id, visitor_name, visitor_email, visitor_phone, visitor_company } = await request.json()
    
    const { data, error } = await supabase
      .from('leads')
      .insert({
        org_id,
        employee_id,
        visitor_name,
        visitor_email,
        visitor_phone,
        visitor_company,
        status: 'new'
      })
      .select()
      .single()

    if (error) throw error
    
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
