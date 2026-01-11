"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Calendar,
  ArrowRight,
  Clock,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle2,
  MoreHorizontal,
  GripVertical,
  TrendingUp,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface PrioritizedExperiment {
  id: string
  name: string
  owner: string
  status: "backlog" | "planned" | "ready" | "running"
  priority: number
  impact: "low" | "medium" | "high"
  confidence: "low" | "medium" | "high"
  effort: "low" | "medium" | "high"
  iceScore: number
  plannedWeek?: number
  category: string
  description: string
}

const mockExperiments: PrioritizedExperiment[] = [
  {
    id: "exp-001",
    name: "Mobile Upload Optimization",
    owner: "Sarah Chen",
    status: "running",
    priority: 1,
    impact: "high",
    confidence: "high",
    effort: "medium",
    iceScore: 8.5,
    plannedWeek: 1,
    category: "EDU Funnel",
    description: "Improve mobile photo capture and upload experience",
  },
  {
    id: "exp-002",
    name: "Trust Signals on Upload",
    owner: "Michael Torres",
    status: "ready",
    priority: 2,
    impact: "high",
    confidence: "medium",
    effort: "low",
    iceScore: 7.8,
    plannedWeek: 2,
    category: "EDU Funnel",
    description: "Add security badges and privacy messaging",
  },
  {
    id: "exp-003",
    name: "Alternative ID Methods",
    owner: "Jessica Park",
    status: "planned",
    priority: 3,
    impact: "high",
    confidence: "medium",
    effort: "high",
    iceScore: 6.2,
    plannedWeek: 3,
    category: "EDU Funnel",
    description: "Support additional ID formats for UK students",
  },
  {
    id: "exp-004",
    name: "SEO Landing Page V3",
    owner: "David Kim",
    status: "planned",
    priority: 4,
    impact: "medium",
    confidence: "high",
    effort: "medium",
    iceScore: 6.0,
    plannedWeek: 3,
    category: "Acquisition",
    description: "New hero section and CTA placement",
  },
  {
    id: "exp-005",
    name: "Email Personalization",
    owner: "Emily Watson",
    status: "backlog",
    priority: 5,
    impact: "medium",
    confidence: "medium",
    effort: "medium",
    iceScore: 5.5,
    category: "Retention",
    description: "Dynamic content based on user behavior",
  },
  {
    id: "exp-006",
    name: "Pricing Page Redesign",
    owner: "Sarah Chen",
    status: "backlog",
    priority: 6,
    impact: "high",
    confidence: "low",
    effort: "high",
    iceScore: 4.8,
    category: "Revenue",
    description: "Simplify pricing tiers and highlight value",
  },
  {
    id: "exp-007",
    name: "Referral Program V2",
    owner: "Michael Torres",
    status: "backlog",
    priority: 7,
    impact: "medium",
    confidence: "low",
    effort: "high",
    iceScore: 3.5,
    category: "Growth",
    description: "Enhanced referral incentives and tracking",
  },
]

const weeks = [
  { number: 1, label: "Week 1", startDate: "Jan 15" },
  { number: 2, label: "Week 2", startDate: "Jan 22" },
  { number: 3, label: "Week 3", startDate: "Jan 29" },
  { number: 4, label: "Week 4", startDate: "Feb 5" },
]

const impactColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-chart-4/10 text-chart-4",
  high: "bg-chart-3/10 text-chart-3",
}

const statusColors = {
  backlog: "bg-muted text-muted-foreground",
  planned: "bg-chart-4/10 text-chart-4",
  ready: "bg-chart-2/10 text-chart-2",
  running: "bg-chart-3/10 text-chart-3",
}

interface ExperimentRowProps {
  experiment: PrioritizedExperiment
  index: number
  isDragging: boolean
  dragOverIndex: number | null
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
  onDrop: (index: number) => void
}

