import { cookies } from 'next/headers'
import { MoreHorizontal, Phone, Plus, Search } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

export const dynamic = 'force-dynamic'

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
}

export default async function ColaboradoresPage() {
  const cookieStore = await cookies()
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value)
  const colaboradores = await prisma.collaborator.findMany({
    where: { companyId: session?.companyId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      phone: true,
      position: true,
      active: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar colaborador..."
            className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
        </div>
        <button
          type="button"
          className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nuevo colaborador
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Colaborador</th>
                <th className="px-5 py-3 font-medium">Telefono SMS</th>
                <th className="px-5 py-3 font-medium">Rol</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {colaboradores.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-muted-foreground"
                  >
                    Aun no hay colaboradores en esta empresa.
                  </td>
                </tr>
              )}
              {colaboradores.map((colaborador) => (
                <tr key={colaborador.id} className="hover:bg-secondary/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                        {initials(colaborador.name)}
                      </span>
                      <p className="font-medium text-foreground">
                        {colaborador.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 font-mono text-foreground">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {colaborador.phone}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {colaborador.position ?? 'Colaborador'}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        colaborador.active
                          ? 'inline-flex items-center gap-1.5 rounded-full bg-chart-3/15 px-2.5 py-0.5 text-xs font-medium text-chart-3'
                          : 'inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground'
                      }
                    >
                      <span
                        className={
                          colaborador.active
                            ? 'h-1.5 w-1.5 rounded-full bg-chart-3'
                            : 'h-1.5 w-1.5 rounded-full bg-muted-foreground'
                        }
                      />
                      {colaborador.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
                      aria-label={`Opciones de ${colaborador.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
