import React from 'react'
import { formatTemp, formatHumidity, formatSoil, getTrendIndicator, getTrendColor } from '../utils/formatting'
import { TelemetryData } from '../types/telemetry'

interface TelemetryCardProps {
  label: string
  value: number
  unit: 'temp' | 'hum' | 'soil'
  min?: number
  max?: number
  previous?: number | null
  useFahrenheit?: boolean
  isLoading?: boolean
  isAlert?: boolean
  trend?: string
}

/**
 * Card displaying a single telemetry metric with min/max and trend
 */
export const TelemetryCard: React.FC<TelemetryCardProps> = ({
  label,
  value,
  unit,
  min,
  max,
  previous,
  useFahrenheit = false,
  isLoading = false,
  isAlert = false,
  trend,
}) => {
  let formattedValue: string
  switch (unit) {
    case 'temp':
      formattedValue = formatTemp(value, useFahrenheit)
      break
    case 'hum':
      formattedValue = formatHumidity(value)
      break
    case 'soil':
      formattedValue = formatSoil(value)
      break
  }

  const displayTrend = trend || getTrendIndicator(value, previous ?? null)

  const cardClasses = `
    rounded-xl p-6 backdrop-blur-sm transition-all duration-300
    ${isAlert
      ? 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 shadow-md'
      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-card hover:shadow-card-hover'
    }
  `

  return (
    <div className={cardClasses} data-testid={`telemetry-card-${unit}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          {isLoading ? (
            <div className="mt-2 h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          ) : (
            <p className={`mt-2 text-3xl font-bold ${isAlert ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
              {formattedValue}
            </p>
          )}
        </div>

        {displayTrend && !isLoading && (
          <div className={`text-2xl font-bold ${getTrendColor(displayTrend)}`}>
            {displayTrend}
          </div>
        )}
      </div>

      {(min !== undefined || max !== undefined) && !isLoading && (
        <div className="mt-4 flex gap-4 text-xs text-gray-600 dark:text-gray-400">
          {min !== undefined && (
            <div>
              <p className="font-medium">Min</p>
              <p className="text-gray-900 dark:text-white">
                {unit === 'temp' ? formatTemp(min, useFahrenheit) : unit === 'hum' ? formatHumidity(min) : formatSoil(min)}
              </p>
            </div>
          )}
          {max !== undefined && (
            <div>
              <p className="font-medium">Max</p>
              <p className="text-gray-900 dark:text-white">
                {unit === 'temp' ? formatTemp(max, useFahrenheit) : unit === 'hum' ? formatHumidity(max) : formatSoil(max)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface TelemetryGridProps {
  data: TelemetryData | null
  history: TelemetryData[]
  useFahrenheit?: boolean
  thresholds?: {
    tempMin: number
    tempMax: number
    humMin: number
    humMax: number
    soilMin: number
    soilMax: number
  }
  isLoading?: boolean
}

/**
 * Grid layout for multiple telemetry cards
 */
export const TelemetryGrid: React.FC<TelemetryGridProps> = ({
  data,
  history,
  useFahrenheit = false,
  thresholds,
  isLoading = false,
}) => {
  const previous = history.length > 1 ? history[1] : null

  const isAlertTemp = data && thresholds && (data.temp < thresholds.tempMin || data.temp > thresholds.tempMax)
  const isAlertHum = data && thresholds && (data.hum < thresholds.humMin || data.hum > thresholds.humMax)
  const isAlertSoil = data && thresholds && (data.soil < thresholds.soilMin || data.soil > thresholds.soilMax)

  const stats = history.length > 0
    ? {
        tempMin: Math.min(...history.map(h => h.temp)),
        tempMax: Math.max(...history.map(h => h.temp)),
        humMin: Math.min(...history.map(h => h.hum)),
        humMax: Math.max(...history.map(h => h.hum)),
        soilMin: Math.min(...history.map(h => h.soil)),
        soilMax: Math.max(...history.map(h => h.soil)),
      }
    : {}

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <TelemetryCard
        label="Temperature"
        value={data?.temp ?? 0}
        unit="temp"
        min={stats.tempMin}
        max={stats.tempMax}
        previous={previous?.temp}
        useFahrenheit={useFahrenheit}
        isLoading={isLoading}
        isAlert={isAlertTemp ?? false}
        data-testid="temp-card"
      />
      <TelemetryCard
        label="Humidity"
        value={data?.hum ?? 0}
        unit="hum"
        min={stats.humMin}
        max={stats.humMax}
        previous={previous?.hum}
        isLoading={isLoading}
        isAlert={isAlertHum ?? false}
      />
      <TelemetryCard
        label="Soil Moisture"
        value={data?.soil ?? 0}
        unit="soil"
        min={stats.soilMin}
        max={stats.soilMax}
        previous={previous?.soil}
        isLoading={isLoading}
        isAlert={isAlertSoil ?? false}
      />
    </div>
  )
}
