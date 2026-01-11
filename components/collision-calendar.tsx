"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import type { Experiment } from "@/components/lab-workspace"

interface CollisionCalendarProps {
  experiments: Experiment[]
}

interface CalendarDay {
  date: number
  experiments: Experiment[]
  hasConflict: boolean
  conflictingExperiments?: { exp1: Experiment; exp2: Experiment }
}

export function CollisionCalendar({ experiments }: CollisionCalendarProps) {
  const [hoveredConflict, setHoveredConflict] = useState<{ exp1: Experiment; exp2: Experiment } | null>(null)

  // Generate calendar for current month
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const days: CalendarDay[] = []
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear, currentMonth, i)
    const dateString = date.toISOString().split("T")[0]

    // Find experiments running on this day
    const runningExperiments = experiments.filter((exp) => {
      return dateString >= exp.startDate && dateString <= exp.endDate
    })

    // Check for conflicts (same locale, overlapping dates)
    let hasConflict = false
    let conflictingExperiments: { exp1: Experiment; exp2: Experiment } | undefined

    if (runningExperiments.length >= 2) {
      for (let j = 0; j < runningExperiments.length; j++) {
        for (let k = j + 1; k < runningExperiments.length; k++) {
          if (runningExperiments[j].locale === runningExperiments[k].locale) {
            hasConflict = true
            conflictingExperiments = { exp1: runningExperiments[j], exp2: runningExperiments[k] }
            break
          }
        }
        if (hasConflict) break
      }
    }

    days.push({
      date: i,
      experiments: runningExperiments,
      hasConflict,
      conflictingExperiments,
    })
  }

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Collision Calendar</CardTitle>
          <CardDescription>{monthName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Calendar days */}
            {days.map((day) => (
              <div
                key={day.date}
                className={`aspect-square border rounded-lg p-2 relative ${
                  day.hasConflict
                    ? "border-chart-5 bg-chart-5/10"
                    : day.experiments.length > 0
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                }`}
                onMouseEnter={() => day.conflictingExperiments && setHoveredConflict(day.conflictingExperiments)}
                onMouseLeave={() => setHoveredConflict(null)}
              >
                <div className="text-xs font-medium text-foreground">{day.date}</div>
                {day.hasConflict && <AlertTriangle className="w-3 h-3 text-chart-5 absolute top-1 right-1" />}
                {day.experiments.length > 0 && !day.hasConflict && (
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conflict Detail Panel */}
      {hoveredConflict && (
        <Card className="border-chart-5 bg-chart-5/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-chart-5" />
              <CardTitle className="text-foreground">Collision Detected</CardTitle>
            </div>
            <CardDescription>Overlapping experiments in the same locale</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-semibold text-foreground">{hoveredConflict.exp1.name}</span>
              </div>
              <div className="text-sm text-muted-foreground pl-4">
                {hoveredConflict.exp1.locale} •{" "}
                {new Date(hoveredConflict.exp1.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(hoveredConflict.exp1.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-5" />
                <span className="font-semibold text-foreground">{hoveredConflict.exp2.name}</span>
              </div>
              <div className="text-sm text-muted-foreground pl-4">
                {hoveredConflict.exp2.locale} •{" "}
                {new Date(hoveredConflict.exp2.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(hoveredConflict.exp2.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-foreground">Legend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 border border-chart-5 bg-chart-5/10 rounded" />
            <span className="text-muted-foreground">Collision detected (same locale overlap)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 border border-primary bg-primary/5 rounded" />
            <span className="text-muted-foreground">Experiments running</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 border border-border bg-card rounded" />
            <span className="text-muted-foreground">No experiments</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
