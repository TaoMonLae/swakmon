import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'

async function getStats() {
  const [total, active, pending, featured] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { status: 'ACTIVE' } }),
    prisma.listing.count({ where: { status: 'PENDING' } }),
    prisma.listing.count({ where: { tier: { in: ['FEATURED', 'PREMIUM'] }, status: 'ACTIVE' } }),
  ])
  const recent = await prisma.listing.findMany({
    include: { category: true, state: true, township: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
  return { total, active, pending, featured, recent }
}

export default async function AdminDashboard() {
  const { total, active, pending, featured, recent } = await getStats()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Listings', value: total },
          { label: 'Active', value: active },
          { label: 'Pending Review', value: pending, alert: pending > 0 },
          { label: 'Featured / Premium', value: featured },
        ].map((stat) => (
          <Card key={stat.label}>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`mt-1 text-3xl font-bold ${stat.alert ? 'text-amber-500' : 'text-brand-green'}`}>
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Listings</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  <th className="pb-2 pr-4">Ref</th>
                  <th className="pb-2 pr-4">Title</th>
                  <th className="pb-2 pr-4">Category</th>
                  <th className="pb-2 pr-4">State</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="py-2 pr-4 font-mono text-xs text-gray-400">{l.listingRef}</td>
                    <td className="py-2 pr-4 font-medium text-gray-900 max-w-[200px] truncate">
                      <a href={`/admin/listings/${l.id}`} className="hover:text-brand-green">{l.title}</a>
                    </td>
                    <td className="py-2 pr-4 text-gray-500">{l.category.name}</td>
                    <td className="py-2 pr-4 text-gray-500">{l.state.name}</td>
                    <td className="py-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${l.status === 'ACTIVE' ? 'bg-green-100 text-green-700'
                          : l.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700'
                            : l.status === 'SOLD' ? 'bg-blue-100 text-blue-600'
                              : l.status === 'RENTED' ? 'bg-purple-100 text-purple-600'
                                : 'bg-gray-100 text-gray-400'
                        }`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
