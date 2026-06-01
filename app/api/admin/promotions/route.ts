import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { DiscountType } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(promotions)
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

  const discountType =
    body.discountType === 'FIXED_MMK' ? DiscountType.FIXED_MMK : DiscountType.PERCENTAGE
  const discountValue = Number(body.discountValue)
  const validFrom = body.validFrom ? new Date(String(body.validFrom)) : null
  const validUntil = body.validUntil ? new Date(String(body.validUntil)) : null

  if (
    typeof body.name !== 'string' ||
    !body.name ||
    !Number.isFinite(discountValue) ||
    !validFrom ||
    isNaN(validFrom.getTime()) ||
    !validUntil ||
    isNaN(validUntil.getTime())
  ) {
    return NextResponse.json(
      { error: 'name, discountValue, validFrom and validUntil are required and must be valid' },
      { status: 400 }
    )
  }

  const promo = await prisma.promotion.create({
    data: {
      name: body.name,
      discountType,
      discountValue,
      appliesToTier: typeof body.appliesToTier === 'string' ? body.appliesToTier : 'all',
      appliesToCategory: typeof body.appliesToCategory === 'string' ? body.appliesToCategory : 'all',
      appliesToState: typeof body.appliesToState === 'string' ? body.appliesToState : 'all',
      validFrom,
      validUntil,
      isActive: body.isActive !== false,
    },
  })
  return NextResponse.json(promo, { status: 201 })
}
