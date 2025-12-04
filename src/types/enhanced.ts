// ============================================================================
// ENHANCED TYPE DEFINITIONS FOR ENTERPRISE IOT DASHBOARD
// ============================================================================

// Base Telemetry Data
export interface TelemetryData {
  temp: number
  hum: number
  soil: number
  status: DeviceStatus
  ts: string
}

// Extended Telemetry with Additional Sensors
export interface ExtendedTelemetryData extends TelemetryData {
  light?: number  // Lux
  ph?: number     // pH level
  ec?: number     // Electrical conductivity (μS/cm)
  battery?: number // Battery percentage
  rssi?: number   // Signal strength
}

// Device Status
export type DeviceStatus = 'SAFE' | 'WARNING' | 'DANGER' | 'OFFLINE' | 'UNKNOWN'

// Connection Quality
export type ConnectionQuality = 'excellent' | 'good' | 'poor' | 'disconnected'

// Device Information
export interface Device {
  id: string
  name: string
  type: 'greenhouse' | 'garden' | 'indoor' | 'outdoor' | 'custom'
  ipAddress: string
  status: DeviceStatus
  connectionQuality: ConnectionQuality
  lastSeen: string
  firmware: string
  location?: {
    lat?: number
    lng?: number
    name?: string
  }
  settings: DeviceSettings
  metadata?: Record<string, any>
}

// Device Settings
export interface DeviceSettings {
  pollingInterval: number
  useProxy: boolean
  enableAlerts: boolean
  enableSound: boolean
  thresholds: AlertThresholds
}

// Alert Thresholds
export interface AlertThresholds {
  temp: { min: number; max: number }
  hum: { min: number; max: number }
  soil: { min: number; max: number }
  light?: { min: number; max: number }
  ph?: { min: number; max: number }
}

// Alert System
export interface Alert {
  id: string
  deviceId: string
  deviceName: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  value?: number
  threshold?: number
  timestamp: string
  isRead: boolean
  isDismissed: boolean
  isSilenced: boolean
  icon?: string
}

export type AlertType = 
  | 'temperature_high'
  | 'temperature_low'
  | 'humidity_high'
  | 'humidity_low'
  | 'soil_dry'
  | 'soil_wet'
  | 'battery_low'
  | 'connection_lost'
  | 'anomaly_detected'
  | 'custom'

export type AlertSeverity = 'critical' | 'warning' | 'info'

export interface AlertFilter {
  severity?: AlertSeverity[]
  deviceId?: string
  dateRange?: {
    start: string
    end: string
  }
  isRead?: boolean
}

// Event Timeline
export interface TimelineEvent {
  id: string
  deviceId: string
  deviceName: string
  type: 'alert' | 'status_change' | 'data_received' | 'connection' | 'user_action'
  title: string
  description?: string
  timestamp: string
  icon: string
  color: string
}

// Statistics
export interface TelemetryStats {
  current: number
  min: number
  max: number
  avg: number
  trend: 'up' | 'down' | 'stable'
  trendValue: number // Percentage change
  sparklineData: number[]
}

// Historical Data
export interface HistoricalData {
  deviceId: string
  timeRange: TimeRange
  readings: TelemetryData[]
  aggregated?: AggregatedData[]
}

export interface AggregatedData {
  timestamp: string
  temp: { min: number; max: number; avg: number }
  hum: { min: number; max: number; avg: number }
  soil: { min: number; max: number; avg: number }
}

export type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d' | 'custom'

export interface CustomTimeRange {
  start: string
  end: string
}

// Predictions
export interface Prediction {
  metric: 'temp' | 'hum' | 'soil'
  type: 'forecast' | 'anomaly' | 'recommendation'
  value?: number
  timeToEvent?: number // Minutes until event
  confidence: 'low' | 'medium' | 'high'
  message: string
  icon?: string
}

// Recommendations
export interface Recommendation {
  id: string
  deviceId: string
  type: 'action' | 'maintenance' | 'alert_config' | 'general'
  priority: 'low' | 'medium' | 'high'
  title: string
  description: string
  action?: {
    label: string
    callback: () => void
  }
  icon: string
  timestamp: string
}

