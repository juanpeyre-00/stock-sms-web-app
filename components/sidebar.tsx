'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Boxes, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems } from '@/components/nav-items'
import { LogoutButton } from '@/components/logout-button'

export function Sidebar({
  open = false,
  onClose,
  user,
}: {
  open?: boolean
  onClose?: () => void
  user: {
    name: string
    role: string
    companyName: string
  }
}) {
  const pathname = usePathname()
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Boxes className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Stock<span className="text-sidebar-primary">SMS</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-sidebar-foreground/70 hover:bg-sidebar-accent md:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
            Navegación
          </p>
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {item.title}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-accent-foreground">
              {initials || 'US'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-sidebar-foreground/50">
                {user.companyName} · {user.role}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>
    </>
  )
}
