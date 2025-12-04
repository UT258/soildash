import { TelemetryData } from '../types/telemetry'

// Configuration for mock data generation
interface MockDataConfig {
  tempBase?: number
  tempAmplitude?: number
  humBase?: number
  humAmplitude?: number
  soilBase?: number
  soilAmplitude?: number
  dangerProbability?: number
  period?: number
}

const DEFAULT_CONFIG: Required<MockDataConfig> = {
  tempBase: 22,
  tempAmplitude: 4,
  humBase: 55,
  humAmplitude: 10,
  soilBase: 60,
  soilAmplitude: 15,
  dangerProbability: 0.02,
  period: 7200000, // 2 hour period
}

// Cache for smoother transitions
let lastValues = {
  temp: DEFAULT_CONFIG.tempBase,
  hum: DEFAULT_CONFIG.humBase,
  soil: DEFAULT_CONFIG.soilBase,
}

/**
 * Generate mock telemetry data for demo mode with configurable parameters
 * Uses exponential smoothing for more realistic transitions
 */
export function generateMockData(config: MockDataConfig = {}): TelemetryData {
  const now = new Date()
  const settings = { ...DEFAULT_CONFIG, ...config }

  // Calculate phase for sine wave pattern
  const timeMs = now.getTime()
  const phase = (timeMs % settings.period) / settings.period

  // Generate target values with sine wave pattern
  const targetTemp = settings.tempBase + settings.tempAmplitude * Math.sin(phase * Math.PI * 2)
  const targetHum = settings.humBase + settings.humAmplitude * Math.sin(phase * Math.PI * 2 + Math.PI / 2)
  const targetSoil = settings.soilBase + settings.soilAmplitude * Math.sin(phase * Math.PI * 2 + Math.PI)

  // Apply exponential smoothing for smoother transitions (alpha = 0.3)
  const smoothingFactor = 0.3
  lastValues.temp = lastValues.temp + smoothingFactor * (targetTemp - lastValues.temp) + (Math.random() - 0.5) * 0.3
  lastValues.hum = lastValues.hum + smoothingFactor * (targetHum - lastValues.hum) + (Math.random() - 0.5) * 0.5
  lastValues.soil = lastValues.soil + smoothingFactor * (targetSoil - lastValues.soil) + (Math.random() - 0.5) * 1

  // Clamp values to realistic ranges
  const clampedTemp = Math.max(0, Math.min(50, lastValues.temp))
  const clampedHum = Math.max(0, Math.min(100, lastValues.hum))
  const clampedSoil = Math.max(0, Math.min(100, lastValues.soil))

  // Determine status based on thresholds
  const isDanger = clampedTemp > 35 || clampedTemp < 10 || 
                   clampedHum < 20 || clampedHum > 90 ||
                   clampedSoil < 15 ||
                   Math.random() < settings.dangerProbability

  return {
    temp: Math.round(clampedTemp * 10) / 10,
    hum: Math.round(clampedHum * 10) / 10,
    soil: Math.round(clampedSoil * 10) / 10,
    status: isDanger ? 'DANGER' : 'SAFE',
    ts: now.toISOString(),
  }
}

/**
 * Reset mock data cache (useful for testing)
 */
export function resetMockDataCache(): void {
  lastValues = {
    temp: DEFAULT_CONFIG.tempBase,
    hum: DEFAULT_CONFIG.humBase,
    soil: DEFAULT_CONFIG.soilBase,
  }
}

interface HistoryConfig {
  count?: number
  intervalMs?: number
  includeAnomalies?: boolean
}

/**
 * Generate mock history data (N readings over time) with configurable options
 */
