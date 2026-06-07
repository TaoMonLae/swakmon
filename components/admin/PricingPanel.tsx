'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import { formatMMK } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Toggle } from '@/components/ui/Toggle'
import { Input } from '@/components/ui/Input'
import type { ListingTier } from '@prisma/client'

export interface PricingData {
  tier: ListingTier
  overridePrice: number | null
  discountPct: number
  isFreeUntilSold: boolean
  commissionType: 'NONE' | 'PERCENTAGE' | 'FIXED_MMK'
  commissionValue: number | null
}

interface PricingPanelProps {
  initialTier: ListingTier
  initialData: {
    overridePrice?: number | null
    discountPct?: number | null
    isFreeUntilSold?: boolean
    commissionType?: string | null
    commissionValue?: number | null
  }
  tierPrices: { BASIC: number; FEATURED: number; PREMIUM: number }
  onChange: (data: PricingData) => void
}

const TIER_INFO: Record<ListingTier, { name: string; description: string }> = {
  BASIC: { name: 'Basic', description: 'Standard listing position' },
  FEATURED: { name: 'Featured', description: 'Top of category, featured badge' },
  PREMIUM: { name: 'Premium', description: 'Homepage spotlight, all categories top' },
}

export function PricingPanel({ initialTier, initialData, tierPrices, onChange }: PricingPanelProps) {
  const [tier, setTier] = useState<ListingTier>(initialTier)
  const [overrideEnabled, setOverrideEnabled] = useState(!!initialData.overridePrice)
  const [overridePrice, setOverridePrice] = useState<number | null>(initialData.overridePrice ?? null)
  const [discountEnabled, setDiscountEnabled] = useState(!!initialData.discountPct)
  const [discountPct, setDiscountPct] = useState(initialData.discountPct ?? 0)
  const [isFreeUntilSold, setIsFreeUntilSold] = useState(initialData.isFreeUntilSold ?? false)
  const [commissionType, setCommissionType] = useState<'NONE' | 'PERCENTAGE' | 'FIXED_MMK'>(
    (initialData.commissionType as 'NONE' | 'PERCENTAGE' | 'FIXED_MMK') ?? 'NONE'
  )
  const [commissionValue, setCommissionValue] = useState<number | null>(initialData.commissionValue ?? null)

  // Calculate final price
  const basePrice = overrideEnabled && overridePrice ? overridePrice : tierPrices[tier]
  const discount = discountEnabled ? discountPct : 0
  const finalPrice = Math.round(basePrice * (1 - discount / 100))
  const savings = basePrice - finalPrice

  // Keep latest onChange in a ref to avoid stale-closure issues
  const onChangeRef = useRef(onChange)
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  // Emit changes
  useEffect(() => {
    onChangeRef.current({
      tier,
      overridePrice: overrideEnabled ? overridePrice : null,
      discountPct: discountEnabled ? discountPct : 0,
      isFreeUntilSold,
      commissionType: isFreeUntilSold ? commissionType : 'NONE',
      commissionValue: isFreeUntilSold ? commissionValue : null,
    })
  }, [tier, overridePrice, overrideEnabled, discountPct, discountEnabled, isFreeUntilSold, commissionType, commissionValue])

  return (
    <div className="space-y-6">
      {/* SECTION A – Tier selection */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Listing Tier</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {(['BASIC', 'FEATURED', 'PREMIUM'] as ListingTier[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTier(t)}
              className={cn(
                'rounded-lg border-2 p-4 text-left transition',
                tier === t
                  ? 'border-brand-green bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <p className="text-sm font-semibold text-gray-900">{TIER_INFO[t].name}</p>
              <p className="mt-0.5 text-xs text-gray-500">{TIER_INFO[t].description}</p>
              <p className="mt-2 text-sm font-bold text-brand-green">
                {tierPrices[t] === 0 ? 'Free' : `${formatMMK(tierPrices[t])} / week`}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION B – Price customization */}
      <div className={cn(isFreeUntilSold && 'opacity-35 pointer-events-none')}>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Price Customization</h3>
        <div className="space-y-4 rounded-lg border border-gray-200 p-4">
          {/* Override price */}
          <div className="space-y-2">
            <Toggle
              checked={overrideEnabled}
              onChange={setOverrideEnabled}
              label="Override default price"
            />
            {overrideEnabled && (
              <Input
                label="Price (MMK/week)"
                type="number"
                min={0}
                step={500}
                value={overridePrice ?? ''}
                onChange={(e) => setOverridePrice(e.target.value ? Number(e.target.value) : null)}
              />
            )}
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <Toggle
              checked={discountEnabled}
              onChange={setDiscountEnabled}
              label="Apply discount"
            />
            {discountEnabled && (
              <div>
                <Input
                  label="Discount %"
                  type="number"
                  min={0}
                  max={100}
                  value={discountPct}
                  onChange={(e) => setDiscountPct(Number(e.target.value) || 0)}
                />
                {savings > 0 && (
                  <p className="mt-1 text-xs text-green-600">
                    Saves MMK {formatMMK(savings)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Final price bar */}
          <div className="rounded-md bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-500">Final price</p>
            <p className="text-lg font-bold text-brand-green">
              {isFreeUntilSold
                ? 'Free until sold / rented'
                : tier === 'BASIC' && finalPrice === 0
                  ? 'Free'
                  : `MMK ${formatMMK(finalPrice)} / week`}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION C – Free until sold */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Free Until Sold</h3>
        <div className="rounded-lg border border-gray-200 p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Toggle
              checked={isFreeUntilSold}
              onChange={setIsFreeUntilSold}
              label="Free listing – charge only when sold or rented"
            />
          </div>
          {isFreeUntilSold && (
            <Badge variant="featured">Overrides all pricing above</Badge>
          )}

          {isFreeUntilSold && (
            <div className="space-y-3 pt-2">
              <p className="text-sm font-medium text-green-700">
                Free until sold / rented
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="commission"
                    checked={commissionType === 'NONE'}
                    onChange={() => { setCommissionType('NONE'); setCommissionValue(null) }}
                    className="text-brand-green focus:ring-brand-green"
                  />
                  No commission – completely free for seller
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="commission"
                    checked={commissionType === 'PERCENTAGE'}
                    onChange={() => { setCommissionType('PERCENTAGE'); setCommissionValue(3) }}
                    className="text-brand-green focus:ring-brand-green"
                  />
                  % of sale price
                  {commissionType === 'PERCENTAGE' && (
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.5}
                      value={commissionValue ?? 3}
                      onChange={(e) => setCommissionValue(Number(e.target.value))}
                      className="ml-2 w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                  )}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="commission"
                    checked={commissionType === 'FIXED_MMK'}
                    onChange={() => { setCommissionType('FIXED_MMK'); setCommissionValue(50000) }}
                    className="text-brand-green focus:ring-brand-green"
                  />
                  Fixed fee
                  {commissionType === 'FIXED_MMK' && (
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={commissionValue ?? 50000}
                      onChange={(e) => setCommissionValue(Number(e.target.value))}
                      className="ml-2 w-28 rounded border border-gray-300 px-2 py-1 text-sm"
                      placeholder="MMK"
                    />
                  )}
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
