import { Suspense, cache } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ListingGrid } from '@/components/listings/ListingGrid'
import { BrowseFilters } from '@/components/listings/BrowseFilters'
import { Button } from '@/components/ui/Button'
import { readListingImages } from '@/lib/listingInput'
import type { Metadata } from 'next'
import { t, translateName, Locale } from '@/lib/i18n'
import { getLocale } from '@/lib/i18n-server'

interface PageProps {
  params: { category: string }
  searchParams: {
    q?: string
    state?: string
    township?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
  }
}

// Wrapped in React.cache so generateMetadata and the page body share a single
// DB round-trip — without this, two identical queries run per page load.
const getCategoryBySlug = cache((slug: string) =>
  prisma.category.findUnique({ where: { slug } })
)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = getLocale()
  if (params.category === 'all') {
    return { title: `${translateName('All Listings', locale)} | Swak Mon သွက်မန်` }
  }
  const category = await getCategoryBySlug(params.category)
  return { title: category ? `${translateName(category.name, locale)} | Swak Mon သွက်မန်` : `Listings | Swak Mon သွက်မန်` }
}

function getOrderBy(sort: string) {
  switch (sort) {
    case 'oldest': return { createdAt: 'asc' as const }
    case 'price-asc': return { price: 'asc' as const }
    case 'price-desc': return { price: 'desc' as const }
    case 'views': return { viewCount: 'desc' as const }
    default: return { createdAt: 'desc' as const }
  }
}

