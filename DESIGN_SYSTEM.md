# 🎨 Design System & Architecture
## Enterprise-Grade IoT Dashboard UI

---

## 🌈 Color System

### Brand Colors
```typescript
const colors = {
  // Primary - Plant/Growth Theme
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main brand
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Semantic Colors
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  
  // Status Colors
  online: '#22c55e',
  offline: '#6b7280',
  warning: '#f59e0b',
  critical: '#dc2626',
  
  // Data Visualization Palette
  charts: {
    temp: '#ef4444',      // Red
    humidity: '#3b82f6',  // Blue
    soil: '#8b5cf6',      // Purple
    light: '#f59e0b',     // Amber
    ph: '#06b6d4',        // Cyan
    ec: '#ec4899',        // Pink
  },
}
```

### Dark Mode Colors
```typescript
const darkColors = {
  background: {
    primary: '#0a0a0a',
    secondary: '#121212',
    tertiary: '#1a1a1a',
    elevated: '#1f1f1f',
  },
  
  surface: {
    base: '#141414',
    elevated: '#1f1f1f',
    overlay: '#2a2a2a',
  },
  
  border: {
    subtle: 'rgba(255, 255, 255, 0.05)',
    default: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.2)',
  },
}
```

---

## 🎭 Theme System

### Glassmorphism
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```

### Neumorphism (Optional)
```css
.neuro-light {
  background: #e0e5ec;
  box-shadow: 
    9px 9px 16px rgba(163, 177, 198, 0.6),
    -9px -9px 16px rgba(255, 255, 255, 0.5);
}

.neuro-dark {
  background: #2a2a2a;
  box-shadow:
    9px 9px 16px rgba(0, 0, 0, 0.4),
    -9px -9px 16px rgba(60, 60, 60, 0.1);
}
```

---

## 📐 Spacing & Layout

### Grid System
```typescript
const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
}

const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}
```

### Container Widths
```typescript
const containers = {
  'dashboard-sidebar': '280px',
  'dashboard-sidebar-collapsed': '72px',
  'content-max': '1400px',
  'widget-card': '100%',
  'modal-sm': '400px',
  'modal-md': '600px',
  'modal-lg': '900px',
}
```

---

## ✨ Animation System

### Timing Functions
```typescript
const easing = {
  // Material Design easing
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
  
  // Custom easing
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
}

const duration = {
  instant: '100ms',
  fast: '200ms',
  normal: '300ms',
  slow: '500ms',
  slower: '800ms',
}
```

### Framer Motion Presets
```typescript
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
}

export const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeOut' }
}

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { duration: 0.2 }
}

export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
}

export const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'linear'
  }
}
```

---

## 🎯 Component Architecture

### Component Hierarchy
```
App
├── Layout
│   ├── Sidebar (collapsible)
│   ├── TopNav (device picker, status, settings)
│   └── MainContent
│       └── Routes
│           ├── Dashboard (Overview)
│           ├── LiveMonitor (Real-time streaming)
│           ├── Analytics (Historical data)
│           ├── Devices (Multi-device management)
│           ├── Alerts (Alert system)
│           └── Settings (Configuration)
├── Providers
│   ├── ThemeProvider (dark/light/auto)
│   ├── WebSocketProvider (real-time data)
│   ├── DeviceProvider (multi-device state)
│   ├── AlertProvider (notifications)
│   └── SettingsProvider (user preferences)
└── GlobalComponents
    ├── Toast (notifications)
    ├── Modal (dialogs)
    ├── ConfirmDialog
    └── LoadingOverlay
```

---

## 📦 State Management Plan

### Real-time State (Zustand + WebSocket)
```typescript
interface RealtimeStore {
  // Connection state
  isConnected: boolean
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected'
  
  // Live data
  latestReading: TelemetryData | null
  streamingHistory: TelemetryData[] // Last 100 readings
  
  // Live controls
  isPaused: boolean
  pauseStreaming: () => void
  resumeStreaming: () => void
  
