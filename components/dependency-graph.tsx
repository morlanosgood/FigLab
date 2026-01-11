"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Link2, X, Plus, ArrowRight, Ban, CheckCircle2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ExperimentNode {
  id: string
  name: string
  status: "draft" | "pending" | "approved" | "running" | "completed"
  owner: string
}

interface Dependency {
  id: string
  fromId: string
  toId: string
  type: "requires" | "excludes" | "sequence"
  reason?: string
}

interface Collision {
  id: string
  experimentIds: string[]
  type: "audience_overlap" | "metric_conflict" | "timing_conflict"
  severity: "warning" | "error"
  message: string
}

const mockExperiments: ExperimentNode[] = [
  { id: "exp-001", name: "Mobile Upload Optimization", status: "running", owner: "Sarah Chen" },
  { id: "exp-002", name: "Trust Signals on Upload", status: "approved", owner: "Michael Torres" },
  { id: "exp-003", name: "Alternative ID Methods", status: "pending", owner: "Jessica Park" },
  { id: "exp-004", name: "SEO Landing Page V3", status: "running", owner: "David Kim" },
  { id: "exp-005", name: "Pricing Page Redesign", status: "draft", owner: "Emily Watson" },
]

const mockDependencies: Dependency[] = [
  { id: "dep-1", fromId: "exp-002", toId: "exp-001", type: "sequence", reason: "Trust signals depend on upload flow changes" },
  { id: "dep-2", fromId: "exp-003", toId: "exp-001", type: "sequence", reason: "Alternative methods extend mobile optimization" },
  { id: "dep-3", fromId: "exp-004", toId: "exp-005", type: "excludes", reason: "Cannot run both pricing changes simultaneously" },
]

const mockCollisions: Collision[] = [
  {
    id: "col-1",
    experimentIds: ["exp-001", "exp-002"],
    type: "audience_overlap",
    severity: "warning",
    message: "Both experiments target EDU upload users (85% overlap)",
  },
  {
    id: "col-2",
    experimentIds: ["exp-004", "exp-005"],
    type: "metric_conflict",
    severity: "error",
    message: "Both experiments affect signup conversion rate",
  },
]

const statusColors: Record<ExperimentNode["status"], string> = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-chart-4/10 text-chart-4",
  approved: "bg-chart-2/10 text-chart-2",
  running: "bg-chart-3/10 text-chart-3",
  completed: "bg-muted text-muted-foreground",
}

const dependencyTypeIcons = {
  requires: ArrowRight,
  excludes: Ban,
  sequence: Clock,
}

const dependencyTypeLabels = {
  requires: "Requires",
  excludes: "Excludes",
  sequence: "Runs After",
}

interface DependencyGraphProps {
  experimentId?: string
  showCollisions?: boolean
}

