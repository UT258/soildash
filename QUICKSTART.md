# SOILDASH - Complete Installation & Quick Start

## 📦 What You're Getting

A complete, production-ready dashboard for ESP32 telemetry devices featuring:

✅ **Frontend**
- React 18 + Vite + TypeScript
- Tailwind CSS with plant theme & dark mode
- Real-time telemetry monitoring
- Chart.js historical data visualization
- Configurable alerts & thresholds
- CSV export
- localStorage persistence
- Responsive mobile-friendly UI

✅ **Backend Proxy** (Optional)
- Express.js proxy for CORS handling
- Basic authentication support
- Rate limiting
- Device health monitoring
- Ready for WebSocket/SSE upgrades

✅ **Features**
- Auto-retry with exponential backoff
- Demo mode for testing without device
- Unit tests (Vitest)
- Full TypeScript support
- Accessibility (ARIA, keyboard nav)

## 🚀 Quick Start (5 Minutes)

### Step 1: Clone or Download Repository

```bash
cd /path/to/soildash
```

### Step 2: Frontend Setup

```bash
npm install
npm run dev
```

Opens `http://localhost:5173` - Frontend ready!

### Step 3: Optional - Proxy Setup

In a new terminal:

```bash
cd proxy
npm install
node index.js
```

Proxy runs on `http://localhost:3000`

### Step 4: Configure Device

1. Open http://localhost:5173 → Settings
2. Enter device IP: `192.168.4.1` (or your ESP32 IP)
3. Ensure proxy checkbox is OFF if not running proxy
4. Save settings

### Step 5: Test with Demo Data

No ESP32 available? Test the UI:

1. Settings → Enable "Demo mode"
2. Watch data generate automatically
3. Charts populate in real-time

## 📋 File Structure

```
soildash/
├── README.md                          # Main documentation
├── DEPLOYMENT.md                      # Production deployment guide
├── DEVICE_FIRMWARE_EXAMPLE.md        # ESP32 code example
├── package.json                       # Frontend dependencies
├── vite.config.ts                     # Vite configuration
├── tailwind.config.cjs                # Tailwind theming
├── tsconfig.json                      # TypeScript config
├── vitest.config.ts                   # Test configuration
├── index.html                         # Entry HTML
│
├── src/
│   ├── main.tsx                       # React entry point
│   ├── App.tsx                        # Main app + routing
│   ├── index.css                      # Global Tailwind styles
│   │
│   ├── components/
│   │   ├── Layout.tsx                 # Sidebar + header
│   │   ├── TelemetryCard.tsx          # Metric cards
│   │   ├── ChartsPanel.tsx            # Chart.js integration
│   │   ├── Alerts.tsx                 # Alert UI + toasts
│   │   ├── EmptyState.tsx             # Empty/loading states
│   │   └── TelemetryCard.test.tsx     # Component tests
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx              # Real-time monitoring
│   │   ├── Charts.tsx                 # Historical data + export
│   │   └── Settings.tsx               # Configuration UI
│   │
│   ├── services/
│   │   ├── api.ts                     # Device fetch + retry logic
│   │   └── localStorage.ts            # Settings persistence
│   │
│   ├── hooks/
│   │   ├── useTelemetry.ts            # Polling hook
│   │   └── useSettings.ts             # Settings hook
│   │
│   ├── types/
│   │   └── telemetry.ts               # TypeScript interfaces
│   │
│   └── utils/
│       ├── formatting.ts              # Unit conversion, formatting
│       ├── mock.ts                    # Demo data generator
│       └── export.ts                  # CSV export helper
│
├── proxy/
│   ├── package.json                   # Proxy dependencies
│   ├── index.js                       # Express proxy server
│   └── README.md                      # Proxy documentation
│
├── setup.sh                           # Linux/Mac setup
└── setup.bat                          # Windows setup
```

## 🔌 Device Requirements

Your ESP32 must serve JSON at `http://<YOUR_IP>/data`:

```json
{
  "temp": 23.5,        // Temperature in Celsius
  "hum": 65.2,         // Humidity as percentage
  "soil": 78.4,        // Soil moisture as percentage
  "status": "SAFE",    // "SAFE" or "DANGER"
  "ts": "2025-12-04T10:30:45.123Z"  // ISO8601 timestamp
}
```

**Example Arduino sketch provided in `DEVICE_FIRMWARE_EXAMPLE.md`**

## ⚙️ Configuration

### Frontend Environment

Create `.env` (optional):

```env
VITE_API_URL=http://192.168.4.1
VITE_USE_PROXY=false
```

Or use Settings page (recommended) - persisted to localStorage.

### Proxy Configuration

Edit `proxy/index.js` or set environment variables:

```env
DEVICE_IP=192.168.4.1
DEVICE_PORT=80
PROXY_PORT=3000
ENABLE_AUTH=false              # Set to "true" for basic auth
AUTH_USER=admin
AUTH_PASSWORD=password
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100
```

## 🎯 Usage Scenarios

### Scenario 1: Direct to Device (No Proxy)

Use this for quick testing on local network:

```bash
npm run dev
# Frontend on http://localhost:5173
# Settings → Device IP: 192.168.4.1, Proxy: OFF
```

**Pros:** Simple, one terminal  
**Cons:** CORS issues, less reliable

### Scenario 2: Proxy (Recommended)

Use this for production or shared networks:

```bash
# Terminal 1
npm run dev

# Terminal 2
cd proxy && node index.js
```

**Pros:** Reliable, CORS handled, secure  
**Cons:** Requires 2 terminals during dev

### Scenario 3: Docker

```bash
docker-compose up -d
# Frontend on http://localhost:80
# Proxy on http://localhost:3000
```

