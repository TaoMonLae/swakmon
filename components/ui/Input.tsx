import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-hint` : undefined}
          className={cn(
            'block w-full rounded-sm border border-hairline px-3 py-2.5 text-sm text-ink placeholder-muted-soft transition focus:border-ink focus:border-2 focus:outline-none disabled:bg-surface-soft disabled:text-muted-soft',
            error && 'border-error-text focus:border-error-text',
            className
          )}
          {...props}
        />
        {helpText && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-muted-soft">
            {helpText}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-error-text">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
