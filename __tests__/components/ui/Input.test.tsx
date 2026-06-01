import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/Input'

describe('Input', () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders a text input by default', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders a label when the label prop is supplied', () => {
    render(<Input label="Phone number" />)
    expect(screen.getByLabelText('Phone number')).toBeInTheDocument()
  })

  it('associates the label with the input via derived id', () => {
    render(<Input label="Contact Phone" />)
    const input = screen.getByLabelText('Contact Phone')
    expect(input).toHaveAttribute('id', 'contact-phone')
  })

  it('uses an explicit id over the derived one', () => {
    render(<Input label="Phone" id="my-phone" />)
    expect(screen.getByLabelText('Phone')).toHaveAttribute('id', 'my-phone')
  })

  it('renders a placeholder', () => {
    render(<Input placeholder="Enter your phone" />)
    expect(screen.getByPlaceholderText('Enter your phone')).toBeInTheDocument()
  })

  // ── Help text & error ──────────────────────────────────────────────────────

  it('renders helpText when supplied and no error', () => {
    render(<Input label="Price" helpText="MMK only" />)
    expect(screen.getByText('MMK only')).toBeInTheDocument()
  })

  it('hides helpText when an error is also supplied', () => {
    render(<Input label="Price" helpText="MMK only" error="Required" />)
    expect(screen.queryByText('MMK only')).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('renders the error message with role="alert"', () => {
    render(<Input label="Email" error="Invalid email" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email')
  })

  it('sets aria-invalid when an error is present', () => {
    render(<Input label="Email" error="Required" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not set aria-invalid without an error', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'false')
  })

  it('applies error border classes when error is present', () => {
    render(<Input label="Field" error="Oops" />)
    expect(screen.getByLabelText('Field')).toHaveClass('border-error-text')
  })

  // ── Interaction ────────────────────────────────────────────────────────────

  it('accepts user input', async () => {
    render(<Input label="Search" />)
    const input = screen.getByLabelText('Search')
    await userEvent.type(input, 'Mawlamyine')
    expect(input).toHaveValue('Mawlamyine')
  })

  it('calls onChange on each keystroke', async () => {
    const onChange = vi.fn()
    render(<Input label="Search" onChange={onChange} />)
    await userEvent.type(screen.getByLabelText('Search'), 'abc')
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  // ── Disabled ──────────────────────────────────────────────────────────────

  it('is disabled when the disabled prop is set', () => {
    render(<Input label="Field" disabled />)
    expect(screen.getByLabelText('Field')).toBeDisabled()
  })

  it('applies disabled styling classes', () => {
    render(<Input label="Field" disabled />)
    expect(screen.getByLabelText('Field')).toHaveClass('disabled:bg-surface-soft')
  })

  // ── Forwarded ref ─────────────────────────────────────────────────────────

  it('forwards a ref to the underlying input', () => {
    const ref = vi.fn()
    render(<Input ref={ref} label="Field" />)
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement))
  })
})