export function DependencyGraph({ experimentId, showCollisions = true }: DependencyGraphProps) {
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(experimentId || null)

  // Get dependencies for selected experiment
  const relatedDependencies = selectedExperiment
    ? mockDependencies.filter((d) => d.fromId === selectedExperiment || d.toId === selectedExperiment)
    : mockDependencies

  // Get collisions for selected experiment
  const relatedCollisions = selectedExperiment
    ? mockCollisions.filter((c) => c.experimentIds.includes(selectedExperiment))
    : mockCollisions

  const getExperiment = (id: string) => mockExperiments.find((e) => e.id === id)

  return (
    <div className="space-y-6">
      {/* Collision Alerts */}
      {showCollisions && relatedCollisions.length > 0 && (
        <div className="space-y-3">
          {relatedCollisions.map((collision) => (
            <div
              key={collision.id}
              className={cn(
                "flex items-start gap-3 p-4 rounded-lg border",
                collision.severity === "error"
                  ? "bg-destructive/5 border-destructive"
                  : "bg-chart-4/5 border-chart-4"
              )}
            >
              <AlertTriangle
                className={cn(
                  "w-5 h-5 mt-0.5 flex-shrink-0",
                  collision.severity === "error" ? "text-destructive" : "text-chart-4"
                )}
              />
              <div className="flex-1">
                <p className={cn(
                  "text-sm font-medium",
                  collision.severity === "error" ? "text-destructive" : "text-chart-4"
                )}>
                  {collision.type === "audience_overlap" && "Audience Overlap Detected"}
                  {collision.type === "metric_conflict" && "Metric Conflict"}
                  {collision.type === "timing_conflict" && "Timing Conflict"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{collision.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  {collision.experimentIds.map((id) => {
                    const exp = getExperiment(id)
                    return exp ? (
                      <Badge key={id} variant="outline" className="text-xs">
                        {exp.name}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Resolve
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Dependencies List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Dependencies & Exclusions</CardTitle>
              <CardDescription>Define relationships between experiments</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Dependency
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {relatedDependencies.length === 0 ? (
            <div className="text-center py-8">
              <Link2 className="w-8 h-8 mx-auto text-muted-foreground opacity-50 mb-2" />
              <p className="text-sm text-muted-foreground">No dependencies defined</p>
            </div>
          ) : (
            relatedDependencies.map((dep) => {
              const fromExp = getExperiment(dep.fromId)
              const toExp = getExperiment(dep.toId)
              const TypeIcon = dependencyTypeIcons[dep.type]

              if (!fromExp || !toExp) return null

              return (
                <div
                  key={dep.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/30"
                >
                  {/* From Experiment */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/experiments/${fromExp.id}`} className="hover:underline">
                      <p className="text-sm font-medium text-foreground truncate">{fromExp.name}</p>
                    </Link>
                    <Badge className={cn("text-xs mt-1", statusColors[fromExp.status])}>
                      {fromExp.status}
                    </Badge>
                  </div>

                  {/* Dependency Type */}
                  <div className="flex flex-col items-center gap-1 px-4">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      dep.type === "excludes" ? "bg-destructive/10" : "bg-primary/10"
                    )}>
                      <TypeIcon className={cn(
                        "w-4 h-4",
                        dep.type === "excludes" ? "text-destructive" : "text-primary"
                      )} />
                    </div>
                    <span className="text-xs text-muted-foreground">{dependencyTypeLabels[dep.type]}</span>
                  </div>

                  {/* To Experiment */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/experiments/${toExp.id}`} className="hover:underline">
                      <p className="text-sm font-medium text-foreground truncate">{toExp.name}</p>
                    </Link>
                    <Badge className={cn("text-xs mt-1", statusColors[toExp.status])}>
                      {toExp.status}
                    </Badge>
                  </div>

                  {/* Remove */}
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Visual Graph (Simplified) */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Experiment Network</CardTitle>
          <CardDescription>Visual overview of experiment relationships</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-[300px] bg-muted/30 rounded-lg border border-dashed border-border flex items-center justify-center">
            {/* Simplified node visualization */}
            <div className="flex flex-wrap gap-4 justify-center p-6">
              {mockExperiments.map((exp, idx) => {
                const isSelected = selectedExperiment === exp.id
                const hasCollision = mockCollisions.some((c) => c.experimentIds.includes(exp.id))
                const hasDependency = mockDependencies.some((d) => d.fromId === exp.id || d.toId === exp.id)

                return (
                  <button
                    key={exp.id}
                    onClick={() => setSelectedExperiment(isSelected ? null : exp.id)}
                    className={cn(
                      "relative px-4 py-3 rounded-lg border-2 transition-all text-left",
                      isSelected
                        ? "border-primary bg-primary/5 scale-105"
                        : "border-border bg-card hover:border-primary/50",
                      hasCollision && !isSelected && "ring-2 ring-chart-4/50"
                    )}
                  >
                    {hasDependency && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary" />
                    )}
                    <p className="text-sm font-medium text-foreground">{exp.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={cn("text-xs", statusColors[exp.status])}>
                        {exp.status}
                      </Badge>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Click an experiment to see its dependencies. Blue dots indicate linked experiments.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
