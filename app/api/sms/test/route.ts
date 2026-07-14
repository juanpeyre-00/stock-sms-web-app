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

  if (!phone || !messageBody) {
    return NextResponse.json(
      { ok: false, message: 'Ingresa telefono y mensaje.' },
      { status: 400 },
    )
  }

  if (!phone.startsWith('+')) {
    return NextResponse.json(
      { ok: false, message: 'Usa formato internacional, por ejemplo +56 9 XXXX XXXX.' },
      { status: 400 },
    )
  }

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
  })

  const smsMessage = await prisma.smsMessage.create({
    data: {
      companyId: session.companyId,
      body: messageBody,
      status: SmsStatus.DRAFT,
      recipients: {
        create: {
          collaboratorId: collaborator.id,
          phoneSnapshot: phone,
          status: SmsStatus.DRAFT,
        },
      },
    },
  })

  return NextResponse.json({
    ok: true,
    message:
      'Prueba guardada. Falta conectar proveedor SMS para enviarla al telefono.',
    smsMessageId: smsMessage.id,
    phone,
  })
}
