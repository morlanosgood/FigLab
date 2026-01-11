"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Clock, ShieldAlert, ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type AttentionType = "blocked" | "ready_to_ship" | "stale" | "guardrail"

interface AttentionItem {
  id: string
  type: AttentionType
  experimentName: string
  experimentId: string
  context: string
  age: string
  priority: "high" | "medium" | "low"
}

interface AttentionRequiredProps {
  items: AttentionItem[]
  className?: string
}

const typeConfig: Record<AttentionType, { icon: typeof AlertTriangle; color: string; bgColor: string; label: string; actionLabel: string }> = {
  blocked: {
    icon: AlertTriangle,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
    label: "Blocked",
    actionLabel: "Review",
  },
  ready_to_ship: {
    icon: CheckCircle2,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    label: "Ready to Ship",
    actionLabel: "Ship",
  },
  stale: {
    icon: Clock,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    label: "Needs Decision",
    actionLabel: "Decide",
  },
  guardrail: {
    icon: ShieldAlert,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
    label: "Guardrail Alert",
    actionLabel: "Investigate",
  },
}

export function AttentionRequired({ items, className }: AttentionRequiredProps) {
  if (items.length === 0) {
    return (
      <Card className={cn("border-border bg-card", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Attention Required</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <CheckCircle2 className="w-4 h-4 text-chart-3" />
            <span>All clear! No items need attention.</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort by priority
  const sortedItems = [...items].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <Card className={cn("border-border bg-card", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Attention Required</CardTitle>
          <Badge variant="secondary" className="bg-chart-5/10 text-chart-5">
            {items.length} item{items.length !== 1 && "s"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedItems.slice(0, 4).map((item) => {
          const config = typeConfig[item.type]
          const Icon = config.icon

          return (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", config.bgColor)}>
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/experiments/${item.experimentId}`}
                      className="text-sm font-medium text-foreground hover:underline truncate"
                    >
                      {item.experimentName}
                    </Link>
                    <Badge variant="outline" className={cn("text-xs", config.color)}>
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.context}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.age}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                <Link href={`/experiments/${item.experimentId}`}>
                  {config.actionLabel}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </div>
          )
        })}

        {items.length > 4 && (
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" asChild>
            <Link href="/experiments?filter=attention">
              View all {items.length} items
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
