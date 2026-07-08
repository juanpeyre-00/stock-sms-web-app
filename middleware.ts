import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

const privateRoutes = [
  '/dashboard',
  '/colaboradores',
  '/stock',
  '/mensajes',
  '/empresas',
  '/historial',
]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value)
  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

  if (isPrivateRoute && !session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (pathname === '/' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/colaboradores/:path*',
    '/stock/:path*',
    '/mensajes/:path*',
    '/empresas/:path*',
    '/historial/:path*',
  ],
}
