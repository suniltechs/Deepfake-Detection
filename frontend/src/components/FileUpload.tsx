import { useRef, useState } from 'react'
import clsx from 'clsx'
import { X, type LucideIcon } from 'lucide-react'

interface FileUploadProps {
  accept: string
  label: string
  hint: string
  icon: LucideIcon
  file: File | null
  onFile: (file: File | null) => void
  disabled?: boolean
}

export function FileUpload({ accept, label, hint, icon: Icon, file, onFile, disabled }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    if (files && files.length > 0) onFile(files[0])
  }

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={clsx(
          'flex w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed p-6 text-center transition-colors sm:p-8',
          'disabled:cursor-not-allowed disabled:opacity-60',
          dragging
            ? 'border-crimson bg-cream dark:bg-charcoal'
            : 'border-cream-dim bg-white hover:border-crimson dark:border-charcoal dark:bg-ink-soft',
        )}
      >
        <Icon className="mb-1 text-crimson" size={32} />
        <span className="text-base font-semibold text-ink dark:text-cream">{label}</span>
        <span className="text-sm text-charcoal dark:text-cream-dim">{hint}</span>
        <span className="mt-1 text-xs text-charcoal-soft dark:text-cream-dim">Click or drag & drop</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {file && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-cream px-3 py-2 text-sm dark:bg-ink">
          <span className="truncate text-charcoal dark:text-cream">{file.name}</span>
          <button
            type="button"
            onClick={() => onFile(null)}
            className="shrink-0 text-charcoal-soft hover:text-crimson dark:text-cream-dim"
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
