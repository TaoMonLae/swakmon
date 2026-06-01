'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { readListingImages } from '@/lib/listingInput'
import type { ListingStatus, ListingTier } from '@prisma/client'

const tierBadge: Record<ListingTier, 'default' | 'featured' | 'premium'> = {

    BASIC: 'default',
    FEATURED: 'featured',
    PREMIUM: 'premium',
}

interface ListingRow {
    id: number
    listingRef: string
    title: string
    price: number | null
    priceLabel: string | null
    tier: ListingTier
    status: ListingStatus
    createdAt: string
    category: { name: string }
    state: { name: string }
    township: { name: string }
    images: unknown
}

interface ListingsTableProps {
    listings: ListingRow[]
}

export function ListingsTable({ listings }: ListingsTableProps) {
    const router = useRouter()
    const [actionError, setActionError] = useState<string | null>(null)

    async function handleStatusChange(id: number, newStatus: string) {
        setActionError(null)
        try {
            const res = await fetch(`/api/admin/listings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                setActionError(data.error ?? `Failed to update status (${res.status})`)
                return
            }
        } catch {
            setActionError('Network error — status not updated')
            return
        }
        router.refresh()
    }

    async function handleDelete(id: number, title: string) {
        if (!confirm(`Archive "${title}"? This will hide it from public view.`)) return
        setActionError(null)
        try {
            const res = await fetch(`/api/admin/listings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'ARCHIVED' }),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                setActionError(data.error ?? `Failed to archive listing (${res.status})`)
                return
            }
        } catch {
            setActionError('Network error — listing not archived')
            return
        }
        router.refresh()
    }

    if (listings.length === 0) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
                <i className="ti ti-file-plus text-5xl text-gray-300" aria-hidden="true" />
                <p className="mt-3 text-gray-500">No listings yet. Create your first one.</p>
                <Link
                    href="/admin/listings/new"
                    className="mt-3 inline-block text-sm font-medium text-brand-green hover:underline"
                >
                    + Add Listing
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-3">
        {actionError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                <i className="ti ti-alert-circle" aria-hidden="true" />
                {actionError}
                <button type="button" onClick={() => setActionError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
            </div>
        )}
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
                    <tr>
                        <th className="px-3 py-3 text-left">Ref</th>
                        <th className="px-3 py-3 text-left">Thumb</th>
                        <th className="px-3 py-3 text-left">Title</th>
                        <th className="px-3 py-3 text-left">Category</th>
                        <th className="px-3 py-3 text-left">State</th>
                        <th className="px-3 py-3 text-left">Tier</th>
                        <th className="px-3 py-3 text-left">Status</th>
                        <th className="px-3 py-3 text-left">Created</th>
                        <th className="px-3 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {listings.map((l) => (
                        <tr key={l.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2.5 font-mono text-xs text-gray-400">{l.listingRef}</td>
                            <td className="px-3 py-2.5">
                                {readListingImages(l.images)[0]?.url ? (
                                    <Image
                                        src={readListingImages(l.images)[0]!.url}
                                        alt={l.title}
                                        width={40}
                                        height={40}
                                        className="h-10 w-10 rounded object-cover"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-gray-300">
                                        <i className="ti ti-photo text-sm" aria-hidden="true" />
                                    </div>
                                )}
                            </td>
                            <td className="px-3 py-2.5 max-w-[160px] truncate font-medium text-gray-900">
                                {l.title}
                            </td>
                            <td className="px-3 py-2.5 text-gray-500">{l.category.name}</td>
                            <td className="px-3 py-2.5 text-gray-500">{l.state.name}</td>
                            <td className="px-3 py-2.5">
                                <Badge variant={tierBadge[l.tier]}>{l.tier}</Badge>
                            </td>
                            <td className="px-3 py-2.5">
                                <select
                                    value={l.status}
                                    onChange={(e) => handleStatusChange(l.id, e.target.value)}
                                    className="rounded border border-gray-200 px-2 py-1 text-xs focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="SOLD">Sold</option>
                                    <option value="RENTED">Rented</option>
                                    <option value="ARCHIVED">Archived</option>
                                </select>
                            </td>
                            <td className="px-3 py-2.5 text-xs text-gray-400">
                                {new Date(l.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-2.5">
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/admin/listings/${l.id}`}
                                        className="text-xs font-medium text-brand-green hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(l.id, l.title)}
                                        className="text-xs font-medium text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    )
}
