# ✅ INSTALLATION VERIFICATION CHECKLIST

Use this checklist to verify your SoilDash installation is complete and working.

## Pre-Installation

- [ ] Node.js v16+ installed (`node --version` shows v16+)
- [ ] npm v7+ installed (`npm --version` shows v7+)
- [ ] All 32 files extracted to project folder
- [ ] Internet connection available (for npm install)

## Installation Steps

### Step 1: Install Dependencies

```bash
npm install
```

- [ ] No errors in installation
- [ ] `node_modules/` folder created
- [ ] `package-lock.json` created

### Step 2: Verify Frontend Build

```bash
npm run build
```

- [ ] No TypeScript errors
- [ ] No build errors
- [ ] `dist/` folder created with files

### Step 3: Start Frontend

```bash
npm run dev
```

- [ ] Server starts on port 5173
- [ ] No errors in terminal
- [ ] Terminal shows: `Local: http://localhost:5173`

### Step 4: Test in Browser

1. Open http://localhost:5173
   - [ ] Page loads
   - [ ] SoilDash header visible
   - [ ] Sidebar on left with navigation
   - [ ] Header with menu & theme toggle

2. Click "⚙️ Settings"
   - [ ] Settings page loads
   - [ ] Device IP field visible (default: 192.168.4.1)
   - [ ] Polling interval slider visible
   - [ ] Threshold input fields visible
   - [ ] Demo mode checkbox visible
   - [ ] Proxy toggle visible

3. Enable Demo Mode
   - [ ] Settings → Check "Demo mode"
   - [ ] Settings → Check "Proxy: OFF"
   - [ ] Navigate to Dashboard
   - [ ] Data displays (synthetic values)
   - [ ] Cards show temperature, humidity, soil
   - [ ] Min/max values update

4. Check Charts Page
   - [ ] Charts page loads
   - [ ] Three charts visible (temp, humidity, soil)
   - [ ] Time range buttons visible (1h, 6h, 24h, 7d)
   - [ ] Export CSV button visible and works
   - [ ] Data plots appear after collecting readings

5. Test Dashboard Features
   - [ ] Cards update every 1-2 seconds
   - [ ] Trend indicators visible (↑↓→)
   - [ ] Status badge shows "SAFE" or "DANGER"
   - [ ] Min/max stats displayed
   - [ ] Info cards at bottom show stats

6. Test Settings
   - [ ] Toggle dark mode (works immediately)
   - [ ] Toggle Fahrenheit (updates display)
   - [ ] Change polling interval (affects update speed)
   - [ ] Change threshold values
   - [ ] Reset settings to defaults (works)
   - [ ] Clear data button appears

7. Test Responsive Design
   - [ ] Open DevTools (F12)
   - [ ] Toggle device toolbar (Ctrl+Shift+M)
   - [ ] Check mobile view
   - [ ] Sidebar collapses to hamburger menu
   - [ ] Grid adapts to single column
   - [ ] Charts still visible and responsive

## Optional: Install Proxy Server

```bash
cd proxy
npm install
cd ..
```

- [ ] No errors in proxy installation
- [ ] `proxy/node_modules/` created

### Start Proxy Server

In a new terminal:
```bash
cd proxy
node index.js
```

- [ ] Server starts
- [ ] Terminal shows startup message
- [ ] Shows device IP: 192.168.4.1
- [ ] Shows proxy port: 3000

### Test Proxy

In another terminal:
```bash
curl http://localhost:3000/health
```

- [ ] Returns JSON with status "ok"
- [ ] Shows device IP

## Optional: Test with Real Device

### Prerequisites
- [ ] ESP32 device on same network
- [ ] Device firmware running (see DEVICE_FIRMWARE_EXAMPLE.md)
- [ ] Device responds to `curl http://<device_ip>/data`

### Setup
1. Get device IP (e.g., 192.168.1.100)
2. Test device endpoint:
   ```bash
   curl http://192.168.1.100/data
   ```
   - [ ] Returns JSON with temp, hum, soil, status, ts

3. In Dashboard Settings:
   - [ ] Enter device IP
   - [ ] Disable demo mode
   - [ ] Toggle proxy OFF (for direct) or ON (for proxy)

4. Monitor Dashboard:
   - [ ] Real values appear
   - [ ] Data updates every 1-2s
   - [ ] Charts populate
   - [ ] Status badge updates

## Run Tests

```bash
npm run test
```

- [ ] Tests run without errors
- [ ] TelemetryCard tests pass (8 tests)
- [ ] No failing tests

### Interactive Test UI

```bash
npm run test:ui
```

- [ ] UI opens in browser
- [ ] Shows test results
- [ ] Tests can be re-run

## Code Quality

```bash
npm run lint
```

- [ ] No errors (if eslint configured)
- [ ] No warnings

## Performance Check

- [ ] Frontend loads in < 2 seconds
- [ ] Charts render smoothly
- [ ] No lag when scrolling
- [ ] Dark mode toggle instant
- [ ] Settings save without delay

## Browser Compatibility

