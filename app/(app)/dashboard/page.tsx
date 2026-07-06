import { Package, AlertTriangle, TrendingUp, Users } from 'lucide-react'
import { StatCard } from '@/components/stat-card'

const stats = [
  {
    title: 'Productos en stock',
    value: '1,284',
    hint: '+3.2% vs. ayer',
    icon: Package,
    trend: 'up' as const,
  },
  {
    title: 'Stock bajo',
    value: '17',
    hint: 'Requieren reposición',
    icon: AlertTriangle,
    trend: 'down' as const,
  },
  {
    title: 'Movimientos hoy',
    value: '92',
    hint: '+12 vs. promedio',
    icon: TrendingUp,
    trend: 'up' as const,
  },
  {
    title: 'Colaboradores activos',
    value: '8',
    hint: '2 conectados ahora',
    icon: Users,
  },
]

const recentActivity = [
  { user: 'Carlos Ruiz', action: 'Registró conteo de merluza austral', time: 'Hace 5 min' },
  { user: 'Ana Torres', action: 'Ajustó stock de "Choritos de Magallanes"', time: 'Hace 22 min' },
  { user: 'Luis Méndez', action: 'Cerró el inventario del turno', time: 'Hace 1 h' },
  { user: 'Sofía Díaz', action: 'Agregó producto "Reineta fresca"', time: 'Hace 2 h' },
  { user: 'María Álvarez', action: 'Envió alerta SMS de congrio dorado', time: 'Hace 3 h' },
]

const lowStock = [
  { name: 'Merluza austral', current: 12, min: 50 },
  { name: 'Locos chilenos', current: 18, min: 60 },
  { name: 'Reineta fresca', current: 21, min: 40 },
  { name: 'Congrio dorado', current: 4, min: 25 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Actividad reciente */}
        <div className="rounded-xl border border-border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold text-foreground">Actividad reciente</h2>
            <span className="text-sm font-medium text-primary">Ver todo</span>
          </div>
          <ul className="divide-y divide-border">
            {recentActivity.map((item, i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  {item.user
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.user}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {item.action}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stock bajo */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold text-foreground">Stock bajo</h2>
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              {lowStock.length} alertas
            </span>
          </div>
          <ul className="space-y-4 p-5">
            {lowStock.map((item) => {
              const pct = Math.min(100, Math.round((item.current / item.min) * 100))
              return (
                <li key={item.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {item.name}
                    </span>
                    <span className="text-muted-foreground">
                      {item.current}/{item.min}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-destructive"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
