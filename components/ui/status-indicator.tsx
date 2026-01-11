"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, AlertTriangle, XCircle, Minus } from "lucide-react"

type StatusType = "good" | "warning" | "critical" | "neutral"

interface StatusIndicatorProps {
  status: StatusType
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  label?: string
  className?: string
}

const statusConfig: Record<StatusType, { color: string; bgColor: string; icon: typeof CheckCircle2; label: string }> = {
  good: {
    color: "text-chart-3",
    bgColor: "bg-chart-3",
    icon: CheckCircle2,
    label: "On Track",
  },
  warning: {
    color: "text-chart-4",
    bgColor: "bg-chart-4",
    icon: AlertTriangle,
    label: "At Risk",
  },
  critical: {
    color: "text-chart-5",
    bgColor: "bg-chart-5",
    icon: XCircle,
    label: "Critical",
  },
  neutral: {
    color: "text-muted-foreground",
    bgColor: "bg-muted-foreground",
    icon: Minus,
    label: "Neutral",
  },
}

const sizeConfig = {
  sm: { dot: "w-2 h-2", icon: "w-3 h-3", text: "text-xs" },
  md: { dot: "w-3 h-3", icon: "w-4 h-4", text: "text-sm" },
  lg: { dot: "w-4 h-4", icon: "w-5 h-5", text: "text-base" },
}

export function StatusIndicator({
  status,
  size = "md",
  showLabel = false,
  label,
  className,
}: StatusIndicatorProps) {
  const config = statusConfig[status]
  const sizes = sizeConfig[size]

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className={cn("rounded-full", sizes.dot, config.bgColor)} />
      {showLabel && (
        <span className={cn(sizes.text, config.color, "font-medium")}>
          {label || config.label}
        </span>
      )}
    </div>
  )
}

export function StatusIcon({
  status,
  size = "md",
  showLabel = false,
  label,
  className,
}: StatusIndicatorProps) {
  const config = statusConfig[status]
  const sizes = sizeConfig[size]
  const Icon = config.icon

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Icon className={cn(sizes.icon, config.color)} />
      {showLabel && (
        <span className={cn(sizes.text, config.color, "font-medium")}>
          {label || config.label}
        </span>
      )}
    </div>
  )
}
