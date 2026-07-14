'use client'

import { useState } from 'react'
import { CheckCircle2, KeyRound, MessageSquare, Phone } from 'lucide-react'

export function WhatsAppIntegrationForm({
  connected,
  displayName,
  phoneNumberId,
  connectedAt,
}: {
  connected: boolean
  displayName: string
  phoneNumberId: string
  connectedAt: string
}) {
  const [name, setName] = useState(displayName)
  const [phoneId, setPhoneId] = useState(phoneNumberId)
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function saveIntegration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const response = await fetch('/api/integrations/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        whatsappDisplayName: name,
        whatsappPhoneNumberId: phoneId,
        whatsappAccessToken: token,
      }),
    })
    const data = await response.json()

    setLoading(false)

    if (!response.ok) {
      setError(data.message || 'No pudimos conectar WhatsApp.')
      return
    }

    setMessage(data.message || 'WhatsApp conectado.')
    setToken('')
  }

  return (
    <form
      onSubmit={saveIntegration}
      className="max-w-2xl rounded-xl border border-border bg-card p-5"
    >
      <div className="mb-5 flex items-center gap-3 rounded-lg border border-border bg-background p-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            connected ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
          }`}
        >
          {connected ? <CheckCircle2 className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        </span>
        <div>
          <p className="font-medium text-foreground">
            {connected ? 'WhatsApp conectado' : 'WhatsApp no conectado'}
          </p>
          <p className="text-sm text-muted-foreground">
            {connectedAt
              ? `Ultima conexion guardada: ${new Date(connectedAt).toLocaleString()}`
              : 'Guarda las credenciales oficiales de Meta para esta empresa.'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            Nombre visible
          </span>
          <span className="relative block">
            <MessageSquare className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej: Pescaderia Bahia Azul"
              className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
          </span>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            WhatsApp Phone Number ID
          </span>
          <span className="relative block">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              required
              value={phoneId}
              onChange={(event) => setPhoneId(event.target.value)}
              placeholder="123456789"
              className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
          </span>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            Access Token
          </span>
          <span className="relative block">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              required
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="EA..."
              className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
          </span>
        </label>
      </div>

      {message && (
        <p className="mt-4 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Guardando...' : 'Guardar WhatsApp de la empresa'}
      </button>
    </form>
  )
}
