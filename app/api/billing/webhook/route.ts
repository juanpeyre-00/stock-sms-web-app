import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { CompanyPlan, CompanyStatus } from '@/lib/generated/prisma/enums'
import { MONTHLY_PRICE_CENTS } from '@/lib/billing'
import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

function getCompanyIdFromSubscription(subscription: Stripe.Subscription) {
  return subscription.metadata?.companyId
}

async function activateCompany({
  companyId,
  customerId,
  subscriptionId,
  eventType,
}: {
  companyId: string
  customerId?: string | null
  subscriptionId?: string | null
  eventType: string
}) {
  await prisma.company.update({
    where: { id: companyId },
    data: {
      plan: CompanyPlan.PRO,
      status: CompanyStatus.ACTIVE,
      stripeCustomerId: customerId || undefined,
      stripeSubscriptionId: subscriptionId || undefined,
      subscriptionEvents: {
        create: {
          type: eventType,
          amountCents: MONTHLY_PRICE_CENTS,
          metadata: { customerId, subscriptionId },
        },
      },
    },
  })
}

async function markCompanyPastDue({
  companyId,
  eventType,
  subscriptionId,
}: {
  companyId: string
  eventType: string
  subscriptionId?: string | null
}) {
  await prisma.company.update({
    where: { id: companyId },
    data: {
      status: CompanyStatus.PAST_DUE,
      subscriptionEvents: {
        create: {
          type: eventType,
          amountCents: MONTHLY_PRICE_CENTS,
          metadata: { subscriptionId },
        },
      },
    },
  })
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return NextResponse.json(
      { ok: false, message: 'STRIPE_WEBHOOK_SECRET is not configured' },
      { status: 500 },
    )
  }

  const stripe = getStripe()
  const signature = request.headers.get('stripe-signature')
  const rawBody = await request.text()

  if (!signature) {
    return NextResponse.json(
      { ok: false, message: 'Missing Stripe signature' },
      { status: 400 },
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Invalid Stripe signature' },
      { status: 400 },
    )
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const companyId = session.metadata?.companyId

    if (companyId) {
      await activateCompany({
        companyId,
        customerId:
          typeof session.customer === 'string' ? session.customer : undefined,
        subscriptionId:
          typeof session.subscription === 'string'
            ? session.subscription
            : undefined,
        eventType: 'checkout_completed',
      })
    }
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice
    const subscriptionId =
      typeof invoice.parent?.subscription_details?.subscription === 'string'
        ? invoice.parent.subscription_details.subscription
        : typeof invoice.subscription === 'string'
          ? invoice.subscription
          : null

    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const companyId = getCompanyIdFromSubscription(subscription)

      if (companyId) {
        await activateCompany({
          companyId,
          customerId:
            typeof subscription.customer === 'string'
              ? subscription.customer
              : undefined,
          subscriptionId: subscription.id,
          eventType: 'invoice_payment_succeeded',
        })
      }
    }
  }

  if (
    event.type === 'invoice.payment_failed' ||
    event.type === 'customer.subscription.deleted'
  ) {
    const object = event.data.object as Stripe.Invoice | Stripe.Subscription
    const subscriptionId =
      'subscription' in object && typeof object.subscription === 'string'
        ? object.subscription
        : 'id' in object && event.type === 'customer.subscription.deleted'
          ? object.id
          : null

    if (subscriptionId) {
      const subscription =
        event.type === 'customer.subscription.deleted'
          ? (object as Stripe.Subscription)
          : await stripe.subscriptions.retrieve(subscriptionId)
      const companyId = getCompanyIdFromSubscription(subscription)

      if (companyId) {
        await markCompanyPastDue({
          companyId,
          subscriptionId,
          eventType: event.type,
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
