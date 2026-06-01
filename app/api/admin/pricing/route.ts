import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { Prisma } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface TierConfig {
  tier: string
  label: string
  basePrice: number
  unit: string
  active: boolean
}

const DEFAULT_TIERS: TierConfig[] = [
  { tier: 'BASIC', label: 'Basic', basePrice: 0, unit: 'free', active: true },
  { tier: 'FEATURED', label: 'Featured', basePrice: 5000, unit: 'per week', active: true },
  { tier: 'PREMIUM', label: 'Premium', basePrice: 12000, unit: 'per week', active: true },
]

// Load the single global config row, creating it with defaults if absent.
async function getConfig() {
  return prisma.pricingConfig.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      tiers: DEFAULT_TIERS as unknown as Prisma.InputJsonValue,
      freeUntilSoldDefault: false,
      defaultCommission: 3,
    },

  })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const config = await getConfig()
  return NextResponse.json({
    tiers: config.tiers,
    freeUntilSoldDefault: config.freeUntilSoldDefault,
    defaultCommission: config.defaultCommission,
  })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  await getConfig() // ensure the row exists

  const data: Prisma.PricingConfigUpdateInput = {}

  if (Array.isArray(body.tiers)) {
    const tiers: TierConfig[] = (body.tiers as Array<Record<string, unknown>>).map((t) => ({
      tier: String(t.tier),
      label: String(t.label),
      basePrice: Number(t.price) || 0,
      unit: t.tier === 'BASIC' ? 'free' : 'per week',
      active: t.active === true,
    }))
    data.tiers = tiers as unknown as Prisma.InputJsonValue
  }

  if (typeof body.freeUntilSoldDefault === 'boolean') {
    data.freeUntilSoldDefault = body.freeUntilSoldDefault
  }
  if (body.defaultCommission !== undefined && Number.isFinite(Number(body.defaultCommission))) {
    data.defaultCommission = Number(body.defaultCommission)
  }

  const config = await prisma.pricingConfig.update({ where: { id: 'global' }, data })

  // Bust the public Post-Ad page so updated prices show immediately.
  revalidatePath('/post-ad')

  return NextResponse.json({
    ok: true,
    tiers: config.tiers,
    freeUntilSoldDefault: config.freeUntilSoldDefault,
    defaultCommission: config.defaultCommission,
  })
}
