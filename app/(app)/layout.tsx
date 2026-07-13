import { cookies } from 'next/headers'
import { DashboardShell } from '@/components/dashboard-shell'
import { prisma } from '@/lib/prisma'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value)
  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.userId },
        select: { name: true, role: true, company: { select: { name: true } } },
      })
    : null

  return (
    <DashboardShell
      user={{
        name: user?.name ?? 'Usuario StockSMS',
        role: user?.role ?? 'OWNER',
        companyName: user?.company.name ?? 'Empresa',
      }}
    >
      {children}
    </DashboardShell>
  )
}
