import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { Prisma } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  toFiniteOrNull,
  asEnum,
  sanitizeImages,
  ListingStatus,
  ListingTier,
  PriceType,
  CommissionType,
} from '@/lib/listingInput'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = Number(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { category: true, state: true, township: true },
  })
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(listing)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = Number(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Whitelist updatable fields. Only fields explicitly present in the body are
  // applied, so partial updates (e.g. just { status }) work, and protected
  // fields (id, listingRef, viewCount, timestamps) can never be overwritten.
  const data: Prisma.ListingUpdateInput = {}

  if (typeof body.title === 'string') data.title = body.title
  if (typeof body.description === 'string') data.description = body.description
  if ('price' in body) data.price = toFiniteOrNull(body.price)
  if ('priceLabel' in body) data.priceLabel = typeof body.priceLabel === 'string' ? body.priceLabel : null
  if (asEnum(PriceType, body.priceType)) data.priceType = asEnum(PriceType, body.priceType)
  if (asEnum(ListingStatus, body.status)) data.status = asEnum(ListingStatus, body.status)
  if (asEnum(ListingTier, body.tier)) data.tier = asEnum(ListingTier, body.tier)
  if ('tierOverridePrice' in body) data.tierOverridePrice = toFiniteOrNull(body.tierOverridePrice)
  if ('tierDiscountPct' in body) data.tierDiscountPct = toFiniteOrNull(body.tierDiscountPct)
  if ('isFreeUntilSold' in body) data.isFreeUntilSold = body.isFreeUntilSold === true
  if ('commissionType' in body) data.commissionType = asEnum(CommissionType, body.commissionType) ?? null
  if ('commissionValue' in body) data.commissionValue = toFiniteOrNull(body.commissionValue)
  if ('contactPhone' in body) data.contactPhone = typeof body.contactPhone === 'string' ? body.contactPhone : null
  if ('contactViber' in body) data.contactViber = body.contactViber === true
  if ('contactWhatsApp' in body) data.contactWhatsApp = body.contactWhatsApp === true
  if ('contactFacebook' in body) data.contactFacebook = typeof body.contactFacebook === 'string' ? body.contactFacebook : null
  if ('adminNotes' in body) data.adminNotes = typeof body.adminNotes === 'string' ? body.adminNotes : null
  if ('images' in body) data.images = sanitizeImages(body.images) as unknown as Prisma.InputJsonValue

  const categoryId = toFiniteOrNull(body.categoryId)
  if (categoryId != null) data.category = { connect: { id: categoryId } }
  const stateId = toFiniteOrNull(body.stateId)
  if (stateId != null) data.state = { connect: { id: stateId } }
  const townshipId = toFiniteOrNull(body.townshipId)
  if (townshipId != null) data.township = { connect: { id: townshipId } }

  try {
    const listing = await prisma.listing.update({ where: { id }, data })

    // Bust the Next.js full-route cache so public pages show the updated data.
    revalidatePath('/')
    revalidatePath('/browse', 'layout')   // covers /browse/[category]
    revalidatePath(`/listing/${id}`)

    return NextResponse.json(listing)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    throw e
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = Number(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  await prisma.listing.delete({ where: { id } })

  revalidatePath('/')
  revalidatePath('/browse', 'layout')

  return NextResponse.json({ ok: true })
}