export function generateMockHistory(config: HistoryConfig | number = 100): TelemetryData[] {
  // Handle legacy number parameter
  const settings = typeof config === 'number' 
    ? { count: config, intervalMs: 300000, includeAnomalies: true }
    : { count: 100, intervalMs: 300000, includeAnomalies: true, ...config }

  const readings: TelemetryData[] = []
  const now = Date.now()

  for (let i = settings.count - 1; i >= 0; i--) {
    const timestamp = now - i * settings.intervalMs
    const date = new Date(timestamp)

    // Multiple frequency components for more realistic patterns
    const hourPhase = (timestamp % 3600000) / 3600000
    const dayPhase = (timestamp % 86400000) / 86400000

    // Combine daily and hourly patterns
    const dailyTemp = 5 * Math.sin(dayPhase * Math.PI * 2 - Math.PI / 2) // Peak at noon
    const hourlyTemp = 2 * Math.sin(hourPhase * Math.PI * 4)

    // Add occasional anomalies for more interesting data
    const hasAnomaly = settings.includeAnomalies && Math.random() > 0.98
    const anomalyFactor = hasAnomaly ? (Math.random() > 0.5 ? 1.5 : 0.5) : 1

    const temp = (22 + dailyTemp + hourlyTemp + (Math.random() - 0.5) * 1.5) * anomalyFactor
    const hum = 55 + 15 * Math.sin(dayPhase * Math.PI * 2 + Math.PI) + (Math.random() - 0.5) * 3
    const soil = 60 + 20 * Math.sin(dayPhase * Math.PI * 2 + Math.PI / 2) + (Math.random() - 0.5) * 5

    readings.push({
      temp: Math.round(Math.max(0, Math.min(50, temp)) * 10) / 10,
      hum: Math.round(Math.max(0, Math.min(100, hum)) * 10) / 10,
      soil: Math.round(Math.max(0, Math.min(100, soil)) * 10) / 10,
      status: temp > 35 || temp < 10 || hum < 20 || soil < 15 ? 'DANGER' : 'SAFE',
      ts: date.toISOString(),
    })
  }

  return readings
}

interface StatsResult {
  min: { temp?: number; hum?: number; soil?: number }
  max: { temp?: number; hum?: number; soil?: number }
  avg: { temp?: number; hum?: number; soil?: number }
  stdDev?: { temp?: number; hum?: number; soil?: number }
  trend?: { temp: 'up' | 'down' | 'stable'; hum: 'up' | 'down' | 'stable'; soil: 'up' | 'down' | 'stable' }
}

/**
 * Calculate comprehensive statistics for telemetry data
 * Includes min, max, avg, standard deviation, and trend analysis
 */
export function calculateStats(readings: TelemetryData[], includeAdvanced = false): StatsResult {
  if (readings.length === 0) {
    return { min: {}, max: {}, avg: {} }
  }

  const temps = readings.map(r => r.temp)
  const hums = readings.map(r => r.hum)
  const soils = readings.map(r => r.soil)

  const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length
  const avgHum = hums.reduce((a, b) => a + b, 0) / hums.length
  const avgSoil = soils.reduce((a, b) => a + b, 0) / soils.length

  const result: StatsResult = {
    min: {
      temp: Math.min(...temps),
      hum: Math.min(...hums),
      soil: Math.min(...soils),
    },
    max: {
      temp: Math.max(...temps),
      hum: Math.max(...hums),
      soil: Math.max(...soils),
    },
    avg: {
      temp: Math.round(avgTemp * 10) / 10,
      hum: Math.round(avgHum * 10) / 10,
      soil: Math.round(avgSoil * 10) / 10,
    },
  }

  if (includeAdvanced && readings.length >= 2) {
    // Calculate standard deviation
    const calcStdDev = (values: number[], avg: number) => {
      const squareDiffs = values.map(value => Math.pow(value - avg, 2))
      const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length
      return Math.round(Math.sqrt(avgSquareDiff) * 10) / 10
    }

    result.stdDev = {
      temp: calcStdDev(temps, avgTemp),
      hum: calcStdDev(hums, avgHum),
      soil: calcStdDev(soils, avgSoil),
    }

    // Calculate trend using linear regression slope
    const calcTrend = (values: number[]): 'up' | 'down' | 'stable' => {
      const n = values.length
      const sumX = (n * (n - 1)) / 2
      const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6
      const sumY = values.reduce((a, b) => a + b, 0)
      const sumXY = values.reduce((sum, val, i) => sum + i * val, 0)
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
      
      // Threshold for significant trend
      const threshold = 0.01
      if (slope > threshold) return 'up'
      if (slope < -threshold) return 'down'
      return 'stable'
    }

    result.trend = {
      temp: calcTrend(temps),
      hum: calcTrend(hums),
      soil: calcTrend(soils),
    }
  }

  return result
}

/**
 * Calculate moving average for smoother visualization
 */
export function calculateMovingAverage(readings: TelemetryData[], windowSize = 5): TelemetryData[] {
  if (readings.length < windowSize) return readings

  return readings.map((reading, index) => {
    const start = Math.max(0, index - windowSize + 1)
    const window = readings.slice(start, index + 1)
    
    return {
      ...reading,
      temp: Math.round(window.reduce((sum, r) => sum + r.temp, 0) / window.length * 10) / 10,
      hum: Math.round(window.reduce((sum, r) => sum + r.hum, 0) / window.length * 10) / 10,
      soil: Math.round(window.reduce((sum, r) => sum + r.soil, 0) / window.length * 10) / 10,
    }
  })
}
