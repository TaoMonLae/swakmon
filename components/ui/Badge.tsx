import { cn } from '@/lib/cn'

type BadgeVariant =
  | 'default'
  | 'rent'
  | 'sale'
  | 'land'
  | 'moto'
  | 'featured'
  | 'premium'
  | 'active'
  | 'sold'
  | 'rented'
  | 'pending'
  | 'expired'
  | 'rejected'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-canvas text-ink shadow-float',
  rent: 'bg-canvas text-ink shadow-float',
  sale: 'bg-canvas text-ink shadow-float',
  land: 'bg-canvas text-ink shadow-float',
  moto: 'bg-canvas text-ink shadow-float',
  featured: 'bg-rausch text-white',
  premium: 'bg-ink text-white',
  active: 'bg-canvas text-ink shadow-float',
  sold: 'bg-surface-strong text-muted',
  rented: 'bg-purple-100 text-purple-700',
  pending: 'bg-canvas text-ink shadow-float',
  expired: 'bg-surface-strong text-muted-soft',
  rejected: 'bg-rausch/10 text-error-text',
}


interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'active', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
