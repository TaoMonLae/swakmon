import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { formatMMK, timeAgo } from '@/lib/utils'
import type { ListingTier } from '@prisma/client'

export interface ListingCardProps {
  id: number
  title: string
  price: number | null
  priceLabel?: string | null
  tier: ListingTier
  stateName: string
  townshipName: string
  categorySlug: string
  categoryName: string
  imageUrl?: string | null
  createdAt: Date | string
}

export function ListingCard({
  id,
  title,
  price,
  priceLabel,
  tier,
  stateName,
  townshipName,
  categorySlug,
  categoryName,
  imageUrl,
  createdAt,
}: ListingCardProps) {
  const isFeatured = tier === 'FEATURED' || tier === 'PREMIUM'
  const createdDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt

  return (
    <Link href={`/listing/${id}`} className="group block">
      <div
        className={`overflow-hidden rounded-md border bg-canvas transition hover:shadow-float ${isFeatured ? 'border-rausch/40' : 'border-hairline'
          }`}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <i className="ti ti-photo text-5xl" aria-hidden="true" />
            </div>
          )}

          {/* Category badge - top left */}
          <span className="absolute left-2 top-2">
            <Badge variant={categorySlug as 'rent' | 'sale' | 'land' | 'moto'}>
              {categoryName}
            </Badge>
          </span>

          {/* Featured/Premium badge - top right */}
          {isFeatured && (
            <span className="absolute right-2 top-2">
              <Badge variant={tier === 'PREMIUM' ? 'premium' : 'featured'}>
                {tier === 'PREMIUM' ? 'Premium' : 'Featured'}
              </Badge>
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-3">
          <p className="text-base font-bold text-brand-green">
            {priceLabel ?? formatMMK(price)}
          </p>
          <h3 className="mt-1 text-sm font-medium leading-snug text-gray-900 line-clamp-2 group-hover:text-brand-green transition">
            {title}
          </h3>
          <p className="mt-1.5 text-xs text-gray-500">
            {townshipName}, {stateName}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            {timeAgo(createdDate)}
          </p>
        </div>
      </div>
    </Link>
  )
}
