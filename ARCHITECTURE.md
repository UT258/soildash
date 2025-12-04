# VISUAL SETUP & ARCHITECTURE

## 🗂️ File Organization Diagram

```
soildash/
│
├── 📄 Configuration Layer
│   ├── package.json (dependencies)
│   ├── vite.config.ts (build)
│   ├── tsconfig.json (types)
│   └── tailwind.config.cjs (styling)
│
├── 🎨 Frontend React App (src/)
│   ├── main.tsx ─────────────────┐
│   ├── App.tsx (routing) ────────┤
│   ├── index.css (styles) ───────┤
│   │                              │ 🏗️ UI LAYER
│   ├── components/ ──────────────┤
│   │   ├── Layout (sidebar)      │
│   │   ├── TelemetryCard         │
│   │   ├── ChartsPanel (Chart.js)│
│   │   ├── Alerts (toasts)       │
│   │   └── EmptyState            │
│   │                              │
│   ├── pages/ ──────────────────┤
│   │   ├── Dashboard            │
│   │   ├── Charts               │
│   │   └── Settings             │
│   │                              │
│   ├── hooks/ ──────────────────┤
│   │   ├── useTelemetry (polling)│
│   │   └── useSettings (storage) │
│   │                              │
│   ├── services/ ───────────────┤
│   │   ├── api.ts (fetch)       │
│   │   └── localStorage.ts      │
│   │                              │
│   ├── types/ ──────────────────┤
│   │   └── telemetry.ts         │
│   │                              │
│   └── utils/ ──────────────────┤
│       ├── formatting (convert) │
│       ├── mock (demo data)     │
│       └── export (CSV)         │
│
├── 📡 Backend Proxy (proxy/)
│   ├── index.js (Express server)
│   └── package.json (deps)
│
└── 📚 Documentation
    ├── README.md
    ├── QUICKSTART.md
    ├── DEPLOYMENT.md
    ├── DEVICE_FIRMWARE_EXAMPLE.md
    ├── REPOSITORY_GUIDE.md
    └── FILE_MANIFEST.md
```

