import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { SESSION_COOKIE, verifySession } from '@/lib/session'
import { WhatsAppIntegrationForm } from './whatsapp-integration-form'

export default async function IntegracionesPage() {
  const cookieStore = await cookies()
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value)

  const company = session
    ? await prisma.company.findUnique({
        where: { id: session.companyId },
        select: {
          whatsappPhoneNumberId: true,
          whatsappDisplayName: true,
          whatsappMode: true,
          whatsappPersonalPhone: true,
          whatsappConnectedAt: true,
        },
      })
    : null

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm font-medium text-primary">WhatsApp Business</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">
          Conecta el WhatsApp de esta empresa.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        Cada cuenta conecta su propio WhatsApp Business. Los mensajes salen
          desde el canal de esa empresa hacia sus colaboradores registrados.
        </p>
      </section>

      <WhatsAppIntegrationForm
        connected={Boolean(company?.whatsappPhoneNumberId)}
        displayName={company?.whatsappDisplayName || ''}
        phoneNumberId={company?.whatsappPhoneNumberId || ''}
        mode={company?.whatsappMode || 'NORMAL'}
        personalPhone={company?.whatsappPersonalPhone || ''}
        connectedAt={company?.whatsappConnectedAt?.toISOString() || ''}
      />
    </div>
  )
}
