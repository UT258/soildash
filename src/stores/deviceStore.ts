import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Device, DeviceStatus, ConnectionQuality } from '../types/enhanced'

// ============================================================================
// DEVICE STORE - Multi-device management
// ============================================================================

interface DeviceStore {
  // State
  devices: Device[]
  selectedDeviceId: string | null
  isLoading: boolean
  error: string | null
  
  // Computed
  selectedDevice: () => Device | null
  onlineDevices: () => Device[]
  offlineDevices: () => Device[]
  deviceCount: () => number
  
  // Actions
  addDevice: (device: Omit<Device, 'id' | 'lastSeen'>) => Promise<void>
  updateDevice: (id: string, updates: Partial<Device>) => void
  removeDevice: (id: string) => Promise<void>
  selectDevice: (id: string | null) => void
  updateDeviceStatus: (id: string, status: DeviceStatus) => void
  updateConnectionQuality: (id: string, quality: ConnectionQuality) => void
  syncDevices: () => Promise<void>
  refreshDevice: (id: string) => Promise<void>
  
  // Bulk operations
  removeMultipleDevices: (ids: string[]) => Promise<void>
  updateMultipleDevices: (updates: Array<{ id: string; updates: Partial<Device> }>) => void
}

export const useDeviceStore = create<DeviceStore>()(
  persist(
    immer((set, get) => ({
      // Initial state
      devices: [],
      selectedDeviceId: null,
      isLoading: false,
      error: null,
      
      // Computed getters
      selectedDevice: () => {
        const { devices, selectedDeviceId } = get()
        return devices.find(d => d.id === selectedDeviceId) || null
      },
      
      onlineDevices: () => {
        return get().devices.filter(d => d.status !== 'OFFLINE')
      },
      
      offlineDevices: () => {
        return get().devices.filter(d => d.status === 'OFFLINE')
      },
      
      deviceCount: () => get().devices.length,
      
      // Add new device
      addDevice: async (deviceData) => {
        set({ isLoading: true, error: null })
        
        try {
          const newDevice: Device = {
            ...deviceData,
            id: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            lastSeen: new Date().toISOString(),
          }
          
          set(state => {
            state.devices.push(newDevice)
            // Auto-select first device
            if (state.devices.length === 1) {
              state.selectedDeviceId = newDevice.id
            }
          })
          
          set({ isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add device',
            isLoading: false 
          })
        }
      },
      
      // Update existing device
      updateDevice: (id, updates) => {
        set(state => {
          const deviceIndex = state.devices.findIndex(d => d.id === id)
          if (deviceIndex !== -1) {
            state.devices[deviceIndex] = {
              ...state.devices[deviceIndex],
              ...updates,
            }
          }
        })
      },
      
      // Remove device
      removeDevice: async (id) => {
        set({ isLoading: true, error: null })
        
        try {
          set(state => {
            state.devices = state.devices.filter(d => d.id !== id)
            // If removed device was selected, select first available
            if (state.selectedDeviceId === id) {
              state.selectedDeviceId = state.devices[0]?.id || null
            }
          })
          
          set({ isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to remove device',
            isLoading: false 
          })
        }
      },
      
      // Select device
      selectDevice: (id) => {
        set({ selectedDeviceId: id })
      },
      
      // Update device status
      updateDeviceStatus: (id, status) => {
        set(state => {
          const device = state.devices.find(d => d.id === id)
          if (device) {
            device.status = status
            device.lastSeen = new Date().toISOString()
          }
        })
      },
      
      // Update connection quality
      updateConnectionQuality: (id, quality) => {
        set(state => {
          const device = state.devices.find(d => d.id === id)
          if (device) {
            device.connectionQuality = quality
          }
        })
      },
      
      // Sync all devices
      syncDevices: async () => {
        set({ isLoading: true, error: null })
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Update last seen for all online devices
          set(state => {
            const now = new Date().toISOString()
            state.devices.forEach(device => {
              if (device.status !== 'OFFLINE') {
                device.lastSeen = now
              }
            })
          })
          
          set({ isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to sync devices',
            isLoading: false 
          })
        }
      },
      
      // Refresh single device
      refreshDevice: async (id) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500))
          
          set(state => {
            const device = state.devices.find(d => d.id === id)
            if (device) {
              device.lastSeen = new Date().toISOString()
            }
          })
        } catch (error) {
          console.error('Failed to refresh device:', error)
        }
      },
      
      // Bulk remove
      removeMultipleDevices: async (ids) => {
        set({ isLoading: true, error: null })
        
        try {
          set(state => {
            state.devices = state.devices.filter(d => !ids.includes(d.id))
            // Reset selection if needed
            if (ids.includes(state.selectedDeviceId || '')) {
              state.selectedDeviceId = state.devices[0]?.id || null
            }
          })
          
          set({ isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to remove devices',
            isLoading: false 
          })
        }
      },
      
      // Bulk update
      updateMultipleDevices: (updates) => {
        set(state => {
          updates.forEach(({ id, updates: deviceUpdates }) => {
            const device = state.devices.find(d => d.id === id)
            if (device) {
              Object.assign(device, deviceUpdates)
            }
          })
        })
      },
    })),
    {
      name: 'device-storage',
      partialize: (state) => ({
        devices: state.devices,
        selectedDeviceId: state.selectedDeviceId,
      }),
    }
  )
)

// Selector hooks for common queries
export const useSelectedDevice = () => useDeviceStore(state => state.selectedDevice())
export const useOnlineDevices = () => useDeviceStore(state => state.onlineDevices())
export const useDeviceCount = () => useDeviceStore(state => state.deviceCount())
