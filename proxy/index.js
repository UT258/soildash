import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

/**
 * SoilDash Proxy Server
 *
 * This proxy handles:
 * 1. CORS proxying to ESP32 device at 192.168.4.1
 * 2. Optional basic authentication
 * 3. Rate limiting and request logging
 * 4. Future WebSocket/SSE support
 *
 * Configuration:
 * - DEVICE_IP: IP of ESP32 device (default: 192.168.4.1)
 * - DEVICE_PORT: Port on device (default: 80)
 * - PROXY_PORT: Port this server runs on (default: 3000)
 * - ENABLE_AUTH: Enable basic auth (default: false)
 * - AUTH_USER: Basic auth username (default: admin)
 * - AUTH_PASSWORD: Basic auth password (default: password)
 * - RATE_LIMIT_WINDOW: Rate limit window in ms (default: 60000)
 * - RATE_LIMIT_MAX: Max requests per window (default: 100)
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// Configuration
const DEVICE_IP = process.env.DEVICE_IP || '192.168.4.1'
const DEVICE_PORT = process.env.DEVICE_PORT || '80'
const PROXY_PORT = process.env.PROXY_PORT || '3000'
const ENABLE_AUTH = process.env.ENABLE_AUTH === 'true'
const AUTH_USER = process.env.AUTH_USER || 'admin'
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || 'password'
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10)
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '100', 10)

// Rate limiter
const rateLimitStore = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const key = ip
  const data = rateLimitStore.get(key) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW }

  if (now > data.resetTime) {
    data.count = 0
    data.resetTime = now + RATE_LIMIT_WINDOW
  }

  data.count++
  rateLimitStore.set(key, data)

  return data.count > RATE_LIMIT_MAX
}

// Middleware

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost and same-origin
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true)
      } else {
        callback(null, false)
      }
    },
    credentials: true,
  })
)

app.use(express.json())

// Basic authentication middleware (optional)
function authMiddleware(req, res, next) {
  if (!ENABLE_AUTH) {
    return next()
  }

  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: missing auth' })
  }

  const [scheme, credentials] = authHeader.split(' ')
  if (scheme !== 'Basic' || !credentials) {
    return res.status(401).json({ error: 'Unauthorized: invalid auth scheme' })
  }

  const [user, pass] = Buffer.from(credentials, 'base64').toString().split(':')
  if (user === AUTH_USER && pass === AUTH_PASSWORD) {
    return next()
  }

  return res.status(401).json({ error: 'Unauthorized: invalid credentials' })
}

// Rate limiting middleware
function rateLimitMiddleware(req, res, next) {
  if (isRateLimited(req.ip)) {
    return res.status(429).json({ error: 'Too many requests' })
  }
  next()
}

app.use(authMiddleware)
app.use(rateLimitMiddleware)

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} from ${req.ip}`)
  next()
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', device: `${DEVICE_IP}:${DEVICE_PORT}` })
})

// Proxy endpoint for telemetry data
app.get('/data', async (req, res) => {
  try {
    const deviceUrl = `http://${DEVICE_IP}:${DEVICE_PORT}/data`
    console.log(`[Proxy] Fetching from device: ${deviceUrl}`)

    const response = await fetch(deviceUrl, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(`[Proxy] Device returned ${response.status}`)
      return res.status(response.status).json({ error: `Device returned ${response.status}` })
    }

    const data = await response.json()

    // Validate data format
    if (
      typeof data.temp !== 'number' ||
      typeof data.hum !== 'number' ||
      typeof data.soil !== 'number' ||
      !['SAFE', 'DANGER'].includes(data.status) ||
      !data.ts
    ) {
      console.error('[Proxy] Invalid data format from device')
      return res.status(400).json({ error: 'Invalid data format from device' })
    }

    // Add proxy metadata
    res.json({
      ...data,
      _proxy: {
        timestamp: new Date().toISOString(),
        from: DEVICE_IP,
      },
    })
  } catch (error) {
    console.error('[Proxy] Error:', error.message)
    res.status(503).json({ error: `Cannot reach device: ${error.message}` })
  }
})

// Historical data endpoint (example for future use)
app.get('/history', async (req, res) => {
  const range = req.query.range || 'now-24h'
  console.log(`[Proxy] History request: ${range}`)

  // If device supports history endpoint
  try {
    const deviceUrl = `http://${DEVICE_IP}:${DEVICE_PORT}/history?range=${range}`
    const response = await fetch(deviceUrl, { timeout: 5000 })

    if (response.ok) {
      const data = await response.json()
      return res.json(data)
    }
  } catch (error) {
    console.log(`[Proxy] Device does not support history endpoint: ${error.message}`)
  }

  // Return empty array if device doesn't support it
  res.json([])
})

// WebSocket upgrade endpoint (example for future SSE/WebSocket support)
app.get('/subscribe', (req, res) => {
  // This would require http.Server instead of just Express
  // For now, return example
  res.status(501).json({ error: 'WebSocket not yet implemented' })
})

// Error handling
app.use((err, req, res, next) => {
  console.error('[Error]', err)
  res.status(500).json({ error: 'Internal server error' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Start server
app.listen(PROXY_PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════╗
║     SoilDash Proxy Server Started       ║
╠════════════════════════════════════════╣
║ Proxy URL: http://localhost:${PROXY_PORT}          ║
║ Device IP: ${DEVICE_IP}                ║
║ Device Port: ${DEVICE_PORT}                        ║
║ Auth: ${ENABLE_AUTH ? 'ENABLED' : 'DISABLED'}                    ║
║ Rate Limit: ${RATE_LIMIT_MAX}/min                       ║
╚════════════════════════════════════════╝

Endpoints:
  GET  /data              → Proxy to device telemetry
  GET  /history?range=... → Historical data
  GET  /health            → Health check
  GET  /subscribe         → WebSocket (future)

To test locally:
  curl http://localhost:${PROXY_PORT}/health
  curl http://localhost:${PROXY_PORT}/data

Environment variables:
  DEVICE_IP=192.168.4.1
  DEVICE_PORT=80
  PROXY_PORT=3000
  ENABLE_AUTH=false
  AUTH_USER=admin
  AUTH_PASSWORD=password
  RATE_LIMIT_WINDOW=60000
  RATE_LIMIT_MAX=100
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n[Proxy] SIGTERM received, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('\n[Proxy] SIGINT received, shutting down gracefully...')
  process.exit(0)
})

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Error] Unhandled Rejection at:', promise, 'reason:', reason)
})
