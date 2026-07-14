import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { SESSION_COOKIE, verifySession } from '@/lib/session'
import { MensajesClient } from './mensajes-client'

export default async function MensajesPage() {
  const cookieStore = await cookies()
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value)

  const colaboradores = session
    ? await prisma.collaborator.findMany({
        where: { companyId: session.companyId, active: true },
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          name: true,
          phone: true,
          position: true,
        },
      })
    : []
  const company = session
    ? await prisma.company.findUnique({
        where: { id: session.companyId },
        select: {
          whatsappMode: true,
          whatsappPersonalPhone: true,
          whatsappPhoneNumberId: true,
        },
      })
    : null

  return (
    <MensajesClient
      colaboradores={colaboradores}
      whatsappMode={company?.whatsappMode || 'NORMAL'}
      whatsappPersonalPhone={company?.whatsappPersonalPhone || ''}
      whatsappBusinessConnected={Boolean(company?.whatsappPhoneNumberId)}
    />
  )
}
