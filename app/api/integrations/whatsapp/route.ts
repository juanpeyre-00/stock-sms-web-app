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

  if (!whatsappAccessToken || !whatsappPhoneNumberId) {
    return NextResponse.json(
      { ok: false, message: 'Ingresa token y phone number id.' },
      { status: 400 },
    )
  }

  await prisma.company.update({
    where: { id: session.companyId },
    data: {
      whatsappAccessToken,
      whatsappPhoneNumberId,
      whatsappDisplayName: whatsappDisplayName || null,
      whatsappConnectedAt: new Date(),
    },
  })

  return NextResponse.json({
    ok: true,
    message: 'WhatsApp Business conectado para esta empresa.',
  })
}
