import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { ImageIcon, ScanFace, Video } from 'lucide-react'
import { Footer } from './components/Footer'
import { ThemeToggle } from './components/ThemeToggle'
import { useTheme } from './hooks/useTheme'
import { ImageAnalysis } from './pages/ImageAnalysis'
import { VideoAnalysis } from './pages/VideoAnalysis'

function App() {
  const { theme, toggle } = useTheme()

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-crimson text-white'
        : 'bg-white text-charcoal hover:bg-cream dark:bg-ink-soft dark:text-cream dark:hover:bg-charcoal'
    }`

  return (
    <div className="min-h-screen bg-cream text-ink transition-colors dark:bg-ink dark:text-cream">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="flex items-center justify-center gap-2 text-3xl font-extrabold text-crimson sm:justify-start sm:text-4xl">
              <ScanFace size={34} />
              DeepGuard
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-charcoal dark:text-cream-dim">
              Advanced AI-powered deepfake detection of manipulated media with state-of-the-art neural networks.
            </p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <ThemeToggle label="Dark Mode" checked={theme === 'dark'} onChange={toggle} />
          </div>
        </header>

        <nav className="mb-6 flex justify-center gap-2 sm:justify-start">
          <NavLink to="/image" className={navClass}>
            <ImageIcon size={18} />
            Image Analysis
          </NavLink>
          <NavLink to="/video" className={navClass}>
            <Video size={18} />
            Video Analysis
          </NavLink>
        </nav>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/image" replace />} />
            <Route path="/image" element={<ImageAnalysis />} />
            <Route path="/video" element={<VideoAnalysis />} />
            <Route path="*" element={<Navigate to="/image" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
