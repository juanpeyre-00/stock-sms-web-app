import { cookies } from 'next/headers'
import { Building2, Crown, ShieldCheck, TimerReset } from 'lucide-react'
import { MONTHLY_PRICE_LABEL, TRIAL_DAYS } from '@/lib/billing'
import { prisma } from '@/lib/prisma'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

export const dynamic = 'force-dynamic'

function planLabel(company: {
  lifetimeAccess: boolean
  plan: string
  monthlyPriceCents: number
}) {
  if (company.lifetimeAccess || company.plan === 'INTERNAL') {
    return 'Acceso interno'
  }

  if (company.plan === 'TRIAL') return `${TRIAL_DAYS} dias gratis`

  return `USD ${(company.monthlyPriceCents / 100).toFixed(2)}/mes`
}

function detailLabel(company: {
  lifetimeAccess: boolean
  plan: string
  monthlyPriceCents: number
}) {
  if (company.lifetimeAccess || company.plan === 'INTERNAL') {
    return 'Sin cobro visible para clientes'
  }

  if (company.plan === 'TRIAL') return `Luego ${MONTHLY_PRICE_LABEL}`

  return 'Suscripcion mensual'
}

function companyIcon(company: { lifetimeAccess: boolean; plan: string }) {
  if (company.lifetimeAccess || company.plan === 'INTERNAL') return Crown
  if (company.plan === 'TRIAL') return TimerReset
  return ShieldCheck
}

export default async function EmpresasPage() {
  const cookieStore = await cookies()
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value)
  const canSeeAllCompanies = session?.role === 'SUPERADMIN'
  const empresas = await prisma.company.findMany({
    where: canSeeAllCompanies ? undefined : { id: session?.companyId },
    orderBy: [{ lifetimeAccess: 'desc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      name: true,
      plan: true,
      status: true,
      monthlyPriceCents: true,
      trialEndsAt: true,
      lifetimeAccess: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Empresas y licencias
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {canSeeAllCompanies
            ? `Base comercial de StockSMS: cuentas internas, trials y empresas que luego pagan ${MONTHLY_PRICE_LABEL}.`
            : `Tu empresa tiene prueba de ${TRIAL_DAYS} dias y luego paga ${MONTHLY_PRICE_LABEL}.`}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {empresas.map((empresa) => {
          const Icon = companyIcon(empresa)
          return (
            <article
              key={empresa.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                  {empresa.status}
                </span>
              </div>
              <h2 className="mt-4 font-semibold text-foreground">
                {empresa.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-primary">
                {planLabel(empresa)}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {detailLabel(empresa)}
              </p>
              {empresa.trialEndsAt && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Trial hasta {empresa.trialEndsAt.toLocaleDateString('es-CL')}
                </p>
              )}
            </article>
          )
        })}
      </div>

      <section className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Regla de privacidad</h2>
        </div>
        <div className="grid gap-4 p-5 text-sm text-muted-foreground md:grid-cols-3">
          <p>
            Cada empresa solo puede ver sus propios colaboradores, stock,
            envios e historial.
          </p>
          <p>
            El acceso gratuito de Tololo vive en la base de datos y no se
            comunica en pantallas de clientes.
          </p>
          <p>
            Si una empresa no paga despues del trial, se bloquean acciones como
            enviar SMS o crear nuevos registros.
          </p>
        </div>
      </section>
    </div>
  )
}
