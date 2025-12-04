import React, { useEffect, useState } from 'react'
import { useTelemetry } from '../hooks/useTelemetry'
import { useSettings } from '../hooks/useSettings'
import { TelemetryGrid } from '../components/TelemetryCard'
import { Alerts, Toast, StatusIndicator } from '../components/Alerts'
import { EmptyState } from '../components/EmptyState'
import { formatTime } from '../utils/formatting'

/**
 * Dashboard page - real-time telemetry monitoring
 */
export const Dashboard: React.FC = () => {
  const { settings } = useSettings()
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'error' | 'warning' }>>([])

  const telemetry = useTelemetry({
    deviceIp: settings?.deviceIp || '192.168.4.1',
    interval: settings?.pollingInterval || 1000,
    useProxy: settings?.useProxy || false,
    demoMode: settings?.demoMode || false,
    onError: (error) => {
      const id = Date.now().toString()
      setToasts(prev => [...prev, {
        id,
        message: `Error: ${error.message}`,
        type: 'error',
      }])

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 5000)
    },
  })

  // Initialize with mock history if no device data
  const [initialHistory, setInitialHistory] = useState<boolean>(false)
  useEffect(() => {
    if (settings?.demoMode && telemetry.history.length === 0 && !initialHistory) {
      setInitialHistory(true)
      // Will be handled by useTelemetry
    }
  }, [settings?.demoMode, telemetry.history.length, initialHistory])

  if (!settings) {
    return <div className="text-center py-12">Loading...</div>
  }

  const isAlertTemp = telemetry.data && settings.thresholds && (
    telemetry.data.temp < settings.thresholds.tempMin ||
    telemetry.data.temp > settings.thresholds.tempMax
  )
  const isAlertHum = telemetry.data && settings.thresholds && (
    telemetry.data.hum < settings.thresholds.humMin ||
    telemetry.data.hum > settings.thresholds.humMax
  )
  const isAlertSoil = telemetry.data && settings.thresholds && (
    telemetry.data.soil < settings.thresholds.soilMin ||
    telemetry.data.soil > settings.thresholds.soilMax
  )
  const isAlertStatus = telemetry.data?.status === 'DANGER'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {telemetry.data ? `Last updated: ${formatTime(telemetry.data.ts, true)}` : 'Waiting for data...'}
        </p>
      </div>

      {/* Status indicator */}
      {telemetry.data && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="font-medium text-gray-700 dark:text-gray-300">Device Status</p>
          <StatusIndicator status={telemetry.data.status} />
        </div>
      )}

      {/* Alerts */}
      {(isAlertTemp || isAlertHum || isAlertSoil || isAlertStatus) && (
        <Alerts
          tempAlert={isAlertTemp ?? false}
          humAlert={isAlertHum ?? false}
          soilAlert={isAlertSoil ?? false}
          statusAlert={isAlertStatus}
        />
      )}

      {/* Main telemetry cards */}
      {telemetry.loading && !telemetry.data ? (
        <EmptyState
          icon="⏳"
          title="Connecting to device..."
          description={`Attempting to reach ${settings.deviceIp} at ${settings.pollingInterval}ms interval`}
        />
      ) : telemetry.error && !telemetry.data ? (
        <EmptyState
          icon="📡"
          title="Unable to connect"
          description={`Failed to reach ${settings.deviceIp}: ${telemetry.error.message}. Check device IP in Settings or enable Demo Mode.`}
          action={{
            label: 'Go to Settings',
            onClick: () => window.location.hash = '/settings',
          }}
        />
      ) : (
        <TelemetryGrid
          data={telemetry.data}
          history={telemetry.history}
          useFahrenheit={settings.useFahrenheit}
          thresholds={settings.thresholds}
          isLoading={telemetry.loading}
        />
      )}

      {/* Device Info */}
      {telemetry.data && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">Readings</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{telemetry.history.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">Update interval</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{settings.pollingInterval}ms</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">Temperature unit</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{settings.useFahrenheit ? '°F' : '°C'}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">Mode</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{settings.demoMode ? 'Demo' : 'Live'}</p>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 space-y-2 z-50">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        ))}
      </div>
    </div>
  )
}
