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
    <main className="min-h-screen bg-[#f5f8fb] text-[#152033]">
      <section className="grid min-h-screen lg:grid-cols-[0.98fr_1.02fr]">
        <div className="relative flex flex-col justify-between overflow-hidden bg-[#0d1b2a] px-5 py-6 text-white md:px-10 lg:px-12">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(68,145,255,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(68,145,255,.22)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="absolute right-0 top-0 h-64 w-64 translate-x-24 -translate-y-24 rounded-full bg-[#0ea5e9]/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 -translate-x-24 translate-y-24 rounded-full bg-[#22c55e]/15 blur-3xl" />

          <div className="relative z-10 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1688e8] text-white shadow-lg shadow-[#1688e8]/30">
              <Boxes className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Stock<span className="text-[#52b6ff]">SMS</span>
            </span>
          </div>

          <div className="relative z-10 max-w-xl py-14 lg:py-20">
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-[#b9dcff]">
              Aplicacion web para vender desde hoy
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">
              StockSMS: inventario, alertas y empresas en un solo panel.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Tus clientes pueden crear su empresa, entrar al dashboard y
              empezar un trial de {TRIAL_DAYS} dias. Luego el plan queda en{' '}
              {MONTHLY_PRICE_LABEL}.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur">
                <BarChart3 className="h-5 w-5 text-[#52b6ff]" />
                <p className="mt-3 text-2xl font-semibold">Online</p>
                <p className="text-sm text-slate-300">Vercel activo</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur">
                <ShieldCheck className="h-5 w-5 text-[#52b6ff]" />
                <p className="mt-3 text-2xl font-semibold">Neon</p>
                <p className="text-sm text-slate-300">Base conectada</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur">
                <Boxes className="h-5 w-5 text-[#52b6ff]" />
                <p className="mt-3 text-2xl font-semibold">USD 8.99</p>
                <p className="text-sm text-slate-300">Mensual</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-sm text-slate-300">
            <Check className="h-5 w-5 text-[#38bdf8]" />
            Todo desde esta misma pagina: ver, contratar y entrar.
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-10 md:px-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[440px] rounded-xl border border-[#dbe5ef] bg-white p-5 shadow-xl shadow-slate-200/70"
        >
          <div className="grid grid-cols-2 rounded-lg bg-[#eaf2fb] p-1">
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setError('')
              }}
              className={`h-10 rounded-md text-sm font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-white text-[#152033] shadow-sm'
                  : 'text-[#64748b]'
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
                  ? 'bg-white text-[#152033] shadow-sm'
                  : 'text-[#64748b]'
              }`}
            >
              Entrar
            </button>
          </div>

          <h2 className="mt-6 text-xl font-semibold text-[#152033]">
            {mode === 'signup' ? 'Contratar StockSMS' : 'Entrar al panel'}
          </h2>
          <p className="mt-1 text-sm text-[#64748b]">
            {mode === 'signup'
              ? `${TRIAL_DAYS} dias gratis, luego ${MONTHLY_PRICE_LABEL}.`
              : 'Usa el correo y clave de tu empresa.'}
          </p>

          <div className="mt-6 space-y-4">
            {mode === 'signup' && (
              <>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-[#152033]">Empresa</span>
                  <span className="relative block">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                    <input
                      required
                      value={companyName}
                      onChange={(event) => setCompanyName(event.target.value)}
                      placeholder="Ej: Mariscos del Sur"
                      className="h-11 w-full rounded-lg border border-[#cbd5e1] bg-[#f8fafc] pl-10 pr-3 text-sm text-[#152033] outline-none focus:border-[#1688e8] focus:ring-2 focus:ring-[#1688e8]/25"
                    />
                  </span>
                </label>

                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-[#152033]">Tu nombre</span>
                  <span className="relative block">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                    <input
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Nombre y apellido"
                      className="h-11 w-full rounded-lg border border-[#cbd5e1] bg-[#f8fafc] pl-10 pr-3 text-sm text-[#152033] outline-none focus:border-[#1688e8] focus:ring-2 focus:ring-[#1688e8]/25"
                    />
                  </span>
                </label>
              </>
            )}

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-[#152033]">Correo</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu@empresa.com"
                  className="h-11 w-full rounded-lg border border-[#cbd5e1] bg-[#f8fafc] pl-10 pr-3 text-sm text-[#152033] outline-none focus:border-[#1688e8] focus:ring-2 focus:ring-[#1688e8]/25"
                />
              </span>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-[#152033]">Clave</span>
              <span className="relative block">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                <input
                  required
                  type="password"
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimo 8 caracteres"
                  className="h-11 w-full rounded-lg border border-[#cbd5e1] bg-[#f8fafc] pl-10 pr-3 text-sm text-[#152033] outline-none focus:border-[#1688e8] focus:ring-2 focus:ring-[#1688e8]/25"
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
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1688e8] text-sm font-medium text-white shadow-lg shadow-[#1688e8]/25 transition-colors hover:bg-[#0875cf] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading
              ? 'Procesando...'
              : mode === 'signup'
                ? 'Crear cuenta y entrar'
                : 'Entrar al dashboard'}
            <ArrowRight className="h-4 w-4" />
          </button>

          {mode === 'login' && (
            <p className="mt-4 text-center text-xs text-[#64748b]">
              Demo: admin@tololo.cl / StockSMS2026!
            </p>
          )}
        </form>
        </div>
      </section>

      <section className="border-t border-[#dbe5ef] bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-10 md:grid-cols-3 md:px-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className="rounded-lg border border-[#dbe5ef] bg-[#f8fafc] p-4"
              >
                <Icon className="h-5 w-5 text-[#1688e8]" />
                <h2 className="mt-3 font-semibold text-[#152033]">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#64748b]">
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
