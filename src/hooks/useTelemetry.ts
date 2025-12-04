import { useState, useEffect, useRef, useCallback } from 'react'
import { TelemetryData } from '../types/telemetry'
import { fetchTelemetry } from '../services/api'
import { generateMockData } from '../utils/mock'

interface UseTelemetryOptions {
  deviceIp: string
  interval: number
  useProxy: boolean
  demoMode: boolean
  onError?: (error: Error) => void
}

interface UseTelemetryState {
  data: TelemetryData | null
  loading: boolean
  error: Error | null
  history: TelemetryData[]
}

const MAX_HISTORY = 288 // ~24 hours at 5-min intervals

/**
 * Hook for polling telemetry data with automatic retry
 */
export function useTelemetry(options: UseTelemetryOptions): UseTelemetryState {
  const {
    deviceIp,
    interval,
    useProxy,
    demoMode,
    onError,
  } = options

  const [state, setState] = useState<UseTelemetryState>({
    data: null,
    loading: true,
    error: null,
    history: [],
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const intervalIdRef = useRef<number | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }))

      // Create abort controller for this fetch
      abortControllerRef.current = new AbortController()

      let data: TelemetryData
      if (demoMode) {
        data = generateMockData()
      } else {
        data = await fetchTelemetry(deviceIp, useProxy, {
          signal: abortControllerRef.current.signal,
        })
      }

      setState(prev => ({
        ...prev,
        data,
        loading: false,
        history: [data, ...prev.history].slice(0, MAX_HISTORY),
      }))
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }

      const err = error instanceof Error ? error : new Error(String(error))
      setState(prev => ({
        ...prev,
        error: err,
        loading: false,
      }))
      onError?.(err)
    }
  }, [deviceIp, useProxy, demoMode, onError])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Polling interval (enforce minimum of 5 seconds for stability)
  useEffect(() => {
    const safeInterval = Math.max(interval, 5000) // Minimum 5 seconds
    intervalIdRef.current = setInterval(fetchData, safeInterval)

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
      }
    }
  }, [fetchData, interval])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
      }
    }
  }, [])

  return state
}
