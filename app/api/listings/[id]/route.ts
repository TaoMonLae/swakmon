import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const listing = await prisma.listing.findUnique({
    where: { id, status: 'ACTIVE' },
    include: { category: true, state: true, township: true },
  })
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.listing.update({ where: { id }, data: { viewCount: { increment: 1 } } })

  return NextResponse.json(listing)
}
