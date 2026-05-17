import { cookies } from 'next/headers'

export async function setSession(orgSlug: string, orgId: string, role: string = 'org_admin') {
  const cookieStore = await cookies()
  
  // 1. Store slug-specific session
  cookieStore.set(`tapconnect_session_${orgSlug}`, JSON.stringify({ orgId, orgSlug, role }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })

  // 2. Store global active slug pointer for security guards
  cookieStore.set(`tapconnect_active_slug`, orgSlug, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })
}

export async function getSession(orgSlug: string) {
  const cookieStore = await cookies()
  const session = cookieStore.get(`tapconnect_session_${orgSlug}`)
  if (!session) return null
  try {
    return JSON.parse(session.value)
  } catch {
    return null
  }
}

export async function clearSession() {
  const cookieStore = await cookies()
  const activeSlug = cookieStore.get('tapconnect_active_slug')?.value
  if (activeSlug) {
    cookieStore.delete(`tapconnect_session_${activeSlug}`)
  }
  cookieStore.delete(`tapconnect_active_slug`)
}
