'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'

interface CategoryTab {
    slug: string
    name: string
    count: number
}

interface StateOption {
    slug: string
    name: string
    count: number
}

interface TownshipOption {
    slug: string
    name: string
}

interface BrowseFiltersProps {
    categories: CategoryTab[]
    states: StateOption[]
    townships: TownshipOption[]
    currentCategory: string
    currentState: string
    currentTownship: string
    currentMinPrice: string
    currentMaxPrice: string
    currentSort: string
}

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'views', label: 'Most Viewed' },
]

export function BrowseFilters({
    categories,
    states,
    townships,
    currentCategory,
    currentState,
    currentTownship,
    currentMinPrice,
    currentMaxPrice,
    currentSort,
}: BrowseFiltersProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [mobileOpen, setMobileOpen] = useState(false)

    function updateParams(updates: Record<string, string | null>) {
        const params = new URLSearchParams(searchParams.toString())
        for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === '') {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        }
        // Reset page when filters change
        if (!('page' in updates)) params.delete('page')
        const qs = params.toString()
        router.push(`${pathname}${qs ? `?${qs}` : ''}`)
    }

    function handleCategoryChange(slug: string) {
        const newPath = `/browse/${slug}`
        const params = new URLSearchParams(searchParams.toString())
        params.delete('page')
        const qs = params.toString()
        router.push(`${newPath}${qs ? `?${qs}` : ''}`)
    }

    function handleReset() {
        router.push('/browse/all')
    }

    const [minPrice, setMinPrice] = useState(currentMinPrice)
    const [maxPrice, setMaxPrice] = useState(currentMaxPrice)

    function applyPriceFilter() {
        updateParams({ minPrice: minPrice || null, maxPrice: maxPrice || null })
    }

    const filterContent = (
        <div className="space-y-6">
            {/* Category tabs */}
            <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">Category</h3>
                <div className="space-y-1">
                    {categories.map((cat) => (
                        <button
                            key={cat.slug}
                            type="button"
                            onClick={() => handleCategoryChange(cat.slug)}
                            className={cn(
                                'flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm transition',
                                currentCategory === cat.slug
                                    ? 'bg-brand-green text-white font-medium'
                                    : 'text-gray-600 hover:bg-gray-100'
                            )}
                        >
                            <span>{cat.name}</span>
                            <span className="text-xs opacity-70">{cat.count}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* State filter */}
            <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">State</h3>
                <div className="space-y-1.5">
                    {states.map((state) => (
                        <label key={state.slug} className="flex cursor-pointer items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={currentState === state.slug}
                                onChange={() =>
                                    updateParams({ state: currentState === state.slug ? null : state.slug, township: null })
                                }
                                className="h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                            />
                            <span className="text-gray-700">{state.name}</span>
                            <span className="ml-auto text-xs text-gray-400">({state.count})</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Township filter - only when single state selected */}
            {currentState && townships.length > 0 && (
                <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">Township</h3>
                    <select
                        value={currentTownship}
                        onChange={(e) => updateParams({ township: e.target.value || null })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                    >
                        <option value="">All Townships</option>
                        {townships.map((t) => (
                            <option key={t.slug} value={t.slug}>{t.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Price range */}
            <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">Price Range</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min MMK"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        onBlur={applyPriceFilter}
                        onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                    />
                    <span className="text-gray-400">–</span>
                    <input
                        type="number"
                        placeholder="Max MMK"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        onBlur={applyPriceFilter}
                        onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                    />
                </div>
            </div>

            {/* Sort */}
            <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">Sort</h3>
                <select
                    value={currentSort}
                    onChange={(e) => updateParams({ sort: e.target.value === 'newest' ? null : e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                >
                    {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Reset */}
            <Button variant="ghost" size="sm" className="w-full" onClick={handleReset}>
                Reset Filters
            </Button>
        </div>
    )

    return (
        <>
            {/* Mobile toggle */}
            <div className="lg:hidden">
                <button
                    type="button"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700"
                >
                    <span><i className="ti ti-filter mr-2" aria-hidden="true" />Filters</span>
                    <i className={cn('ti', mobileOpen ? 'ti-chevron-up' : 'ti-chevron-down')} aria-hidden="true" />
                </button>
                {mobileOpen && (
                    <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4">
                        {filterContent}
                    </div>
                )}
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden lg:block">
                <div className="sticky top-20 rounded-lg border border-gray-200 bg-white p-5">
                    {filterContent}
                </div>
            </aside>
        </>
    )
}
