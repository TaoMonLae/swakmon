/**
 * Format a number as Myanmar Kyat (comma-separated, no symbol).
 * Returns "350,000" for 350000.
 */
export function formatMMK(amount: number | null | undefined): string {
  if (amount == null) return 'POA'
  if (amount === 0) return 'Free'
  return amount.toLocaleString('en-US')
}

/**
 * Generate a listing reference from a numeric ID.
 * 42 -> "SM-00042"
 */
export function generateListingRef(id: number): string {
  return `SM-${String(id).padStart(5, '0')}`
}

/**
 * Calculate the final price after optional override and discount.
 * If overridePrice is set (> 0), use it as base; otherwise use basePrice.
 * Apply discountPct: final = base * (1 - discountPct / 100).
 * Round to nearest integer.
 */
export function calcFinalPrice(
  basePrice: number,
  overridePrice: number | null | undefined,
  discountPct: number = 0
): number {
  const base = overridePrice && overridePrice > 0 ? overridePrice : basePrice
  return Math.round(base * (1 - discountPct / 100))
}

/**
 * Slugify text: lowercase, replace spaces with hyphens, strip special chars.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generate a contact URL for WhatsApp or Viber.
 */
export function getContactUrl(type: 'whatsapp' | 'viber', phone: string): string {
  const cleaned = phone.replace(/^\+/, '')
  if (type === 'whatsapp') {
    return `https://wa.me/${cleaned}`
  }
  return `viber://chat?number=${phone}`
}

/**
 * Return a human-readable relative time string.
 * e.g. "2 hours ago", "3 days ago", "just now"
 */
export function timeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`

  // Use actual calendar arithmetic instead of the inaccurate "30 days = 1 month"
  const then = new Date(date)
  const now2 = new Date()
  let months =
    (now2.getFullYear() - then.getFullYear()) * 12 +
    (now2.getMonth() - then.getMonth())
  if (months < 1) months = 1
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`

  const years = Math.floor(months / 12)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

/**
 * Generate a unique reference string.
 * Uses crypto.getRandomValues for collision-safety under concurrent load.
 */
export function generateRef(): string {
  const ts = Date.now().toString(36).toUpperCase()
  // 4 random bytes → 8 hex chars; cryptographically random, no Math.random()
  const randBytes = new Uint8Array(4)
  crypto.getRandomValues(randBytes)
  const rand = Array.from(randBytes, (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
    .slice(0, 5)
  return `SM-${ts}-${rand}`
}

/**
 * Truncate a string to a given length with ellipsis.
 */
export function truncate(str: string, len = 120): string {
  return str.length <= len ? str : str.slice(0, len).trimEnd() + '…'
}
