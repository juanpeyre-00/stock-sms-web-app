import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CompanyPlan, CompanyStatus, UserRole } from '@/lib/generated/prisma/enums'
import { MONTHLY_PRICE_CENTS, getTrialEndsAt } from '@/lib/billing'
import { hashPassword } from '@/lib/password'
import { prisma } from '@/lib/prisma'
import { SESSION_COOKIE, signSession } from '@/lib/session'

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

async function uniqueCompanySlug(companyName: string) {
  const base = slugify(companyName) || `empresa-${Date.now()}`
  let slug = base
  let suffix = 2

  while (await prisma.company.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix}`
    suffix += 1
  }

  return slug
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const companyName = String(body.companyName || '').trim()
  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  if (!companyName || !name || !email || !password) {
    return NextResponse.json(
      { ok: false, message: 'Completa empresa, nombre, correo y clave.' },
      { status: 400 },
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, message: 'La clave debe tener al menos 8 caracteres.' },
      { status: 400 },
    )
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    return NextResponse.json(
      { ok: false, message: 'Ese correo ya tiene cuenta. Entra desde login.' },
      { status: 409 },
    )
  }

  const slug = await uniqueCompanySlug(companyName)
  const passwordHash = hashPassword(password)

  const result = await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name: companyName,
        slug,
        plan: CompanyPlan.TRIAL,
        status: CompanyStatus.TRIALING,
        monthlyPriceCents: MONTHLY_PRICE_CENTS,
        trialEndsAt: getTrialEndsAt(),
        internalNotes:
          'Cuenta creada desde el formulario publico de contratacion.',
        subscriptionEvents: {
          create: {
            type: 'trial_started',
            amountCents: MONTHLY_PRICE_CENTS,
            metadata: { source: 'public_signup' },
          },
        },
      },
    })

    const user = await tx.user.create({
      data: {
        companyId: company.id,
        name,
        email,
        passwordHash,
        role: UserRole.OWNER,
      },
    })

    return { company, user }
  })

  const token = await signSession({
    userId: result.user.id,
    companyId: result.company.id,
    role: result.user.role,
    email: result.user.email,
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return NextResponse.json({
    ok: true,
    redirectTo: '/dashboard',
    company: {
      name: result.company.name,
      trialEndsAt: result.company.trialEndsAt,
      monthlyPriceCents: result.company.monthlyPriceCents,
    },
  })
}
