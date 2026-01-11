"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Target } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Priority {
  name: string
  experimentCount: number
  status: "covered" | "partial" | "gap"
}

interface FocusCardProps {
  priorities: Priority[]
  className?: string
}

export function FocusCard({ priorities, className }: FocusCardProps) {
  const covered = priorities.filter((p) => p.status === "covered").length
  const partial = priorities.filter((p) => p.status === "partial").length
  const gaps = priorities.filter((p) => p.status === "gap")
  const total = priorities.length

  const coveragePercent = ((covered + partial * 0.5) / total) * 100
  const status = coveragePercent >= 80 ? "good" : coveragePercent >= 50 ? "warning" : "critical"

  return (
    <Link href="/strategy">
      <Card className={cn("border-border bg-card hover:border-primary/50 transition-colors cursor-pointer h-full", className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Focus</CardTitle>
            <Target className="w-4 h-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{covered + partial}</span>
            <span className="text-xl text-muted-foreground">/ {total}</span>
            <span className="text-sm text-muted-foreground">priorities</span>
          </div>

          {/* Mini coverage dots */}
          <div className="flex items-center gap-1.5">
            {priorities.map((priority, index) => (
              <div
                key={index}
                className={cn(
                  "w-4 h-4 rounded-sm",
                  priority.status === "covered" && "bg-chart-3",
                  priority.status === "partial" && "bg-chart-4",
                  priority.status === "gap" && "bg-muted"
                )}
                title={`${priority.name}: ${priority.experimentCount} experiments`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {gaps.length > 0 ? `${gaps.length} gap${gaps.length > 1 ? "s" : ""} to address` : "All priorities covered"}
            </span>
            <StatusIndicator status={status} size="sm" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
