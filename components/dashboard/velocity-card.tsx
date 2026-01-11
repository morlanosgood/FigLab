"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkline } from "@/components/ui/sparkline"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Zap } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface VelocityCardProps {
  currentWeekly: number
  target: number
  trend: number[]
  className?: string
}

export function VelocityCard({ currentWeekly, target, trend, className }: VelocityCardProps) {
  const percentOfTarget = (currentWeekly / target) * 100
  const status = percentOfTarget >= 100 ? "good" : percentOfTarget >= 80 ? "warning" : "critical"
  const statusLabel = percentOfTarget >= 100 ? "On track" : percentOfTarget >= 80 ? "Slightly behind" : "Behind target"

  return (
    <Link href="/reports?tab=velocity">
      <Card className={cn("border-border bg-card hover:border-primary/50 transition-colors cursor-pointer h-full", className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Velocity</CardTitle>
            <Zap className="w-4 h-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{currentWeekly}</span>
            <span className="text-sm text-muted-foreground">/week</span>
          </div>

          <Sparkline
            data={trend}
            color="hsl(var(--primary))"
            width={100}
            height={28}
            showTrend={true}
          />

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">vs {target} target</span>
            <StatusIndicator status={status} size="sm" showLabel label={statusLabel} />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
