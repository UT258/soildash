import { useState, useEffect, useCallback, useRef } from 'react'

interface ConnectionHealthOptions {
  checkInterval?: number
  healthyThresholdMs?: number
  warningThresholdMs?: number
  onStatusChange?: (status: ConnectionStatus) => void
}

export type ConnectionStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'disconnected'

interface ConnectionHealthState {
  status: ConnectionStatus
  latency: number | null
  lastChecked: number | null
  uptime: number
  successRate: number
  isChecking: boolean
}

const DEFAULT_OPTIONS: Required<Omit<ConnectionHealthOptions, 'onStatusChange'>> = {
  checkInterval: 10000, // Check every 10 seconds
  healthyThresholdMs: 100,
  warningThresholdMs: 500,
}

/**
 * Hook for monitoring connection health with latency tracking
 */
export function useConnectionHealth(
  endpoint: string,
  options: ConnectionHealthOptions = {}
): ConnectionHealthState & {
  checkNow: () => Promise<void>
  resetStats: () => void
} {
  const {
    checkInterval = DEFAULT_OPTIONS.checkInterval,
    healthyThresholdMs = DEFAULT_OPTIONS.healthyThresholdMs,
    warningThresholdMs = DEFAULT_OPTIONS.warningThresholdMs,
    onStatusChange,
  } = options

  const [state, setState] = useState<ConnectionHealthState>({
    status: 'disconnected',
    latency: null,
    lastChecked: null,
    uptime: 0,
    successRate: 0,
    isChecking: false,
  })

  const statsRef = useRef({ totalChecks: 0, successfulChecks: 0, startTime: Date.now() })
  const previousStatusRef = useRef<ConnectionStatus>('disconnected')

  const determineStatus = useCallback((latency: number): ConnectionStatus => {
    if (latency < healthyThresholdMs) return 'excellent'
    if (latency < healthyThresholdMs * 2) return 'good'
    if (latency < warningThresholdMs) return 'fair'
    return 'poor'
  }, [healthyThresholdMs, warningThresholdMs])

  const checkConnection = useCallback(async () => {
    setState(prev => ({ ...prev, isChecking: true }))
    const startTime = performance.now()

    try {
      // Use HEAD request for minimal overhead
      const response = await fetch(endpoint, {
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })

      const latency = Math.round(performance.now() - startTime)
      const now = Date.now()

      statsRef.current.totalChecks++
      if (response.ok) {
        statsRef.current.successfulChecks++
      }

      const successRate = statsRef.current.totalChecks > 0
        ? (statsRef.current.successfulChecks / statsRef.current.totalChecks) * 100
        : 0

      const newStatus = response.ok ? determineStatus(latency) : 'poor'

      // Notify on status change
      if (newStatus !== previousStatusRef.current && onStatusChange) {
        onStatusChange(newStatus)
      }
      previousStatusRef.current = newStatus

      setState({
        status: newStatus,
        latency,
        lastChecked: now,
        uptime: now - statsRef.current.startTime,
        successRate: Math.round(successRate * 10) / 10,
        isChecking: false,
      })
    } catch {
      statsRef.current.totalChecks++
      const successRate = statsRef.current.totalChecks > 0
        ? (statsRef.current.successfulChecks / statsRef.current.totalChecks) * 100
        : 0

      const newStatus: ConnectionStatus = 'disconnected'
      if (newStatus !== previousStatusRef.current && onStatusChange) {
        onStatusChange(newStatus)
      }
      previousStatusRef.current = newStatus

      setState(prev => ({
        ...prev,
        status: 'disconnected',
        latency: null,
        lastChecked: Date.now(),
        successRate: Math.round(successRate * 10) / 10,
        isChecking: false,
      }))
    }
  }, [endpoint, determineStatus, onStatusChange])

  const resetStats = useCallback(() => {
    statsRef.current = { totalChecks: 0, successfulChecks: 0, startTime: Date.now() }
    setState({
      status: 'disconnected',
      latency: null,
      lastChecked: null,
      uptime: 0,
      successRate: 0,
      isChecking: false,
    })
  }, [])

  // Initial check and interval
  useEffect(() => {
    checkConnection()
    const intervalId = setInterval(checkConnection, checkInterval)
    return () => clearInterval(intervalId)
  }, [checkConnection, checkInterval])

  return {
    ...state,
    checkNow: checkConnection,
    resetStats,
  }
}

/**
 * Get color for connection status (for UI indicators)
 */
export function getConnectionStatusColor(status: ConnectionStatus): string {
  switch (status) {
    case 'excellent':
      return '#22c55e' // green-500
    case 'good':
      return '#84cc16' // lime-500
    case 'fair':
      return '#eab308' // yellow-500
    case 'poor':
      return '#f97316' // orange-500
    case 'disconnected':
      return '#ef4444' // red-500
  }
}

/**
 * Get text label for connection status
 */
export function getConnectionStatusLabel(status: ConnectionStatus): string {
  switch (status) {
    case 'excellent':
      return 'Excellent'
    case 'good':
      return 'Good'
    case 'fair':
      return 'Fair'
    case 'poor':
      return 'Poor'
    case 'disconnected':
      return 'Disconnected'
  }
}
