'use client'

import { useMemo, useState } from 'react'
import { MessageSquare, Send, Phone, Check, Fish } from 'lucide-react'

type Afiliado = {
  id: string
  name: string
  phone: string
  role: string
}

const afiliados: Afiliado[] = [
  { id: 'a1', name: 'María Álvarez', phone: '+56 9 6123 4567', role: 'Administradora' },
  { id: 'a2', name: 'Carlos Ruiz', phone: '+56 9 6234 5678', role: 'Supervisor' },
  { id: 'a3', name: 'Ana Torres', phone: '+56 9 6345 6789', role: 'Operario' },
  { id: 'a4', name: 'Sofía Díaz', phone: '+56 9 6567 8901', role: 'Supervisor' },
  { id: 'a5', name: 'Diego Ramírez', phone: '+56 9 6678 9012', role: 'Operario' },
]

const stockDestacado = [
  { name: 'Merluza austral', stock: 12, unit: 'kg', bajo: true },
  { name: 'Congrio dorado', stock: 4, unit: 'kg', bajo: true },
  { name: 'Choritos de Magallanes', stock: 340, unit: 'kg', bajo: false },
  { name: 'Reineta fresca', stock: 21, unit: 'kg', bajo: true },
  { name: 'Centolla magallánica', stock: 95, unit: 'uds', bajo: false },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
}

export default function MensajesPage() {
  const [seleccion, setSeleccion] = useState<string[]>(['a1', 'a2'])
  const [productos, setProductos] = useState<string[]>([
    'Merluza austral',
    'Congrio dorado',
    'Reineta fresca',
  ])

  const toggleAfiliado = (id: string) =>
    setSeleccion((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const toggleProducto = (name: string) =>
    setProductos((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name],
    )

  const mensaje = useMemo(() => {
    const lineas = stockDestacado
      .filter((p) => productos.includes(p.name))
      .map((p) => `• ${p.name}: ${p.stock} ${p.unit}`)
    return [
      'StockSMS — Reporte de stock del día',
      '',
      ...(lineas.length ? lineas : ['(Sin productos seleccionados)']),
      '',
      'Revisar reposición de productos con stock bajo.',
    ].join('\n')
  }, [productos])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Números afiliados */}
        <section className="rounded-xl border border-border bg-card lg:col-span-1">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold text-foreground">Números afiliados</h2>
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
              {seleccion.length} seleccionados
            </span>
          </div>
          <ul className="divide-y divide-border">
            {afiliados.map((a) => {
              const activo = seleccion.includes(a.id)
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => toggleAfiliado(a.id)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-secondary/50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                      {initials(a.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {a.name}
                      </p>
                      <p className="flex items-center gap-1 truncate font-mono text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {a.phone}
                      </p>
                    </div>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        activo
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input bg-card'
                      }`}
                    >
                      {activo && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Productos a incluir */}
        <section className="rounded-xl border border-border bg-card lg:col-span-1">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold text-foreground">Stock a notificar</h2>
            <Fish className="h-4 w-4 text-muted-foreground" />
          </div>
          <ul className="divide-y divide-border">
            {stockDestacado.map((p) => {
              const activo = productos.includes(p.name)
              return (
                <li key={p.name}>
                  <button
                    type="button"
                    onClick={() => toggleProducto(p.name)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-secondary/50"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        activo
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input bg-card'
                      }`}
                    >
                      {activo && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {p.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.stock} {p.unit}
                      </p>
                    </div>
                    {p.bajo && (
                      <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                        Bajo
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Previsualización del SMS */}
        <section className="flex flex-col rounded-xl border border-border bg-card lg:col-span-1">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Previsualización</h2>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-5">
            <div className="rounded-lg bg-secondary p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                {mensaje}
              </pre>
            </div>
            <p className="text-xs text-muted-foreground">
              Se enviará a {seleccion.length}{' '}
              {seleccion.length === 1 ? 'número afiliado' : 'números afiliados'}.
            </p>
            <button
              type="button"
              disabled={seleccion.length === 0}
              className="mt-auto flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Enviar SMS
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
