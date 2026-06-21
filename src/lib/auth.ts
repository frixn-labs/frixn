import { cookies } from 'next/headers'

export async function setSession(orgSlug: string, orgId: string, role: string = 'org_admin', accessToken?: string) {
  const cookieStore = await cookies()
  
  // 1. Store slug-specific session
  cookieStore.set(`frixn_session_${orgSlug}`, JSON.stringify({ orgId, orgSlug, role, accessToken }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })

  // 2. Store global active slug pointer for security guards
  cookieStore.set(`frixn_active_slug`, orgSlug, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })
}

export async function getSession(orgSlug: string) {
  const cookieStore = await cookies()
  const session = cookieStore.get(`frixn_session_${orgSlug}`)
  if (!session) return null
  try {
    return JSON.parse(session.value)
  } catch {
    return null
  }
}

export async function clearSession() {
  const cookieStore = await cookies()
  const activeSlug = cookieStore.get('frixn_active_slug')?.value
  if (activeSlug) {
    cookieStore.delete(`frixn_session_${activeSlug}`)
  }
  cookieStore.delete(`frixn_active_slug`)
}
