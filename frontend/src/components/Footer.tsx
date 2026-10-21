export function Footer() {
  return (
    <footer className="mt-10 rounded-xl border border-cream-dim bg-white/70 px-4 py-6 text-center text-sm text-charcoal backdrop-blur dark:border-charcoal dark:bg-ink/60 dark:text-cream-dim">
      <p>
        Developed by <strong className="text-ink dark:text-cream">Sunil Sowrirajan</strong> ©{' '}
        {new Date().getFullYear()}
      </p>
      <p className="mt-2 flex items-center justify-center gap-4">
        <a
          href="https://www.linkedin.com/in/sunil-sowrirajan-40548826b/"
          target="_blank"
          rel="noreferrer"
          className="text-crimson hover:text-crimson-dark hover:underline"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/suniltechs"
          target="_blank"
          rel="noreferrer"
          className="text-crimson hover:text-crimson-dark hover:underline"
        >
          GitHub
        </a>
      </p>
    </footer>
  )
}
