import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

import { Badge } from '@/components/ui/Badge'
import { ImageGallery } from '@/components/listings/ImageGallery'

import { ListingGrid } from '@/components/listings/ListingGrid'
import { ViewTracker } from '@/components/listings/ViewTracker'
import { truncate } from '@/lib/utils'
import { readListingImages } from '@/lib/listingInput'
import type { Metadata } from 'next'
import { t, translateName, formatPrice, translateTimeAgo } from '@/lib/i18n'
import { getLocale } from '@/lib/i18n-server'

interface PageProps { params: { id: string } }

// Wrapped in React.cache so generateMetadata and the page component share a
// single DB round-trip per request instead of querying the listing twice.
const getListing = cache((id: number) =>
  prisma.listing.findUnique({
    where: { id, status: 'ACTIVE' },
    include: { category: true, state: true, township: true },
  })
)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const id = Number(params.id)
  if (isNaN(id)) return { title: 'Listing' }
  const listing = await getListing(id)
  if (!listing) return { title: 'Listing' }

  return {
    title: `${listing.title} | Swak Mon သွက်မန်`,
    description: truncate(listing.description, 160),
    openGraph: {
      title: listing.title,
      description: truncate(listing.description, 160),
    },
  }
}

export default async function ListingPage({ params }: PageProps) {
  const locale = getLocale()
  const id = Number(params.id)
  if (isNaN(id)) notFound()

  const listing = await getListing(id)
  if (!listing) notFound()

  // NOTE: view count is incremented via the /api/listings/[id] route (called
  // client-side), so we intentionally do NOT increment here to avoid double
  // counting every page visit.

  // Read images from the dedicated Json column (typed via readListingImages).
  const listingImages = readListingImages(listing.images)
  const images = listingImages.map((img) => img.url)

  // Contact URLs
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? ''
  const waMsg = encodeURIComponent(`Hi, I'm interested in ${listing.title} (Ref: ${listing.listingRef})`)
  const viberNum = process.env.NEXT_PUBLIC_VIBER_NUMBER?.replace(/\D/g, '') ?? ''

  // Similar listings
  const similar = await prisma.listing.findMany({
    where: {
      status: 'ACTIVE',
      categoryId: listing.categoryId,
      stateId: listing.stateId,
      id: { not: listing.id },
    },
    include: { category: true, state: true, township: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  // JSON-LD structured data.
  // JSON.stringify does NOT escape </script>, so we must do it manually to
  // prevent a script-injection attack if the title/description contains that
  // substring. Replacing < with < is the standard safe approach.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    description: truncate(listing.description, 300),
    // Omit `offers` entirely when price is null (negotiable/POA) to avoid
    // Google showing "0 MMK / Free" in rich search results.
    ...(listing.price != null && {
      offers: {
        '@type': 'Offer',
        price: listing.price,
        priceCurrency: 'MMK',
        availability: 'https://schema.org/InStock',
      },
    }),
    ...(images.length > 0 && { image: images[0] }),
  }
  const safeJsonLd = JSON.stringify(jsonLd).replace(/</g, '\\u003c')

  return (
    <>
      <ViewTracker listingId={id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-5 text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-brand-green">{t('browse.breadcrumb.home', locale)}</Link></li>
            <li><span className="mx-1">›</span></li>
            <li><Link href={`/browse/${listing.category.slug}`} className="hover:text-brand-green">{translateName(listing.category.name, locale)}</Link></li>
            <li><span className="mx-1">›</span></li>
            <li><Link href={`/browse/${listing.category.slug}?state=${listing.state.slug}`} className="hover:text-brand-green">{translateName(listing.state.name, locale)}</Link></li>
            <li><span className="mx-1">›</span></li>
            <li className="truncate text-gray-700">{truncate(listing.title, 40)}</li>
          </ol>
        </nav>

        {/* Main layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left: Image + Content */}
          <div>
            {/* Image Gallery */}
            <ImageGallery images={images} alt={listing.title} />

            {/* Main content */}
            <div className="mt-6">
              {/* Price */}
              <p className="text-2xl font-bold text-brand-green">
                {formatPrice(listing.price, locale, listing.priceLabel)}
              </p>

              {/* Title */}
              <h1 className="mt-2 font-display text-2xl font-bold text-gray-900">
                {listing.title}
              </h1>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant={listing.category.slug as 'rent' | 'sale' | 'land' | 'moto'}>
                  {translateName(listing.category.name, locale)}
                </Badge>
                {(listing.tier === 'FEATURED' || listing.tier === 'PREMIUM') && (
                  <Badge variant={listing.tier === 'PREMIUM' ? 'premium' : 'featured'}>
                    {translateName(listing.tier === 'PREMIUM' ? 'Premium' : 'Featured', locale)}
                  </Badge>
                )}
              </div>

              {/* Location */}
              <p className="mt-4 flex items-center gap-1.5 text-sm text-gray-600">
                <i className="ti ti-map-pin text-base" aria-hidden="true" />
                {translateName(listing.township.name, locale)}, {translateName(listing.state.name, locale)}
              </p>

              {/* Meta row */}
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <i className="ti ti-clock" aria-hidden="true" />
                  {translateTimeAgo(listing.createdAt, locale)}
                </span>
                <span className="flex items-center gap-1">
                  <i className="ti ti-eye" aria-hidden="true" />
                  {listing.viewCount} {t('detail.views', locale)}
                </span>
                <span className="flex items-center gap-1">
                  <i className="ti ti-tag" aria-hidden="true" />
                  {listing.listingRef}
                </span>
              </div>

              {/* Divider */}
              <hr className="my-6 border-gray-100" />

              {/* Description */}
              <h2 className="mb-3 text-lg font-semibold text-gray-900">{t('detail.about', locale)}</h2>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {listing.description}
              </div>
            </div>
          </div>

          {/* Right: Contact Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            {/* Contact card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="mb-1 text-base font-semibold text-gray-900">
                {t('detail.interest', locale)}
              </p>
              <p className="mb-4 text-xs text-gray-400">
                {t('detail.posted', locale)} {translateTimeAgo(listing.createdAt, locale)}
              </p>

              <div className="space-y-2.5">
                {listing.contactWhatsApp && waNumber && (
                  <a
                    href={`https://wa.me/${waNumber}?text=${waMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-sm bg-rausch py-3 text-sm font-semibold text-white hover:bg-rausch-active transition"
                  >
                    <i className="ti ti-brand-whatsapp text-lg" aria-hidden="true" />
                    WhatsApp
                  </a>
                )}
                {listing.contactViber && viberNum && (
                  <a
                    href={`viber://chat?number=${viberNum}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-green bg-white py-3 text-sm font-semibold text-brand-green hover:bg-brand-green/5 transition"
                  >
                    <i className="ti ti-message-circle text-lg" aria-hidden="true" />
                    Viber

                  </a>
                )}
                {listing.contactFacebook && (
                  <a
                    href={listing.contactFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    <i className="ti ti-brand-facebook text-lg" aria-hidden="true" />
                    Facebook
                  </a>
                )}
              </div>

              <p className="mt-4 text-center text-xs text-gray-400">
                {t('detail.contact_managed', locale)}
              </p>
            </div>

            {/* Listed by card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-gray-900">{t('detail.listed_by', locale)}</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-brand-cream">
                  D
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{t('detail.admin', locale)}</p>
                  <p className="flex items-center gap-1 text-xs text-gray-500">
                    <i className="ti ti-shield-check text-green-600" aria-hidden="true" />
                    {t('detail.verified', locale)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar listings */}
        {similar.length > 0 && (
          <section className="mt-12 border-t border-gray-100 pt-10">
            <h2 className="mb-5 text-xl font-bold text-gray-900">{t('detail.similar', locale)}</h2>
            <ListingGrid
              listings={similar.map((l) => ({
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
          </section>
        )}
      </div>
    </>
  )
}
