'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Boxes, Lock, Mail, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@tololo.cl')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json()

    setLoading(false)

    if (!response.ok) {
      setError(data.message || 'No pudimos iniciar sesión.')
      return
    }

    router.push(data.redirectTo || '/dashboard')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <section className="relative hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground md:flex md:w-1/2 lg:w-[45%]">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Boxes className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Stock<span className="text-sidebar-primary">SMS</span>
          </span>
        </div>

        <div className="max-w-md">
          <h2 className="text-balance text-3xl font-semibold leading-tight lg:text-4xl">
            Controla tu inventario diario con total claridad.
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-sidebar-foreground/70">
            Gestiona stock, colaboradores e historial desde un único panel
            profesional, pensado para equipos que necesitan datos confiables.
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm text-sidebar-foreground/70">
          <ShieldCheck className="h-5 w-5 text-sidebar-primary" />
          Acceso seguro y auditado para todo tu equipo
        </div>
      </section>

      <section className="flex flex-1 items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 md:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Stock<span className="text-primary">SMS</span>
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-foreground">
            Iniciar sesión
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresa tus credenciales para acceder al panel.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="tu@empresa.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 w-full rounded-lg border border-input bg-card pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Contraseña
                </label>
                <span className="text-sm font-medium text-primary">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 w-full rounded-lg border border-input bg-card pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-input accent-primary"
              />
              Mantener sesión iniciada
            </label>

            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Demo local: admin@tololo.cl / StockSMS2026!
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <span className="font-medium text-primary">Solicita acceso</span>
          </p>
        </div>
      </section>
    </main>
  )
}
