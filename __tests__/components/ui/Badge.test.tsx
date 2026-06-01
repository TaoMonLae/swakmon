import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/Badge'

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>ACTIVE</Badge>)
    expect(screen.getByText('ACTIVE')).toBeInTheDocument()
  })

  it('defaults to the "active" variant', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toHaveClass('bg-canvas', 'text-ink')
  })

  it('applies the "premium" variant classes', () => {
    render(<Badge variant="premium">Premium</Badge>)
    expect(screen.getByText('Premium')).toHaveClass('bg-ink', 'text-white')
  })

  it('applies the "featured" variant classes', () => {
    render(<Badge variant="featured">Featured</Badge>)
    expect(screen.getByText('Featured')).toHaveClass('bg-rausch', 'text-white')
  })

  it('applies the "pending" variant classes', () => {
    render(<Badge variant="pending">Pending</Badge>)
    expect(screen.getByText('Pending')).toHaveClass('bg-canvas', 'text-ink')
  })

  it('applies the "sold" variant classes', () => {
    render(<Badge variant="sold">Sold</Badge>)
    expect(screen.getByText('Sold')).toHaveClass('bg-surface-strong', 'text-muted')
  })

  it('applies the "rejected" variant classes', () => {
    render(<Badge variant="rejected">Rejected</Badge>)
    expect(screen.getByText('Rejected')).toHaveClass('text-error-text')
  })

  it('applies category variant "rent"', () => {
    render(<Badge variant="rent">Property Rent</Badge>)
    expect(screen.getByText('Property Rent')).toHaveClass('bg-canvas', 'text-ink')
  })

  it('applies category variant "land"', () => {
    render(<Badge variant="land">Land Sale</Badge>)
    expect(screen.getByText('Land Sale')).toHaveClass('bg-canvas', 'text-ink')
  })

  it('merges a custom className', () => {
    render(<Badge className="mt-2">Test</Badge>)
    expect(screen.getByText('Test')).toHaveClass('mt-2')
  })

  it('is rendered as a <span>', () => {
    render(<Badge>Label</Badge>)
    expect(screen.getByText('Label').tagName).toBe('SPAN')
  })
})
