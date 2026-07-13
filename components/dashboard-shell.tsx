'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, Bell, Search } from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { navItems } from '@/components/nav-items'

type ShellUser = {
  name: string
  role: string
  companyName: string
}

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: ShellUser
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const current = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  )

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar open={open} onClose={() => setOpen(false)} user={user} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-border bg-card/80 px-4 py-3 backdrop-blur md:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md p-2 text-muted-foreground hover:bg-secondary md:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold text-foreground md:text-lg">
              {current?.title ?? 'StockSMS'}
            </h1>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              {current?.description ?? 'Panel de control'}
            </p>
          </div>

          <div className="relative hidden lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar…"
              className="h-9 w-56 rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
            />
          </div>

          <button
            type="button"
            className="relative rounded-lg border border-border bg-background p-2 text-muted-foreground hover:bg-secondary"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
