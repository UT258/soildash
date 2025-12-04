/**
 * Core telemetry data types for ESP32 device
 */

export interface TelemetryData {
  temp: number          // Temperature in Celsius
  hum: number           // Humidity as percentage
  soil: number          // Soil moisture as percentage
  status: 'SAFE' | 'DANGER'  // Device status
  ts: string            // ISO8601 timestamp
}

export interface TelemetryReading extends TelemetryData {
  id?: string           // Optional unique ID for history
}

export interface TelemetryHistory {
  readings: TelemetryReading[]
  lastUpdated: string
}

export interface AlertThresholds {
  tempMin: number
  tempMax: number
  humMin: number
  humMax: number
  soilMin: number
  soilMax: number
}

export interface Settings {
  deviceIp: string
  pollingInterval: number  // milliseconds
  useFahrenheit: boolean
  darkMode: boolean
  useProxy: boolean
  demoMode: boolean
  thresholds: AlertThresholds
}

export interface TelemetryStats {
  current: TelemetryData | null
  min: Partial<TelemetryData>
  max: Partial<TelemetryData>
  avg: Partial<TelemetryData>
}
