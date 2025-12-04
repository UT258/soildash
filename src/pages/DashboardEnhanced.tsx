import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Thermometer, Droplet, Droplets } from 'lucide-react'
import { KPICard, KPIGrid, KPICardSkeleton } from '../components/kpi/KPICard'
import { useDeviceStore } from '../stores/deviceStore'
import { useRealtimeStore } from '../stores/realtimeStore'
import { useAlertStore } from '../stores/alertStore'
import type { TelemetryStats } from '../types/enhanced'

export const DashboardEnhanced: React.FC = () => {
  const selectedDevice = useDeviceStore(state => state.selectedDevice())
  const { latestReading, isConnected, streamingHistory } = useRealtimeStore()
  const alerts = useAlertStore(state => state.filteredAlerts())
  
  // Calculate statistics from streaming history (optimized with smaller data set)
  const stats = useMemo(() => {
    if (streamingHistory.length === 0) {
      return {
        temp: { current: 0, min: 0, max: 0, avg: 0, trend: 'stable' as const, trendValue: 0, sparklineData: [] },
        hum: { current: 0, min: 0, max: 0, avg: 0, trend: 'stable' as const, trendValue: 0, sparklineData: [] },
        soil: { current: 0, min: 0, max: 0, avg: 0, trend: 'stable' as const, trendValue: 0, sparklineData: [] },
      }
    }
    
    // Only use last 50 points instead of all history for better performance
    const recentData = streamingHistory.slice(-50)
    
    const calculateMetricStats = (key: 'temp' | 'hum' | 'soil'): TelemetryStats => {
      const values = recentData.map(r => r[key])
      const current = values[values.length - 1]
      const previous = values[values.length - 2] || current
      
      return {
        current,
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        trend: current > previous ? 'up' : current < previous ? 'down' : 'stable',
        trendValue: previous !== 0 ? ((current - previous) / previous) * 100 : 0,
        sparklineData: values.slice(-15), // Reduced from 20 to 15 points
      }
    }
    
    return {
      temp: calculateMetricStats('temp'),
      hum: calculateMetricStats('hum'),
      soil: calculateMetricStats('soil'),
    }
  }, [streamingHistory])
  
  const formatTemp = (value: number) => {
    // Convert to Fahrenheit if needed
    return value.toFixed(1)
  }
  
  if (!selectedDevice) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No device selected. Please select a device from the dropdown above.
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time monitoring for {selectedDevice.name}
        </p>
      </div>
      
      {/* KPI Cards */}
      {!isConnected || !latestReading ? (
        <KPIGrid columns={3}>
          <KPICardSkeleton />
          <KPICardSkeleton />
          <KPICardSkeleton />
        </KPIGrid>
      ) : (
        <KPIGrid columns={3}>
          <KPICard
            title="Temperature"
            value={latestReading.temp}
            unit="°C"
            icon={<Thermometer className="w-6 h-6" />}
            stats={stats.temp}
            color="#ef4444"
            isLive={isConnected}
            isDanger={latestReading.temp > 35 || latestReading.temp < 10}
            lastUpdate={latestReading.ts}
            formatValue={formatTemp}
          />
          
          <KPICard
            title="Humidity"
            value={latestReading.hum}
            unit="%"
            icon={<Droplet className="w-6 h-6" />}
            stats={stats.hum}
            color="#3b82f6"
            isLive={isConnected}
            isDanger={latestReading.hum < 30 || latestReading.hum > 80}
            lastUpdate={latestReading.ts}
          />
          
          <KPICard
            title="Soil Moisture"
            value={latestReading.soil}
            unit="%"
            icon={<Droplets className="w-6 h-6" />}
            stats={stats.soil}
            color="#8b5cf6"
            isLive={isConnected}
            isDanger={latestReading.soil < 20}
            lastUpdate={latestReading.ts}
          />
        </KPIGrid>
      )}
      
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Active Alerts
          </h2>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>✅ No active alerts</p>
              <p className="text-sm mt-1">All systems operating normally</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 5).map(alert => (
                <div
                  key={alert.id}
                  className={`
                    p-4 rounded-lg border-l-4
                    ${alert.severity === 'critical' 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                      : alert.severity === 'warning'
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    }
                  `}
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {alert.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Device Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Device Information
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Name</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedDevice.name}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Type</span>
              <span className="font-medium text-gray-900 dark:text-white capitalize">
                {selectedDevice.type}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">IP Address</span>
              <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                {selectedDevice.ipAddress}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Firmware</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedDevice.firmware}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Status</span>
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${selectedDevice.status === 'SAFE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  selectedDevice.status === 'WARNING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  selectedDevice.status === 'DANGER' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                }
              `}>
                {selectedDevice.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
