import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, PanelLeftClose, PanelLeftOpen, Zap } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import DeepScan from './components/DeepScan'
import Analytics from './components/Analytics'
import Alerts from './components/Alerts'

const views = {
  dashboard: Dashboard,
  search: DeepScan,
  analytics: Analytics,
  alerts: Alerts,
  settings: () => (
    <div className="flex items-center justify-center h-64">
      <p className="text-white/20 text-base">Settings — coming soon</p>
    </div>
  ),
}

const VIEW_LABELS = {
  dashboard: 'Dashboard',
  search: 'Deep Scan',
  analytics: 'Analytics',
  alerts: 'Risk Alerts',
  settings: 'Settings',
}

export default function App() {
  const [activeView, setActiveView]       = useState('dashboard')
  const [isMobile, setIsMobile]           = useState(false)
  const [sidebarOpen, setSidebarOpen]     = useState(false)   // mobile drawer
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false) // desktop collapse

  // Detect mobile breakpoint
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)')
    const update = (e) => {
      setIsMobile(e.matches)
      if (!e.matches) setSidebarOpen(false) // close drawer on resize to desktop
    }
    setIsMobile(mql.matches)
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  const handleNavigate = useCallback((id) => {
    setActiveView(id)
  }, [])

  const toggleSidebar = () => {
    if (isMobile) setSidebarOpen((v) => !v)
    else setSidebarCollapsed((v) => !v)
  }

  const View = views[activeView] || Dashboard

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">

      {/* ── Desktop Sidebar (inline) ─────────────── */}
      {!isMobile && (
        <Sidebar
          activeView={activeView}
          onNavigate={handleNavigate}
          isCollapsed={sidebarCollapsed}
          onClose={() => setSidebarCollapsed(true)}
          isMobile={false}
        />
      )}

      {/* ── Mobile Sidebar (overlay) ─────────────── */}
      {isMobile && (
        <Sidebar
          activeView={activeView}
          onNavigate={handleNavigate}
          isCollapsed={!sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMobile={true}
        />
      )}

      {/* ── Main Content ─────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top chromatic bar */}
        <div className="h-px w-full flex-shrink-0"
          style={{ background: 'linear-gradient(90deg, #ccff00 0%, #00e5ff 40%, #ff0055 100%)' }}
        />

        {/* Topbar */}
        <header className="flex-shrink-0 flex items-center gap-3 px-4 md:px-6 h-14 border-b border-white/[0.05]"
          style={{ background: 'rgba(4,4,4,0.85)', backdropFilter: 'blur(16px)' }}>

          {/* Hamburger / collapse toggle */}
          <button
            onClick={toggleSidebar}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/08 transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            {isMobile
              ? <Menu size={20} />
              : sidebarCollapsed
                ? <PanelLeftOpen size={20} />
                : <PanelLeftClose size={20} />
            }
          </button>

          {/* Mobile logo */}
          {isMobile && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: '#ccff00', boxShadow: '0 0 12px rgba(204,255,0,0.5)' }}>
                <Zap size={13} color="#000" strokeWidth={3} />
              </div>
              <span
                className="text-base font-black neon-lime"
                style={{ color: '#ccff00', letterSpacing: '-0.02em' }}
              >
                Wins
              </span>
            </div>
          )}

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/30">
            <span>Engine</span>
            <span>/</span>
            <span className="text-white/70 font-medium">{VIEW_LABELS[activeView]}</span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Live pill */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: 'rgba(204,255,0,0.08)',
              border: '1px solid rgba(204,255,0,0.2)',
              color: '#ccff00',
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#ccff00', boxShadow: '0 0 5px #ccff00' }}
            />
            LIVE
          </div>
        </header>

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-screen-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
              >
                <View />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
