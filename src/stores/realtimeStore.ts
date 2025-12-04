import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { 
  ExtendedTelemetryData, 
  ConnectionQuality, 
  RealtimeState 
} from '../types/enhanced'

// ============================================================================
// REALTIME STORE - WebSocket and streaming data
// ============================================================================

const MAX_STREAMING_HISTORY = 100 // Keep last 100 readings for live view

interface RealtimeStore extends RealtimeState {
  // Actions
  connect: (deviceId: string, url?: string) => void
  disconnect: () => void
  setConnected: (connected: boolean) => void
  setConnectionQuality: (quality: ConnectionQuality) => void
  addReading: (reading: ExtendedTelemetryData) => void
  pause: () => void
  resume: () => void
  clearHistory: () => void
  setFPS: (fps: number) => void
  
  // WebSocket instance (not persisted)
  ws: WebSocket | null
  setWebSocket: (ws: WebSocket | null) => void
}

export const useRealtimeStore = create<RealtimeStore>()(
  immer((set, get) => ({
    // Initial state
    isConnected: false,
    connectionQuality: 'disconnected',
    latestReading: null,
    streamingHistory: [],
    isPaused: false,
    fps: 0,
    lastUpdate: new Date().toISOString(),
    ws: null,
    
    // Connect to WebSocket
    connect: (deviceId, url) => {
      const wsUrl = url || `ws://192.168.4.1/ws`
      
      try {
        const ws = new WebSocket(wsUrl)
        
        ws.onopen = () => {
          console.log('WebSocket connected')
          set({
            isConnected: true,
            connectionQuality: 'excellent',
          })
          
          // Send initial message to subscribe to device
          ws.send(JSON.stringify({
            type: 'subscribe',
            deviceId,
          }))
        }
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            
            // Handle different message types
            if (data.type === 'telemetry') {
              get().addReading(data.payload)
            } else if (data.type === 'status') {
              get().setConnectionQuality(data.quality || 'good')
            }
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          set({ connectionQuality: 'poor' })
        }
        
        ws.onclose = () => {
          console.log('WebSocket closed')
          set({
            isConnected: false,
            connectionQuality: 'disconnected',
            ws: null,
          })
          
          // Auto-reconnect logic
          setTimeout(() => {
            if (!get().isConnected && !get().isPaused) {
              console.log('Attempting to reconnect...')
              get().connect(deviceId, url)
            }
          }, 5000)
        }
        
        set({ ws })
      } catch (error) {
        console.error('Failed to create WebSocket:', error)
        set({
          isConnected: false,
          connectionQuality: 'disconnected',
        })
      }
    },
    
    // Disconnect WebSocket
    disconnect: () => {
      const { ws } = get()
      if (ws) {
        ws.close()
        set({
          ws: null,
          isConnected: false,
          connectionQuality: 'disconnected',
        })
      }
    },
    
    // Set connection status
    setConnected: (connected) => {
      set({ isConnected: connected })
    },
    
    // Set connection quality
    setConnectionQuality: (quality) => {
      set({ connectionQuality: quality })
    },
    
    // Add new telemetry reading
    addReading: (reading) => {
      if (get().isPaused) return
      
      set(state => {
        state.latestReading = reading
        state.streamingHistory.push(reading)
        state.lastUpdate = new Date().toISOString()
        
        // Keep only last N readings
        if (state.streamingHistory.length > MAX_STREAMING_HISTORY) {
          state.streamingHistory = state.streamingHistory.slice(-MAX_STREAMING_HISTORY)
        }
      })
      
      // Calculate FPS
      const now = Date.now()
      const last = new Date(get().lastUpdate).getTime()
      const fps = Math.round(1000 / (now - last))
      set({ fps: isFinite(fps) ? fps : 0 })
    },
    
    // Pause streaming
    pause: () => {
      set({ isPaused: true })
    },
    
    // Resume streaming
    resume: () => {
      set({ isPaused: false })
    },
    
    // Clear history
    clearHistory: () => {
      set({
        streamingHistory: [],
        latestReading: null,
      })
    },
    
    // Set FPS
    setFPS: (fps) => {
      set({ fps })
    },
    
    // Set WebSocket instance
    setWebSocket: (ws) => {
      set({ ws })
    },
  }))
)

// Selector hooks
export const useLatestReading = () => useRealtimeStore(state => state.latestReading)
export const useConnectionStatus = () => useRealtimeStore(state => ({
  isConnected: state.isConnected,
  quality: state.connectionQuality,
}))
export const useStreamingHistory = () => useRealtimeStore(state => state.streamingHistory)
