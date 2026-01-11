"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface CoverageCell {
  experimentCount: number
  winRate: number
  status: "active" | "gap" | "covered"
}

interface CoverageMapData {
  priorities: string[]
  funnelStages: string[]
  matrix: Record<string, Record<string, CoverageCell>>
}

interface CoverageMapProps {
  data: CoverageMapData
  compact?: boolean
  className?: string
}

export function CoverageMap({ data, compact = false, className }: CoverageMapProps) {
  const getCellColor = (cell: CoverageCell) => {
    if (cell.status === "gap" || cell.experimentCount === 0) {
      return "bg-muted/50 border-dashed border-muted-foreground/30"
    }
    if (cell.experimentCount >= 3) {
      return "bg-primary/30 border-primary/50"
    }
    if (cell.experimentCount >= 1) {
      return "bg-primary/15 border-primary/30"
    }
    return "bg-muted/30 border-border"
  }

  const getCellSize = () => {
    return compact ? "w-10 h-10" : "w-14 h-14"
  }

  return (
    <Card className={cn("border-border bg-card", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Strategic Coverage</CardTitle>
          <Link href="/strategy" className="text-xs text-primary hover:underline">
            View full map →
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground pb-2 pr-2"></th>
                {data.funnelStages.map((stage) => (
                  <th key={stage} className="text-center text-xs font-medium text-muted-foreground pb-2 px-1">
                    {compact ? stage.slice(0, 3) : stage}
                  </th>
                ))}
                <th className="text-center text-xs font-medium text-muted-foreground pb-2 pl-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.priorities.map((priority) => {
                const rowTotal = data.funnelStages.reduce((sum, stage) => {
                  return sum + (data.matrix[priority]?.[stage]?.experimentCount || 0)
                }, 0)

                return (
                  <tr key={priority}>
                    <td className="text-xs font-medium text-foreground pr-2 py-1 whitespace-nowrap">
                      {compact ? priority.split(" ")[0] : priority}
                    </td>
                    {data.funnelStages.map((stage) => {
                      const cell = data.matrix[priority]?.[stage] || {
                        experimentCount: 0,
                        winRate: 0,
                        status: "gap" as const,
                      }

                      return (
                        <td key={stage} className="px-1 py-1">
                          <Link
                            href={`/experiments?priority=${encodeURIComponent(priority)}&stage=${encodeURIComponent(stage)}`}
                            className={cn(
                              "flex items-center justify-center rounded border transition-colors hover:ring-2 hover:ring-primary/50",
                              getCellSize(),
                              getCellColor(cell)
                            )}
                            title={`${priority} × ${stage}: ${cell.experimentCount} experiments`}
                          >
                            {cell.experimentCount > 0 ? (
                              <span className="text-xs font-medium text-foreground">{cell.experimentCount}</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </Link>
                        </td>
                      )
                    })}
                    <td className="pl-2 py-1">
                      <Badge variant="secondary" className="text-xs">
                        {rowTotal}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-border">
                <td className="text-xs font-medium text-muted-foreground pt-2 pr-2">Total</td>
                {data.funnelStages.map((stage) => {
                  const colTotal = data.priorities.reduce((sum, priority) => {
                    return sum + (data.matrix[priority]?.[stage]?.experimentCount || 0)
                  }, 0)
                  return (
                    <td key={stage} className="text-center pt-2 px-1">
                      <span className="text-xs font-medium text-foreground">{colTotal}</span>
                    </td>
                  )
                })}
                <td className="pl-2 pt-2">
                  <Badge className="text-xs bg-primary text-primary-foreground">
                    {data.priorities.reduce((sum, priority) => {
                      return (
                        sum +
                        data.funnelStages.reduce((stageSum, stage) => {
                          return stageSum + (data.matrix[priority]?.[stage]?.experimentCount || 0)
                        }, 0)
                      )
                    }, 0)}
                  </Badge>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-muted/50 border border-dashed border-muted-foreground/30" />
            <span className="text-xs text-muted-foreground">Gap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-primary/15 border border-primary/30" />
            <span className="text-xs text-muted-foreground">1-2</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-primary/30 border border-primary/50" />
            <span className="text-xs text-muted-foreground">3+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
