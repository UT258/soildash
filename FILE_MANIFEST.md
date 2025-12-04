# FILE MANIFEST & SETUP INSTRUCTIONS

## 📦 Complete File List

This repository contains **31 complete files** ready to copy and run:

### Entry Point
- `index.html` - HTML entry with React root div

### Configuration Files (8)
- `package.json` - Frontend dependencies
- `vite.config.ts` - Vite build config
- `tsconfig.json` - TypeScript settings
- `tsconfig.node.json` - Node TypeScript config
- `tailwind.config.cjs` - Tailwind theming
- `postcss.config.cjs` - PostCSS config
- `vitest.config.ts` - Test configuration
- `.gitignore` - Git ignore rules

### Frontend Source Files (21)

**Main App (2)**
- `src/main.tsx` - React entry point
- `src/App.tsx` - Main app with routing

**Components (6)**
- `src/components/Layout.tsx` - Sidebar & header
- `src/components/TelemetryCard.tsx` - Metric cards
- `src/components/ChartsPanel.tsx` - Chart.js charts
- `src/components/Alerts.tsx` - Alert UI & toasts
- `src/components/EmptyState.tsx` - Empty/loading states
- `src/components/TelemetryCard.test.tsx` - Component tests

**Pages (3)**
- `src/pages/Dashboard.tsx` - Real-time monitoring
- `src/pages/Charts.tsx` - Historical data & export
- `src/pages/Settings.tsx` - Configuration UI

**Services (2)**
- `src/services/api.ts` - Device fetch + retry
- `src/services/localStorage.ts` - Settings storage

**Hooks (2)**
- `src/hooks/useTelemetry.ts` - Polling hook
- `src/hooks/useSettings.ts` - Settings hook

**Types (1)**
- `src/types/telemetry.ts` - TypeScript interfaces

**Utils (3)**
- `src/utils/formatting.ts` - Format & convert
- `src/utils/mock.ts` - Test data generator
- `src/utils/export.ts` - (Functions in formatting.ts)

**Styles (1)**
- `src/index.css` - Global Tailwind styles

**Test Setup (1)**
- `src/setup.ts` - Vitest setup file

### Proxy Server (3)
- `proxy/package.json` - Proxy dependencies
- `proxy/index.js` - Express proxy server
- `proxy/README.md` - Proxy documentation

### Setup Scripts (2)
- `setup.sh` - Linux/Mac setup
- `setup.bat` - Windows setup

### Documentation (6)
- `README.md` - Main documentation
- `QUICKSTART.md` - Quick start guide
- `DEPLOYMENT.md` - Production deployment
- `DEVICE_FIRMWARE_EXAMPLE.md` - ESP32 Arduino code
- `REPOSITORY_GUIDE.md` - Complete file guide
- This file - FILE MANIFEST

## 🚀 Installation Instructions

### Windows Users

1. **Extract all files** to a folder (e.g., `C:\soildash`)

2. **Run setup:** Double-click `setup.bat`
   - Checks Node.js installed
   - Runs `npm install` for frontend
   - Runs `npm install` for proxy

3. **Start frontend:**
   ```bash
   npm run dev
   ```
   Opens http://localhost:5173

4. **Start proxy (optional, in new terminal):**
   ```bash
   cd proxy
   node index.js
   ```

### Mac/Linux Users

1. **Extract all files** to a folder (e.g., `~/soildash`)

2. **Run setup:**
   ```bash
   bash setup.sh
   ```
   - Checks Node.js installed
   - Runs npm install for both

3. **Start frontend:**
   ```bash
   npm run dev
   ```

4. **Start proxy (optional):**
   ```bash
   cd proxy && node index.js
   ```

### For Automated Setup (All Platforms)

```bash
cd soildash

# Install frontend
npm install

# Install proxy
cd proxy && npm install && cd ..

# Run
npm run dev                    # Terminal 1
cd proxy && node index.js      # Terminal 2 (optional)
```

## 📋 File Structure (Tree View)

```
soildash/
├── README.md
├── QUICKSTART.md
├── DEPLOYMENT.md
├── DEVICE_FIRMWARE_EXAMPLE.md
├── REPOSITORY_GUIDE.md
├── FILE_MANIFEST.md (this file)
│
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.cjs
├── postcss.config.cjs
├── vitest.config.ts
├── .gitignore
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── setup.ts
│   │
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── TelemetryCard.tsx
│   │   ├── ChartsPanel.tsx
│   │   ├── Alerts.tsx
│   │   ├── EmptyState.tsx
│   │   └── TelemetryCard.test.tsx
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Charts.tsx
│   │   └── Settings.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   └── localStorage.ts
│   │
│   ├── hooks/
│   │   ├── useTelemetry.ts
│   │   └── useSettings.ts
│   │
│   ├── types/
│   │   └── telemetry.ts
│   │
│   └── utils/
│       ├── formatting.ts
│       ├── mock.ts
│       └── export.ts
│
├── proxy/
│   ├── package.json
│   ├── index.js
│   └── README.md
│
├── setup.sh
└── setup.bat
```

## ✅ Verification Checklist

After setup, verify:

