import React, { useState, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { TelemetryData } from '../types/telemetry'
import { formatTime, celsiusToFahrenheit } from '../utils/formatting'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

type TimeRange = '1h' | '6h' | '24h' | '7d'

interface ChartsPanelProps {
  history: TelemetryData[]
  useFahrenheit?: boolean
  className?: string
}

/**
 * Charts panel with historical data visualization
 */
export const ChartsPanel: React.FC<ChartsPanelProps> = ({
  history,
  useFahrenheit = false,
  className = '',
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')

  const filteredData = useMemo(() => {
    const now = Date.now()
    const ranges: Record<TimeRange, number> = {
      '1h': 3600000,
      '6h': 21600000,
      '24h': 86400000,
      '7d': 604800000,
    }

    const cutoff = now - ranges[timeRange]
    return history.filter(h => new Date(h.ts).getTime() >= cutoff)
  }, [history, timeRange])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          usePointStyle: true,
          padding: 16,
          color: 'rgb(107, 114, 128)',
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += context.dataset.unit === 'temp' && useFahrenheit
                ? `${context.parsed.y.toFixed(1)}°F`
                : context.dataset.unit === 'temp'
                  ? `${context.parsed.y.toFixed(1)}°C`
                  : `${context.parsed.y.toFixed(1)}%`
            }
            return label
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          color: 'rgb(107, 114, 128)',
          callback: function (value: any) {
            return value.toFixed(0)
          },
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'rgb(107, 114, 128)',
          maxTicksLimit: 12,
        },
        grid: {
          display: false,
        },
      },
    },
  }

  const labels = filteredData.map(d => formatTime(d.ts))

  const tempData = {
    labels,
    datasets: [
      {
        label: useFahrenheit ? 'Temperature (°F)' : 'Temperature (°C)',
        data: filteredData.map(d => useFahrenheit ? celsiusToFahrenheit(d.temp) : d.temp),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        unit: 'temp',
      },
    ],
  }

  const humData = {
    labels,
    datasets: [
      {
        label: 'Humidity (%)',
        data: filteredData.map(d => d.hum),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        unit: 'hum',
      },
    ],
  }

  const soilData = {
    labels,
    datasets: [
      {
        label: 'Soil Moisture (%)',
        data: filteredData.map(d => d.soil),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        unit: 'soil',
      },
    ],
  }

  return (
    <div className={className}>
      <div className="mb-6 flex flex-wrap gap-2">
        {(['1h', '6h', '24h', '7d'] as TimeRange[]).map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              timeRange === range
                ? 'bg-plant-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {/* Temperature Chart */}
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Temperature Trend</h3>
          <div className="h-80">
            {filteredData.length > 0 ? (
              <Line data={tempData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Humidity Chart */}
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Humidity Trend</h3>
          <div className="h-80">
            {filteredData.length > 0 ? (
              <Line data={humData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Soil Moisture Chart */}
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Soil Moisture Trend</h3>
          <div className="h-80">
            {filteredData.length > 0 ? (
              <Line data={soilData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
