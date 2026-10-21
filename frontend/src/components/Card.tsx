import clsx from 'clsx'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-cream-dim bg-white p-4 shadow-sm transition-colors sm:p-6',
        'dark:border-charcoal dark:bg-ink-soft',
        className,
      )}
    >
      {children}
    </div>
  )
}
