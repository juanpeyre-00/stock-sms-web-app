'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, Check, Copy, Fish, MessageSquare, Phone, Send } from 'lucide-react'

type Colaborador = {
  id: string
  name: string
  phone: string
  position: string | null
}

type SendResult = {
  collaboratorId: string
  name: string
  phone: string
  status: string
  error?: string
}

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

export function MensajesClient({
  colaboradores,
}: {
  colaboradores: Colaborador[]
}) {
  const [seleccion, setSeleccion] = useState<string[]>(
    colaboradores.map((colaborador) => colaborador.id),
  )
  const [productos, setProductos] = useState<string[]>([
    'Merluza austral',
    'Congrio dorado',
    'Reineta fresca',
  ])
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [sendResults, setSendResults] = useState<SendResult[]>([])

  const selectedCollaborators = colaboradores.filter((colaborador) =>
    seleccion.includes(colaborador.id),
  )

  const toggleColaborador = (id: string) =>
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

  async function sendWhatsAppCampaign() {
    setSending(true)
    setError('')
    setResult('')
    setSendResults([])

    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collaboratorIds: seleccion, body: mensaje }),
    })
    const data = await response.json()

    setSending(false)

    if (!response.ok) {
      setError(data.message || 'No pudimos enviar la campana.')
      return
    }

    setSendResults(data.results || [])
    setResult(data.message || 'Campana enviada.')
  }

  async function copyMessage() {
    await navigator.clipboard.writeText(mensaje)
    setResult('Mensaje copiado. Puedes pegarlo en SMS o WhatsApp.')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Comunicacion operativa</p>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">
              Un click prepara el aviso para los colaboradores.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              StockSMS toma los colaboradores registrados, arma el mensaje y deja
              el envio automatico listo desde WhatsApp Business.
            </p>
          </div>
          <button
            type="button"
            onClick={sendWhatsAppCampaign}
            disabled={seleccion.length === 0 || sending}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {sending ? 'Enviando...' : 'Enviar WhatsApp'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card lg:col-span-1">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold text-foreground">Colaboradores</h2>
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
              {seleccion.length} seleccionados
            </span>
          </div>
          <ul className="divide-y divide-border">
            {colaboradores.length === 0 && (
              <li className="px-5 py-6 text-sm text-muted-foreground">
                Aun no hay colaboradores registrados en esta empresa.
              </li>
            )}
            {colaboradores.map((colaborador) => {
              const activo = seleccion.includes(colaborador.id)
              return (
                <li key={colaborador.id}>
                  <button
                    type="button"
                    onClick={() => toggleColaborador(colaborador.id)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-secondary/50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                      {initials(colaborador.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {colaborador.name}
                      </p>
                      <p className="flex items-center gap-1 truncate font-mono text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {colaborador.phone}
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
            <h2 className="font-semibold text-foreground">Mensaje listo</h2>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-5">
            <div className="rounded-lg bg-secondary p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                {mensaje}
              </pre>
            </div>
            <p className="text-xs text-muted-foreground">
              Se preparara para {selectedCollaborators.length} colaboradores.
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
              onClick={copyMessage}
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <Copy className="h-4 w-4" />
              Copiar mensaje
            </button>
          </div>
        </section>
      </div>

      {sendResults.length > 0 && (
        <section className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold text-foreground">Resultado de envios</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              StockSMS intento enviar automaticamente por WhatsApp Business.
            </p>
          </div>
          <ul className="divide-y divide-border">
            {sendResults.map((recipient) => (
              <li
                key={recipient.collaboratorId}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{recipient.name}</p>
                  <p className="font-mono text-sm text-muted-foreground">
                    {recipient.phone}
                  </p>
                  {recipient.error && (
                    <p className="mt-1 text-sm text-destructive">
                      {recipient.error}
                    </p>
                  )}
                </div>
                <span
                  className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium ${
                    recipient.status === 'SENT'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {recipient.status === 'SENT' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {recipient.status === 'SENT' ? 'Enviado' : 'Fallido'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
