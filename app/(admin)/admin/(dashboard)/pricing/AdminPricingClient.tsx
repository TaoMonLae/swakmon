'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Toggle } from '@/components/ui/Toggle'
import { Input } from '@/components/ui/Input'

interface TierRow {
  tier: string
  label: string
  price: number
  active: boolean
}

interface Props {
  initialTiers: TierRow[]
  initialFreeUntilSoldDefault: boolean
  initialDefaultCommission: number
}

export function AdminPricingClient({
  initialTiers,
  initialFreeUntilSoldDefault,
  initialDefaultCommission,
}: Props) {
  const [tiers, setTiers] = useState<TierRow[]>(initialTiers)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [freeUntilSoldDefault, setFreeUntilSoldDefault] = useState(initialFreeUntilSoldDefault)
  const [defaultCommission, setDefaultCommission] = useState(initialDefaultCommission)

  function updateTier(index: number, updates: Partial<TierRow>) {
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, ...updates } : t)))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tiers, freeUntilSoldDefault, defaultCommission }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Save failed')
      }
    } catch {
      setError('Network error – could not save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>

      {/* Listing Tiers */}
      <Card>
        <CardHeader>
          <CardTitle>Listing Tiers</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {tiers.map((tier, i) => (
            <div
              key={tier.tier}
              className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-100 p-4"
            >
              <div className="w-24">
                <p className="text-sm font-semibold text-gray-900">{tier.label}</p>
              </div>
              <div className="w-40">
                {tier.tier === 'BASIC' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={0}
                      readOnly
                      className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400"
                    />
                    <Badge variant="active">Always free</Badge>
                  </div>
                ) : (
                  <Input
                    type="number"
                    min={0}
                    step={500}
                    value={tier.price}
                    onChange={(e) => updateTier(i, { price: Number(e.target.value) })}
                    helpText="MMK / week"
                  />
                )}
              </div>
              {tier.tier !== 'BASIC' && (
                <Toggle
                  checked={tier.active}
                  onChange={(checked) => updateTier(i, { active: checked })}
                  label="Active"
                />
              )}
            </div>
          ))}

          <div className="flex items-center gap-3 pt-2">
            <Button variant="secondary" size="sm" loading={saving} onClick={handleSave}>
              Save changes
            </Button>
            {saved && (
              <span className="text-sm text-green-600">
                <i className="ti ti-check mr-1" aria-hidden="true" />
                Saved successfully
              </span>
            )}
            {error && (
              <span className="text-sm text-red-600">
                <i className="ti ti-alert-circle mr-1" aria-hidden="true" />
                {error}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Free until sold – global default */}
      <Card>
        <CardHeader>
          <CardTitle>Free Until Sold – Global Default</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <Toggle
            checked={freeUntilSoldDefault}
            onChange={setFreeUntilSoldDefault}
            label="Enable 'Free until sold' as default for new listings"
          />
          {freeUntilSoldDefault && (
            <Input
              label="Default commission %"
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={defaultCommission}
              onChange={(e) => setDefaultCommission(Number(e.target.value))}
              helpText="Applied when seller's property is sold/rented"
            />
          )}
          <p className="text-xs text-gray-400">
            This sets the default for new listings. Individual listings can override this in
            the listing editor.
          </p>
        </div>
      </Card>
    </div>
  )
}
