'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ListingGrid, type ListingData } from './ListingGrid'
import { cn } from '@/lib/cn'
import { t, translateName } from '@/lib/i18n'
import { useLocale } from '@/components/LocaleProvider'

const STATE_TABS = [
    { slug: 'all', label: 'All' },
    { slug: 'mon-state', label: 'Mon State' },
    { slug: 'karen-state', label: 'Karen State' },
    { slug: 'thanintharyi', label: 'Thanintharyi' },
]

interface LatestListingsProps {
    listings: ListingData[]
}

export function LatestListings({ listings }: LatestListingsProps) {
    const [activeTab, setActiveTab] = useState('all')
    const locale = useLocale()

    const filtered =
        activeTab === 'all'
            ? listings
            : listings.filter((l) => l.state.slug === activeTab)

    return (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{t('home.latest.title', locale)}</h2>
                <Link
                    href="/browse/all"
                    className="text-sm font-medium text-brand-green hover:underline"
                >
                    {t('home.latest.view_all', locale)}
                </Link>
            </div>

            {/* State filter tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
                {STATE_TABS.map((tab) => (
                    <button
                        key={tab.slug}
                        type="button"
                        onClick={() => setActiveTab(tab.slug)}
                        className={cn(
                            'rounded-full px-4 py-1.5 text-sm font-medium transition',
                            activeTab === tab.slug
                                ? 'bg-brand-green text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                    >
                        {translateName(tab.label, locale)}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <ListingGrid
                listings={filtered.slice(0, 6)}
                emptyMessage={t('home.latest.empty', locale)}
            />
        </section>
    )
}
