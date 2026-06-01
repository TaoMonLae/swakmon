import { cn } from '@/lib/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: boolean
  clickable?: boolean
  onClick?: () => void
}

export function Card({ children, className, padding = true, clickable, onClick }: CardProps) {
  const Component = clickable ? 'button' : 'div'
  return (
    <Component
      onClick={clickable ? onClick : undefined}
      className={cn(
        'rounded-md border border-hairline bg-canvas text-left',
        padding && 'p-6',
        clickable && 'cursor-pointer transition hover:shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2',
        className
      )}
    >
      {children}
    </Component>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4 border-b border-hairline-soft pb-3', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn('text-base font-semibold text-ink', className)}>{children}</h2>
}
