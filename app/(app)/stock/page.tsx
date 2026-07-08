import { Plus, Calendar, Search, Filter } from 'lucide-react'

const productos = [
  { sku: 'MER-AUS', name: 'Merluza austral', category: 'Pescado', stock: 12, min: 50, unit: 'kg' },
  { sku: 'SAL-PAC', name: 'Salmón del Pacífico', category: 'Pescado', stock: 84, min: 40, unit: 'kg' },
  { sku: 'REI-FRE', name: 'Reineta fresca', category: 'Pescado', stock: 21, min: 40, unit: 'kg' },
  { sku: 'CON-DOR', name: 'Congrio dorado', category: 'Pescado', stock: 4, min: 25, unit: 'kg' },
  { sku: 'CHO-MAG', name: 'Choritos de Magallanes', category: 'Marisco', stock: 340, min: 100, unit: 'kg' },
  { sku: 'LOC-CHI', name: 'Locos chilenos', category: 'Marisco', stock: 18, min: 60, unit: 'docenas' },
  { sku: 'CEN-MAG', name: 'Centolla magallánica', category: 'Marisco', stock: 95, min: 40, unit: 'uds' },
  { sku: 'ERZ-ROJ', name: 'Erizos rojos', category: 'Marisco', stock: 52, min: 30, unit: 'docenas' },
  { sku: 'MAC-ARE', name: 'Machas de arena', category: 'Marisco', stock: 210, min: 80, unit: 'kg' },
]

function estado(stock: number, min: number) {
  if (stock < min) return { label: 'Bajo', cls: 'bg-destructive/10 text-destructive' }
  if (stock < min * 1.5) return { label: 'Medio', cls: 'bg-chart-4/15 text-chart-4' }
  return { label: 'Óptimo', cls: 'bg-chart-3/15 text-chart-3' }
}

export default function StockPage() {
  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="capitalize">{today}</span>
        </div>
        <button
          type="button"
          className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Registrar conteo
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar producto o SKU…"
            className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
        </div>
        <button
          type="button"
          className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-secondary"
        >
          <Filter className="h-4 w-4 text-muted-foreground" />
          Categoría
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Producto</th>
                <th className="px-5 py-3 font-medium">Categoría</th>
                <th className="px-5 py-3 font-medium">Stock actual</th>
                <th className="px-5 py-3 font-medium">Mínimo</th>
                <th className="px-5 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {productos.map((p) => {
                const e = estado(p.stock, p.min)
                return (
                  <tr key={p.sku} className="hover:bg-secondary/50">
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                      {p.sku}
                    </td>
                    <td className="px-5 py-4 font-medium text-foreground">
                      {p.name}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {p.category}
                    </td>
                    <td className="px-5 py-4 text-foreground">
                      {p.stock} {p.unit}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {p.min} {p.unit}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${e.cls}`}
                      >
                        {e.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
