import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ListingForm } from '@/components/admin/ListingForm'

interface PageProps { params: { id: string } }

export default async function EditListingPage({ params }: PageProps) {
  const id = Number(params.id)
  if (isNaN(id)) notFound()

  const [listing, categories, states] = await Promise.all([
    prisma.listing.findUnique({
      where: { id },
      include: { category: true, state: true, township: true },
    }),
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
    prisma.state.findMany({ include: { townships: { orderBy: { name: 'asc' } } }, orderBy: { name: 'asc' } }),
  ])
  if (!listing) notFound()

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Edit Listing</h1>
      <p className="mb-6 text-sm text-gray-400 font-mono">{listing.listingRef}</p>
      <ListingForm listing={listing} categories={categories} states={states} />
    </div>
  )
}
