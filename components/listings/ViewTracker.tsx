'use client'

import { useEffect } from 'react'

/**
 * Invisible component that fires a single GET to /api/listings/[id] on mount.
 * The API route increments viewCount as a side-effect of fetching the listing.
 * This lives in a client component so it runs after hydration, not during SSR,
 * which prevents double-counting (the Server Component never calls the API).
 */
export function ViewTracker({ listingId }: { listingId: number }) {
  useEffect(() => {
    fetch(`/api/listings/${listingId}`).catch(() => {
      // Silently ignore — a failed view-count increment is non-critical.
    })
  }, [listingId])

  return null
}