  // Actions
  connect: (deviceId: string) => void
  disconnect: () => void
}
```

### Historical State (React Query)
```typescript
// Historical data fetched on-demand with caching
const { data: historicalData } = useQuery({
  queryKey: ['telemetry', deviceId, timeRange],
  queryFn: () => fetchHistoricalData(deviceId, timeRange),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
})
```

### Device Management State
```typescript
interface DeviceStore {
  devices: Device[]
  selectedDevice: Device | null
  
  // CRUD operations
  addDevice: (device: Device) => Promise<void>
  updateDevice: (id: string, updates: Partial<Device>) => Promise<void>
  removeDevice: (id: string) => Promise<void>
  selectDevice: (id: string) => void
  
  // Bulk operations
  syncDevices: () => Promise<void>
  getDeviceStatus: (id: string) => DeviceStatus
}
```

### Alert State
```typescript
interface AlertStore {
  alerts: Alert[]
  unreadCount: number
  
  // Alert management
  addAlert: (alert: Alert) => void
  markAsRead: (id: string) => void
  dismissAlert: (id: string) => void
  clearAll: () => void
  
  // Filtering
  filter: AlertFilter
  setFilter: (filter: AlertFilter) => void
}
```

---

## 🏗️ Page Structure

### 1. Dashboard (Overview)
**Purpose**: High-level overview of all devices and key metrics

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ Summary Stats Row (4 KPI cards with sparklines)│
├─────────────────────────────────────────────────┤
│ Active Alerts Panel    │ Quick Actions          │
├────────────────────────┼────────────────────────┤
│ Device Grid (6 cards with mini charts)          │
├─────────────────────────────────────────────────┤
│ Recent Events Timeline │ Recommendations        │
└─────────────────────────────────────────────────┘
```

### 2. Live Monitor
**Purpose**: Real-time streaming view with live updates

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ LIVE Badge | Device Selector | Pause/Resume    │
├─────────────────────────────────────────────────┤
│ Large KPI Cards (3-4 with animated numbers)     │
├─────────────────────────────────────────────────┤
│ Auto-scrolling Live Chart (last 60 seconds)     │
├─────────────────────────────────────────────────┤
│ 3D Visualization    │ Live Event Feed          │
└─────────────────────────────────────────────────┘
```

### 3. Analytics
**Purpose**: Historical data analysis and insights

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ Time Range Selector + Export Options           │
├─────────────────────────────────────────────────┤
│ Combined Multi-Sensor Chart (temp/hum/soil)    │
├─────────────────────────────────────────────────┤
│ Individual Sensor Charts (3 columns)            │
├─────────────────────────────────────────────────┤
│ Heatmap View        │ Statistics Panel         │
└─────────────────────────────────────────────────┘
```

### 4. Devices
**Purpose**: Multi-device management interface

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ Add Device Button | Search | Filter | View Mode│
├─────────────────────────────────────────────────┤
│ Device Cards Grid (with status, last-seen)      │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐              │
│ │ Dev1│ │ Dev2│ │ Dev3│ │ Dev4│              │
│ └─────┘ └─────┘ └─────┘ └─────┘              │
├─────────────────────────────────────────────────┤
│ Selected Device Details (expanded panel)        │
└─────────────────────────────────────────────────┘
```

### 5. Alerts
**Purpose**: Alert management and event timeline

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ Filter Tabs: All | Critical | Warning | Info   │
├─────────────────────────────────────────────────┤
│ Alert Cards (with icons, timestamps, actions)   │
│ ┌───────────────────────────────────────────┐  │
│ │ 🔴 Critical: High Temperature             │  │
│ │ Device: Greenhouse-01 • 2 min ago         │  │
│ │ [Dismiss] [View Details] [Silence]        │  │
│ └───────────────────────────────────────────┘  │
├─────────────────────────────────────────────────┤
│ Timeline View (chronological event feed)        │
└─────────────────────────────────────────────────┘
```

