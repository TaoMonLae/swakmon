'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

const STATES = [
    { value: '', label: 'All States' },
    { value: 'mon-state', label: 'Mon State' },
    { value: 'karen-state', label: 'Karen State' },
    { value: 'thanintharyi', label: 'Thanintharyi Region' },
]

const CATEGORIES = [
    { value: '', label: 'All Categories', slug: 'all' },
    { value: 'rent', label: 'Property Rent', slug: 'rent' },
    { value: 'sale', label: 'Property Sale', slug: 'sale' },
    { value: 'land', label: 'Land Sale', slug: 'land' },
    { value: 'moto', label: 'Motorcycles', slug: 'moto' },
]

export function HeroSearch() {
    const router = useRouter()
    const [state, setState] = useState('')
    const [category, setCategory] = useState('')
    const [keyword, setKeyword] = useState('')

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const cat = CATEGORIES.find((c) => c.value === category)
        const slug = cat?.slug || 'all'
        const params = new URLSearchParams()
        if (state) params.set('state', state)
        if (keyword.trim()) params.set('q', keyword.trim())
        const qs = params.toString()
        router.push(`/browse/${slug}${qs ? `?${qs}` : ''}`)
    }

    const selectClass =
        'h-12 rounded-full border border-hairline bg-canvas px-4 text-sm text-ink focus:outline-none focus:border-ink'

    return (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                aria-label="Select state"
                className={selectClass}
            >
                {STATES.map((s) => (
                    <option key={s.value} value={s.value} className="text-gray-900">
                        {s.label}
                    </option>
                ))}
            </select>

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Select category"
                className={selectClass}
            >
                {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value} className="text-gray-900">
                        {c.label}
                    </option>
                ))}
            </select>

            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search listings..."
                className="h-12 rounded-full border border-hairline bg-canvas px-4 text-sm text-ink placeholder-muted-soft focus:outline-none focus:border-ink sm:w-48"
            />

            <Button type="submit" variant="primary" size="md">
                Search
            </Button>
        </form>
    )
}