## 🔄 Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      User Browser                             │
│  (http://localhost:5173)                                      │
└────────────────────────┬─────────────────────────────────────┘
                         │
                    React App
                         │
          ┌──────────────┼──────────────┐
          │              │              │
     Dashboard        Charts         Settings
    (Real-time)    (Historical)   (Configuration)
          │              │              │
          └──────────────┴──────────────┘
                    │
           useTelemetry Hook
                    │
       (Polling every 1000ms)
                    │
        ┌───────────┴───────────┐
        │                       │
    [Direct Mode]         [Proxy Mode]
        │                       │
   (No CORS)              (CORS Handled)
        │                       │
    /api/data          /api/data (localhost:3000)
        │                       │
        └───────────┬───────────┘
                    │
        [Device Endpoint]
                    │
        http://192.168.4.1/data
                    │
            ┌───────┴────────┐
            │                │
        [Sensor 1]      [Sensor 2]
        (Temp/Hum)      (Soil)
```

## 🎛️ Component Hierarchy

```
<App>
  └─ <Layout>
      ├─ Header
      │   ├─ Menu toggle
      │   └─ Theme toggle
      │
      ├─ Sidebar
      │   ├─ Dashboard link
      │   ├─ Charts link
      │   └─ Settings link
      │
      └─ Main Content
          │
          ├─ <Dashboard> (Page)
          │   ├─ <StatusIndicator>
          │   ├─ <Alerts>
          │   └─ <TelemetryGrid>
          │       ├─ <TelemetryCard> temp
          │       ├─ <TelemetryCard> humidity
          │       └─ <TelemetryCard> soil
          │
          ├─ <Charts> (Page)
          │   ├─ Time range buttons
          │   └─ <ChartsPanel>
          │       ├─ Chart.js (Temp)
          │       ├─ Chart.js (Humidity)
          │       └─ Chart.js (Soil)
          │
          └─ <Settings> (Page)
              ├─ Device Configuration
              │   ├─ IP input
              │   ├─ Polling interval
              │   ├─ Proxy toggle
              │   └─ Demo mode toggle
              │
              ├─ Display Settings
              │   ├─ Fahrenheit toggle
              │   └─ Dark mode toggle
              │
              └─ Alert Thresholds
                  ├─ Temp min/max
                  ├─ Humidity min/max
                  └─ Soil min/max
```

## 🔌 Setup Scenarios

### Scenario 1: Direct to Device (Simplest)

```
┌─────────────────────┐
│   Browser React     │
│   (localhost:5173)  │
└──────────┬──────────┘
           │
      api.fetchTelemetry()
           │
    ┌──────┴──────┐
    │ CORS Error? │
    └──────┬──────┘
           │
    http://192.168.4.1/data
           │
    ┌──────┴──────────┐
    │  ESP32 Device   │
    │  JSON endpoint  │
    └─────────────────┘

⚠️ May have CORS issues
✅ Simplest setup
⏱️ Direct connection = lower latency
```

### Scenario 2: Via Proxy (Recommended)

```
┌─────────────────────┐
│   Browser React     │
│   (localhost:5173)  │
└──────────┬──────────┘
           │
      /api/data
           │
    ┌──────┴──────────────┐
    │  Express Proxy      │
    │  (localhost:3000)   │
    │                     │
    │  ├─ CORS headers    │
    │  ├─ Auth (optional) │
    │  ├─ Rate limiting   │
    │  └─ Logging         │
    └──────┬──────────────┘
           │
    http://192.168.4.1/data
           │
    ┌──────┴──────────┐
    │  ESP32 Device   │
    │  JSON endpoint  │
    └─────────────────┘

✅ CORS handled
✅ Reliable
✅ Scalable
⏱️ Tiny latency overhead
```

### Scenario 3: Demo Mode (No Device)

```
┌─────────────────────┐
│   Browser React     │
│   (localhost:5173)  │
└──────────┬──────────┘
           │
    useTelemetry Hook
           │
      (Check demoMode)
           │
    ┌──────┴──────────┐
    │  Mock Generator │
    │  (Sine waves)   │
    │  + Random data  │
    └──────┬──────────┘
           │
    TelemetryCard updates
    ChartsPanel plots
           │
    No device needed!
```

## 🏗️ Technology Stack Diagram

```
Frontend
├─ React 18 (UI framework)
├─ React Router (navigation)
├─ TypeScript (type safety)
├─ Vite (build tool)
├─ Tailwind CSS (styling)
├─ Chart.js (charts)
├─ Testing Library (tests)
└─ Vitest (test runner)

Backend (Optional)
├─ Node.js (runtime)
├─ Express (web framework)
├─ CORS (cross-origin)
└─ dotenv (config)

Target Devices
├─ ESP32 (microcontroller)
└─ Sensors (temp, hum, soil)
```

## 📊 State Management Flow

```
┌─────────────────────────────────┐
│      Global State (None)         │
│   ✨ All state local to hooks   │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│   useSettings Hook              │
│                                 │
│   ├─ loadSettings()             │
│   ├─ updateSettings()           │
│   ├─ updateThresholds()         │
│   └─ clearAllData()             │
│                                 │
│   Storage: localStorage         │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│   useTelemetry Hook             │
│                                 │
│   ├─ Data polling (1000ms)      │
│   ├─ Retry with backoff         │
│   ├─ History accumulation (288) │
│   └─ Error handling             │
│                                 │
│   Storage: Component state      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│   Component Local State         │
│                                 │
│   ├─ UI toggles                 │
│   ├─ Form inputs                │
│   ├─ Toast messages             │
│   └─ Loading states             │
└─────────────────────────────────┘
```

## 📈 Data Accumulation

```
Device polling every 1000ms:

Time:   1s    2s    3s    4s    5s ...
Data:   [1]  [2]  [3]  [4]  [5] ...
          │    │    │    │    │
History:  []  [1] [1,2] [1,2,3] [1,2,3,4] ...
          │    │    │    │    │
Max:     288 points (24 hours @ 5min intervals)
         or 12 hours @ 2.5min intervals
         or 6 hours @ 1.25min intervals

When full (288 items):
  New reading added → oldest removed (FIFO)

Charts display:
  ├─ 1h range: last 60 points
  ├─ 6h range: last 360 points (or all if less)
  ├─ 24h range: all 288 points
  └─ 7d range: all available
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│         Browser Layer                    │
│  - React runs in browser sandbox         │
│  - No sensitive data in localStorage     │
│  - HTTPS in production                   │
└─────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────┐
│    Network Layer (via Proxy)             │
│  - CORS headers prevent external access  │
│  - Optional basic auth                   │
│  - Rate limiting (100 req/min default)   │
│  - Firewall rules (localhost only)       │
└─────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────┐
│      Device Layer                        │
│  - Local network only                    │
│  - No Internet exposure                  │
│  - Private IP range                      │
└─────────────────────────────────────────┘
```

## 🚀 Deployment Architecture

```
Development:
  laptop:5173 ──→ Device
              └─→ Proxy (optional)

Production (Docker):
  nginx:80 ──→ React frontend (dist/)
           └─→ :3000 Proxy container
               └─→ Device

Production (Cloud):
  CDN ──→ S3 / Netlify / Vercel (frontend)
  └────→ Lambda / EC2 (proxy, if needed)
         └──→ Device (via tunnel/VPN)
```

---

**Visual guide complete!** 📊

Use this as reference when:
- Understanding data flow
- Explaining to team
- Debugging issues
- Planning extensions
