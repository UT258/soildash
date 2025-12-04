import { TelemetryData } from '../types/telemetry'

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
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
 * Format timestamp
 */
export function formatTime(ts: string | Date, includeDate = false): string {
  const date = typeof ts === 'string' ? new Date(ts) : ts
  if (includeDate) {
    return date.toLocaleString()
  }
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
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
 * Generate CSV content from telemetry data
 */
export function generateCSV(readings: TelemetryData[]): string {
  const headers = ['Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Soil Moisture (%)', 'Status']
  const rows = readings.map(r => [
    new Date(r.ts).toLocaleString(),
    r.temp.toFixed(2),
    r.hum.toFixed(2),
    r.soil.toFixed(2),
    r.status,
  ])

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')

  return csv
}

/**
 * Download CSV file
 */
export function downloadCSV(csv: string, filename = 'telemetry.csv'): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
