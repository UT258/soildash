import React from 'react'
import { useDeviceStore } from '../../stores/deviceStore'
import { useAlertStore } from '../../stores/alertStore'
import { useTheme } from '../../providers/ThemeProvider'
import { Bell, Sun, Moon, Settings as SettingsIcon, Menu, Wifi, WifiOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRealtimeStore } from '../../stores/realtimeStore'

interface TopNavProps {
  onMenuClick: () => void
}

export const TopNav: React.FC<TopNavProps> = ({ onMenuClick }) => {
  const { devices, selectedDeviceId, selectDevice } = useDeviceStore()
  const { unreadCount } = useAlertStore()
  const { theme, setTheme } = useTheme()
  const { isConnected, connectionQuality } = useRealtimeStore()
  
  const getConnectionIcon = () => {
    if (!isConnected) return <WifiOff className="w-4 h-4 text-red-500" />
    return <Wifi className="w-4 h-4 text-green-500" />
  }
  
  const getConnectionText = () => {
    if (!isConnected) return 'Offline'
    return connectionQuality.charAt(0).toUpperCase() + connectionQuality.slice(1)
  }
  
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left - Mobile menu + Device selector */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedDeviceId || ''}
            onChange={(e) => selectDevice(e.target.value || null)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select device...</option>
            {devices.map(device => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
          
          {/* Connection indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {getConnectionIcon()}
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {getConnectionText()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Link
          to="/alerts"
          className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </Link>
        
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'auto' : 'dark')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title={`Current: ${theme}`}
        >
          {theme === 'dark' ? (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
        
        {/* Settings */}
        <Link
          to="/settings"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Link>
      </div>
    </header>
  )
}
