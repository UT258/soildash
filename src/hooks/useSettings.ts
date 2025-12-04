import { useState, useEffect } from 'react'
import { Settings } from '../types/telemetry'
import { loadSettings, saveSettings as persistSettings } from '../services/localStorage'

/**
 * Hook for managing app settings with localStorage persistence
 */
export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)

  // Load settings on mount
  useEffect(() => {
    setSettings(loadSettings())
  }, [])

  const updateSettings = (updates: Partial<Settings>) => {
    if (settings) {
      const updated = { ...settings, ...updates }
      setSettings(updated)
      persistSettings(updated)
    }
  }

  const updateThresholds = (thresholds: Settings['thresholds']) => {
    if (settings) {
      const updated = {
        ...settings,
        thresholds,
      }
      setSettings(updated)
      persistSettings(updated)
    }
  }

  return {
    settings,
    updateSettings,
    updateThresholds,
  }
}
