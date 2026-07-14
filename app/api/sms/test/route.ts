import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { SmsStatus } from '@/lib/generated/prisma/enums'
import { prisma } from '@/lib/prisma'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

function normalizePhone(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

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
  const phone = normalizePhone(String(body.phone || ''))
  const messageBody = String(body.body || '').trim()
  const collaboratorIds = Array.isArray(body.collaboratorIds)
    ? body.collaboratorIds.map((id) => String(id))
    : []

  if ((!phone && collaboratorIds.length === 0) || !messageBody) {
    return NextResponse.json(
      { ok: false, message: 'Selecciona destinatarios y mensaje.' },
      { status: 400 },
    )
  }

  if (phone && !phone.startsWith('+')) {
    return NextResponse.json(
      { ok: false, message: 'Usa formato internacional, por ejemplo +56 9 XXXX XXXX.' },
      { status: 400 },
    )
  }

  const recipients = []

  if (collaboratorIds.length > 0) {
    const collaborators = await prisma.collaborator.findMany({
      where: {
        companyId: session.companyId,
        id: { in: collaboratorIds },
        active: true,
      },
      select: { id: true, name: true, phone: true },
    })

    recipients.push(...collaborators)
  }

  if (phone) {
    const collaborator = await prisma.collaborator.upsert({
      where: {
        companyId_phone: {
          companyId: session.companyId,
          phone,
        },
      },
      update: {
        active: true,
        position: 'Numero de prueba',
      },
      create: {
        companyId: session.companyId,
        name: 'Telefono de prueba',
        phone,
        position: 'Numero de prueba',
      },
      select: { id: true, name: true, phone: true },
    })

    recipients.push(collaborator)
  }

  if (recipients.length === 0) {
    return NextResponse.json(
      { ok: false, message: 'No encontramos destinatarios activos.' },
      { status: 400 },
    )
  }

  const smsMessage = await prisma.smsMessage.create({
    data: {
      companyId: session.companyId,
      body: messageBody,
      status: SmsStatus.DRAFT,
      recipients: {
        create: recipients.map((recipient) => ({
          collaboratorId: recipient.id,
          phoneSnapshot: recipient.phone,
          status: SmsStatus.DRAFT,
        })),
      },
    },
  })

  return NextResponse.json({
    ok: true,
    message:
      'Campana preparada. Abre SMS o WhatsApp para confirmar cada envio.',
    smsMessageId: smsMessage.id,
    recipients,
  })
}
