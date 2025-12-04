import { Settings, AlertThresholds } from '../types/telemetry'

const SETTINGS_KEY = 'soildash_settings'
const HISTORY_KEY = 'soildash_history'
const DEFAULT_THRESHOLDS: AlertThresholds = {
  tempMin: 10,
  tempMax: 40,
  humMin: 20,
  humMax: 95,
  soilMin: 20,
  soilMax: 95,
}

export const DEFAULT_SETTINGS: Settings = {
  deviceIp: '192.168.4.1',
  pollingInterval: 5000, // 5 seconds - stable interval
  useFahrenheit: false,
  darkMode: false,
  useProxy: true,
  demoMode: true,
  thresholds: DEFAULT_THRESHOLDS,
}

/**
 * Load settings from localStorage or return defaults
 */
export function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
  return DEFAULT_SETTINGS
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}

/**
 * Clear all stored data
 */
export function clearAllData(): void {
  try {
    localStorage.removeItem(SETTINGS_KEY)
    localStorage.removeItem(HISTORY_KEY)
  } catch (error) {
    console.error('Failed to clear data:', error)
  }
}
