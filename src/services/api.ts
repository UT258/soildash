import { TelemetryData } from '../types/telemetry'

const MAX_RETRIES = 3
const INITIAL_BACKOFF_MS = 500
const MAX_BACKOFF_MS = 5000

interface FetchOptions {
  retries?: number
  backoffMultiplier?: number
  signal?: AbortSignal
}

/**
 * Fetch data from device or proxy with retry + exponential backoff
 */
export async function fetchTelemetry(
  deviceIp: string,
  useProxy: boolean,
  options: FetchOptions = {}
): Promise<TelemetryData> {
  const {
    retries = MAX_RETRIES,
    backoffMultiplier = 1.5,
    signal,
  } = options

  const url = useProxy
    ? '/api/data'
    : `http://${deviceIp}/data`

  let lastError: Error | null = null
  let backoffMs = INITIAL_BACKOFF_MS

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        signal,
        headers: { 'Accept': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json() as TelemetryData

      // Validate required fields
      if (
        typeof data.temp !== 'number' ||
        typeof data.hum !== 'number' ||
        typeof data.soil !== 'number' ||
        !['SAFE', 'DANGER'].includes(data.status)
      ) {
        throw new Error('Invalid telemetry data format')
      }

      // Add timestamp if not provided by device
      if (!data.ts) {
        data.ts = new Date().toISOString()
      }

      return data
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < retries) {
        // Exponential backoff before retry
        await new Promise(resolve => setTimeout(resolve, backoffMs))
        backoffMs = Math.min(backoffMs * backoffMultiplier, MAX_BACKOFF_MS)
      }
    }
  }

  throw lastError || new Error('Failed to fetch telemetry data')
}

/**
 * Fetch historical data from proxy endpoint (optional)
 */
export async function fetchHistory(
  _deviceIp: string,
  useProxy: boolean,
  range: 'now-1h' | 'now-6h' | 'now-24h' | 'now-7d' = 'now-24h',
  signal?: AbortSignal
): Promise<TelemetryData[]> {
  if (!useProxy) {
    // Direct device doesn't support history
    return []
  }

  const url = `/api/history?range=${range}`

  try {
    const response = await fetch(url, { signal })
    if (!response.ok) {
      return []
    }
    return await response.json()
  } catch {
    return []
  }
}

/**
 * Validate telemetry data format
 */
export function isValidTelemetry(data: unknown): data is TelemetryData {
  if (!data || typeof data !== 'object') return false

  const obj = data as Record<string, unknown>

  return (
    typeof obj.temp === 'number' &&
    typeof obj.hum === 'number' &&
    typeof obj.soil === 'number' &&
    (obj.status === 'SAFE' || obj.status === 'DANGER')
  )
}
