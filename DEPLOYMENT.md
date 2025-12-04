# DEPLOYMENT.md

## Local Deployment (Development)

### Prerequisites
- Node.js v16+
- ESP32 device with telemetry firmware

### Quick Start

```bash
# Terminal 1: Frontend
npm install
npm run dev
# Open http://localhost:5173

# Terminal 2 (optional): Proxy
cd proxy
npm install
node index.js
# Proxy runs on http://localhost:3000
```

## Production Deployment

### Frontend Build

```bash
npm run build
# Creates dist/ folder with static files
```

### Serve with NGINX

```nginx
server {
    listen 80;
    server_name soildash.local;
    root /var/www/soildash/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Serve with Express (Node.js)

```javascript
import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))

// Serve static files
app.use(express.static(join(__dirname, 'dist')))

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist/index.html'))
})

app.listen(80)
```

### Docker Deployment

**Dockerfile (Frontend)**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Dockerfile (Proxy)**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY proxy/package*.json ./
RUN npm install
COPY proxy/index.js .
EXPOSE 3000
CMD ["node", "index.js"]
```

**docker-compose.yml**
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - proxy

  proxy:
    build:
      context: .
      dockerfile: Dockerfile.proxy
    ports:
      - "3000:3000"
    environment:
      DEVICE_IP: 192.168.4.1
      DEVICE_PORT: 80
      ENABLE_AUTH: "false"
```

Run:
```bash
docker-compose up -d
```

## Remote Access

### Option 1: ngrok (Quick, Temporary)

```bash
# Terminal 1: Frontend + Proxy
npm run dev
cd proxy && node index.js

# Terminal 2: Expose with ngrok
ngrok http 5173
# Get public URL, share with team
```

### Option 2: SSH Tunnel (Secure)

```bash
# On server with SoilDash
ssh -R 5173:localhost:5173 user@external-server

# On client
ssh -L 5173:localhost:5173 user@server-ip
# Then open http://localhost:5173
```

### Option 3: VPN (Best for Team)

Use Tailscale or WireGuard for encrypted local network access:

```bash
# Install Tailscale on server and clients
curl -fsSL https://tailscale.com/install.sh | sh

# Enable on server
sudo tailscale up

# Connect from client
tailscale up
# Access at tailscale IP: http://<server-tailscale-ip>:5173
```

### Option 4: Cloud Hosting

Deploy to Vercel, Netlify, or AWS:

**Vercel (Frontend)**
```bash
npm install -g vercel
vercel
```

**AWS (Full Stack)**
```bash
# Frontend: S3 + CloudFront
# Proxy: Lambda + API Gateway or EC2

# See AWS documentation
```

## Security Checklist

- [ ] Enable HTTPS (Let's Encrypt, self-signed, or reverse proxy)
- [ ] Enable proxy authentication
- [ ] Restrict firewall to trusted IPs
- [ ] Use VPN for remote access (don't expose device directly)
- [ ] Enable rate limiting in proxy
- [ ] Set strong credentials
- [ ] Monitor logs for suspicious activity
- [ ] Keep Node.js updated
- [ ] Keep dependencies updated: `npm audit fix`

## Performance Optimization

### Frontend
```bash
# Build analysis
npm run build -- --analyze

# Lazy load components
import { lazy, Suspense } from 'react'
const Charts = lazy(() => import('./pages/Charts'))

# Use React.memo for expensive components
```

### Proxy
- Increase `RATE_LIMIT_MAX` for high-frequency polling
- Add caching layer (Redis)
- Use gzip compression
- Deploy behind CDN

## Monitoring

### Application Logging

**Frontend** - Browser console:
```javascript
console.log('Event:', event)
```

**Proxy** - File logging:
```bash
# Redirect logs
node index.js >> logs/proxy.log 2>&1

# Monitor in real-time
tail -f logs/proxy.log
```

### System Monitoring

Use PM2 for process management:
```bash
npm install -g pm2

# Start proxy with PM2
pm2 start proxy/index.js --name soildash-proxy

# Monitor
pm2 monit
```

## Troubleshooting Deployment

### Port Already in Use
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Device Unreachable
```bash
# Check network
ping 192.168.4.1

# Check device endpoint
curl http://192.168.4.1/data

# Check proxy config
curl http://localhost:3000/health
```

### CORS Errors
- Ensure proxy is running
- Check frontend points to `/api/data` not direct IP
- Verify proxy CORS config

### High Memory Usage
- Check polling interval (increase if too frequent)
- Limit history size in code
- Monitor for memory leaks
- Restart periodically if needed

## Backup & Recovery

### Backup Settings & History

Settings stored in localStorage. To export:
```javascript
// In browser console
localStorage.getItem('soildash_settings')
localStorage.getItem('soildash_history')
```

### Import Settings

```javascript
localStorage.setItem('soildash_settings', JSON.stringify({...}))
location.reload()
```

## License

MIT - See LICENSE file
