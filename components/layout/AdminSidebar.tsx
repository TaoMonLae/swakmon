'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/cn'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: 'ti-chart-bar' },
  { href: '/admin/listings', label: 'Listings', icon: 'ti-list-details' },
  { href: '/admin/listings/new', label: 'Add Listing', icon: 'ti-plus' },
  { href: '/admin/pricing', label: 'Pricing', icon: 'ti-currency-dollar' },
  { href: '/admin/promotions', label: 'Promotions', icon: 'ti-tag' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-56 flex-col border-r border-hairline bg-canvas">
      {/* Header */}
      <div className="flex h-20 items-center border-b border-hairline px-5">
        <span className="font-display text-base font-semibold text-rausch">
          Swak Mon သွက်မန် Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV.map((item) => {
          const active =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-ink text-white font-medium'
                  : 'text-muted hover:bg-surface-soft hover:text-ink'
              )}
            >
              <i className={cn('ti', item.icon, 'text-lg')} aria-hidden="true" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="border-t border-hairline p-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-soft hover:text-ink transition-colors"
        >
          <i className="ti ti-logout text-lg" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
