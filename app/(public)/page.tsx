import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { HeroSearch } from '@/components/listings/HeroSearch'
import { LatestListings } from '@/components/listings/LatestListings'
import { Button } from '@/components/ui/Button'
import type { ListingData } from '@/components/listings/ListingGrid'
import { t, translateName } from '@/lib/i18n'
import { getLocale } from '@/lib/i18n-server'
import { readListingImages } from '@/lib/listingInput'

const CATEGORY_TILES = [
  { slug: 'rent', name: 'Property Rent', icon: 'ti-home' },
  { slug: 'sale', name: 'Property Sale', icon: 'ti-building' },
  { slug: 'land', name: 'Land Sale', icon: 'ti-trees' },
  { slug: 'moto', name: 'Motorcycles', icon: 'ti-motorbike' },
]

async function getActiveListings() {
  return prisma.listing.findMany({
    where: { status: 'ACTIVE' },
    include: {
      category: true,
      state: true,
      township: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 12,
  })
}

async function getCategoryCounts() {
  const counts = await prisma.listing.groupBy({
    by: ['categoryId'],
    where: { status: 'ACTIVE' },
    _count: { id: true },
  })
  const categories = await prisma.category.findMany()
  return categories.map((cat) => ({
    ...cat,
    count: counts.find((c) => c.categoryId === cat.id)?._count.id ?? 0,
  }))
}

async function getTotalListingCount() {
  return prisma.listing.count({ where: { status: 'ACTIVE' } })
}

export default async function HomePage() {
  const locale = getLocale()
  const [listings, categoryCounts, totalCount] = await Promise.all([
    getActiveListings(),
    getCategoryCounts(),
    getTotalListingCount(),
  ])

  // Map to ListingData shape for client component
  const listingData: ListingData[] = listings.map((l) => ({
    id: l.id,
    title: l.title,
    price: l.price,
    priceLabel: l.priceLabel,
    tier: l.tier,
    createdAt: l.createdAt.toISOString(),
    category: { name: l.category.name, slug: l.category.slug },
    state: { name: l.state.name, slug: l.state.slug },
    township: { name: l.township.name },
    imageUrl: readListingImages(l.images)[0]?.url ?? null,
  }))

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="bg-canvas py-16 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-display text-3xl font-bold text-ink sm:text-5xl">
            {t('home.hero.title', locale)}
          </h1>
          <p className="mt-4 text-base text-muted">
            {t('home.hero.subtitle', locale)}
          </p>
          <HeroSearch />
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="border-y border-hairline bg-surface-soft">
        <div className="mx-auto flex max-w-3xl items-center justify-center divide-x divide-hairline px-4 py-5">
          <div className="px-6 text-center">
            <p className="text-xl font-bold text-rausch">{totalCount}</p>
            <p className="text-xs text-muted">{t('home.stats.listings', locale)}</p>
          </div>
          <div className="px-6 text-center">
            <p className="text-xl font-bold text-rausch">3</p>
            <p className="text-xs text-muted">{t('home.stats.states', locale)}</p>
          </div>
          <div className="px-6 text-center">
            <p className="text-xl font-bold text-rausch">{t('home.stats.free_value', locale)}</p>
            <p className="text-xs text-muted">{t('home.stats.free', locale)}</p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY TILES */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CATEGORY_TILES.map((tile) => {
            const catData = categoryCounts.find((c) => c.slug === tile.slug)
            const count = catData?.count ?? 0
            const listingsText = locale === 'my' ? 'ကြော်ငြာ' : (count === 1 ? 'listing' : 'listings')
            return (
              <Link
                key={tile.slug}
                href={`/browse/${tile.slug}`}
                className="group flex flex-col items-center rounded-md border border-hairline bg-canvas p-6 text-center text-ink transition hover:shadow-float"
              >
                <i className={`ti ${tile.icon} text-4xl text-rausch`} aria-hidden="true" />
                <span className="mt-3 text-sm font-semibold">{translateName(tile.name, locale)}</span>
                <span className="mt-1 text-xs text-muted">
                  {count} {listingsText}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 4. LISTINGS SECTION */}
      <LatestListings listings={listingData} />

      {/* 5. CTA BANNER */}
      <section className="border-t border-hairline bg-surface-soft py-14 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            {t('home.cta.title', locale)}
          </h2>
          <p className="mt-3 text-muted">
            {t('home.cta.desc', locale)}
          </p>
          <div className="mt-6">
            <Link href="/post-ad">
              <Button variant="primary" size="lg">
                {t('home.cta.button', locale)}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
