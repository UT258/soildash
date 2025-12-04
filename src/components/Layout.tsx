import React, { useState } from 'react'
import { Link } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
  darkMode?: boolean
  onToggleDarkMode?: () => void
}

/**
 * Main layout component with collapsible sidebar and header
 */
export const Layout: React.FC<LayoutProps> = ({
  children,
  darkMode = false,
  onToggleDarkMode,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-plant-600 dark:text-plant-400">SoilDash</h1>
            </div>

            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536a1 1 0 11.707.707 1 1 0 01-.707-.707zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM5.464 14.464a1 1 0 11-.707.707 1 1 0 01.707-.707zm-2.121-10.607a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM13 5a1 1 0 110-2h1a1 1 0 110 2h-1zM4 13a1 1 0 11-2 0v-1a1 1 0 112 0v1zM3 5a1 1 0 000 2H4a1 1 0 100-2H3zm10 12a1 1 0 112 0v-1a1 1 0 11-2 0v1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`${
              sidebarOpen ? 'w-64' : 'w-0'
            } bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 overflow-hidden`}
          >
            <nav className="p-4 space-y-2">
              <Link
                to="/"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium text-plant-600 dark:text-plant-400"
              >
                📊 Dashboard
              </Link>
              <Link
                to="/charts"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                📈 Charts
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                ⚙️ Settings
              </Link>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Built for ESP32 telemetry monitoring
              </p>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
