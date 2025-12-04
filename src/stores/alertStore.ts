import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Alert, AlertFilter, AlertSeverity, TimelineEvent } from '../types/enhanced'

// ============================================================================
// ALERT STORE - Alert management and notifications
// ============================================================================

interface AlertStore {
  // State
  alerts: Alert[]
  timeline: TimelineEvent[]
  filter: AlertFilter
  unreadCount: number
  
  // Actions
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'isRead' | 'isDismissed' | 'isSilenced'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  dismissAlert: (id: string) => void
  silenceAlert: (id: string) => void
  clearAlert: (id: string) => void
  clearAll: () => void
  setFilter: (filter: Partial<AlertFilter>) => void
  
  // Timeline
  addTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => void
  clearTimeline: () => void
  
  // Computed
  filteredAlerts: () => Alert[]
  criticalAlerts: () => Alert[]
  warningAlerts: () => Alert[]
  infoAlerts: () => Alert[]
  recentAlerts: (limit?: number) => Alert[]
}

export const useAlertStore = create<AlertStore>()(
  persist(
    immer((set, get) => ({
      // Initial state
      alerts: [],
      timeline: [],
      filter: {},
      unreadCount: 0,
      
      // Add new alert
      addAlert: (alertData) => {
        const newAlert: Alert = {
          ...alertData,
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          isRead: false,
          isDismissed: false,
          isSilenced: false,
        }
        
        set(state => {
          state.alerts.unshift(newAlert) // Add to beginning
          state.unreadCount++
          
          // Add to timeline
          state.timeline.unshift({
            id: `timeline_${Date.now()}`,
            deviceId: newAlert.deviceId,
            deviceName: newAlert.deviceName,
            type: 'alert',
            title: newAlert.title,
            description: newAlert.message,
            timestamp: newAlert.timestamp,
            icon: getSeverityIcon(newAlert.severity),
            color: getSeverityColor(newAlert.severity),
          })
          
          // Keep timeline manageable (max 500 events)
          if (state.timeline.length > 500) {
            state.timeline = state.timeline.slice(0, 500)
          }
        })
      },
      
      // Mark alert as read
      markAsRead: (id) => {
        set(state => {
          const alert = state.alerts.find(a => a.id === id)
          if (alert && !alert.isRead) {
            alert.isRead = true
            state.unreadCount = Math.max(0, state.unreadCount - 1)
          }
        })
      },
      
      // Mark all as read
      markAllAsRead: () => {
        set(state => {
          state.alerts.forEach(alert => {
            alert.isRead = true
          })
          state.unreadCount = 0
        })
      },
      
      // Dismiss alert
      dismissAlert: (id) => {
        set(state => {
          const alert = state.alerts.find(a => a.id === id)
          if (alert) {
            alert.isDismissed = true
            if (!alert.isRead) {
              state.unreadCount = Math.max(0, state.unreadCount - 1)
            }
          }
        })
      },
      
      // Silence alert
      silenceAlert: (id) => {
        set(state => {
          const alert = state.alerts.find(a => a.id === id)
          if (alert) {
            alert.isSilenced = true
          }
        })
      },
      
      // Clear (remove) alert
      clearAlert: (id) => {
        set(state => {
          const alert = state.alerts.find(a => a.id === id)
          if (alert && !alert.isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1)
          }
          state.alerts = state.alerts.filter(a => a.id !== id)
        })
      },
      
      // Clear all alerts
      clearAll: () => {
        set({
          alerts: [],
          unreadCount: 0,
        })
      },
      
      // Set filter
      setFilter: (newFilter) => {
        set(state => {
          state.filter = { ...state.filter, ...newFilter }
        })
      },
      
      // Add timeline event
      addTimelineEvent: (eventData) => {
        const newEvent: TimelineEvent = {
          ...eventData,
          id: `timeline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
        }
        
        set(state => {
          state.timeline.unshift(newEvent)
          
          // Keep timeline manageable
          if (state.timeline.length > 500) {
            state.timeline = state.timeline.slice(0, 500)
          }
        })
      },
      
      // Clear timeline
      clearTimeline: () => {
        set({ timeline: [] })
      },
      
      // Get filtered alerts
      filteredAlerts: () => {
        const { alerts, filter } = get()
        
        return alerts.filter(alert => {
          // Filter by severity
          if (filter.severity && filter.severity.length > 0) {
            if (!filter.severity.includes(alert.severity)) {
              return false
            }
          }
          
          // Filter by device
          if (filter.deviceId && alert.deviceId !== filter.deviceId) {
            return false
          }
          
          // Filter by read status
          if (filter.isRead !== undefined && alert.isRead !== filter.isRead) {
            return false
          }
          
          // Filter by date range
          if (filter.dateRange) {
            const alertDate = new Date(alert.timestamp).getTime()
            const startDate = new Date(filter.dateRange.start).getTime()
            const endDate = new Date(filter.dateRange.end).getTime()
            
            if (alertDate < startDate || alertDate > endDate) {
              return false
            }
          }
          
          // Don't show dismissed alerts by default
          if (alert.isDismissed) {
            return false
          }
          
          return true
        })
      },
      
      // Get critical alerts
      criticalAlerts: () => {
        return get().alerts.filter(a => a.severity === 'critical' && !a.isDismissed)
      },
      
      // Get warning alerts
      warningAlerts: () => {
        return get().alerts.filter(a => a.severity === 'warning' && !a.isDismissed)
      },
      
      // Get info alerts
      infoAlerts: () => {
        return get().alerts.filter(a => a.severity === 'info' && !a.isDismissed)
      },
      
      // Get recent alerts
      recentAlerts: (limit = 10) => {
        return get().alerts
          .filter(a => !a.isDismissed)
          .slice(0, limit)
      },
    })),
    {
      name: 'alert-storage',
      partialize: (state) => ({
        alerts: state.alerts,
        timeline: state.timeline,
        unreadCount: state.unreadCount,
      }),
    }
  )
)

// Helper functions
function getSeverityIcon(severity: AlertSeverity): string {
  switch (severity) {
    case 'critical':
      return '🔴'
    case 'warning':
      return '⚠️'
    case 'info':
      return 'ℹ️'
    default:
      return '📢'
  }
}

function getSeverityColor(severity: AlertSeverity): string {
  switch (severity) {
    case 'critical':
      return '#ef4444'
    case 'warning':
      return '#f59e0b'
    case 'info':
      return '#3b82f6'
    default:
      return '#6b7280'
  }
}

// Selector hooks
export const useUnreadCount = () => useAlertStore(state => state.unreadCount)
export const useCriticalAlerts = () => useAlertStore(state => state.criticalAlerts())
export const useFilteredAlerts = () => useAlertStore(state => state.filteredAlerts())
export const useRecentTimeline = (limit = 20) => useAlertStore(state => state.timeline.slice(0, limit))
