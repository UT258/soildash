# SoilDash Proxy Server

Simple Express proxy for the SoilDash dashboard that handles CORS and provides reliable access to your ESP32 device.

## Quick Start

```bash
npm install
node index.js
```

Server runs on `http://localhost:3000`

## Configuration

### Environment Variables

Create `.env` file or set directly:

```env
DEVICE_IP=192.168.4.1
DEVICE_PORT=80
PROXY_PORT=3000
ENABLE_AUTH=false
AUTH_USER=admin
AUTH_PASSWORD=password
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100
```

### Enable Basic Authentication

For shared networks, enable basic auth:

```env
ENABLE_AUTH=true
AUTH_USER=admin
AUTH_PASSWORD=your_secure_password
```

Then use with curl:

```bash
curl -u admin:your_secure_password http://localhost:3000/data
```

Or in frontend, set header:

```javascript
const auth = btoa('admin:your_secure_password')
fetch('http://localhost:3000/data', {
  headers: { Authorization: `Basic ${auth}` }
})
```

## Endpoints

### GET /data
Proxies telemetry data from device.

```bash
curl http://localhost:3000/data
```

Returns:
```json
{
  "temp": 23.5,
  "hum": 65.2,
  "soil": 78.4,
  "status": "SAFE",
  "ts": "2025-12-04T10:30:45.123Z",
  "_proxy": {
    "timestamp": "2025-12-04T10:30:46.000Z",
    "from": "192.168.4.1"
  }
}
```

### GET /history?range=now-24h
Proxies historical data (if device supports).

Supported ranges:
- `now-1h`
- `now-6h`
- `now-24h` (default)
- `now-7d`

### GET /health
Health check.

```bash
curl http://localhost:3000/health
```

Returns:
```json
{ "status": "ok", "device": "192.168.4.1:80" }
```

## Error Handling

| Status | Meaning |
|--------|---------|
| 200 | OK |
| 400 | Invalid data format from device |
| 401 | Unauthorized (auth enabled) |
| 429 | Rate limit exceeded |
| 503 | Device unreachable |
| 504 | Device timeout |

## Security

### CORS

Proxy allows requests from:
- `localhost` and `127.0.0.1`
- Same-origin requests

This prevents external sites from accessing your local device.

### Authentication

Enable basic auth for shared networks:

```env
ENABLE_AUTH=true
AUTH_USER=admin
AUTH_PASSWORD=your_secure_password
```

### Rate Limiting

Default: 100 requests per 60 seconds

Adjust:
```env
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100
```

### Firewall

1. Keep proxy on local network only
2. Use VPN or SSH tunnel for remote access
3. Restrict port 3000 to trusted IPs
4. Use ngrok for temporary remote access:
   ```bash
   ngrok http 3000
   ```

## Troubleshooting

### "Cannot reach device"
```bash
# Check device is online
ping 192.168.4.1

# Check device endpoint
curl http://192.168.4.1/data

# Verify proxy config
curl http://localhost:3000/health
```

### "Too many requests"
Rate limit exceeded. Adjust `RATE_LIMIT_MAX` or wait for window to reset.

### "Unauthorized"
If auth enabled, include credentials:
```bash
curl -u admin:password http://localhost:3000/data
```

## Advanced: WebSocket/SSE

Future enhancement: replace polling with SSE or WebSocket for real-time push.

Example structure:
```javascript
// In frontend
const sse = new EventSource('http://localhost:3000/subscribe')
sse.onmessage = (event) => {
  const data = JSON.parse(event.data)
  // Handle telemetry
}
```

## Development

Watch mode for auto-reload:
```bash
npm run dev
```

## Production

### Recommended Setup

1. **Use reverse proxy** (nginx)
   ```nginx
   location /api {
     proxy_pass http://localhost:3000;
     proxy_set_header X-Real-IP $remote_addr;
   }
   ```

2. **Enable HTTPS**
   - Self-signed cert or
   - Let's Encrypt with nginx

3. **Enable auth** in `.env`

4. **Restrict firewall**
   - Only allow trusted IPs

5. **Monitor logs**
   ```bash
   node index.js 2>&1 | tee proxy.log
   ```

## License

MIT
