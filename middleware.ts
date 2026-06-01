import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow the login page without auth
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Protect all /admin and /api/admin routes
  const token = await getToken({ req: request })
  if (!token) {
    // API routes must get a JSON 401 — not an HTML redirect.
    // The browser's fetch() would follow the redirect, receive HTML, and
    // then fail JSON.parse(), showing a confusing "Network error" to the admin.
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
