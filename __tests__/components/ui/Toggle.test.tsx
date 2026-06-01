import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toggle } from '@/components/ui/Toggle'

describe('Toggle', () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders a switch button', () => {
    render(<Toggle checked={false} onChange={vi.fn()} />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('renders an optional label', () => {
    render(<Toggle checked={false} onChange={vi.fn()} label="Free until sold" />)
    expect(screen.getByText('Free until sold')).toBeInTheDocument()
  })

  it('renders nothing extra when no label is given', () => {
    const { container } = render(<Toggle checked={false} onChange={vi.fn()} />)
    expect(container.querySelector('span.text-sm')).toBeNull()
  })

  // ── ARIA state ────────────────────────────────────────────────────────────

  it('sets aria-checked="true" when checked is true', () => {
    render(<Toggle checked={true} onChange={vi.fn()} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('sets aria-checked="false" when checked is false', () => {
    render(<Toggle checked={false} onChange={vi.fn()} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  // ── Interaction ────────────────────────────────────────────────────────────

  it('calls onChange with true when toggled from false', async () => {
    const onChange = vi.fn()
    render(<Toggle checked={false} onChange={onChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('calls onChange with false when toggled from true', async () => {
    const onChange = vi.fn()
    render(<Toggle checked={true} onChange={onChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('calls onChange exactly once per click', async () => {
    const onChange = vi.fn()
    render(<Toggle checked={false} onChange={onChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledOnce()
  })

  // ── Disabled ──────────────────────────────────────────────────────────────

  it('is disabled when the disabled prop is true', () => {
    render(<Toggle checked={false} onChange={vi.fn()} disabled />)
    expect(screen.getByRole('switch')).toBeDisabled()
  })

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn()
    render(<Toggle checked={false} onChange={onChange} disabled />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).not.toHaveBeenCalled()
  })

  // ── Visual indicator ──────────────────────────────────────────────────────

  it('applies the "on" background class when checked', () => {
    render(<Toggle checked={true} onChange={vi.fn()} />)
    expect(screen.getByRole('switch')).toHaveClass('bg-ink')
  })

  it('applies the "off" background class when unchecked', () => {
    render(<Toggle checked={false} onChange={vi.fn()} />)
    expect(screen.getByRole('switch')).toHaveClass('bg-hairline-strong')
  })
})
