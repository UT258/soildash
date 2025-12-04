import { TelemetryData } from '../types/telemetry'

/**
 * Generate mock telemetry data for demo mode
 */
export function generateMockData(): TelemetryData {
  const now = new Date()

  // Slower sine wave pattern for more stable data
  const timeMs = now.getTime()
  const period = 7200000 // 2 hour period (slower changes)
  const phase = (timeMs % period) / period

  return {
    temp: 22 + 4 * Math.sin(phase * Math.PI * 2) + (Math.random() - 0.5) * 0.5, // Reduced variation
    hum: 55 + 10 * Math.sin(phase * Math.PI * 2 + Math.PI / 2) + (Math.random() - 0.5) * 1, // Reduced variation
    soil: 60 + 15 * Math.sin(phase * Math.PI * 2 + Math.PI) + (Math.random() - 0.5) * 2, // Reduced variation
    status: Math.random() > 0.98 ? 'DANGER' : 'SAFE', // Less frequent danger (2% instead of 5%)
    ts: now.toISOString(),
  }
}

/**
 * Generate mock history data (N readings over time)
 */
export function generateMockHistory(count = 100): TelemetryData[] {
  const readings: TelemetryData[] = []
  const now = Date.now()
  const intervalMs = 300000 // 5 minutes between readings

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - i * intervalMs
    const date = new Date(timestamp)

    // Sine wave pattern for realistic data
    const phase = (timestamp % 3600000) / 3600000
    readings.push({
      temp: 22 + 8 * Math.sin(phase * Math.PI * 2) + (Math.random() - 0.5) * 2,
      hum: 55 + 20 * Math.sin(phase * Math.PI * 2 + Math.PI / 2) + (Math.random() - 0.5) * 5,
      soil: 60 + 30 * Math.sin(phase * Math.PI * 2 + Math.PI) + (Math.random() - 0.5) * 10,
      status: Math.random() > 0.95 ? 'DANGER' : 'SAFE',
      ts: date.toISOString(),
    })
  }

  return readings
}

/**
 * Calculate statistics for telemetry data
 */
export function calculateStats(readings: TelemetryData[]) {
  if (readings.length === 0) {
    return { min: {}, max: {}, avg: {} }
  }

  const temps = readings.map(r => r.temp)
  const hums = readings.map(r => r.hum)
  const soils = readings.map(r => r.soil)

  return {
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
      temp: temps.reduce((a, b) => a + b, 0) / temps.length,
      hum: hums.reduce((a, b) => a + b, 0) / hums.length,
      soil: soils.reduce((a, b) => a + b, 0) / soils.length,
    },
  }
}
