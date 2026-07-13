import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
      <section className="w-full max-w-lg rounded-xl border border-border bg-card p-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-2xl font-semibold">Pago recibido</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Stripe confirmo el checkout. Tu suscripcion queda activa cuando el
          webhook termina de procesar el pago.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Volver al panel
        </Link>
      </section>
    </main>
  )
}
