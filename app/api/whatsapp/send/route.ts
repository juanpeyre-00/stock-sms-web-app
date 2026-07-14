import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { SmsStatus } from '@/lib/generated/prisma/enums'
import { prisma } from '@/lib/prisma'
import { SESSION_COOKIE, verifySession } from '@/lib/session'
import { sendWhatsAppText } from '@/lib/whatsapp'

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
  const collaboratorIds = Array.isArray(body.collaboratorIds)
    ? body.collaboratorIds.map((id) => String(id))
    : []
  const messageBody = String(body.body || '').trim()

  if (collaboratorIds.length === 0 || !messageBody) {
    return NextResponse.json(
      { ok: false, message: 'Selecciona colaboradores y mensaje.' },
      { status: 400 },
    )
  }

  const company = await prisma.company.findUnique({
    where: { id: session.companyId },
    select: {
      whatsappAccessToken: true,
      whatsappPhoneNumberId: true,
      whatsappDisplayName: true,
    },
  })

  if (!company?.whatsappAccessToken || !company.whatsappPhoneNumberId) {
    return NextResponse.json(
      {
        ok: false,
        message:
          'Esta empresa todavia no conecto su WhatsApp Business. Ve a Integraciones y conecta su cuenta.',
      },
      { status: 503 },
    )
  }

  const collaborators = await prisma.collaborator.findMany({
    where: {
      companyId: session.companyId,
      id: { in: collaboratorIds },
      active: true,
    },
    select: { id: true, name: true, phone: true },
  })

  if (collaborators.length === 0) {
    return NextResponse.json(
      { ok: false, message: 'No encontramos colaboradores activos.' },
      { status: 400 },
    )
  }

  const campaign = await prisma.smsMessage.create({
    data: {
      companyId: session.companyId,
      body: messageBody,
      status: SmsStatus.QUEUED,
      recipients: {
        create: collaborators.map((collaborator) => ({
          collaboratorId: collaborator.id,
          phoneSnapshot: collaborator.phone,
          status: SmsStatus.QUEUED,
        })),
      },
    },
    include: { recipients: true },
  })

  const results = []

  for (const collaborator of collaborators) {
    const sendResult = await sendWhatsAppText({
      to: collaborator.phone,
      body: messageBody,
      accessToken: company.whatsappAccessToken,
      phoneNumberId: company.whatsappPhoneNumberId,
    })

    const status = sendResult.ok ? SmsStatus.SENT : SmsStatus.FAILED
    const sentAt = sendResult.ok ? new Date() : null

    await prisma.smsRecipient.updateMany({
      where: {
        smsMessageId: campaign.id,
        collaboratorId: collaborator.id,
      },
      data: {
        status,
        providerId: sendResult.providerId,
        errorMessage: sendResult.error,
        sentAt,
      },
    })

    results.push({
      collaboratorId: collaborator.id,
      name: collaborator.name,
      phone: collaborator.phone,
      status,
      error: sendResult.error,
    })
  }

  const sentCount = results.filter((result) => result.status === SmsStatus.SENT)
    .length
  const failedCount = results.length - sentCount

  await prisma.smsMessage.update({
    where: { id: campaign.id },
    data: {
      status: failedCount === 0 ? SmsStatus.SENT : SmsStatus.FAILED,
      sentAt: sentCount > 0 ? new Date() : null,
    },
  })

  return NextResponse.json({
    ok: failedCount === 0,
    message:
      failedCount === 0
        ? `WhatsApp enviado a ${sentCount} colaboradores.`
        : `Enviados: ${sentCount}. Fallidos: ${failedCount}.`,
    results,
  })
}
