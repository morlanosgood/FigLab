"use client"

import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface SparklineProps {
  data: number[]
  color?: string
  width?: number
  height?: number
  showTrend?: boolean
  className?: string
}

export function Sparkline({
  data,
  color = "hsl(var(--primary))",
  width = 80,
  height = 24,
  showTrend = true,
  className,
}: SparklineProps) {
  const chartData = data.map((value, index) => ({ value, index }))

  // Calculate trend
  const firstHalf = data.slice(0, Math.floor(data.length / 2))
  const secondHalf = data.slice(Math.floor(data.length / 2))
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
  const trendPercent = ((secondAvg - firstAvg) / firstAvg) * 100

  const TrendIcon = trendPercent > 2 ? TrendingUp : trendPercent < -2 ? TrendingDown : Minus
  const trendColor = trendPercent > 2 ? "text-chart-3" : trendPercent < -2 ? "text-chart-5" : "text-muted-foreground"

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`sparkline-gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#sparkline-gradient-${color})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {showTrend && (
        <div className={cn("flex items-center gap-0.5 text-xs", trendColor)}>
          <TrendIcon className="w-3 h-3" />
          <span>{Math.abs(trendPercent).toFixed(0)}%</span>
        </div>
      )}
    </div>
  )
}
