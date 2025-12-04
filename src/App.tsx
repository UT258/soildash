import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './providers/ThemeProvider'
import { Layout as NewLayout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { DashboardEnhanced } from './pages/DashboardEnhanced'
import { Charts } from './pages/Charts'
import { Settings } from './pages/Settings'
import { useSettings } from './hooks/useSettings'
import { useDeviceStore } from './stores/deviceStore'

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

/**
 * Main app component with routing
 */
function AppContent() {
  const { settings } = useSettings()
  const [mounted, setMounted] = useState(false)
  const { devices, addDevice } = useDeviceStore()

  useEffect(() => {
    setMounted(true)
    
    // Initialize demo device if none exist
    if (devices.length === 0) {
      addDevice({
        name: 'Greenhouse-01',
        type: 'greenhouse',
        ipAddress: '192.168.4.1',
        status: 'SAFE',
        connectionQuality: 'good',
        firmware: 'v2.1.0',
        settings: {
          pollingInterval: 1000,
          useProxy: false,
          enableAlerts: true,
          enableSound: true,
          thresholds: {
            temp: { min: 15, max: 35 },
            hum: { min: 30, max: 80 },
            soil: { min: 20, max: 80 },
          },
        },
      })
    }
  }, [])

  if (!mounted || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-plant-600 dark:text-plant-400 mb-4">SoilDash Pro</h1>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <NewLayout>
        <Routes>
          <Route path="/" element={<DashboardEnhanced />} />
          <Route path="/live" element={<Dashboard />} />
          <Route path="/analytics" element={<Charts />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/devices" element={<Dashboard />} />
          <Route path="/alerts" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </NewLayout>
    </Router>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white',
            duration: 4000,
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
