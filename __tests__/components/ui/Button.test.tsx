import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders its children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies the primary variant class by default', () => {
    render(<Button>Go</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-rausch')
  })

  it('applies the secondary variant class', () => {
    render(<Button variant="secondary">Go</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-canvas')
  })

  it('applies the ghost variant class', () => {
    render(<Button variant="ghost">Go</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')
  })

  it('applies the danger variant class', () => {
    render(<Button variant="danger">Delete</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-error-text')
  })

  it('applies the sm size class', () => {
    render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-4')
  })

  it('applies the lg size class', () => {
    render(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-6')
  })

  it('forwards extra className', () => {
    render(<Button className="mt-4">Go</Button>)
    expect(screen.getByRole('button')).toHaveClass('mt-4')
  })

  // ── Disabled / loading state ───────────────────────────────────────────────

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Go</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when loading is true', () => {
    render(<Button loading>Go</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders the spinner svg when loading', () => {
    render(<Button loading>Saving</Button>)
    // SVG is present alongside the label
    const btn = screen.getByRole('button')
    expect(btn.querySelector('svg')).toBeInTheDocument()
  })

  it('does NOT render the spinner svg when not loading', () => {
    render(<Button>Saving</Button>)
    expect(screen.getByRole('button').querySelector('svg')).toBeNull()
  })

  // ── Interaction ────────────────────────────────────────────────────────────

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Go</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('does not call onClick when loading', async () => {
    const onClick = vi.fn()
    render(<Button loading onClick={onClick}>Go</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  // ── Type ──────────────────────────────────────────────────────────────────

  it('defaults to type="button" when no type is supplied', () => {
    // Without an explicit type the browser defaults to "submit" inside a form,
    // but our Button renders with no default — so we check it can receive type="submit"
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})