### 6. Settings
**Purpose**: Configuration and preferences

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ Settings Tabs: General | Devices | Alerts      │
├─────────────────────────────────────────────────┤
│ Theme Selector (Light/Dark/Auto)                │
│ Feature Toggles (Live Mode, Sounds, etc.)       │
│ Polling Interval Slider                         │
│ Threshold Configuration (with preview)          │
│ Cloud/Local Mode Switch                         │
│ Advanced Settings (collapsed)                   │
└─────────────────────────────────────────────────┘
```

---

## 🎨 Visual Effects

### Skeleton Loaders
```typescript
<div className="animate-pulse">
  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
</div>
```

### Shimmer Effect
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

### Number Counter Animation
```typescript
import { animate } from 'framer-motion'

const animateValue = (start: number, end: number, duration: number) => {
  const controls = animate(start, end, {
    duration,
    onUpdate: (latest) => setValue(latest.toFixed(1))
  })
  return controls
}
```

---

## 📊 Chart Configurations

### Live Streaming Chart
```typescript
const liveChartOptions = {
  animation: {
    duration: 0, // No animation for live data
  },
  scales: {
    x: {
      type: 'realtime',
      realtime: {
        duration: 60000, // 60 seconds
        refresh: 1000,   // 1 second
        delay: 0,
        onRefresh: (chart) => {
          chart.data.datasets[0].data.push({
            x: Date.now(),
            y: latestValue
          })
        }
      }
    }
  },
  plugins: {
    streaming: {
      frameRate: 30 // 30 FPS
    }
  }
}
```

### Multi-Sensor Combined Chart
```typescript
const combinedChartOptions = {
  scales: {
    yTemp: {
      type: 'linear',
      position: 'left',
      title: { text: 'Temperature (°C)', display: true }
    },
    yHumidity: {
      type: 'linear',
      position: 'right',
      title: { text: 'Humidity (%)', display: true }
    }
  },
  interaction: {
    mode: 'index',
    intersect: false
  }
}
```

---

## 🔌 WebSocket Integration

### Connection Management
```typescript
class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  
  connect(url: string) {
    this.ws = new WebSocket(url)
    
    this.ws.onopen = () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    }
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      // Emit to subscribers
      this.emit('data', data)
    }
    
    this.ws.onclose = () => {
      this.handleReconnect()
    }
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }
  
  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++
        this.connect(this.url)
      }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts))
    }
  }
}
```

---

## 🎯 Performance Optimization

### Virtual Scrolling for Device Lists
```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

const DeviceList = ({ devices }) => {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtualizer({
    count: devices.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated row height
    overscan: 5 // Render 5 extra items
  })
  
  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <DeviceCard key={virtualRow.key} device={devices[virtualRow.index]} />
        ))}
      </div>
    </div>
  )
}
```

### Debounced Search
```typescript
import { useDebouncedCallback } from 'use-debounce'

