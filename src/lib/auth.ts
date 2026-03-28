import { cookies } from 'next/headers'

export async function setSession(orgSlug: string, orgId: string) {
  const cookieStore = await cookies()
  // Store session as a JSON string in an HTTP-only cookie
  // Scoped to the current session (no maxAge = expires on browser close)
  cookieStore.set(`tapconnect_session_${orgSlug}`, JSON.stringify({ orgId, orgSlug }), {
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

export async function clearSession(orgSlug: string) {
  const cookieStore = await cookies()
  cookieStore.delete(`tapconnect_session_${orgSlug}`)
}
