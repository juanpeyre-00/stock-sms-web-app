import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Boxes,
  Building2,
  Check,
  ClipboardList,
  MessageSquareText,
  ShieldCheck,
  TimerReset,
} from 'lucide-react'
import { MONTHLY_PRICE_LABEL, TRIAL_DAYS } from '@/lib/billing'

const features = [
  {
    title: 'Inventario diario',
    description:
      'Registra productos, cantidades minimas y movimientos del turno sin planillas sueltas.',
    icon: ClipboardList,
  },
  {
    title: 'Alertas por SMS',
    description:
      'Prepara mensajes para equipos y proveedores cuando el stock necesita accion.',
    icon: MessageSquareText,
  },
  {
    title: 'Panel para empresas',
    description:
      'Cada cliente queda separado con su plan, trial, estado de pago y colaboradores.',
    icon: Building2,
  },
]

const checklist = [
  'Panel web listo para operar',
  'Base de datos Neon conectada',
  'Login seguro para administradores',
  'Trial comercial de 7 dias',
  'Precio publico de USD 8.99 al mes',
]

export default function PublicHomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Stock<span className="text-primary">SMS</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Ingresar
            </Link>
            <Link
              href="#contacto"
              className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
            >
              Solicitar acceso
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-muted-foreground">
              <TimerReset className="h-4 w-4 text-primary" />
              {TRIAL_DAYS} dias gratis, luego {MONTHLY_PRICE_LABEL}
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-foreground md:text-6xl">
              Control de stock diario para equipos que necesitan orden hoy.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              StockSMS centraliza inventario, colaboradores, historial y alertas
              en una aplicacion web simple para operar y vender como servicio
              mensual.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#contacto"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Contratar por {MONTHLY_PRICE_LABEL}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Entrar a la aplicacion
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Resumen operativo
                </p>
                <h2 className="mt-1 text-xl font-semibold">Panel StockSMS</h2>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Online
              </span>
            </div>
            <div className="grid gap-4 py-5 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background p-4">
                <BarChart3 className="h-5 w-5 text-primary" />
                <p className="mt-4 text-2xl font-semibold">1,284</p>
                <p className="text-sm text-muted-foreground">
                  Productos monitoreados
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="mt-4 text-2xl font-semibold">99.9%</p>
                <p className="text-sm text-muted-foreground">
                  Datos centralizados
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm font-medium text-foreground">
                Plan comercial
              </p>
              <p className="mt-2 text-3xl font-semibold">
                USD 8.99
                <span className="text-sm font-normal text-muted-foreground">
                  {' '}
                  / mes
                </span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Pensado para que sea facil venderlo a pequenas empresas y
                empezar a generar ingresos recurrentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            )
          })}
        </div>
      </section>

      <section id="contacto" className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <BadgeCheck className="h-4 w-4" />
              Listo para vender
            </div>
            <h2 className="mt-4 text-3xl font-semibold">
              Pagina publica + aplicacion privada en una sola URL.
            </h2>
            <p className="mt-3 text-muted-foreground">
              La portada sirve para mostrar el producto, explicar el precio y
              captar clientes. El login lleva al panel donde se administran
              empresas, trials y licencias.
            </p>
            <p className="mt-4 rounded-lg border border-border bg-background p-3 text-sm font-medium text-foreground">
              Captacion actual: publica este link y crea las cuentas desde el
              panel. El cobro automatico se conecta en el siguiente paso con
              Stripe o Mercado Pago.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {checklist.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
