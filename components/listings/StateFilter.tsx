'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/cn'

const STATES = [
  { slug: '', label: 'All Regions' },
  { slug: 'mon-state', label: 'Mon State' },
  { slug: 'karen-state', label: 'Karen State' },
  { slug: 'thanintharyi', label: 'Thanintharyi' },
]

export function StateFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('state') ?? ''

  function setFilter(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) params.set('state', slug)
    else params.delete('state')
    params.delete('page')
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {STATES.map((s) => {
        const active = current === s.slug
        return (
          <button
            key={s.slug}
            onClick={() => setFilter(s.slug)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition',
              active
                ? 'border-ink bg-ink text-white'
                : 'border-hairline text-ink hover:border-ink'
            )}
          >
            {s.label}
          </button>
        )
      })}
    </div>
  )
}
