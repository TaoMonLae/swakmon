import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatMMK,
  generateListingRef,
  calcFinalPrice,
  slugify,
  getContactUrl,
  timeAgo,
  truncate,
} from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// formatMMK
// ─────────────────────────────────────────────────────────────────────────────
describe('formatMMK', () => {
  it('returns "POA" for null', () => {
    expect(formatMMK(null)).toBe('POA')
  })

  it('returns "POA" for undefined', () => {
    expect(formatMMK(undefined)).toBe('POA')
  })

  it('returns "Free" for 0', () => {
    expect(formatMMK(0)).toBe('Free')
  })

  it('formats a round number with commas', () => {
    expect(formatMMK(350000)).toBe('350,000')
  })

  it('formats a large price correctly', () => {
    expect(formatMMK(120000000)).toBe('120,000,000')
  })

  it('formats a small price without commas', () => {
    expect(formatMMK(500)).toBe('500')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// generateListingRef
// ─────────────────────────────────────────────────────────────────────────────
describe('generateListingRef', () => {
  it('pads a single-digit id to 5 digits', () => {
    expect(generateListingRef(1)).toBe('SM-00001')
  })

  it('pads a two-digit id correctly', () => {
    expect(generateListingRef(42)).toBe('SM-00042')
  })

  it('formats a 5-digit id without extra padding', () => {
    expect(generateListingRef(12345)).toBe('SM-12345')
  })

  it('always starts with "SM-"', () => {
    expect(generateListingRef(7)).toMatch(/^SM-/)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// calcFinalPrice
// ─────────────────────────────────────────────────────────────────────────────
describe('calcFinalPrice', () => {
  it('returns basePrice when no override or discount', () => {
    expect(calcFinalPrice(10000, null)).toBe(10000)
  })

  it('uses overridePrice when it is set and > 0', () => {
    expect(calcFinalPrice(10000, 8000)).toBe(8000)
  })

  it('falls back to basePrice when overridePrice is 0', () => {
    expect(calcFinalPrice(10000, 0)).toBe(10000)
  })

  it('falls back to basePrice when overridePrice is null', () => {
    expect(calcFinalPrice(10000, null, 20)).toBe(8000)
  })

  it('applies discount % on top of basePrice', () => {
    expect(calcFinalPrice(10000, null, 10)).toBe(9000)
  })

  it('applies discount % on top of overridePrice', () => {
    expect(calcFinalPrice(10000, 8000, 25)).toBe(6000)
  })

  it('rounds to nearest integer', () => {
    // 10000 * (1 - 33/100) = 6700 exactly → no rounding needed
    expect(calcFinalPrice(10000, null, 33)).toBe(6700)
    // 10001 * 0.67 = 6700.67 → rounds to 6701
    expect(calcFinalPrice(10001, null, 33)).toBe(6701)
  })

  it('returns 0 for a 100% discount', () => {
    expect(calcFinalPrice(5000, null, 100)).toBe(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// slugify
// ─────────────────────────────────────────────────────────────────────────────
describe('slugify', () => {
  it('lowercases text', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('replaces spaces with hyphens', () => {
    expect(slugify('property rent')).toBe('property-rent')
  })

  it('strips special characters', () => {
    expect(slugify('Hpa-An (Karen)')).toBe('hpa-an-karen')
  })

  it('collapses multiple spaces/hyphens', () => {
    expect(slugify('Mon  State')).toBe('mon-state')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('-test-')).toBe('test')
  })

  it('handles an already-slugified string', () => {
    expect(slugify('mon-state')).toBe('mon-state')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getContactUrl
// ─────────────────────────────────────────────────────────────────────────────
describe('getContactUrl', () => {
  it('builds a WhatsApp URL and strips the leading +', () => {
    expect(getContactUrl('whatsapp', '+9595123456')).toBe('https://wa.me/9595123456')
  })

  it('handles a number already without +', () => {
    expect(getContactUrl('whatsapp', '9595123456')).toBe('https://wa.me/9595123456')
  })

  it('builds a Viber URL preserving the +', () => {
    expect(getContactUrl('viber', '+9595123456')).toBe('viber://chat?number=+9595123456')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// timeAgo
// ─────────────────────────────────────────────────────────────────────────────
describe('timeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-06-01T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "just now" for < 60 seconds ago', () => {
    const d = new Date('2025-06-01T11:59:30Z') // 30 s ago
    expect(timeAgo(d)).toBe('just now')
  })

  it('returns singular "1 minute ago"', () => {
    const d = new Date('2025-06-01T11:59:00Z') // 60 s ago
    expect(timeAgo(d)).toBe('1 minute ago')
  })

  it('returns plural minutes', () => {
    const d = new Date('2025-06-01T11:45:00Z') // 15 min ago
    expect(timeAgo(d)).toBe('15 minutes ago')
  })

  it('returns singular "1 hour ago"', () => {
    const d = new Date('2025-06-01T11:00:00Z') // 60 min ago
    expect(timeAgo(d)).toBe('1 hour ago')
  })

  it('returns plural hours', () => {
    const d = new Date('2025-06-01T06:00:00Z') // 6 h ago
    expect(timeAgo(d)).toBe('6 hours ago')
  })

  it('returns singular "1 day ago"', () => {
    const d = new Date('2025-05-31T12:00:00Z') // 24 h ago
    expect(timeAgo(d)).toBe('1 day ago')
  })

  it('returns plural days', () => {
    const d = new Date('2025-05-25T12:00:00Z') // 7 days ago
    expect(timeAgo(d)).toBe('7 days ago')
  })

  it('returns singular "1 month ago"', () => {
    const d = new Date('2025-05-01T12:00:00Z') // ~30 days ago
    expect(timeAgo(d)).toBe('1 month ago')
  })

  it('returns plural months', () => {
    const d = new Date('2025-03-01T12:00:00Z') // ~92 days → 3 months
    expect(timeAgo(d)).toBe('3 months ago')
  })

  it('returns singular "1 year ago"', () => {
    const d = new Date('2024-06-01T12:00:00Z') // 365 days ago
    expect(timeAgo(d)).toBe('1 year ago')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// truncate
// ─────────────────────────────────────────────────────────────────────────────
describe('truncate', () => {
  it('returns the original string when it is shorter than the limit', () => {
    expect(truncate('short', 120)).toBe('short')
  })

  it('returns the original string when it equals the limit', () => {
    const s = 'a'.repeat(120)
    expect(truncate(s, 120)).toBe(s)
  })

  it('truncates and appends ellipsis when over the limit', () => {
    const s = 'a'.repeat(121)
    const result = truncate(s, 120)
    expect(result).toHaveLength(121) // 120 chars + '…'
    expect(result.endsWith('…')).toBe(true)
  })

  it('uses 120 as the default limit', () => {
    const s = 'x'.repeat(121)
    expect(truncate(s).endsWith('…')).toBe(true)
  })

  it('trims trailing whitespace before adding ellipsis', () => {
    // 'hello' (5) + 5 spaces (5) = exactly 10 chars before the cutoff,
    // so slice(0, 10) = 'hello     ', trimEnd() = 'hello', result = 'hello…'
    const s = 'hello' + ' '.repeat(5) + 'x'.repeat(116)
    const result = truncate(s, 10)
    expect(result).toBe('hello…')
  })
})
