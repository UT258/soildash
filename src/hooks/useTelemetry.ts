import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { TelemetryData } from '../types/telemetry'
import { fetchTelemetry } from '../services/api'
import { generateMockData } from '../utils/mock'

interface UseTelemetryOptions {
  deviceIp: string
  interval: number
  useProxy: boolean
  demoMode: boolean
  onError?: (error: Error) => void
  onDataReceived?: (data: TelemetryData) => void
  maxHistory?: number
  enabled?: boolean
}

interface UseTelemetryState {
  data: TelemetryData | null
  loading: boolean
  error: Error | null
  history: TelemetryData[]
  isPolling: boolean
  lastFetchTime: number | null
  fetchCount: number
}

interface UseTelemetryStats {
  avgTemp: number
  avgHum: number
  avgSoil: number
  minTemp: number
  maxTemp: number
  minHum: number
  maxHum: number
  minSoil: number
  maxSoil: number
}

const DEFAULT_MAX_HISTORY = 288 // ~24 hours at 5-min intervals
const MIN_INTERVAL = 2000 // Minimum 2 seconds for better responsiveness

/**
 * Hook for polling telemetry data with automatic retry and performance optimizations
 */
export function useTelemetry(options: UseTelemetryOptions): UseTelemetryState & {
  stats: UseTelemetryStats | null
  refetch: () => void
  clearHistory: () => void
} {
  const {
    deviceIp,
    interval,
    useProxy,
    demoMode,
    onError,
    onDataReceived,
    maxHistory = DEFAULT_MAX_HISTORY,
    enabled = true,
  } = options

  const [state, setState] = useState<UseTelemetryState>({
    data: null,
    loading: true,
    error: null,
    history: [],
    isPolling: false,
    lastFetchTime: null,
    fetchCount: 0,
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const intervalIdRef = useRef<number | null>(null)
  const isMountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    if (!enabled || !isMountedRef.current) return

    try {
      setState(prev => ({ ...prev, error: null, isPolling: true }))

      // Create abort controller for this fetch
      abortControllerRef.current = new AbortController()

      let data: TelemetryData
      if (demoMode) {
        // Small delay to simulate network latency in demo mode
        await new Promise(resolve => setTimeout(resolve, 50))
        data = generateMockData()
      } else {
        data = await fetchTelemetry(deviceIp, useProxy, {
          signal: abortControllerRef.current.signal,
        })
      }

      if (!isMountedRef.current) return

      setState(prev => ({
        ...prev,
        data,
        loading: false,
        isPolling: false,
        lastFetchTime: Date.now(),
        fetchCount: prev.fetchCount + 1,
        history: [data, ...prev.history].slice(0, maxHistory),
      }))

      onDataReceived?.(data)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }

      if (!isMountedRef.current) return

      const err = error instanceof Error ? error : new Error(String(error))
      setState(prev => ({
        ...prev,
        error: err,
        loading: false,
        isPolling: false,
      }))
      onError?.(err)
    }
  }, [deviceIp, useProxy, demoMode, onError, onDataReceived, maxHistory, enabled])

  // Calculate stats using useMemo for performance
  const stats = useMemo((): UseTelemetryStats | null => {
    if (state.history.length === 0) return null

    const temps = state.history.map(h => h.temp)
    const hums = state.history.map(h => h.hum)
    const soils = state.history.map(h => h.soil)

    return {
      avgTemp: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length * 10) / 10,
      avgHum: Math.round(hums.reduce((a, b) => a + b, 0) / hums.length * 10) / 10,
      avgSoil: Math.round(soils.reduce((a, b) => a + b, 0) / soils.length * 10) / 10,
      minTemp: Math.min(...temps),
      maxTemp: Math.max(...temps),
      minHum: Math.min(...hums),
      maxHum: Math.max(...hums),
      minSoil: Math.min(...soils),
      maxSoil: Math.max(...soils),
    }
  }, [state.history])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }))
  }, [])

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchData()
    }
  }, [fetchData, enabled])

  // Polling interval with configurable minimum
  useEffect(() => {
    if (!enabled) {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
        intervalIdRef.current = null
      }
      return
    }

    const safeInterval = Math.max(interval, MIN_INTERVAL)
    intervalIdRef.current = setInterval(fetchData, safeInterval) as unknown as number

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
      }
    }
  }, [fetchData, interval, enabled])

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true
    
    return () => {
      isMountedRef.current = false
      abortControllerRef.current?.abort()
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
      }
    }
  }, [])

  return { ...state, stats, refetch, clearHistory }
}
