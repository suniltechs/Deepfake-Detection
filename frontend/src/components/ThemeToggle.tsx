import clsx from 'clsx'
import { Moon, Sun } from 'lucide-react'

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ThemeToggle({ label, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5 rounded-full border border-cream-dim bg-white px-4 py-2 text-sm font-medium text-charcoal shadow-sm transition-colors hover:bg-cream dark:border-charcoal dark:bg-ink-soft dark:text-cream dark:hover:bg-charcoal"
      aria-pressed={checked}
      aria-label={label}
    >
      {checked ? <Moon size={16} /> : <Sun size={16} />}
      <span className="hidden sm:inline">{label}</span>
      <span
        className={clsx(
          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200',
          checked ? 'bg-crimson' : 'bg-cream-dim dark:bg-charcoal',
        )}
      >
        <span
          className={clsx(
            'inline-block h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200',
            checked ? 'translate-x-[18px]' : 'translate-x-0.5',
          )}
        />
      </span>
    </button>
  )
}
