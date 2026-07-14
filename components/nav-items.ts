import {
  Building2,
  History,
  LayoutDashboard,
  MessageSquare,
  PackageOpen,
  Plug,
  Users,
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
    description: 'Resumen general de la operacion',
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
    description: 'Conteo e inventario del dia',
  },
  {
    title: 'Enviar SMS',
    href: '/mensajes',
    icon: MessageSquare,
    description: 'Enviar avisos a colaboradores',
  },
  {
    title: 'Integraciones',
    href: '/integraciones',
    icon: Plug,
    description: 'Conectar WhatsApp de la empresa',
  },
  {
    title: 'Empresas',
    href: '/empresas',
    icon: Building2,
    description: 'Planes, trials y licencias',
  },
  {
    title: 'Historial',
    href: '/historial',
    icon: History,
    description: 'Movimientos y registros anteriores',
  },
]
