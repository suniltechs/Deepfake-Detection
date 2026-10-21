interface ProgressBarProps {
  progress: number
  label?: string
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  const pct = Math.round(Math.min(Math.max(progress, 0), 1) * 100)
  return (
    <div className="w-full">
      <div className="h-3 w-full overflow-hidden rounded-full bg-cream-dim dark:bg-charcoal">
        <div
          className="h-full rounded-full bg-crimson transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-charcoal dark:text-cream-dim">{label ?? `${pct}%`}</p>
    </div>
  )
}
