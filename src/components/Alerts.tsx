import React from 'react'
import { getStatusBadge } from '../utils/formatting'

interface StatusIndicatorProps {
  status: 'SAFE' | 'DANGER'
  isLoading?: boolean
  className?: string
}

/**
 * Status indicator badge
 */
export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`inline-block h-8 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 ${className}`} />
    )
  }

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusBadge(status)} ${className}`}>
      <span className={`mr-2 inline-block h-2 w-2 rounded-full ${status === 'SAFE' ? 'bg-green-600 dark:bg-green-400 animate-pulse' : 'bg-red-600 dark:bg-red-400'}`} />
      {status}
    </span>
  )
}

interface AlertsProps {
  tempAlert?: boolean
  humAlert?: boolean
  soilAlert?: boolean
  statusAlert?: boolean
  className?: string
}

/**
 * Alert display component
 */
export const Alerts: React.FC<AlertsProps> = ({
  tempAlert,
  humAlert,
  soilAlert,
  statusAlert,
  className = '',
}) => {
  const alerts = [
    { label: 'Temperature', active: tempAlert },
    { label: 'Humidity', active: humAlert },
    { label: 'Soil Moisture', active: soilAlert },
    { label: 'Device Status', active: statusAlert },
  ].filter(a => a.active)

  if (alerts.length === 0) {
    return null
  }

  return (
    <div className={`rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-4 ${className}`}>
      <h3 className="font-medium text-red-900 dark:text-red-100 mb-2">⚠️ Alerts</h3>
      <ul className="space-y-1">
        {alerts.map(alert => (
          <li key={alert.label} className="text-sm text-red-700 dark:text-red-200">
            • {alert.label} threshold exceeded
          </li>
        ))}
      </ul>
    </div>
  )
}

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  onClose?: () => void
  autoClose?: number
}

/**
 * Toast notification
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  autoClose = 3000,
}) => {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, autoClose)
      return () => clearTimeout(timer)
    }
  }, [autoClose, onClose])

  const bgColor = {
    success: 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 border-green-300 dark:border-green-700',
    error: 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 border-red-300 dark:border-red-700',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 border-yellow-300 dark:border-yellow-700',
    info: 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border-blue-300 dark:border-blue-700',
  }

  return (
    <div className={`rounded-lg border p-4 ${bgColor[type]}`} role="alert">
      <p className="text-sm font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-lg opacity-70 hover:opacity-100"
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  )
}
