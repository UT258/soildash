import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Hook for debouncing a value
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for debouncing a callback
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const callbackRef = useRef(callback)

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args)
    }, delay)
  }, [delay])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedCallback
}

/**
 * Hook for throttling a value
 */
export function useThrottledValue<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastUpdatedRef = useRef<number>(Date.now())

  useEffect(() => {
    const now = Date.now()
    const timeSinceLastUpdate = now - lastUpdatedRef.current

    if (timeSinceLastUpdate >= interval) {
      setThrottledValue(value)
      lastUpdatedRef.current = now
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value)
        lastUpdatedRef.current = Date.now()
      }, interval - timeSinceLastUpdate)

      return () => clearTimeout(timer)
    }
  }, [value, interval])

  return throttledValue
}

/**
 * Hook for tracking previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

/**
 * Hook for interval updates
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback)

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval
  useEffect(() => {
    if (delay === null) return

    const tick = () => savedCallback.current()
    const id = setInterval(tick, delay)
    return () => clearInterval(id)
  }, [delay])
}

/**
 * Hook for countdown timer
 */
export function useCountdown(
  targetDate: Date | number,
  options?: { onComplete?: () => void; interval?: number }
): {
  days: number
  hours: number
  minutes: number
  seconds: number
  isComplete: boolean
  totalSeconds: number
} {
  const { onComplete, interval = 1000 } = options || {}
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    const target = typeof targetDate === 'number' ? targetDate : targetDate.getTime()
    
    const calculateTimeLeft = () => {
      const now = Date.now()
      return Math.max(0, target - now)
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft()
      setTimeLeft(remaining)
      
      if (remaining === 0 && onComplete) {
        onComplete()
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [targetDate, interval, onComplete])

  const totalSeconds = Math.floor(timeLeft / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    days,
    hours,
    minutes,
    seconds,
    isComplete: timeLeft === 0,
    totalSeconds,
  }
}
