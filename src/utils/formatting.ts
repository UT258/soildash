import { TelemetryData } from '../types/telemetry'

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

/**
 * Convert Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9
}

/**
 * Format temperature with unit
 */
export function formatTemp(temp: number, useFahrenheit: boolean): string {
  const value = useFahrenheit ? celsiusToFahrenheit(temp) : temp
  return `${value.toFixed(1)}°${useFahrenheit ? 'F' : 'C'}`
}

/**
 * Format humidity with %
 */
export function formatHumidity(hum: number): string {
  return `${hum.toFixed(1)}%`
}

/**
 * Format soil moisture with %
 */
export function formatSoil(soil: number): string {
  return `${soil.toFixed(1)}%`
}

/**
 * Format timestamp with configurable options
 * Maintains backwards compatibility with boolean parameter
 */
export function formatTime(ts: string | Date, optionsOrIncludeDate?: boolean | {
  includeDate?: boolean
  includeSeconds?: boolean
  use24Hour?: boolean
}): string {
  const date = typeof ts === 'string' ? new Date(ts) : ts
  
  // Handle backwards compatibility with boolean parameter
  const options = typeof optionsOrIncludeDate === 'boolean' 
    ? { includeDate: optionsOrIncludeDate }
    : optionsOrIncludeDate || {}
  
  const { includeDate = false, includeSeconds = true, use24Hour = false } = options

  if (includeDate) {
    return date.toLocaleString(undefined, {
      hour12: !use24Hour,
      hour: '2-digit',
      minute: '2-digit',
      second: includeSeconds ? '2-digit' : undefined,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  
  return date.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: includeSeconds ? '2-digit' : undefined,
    hour12: !use24Hour,
  })
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(ts: string | Date): string {
  const date = typeof ts === 'string' ? new Date(ts) : ts
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  
  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return formatTime(date, { includeDate: true, includeSeconds: false })
}

/**
 * Get status color class
 */
export function getStatusColor(status: 'SAFE' | 'DANGER'): string {
  return status === 'SAFE' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
}

/**
 * Get status badge class
 */
export function getStatusBadge(status: 'SAFE' | 'DANGER'): string {
  return status === 'SAFE'
    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
}

/**
 * Determine if value is within threshold
 */
export function isWithinThreshold(
  value: number,
  min: number,
  max: number
): boolean {
  return value >= min && value <= max
}

/**
 * Get trend indicator (+/-/—)
 */
export function getTrendIndicator(current: number, previous: number | null): string {
  if (!previous) return '—'
  if (current > previous) return '↑'
  if (current < previous) return '↓'
  return '→'
}

/**
 * Get trend color class
 */
export function getTrendColor(trend: string): string {
  if (trend === '↑') return 'text-red-600 dark:text-red-400'
  if (trend === '↓') return 'text-blue-600 dark:text-blue-400'
  return 'text-gray-400'
}

/**
 * Format bytes for CSV export
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Generate CSV content from telemetry data with configurable columns
 */
export function generateCSV(readings: TelemetryData[], options?: {
  useFahrenheit?: boolean
  includeHeaders?: boolean
  delimiter?: string
}): string {
  const { useFahrenheit = false, includeHeaders = true, delimiter = ',' } = options || {}
  
  const headers = [
    'Timestamp',
    useFahrenheit ? 'Temperature (°F)' : 'Temperature (°C)',
    'Humidity (%)',
    'Soil Moisture (%)',
    'Status'
  ]
  
  const rows = readings.map(r => [
    new Date(r.ts).toISOString(),
    useFahrenheit ? celsiusToFahrenheit(r.temp).toFixed(2) : r.temp.toFixed(2),
    r.hum.toFixed(2),
    r.soil.toFixed(2),
    r.status,
  ])

  const csv = [
    ...(includeHeaders ? [headers.join(delimiter)] : []),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(delimiter)),
  ].join('\n')

  return csv
}

/**
 * Generate JSON export with metadata
 */
export function generateJSON(readings: TelemetryData[], metadata?: {
  deviceName?: string
  exportDate?: string
  version?: string
}): string {
  const exportData = {
    metadata: {
      exportDate: metadata?.exportDate || new Date().toISOString(),
      deviceName: metadata?.deviceName || 'Unknown Device',
      version: metadata?.version || '2.0.0',
      recordCount: readings.length,
      timeRange: readings.length > 0 ? {
        start: readings[readings.length - 1].ts,
        end: readings[0].ts,
      } : null,
    },
    data: readings,
  }

  return JSON.stringify(exportData, null, 2)
}

/**
 * Download file (CSV or JSON)
 */
export function downloadFile(content: string, filename: string, type: 'csv' | 'json' = 'csv'): void {
  const mimeTypes = {
    csv: 'text/csv;charset=utf-8;',
    json: 'application/json;charset=utf-8;',
  }
  
  const blob = new Blob([content], { type: mimeTypes[type] })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url) // Clean up
}

/**
 * Download CSV file (backwards-compatible alias)
 */
export function downloadCSV(csv: string, filename = 'telemetry.csv'): void {
  downloadFile(csv, filename, 'csv')
}
