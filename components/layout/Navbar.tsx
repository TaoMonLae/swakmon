'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

const NAV_LINKS = [
  { href: '/browse/rent', label: 'Rent' },
  { href: '/browse/sale', label: 'Sale' },
  { href: '/browse/land', label: 'Land' },
  { href: '/browse/moto', label: 'Motorcycles' },
]

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-hairline bg-canvas">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-semibold text-rausch tracking-tight">
              Swak Mon သွက်မန်
            </span>
          </Link>

          {/* Center nav - desktop */}
          <nav className="hidden items-center gap-2 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-base font-semibold text-ink transition hover:bg-surface-soft"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ink transition hover:bg-surface-soft sm:block"
            >
              Sign in
            </Link>
            <Link href="/post-ad">
              <Button size="sm" variant="primary">
                + Post Ad
              </Button>
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
              onClick={() => setDrawerOpen(true)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
              <span className="font-display text-lg font-bold text-brand-green">
                Swak Mon သွက်မန်
              </span>
              <button
                type="button"
                aria-label="Close menu"
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                onClick={() => setDrawerOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-md px-3 py-2 text-base font-semibold text-ink hover:bg-surface-soft"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-3 border-hairline" />
              <Link
                href="/admin/login"
                onClick={() => setDrawerOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted hover:bg-surface-soft"
              >
                Sign in
              </Link>
              <Link href="/post-ad" onClick={() => setDrawerOpen(false)}>
                <Button size="sm" variant="primary" className="mt-2 w-full">
                  + Post Ad
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
