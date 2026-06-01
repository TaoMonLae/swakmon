import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const page     = Math.max(1, Number(searchParams.get('page') ?? 1))
  // Cap at 50 — prevents full-DB dumps via ?limit=99999
  const limit    = Math.min(Math.max(1, Number(searchParams.get('limit') ?? 20)), 50)
  const q        = searchParams.get('q') ?? ''
  const stateSlug = searchParams.get('state') ?? ''
  const catSlug  = searchParams.get('category') ?? ''

  const where = {
    status: 'ACTIVE' as const,
    ...(q && {
      OR: [
        { title:       { contains: q, mode: 'insensitive' as const } },
        { description: { contains: q, mode: 'insensitive' as const } },
      ],
    }),
    ...(stateSlug && { state: { slug: stateSlug } }),
    ...(catSlug   && { category: { slug: catSlug } }),
  }

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { category: true, state: true, township: true },
      orderBy: [{ tier: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.listing.count({ where }),
  ])

  return NextResponse.json({ listings, total, page, totalPages: Math.ceil(total / limit) })
}
