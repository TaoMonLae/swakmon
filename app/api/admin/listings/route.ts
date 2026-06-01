import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { ListingStatus, ListingTier, PriceType, CommissionType, Prisma } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateRef } from '@/lib/utils'
import { toFiniteOrNull, asEnum, sanitizeImages } from '@/lib/listingInput'


export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const page = Number(searchParams.get('page') ?? 1)
  const limit = 25
  const q = searchParams.get('q') ?? ''
  const statusParam = searchParams.get('status') ?? ''
  const status = asEnum(ListingStatus, statusParam)

  const where: Prisma.ListingWhereInput = {
    ...(q && {
      OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { listingRef: { contains: q, mode: 'insensitive' as const } },
      ],
    }),
    ...(status && { status }),
  }

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { category: true, state: true, township: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.listing.count({ where }),
  ])

  return NextResponse.json({ listings, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Required relations must be valid numbers.
  const stateId = toFiniteOrNull(body.stateId)
  const townshipId = toFiniteOrNull(body.townshipId)
  const categoryId = toFiniteOrNull(body.categoryId)
  if (stateId == null || townshipId == null || categoryId == null) {
    return NextResponse.json(
      { error: 'stateId, townshipId and categoryId are required and must be numeric' },
      { status: 400 }
    )
  }
  if (typeof body.title !== 'string' || typeof body.description !== 'string') {
    return NextResponse.json({ error: 'title and description are required' }, { status: 400 })
  }

  // Whitelist only the fields admins are allowed to set; never spread raw body
  // (prevents overwriting listingRef, viewCount, id, timestamps, etc.).
  const data: Prisma.ListingCreateInput = {
    listingRef: generateRef(),
    title: body.title,
    description: body.description,
    price: toFiniteOrNull(body.price),
    priceLabel: typeof body.priceLabel === 'string' ? body.priceLabel : null,
    priceType: asEnum(PriceType, body.priceType) ?? PriceType.FIXED,
    status: asEnum(ListingStatus, body.status) ?? ListingStatus.PENDING,
    tier: asEnum(ListingTier, body.tier) ?? ListingTier.BASIC,
    tierOverridePrice: toFiniteOrNull(body.tierOverridePrice),
    tierDiscountPct: toFiniteOrNull(body.tierDiscountPct),
    isFreeUntilSold: body.isFreeUntilSold === true,
    commissionType: asEnum(CommissionType, body.commissionType),
    commissionValue: toFiniteOrNull(body.commissionValue),
    contactPhone: typeof body.contactPhone === 'string' ? body.contactPhone : null,
    contactViber: body.contactViber !== false,
    contactWhatsApp: body.contactWhatsApp !== false,
    contactFacebook: typeof body.contactFacebook === 'string' ? body.contactFacebook : null,
    adminNotes: typeof body.adminNotes === 'string' ? body.adminNotes : null,
    images: sanitizeImages(body.images) as unknown as Prisma.InputJsonValue,
    category: { connect: { id: categoryId } },

    state: { connect: { id: stateId } },
    township: { connect: { id: townshipId } },
  }

  const listing = await prisma.listing.create({ data })

  revalidatePath('/')
  revalidatePath('/browse', 'layout')

  return NextResponse.json(listing, { status: 201 })
}