// Real-time State
export interface RealtimeState {
  isConnected: boolean
  connectionQuality: ConnectionQuality
  latestReading: ExtendedTelemetryData | null
  streamingHistory: ExtendedTelemetryData[]
  isPaused: boolean
  fps: number
  lastUpdate: string
}

// User Settings
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  themeStyle: 'default' | 'glass' | 'neuro'
  enableAnimations: boolean
  enableSound: boolean
  enableNotifications: boolean
  enableVoice: boolean
  defaultTimeRange: TimeRange
  refreshInterval: number
  locale: string
  temperatureUnit: 'C' | 'F'
  dashboardLayout?: DashboardLayout
}

// Dashboard Layout
export interface DashboardLayout {
  widgets: WidgetConfig[]
}

export interface WidgetConfig {
  id: string
  type: 'kpi' | 'chart' | 'device' | 'alerts' | 'timeline' | 'prediction' | '3d'
  position: { x: number; y: number }
  size: { w: number; h: number }
  config: Record<string, any>
}

// Export Options
export interface ExportConfig {
  format: 'csv' | 'json' | 'pdf' | 'png'
  timeRange: TimeRange | CustomTimeRange
  metrics: string[]
  includeStats: boolean
  includeCharts: boolean
}

// WebSocket Messages
export interface WebSocketMessage {
  type: 'telemetry' | 'alert' | 'status' | 'command' | 'response'
  deviceId: string
  payload: any
  timestamp: string
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  timestamp: string
}

// OTA Update (UI Mock)
export interface OTAUpdate {
  deviceId: string
  currentVersion: string
  availableVersion: string
  releaseNotes: string
  downloadUrl: string
  isCompatible: boolean
  status: 'available' | 'downloading' | 'installing' | 'completed' | 'failed'
  progress?: number
}

// Calibration
export interface CalibrationData {
  deviceId: string
  sensor: 'temp' | 'hum' | 'soil' | 'ph' | 'ec'
  steps: CalibrationStep[]
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
}

export interface CalibrationStep {
  id: string
  instruction: string
  expectedValue?: number
  measuredValue?: number
  isCompleted: boolean
}

// Anomaly Detection
export interface Anomaly {
  id: string
  deviceId: string
  metric: string
  value: number
  expectedValue: number
  deviation: number
  confidence: number
  timestamp: string
  isConfirmed: boolean
}

// Chart Configuration
export interface ChartConfig {
  type: 'line' | 'bar' | 'scatter' | 'heatmap'
  metrics: string[]
  timeRange: TimeRange
  showLegend: boolean
  showGrid: boolean
  showTooltip: boolean
  smooth: boolean
  fill: boolean
  colors?: string[]
}

// Voice Command
export interface VoiceCommand {
  command: string
  intent: 'query' | 'action' | 'navigation'
  entities: Record<string, any>
  confidence: number
}

// Notification Preferences
export interface NotificationPreferences {
  enabled: boolean
  sound: boolean
  vibration: boolean
  desktop: boolean
  email: boolean
  push: boolean
  filters: {
    severity: AlertSeverity[]
    devices: string[]
  }
}

// Offline Queue
export interface QueuedRequest {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  data?: any
  timestamp: string
  retryCount: number
}

// Toast Notification
export interface ToastConfig {
  id?: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Modal Props
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

// Form Field
export interface FormField {
  name: string
  label: string
  type: 'text' | 'number' | 'select' | 'switch' | 'slider' | 'date'
  value: any
  onChange: (value: any) => void
  options?: Array<{ label: string; value: any }>
  min?: number
  max?: number
  step?: number
  required?: boolean
  error?: string
  helperText?: string
}

// Loading State
export interface LoadingState {
  isLoading: boolean
  progress?: number
  message?: string
}

// Error State
export interface ErrorState {
  hasError: boolean
  error?: Error
  message?: string
  code?: string
}

// Pagination
export interface Pagination {
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

// Search/Filter State
export interface SearchState {
  query: string
  filters: Record<string, any>
  sort: {
    field: string
    direction: 'asc' | 'desc'
  }
}
