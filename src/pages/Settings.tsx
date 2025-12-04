import React, { useState } from 'react'
import { useSettings } from '../hooks/useSettings'
import { Toast } from '../components/Alerts'
import { clearAllData, DEFAULT_SETTINGS } from '../services/localStorage'

/**
 * Settings page - configuration and preferences
 */
export const Settings: React.FC = () => {
  const { settings, updateSettings, updateThresholds } = useSettings()
  const [toast, setToast] = useState<{ id: string; message: string; type: 'success' | 'error' } | null>(null)

  if (!settings) {
    return <div className="text-center py-12">Loading...</div>
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString()
    setToast({ id, message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleResetSettings = () => {
    if (confirm('Reset all settings to defaults?')) {
      updateSettings(DEFAULT_SETTINGS)
      showToast('Settings reset to defaults')
    }
  }

  const handleClearData = () => {
    if (confirm('Clear all stored data? This cannot be undone.')) {
      clearAllData()
      showToast('All data cleared')
      // Reload page to reset
      setTimeout(() => window.location.reload(), 1500)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure device connection and preferences</p>
      </div>

      {/* Device Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">📡 Device Configuration</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Device IP Address
            </label>
            <input
              type="text"
              value={settings.deviceIp}
              onChange={(e) => updateSettings({ deviceIp: e.target.value })}
              placeholder="192.168.4.1"
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              IP address of your ESP32 device on the local network
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Polling Interval (ms)
            </label>
            <input
              type="number"
              value={settings.pollingInterval}
              onChange={(e) => updateSettings({ pollingInterval: Math.max(100, parseInt(e.target.value)) })}
              min="100"
              max="60000"
              step="100"
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              How often to fetch new data (minimum 100ms)
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="useProxy"
              checked={settings.useProxy}
              onChange={(e) => updateSettings({ useProxy: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="useProxy" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Use local proxy server (http://localhost:3000)
            </label>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enable to use the optional Node.js proxy for CORS and SSE support
          </p>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="demoMode"
              checked={settings.demoMode}
              onChange={(e) => updateSettings({ demoMode: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="demoMode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Demo mode (generates sample data)
            </label>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enable to test the dashboard without a real device
          </p>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">🎨 Display Settings</h2>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="useFahrenheit"
              checked={settings.useFahrenheit}
              onChange={(e) => updateSettings({ useFahrenheit: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="useFahrenheit" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Display temperature in Fahrenheit (default: Celsius)
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="darkMode"
              checked={settings.darkMode}
              onChange={(e) => updateSettings({ darkMode: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="darkMode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Dark mode (use header toggle for immediate effect)
            </label>
          </div>
        </div>
      </div>

      {/* Alert Thresholds */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">🚨 Alert Thresholds</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Min Temperature (°C)
            </label>
            <input
              type="number"
              value={settings.thresholds.tempMin}
              onChange={(e) => updateThresholds({ ...settings.thresholds, tempMin: parseFloat(e.target.value) })}
              step="0.1"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Temperature (°C)
            </label>
            <input
              type="number"
              value={settings.thresholds.tempMax}
              onChange={(e) => updateThresholds({ ...settings.thresholds, tempMax: parseFloat(e.target.value) })}
              step="0.1"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Min Humidity (%)
            </label>
            <input
              type="number"
              value={settings.thresholds.humMin}
              onChange={(e) => updateThresholds({ ...settings.thresholds, humMin: parseFloat(e.target.value) })}
              step="1"
              min="0"
              max="100"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Humidity (%)
            </label>
            <input
              type="number"
              value={settings.thresholds.humMax}
              onChange={(e) => updateThresholds({ ...settings.thresholds, humMax: parseFloat(e.target.value) })}
              step="1"
              min="0"
              max="100"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Min Soil Moisture (%)
            </label>
            <input
              type="number"
              value={settings.thresholds.soilMin}
              onChange={(e) => updateThresholds({ ...settings.thresholds, soilMin: parseFloat(e.target.value) })}
              step="1"
              min="0"
              max="100"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Soil Moisture (%)
            </label>
            <input
              type="number"
              value={settings.thresholds.soilMax}
              onChange={(e) => updateThresholds({ ...settings.thresholds, soilMax: parseFloat(e.target.value) })}
              step="1"
              min="0"
              max="100"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-950 rounded-xl border border-red-200 dark:border-red-800 p-6">
        <h2 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4">⚠️ Danger Zone</h2>

        <div className="space-y-3">
          <button
            onClick={handleResetSettings}
            className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
          >
            Reset Settings to Defaults
          </button>
          <button
            onClick={handleClearData}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Clear All Data
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  )
}
