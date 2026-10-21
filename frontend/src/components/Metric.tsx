interface MetricProps {
  label: string
  value: string | number
  hint?: string
}

export function Metric({ label, value, hint }: MetricProps) {
  return (
    <div className="rounded-xl border border-cream-dim bg-cream p-3 transition-colors sm:p-4 dark:border-charcoal dark:bg-ink">
      <p className="text-xs font-medium text-charcoal dark:text-cream-dim">{label}</p>
      <p className="mt-1 break-words text-lg font-bold text-ink sm:text-xl dark:text-cream">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-charcoal-soft dark:text-cream-dim">{hint}</p>}
    </div>
  )
}
