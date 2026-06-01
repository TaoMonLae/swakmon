import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ListingCard } from '@/components/listings/ListingCard'

// ── Mocks ────────────────────────────────────────────────────────────────────

// next/image → plain <img> (avoids loader/domain checks in jsdom)
vi.mock('next/image', () => ({
  default: ({ src, alt, ...rest }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...rest} />
  ),
}))

// next/link → plain <a> (avoids router context requirement)
vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

// ── Shared fixture ────────────────────────────────────────────────────────────

const BASE_PROPS = {
  id: 1,
  title: '2-Bedroom House near Kyaikthanlan Pagoda',
  price: 350_000,
  priceLabel: '350,000/mo',
  tier: 'BASIC' as const,
  stateName: 'Mon State',
  townshipName: 'Mawlamyine',
  categorySlug: 'rent',
  categoryName: 'Property Rent',
  createdAt: new Date('2025-05-25T12:00:00Z'),
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ListingCard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-06-01T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // ── Core content ────────────────────────────────────────────────────────────

  it('renders the listing title', () => {
    render(<ListingCard {...BASE_PROPS} />)
    expect(screen.getByText('2-Bedroom House near Kyaikthanlan Pagoda')).toBeInTheDocument()
  })

  it('renders the priceLabel when supplied', () => {
    render(<ListingCard {...BASE_PROPS} />)
    expect(screen.getByText('350,000/mo')).toBeInTheDocument()
  })

  it('falls back to formatted price when no priceLabel', () => {
    render(<ListingCard {...BASE_PROPS} priceLabel={null} price={350_000} />)
    expect(screen.getByText('350,000')).toBeInTheDocument()
  })

  it('shows "POA" when price and priceLabel are both null', () => {
    render(<ListingCard {...BASE_PROPS} price={null} priceLabel={null} />)
    expect(screen.getByText('POA')).toBeInTheDocument()
  })

  it('renders the township and state name', () => {
    render(<ListingCard {...BASE_PROPS} />)
    expect(screen.getByText('Mawlamyine, Mon State')).toBeInTheDocument()
  })

  it('renders the category badge', () => {
    render(<ListingCard {...BASE_PROPS} />)
    expect(screen.getByText('Property Rent')).toBeInTheDocument()
  })

  it('shows a relative creation time', () => {
    render(<ListingCard {...BASE_PROPS} />)
    expect(screen.getByText('7 days ago')).toBeInTheDocument()
  })

  // ── Link ─────────────────────────────────────────────────────────────────

  it('links to /listing/:id', () => {
    render(<ListingCard {...BASE_PROPS} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/listing/1')
  })

  // ── Image ─────────────────────────────────────────────────────────────────

  it('renders the image with the correct src when imageUrl is supplied', () => {
    render(
      <ListingCard
        {...BASE_PROPS}
        imageUrl="https://picsum.photos/800/600?random=1"
      />
    )
    expect(screen.getByAltText('2-Bedroom House near Kyaikthanlan Pagoda')).toHaveAttribute(
      'src',
      'https://picsum.photos/800/600?random=1'
    )
  })

  it('renders a placeholder icon when no imageUrl is given', () => {
    render(<ListingCard {...BASE_PROPS} imageUrl={null} />)
    // The placeholder is an <i> with class ti-photo; image should not be present
    expect(screen.queryByRole('img')).toBeNull()
  })

  // ── Tier badges ────────────────────────────────────────────────────────────

  it('does NOT render a tier badge for BASIC tier', () => {
    render(<ListingCard {...BASE_PROPS} tier="BASIC" />)
    expect(screen.queryByText('Featured')).toBeNull()
    expect(screen.queryByText('Premium')).toBeNull()
  })

  it('renders a "Featured" badge for FEATURED tier', () => {
    render(<ListingCard {...BASE_PROPS} tier="FEATURED" />)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('renders a "Premium" badge for PREMIUM tier', () => {
    render(<ListingCard {...BASE_PROPS} tier="PREMIUM" />)
    expect(screen.getByText('Premium')).toBeInTheDocument()
  })

  it('applies the featured border for FEATURED tier', () => {
    const { container } = render(<ListingCard {...BASE_PROPS} tier="FEATURED" />)
    // The outer card div should carry the rausch border class
    expect(container.firstChild?.firstChild).toHaveClass('border-rausch/40')
  })

  it('does NOT apply the featured border for BASIC tier', () => {
    const { container } = render(<ListingCard {...BASE_PROPS} tier="BASIC" />)
    expect(container.firstChild?.firstChild).not.toHaveClass('border-rausch/40')
    expect(container.firstChild?.firstChild).toHaveClass('border-hairline')
  })

  // ── createdAt as string ────────────────────────────────────────────────────

  it('handles a createdAt ISO string (not a Date object)', () => {
    render(<ListingCard {...BASE_PROPS} createdAt="2025-05-25T12:00:00Z" />)
    expect(screen.getByText('7 days ago')).toBeInTheDocument()
  })
})
