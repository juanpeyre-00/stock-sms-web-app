import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { MONTHLY_PRICE_CENTS } from '@/lib/billing'
import { prisma } from '@/lib/prisma'
import { getAppUrl, getStripe } from '@/lib/stripe'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

export async function POST() {
  const cookieStore = await cookies()
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value)

  if (!session) {
    return NextResponse.json(
      { ok: false, message: 'Debes iniciar sesion.' },
      { status: 401 },
    )
  }

  const company = await prisma.company.findUnique({
    where: { id: session.companyId },
    include: { users: { where: { id: session.userId }, take: 1 } },
  })

  if (!company) {
    return NextResponse.json(
      { ok: false, message: 'Empresa no encontrada.' },
      { status: 404 },
    )
  }

  const ownerEmail = company.users[0]?.email || session.email

  let stripe
  try {
    stripe = getStripe()
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          'Stripe todavia no esta configurado. La cuenta fue creada, pero falta activar pagos.',
      },
      { status: 503 },
    )
  }

  const appUrl = getAppUrl()

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: company.stripeCustomerId ? undefined : ownerEmail,
    customer: company.stripeCustomerId || undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: MONTHLY_PRICE_CENTS,
          recurring: { interval: 'month' },
          product_data: {
            name: 'StockSMS Pro',
            description: 'Gestion de inventario, colaboradores y alertas SMS.',
          },
        },
      },
    ],
    subscription_data: {
      trial_period_days: 7,
      metadata: {
        companyId: company.id,
        source: 'stocksms_checkout',
      },
    },
    metadata: {
      companyId: company.id,
      userId: session.userId,
    },
    success_url: `${appUrl}/pago/exito?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pago/cancelado`,
  })

  await prisma.subscriptionEvent.create({
    data: {
      companyId: company.id,
      type: 'checkout_started',
      amountCents: MONTHLY_PRICE_CENTS,
      metadata: {
        stripeCheckoutSessionId: checkoutSession.id,
      },
    },
  })

  return NextResponse.json({ ok: true, url: checkoutSession.url })
}
