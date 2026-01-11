"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { TrendingUp } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ImpactCardProps {
  cumulativeValue: number
  unit: "currency" | "percentage"
  quarterlyGoal: number
  period?: string
  className?: string
}

export function ImpactCard({
  cumulativeValue,
  unit,
  quarterlyGoal,
  period = "QTD",
  className,
}: ImpactCardProps) {
  const progressPercent = Math.min((cumulativeValue / quarterlyGoal) * 100, 100)
  const status = progressPercent >= 80 ? "good" : progressPercent >= 50 ? "warning" : "critical"

  const formatValue = (value: number) => {
    if (unit === "currency") {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`
      }
      if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`
      }
      return `$${value}`
    }
    return `${value}%`
  }

  return (
    <Link href="/reports?tab=attribution">
      <Card className={cn("border-border bg-card hover:border-primary/50 transition-colors cursor-pointer h-full", className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Impact</CardTitle>
            <TrendingUp className="w-4 h-4 text-chart-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-chart-3">+{formatValue(cumulativeValue)}</span>
          </div>

          <div className="space-y-1.5">
            <Progress value={progressPercent} className="h-2 [&>div]:bg-chart-3" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{period}</span>
              <span className="font-medium text-foreground">{progressPercent.toFixed(0)}% to goal</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">Goal: {formatValue(quarterlyGoal)}</span>
            <StatusIndicator status={status} size="sm" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
