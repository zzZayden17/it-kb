import { cookies } from 'next/headers'
import crypto from 'crypto'

// Derives a stable session token from ADMIN_PASSWORD so the raw password is
// never stored in the cookie. The HMAC key is the password itself — if the
// password changes, all existing sessions are automatically invalidated.
function sessionToken() {
  return crypto
    .createHmac('sha256', process.env.ADMIN_PASSWORD ?? '')
    .update('it-kb-admin-session')
    .digest('hex')
}

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password: unknown }

  const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? '')
  const given = Buffer.from(typeof password === 'string' ? password : '')

  // timingSafeEqual prevents timing attacks. It requires equal-length buffers,
  // so we reject immediately if lengths differ (no need to compare at all).
  const match =
    expected.length > 0 &&
    expected.length === given.length &&
    crypto.timingSafeEqual(expected, given)

  if (!match) {
    return Response.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_session', sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return Response.json({ ok: true })
}
