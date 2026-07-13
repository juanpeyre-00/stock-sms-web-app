'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Boxes, Building2, Lock, Mail, User } from 'lucide-react'
import { MONTHLY_PRICE_LABEL, TRIAL_DAYS } from '@/lib/billing'

export default function SignupPage() {
  const router = useRouter()
  const [companyName, setCompanyName] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName, name, email, password }),
    })
    const data = await response.json()

    setLoading(false)

    if (!response.ok) {
      setError(data.message || 'No pudimos crear tu cuenta.')
      return
    }

    router.push(data.redirectTo || '/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Stock<span className="text-primary">SMS</span>
            </span>
          </Link>
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-5xl gap-8 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium text-primary">
            Activacion inmediata
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
            Crea tu empresa y entra al panel en menos de un minuto.
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Empieza con {TRIAL_DAYS} dias gratis. Luego el plan queda en{' '}
            {MONTHLY_PRICE_LABEL}. El cobro automatico con Stripe/Mercado Pago
            va en el siguiente bloque.
          </p>
          <div className="mt-6 rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">
              Que pasa al registrarte
            </p>
            <ul className="mt-3 space-y-3 text-sm text-foreground">
              <li>1. Se crea tu empresa en la base de datos.</li>
              <li>2. Tu usuario queda como OWNER.</li>
              <li>3. Entras al dashboard privado de StockSMS.</li>
            </ul>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <h2 className="text-xl font-semibold">Contratar StockSMS</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Trial de {TRIAL_DAYS} dias, luego {MONTHLY_PRICE_LABEL}.
          </p>

          <div className="mt-6 space-y-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Empresa</span>
              <span className="relative block">
                <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder="Ej: Mariscos del Sur"
                  className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                />
              </span>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Tu nombre</span>
              <span className="relative block">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nombre y apellido"
                  className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                />
              </span>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Correo</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu@empresa.com"
                  className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                />
              </span>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Clave</span>
              <span className="relative block">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  type="password"
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimo 8 caracteres"
                  className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                />
              </span>
            </label>
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta y entrar'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </section>
    </main>
  )
}
