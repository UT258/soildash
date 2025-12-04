import React, { useEffect, useRef, memo } from 'react'
import { motion, animate } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { TelemetryStats } from '../../types/enhanced'

// ============================================================================
// ADVANCED KPI CARD - With sparklines, trends, animated numbers
// ============================================================================

interface KPICardProps {
  title: string
  value: number
  unit: string
  icon: React.ReactNode
  stats: TelemetryStats
  color?: string
  isLive?: boolean
  isDanger?: boolean
  lastUpdate?: string
  formatValue?: (value: number) => string
  className?: string
}

export const KPICard: React.FC<KPICardProps> = memo(({
  title,
  value,
  unit,
  icon,
  stats,
  color = '#22c55e',
  isLive = false,
  isDanger = false,
  lastUpdate,
  formatValue = (v: number) => v.toFixed(1),
  className = '',
}) => {
  const prevValue = useRef(value)
  const [displayValue, setDisplayValue] = React.useState(value)
  
  // Animate number changes (reduced duration for performance)
  useEffect(() => {
    const controls = animate(prevValue.current, value, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(latest)
      },
    })
    
    prevValue.current = value
    return controls.stop
  }, [value])
  
  // Get trend indicator
  const getTrendIcon = () => {
    if (stats.trend === 'up') return <TrendingUp className="w-4 h-4" />
    if (stats.trend === 'down') return <TrendingDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }
  
  const getTrendColor = () => {
    if (stats.trend === 'up') return 'text-green-500'
    if (stats.trend === 'down') return 'text-red-500'
    return 'text-gray-400'
  }
  
  return (
    <div
      className={`
        relative overflow-hidden
        bg-white dark:bg-gray-800
        rounded-2xl border border-gray-200 dark:border-gray-700
        p-6 
        shadow-card hover:shadow-card-hover
        transition-all duration-300
        ${isDanger ? 'ring-2 ring-red-500 animate-glow-pulse' : ''}
        ${className}
      `}
    >
      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          <motion.div
            className="w-2 h-2 bg-green-500 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs font-medium text-green-500">LIVE</span>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="p-2.5 rounded-xl"
            style={{ 
              backgroundColor: `${color}15`,
              color: color 
            }}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </h3>
          </div>
        </div>
      </div>
      
      {/* Main value */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <motion.span 
            key={value}
            className="text-4xl font-bold text-gray-900 dark:text-white"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {formatValue(displayValue)}
          </motion.span>
          <span className="text-xl text-gray-500 dark:text-gray-400">
            {unit}
          </span>
        </div>
      </div>
      
      {/* Stats row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm">
          {/* Min */}
          <div>
            <span className="text-gray-500 dark:text-gray-400">Min:</span>{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {formatValue(stats.min)}
            </span>
          </div>
          
          {/* Max */}
          <div>
            <span className="text-gray-500 dark:text-gray-400">Max:</span>{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {formatValue(stats.max)}
            </span>
          </div>
          
          {/* Avg */}
          <div>
            <span className="text-gray-500 dark:text-gray-400">Avg:</span>{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {formatValue(stats.avg)}
            </span>
          </div>
        </div>
        
        {/* Trend */}
        <div className={`flex items-center gap-1 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-medium">
            {Math.abs(stats.trendValue).toFixed(1)}%
          </span>
        </div>
      </div>
      
      {/* Sparkline */}
      <div className="mb-3">
        <MiniSparkline 
          data={stats.sparklineData} 
          color={color}
          height={40}
        />
      </div>
      
      {/* Last update */}
      {lastUpdate && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3" />
          <span>Updated {formatDistanceToNow(new Date(lastUpdate), { addSuffix: true })}</span>
        </div>
      )}
    </div>
  )
})
KPICard.displayName = 'KPICard'

// ============================================================================
// MINI SPARKLINE - Inline chart for KPI cards
// ============================================================================

interface MiniSparklineProps {
  data: number[]
  color?: string
  height?: number
  showDots?: boolean
}

export const MiniSparkline: React.FC<MiniSparklineProps> = ({
  data,
  color = '#22c55e',
  height = 40,
  showDots = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)
    
    // Calculate dimensions
    const padding = 2
    const width = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2
    
    // Get min/max for scaling
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    
    // Calculate points
    const points = data.map((value, index) => ({
      x: padding + (index / (data.length - 1)) * width,
      y: padding + chartHeight - ((value - min) / range) * chartHeight,
    }))
    
    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, rect.height)
    gradient.addColorStop(0, `${color}40`)
    gradient.addColorStop(1, `${color}00`)
    
    ctx.beginPath()
    ctx.moveTo(points[0].x, rect.height)
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.lineTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.lineTo(points[points.length - 1].x, rect.height)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()
    
    // Draw line
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    points.forEach(point => {
      ctx.lineTo(point.x, point.y)
    })
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    
    // Draw dots
    if (showDots) {
      points.forEach(point => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      })
    }
    
    // Draw last value dot
    const lastPoint = points[points.length - 1]
    ctx.beginPath()
    ctx.arc(lastPoint.x, lastPoint.y, 3, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5
    ctx.stroke()
    
  }, [data, color, showDots])
  
  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: `${height}px` }}
    />
  )
}

// ============================================================================
// KPI GRID - Responsive grid layout for KPI cards
// ============================================================================

interface KPIGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export const KPIGrid: React.FC<KPIGridProps> = ({
  children,
  columns = 3,
  className = '',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }
  
  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {children}
    </div>
  )
}

// ============================================================================
// SKELETON LOADER for KPI Card
// ============================================================================

export const KPICardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
      
      <div className="mb-4">
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      
      <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      
      <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}
