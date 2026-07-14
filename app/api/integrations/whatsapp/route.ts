import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value)

  if (!session) {
    return NextResponse.json(
      { ok: false, message: 'Debes iniciar sesion.' },
      { status: 401 },
    )
  }

  const body = await request.json().catch(() => ({}))
  const whatsappAccessToken = String(body.whatsappAccessToken || '').trim()
  const whatsappPhoneNumberId = String(body.whatsappPhoneNumberId || '').trim()
  const whatsappDisplayName = String(body.whatsappDisplayName || '').trim()
  const whatsappPersonalPhone = String(body.whatsappPersonalPhone || '').trim()
  const whatsappMode =
    String(body.whatsappMode || 'NORMAL') === 'BUSINESS_API'
      ? 'BUSINESS_API'
      : 'NORMAL'

  if (whatsappMode === 'BUSINESS_API' && (!whatsappAccessToken || !whatsappPhoneNumberId)) {
    return NextResponse.json(
      { ok: false, message: 'Ingresa token y phone number id.' },
      { status: 400 },
    )
  }

  if (whatsappMode === 'NORMAL' && !whatsappPersonalPhone) {
    return NextResponse.json(
      { ok: false, message: 'Ingresa el WhatsApp normal de la empresa.' },
      { status: 400 },
    )
  }

  await prisma.company.update({
    where: { id: session.companyId },
    data: {
      whatsappAccessToken: whatsappMode === 'BUSINESS_API' ? whatsappAccessToken : null,
      whatsappPhoneNumberId: whatsappMode === 'BUSINESS_API' ? whatsappPhoneNumberId : null,
      whatsappDisplayName: whatsappDisplayName || null,
      whatsappMode,
      whatsappPersonalPhone: whatsappMode === 'NORMAL' ? whatsappPersonalPhone : null,
      whatsappConnectedAt: new Date(),
    },
  })

  return NextResponse.json({
    ok: true,
    message:
      whatsappMode === 'BUSINESS_API'
        ? 'WhatsApp Business conectado para esta empresa.'
        : 'WhatsApp normal guardado para esta empresa.',
  })
}
