import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'
import { SESSION_COOKIE, signSession } from '@/lib/session'

export async function POST(request: Request) {
  const { email, password } = await request.json().catch(() => ({
    email: '',
    password: '',
  }))

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, message: 'Ingresa correo y contraseña.' },
      { status: 400 },
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: String(email).trim().toLowerCase() },
    include: { company: true },
  })

  const validPassword =
    user && verifyPassword(String(password), user.passwordHash)

  if (!user || !validPassword || user.company.status === 'SUSPENDED') {
    return NextResponse.json(
      { ok: false, message: 'Correo o contraseña incorrectos.' },
      { status: 401 },
    )
  }

  const token = await signSession({
    userId: user.id,
    companyId: user.companyId,
    role: user.role,
    email: user.email,
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return NextResponse.json({ ok: true, redirectTo: '/dashboard' })
}
