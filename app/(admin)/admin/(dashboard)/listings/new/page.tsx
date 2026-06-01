import { prisma } from '@/lib/prisma'
import { ListingForm } from '@/components/admin/ListingForm'

export const metadata = { title: 'New Listing | TM Admin' }

export default async function NewListingPage() {
  const [categories, states] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
    prisma.state.findMany({ include: { townships: { orderBy: { name: 'asc' } } }, orderBy: { name: 'asc' } }),
  ])
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">New Listing</h1>
      <ListingForm categories={categories} states={states} />
    </div>
  )
}