Test in multiple browsers:

- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, if Mac)
- [ ] Edge (latest, if Windows)

Each should show:
- [ ] Page renders correctly
- [ ] All features work
- [ ] Responsive design responsive
- [ ] No console errors

## localStorage Verification

1. Open DevTools (F12)
2. Application tab → localStorage
3. Look for `http://localhost:5173`
   - [ ] `soildash_settings` key exists
   - [ ] Contains JSON with settings
   - [ ] Persists after page reload

## Mobile Responsiveness

Using browser DevTools device emulation:

- [ ] iPhone 12/13 (390px)
  - [ ] Layout readable
  - [ ] Tap targets adequate (44px+)
  - [ ] Sidebar hidden, menu visible

- [ ] iPad (768px)
  - [ ] Two-column layout
  - [ ] Sidebar visible or collapsible
  - [ ] Charts readable

- [ ] Desktop (1920px)
  - [ ] Full layout
  - [ ] Sidebar visible
  - [ ] All features accessible

## Accessibility Check

- [ ] Keyboard navigation works (Tab key)
- [ ] Focus indicators visible
- [ ] Links underlined or clearly marked
- [ ] Buttons have alt text (if images)
- [ ] Color not only indicator of status
- [ ] Dark mode maintains contrast

## Production Build

```bash
npm run build
npm run preview
```

- [ ] Build succeeds
- [ ] No errors
- [ ] `dist/` folder created with:
  - [ ] `index.html`
  - [ ] `assets/` folder with JS/CSS
  - [ ] All assets properly hashed

## File Structure Verification

Check that all 32 files exist:

**Configuration (8)**
- [ ] package.json
- [ ] vite.config.ts
- [ ] tsconfig.json
- [ ] tsconfig.node.json
- [ ] tailwind.config.cjs
- [ ] postcss.config.cjs
- [ ] vitest.config.ts
- [ ] .gitignore

**Frontend (21)**
- [ ] index.html
- [ ] src/main.tsx
- [ ] src/App.tsx
- [ ] src/index.css
- [ ] src/setup.ts
- [ ] src/components/Layout.tsx
- [ ] src/components/TelemetryCard.tsx
- [ ] src/components/ChartsPanel.tsx
- [ ] src/components/Alerts.tsx
- [ ] src/components/EmptyState.tsx
- [ ] src/components/TelemetryCard.test.tsx
- [ ] src/pages/Dashboard.tsx
- [ ] src/pages/Charts.tsx
- [ ] src/pages/Settings.tsx
- [ ] src/services/api.ts
- [ ] src/services/localStorage.ts
- [ ] src/hooks/useTelemetry.ts
- [ ] src/hooks/useSettings.ts
- [ ] src/types/telemetry.ts
- [ ] src/utils/formatting.ts
- [ ] src/utils/mock.ts

**Proxy (3)**
- [ ] proxy/package.json
- [ ] proxy/index.js
- [ ] proxy/README.md

**Setup (2)**
- [ ] setup.sh
- [ ] setup.bat

**Docs (8)**
- [ ] README.md
- [ ] QUICKSTART.md
- [ ] DEPLOYMENT.md
- [ ] DEVICE_FIRMWARE_EXAMPLE.md
- [ ] REPOSITORY_GUIDE.md
- [ ] ARCHITECTURE.md
- [ ] FILE_MANIFEST.md
- [ ] DELIVERY_SUMMARY.md

## Common Issues & Fixes

### "Cannot find module 'react'"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 already in use
```bash
# Linux/Mac
lsof -i :5173
kill -9 <PID>

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### TypeScript errors
```bash
npm run build  # Shows all errors
```

### Charts not displaying
- [ ] Wait a few seconds for data
- [ ] Enable demo mode
- [ ] Check browser console for errors (F12)

### Settings not saving
- [ ] Check browser allows localStorage
- [ ] Check in DevTools Application tab
- [ ] Not in private/incognito mode

## Final Sign-Off

When all items checked:

- [ ] ✅ Installation complete
- [ ] ✅ Frontend working
- [ ] ✅ Demo mode verified
- [ ] ✅ Charts functional
- [ ] ✅ Settings persisting
- [ ] ✅ Responsive design working
- [ ] ✅ Tests passing
- [ ] ✅ Production build successful
- [ ] ✅ Ready for device connection
- [ ] ✅ Ready for deployment

## Next Steps

1. **For Testing:** Enable Demo mode and explore all features
2. **For Device:** Set up ESP32 (see DEVICE_FIRMWARE_EXAMPLE.md)
3. **For Production:** See DEPLOYMENT.md
4. **For Customization:** Modify colors in tailwind.config.cjs
5. **For Extending:** Add new metrics or pages

---

**All systems operational! 🚀**

Your SoilDash dashboard is ready to monitor ESP32 telemetry.

Have questions? Check:
- README.md - Features
- QUICKSTART.md - Setup
- DEPLOYMENT.md - Production
- Inline code comments - Implementation

**Happy monitoring! 🌱📊**
