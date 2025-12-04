# SoilDash - ESP32 Telemetry Dashboard

A production-ready local dashboard for ESP32 soil moisture and environmental monitoring devices. Features real-time polling, historical charts, alerts, and settings management—all running locally with optional CORS proxy.

## 🚀 Quick Start

### Frontend (Direct to Device or via Proxy)

```bash
# Install dependencies
npm install

# Run development server (frontend only, direct to device)
npm run dev

# Build for production
npm run build
```

Frontend runs on `http://localhost:5173`

### Optional Proxy Server (Recommended for Reliability)

The proxy handles CORS issues and enables advanced features like SSE/WebSocket support.

```bash
# In a separate terminal
cd proxy
npm install
node index.js
```

Proxy runs on `http://localhost:3000` and proxies to `http://192.168.4.1/data`

## 📋 Prerequisites

- **ESP32 Device**: Running firmware that serves JSON at `http://192.168.4.1/data`
- **Network**: ESP32 and computer on same local network (or accessible IP)
- **Node.js**: v16+ (for proxy server, optional)

## 🔌 Device Endpoint

Your ESP32 should serve JSON at `http://192.168.4.1/data`:

```json
{
  "temp": 23.5,
  "hum": 65.2,
  "soil": 78.4,
  "status": "SAFE",
  "ts": "2025-12-04T10:30:45.123Z"
}
```

All fields required. `status` must be `"SAFE"` or `"DANGER"`.

## 🎛️ Configuration

### Environment Variables (Frontend)

Create `.env` (optional, frontend auto-detects):

```env
VITE_API_URL=http://192.168.4.1
VITE_USE_PROXY=false
```

Or use Settings page (persisted to localStorage):
- Device IP
- Polling interval (1000ms default)
- Temperature/humidity units (°C/°F)
- Theme (light/dark)
- Alert thresholds

### Proxy Configuration

Edit `proxy/index.js` for:
- `DEVICE_IP` / `DEVICE_PORT`
- `PROXY_PORT` (default 3000)
- Basic auth (see comments in proxy)

## 🏃 Running Scenarios

### Scenario 1: Direct to Device (No Proxy)

Best for quick testing on local network:

```bash
npm install
npm run dev
# Navigate to http://localhost:5173
# Enter device IP: 192.168.4.1
```

### Scenario 2: With Proxy (Recommended)

Handles CORS and allows future SSE/WebSocket upgrades:

```bash
# Terminal 1: Frontend
npm install
npm run dev

# Terminal 2: Proxy
cd proxy
npm install
node index.js

# Navigate to http://localhost:5173
# Settings → Proxy Mode: ON
```

### Scenario 3: Demo Mode (No Device)

Data generators and mock history available in Settings:

```bash
npm install
npm run dev
# Settings → Demo Mode: ON (generates random data)
```

## 📊 Features

✅ **Real-time Monitoring**
- Polling at configurable intervals (default 1000ms)
- Live updates with retry/backoff logic
- Last value, min/max, and trend indicators

✅ **Historical Charts**
- Chart.js line charts (temperature, humidity, soil moisture)
- Selectable time ranges (1h, 6h, 24h, 7d)
- Responsive and mobile-friendly

✅ **Alerts & Thresholds**
- Per-metric threshold configuration
- Browser notifications when thresholds exceeded
- Visual alert UI and inline toasts

✅ **Settings Management**
- Persistent localStorage (device IP, units, theme, thresholds, polling interval)
- Dark theme toggle
- Unit conversion (Celsius ↔ Fahrenheit)

✅ **Data Export**
- CSV export of historical data
- PDF snapshot example (client-side)

✅ **Accessibility**
- ARIA labels and semantic HTML
- Keyboard navigation
- Responsive design

✅ **Proxy Server** (Optional)
- CORS proxy to device endpoint
- Basic auth support
- SSE endpoint ready for future use
- Error logging and rate limiting

## 🔧 File Structure

```
soildash/
├── README.md
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.cjs
├── postcss.config.cjs
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── TelemetryCard.tsx
│   │   ├── ChartsPanel.tsx
│   │   ├── Alerts.tsx
│   │   └── EmptyState.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Charts.tsx
│   │   └── Settings.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── localStorage.ts
│   ├── hooks/
│   │   ├── useTelemetry.ts
│   │   └── useSettings.ts
│   ├── types/
│   │   └── telemetry.ts
│   └── utils/
│       ├── formatting.ts
│       ├── export.ts
│       └── mock.ts
└── proxy/
    ├── index.js
    └── package.json
```

## 🚨 Network & Security

### CORS & Local Networks

Browsers block cross-origin requests by default. Two solutions:

1. **Proxy Server** (Recommended)
   - Run `proxy/index.js` locally
   - Proxy handles CORS headers
   - Same-origin requests from `localhost:5173` → `localhost:3000`

2. **Direct to Device** (If device allows CORS)
   - Device must set `Access-Control-Allow-Origin: *`
   - Less reliable; many devices don't support

### Remote Access (Beyond Local Network)

- **ngrok**: `ngrok http 192.168.4.1:80` exposes device remotely
- **VPN**: Tailscale/Wireguard for secure remote access
- **HTTP Tunneling**: Use proxy with port forwarding

### Security Recommendations

- **Local Network Only**: ESP32 should not be Internet-facing
- **Proxy Authentication**: Enable basic auth in `proxy/index.js` for shared networks
- **HTTPS**: Use self-signed cert or reverse proxy (nginx) for HTTPS
- **Rate Limiting**: Proxy includes rate limiting; adjust if needed
- **Firewall**: Restrict device access by IP if possible

## 🧪 Testing

Run unit tests (example included for TelemetryCard):

```bash
npm run test
```

Test setup uses Vitest + Testing Library.

## 📦 Dependencies

**Frontend:**
- React 18
- React Router v6
- TypeScript
- Tailwind CSS
- Chart.js + react-chartjs-2
- Vite
- Vitest (testing)

**Proxy:**
- Express
- CORS
- dotenv

## 🐛 Troubleshooting

### "Cannot reach device"
1. Verify ESP32 IP: `ping 192.168.4.1`
2. Check device endpoint: `curl http://192.168.4.1/data`
3. Use proxy to bypass CORS
4. Enable Demo Mode to test UI

### "CORS error in browser"
- Use proxy server (recommended)
- Or enable CORS on device

### "Proxy won't start"
- Check port 3000 is free: `lsof -i :3000`
- Verify device IP in `proxy/index.js`
- Check Node.js version: `node -v` (v16+)

### Data not updating
- Check polling interval in Settings
- Verify device IP is correct
- Check browser console for errors
- Try Demo Mode to isolate issue

## 📝 Example: Custom Device Endpoint

If your device is at a different IP/port:

1. **Frontend Settings page**: Enter custom IP
2. **Or environment variable**: `VITE_API_URL=http://192.168.1.100:8080`
3. **Or proxy config**: Edit `proxy/index.js` `DEVICE_IP`

## 🤝 Contributing

Structure allows easy extensions:
- Add new metrics to `types/telemetry.ts` and components
- Add new chart types to `ChartsPanel.tsx`
- Add new pages to `pages/`
- Extend proxy with new endpoints

## 📄 License

MIT

---

**Need help?** Check the inline code comments or enable browser DevTools console for debugging.
