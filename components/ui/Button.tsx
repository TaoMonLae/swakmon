'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-rausch text-white font-medium hover:bg-rausch-active focus-visible:ring-rausch',
  secondary: 'bg-canvas text-ink font-medium border border-ink hover:bg-surface-soft focus-visible:ring-ink',
  ghost: 'bg-transparent text-ink font-medium hover:bg-surface-soft underline-offset-2 hover:underline',
  danger: 'bg-error-text text-white font-medium hover:opacity-90 focus-visible:ring-error-text',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-sm',
  md: 'px-5 py-2.5 text-sm rounded-sm',
  lg: 'px-6 py-3 text-base rounded-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  )
)

Button.displayName = 'Button'