export default async function BrowsePage({ params, searchParams }: PageProps) {
  const locale = getLocale()
  const LIMIT = 12
  const categorySlug = params.category
  const q = searchParams.q ?? ''
  const stateSlug = searchParams.state ?? ''
  const townshipName = searchParams.township ?? ''
  const minPrice = searchParams.minPrice ?? ''
  const maxPrice = searchParams.maxPrice ?? ''
  const sort = searchParams.sort ?? 'newest'
  const page = Math.max(1, Number(searchParams.page ?? 1))

  // Resolve category — uses the cached fetcher shared with generateMetadata.
  const category = categorySlug !== 'all'
    ? await getCategoryBySlug(categorySlug)
    : null

  // Build WHERE clause
  const where: Record<string, unknown> = { status: 'ACTIVE' }
  if (category) where.categoryId = category.id
  if (stateSlug) where.state = { slug: stateSlug }
  if (townshipName) where.township = { name: townshipName }
  // Guard against NaN/Infinity from ?minPrice=abc or ?minPrice=Infinity.
  // Without this, Prisma throws a runtime error (P2023) → unhandled 500.
  const minPriceNum = minPrice ? Number(minPrice) : NaN
  const maxPriceNum = maxPrice ? Number(maxPrice) : NaN
  if (Number.isFinite(minPriceNum) || Number.isFinite(maxPriceNum)) {
    where.price = {
      ...(Number.isFinite(minPriceNum) && { gte: minPriceNum }),
      ...(Number.isFinite(maxPriceNum) && { lte: maxPriceNum }),
    }
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }

  // Fetch listings + count
  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { category: true, state: true, township: true },
      orderBy: getOrderBy(sort),
      skip: (page - 1) * LIMIT,
      take: LIMIT,
    }),
    prisma.listing.count({ where }),
  ])

  const totalPages = Math.ceil(total / LIMIT)

  // Fetch filter data
  const [allCategories, allStates, townships, categoryCounts, stateCounts] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
    prisma.state.findMany(),
    stateSlug
      ? prisma.township.findMany({ where: { state: { slug: stateSlug } }, orderBy: { name: 'asc' } })
      : Promise.resolve([]),
    prisma.listing.groupBy({
      by: ['categoryId'],
      where: { status: 'ACTIVE' },
      _count: { id: true },
    }),
    prisma.listing.groupBy({
      by: ['stateId'],
      where: { status: 'ACTIVE', ...(category ? { categoryId: category.id } : {}) },
      _count: { id: true },
    }),
  ])

  // Build filter props
  const categoryTabs = [
    { slug: 'all', name: 'All', count: categoryCounts.reduce((sum, c) => sum + c._count.id, 0) },
    ...allCategories.map((c) => ({
      slug: c.slug,
      name: c.name,
      count: categoryCounts.find((cc) => cc.categoryId === c.id)?._count.id ?? 0,
    })),
  ]

  const stateOptions = allStates.map((s) => ({
    slug: s.slug,
    name: s.name,
    count: stateCounts.find((sc) => sc.stateId === s.id)?._count.id ?? 0,
  }))

  const townshipOptions = townships.map((t) => ({ slug: t.name, name: t.name }))

  // Breadcrumb
  const selectedState = stateSlug ? allStates.find((s) => s.slug === stateSlug) : null
  
  let heading = ''
  if (category) {
    const catName = translateName(category.name, locale)
    if (selectedState) {
      const stateName = translateName(selectedState.name, locale)
      heading = locale === 'my' ? `${stateName} ရှိ ${catName}` : `${catName} in ${stateName}`
    } else {
      heading = catName
    }
  } else {
    if (selectedState) {
      const stateName = translateName(selectedState.name, locale)
      heading = locale === 'my' ? `${stateName} ရှိ ကြော်ငြာအားလုံး` : `All listings in ${stateName}`
    } else {
      heading = translateName('All listings', locale)
    }
  }

  const foundText = locale === 'my'
    ? `${total} ခု တွေ့ရှိသည်`
    : `${total} ${total !== 1 ? 'listings' : 'listing'} found`

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-brand-green">{t('browse.breadcrumb.home', locale)}</Link></li>
          <li><span className="mx-1">›</span></li>
          {category ? (
            <>
              <li><Link href={`/browse/${category.slug}`} className="hover:text-brand-green">{translateName(category.name, locale)}</Link></li>
              {selectedState && (
                <>
                  <li><span className="mx-1">›</span></li>
                  <li className="text-gray-700">{translateName(selectedState.name, locale)}</li>
                </>
              )}
            </>
          ) : (
            <li className="text-gray-700">{translateName('All listings', locale)}</li>
          )}
        </ol>
      </nav>

      {/* Heading + count */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-green">{heading}</h1>
        <p className="mt-1 text-sm text-gray-500">{foundText}</p>
      </div>

      {/* Layout: sidebar + content */}
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <Suspense fallback={<div className="h-[400px] animate-pulse rounded-lg bg-gray-100" />}>
          <BrowseFilters
            categories={categoryTabs}
            states={stateOptions}
            townships={townshipOptions}
            currentCategory={categorySlug}
            currentState={stateSlug}
            currentTownship={townshipName}
            currentMinPrice={minPrice}
            currentMaxPrice={maxPrice}
            currentSort={sort}
          />
        </Suspense>

        {/* Main content */}
        <div>
          {listings.length > 0 ? (
            <>
              <ListingGrid
                listings={listings.map((l) => ({
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
                }))}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  searchParams={searchParams}
                  basePath={`/browse/${categorySlug}`}
                  locale={locale}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center py-20 text-center">
              <i className="ti ti-search-off text-5xl text-gray-300" aria-hidden="true" />
              <p className="mt-4 text-lg font-medium text-gray-600">{t('browse.filters.no_results', locale)}</p>
              <p className="mt-1 text-sm text-gray-400">{t('browse.filters.try_adjusting', locale)}</p>
              <Link href="/browse/all" className="mt-4">
                <Button variant="ghost" size="sm">{t('browse.filters.clear', locale)}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* Pagination component */
function Pagination({
  currentPage,
  totalPages,
  searchParams,
  basePath,
  locale,
}: {
  currentPage: number
  totalPages: number
  searchParams: Record<string, string | undefined>
  basePath: string
  locale: Locale
}) {
  function buildHref(page: number) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== 'page') params.set(key, value)
    }
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    return `${basePath}${qs ? `?${qs}` : ''}`
  }

  // Generate page numbers with ellipsis
  function getPageNumbers(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
      {currentPage > 1 && (
        <a
          href={buildHref(currentPage - 1)}
          className="inline-flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm text-gray-600 hover:bg-gray-50"
        >
          {t('browse.pagination.prev', locale)}
        </a>
      )}
      {getPageNumbers().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
        ) : (
          <a
            key={p}
            href={buildHref(p)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${p === currentPage
              ? 'bg-brand-green text-white'
              : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
          >
            {p}
          </a>
        )
      )}
      {currentPage < totalPages && (
        <a
          href={buildHref(currentPage + 1)}
          className="inline-flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm text-gray-600 hover:bg-gray-50"
        >
          {t('browse.pagination.next', locale)}
        </a>
      )}
    </nav>
  )
}