See `DEPLOYMENT.md` for full Docker setup.

### Scenario 4: Demo Mode (No Device)

Test without ESP32:

1. `npm run dev`
2. Settings → Demo mode: ON
3. Watch synthetic data generate

## 📊 Features Deep Dive

### Real-Time Monitoring

- **Polling interval:** Configurable (default 1000ms)
- **Retry logic:** Exponential backoff up to 5s
- **Display:** Current value, min/max, trend indicator
- **Status:** Visual badge (SAFE/DANGER)

### Historical Charts

- **Chart.js:** Responsive line charts
- **Time ranges:** 1h, 6h, 24h, 7d
- **Metrics:** Temperature, humidity, soil moisture
- **Export:** CSV download

### Alerts & Thresholds

- **Per-metric:** Configurable min/max values
- **Visual alerts:** Red card + notification toast
- **Status monitoring:** DANGER detection
- **Browser notifications:** Optional (future enhancement)

### Settings Management

Persisted to localStorage:
- Device IP & polling interval
- Temperature units (°C/°F)
- Dark mode toggle
- Alert thresholds
- Proxy mode enable/disable
- Demo mode toggle

## 🧪 Testing

Run tests:

```bash
npm run test

# With UI
npm run test:ui
```

Example test included for TelemetryCard component using Vitest + Testing Library.

## 🔒 Security

### Local Network

- Designed for internal networks only
- No authentication required by default
- CORS proxying prevents external access

### Proxy Authentication

Enable for shared networks:

```bash
# In proxy/.env or environment
ENABLE_AUTH=true
AUTH_USER=admin
AUTH_PASSWORD=your_secure_password
```

Use with curl:
```bash
curl -u admin:your_secure_password http://localhost:3000/data
```

### Remote Access

**Option A: VPN** (Recommended)
```bash
# Tailscale
tailscale up
# Access via tailscale network
```

**Option B: SSH Tunnel**
```bash
ssh -R 5173:localhost:5173 user@remote-server
```

**Option C: ngrok** (Temporary)
```bash
ngrok http 5173
```

## 🚀 Production Deployment

See `DEPLOYMENT.md` for:
- NGINX reverse proxy config
- Docker Compose setup
- AWS/Vercel deployment
- HTTPS setup
- Performance optimization
- Monitoring & logging

Quick start:

```bash
npm run build
# Creates dist/ folder

# Serve with simple HTTP server
npx serve -s dist

# Or use Docker
docker build -t soildash .
docker run -p 80:80 soildash
```

## 🐛 Troubleshooting

### "Cannot reach device"

```bash
# Check device online
ping 192.168.4.1

# Test device endpoint
curl http://192.168.4.1/data

# Check proxy (if using)
curl http://localhost:3000/data

# Enable Demo mode to test UI
```

### "CORS error in browser"

- Ensure proxy is running (`node proxy/index.js`)
- Check frontend points to `/api/data` not device IP
- Verify device IP in Settings

### "Data not updating"

- Check polling interval (1000ms default)
- Verify device JSON format matches spec
- Check browser console for errors
- Enable Demo mode to verify UI works

### Port already in use

**Linux/Mac:**
```bash
lsof -i :5173
kill -9 <PID>
```

**Windows:**
```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## 📚 Additional Documentation

- **DEPLOYMENT.md** - Production deployment & scaling
- **DEVICE_FIRMWARE_EXAMPLE.md** - Arduino code for ESP32
- **proxy/README.md** - Detailed proxy server docs
- **src/ components** - Inline TypeScript comments

## 🤝 Architecture

```
┌─────────────────┐
│  Browser/React  │  localhost:5173
│   (SoilDash)    │
└────────┬────────┘
         │
         ├─ Option A: Direct
         │  └──→ http://192.168.4.1/data
         │
         └─ Option B: Via Proxy (Recommended)
            └──→ http://localhost:3000/data
               └──→ http://192.168.4.1/data (internal)
```

## 📦 Dependencies

**Frontend:**
- react@18.2.0
- react-router-dom@6.20.0
- chart.js@4.4.0
- react-chartjs-2@5.2.0
- tailwindcss@3.3.6
- vite@5.0.0
- typescript@5.2.2

**Proxy:**
- express@4.18.2
- cors@2.8.5
- dotenv@16.3.1

## 💡 Tips & Tricks

### Increase Polling Frequency
Settings → Polling Interval: 500ms
*Note: Will increase power consumption on device*

### Export All Data
Charts page → Export CSV button
*Data goes back to first reading in session*

### Reset to Defaults
Settings → Danger Zone → Reset Settings

### Clear All Data
Settings → Danger Zone → Clear All Data

### Multiple Devices
Not supported yet, but architecture allows:
1. Modify types to add device ID
2. Store readings keyed by device
3. Add device selector to UI

### Custom Metrics
1. Add fields to `types/telemetry.ts`
2. Create new card component
3. Add to Dashboard/Charts pages

## 📝 License

MIT - See LICENSE file (if included)

## 🆘 Getting Help

1. **Check README.md** - Main documentation
2. **See DEPLOYMENT.md** - Deployment issues
3. **Review proxy/README.md** - Proxy problems
4. **Check DEVICE_FIRMWARE_EXAMPLE.md** - Device issues
5. **Search browser console** - Frontend errors
6. **Run tests** - `npm run test`

## 🎉 Next Steps

1. ✅ Run `npm install` → `npm run dev`
2. ✅ Test with Demo mode
3. ✅ Set up ESP32 device (see DEVICE_FIRMWARE_EXAMPLE.md)
4. ✅ Configure device IP in Settings
5. ✅ Monitor live data!

---

**Happy monitoring! 🌱📊**

For detailed info on any section, check the documentation files or inline code comments.
