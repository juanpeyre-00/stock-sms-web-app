import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'stocksms_session'
const protectedRoutes = [
  '/dashboard',
  '/colaboradores',
  '/stock',
  '/mensajes',
  '/empresas',
  '/historial',
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value)

  if (hasSession) {
    return NextResponse.next()
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/login'
  loginUrl.searchParams.set('next', pathname)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/colaboradores/:path*',
    '/stock/:path*',
    '/mensajes/:path*',
    '/empresas/:path*',
    '/historial/:path*',
  ],
}