const debounced = useDebouncedCallback((value) => {
  setSearchQuery(value)
}, 300)
```

### Lazy Loading Components
```typescript
const LiveMonitor = lazy(() => import('./pages/LiveMonitor'))
const Analytics = lazy(() => import('./pages/Analytics'))
const ThreeD = lazy(() => import('./components/ThreeD'))
```

---

## 📱 Responsive Design

### Mobile-First Breakpoints
```typescript
const responsive = {
  // Sidebar collapses to drawer on mobile
  sidebar: 'hidden lg:flex',
  
  // Grid layouts adapt
  deviceGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  
  // Charts stack on mobile
  chartGrid: 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
  
  // Font sizes scale
  heading: 'text-2xl sm:text-3xl lg:text-4xl',
}
```

---

## 🚀 Tech Stack Recommendations

### Core Framework
- **React 18.2** - Concurrent features, Suspense
- **TypeScript 5.2** - Type safety
- **Vite 5.0** - Lightning-fast builds

### UI Libraries
- **Tailwind CSS 3.4** - Utility-first styling
- **Framer Motion 11** - Advanced animations
- **Radix UI** - Accessible components
- **Lucide React** - Modern icon library

### Data & State
- **Zustand** - Lightweight state management
- **React Query (TanStack Query)** - Data fetching & caching
- **Immer** - Immutable state updates

### Real-time
- **WebSocket** - Native browser API
- **Socket.io Client** - Fallback with polling

### Charts & Visualization
- **Chart.js 4.4** - 2D charts
- **react-chartjs-2** - React wrapper
- **chartjs-plugin-streaming** - Live charts
- **Recharts** - Declarative charts (alternative)
- **Three.js + React Three Fiber** - 3D visualization

### Utilities
- **date-fns** - Date manipulation
- **numeral** - Number formatting
- **react-hot-toast** - Toast notifications
- **react-use** - Useful hooks
- **@tanstack/react-virtual** - Virtual scrolling

### Testing
- **Vitest** - Unit tests
- **Testing Library** - Component tests
- **Playwright** - E2E tests

### PWA
- **Vite PWA Plugin** - Service worker generation
- **Workbox** - Offline caching strategies

---

## 🎭 Accessibility (WCAG 2.1 AA)

### Requirements
- ✅ Keyboard navigation (Tab, Shift+Tab, Arrow keys)
- ✅ ARIA labels and roles
- ✅ Focus indicators (visible focus ring)
- ✅ Color contrast > 4.5:1 for text
- ✅ Screen reader support
- ✅ Alt text for images
- ✅ Skip to content link
- ✅ Reduced motion support

### Implementation
```typescript
// Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const animation = prefersReducedMotion ? { duration: 0 } : {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
}
```

---

## 📦 File Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── ...
│   ├── charts/          # Chart components
│   │   ├── LiveChart.tsx
│   │   ├── HistoricalChart.tsx
│   │   ├── Heatmap.tsx
│   │   └── Sparkline.tsx
│   ├── kpi/             # KPI cards
│   │   ├── KPICard.tsx
│   │   ├── TrendIndicator.tsx
│   │   └── MiniSparkline.tsx
│   ├── alerts/          # Alert system
│   │   ├── AlertCard.tsx
│   │   ├── AlertList.tsx
│   │   ├── Timeline.tsx
│   │   └── StatusBadge.tsx
│   ├── devices/         # Device management
│   │   ├── DeviceCard.tsx
│   │   ├── DeviceGrid.tsx
│   │   ├── DeviceDetail.tsx
│   │   └── AddDeviceModal.tsx
│   ├── three/           # 3D components
│   │   ├── GreenhouseModel.tsx
│   │   ├── SensorMarker.tsx
│   │   └── Scene.tsx
│   └── layout/          # Layout components
│       ├── Sidebar.tsx
│       ├── TopNav.tsx
│       ├── PageHeader.tsx
│       └── WidgetContainer.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── LiveMonitor.tsx
│   ├── Analytics.tsx
│   ├── Devices.tsx
│   ├── Alerts.tsx
│   └── Settings.tsx
├── hooks/
│   ├── useWebSocket.ts
│   ├── useDevices.ts
│   ├── useAlerts.ts
│   ├── useTelemetry.ts
│   ├── useTheme.ts
│   └── usePredictions.ts
├── stores/
│   ├── realtimeStore.ts
│   ├── deviceStore.ts
│   ├── alertStore.ts
│   └── settingsStore.ts
├── services/
│   ├── api.ts
│   ├── websocket.ts
│   ├── ml.ts
│   └── export.ts
├── utils/
│   ├── formatting.ts
│   ├── calculations.ts
│   ├── predictions.ts
│   └── validators.ts
├── types/
│   ├── telemetry.ts
│   ├── device.ts
│   ├── alert.ts
│   └── index.ts
└── styles/
    ├── globals.css
    └── animations.css
```

---

This design system provides the foundation for the entire rebuild. Next, I'll implement the actual components and features!
