import { ArrowDownRight, ArrowUpRight, RotateCcw, Download } from 'lucide-react'

const movimientos = [
  { id: 'MV-1042', date: '01 Jul 2026 · 14:20', type: 'Entrada', product: 'Bolsas 30 L', qty: '+200 uds', user: 'Carlos Ruiz' },
  { id: 'MV-1041', date: '01 Jul 2026 · 11:05', type: 'Salida', product: 'Film stretch', qty: '-15 rollos', user: 'Ana Torres' },
  { id: 'MV-1040', date: '01 Jul 2026 · 09:42', type: 'Ajuste', product: 'Etiquetas kraft', qty: '-3 paq', user: 'Sofía Díaz' },
  { id: 'MV-1039', date: '30 Jun 2026 · 17:30', type: 'Entrada', product: 'Guantes nitrilo', qty: '+120 paq', user: 'Luis Méndez' },
  { id: 'MV-1038', date: '30 Jun 2026 · 15:12', type: 'Salida', product: 'Cajas 20x20 cm', qty: '-38 uds', user: 'Diego Ramírez' },
  { id: 'MV-1037', date: '30 Jun 2026 · 10:00', type: 'Ajuste', product: 'Cinta de embalaje', qty: '+5 rollos', user: 'María Álvarez' },
]

const typeStyles: Record<
  string,
  { icon: typeof ArrowUpRight; cls: string }
> = {
  Entrada: { icon: ArrowDownRight, cls: 'bg-chart-3/15 text-chart-3' },
  Salida: { icon: ArrowUpRight, cls: 'bg-destructive/10 text-destructive' },
  Ajuste: { icon: RotateCcw, cls: 'bg-chart-4/15 text-chart-4' },
}

export default function HistorialPage() {
  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {['Todos', 'Entradas', 'Salidas', 'Ajustes'].map((f, i) => (
            <button
              key={f}
              type="button"
              className={
                i === 0
                  ? 'rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground'
                  : 'rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary'
              }
            >
              {f}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-secondary"
        >
          <Download className="h-4 w-4 text-muted-foreground" />
          Exportar
        </button>
      </div>

      {/* Timeline table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Referencia</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 font-medium">Tipo</th>
                <th className="px-5 py-3 font-medium">Producto</th>
                <th className="px-5 py-3 font-medium">Cantidad</th>
                <th className="px-5 py-3 font-medium">Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {movimientos.map((m) => {
                const t = typeStyles[m.type]
                const Icon = t.icon
                return (
                  <tr key={m.id} className="hover:bg-secondary/50">
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                      {m.id}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{m.date}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${t.cls}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {m.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-foreground">
                      {m.product}
                    </td>
                    <td className="px-5 py-4 text-foreground">{m.qty}</td>
                    <td className="px-5 py-4 text-muted-foreground">{m.user}</td>
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
