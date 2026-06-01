import { prisma } from '@/lib/prisma'
import { AdminPricingClient } from './AdminPricingClient'

export const metadata = { title: 'Pricing | TM Admin' }

interface TierConfig {
  tier: string
  label: string
  basePrice: number
  unit: string
  active: boolean
}

const DEFAULT_TIERS: TierConfig[] = [
  { tier: 'BASIC',    label: 'Basic',    basePrice: 0,     unit: 'free',     active: true },
  { tier: 'FEATURED', label: 'Featured', basePrice: 5000,  unit: 'per week', active: true },
  { tier: 'PREMIUM',  label: 'Premium',  basePrice: 12000, unit: 'per week', active: true },
]

export default async function AdminPricingPage() {
  // Load persisted config, creating it with defaults if it doesn't exist yet.
  const config = await prisma.pricingConfig.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      tiers: DEFAULT_TIERS as unknown as import('@prisma/client').Prisma.InputJsonValue,
      freeUntilSoldDefault: false,
      defaultCommission: 3,
    },
  })

  const tiers = (config.tiers as unknown as TierConfig[]).map((t) => ({
    tier: t.tier,
    label: t.label,
    // API stores as `basePrice`; normalise to `price` for the client component
    price: t.basePrice ?? 0,
    active: t.active,
  }))

  return (
    <AdminPricingClient
      initialTiers={tiers}
      initialFreeUntilSoldDefault={config.freeUntilSoldDefault}
      initialDefaultCommission={config.defaultCommission}
    />
  )
}
