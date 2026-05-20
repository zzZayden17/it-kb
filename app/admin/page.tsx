import { cookies } from 'next/headers'
import crypto from 'crypto'
import AdminChat from './AdminChat'
import LoginForm from './LoginForm'

// Must match the token written by /api/auth. If ADMIN_PASSWORD changes,
// all existing cookies become invalid automatically.
function sessionToken() {
  return crypto
    .createHmac('sha256', process.env.ADMIN_PASSWORD ?? '')
    .update('it-kb-admin-session')
    .digest('hex')
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  const authenticated = !!session && session === sessionToken()

  return authenticated ? <AdminChat /> : <LoginForm />
}
