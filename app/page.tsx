'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Building2,
  Check,
  ClipboardList,
  Lock,
  Mail,
  MessageSquareText,
  ShieldCheck,
  User,
} from 'lucide-react'
import { MONTHLY_PRICE_LABEL, TRIAL_DAYS } from '@/lib/billing'

const features = [
  {
    title: 'Inventario diario',
    description:
      'Controla productos, cantidades minimas y movimientos desde un panel claro.',
    icon: ClipboardList,
  },
  {
    title: 'Alertas por SMS',
    description:
      'Prepara avisos para tu equipo cuando un producto requiere accion.',
    icon: MessageSquareText,
  },
  {
    title: 'Empresas separadas',
    description:
      'Cada cliente tiene su propia cuenta, trial, colaboradores y plan.',
    icon: Building2,
  },
]

export default function PublicHomePage() {
  const router = useRouter()
  const [mode, setMode] = useState<'signup' | 'login'>('signup')
  const [companyName, setCompanyName] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName, name, email, password }),
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'No pudimos crear tu cuenta.')
    }

    try {
      const checkoutResponse = await fetch('/api/billing/checkout', {
        method: 'POST',
      })
      const checkoutData = await checkoutResponse.json()

      if (checkoutResponse.ok && checkoutData.url) {
        window.location.href = checkoutData.url
        return
      }
    } catch {
      // The account is ready; payment setup can be finished later.
    }

    router.push(data.redirectTo || '/dashboard')
    router.refresh()
  }

  async function handleLogin() {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'No pudimos iniciar sesion.')
    }

    router.push(data.redirectTo || '/dashboard')
    router.refresh()
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        await handleSignup()
      } else {
        await handleLogin()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos continuar.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Stock<span className="text-primary">SMS</span>
            </span>
          </div>
          <div className="hidden items-center gap-3 text-sm text-muted-foreground sm:flex">
            <Check className="h-4 w-4 text-primary" />
            Todo desde esta misma pagina
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:px-8 lg:grid-cols-[1fr_440px] lg:py-14">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium text-primary">
            Aplicacion web para vender desde hoy
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
            StockSMS: inventario, alertas y empresas en un solo panel.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Tus clientes pueden crear su empresa, entrar al dashboard y empezar
            un trial de {TRIAL_DAYS} dias. Luego el plan queda en{' '}
            {MONTHLY_PRICE_LABEL}.
          </p>

          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-semibold">Online</p>
              <p className="text-sm text-muted-foreground">Vercel activo</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-semibold">Neon</p>
              <p className="text-sm text-muted-foreground">Base conectada</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <Boxes className="h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-semibold">USD 8.99</p>
              <p className="text-sm text-muted-foreground">Mensual</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="grid grid-cols-2 rounded-lg bg-secondary p-1">
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setError('')
              }}
              className={`h-10 rounded-md text-sm font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              Crear cuenta
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setError('')
              }}
              className={`h-10 rounded-md text-sm font-medium transition-colors ${
                mode === 'login'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              Entrar
            </button>
          </div>

          <h2 className="mt-6 text-xl font-semibold">
            {mode === 'signup' ? 'Contratar StockSMS' : 'Entrar al panel'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === 'signup'
              ? `${TRIAL_DAYS} dias gratis, luego ${MONTHLY_PRICE_LABEL}.`
              : 'Usa el correo y clave de tu empresa.'}
          </p>

          <div className="mt-6 space-y-4">
            {mode === 'signup' && (
              <>
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
              </>
            )}

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
            {loading
              ? 'Procesando...'
              : mode === 'signup'
                ? 'Crear cuenta y entrar'
                : 'Entrar al dashboard'}
            <ArrowRight className="h-4 w-4" />
          </button>

          {mode === 'login' && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Demo: admin@tololo.cl / StockSMS2026!
            </p>
          )}
        </form>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-10 md:grid-cols-3 md:px-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className="rounded-lg border border-border bg-background p-4"
              >
                <Icon className="h-5 w-5 text-primary" />
                <h2 className="mt-3 font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
