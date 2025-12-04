# SoilDash - Complete Repository Guide

## 🎯 What Is SoilDash?

SoilDash is a **production-ready local dashboard** for ESP32 soil moisture and environmental monitoring devices. It features:

- **Real-time telemetry** from ESP32 device
- **Historical charts** with time-range selection
- **Configurable alerts** with threshold detection
- **Mobile-responsive UI** with dark mode
- **Data export** (CSV) and backup
- **Optional Node.js proxy** for CORS handling
- **Demo mode** for testing without device
- **Full TypeScript** for type safety
- **Unit tests** included

## 📂 What Files You Get

This repository contains **23 complete files** ready to use:

### Frontend Files (React + Vite + TypeScript)

```
vite.config.ts                 - Build configuration
tsconfig.json                  - TypeScript settings
package.json                   - Dependencies
index.html                      - HTML entry point

src/main.tsx                   - React entry
src/App.tsx                    - Main app + routing
src/index.css                  - Global styles

src/components/
  ├── Layout.tsx              - Sidebar & header
  ├── TelemetryCard.tsx       - Metric displays
  ├── ChartsPanel.tsx         - Chart.js integration
  ├── Alerts.tsx              - Alert UI
  ├── EmptyState.tsx          - Empty/loading states
  └── TelemetryCard.test.tsx  - Component tests

src/pages/
  ├── Dashboard.tsx           - Real-time page
  ├── Charts.tsx              - Historical charts
  └── Settings.tsx            - Configuration

src/services/
  ├── api.ts                  - Fetch + retry logic
  └── localStorage.ts         - Settings storage

src/hooks/
  ├── useTelemetry.ts         - Polling hook
  └── useSettings.ts          - Settings management

src/types/
  └── telemetry.ts            - TypeScript types

src/utils/
  ├── formatting.ts           - Format & convert
  ├── mock.ts                 - Test data
  └── export.ts               - CSV export
```

### Proxy Files (Node.js + Express)

```
proxy/package.json             - Proxy dependencies
proxy/index.js                 - Proxy server
proxy/README.md                - Proxy documentation
```

### Configuration Files

```
tailwind.config.cjs            - Tailwind theming
postcss.config.cjs             - PostCSS config
vitest.config.ts               - Test configuration
tsconfig.node.json             - Node TypeScript config
.gitignore                      - Git ignore rules
```

### Setup Files

```
setup.sh                        - Linux/Mac setup
setup.bat                       - Windows setup
```

### Documentation

```
README.md                       - Main docs
QUICKSTART.md                   - Quick start guide
DEPLOYMENT.md                   - Production deployment
DEVICE_FIRMWARE_EXAMPLE.md     - ESP32 Arduino code
```

## 🚀 Complete Installation (Copy-Paste Ready)

### For Linux/Mac

```bash
# Clone repository (or download files)
cd soildash

# Run setup script
bash setup.sh

# Then run in terminals:
npm run dev                    # Terminal 1

cd proxy && node index.js      # Terminal 2 (optional)
```

### For Windows

```bash
# Download and extract files to C:\soildash

# Double-click setup.bat

# Then run in terminals:
npm run dev                    # Terminal 1

cd proxy && node index.js      # Terminal 2 (optional)
```

## 📋 File-by-File Breakdown

### Frontend Configuration

**package.json** - Lists all npm dependencies
- React, React Router, Chart.js
- Tailwind CSS, TypeScript
- Vite (build tool), Vitest (testing)

**vite.config.ts** - Build settings
- Port 5173 for dev server
- Proxy config for API calls

**tsconfig.json** - TypeScript compiler options
- Strict mode enabled
- ES2020 target

**tailwind.config.cjs** - Styling
- Custom plant color scheme (green)
- Dark mode support
- Custom shadows for cards

### Core Components

**Layout.tsx** (243 lines)
- Collapsible sidebar navigation
- Header with theme toggle
- Main content area
- Responsive mobile menu

**TelemetryCard.tsx** (120 lines)
- Displays single metric (temp/humidity/soil)
- Shows min/max from history
- Trend indicator (↑↓→)
- Alert styling for thresholds
- Loading skeleton

**ChartsPanel.tsx** (198 lines)
- Chart.js line charts
- Time range selector (1h/6h/24h/7d)
- Three metrics: temp, humidity, soil
- Fahrenheit conversion
- Responsive sizing

**Alerts.tsx** (85 lines)
- Alert badges (SAFE/DANGER status)
- Threshold violation notifications
- Toast notifications for feedback
- Auto-dismiss toasts

**EmptyState.tsx** (45 lines)
- Empty state placeholder UI
- Skeleton loaders
- CTA button support

### Services & Utilities