function ExperimentRow({
  experiment,
  index,
  isDragging,
  dragOverIndex,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
}: ExperimentRowProps) {
  const isOver = dragOverIndex === index

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      onDrop={() => onDrop(index)}
      className={cn(
        "flex items-center gap-4 p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-all group",
        isDragging && "opacity-50",
        isOver && "border-primary border-2 bg-primary/5"
      )}
    >
      <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
        {index + 1}
      </div>

      <div className="flex-1 min-w-0">
        <Link href={`/experiments/${experiment.id}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
          <p className="text-sm font-medium text-foreground truncate">{experiment.name}</p>
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{experiment.owner}</span>
          <span className="text-muted-foreground">•</span>
          <Badge variant="outline" className="text-xs h-5">
            {experiment.category}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Impact</p>
          <Badge className={cn("capitalize", impactColors[experiment.impact])}>
            {experiment.impact}
          </Badge>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Confidence</p>
          <Badge className={cn("capitalize", impactColors[experiment.confidence])}>
            {experiment.confidence}
          </Badge>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Effort</p>
          <Badge className={cn("capitalize", impactColors[experiment.effort === "high" ? "low" : experiment.effort === "low" ? "high" : "medium"])}>
            {experiment.effort}
          </Badge>
        </div>
        <div className="text-center w-16">
          <p className="text-xs text-muted-foreground mb-1">ICE Score</p>
          <span className="text-lg font-bold text-primary">{experiment.iceScore}</span>
        </div>
        <Badge className={cn("capitalize w-20 justify-center", statusColors[experiment.status])}>
          {experiment.status}
        </Badge>
      </div>

      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal className="w-4 h-4" />
      </Button>
    </div>
  )
}

function CalendarCard({ experiment }: { experiment: PrioritizedExperiment }) {
  return (
    <div className="p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-foreground line-clamp-2">{experiment.name}</p>
        <Badge className={cn("text-xs shrink-0", statusColors[experiment.status])}>
          {experiment.status}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{experiment.owner}</span>
        <span>•</span>
        <span className="text-primary font-medium">ICE: {experiment.iceScore}</span>
      </div>
    </div>
  )
}

export function RoadmapView() {
  const [view, setView] = useState<"priority" | "calendar">("priority")
  const [experiments, setExperiments] = useState(mockExperiments)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const scheduledExperiments = experiments.filter((e) => e.plannedWeek)
  const backlogExperiments = experiments.filter((e) => e.status === "backlog")

  // Summary stats
  const runningCount = experiments.filter((e) => e.status === "running").length
  const plannedCount = experiments.filter((e) => e.status === "planned" || e.status === "ready").length
  const avgIceScore = (experiments.reduce((acc, e) => acc + e.iceScore, 0) / experiments.length).toFixed(1)

  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const handleDrop = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) return

    const newExperiments = [...experiments]
    const [draggedItem] = newExperiments.splice(dragIndex, 1)
    newExperiments.splice(dropIndex, 0, draggedItem)

    // Update priorities based on new order
    const updatedExperiments = newExperiments.map((exp, idx) => ({
      ...exp,
      priority: idx + 1,
    }))

    setExperiments(updatedExperiments)
    setDragIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Roadmap</h1>
          <p className="text-muted-foreground mt-1">Prioritize and schedule experiments</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            New Experiment
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Roadmap Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground">Running</p>
                <p className="text-xl font-bold text-chart-3">{runningCount}</p>
              </div>
              <Zap className="w-6 h-6 text-chart-3 opacity-50" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground">Planned</p>
                <p className="text-xl font-bold text-chart-4">{plannedCount}</p>
              </div>
              <Calendar className="w-6 h-6 text-chart-4 opacity-50" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground">Backlog</p>
                <p className="text-xl font-bold text-foreground">{backlogExperiments.length}</p>
              </div>
              <Clock className="w-6 h-6 text-muted-foreground opacity-50" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground">Avg ICE Score</p>
                <p className="text-xl font-bold text-primary">{avgIceScore}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-primary opacity-50" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Tabs */}
      <Tabs value={view} onValueChange={(v) => setView(v as "priority" | "calendar")} className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="priority">Priority Queue</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        {/* Priority Queue View */}
        <TabsContent value="priority" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Prioritized Experiments</CardTitle>
                  <CardDescription>Drag to reorder priorities. ICE Score = (Impact × Confidence) / Effort</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Target className="w-4 h-4 mr-2" />
                  Recalculate Scores
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {experiments.map((experiment, index) => (
                <ExperimentRow
                  key={experiment.id}
                  experiment={experiment}
                  index={index}
                  isDragging={dragIndex === index}
                  dragOverIndex={dragOverIndex}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {weeks.map((week) => {
              const weekExperiments = scheduledExperiments.filter((e) => e.plannedWeek === week.number)
              return (
                <div key={week.number} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{week.label}</h3>
                      <p className="text-xs text-muted-foreground">{week.startDate}</p>
                    </div>
                    {week.number === 1 && (
                      <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">Current</Badge>
                    )}
                  </div>
                  <div className="space-y-2 min-h-[200px] p-2 rounded-lg bg-muted/50 border border-dashed border-border">
                    {weekExperiments.map((experiment) => (
                      <CalendarCard key={experiment.id} experiment={experiment} />
                    ))}
                    {weekExperiments.length === 0 && (
                      <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                        Drop experiments here
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Backlog */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Backlog</CardTitle>
              <CardDescription>Experiments not yet scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {backlogExperiments.map((experiment) => (
                  <CalendarCard key={experiment.id} experiment={experiment} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