- [ ] `npm install` completed without errors
- [ ] `npm run dev` starts on http://localhost:5173
- [ ] Frontend loads (you see SoilDash header)
- [ ] Settings page accessible (⚙️ button)
- [ ] Demo mode works (Settings → Demo: ON)
- [ ] Charts page loads with data
- [ ] CSV export button appears

### Test Proxy (Optional)

```bash
cd proxy
npm install
node index.js
# Should see startup message
```

Then test in new terminal:
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","device":"192.168.4.1:80"}
```

## 🔧 Line Counts by File

Quick reference for file sizes:

| File | Lines | Purpose |
|------|-------|---------|
| App.tsx | 28 | Main app + routing |
| Dashboard.tsx | 105 | Real-time display |
| Settings.tsx | 180 | Configuration UI |
| Charts.tsx | 70 | Historical charts |
| Layout.tsx | 125 | Sidebar & header |
| TelemetryCard.tsx | 120 | Metric cards |
| ChartsPanel.tsx | 198 | Chart.js integration |
| api.ts | 65 | Fetch + retry |
| useTelemetry.ts | 95 | Polling hook |
| formatting.ts | 120 | Utils |
| proxy/index.js | 220 | Express server |
| **Total** | **~1,400** | **Total code** |

## 📦 Dependencies Summary

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1"
  },
  "devDependencies": {
    // TypeScript, Vite, Tailwind, Testing Library
  }
}
```

### Proxy (proxy/package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

Total: **9 production dependencies** + testing tools

## 🎯 Next Steps After Installation

1. **Run with Demo Mode** (no device needed)
   ```bash
   npm run dev
   # Settings → Demo mode: ON
   ```

2. **Connect Real Device**
   - Follow DEVICE_FIRMWARE_EXAMPLE.md
   - Get device IP
   - Enter in Settings page

3. **Deploy to Production**
   - See DEPLOYMENT.md
   - Build: `npm run build`
   - Serve dist/ folder

4. **Customize & Extend**
   - Add new metrics
   - Customize colors (tailwind.config.cjs)
   - Add new pages

## 🆘 If Something Breaks

### Node/npm Issues
```bash
# Check Node version (needs v16+)
node --version

# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Find what's using port 5173
lsof -i :5173  # Mac/Linux
netstat -ano | findstr :5173  # Windows

# Kill the process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### Device Connection Issues
- Check device IP in Settings
- Test: `ping 192.168.4.1`
- Enable proxy for better reliability
- Enable Demo mode to test UI

### Proxy Not Starting
- Check port 3000 is free
- Verify device IP in `proxy/index.js`
- Check Node.js version: `node -v`

## 📝 File Organization Philosophy

- **Flat structure** for small components
- **Folders by feature** (pages, components, services)
- **No Redux/Zustand** - hooks are sufficient
- **Type-safe** - strict TypeScript everywhere
- **Well-commented** - especially complex logic
- **Tests included** - example included for components
- **Docs are first-class** - 6 documentation files

## 🎓 Learning Path

**Start here:**
1. QUICKSTART.md - Get running in 5 minutes
2. REPOSITORY_GUIDE.md - Understand the structure
3. README.md - Full feature overview

**Intermediate:**
4. App.tsx - See routing setup
5. Dashboard.tsx - Main page logic
6. useTelemetry.ts - Polling mechanism

**Advanced:**
7. DEPLOYMENT.md - Production setup
8. DEVICE_FIRMWARE_EXAMPLE.md - Device code
9. proxy/index.js - Server implementation

## 💡 Key Design Decisions

1. **No state management library** - hooks are sufficient
2. **localStorage persistence** - all settings saved
3. **TypeScript strict mode** - catch errors early
4. **Tailwind CSS** - rapid UI development
5. **Chart.js** - lightweight charting
6. **Express proxy** - simple CORS solution
7. **Functional components** - React best practice
8. **Responsive design** - works mobile/tablet/desktop

## 🚀 Performance Notes

- Bundle size: ~150KB gzipped
- Charts optimize for 288 data points (24h @ 5min intervals)
- Polling uses exponential backoff to reduce load
- Proxy rate limits to prevent device overload
- localStorage capped at reasonable size

## 🔒 Security Built-In

- ✅ CORS proxy prevents external access
- ✅ Optional basic auth on proxy
- ✅ Rate limiting on proxy
- ✅ Input validation everywhere
- ✅ No sensitive data in localStorage
- ✅ TypeScript prevents type-related bugs
- ⚠️ Always use HTTPS in production

## 📞 Quick Reference

| Need | File | Info |
|------|------|------|
| Setup help | QUICKSTART.md | 5 min start |
| Device firmware | DEVICE_FIRMWARE_EXAMPLE.md | Arduino code |
| Production | DEPLOYMENT.md | Docker, HTTPS |
| File structure | REPOSITORY_GUIDE.md | Detailed breakdown |
| API details | src/services/api.ts | Fetch logic |
| Proxy config | proxy/README.md | Server options |
| Theme colors | tailwind.config.cjs | Customize UI |
| Component test | src/components/TelemetryCard.test.tsx | Test example |

---

**You're all set!** 🎉

**Next command:**
```bash
npm install && npm run dev
```

Open browser to http://localhost:5173

Enjoy your new dashboard! 🌱📊