**api.ts** (65 lines)
- Fetch with retry & exponential backoff
- CORS error handling
- Data validation
- Configurable timeouts

**localStorage.ts** (50 lines)
- Settings persistence
- Default values
- Clear data function

**formatting.ts** (120 lines)
- Temperature unit conversion (°C ↔ °F)
- Number formatting with units
- Status color classes
- CSV generation
- Trend calculation

**mock.ts** (80 lines)
- Demo data generator
- Realistic sine-wave patterns
- Statistics calculation

### Hooks

**useTelemetry.ts** (95 lines)
- Polling interval management
- Retry logic integration
- History accumulation (288 points = 24h)
- Abort signal for cleanup

**useSettings.ts** (30 lines)
- Settings loading & saving
- localStorage integration
- Update helpers

### Pages

**Dashboard.tsx** (105 lines)
- Real-time telemetry display
- Current value cards
- Status indicator
- Alert detection
- Last update timestamp
- Device info stats

**Charts.tsx** (70 lines)
- Historical data visualization
- CSV export button
- Empty state when no data
- Time range selection

**Settings.tsx** (180 lines)
- Device IP configuration
- Polling interval slider
- Proxy toggle
- Demo mode toggle
- Temperature unit toggle
- Dark mode toggle
- Threshold configuration (6 inputs)
- Reset & clear data buttons

### Proxy Server

**proxy/index.js** (220 lines)
- Express app
- CORS handling
- Basic auth (optional)
- Rate limiting
- Device proxying
- Health check endpoint
- Request logging
- Error handling

## 🔄 Data Flow

```
Dashboard Page
    ↓
useTelemetry Hook
    ↓ (polling)
api.ts / fetchTelemetry()
    ↓
[Direct] http://192.168.4.1/data
    OR
[Proxy] http://localhost:3000/data → Device
    ↓
TelemetryData validated
    ↓
TelemetryCard displays → user sees real-time values
    ↓
history[] accumulates → ChartsPanel plots
```

## 🎨 Styling System

### Tailwind Customization

**Colors:**
- `plant-*` palette (green) - primary theme
- `gray-*` palette - neutral text/backgrounds
- `red-*` palette - danger/alerts
- `blue-*` palette - info
- Dark mode classes

**Components:**
- `.card` styles - rounded, bordered, shadowed
- `.hover:shadow-card-hover` - hover effect
- `.transition-all` - smooth animations

### Responsive Breakpoints

- `md:` - 768px and up
- Grid layouts adapt: 1 col mobile, 3 col desktop

## 🔧 Configuration Points

### Easy to Configure

1. **Device IP** - Settings page or `VITE_API_URL` env var
2. **Polling interval** - Settings page (100ms - 60s)
3. **Temperature units** - Settings page toggle
4. **Alert thresholds** - 6 settings per metric
5. **Proxy mode** - Settings page checkbox
6. **Demo mode** - Settings page checkbox
7. **Dark theme** - Header button or Settings

### Power User Configuration

**Environment variables** (create `.env`):
```env
VITE_API_URL=http://192.168.4.1
VITE_USE_PROXY=false
```

**Proxy server** (edit `proxy/index.js`):
- Device IP/port
- Proxy port
- Auth credentials
- Rate limiting

## 📊 State Management

### No external state management (by design)

- **Settings:** localStorage + useSettings hook
- **Telemetry:** useTelemetry hook + React state
- **UI state:** Component-level useState

### Why?

- Simpler code
- Faster to understand
- No Redux/Zustand overhead
- Suitable for this dashboard's scope

## 🧪 Testing

### Test File Included

**TelemetryCard.test.tsx** - 8 test cases:
- Renders temperature correctly
- Converts Fahrenheit
- Shows humidity percentage
- Displays min/max values
- Shows loading skeleton
- Applies alert styling

### Run Tests

```bash
npm run test              # Run once
npm run test:ui           # Interactive UI
npm run test -- --watch  # Watch mode
```

### Add More Tests

1. Create `Component.test.tsx` alongside component
2. Use Testing Library patterns (same as included test)
3. Use Vitest API (compatible with Jest)

## 🚀 Run Scenarios

### Scenario 1: Frontend Only (Simplest)

```bash
npm install
npm run dev
# Open http://localhost:5173
# Settings → Device IP: 192.168.4.1
```

Device must allow CORS or have special headers set.

### Scenario 2: Frontend + Proxy (Recommended)

```bash
# Terminal 1
npm install
npm run dev

# Terminal 2
cd proxy && npm install && node index.js
```

Proxy handles CORS automatically. More reliable.

### Scenario 3: Docker

```bash
docker-compose up
# http://localhost (frontend)
# http://localhost:3000 (proxy)
```

See DEPLOYMENT.md for Dockerfile contents.

### Scenario 4: Demo Mode (No Device)

