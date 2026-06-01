import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/Button'
import { ListingsTable } from '@/components/admin/ListingsTable'
import { asEnum, ListingStatus, ListingTier } from '@/lib/listingInput'

interface PageProps {
  searchParams: {
    q?: string
    status?: string
    category?: string
    state?: string
    tier?: string
    page?: string
  }
}

export default async function AdminListingsPage({ searchParams }: PageProps) {
  const q = searchParams.q ?? ''
  const status = searchParams.status ?? ''
  const categoryId = searchParams.category ?? ''
  const stateId = searchParams.state ?? ''
  const tier = searchParams.tier ?? ''
  const page = Math.max(1, Number(searchParams.page ?? 1))
  const limit = 20

  // Validate enum params — raw URL strings cast directly as enums cause
  // Prisma to throw P2009 (invalid enum value) → unhandled 500.
  const validStatus = asEnum(ListingStatus, status)
  const validTier   = asEnum(ListingTier,   tier)

  const where = {
    ...(q && {
      OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { listingRef: { contains: q, mode: 'insensitive' as const } },
      ],
    }),
    ...(validStatus  && { status:     validStatus }),
    ...(categoryId   && { categoryId: Number(categoryId) }),
    ...(stateId      && { stateId:    Number(stateId) }),
    ...(validTier    && { tier:       validTier }),
  }

  const [listings, total, categories, states] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { category: true, state: true, township: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.listing.count({ where }),
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
    prisma.state.findMany({ orderBy: { name: 'asc' } }),
  ])

  const totalPages = Math.ceil(total / limit)

  // Serialize dates for client component
  const tableData = listings.map((l) => ({
    id: l.id,
    listingRef: l.listingRef,
    title: l.title,
    price: l.price,
    priceLabel: l.priceLabel,
    tier: l.tier,
    status: l.status,
    createdAt: l.createdAt.toISOString(),
    category: { name: l.category.name },
    state: { name: l.state.name },
    township: { name: l.township.name },
    images: l.images,
  }))

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">All Listings ({total})</h1>
        <Link href="/admin/listings/new">
          <Button variant="secondary" size="sm">+ Add Listing</Button>
        </Link>
      </div>

      {/* Filters */}
      <form className="mb-5 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search title or ref…"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
        <select
          name="category"
          defaultValue={categoryId}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          name="state"
          defaultValue={stateId}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        >
          <option value="">All states</option>
          {states.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={status}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="SOLD">Sold</option>
          <option value="RENTED">Rented</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <select
          name="tier"
          defaultValue={tier}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        >
          <option value="">All tiers</option>
          <option value="BASIC">Basic</option>
          <option value="FEATURED">Featured</option>
          <option value="PREMIUM">Premium</option>
        </select>
        <Button type="submit" variant="ghost" size="sm">Filter</Button>
      </form>

      {/* Table */}
      <ListingsTable listings={tableData} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {(() => {
            // Build pagination URLs with proper encoding — raw string interpolation
            // breaks when q contains &, =, #, or non-ASCII characters (Myanmar text).
            function pageHref(p: number) {
              const params = new URLSearchParams()
              if (q)          params.set('q',        q)
              if (status)     params.set('status',   status)
              if (categoryId) params.set('category', categoryId)
              if (stateId)    params.set('state',    stateId)
              if (tier)       params.set('tier',     tier)
              if (p > 1)      params.set('page',     String(p))
              const qs = params.toString()
              return qs ? `?${qs}` : '?'
            }
            return (
              <>
                {page > 1 && (
                  <a href={pageHref(page - 1)} className="inline-flex h-8 items-center rounded border border-gray-300 px-3 text-sm text-gray-600 hover:bg-gray-50">
                    Previous
                  </a>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center gap-2">
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-gray-400">…</span>}
                      <a
                        href={pageHref(p)}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded text-sm font-medium ${p === page ? 'bg-brand-green text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                      >
                        {p}
                      </a>
                    </span>
                  ))}
                {page < totalPages && (
                  <a href={pageHref(page + 1)} className="inline-flex h-8 items-center rounded border border-gray-300 px-3 text-sm text-gray-600 hover:bg-gray-50">
                    Next
                  </a>
                )}
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}
