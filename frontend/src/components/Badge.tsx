import clsx from 'clsx'

interface BadgeProps {
  variant: 'fake' | 'real' | 'neutral'
  children: React.ReactNode
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white sm:text-sm',
        variant === 'fake' && 'bg-crimson',
        variant === 'real' && 'bg-charcoal',
        variant === 'neutral' && 'bg-ink',
      )}
    >
      {children}
    </span>
  )
}