```bash
npm run dev
# Go to Settings
# Check "Demo mode"
# Watch synthetic data generate
```

Perfect for UI testing without hardware.

## 📈 How to Extend

### Add New Metric (e.g., pH)

1. **Update types/telemetry.ts:**
   ```typescript
   export interface TelemetryData {
     // ... existing
     ph?: number  // Optional new field
   }
   ```

2. **Add to device firmware:** Return pH in JSON

3. **Add card to Dashboard.tsx:**
   ```typescript
   <TelemetryCard label="pH" value={data?.ph ?? 0} unit="soil" />
   ```

4. **Add to Charts:**
   ```typescript
   // In ChartsPanel.tsx
   const phData = { labels, datasets: [...] }
   // Add chart element
   ```

5. **Add to Settings thresholds:**
   ```typescript
   phMin: 6.0
   phMax: 7.5
   ```

### Add New Page

1. Create `src/pages/NewPage.tsx`
2. Add route in `App.tsx`
3. Add link in `Layout.tsx` sidebar

### Customize Colors

1. Edit `tailwind.config.cjs`
2. Modify plant color palette
3. Rebuild with `npm run build`

### Enable Authentication

1. Edit `proxy/index.js`
2. Set `ENABLE_AUTH=true`
3. Set `AUTH_USER` and `AUTH_PASSWORD`

## 🔒 Security Considerations

### Local Network

- Dashboard designed for internal use only
- No authentication by default (local network assumed safe)
- CORS blocking prevents external access

### For Shared Networks

- Enable proxy basic auth
- Set strong password
- Use HTTPS with reverse proxy (nginx)

### For Remote Access

- Never expose device directly to Internet
- Use VPN (Tailscale, WireGuard)
- Or SSH tunnel
- Or ngrok for temporary access

See DEPLOYMENT.md for detailed security setup.

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Cannot reach device" | Check device IP, enable Demo mode, verify network |
| CORS error | Use proxy server (recommended) |
| Port 5173 in use | Kill process or set `VITE_PORT=5174` |
| Port 3000 in use | Kill process or set `PROXY_PORT=3001` |
| Data not updating | Check polling interval, verify device JSON format |
| Threshold alerts always on | Adjust threshold values in Settings |
| No history/charts | Wait for data to accumulate, or enable Demo mode |

## 📚 Documentation Organization

- **README.md** - Overview, features, quick start
- **QUICKSTART.md** - 5-minute setup guide
- **DEPLOYMENT.md** - Production, Docker, HTTPS, security
- **DEVICE_FIRMWARE_EXAMPLE.md** - Arduino ESP32 code
- **proxy/README.md** - Proxy configuration details
- **Code comments** - Inline TypeScript annotations

## 💡 Pro Tips

### Development Speed

```bash
npm run dev              # Frontend with hot-reload
cd proxy && npm run dev  # Proxy with auto-restart
```

### Production Build

```bash
npm run build            # Creates dist/ folder
npm run preview          # Preview production build locally
```

### Type Safety

- All files use TypeScript (`.ts`, `.tsx`)
- Strict mode enabled
- No `any` types in core code

### Performance

- Code splitting (lazy routes)
- Chart.js lazy loaded
- Responsive images
- Minimal dependencies

## 🎓 Learning Resources

- **Chart.js:** https://www.chartjs.org/docs/latest/
- **React Router:** https://reactrouter.com/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Vite:** https://vitejs.dev/guide/
- **TypeScript:** https://www.typescriptlang.org/docs/

## ✅ Checklist for Getting Started

- [ ] Download/clone all files
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Test Demo mode (Settings → Demo mode: ON)
- [ ] Verify UI displays data
- [ ] Test export CSV
- [ ] Set up ESP32 device (see DEVICE_FIRMWARE_EXAMPLE.md)
- [ ] Configure device IP in Settings
- [ ] Verify live data appears
- [ ] Deploy to production (see DEPLOYMENT.md)

## 🤝 Contributing Tips

If extending this project:

1. Follow TypeScript patterns (strict types)
2. Add comments for complex logic
3. Test new components with Vitest
4. Use Tailwind classes (no inline CSS)
5. Keep files under 300 lines (refactor if needed)
6. Update types/telemetry.ts for new data
7. Update README if changing APIs

## 📞 Support

- **Quick start issues:** See QUICKSTART.md
- **Device firmware issues:** See DEVICE_FIRMWARE_EXAMPLE.md
- **Proxy issues:** See proxy/README.md
- **Deployment issues:** See DEPLOYMENT.md
- **Code issues:** Check component comments

---

**You now have everything needed to build and deploy a professional telemetry dashboard!** 🎉

Start with: `npm install` → `npm run dev`

Happy building! 🌱📊
