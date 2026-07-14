'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, Fish, MessageSquare, Phone, Send } from 'lucide-react'

type Afiliado = {
  id: string
  name: string
  phone: string
  role: string
}

const afiliados: Afiliado[] = [
  { id: 'a1', name: 'Maria Alvarez', phone: '+56 9 6123 4567', role: 'Administradora' },
  { id: 'a2', name: 'Carlos Ruiz', phone: '+56 9 6234 5678', role: 'Supervisor' },
  { id: 'a3', name: 'Ana Torres', phone: '+56 9 6345 6789', role: 'Operario' },
]

const stockDestacado = [
  { name: 'Merluza austral', stock: 12, unit: 'kg', bajo: true },
  { name: 'Congrio dorado', stock: 4, unit: 'kg', bajo: true },
  { name: 'Choritos de Magallanes', stock: 340, unit: 'kg', bajo: false },
  { name: 'Reineta fresca', stock: 21, unit: 'kg', bajo: true },
  { name: 'Centolla magallanica', stock: 95, unit: 'uds', bajo: false },
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
  const [testPhone, setTestPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const cleanPhone = testPhone.replace(/[^\d+]/g, '')
  const whatsappPhone = cleanPhone.replace(/^\+/, '')

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
      .map((p) => `- ${p.name}: ${p.stock} ${p.unit}`)
    return [
      'StockSMS - Reporte de stock del dia',
      '',
      ...(lineas.length ? lineas : ['(Sin productos seleccionados)']),
      '',
      'Revisar reposicion de productos con stock bajo.',
    ].join('\n')
  }, [productos])

  async function sendTestMessage() {
    setSending(true)
    setError('')
    setResult('')

    const response = await fetch('/api/sms/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: testPhone, body: mensaje }),
    })
    const data = await response.json()

    setSending(false)

    if (!response.ok) {
      setError(data.message || 'No pudimos guardar la prueba.')
      return
    }

    setResult(`${data.message} Numero: ${data.phone}`)
  }

  async function saveAndOpenSms() {
    await sendTestMessage()

    if (!testPhone) return

    window.location.href = `sms:${cleanPhone}?&body=${encodeURIComponent(mensaje)}`
  }

  async function saveAndOpenWhatsapp() {
    await sendTestMessage()

    if (!testPhone) return

    window.open(
      `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(mensaje)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  async function copyMessage() {
    await navigator.clipboard.writeText(mensaje)
    setResult('Mensaje copiado. Puedes pegarlo en SMS o WhatsApp.')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Prueba con telefono real</p>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">
              Prepara un aviso de stock para tu numero.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Sin proveedor pagado, StockSMS abre SMS o WhatsApp con el mensaje
              listo. El envio automatico silencioso requiere un proveedor externo.
            </p>
          </div>
          <label className="w-full space-y-1.5 md:max-w-xs">
            <span className="text-sm font-medium text-foreground">Numero de prueba</span>
            <span className="relative block">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={testPhone}
                onChange={(event) => setTestPhone(event.target.value)}
                placeholder="+56 9 XXXX XXXX"
                className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              />
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card lg:col-span-1">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold text-foreground">Numeros afiliados</h2>
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

        <section className="flex flex-col rounded-xl border border-border bg-card lg:col-span-1">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Previsualizacion</h2>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-5">
            <div className="rounded-lg bg-secondary p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                {mensaje}
              </pre>
            </div>
            <p className="text-xs text-muted-foreground">
              Se preparara para {seleccion.length} afiliados y para el numero de prueba.
            </p>
            {result && (
              <p className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary">
                {result}
              </p>
            )}
            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={sendTestMessage}
              disabled={!testPhone || sending}
              className="mt-auto flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {sending ? 'Guardando prueba...' : 'Guardar prueba SMS'}
            </button>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={saveAndOpenSms}
                disabled={!testPhone || sending}
                className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Abrir SMS
              </button>
              <button
                type="button"
                onClick={saveAndOpenWhatsapp}
                disabled={!testPhone || sending}
                className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MessageSquare className="h-4 w-4" />
                Abrir WhatsApp
              </button>
            </div>
            <button
              type="button"
              onClick={copyMessage}
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <Copy className="h-4 w-4" />
              Copiar mensaje
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
