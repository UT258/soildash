import React, { useState } from 'react'
import { useTelemetry } from '../hooks/useTelemetry'
import { useSettings } from '../hooks/useSettings'
import { ChartsPanel } from '../components/ChartsPanel'
import { EmptyState } from '../components/EmptyState'
import { Toast } from '../components/Alerts'
import { downloadCSV, generateCSV } from '../utils/formatting'

/**
 * Charts page - historical data visualization and export
 */
export const Charts: React.FC = () => {
  const { settings } = useSettings()
  const [exportToast, setExportToast] = useState<{ id: string; message: string } | null>(null)

  const telemetry = useTelemetry({
    deviceIp: settings?.deviceIp || '192.168.4.1',
    interval: settings?.pollingInterval || 1000,
    useProxy: settings?.useProxy || false,
    demoMode: settings?.demoMode || false,
  })

  if (!settings) {
    return <div className="text-center py-12">Loading...</div>
  }

  const handleExportCSV = () => {
    if (telemetry.history.length === 0) {
      setExportToast({
        id: Date.now().toString(),
        message: 'No data to export',
      })
      return
    }

    const csv = generateCSV(telemetry.history)
    downloadCSV(csv, `soildash-${new Date().toISOString().split('T')[0]}.csv`)

    const id = Date.now().toString()
    setExportToast({
      id,
      message: `Exported ${telemetry.history.length} readings`,
    })

    setTimeout(() => setExportToast(null), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Historical Charts</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {telemetry.history.length > 0
              ? `Showing ${telemetry.history.length} readings`
              : 'No data available'}
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={telemetry.history.length === 0}
          className="px-4 py-2 bg-plant-500 hover:bg-plant-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Charts */}
      {telemetry.history.length > 0 ? (
        <ChartsPanel
          history={telemetry.history}
          useFahrenheit={settings.useFahrenheit}
        />
      ) : (
        <EmptyState
          icon="📈"
          title="No historical data yet"
          description="Data will be collected as readings are received from your device. Check back later or enable Demo Mode to see sample data."
        />
      )}

      {/* Toast */}
      {exportToast && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast
            message={exportToast.message}
            type="success"
            onClose={() => setExportToast(null)}
          />
        </div>
      )}
    </div>
  )
}
