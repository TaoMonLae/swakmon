import { ListingStatus, ListingTier, PriceType, CommissionType } from '@prisma/client'

// Parse a value to a finite number, or return null when invalid/empty.
export function toFiniteOrNull(value: unknown): number | null {
    if (value == null || value === '') return null
    const n = Number(value)
    return Number.isFinite(n) ? n : null
}

// Validate a value against a string-enum's allowed values.
export function asEnum<T extends Record<string, string>>(
    enumObj: T,
    value: unknown
): T[keyof T] | undefined {
    if (typeof value !== 'string') return undefined
    return (Object.values(enumObj) as string[]).includes(value)
        ? (value as T[keyof T])
        : undefined
}

export interface ListingImage {
    url: string
    publicId: string
}

// Sanitize an unknown value into an ordered ListingImage[] (drops invalid entries).
export function sanitizeImages(value: unknown): ListingImage[] {
    if (!Array.isArray(value)) return []
    const out: ListingImage[] = []
    for (const item of value) {
        if (item && typeof item === 'object') {
            const url = (item as Record<string, unknown>).url
            const publicId = (item as Record<string, unknown>).publicId
            if (typeof url === 'string' && url) {
                out.push({ url, publicId: typeof publicId === 'string' ? publicId : '' })
            }
        }
    }
    return out
}

// Read the images stored on a listing row (Json column) into a typed array.
export function readListingImages(value: unknown): ListingImage[] {
    return sanitizeImages(value)
}

// Re-export enums so callers have a single import source.
export { ListingStatus, ListingTier, PriceType, CommissionType }

