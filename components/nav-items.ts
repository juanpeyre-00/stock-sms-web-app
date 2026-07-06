import {
  LayoutDashboard,
  Users,
  PackageOpen,
  History,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  description: string
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Resumen general de la operación',
  },
  {
    title: 'Colaboradores',
    href: '/colaboradores',
    icon: Users,
    description: 'Equipo con acceso al sistema',
  },
  {
    title: 'Stock Diario',
    href: '/stock',
    icon: PackageOpen,
    description: 'Conteo e inventario del día',
  },
  {
    title: 'Enviar SMS',
    href: '/mensajes',
    icon: MessageSquare,
    description: 'Notificar stock a números afiliados',
  },
  {
    title: 'Historial',
    href: '/historial',
    icon: History,
    description: 'Movimientos y registros anteriores',
  },
]
