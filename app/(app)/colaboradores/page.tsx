import { Plus, Search, MoreHorizontal, Phone } from 'lucide-react'

const colaboradores = [
  { name: 'María Álvarez', phone: '+34 612 345 678', role: 'Administradora', status: 'Activo' },
  { name: 'Carlos Ruiz', phone: '+34 623 456 789', role: 'Supervisor', status: 'Activo' },
  { name: 'Ana Torres', phone: '+34 634 567 890', role: 'Operario', status: 'Activo' },
  { name: 'Luis Méndez', phone: '+34 645 678 901', role: 'Operario', status: 'Inactivo' },
  { name: 'Sofía Díaz', phone: '+34 656 789 012', role: 'Supervisor', status: 'Activo' },
  { name: 'Diego Ramírez', phone: '+34 667 890 123', role: 'Operario', status: 'Activo' },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
}

export default function ColaboradoresPage() {
  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar colaborador…"
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

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Colaborador</th>
                <th className="px-5 py-3 font-medium">Teléfono (SMS)</th>
                <th className="px-5 py-3 font-medium">Rol</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {colaboradores.map((c) => (
                <tr key={c.phone} className="hover:bg-secondary/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                        {initials(c.name)}
                      </span>
                      <p className="font-medium text-foreground">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 font-mono text-foreground">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {c.phone}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{c.role}</td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        c.status === 'Activo'
                          ? 'inline-flex items-center gap-1.5 rounded-full bg-chart-3/15 px-2.5 py-0.5 text-xs font-medium text-chart-3'
                          : 'inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground'
                      }
                    >
                      <span
                        className={
                          c.status === 'Activo'
                            ? 'h-1.5 w-1.5 rounded-full bg-chart-3'
                            : 'h-1.5 w-1.5 rounded-full bg-muted-foreground'
                        }
                      />
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
                      aria-label={`Opciones de ${c.name}`}
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
