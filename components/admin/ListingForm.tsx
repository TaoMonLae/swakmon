'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { ImageUploader, type ImageItem } from '@/components/admin/ImageUploader'
import { readListingImages } from '@/lib/listingInput'
import type { Category, Listing, State, Township } from '@prisma/client'

type ListingWithRels = Listing & {
  category: Category
  state: State
  township: Township
}

interface ListingFormProps {
  listing?: ListingWithRels
  categories: Category[]
  states: (State & { townships: Township[] })[]
}

export function ListingForm({ listing, categories: initialCategories, states }: ListingFormProps) {
  const router = useRouter()
  const isEdit = !!listing
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isFreeUntilSold, setIsFreeUntilSold] = useState(listing?.isFreeUntilSold ?? false)
  const [selectedStateId, setSelectedStateId] = useState<number | null>(listing?.stateId ?? null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(listing?.categoryId ?? null)

  // Category creation state
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryIcon, setNewCategoryIcon] = useState('ti-tag')
  const [addingCategory, setAddingCategory] = useState(false)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const newCategoryInputRef = useRef<HTMLInputElement>(null)

  // Images state — initialise from the listing's images Json column if editing.
  const [images, setImages] = useState<ImageItem[]>(() => {
    if (!listing) return []
    return readListingImages(listing.images).map((img, i) => ({
      url: img.url,
      publicId: img.publicId || `existing-${i}`,
      order: i,
    }))
  })

  const townships = states.find((s) => s.id === selectedStateId)?.townships ?? []
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)
  const isProperty = selectedCategory?.slug === 'rent' || selectedCategory?.slug === 'sale'
  const isLand = selectedCategory?.slug === 'land'
  const isMoto = selectedCategory?.slug === 'moto'

  async function handleAddCategory() {
    const name = newCategoryName.trim()
    if (!name) return
    setAddingCategory(true)
    setCategoryError(null)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, icon: newCategoryIcon }),
      })
      const data = await res.json()
      if (!res.ok) {
        setCategoryError(data.error ?? 'Failed to create category')
        return
      }
      setCategories((prev) => [...prev, data as Category])
      setSelectedCategoryId(data.id)
      setNewCategoryName('')
      setNewCategoryIcon('ti-tag')
      setShowNewCategory(false)
    } catch {
      setCategoryError('Network error')
    } finally {
      setAddingCategory(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const form = new FormData(e.currentTarget)
    setSubmitError(null)
    const body = {
      title: form.get('title'),
      description: form.get('description'),
      price: form.get('price') ? Number(form.get('price')) : null,
      priceLabel: form.get('priceLabel') || null,
      priceType: form.get('priceType'),
      stateId: Number(form.get('stateId')),
      townshipId: Number(form.get('townshipId')),
      contactPhone: form.get('contactPhone') || null,
      contactViber: form.get('contactViber') === 'on',
      contactWhatsApp: form.get('contactWhatsApp') === 'on',
      contactFacebook: form.get('contactFacebook') || null,
      categoryId: Number(form.get('categoryId')),
      tier: form.get('tier'),
      tierOverridePrice: form.get('tierOverridePrice') ? Number(form.get('tierOverridePrice')) : null,
      tierDiscountPct: form.get('tierDiscountPct') ? Number(form.get('tierDiscountPct')) : null,
      isFreeUntilSold,
      commissionType: form.get('commissionType') || null,
      commissionValue: form.get('commissionValue') ? Number(form.get('commissionValue')) : null,
      status: form.get('status'),
      adminNotes: form.get('adminNotes') || null,
      images: images.map(({ url, publicId }, i) => ({ url, publicId, order: i })),
    }
    try {
      const url = isEdit ? `/api/admin/listings/${listing.id}` : '/api/admin/listings'
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        router.push('/admin/listings')
      } else {
        const data = await res.json().catch(() => ({}))
        setSubmitError(data.error ?? `Save failed (${res.status})`)
      }
    } catch {
      setSubmitError('Network error — please try again.')
    } finally {
      setSaving(false)
    }
  }

  const f = (name: keyof Listing) => listing?.[name] as string | number | null | undefined

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <Input label="Title" name="title" required defaultValue={f('title') as string ?? ''} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          rows={5}
          required
          defaultValue={f('description') as string ?? ''}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      {/* Section B – Property details (conditional) */}
      {isProperty && (
        <fieldset className="rounded-lg border border-gray-200 p-4 space-y-4">
          <legend className="px-2 text-sm font-semibold text-gray-700">Property Details</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Bedrooms" name="bedrooms" type="number" min={0} />
            <Input label="Bathrooms" name="bathrooms" type="number" min={0} />
            <Input label="Floor area (sqm)" name="floorArea" type="number" min={0} />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" name="furnished" className="rounded" />
            Furnished
          </label>
        </fieldset>
      )}
      {isLand && (
        <fieldset className="rounded-lg border border-gray-200 p-4 space-y-4">
          <legend className="px-2 text-sm font-semibold text-gray-700">Land Details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Acreage" name="acreage" type="number" step="0.01" min={0} />
            <Input label="Land type" name="landType" placeholder="e.g. Agricultural, Residential" />
          </div>
        </fieldset>
      )}
      {isMoto && (
        <fieldset className="rounded-lg border border-gray-200 p-4 space-y-4">
          <legend className="px-2 text-sm font-semibold text-gray-700">Motorcycle Details</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Make" name="motoMake" placeholder="e.g. Honda" />
            <Input label="Model" name="motoModel" placeholder="e.g. Wave 125" />
            <Input label="Year" name="motoYear" type="number" min={1990} max={2030} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Color" name="motoColor" />
            <Input label="Mileage (km)" name="motoMileage" type="number" min={0} />
          </div>
        </fieldset>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Price (MMK)" name="price" type="number" defaultValue={f('price') as number ?? ''} />
        <Input label="Price Label" name="priceLabel" placeholder="e.g. 350,000/mo" defaultValue={f('priceLabel') as string ?? ''} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
          <select name="priceType" defaultValue={f('priceType') as string ?? 'FIXED'} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green">
            <option value="FIXED">Fixed</option>
            <option value="MONTHLY">Monthly</option>
            <option value="WEEKLY">Weekly</option>
            <option value="NEGOTIABLE">Negotiable</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State / Region</label>
          <select
            name="stateId"
            required
            defaultValue={f('stateId') as number ?? ''}
            onChange={(e) => setSelectedStateId(Number(e.target.value))}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          >
            <option value="">Select state…</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Township</label>
          <select name="townshipId" required defaultValue={f('townshipId') as number ?? ''} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green">
            <option value="">Select township…</option>
            {townships.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Contact Phone" name="contactPhone" defaultValue={f('contactPhone') as string ?? ''} />
        <Input label="Facebook URL" name="contactFacebook" defaultValue={f('contactFacebook') as string ?? ''} />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" name="contactViber" defaultChecked={listing?.contactViber ?? true} className="rounded" />
          Viber available
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" name="contactWhatsApp" defaultChecked={listing?.contactWhatsApp ?? true} className="rounded" />
          WhatsApp available
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="categoryId"
            required
            value={selectedCategoryId ?? ''}
            onChange={(e) => {
              const val = e.target.value
              if (val === '__new__') {
                setShowNewCategory(true)
                setTimeout(() => newCategoryInputRef.current?.focus(), 50)
              } else {
                setSelectedCategoryId(Number(val) || null)
                setShowNewCategory(false)
              }
            }}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          >
            <option value="">Select…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            <option value="__new__">＋ Add new category…</option>
          </select>

          {/* Inline new-category form */}
          {showNewCategory && (
            <div className="mt-2 rounded-lg border border-dashed border-brand-green bg-green-50 p-3 space-y-2">
              <p className="text-xs font-semibold text-brand-green">New category</p>
              <input
                ref={newCategoryInputRef}
                type="text"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => { setNewCategoryName(e.target.value); setCategoryError(null) }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory() } }}
                className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
              />
              <input
                type="text"
                placeholder="Icon class (e.g. ti-home)"
                value={newCategoryIcon}
                onChange={(e) => setNewCategoryIcon(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
              />
              {categoryError && (
                <p className="text-xs text-red-600">{categoryError}</p>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  loading={addingCategory}
                  onClick={handleAddCategory}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => { setShowNewCategory(false); setCategoryError(null) }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" defaultValue={f('status') as string ?? 'PENDING'} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green">
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="SOLD">Sold</option>
            <option value="RENTED">Rented</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
          <select name="tier" defaultValue={f('tier') as string ?? 'BASIC'} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green">
            <option value="BASIC">Basic</option>
            <option value="FEATURED">Featured</option>
            <option value="PREMIUM">Premium</option>
          </select>
        </div>
        <Input label="Tier Override Price (MMK)" name="tierOverridePrice" type="number" defaultValue={f('tierOverridePrice') as number ?? ''} />
        <Input label="Tier Discount %" name="tierDiscountPct" type="number" min={0} max={100} defaultValue={f('tierDiscountPct') as number ?? ''} />
      </div>

      <div className="flex flex-wrap gap-6">
        <Toggle checked={isFreeUntilSold} onChange={setIsFreeUntilSold} label="Free until sold/rented" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Commission Type</label>
          <select name="commissionType" defaultValue={f('commissionType') as string ?? ''} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green">
            <option value="">None</option>
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED_MMK">Fixed MMK</option>
          </select>
        </div>
        <Input label="Commission Value" name="commissionValue" type="number" step="0.01" defaultValue={f('commissionValue') as number ?? ''} />
      </div>

      {/* Image Uploader */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
        <textarea
          name="adminNotes"
          rows={3}
          defaultValue={f('adminNotes') as string ?? ''}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          placeholder="Internal notes (not shown to public)"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="secondary" loading={saving}>
          {isEdit ? 'Save Changes' : 'Create Listing'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
