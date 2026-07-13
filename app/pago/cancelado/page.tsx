import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function PaymentCanceledPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
      <section className="w-full max-w-lg rounded-xl border border-border bg-card p-6 text-center">
        <XCircle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-2xl font-semibold">Pago cancelado</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          No se activo ningun cobro. Puedes volver al panel e intentar pagar de
          nuevo cuando quieras.
        </p>
        <Link
          href="/empresas"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Volver a empresas
        </Link>
      </section>
    </main>
  )
}
