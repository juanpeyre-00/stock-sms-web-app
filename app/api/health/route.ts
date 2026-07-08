import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const [companies, collaborators, products] = await Promise.all([
    prisma.company.count(),
    prisma.collaborator.count(),
    prisma.product.count(),
  ])

  return NextResponse.json({
    ok: true,
    database: 'connected',
    counts: {
      companies,
      collaborators,
      products,
    },
  })
}
