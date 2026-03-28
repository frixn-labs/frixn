import { NextResponse } from 'next/server'
import { setSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { orgId, orgSlug } = await request.json()
    
    // Set the cookie via the server component utility
    await setSession(orgSlug, orgId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
