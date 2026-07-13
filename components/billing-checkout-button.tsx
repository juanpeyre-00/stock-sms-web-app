'use client'

import { useState } from 'react'
import { CreditCard } from 'lucide-react'

export function BillingCheckoutButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function startCheckout() {
    setLoading(true)
    setError('')

    const response = await fetch('/api/billing/checkout', { method: 'POST' })
    const data = await response.json()

    setLoading(false)

    if (!response.ok || !data.url) {
      setError(data.message || 'No pudimos iniciar el pago.')
      return
    }

    window.location.href = data.url
  }

  return (
    <div>
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <CreditCard className="h-4 w-4" />
        {loading ? 'Abriendo Stripe...' : 'Pagar suscripcion'}
      </button>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  )
}
