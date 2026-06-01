'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'

interface Promotion {
  id: string
  name: string
  discountType: 'PERCENTAGE' | 'FIXED_MMK'
  discountValue: number
  appliesToTier: string
  appliesToCategory: string
  appliesToState: string
  validFrom: string
  validUntil: string
  isActive: boolean
}

interface CategoryOption { slug: string; name: string }
interface StateOption    { slug: string; name: string }

const EMPTY_FORM: Omit<Promotion, 'id'> = {
  name: '', discountType: 'PERCENTAGE', discountValue: 20,
  appliesToTier: 'all', appliesToCategory: 'all', appliesToState: 'all',
  validFrom: '', validUntil: '', isActive: true,
}

export default function AdminPromotionsPage() {
  const [promotions,  setPromotions]  = useState<Promotion[]>([])
  const [categories,  setCategories]  = useState<CategoryOption[]>([])
  const [states,      setStates]      = useState<StateOption[]>([])
  const [editing,     setEditing]     = useState<Promotion | null>(null)
  const [formData,    setFormData]    = useState(EMPTY_FORM)
  const [showForm,    setShowForm]    = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [formError,   setFormError]   = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const fetchPromotions = useCallback(async () => {
    const res = await fetch('/api/admin/promotions')
    if (res.ok) setPromotions(await res.json())
  }, [])

  // Load promotions, categories and states in parallel on mount.
  useEffect(() => {
    fetchPromotions()

    // Fetch categories from DB so newly-added ones appear here automatically.
    fetch('/api/admin/categories')
      .then((r) => r.ok ? r.json() : [])
      .then((data: { slug: string; name: string }[]) => setCategories(data))
      .catch(() => {})

    // Fetch states from DB.
    fetch('/api/admin/states')
      .then((r) => r.ok ? r.json() : [])
      .then((data: { slug: string; name: string }[]) => setStates(data))
      .catch(() => {})
  }, [fetchPromotions])

  function openNew() {
    setEditing(null)
    setFormData(EMPTY_FORM)
    setFormError(null)
    setShowForm(true)
  }

  function openEdit(promo: Promotion) {
    setEditing(promo)
    setFormData({ ...promo })
    setFormError(null)
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    setFormError(null)
    try {
      const url    = editing ? `/api/admin/promotions/${editing.id}` : '/api/admin/promotions'
      const method = editing ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setFormError(data.error ?? `Save failed (${res.status})`)
        return
      }
    } catch {
      setFormError('Network error — promotion not saved')
      return
    } finally {
      setSaving(false)
    }
    setShowForm(false)
    fetchPromotions()
  }

  async function handleToggle(promo: Promotion) {
    setActionError(null)
    try {
      const res = await fetch(`/api/admin/promotions/${promo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !promo.isActive }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setActionError(data.error ?? 'Toggle failed')
        return
      }
    } catch {
      setActionError('Network error — toggle not applied')
      return
    }
    fetchPromotions()
  }

  async function handleDelete(promo: Promotion) {
    if (!confirm(`Delete "${promo.name}"?`)) return
    setActionError(null)
    try {
      const res = await fetch(`/api/admin/promotions/${promo.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setActionError(data.error ?? 'Delete failed')
        return
      }
    } catch {
      setActionError('Network error — promotion not deleted')
      return
    }
    fetchPromotions()
  }

  // Fix: 'inactive' is a distinct state from 'expired'.
  // Manually deactivated promotions should NOT show as "Expired".
  function getStatus(p: Promotion): 'active' | 'pending' | 'expired' | 'inactive' {
    if (!p.isActive) return 'inactive'
    const now = new Date()
    if (p.validFrom  && new Date(p.validFrom)  > now) return 'pending'
    if (p.validUntil && new Date(p.validUntil) < now) return 'expired'
    return 'active'
  }

  const statusLabel: Record<string, string> = {
    active:   'Active',
    pending:  'Upcoming',
    expired:  'Expired',
    inactive: 'Inactive',
  }
  const statusVariant: Record<string, 'active' | 'pending' | 'expired' | 'default'> = {
    active:   'active',
    pending:  'pending',
    expired:  'expired',
    inactive: 'default',
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* LEFT – Promotion list */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
          <Button variant="secondary" size="sm" onClick={openNew}>+ Add Promotion</Button>
        </div>

        {actionError && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            <i className="ti ti-alert-circle" aria-hidden="true" />
            {actionError}
            <button type="button" onClick={() => setActionError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        {promotions.length === 0 ? (
          <Card>
            <div className="py-12 text-center">
              <i className="ti ti-discount-2 text-5xl text-gray-300" aria-hidden="true" />
              <p className="mt-3 text-gray-500">No promotions yet. Create your first discount.</p>
            </div>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Discount</th>
                  <th className="px-4 py-3 text-left">Applies to</th>
                  <th className="px-4 py-3 text-left">Valid period</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {promotions.map((p) => {
                  const status = getStatus(p)
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.discountType === 'PERCENTAGE' ? `${p.discountValue}%` : `${p.discountValue} MMK`}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {p.appliesToTier !== 'all' ? p.appliesToTier : 'All tiers'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {p.validFrom ? new Date(p.validFrom).toLocaleDateString() : '—'} –{' '}
                        {p.validUntil ? new Date(p.validUntil).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => openEdit(p)} className="text-xs text-brand-green hover:underline">
                            <i className="ti ti-pencil" aria-hidden="true" />
                          </button>
                          <button type="button" onClick={() => handleToggle(p)} className="text-xs text-gray-500 hover:underline">
                            {p.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button type="button" onClick={() => handleDelete(p)} className="text-xs text-red-500 hover:underline">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RIGHT – Add/Edit form */}
      {showForm && (
        <Card className="lg:sticky lg:top-20 lg:self-start">
          <CardHeader>
            <CardTitle>{editing ? 'Edit Promotion' : 'Add Promotion'}</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <Input
              label="Name"
              required
              placeholder="e.g. Launch month – 50% off Featured"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" checked={formData.discountType === 'PERCENTAGE'} onChange={() => setFormData({ ...formData, discountType: 'PERCENTAGE' })} />
                  Percentage
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" checked={formData.discountType === 'FIXED_MMK'} onChange={() => setFormData({ ...formData, discountType: 'FIXED_MMK' })} />
                  Fixed MMK
                </label>
              </div>
            </div>

            <Input
              label={formData.discountType === 'PERCENTAGE' ? 'Discount %' : 'Discount (MMK)'}
              type="number"
              min={0}
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
              helpText={formData.discountType === 'PERCENTAGE' ? 'e.g. 20 for 20% off' : 'MMK amount off'}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applies to tier</label>
              <select
                value={formData.appliesToTier}
                onChange={(e) => setFormData({ ...formData, appliesToTier: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="all">All tiers</option>
                <option value="BASIC">Basic</option>
                <option value="FEATURED">Featured</option>
                <option value="PREMIUM">Premium</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applies to category</label>
              <select
                value={formData.appliesToCategory}
                onChange={(e) => setFormData({ ...formData, appliesToCategory: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="all">All categories</option>
                {/* Loaded from DB — includes any categories added via "Add New Category" */}
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applies to state</label>
              <select
                value={formData.appliesToState}
                onChange={(e) => setFormData({ ...formData, appliesToState: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="all">All states</option>
                {/* Loaded from DB — not hardcoded */}
                {states.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Valid from"
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
              />
              <Input
                label="Valid until"
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              />
            </div>

            <Toggle
              checked={formData.isActive}
              onChange={(v) => setFormData({ ...formData, isActive: v })}
              label="Is active"
            />

            {formError && (
              <p className="text-sm text-red-600">
                <i className="ti ti-alert-circle mr-1" aria-hidden="true" />
                {formError}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" size="sm" loading={saving} onClick={handleSave}>Save</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
