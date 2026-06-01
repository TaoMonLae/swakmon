import { ListingCard } from './ListingCard'
import type { ListingTier } from '@prisma/client'

export interface ListingData {
  id: number
  title: string
  price: number | null
  priceLabel: string | null
  tier: ListingTier
  createdAt: Date | string
  category: { name: string; slug: string }
  state: { name: string; slug: string }
  township: { name: string }
  imageUrl?: string | null
}

interface ListingGridProps {
  listings: ListingData[]
  emptyMessage?: string
}

export function ListingGrid({ listings, emptyMessage = 'No listings found.' }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="py-20 text-center text-gray-400">
        <i className="ti ti-folder-open text-5xl" aria-hidden="true" />
        <p className="mt-2">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((l) => (
        <ListingCard
          key={l.id}
          id={l.id}
          title={l.title}
          price={l.price}
          priceLabel={l.priceLabel}
          tier={l.tier}
          categorySlug={l.category.slug}
          categoryName={l.category.name}
          stateName={l.state.name}
          townshipName={l.township.name}
          imageUrl={l.imageUrl}
          createdAt={l.createdAt}
        />
      ))}
    </div>
  )
}
