"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CoverageMap } from "@/components/dashboard/coverage-map"
import {
  Target,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Mock data for the coverage map
const mockCoverageData = {
  priorities: ["EDU Growth", "Enterprise", "Virality", "Monetization", "Mobile"],
  funnelStages: ["Acquisition", "Activation", "Retention", "Revenue"],
  matrix: {
    "EDU Growth": {
      Acquisition: { experimentCount: 3, winRate: 67, status: "covered" as const },
      Activation: { experimentCount: 2, winRate: 50, status: "active" as const },
      Retention: { experimentCount: 0, winRate: 0, status: "gap" as const },
      Revenue: { experimentCount: 0, winRate: 0, status: "gap" as const },
    },
    Enterprise: {
      Acquisition: { experimentCount: 1, winRate: 100, status: "active" as const },
      Activation: { experimentCount: 2, winRate: 50, status: "active" as const },
      Retention: { experimentCount: 2, winRate: 50, status: "active" as const },
      Revenue: { experimentCount: 1, winRate: 0, status: "active" as const },
    },
    Virality: {
      Acquisition: { experimentCount: 0, winRate: 0, status: "gap" as const },
      Activation: { experimentCount: 0, winRate: 0, status: "gap" as const },
      Retention: { experimentCount: 0, winRate: 0, status: "gap" as const },
      Revenue: { experimentCount: 0, winRate: 0, status: "gap" as const },
    },
    Monetization: {
      Acquisition: { experimentCount: 1, winRate: 100, status: "active" as const },
      Activation: { experimentCount: 1, winRate: 0, status: "active" as const },
      Retention: { experimentCount: 2, winRate: 100, status: "covered" as const },
      Revenue: { experimentCount: 3, winRate: 33, status: "covered" as const },
    },
    Mobile: {
      Acquisition: { experimentCount: 1, winRate: 100, status: "active" as const },
      Activation: { experimentCount: 0, winRate: 0, status: "gap" as const },
      Retention: { experimentCount: 0, winRate: 0, status: "gap" as const },
      Revenue: { experimentCount: 0, winRate: 0, status: "gap" as const },
    },
  },
}

// Mock OKR data
const mockOKRs = [
  {
    id: "okr-1",
    objective: "Grow EDU segment by 50%",
    keyResults: [
      { name: "Increase EDU verification rate to 25%", current: 14, target: 25, experiments: 5 },
      { name: "Reduce EDU funnel drop-off by 30%", current: 15, target: 30, experiments: 3 },
      { name: "Launch in 3 new markets", current: 1, target: 3, experiments: 0 },
    ],
    status: "on_track" as const,
  },
  {
    id: "okr-2",
    objective: "Improve enterprise conversion",
    keyResults: [
      { name: "Increase trial-to-paid rate to 15%", current: 8.2, target: 15, experiments: 2 },
      { name: "Reduce sales cycle by 20%", current: 10, target: 20, experiments: 1 },
    ],
    status: "at_risk" as const,
  },
  {
    id: "okr-3",
    objective: "Drive viral growth",
    keyResults: [
      { name: "Increase referral rate to 25%", current: 18, target: 25, experiments: 0 },
      { name: "Launch social sharing features", current: 0, target: 100, experiments: 0 },
    ],
    status: "behind" as const,
  },
]

// Mock priority data
const mockPriorities = [
  { name: "EDU Growth", experiments: 5, coverage: 40, status: "partial" as const },
  { name: "Enterprise", experiments: 6, coverage: 75, status: "covered" as const },
  { name: "Virality", experiments: 0, coverage: 0, status: "gap" as const },
  { name: "Monetization", experiments: 7, coverage: 85, status: "covered" as const },
  { name: "Mobile", experiments: 1, coverage: 25, status: "partial" as const },
]

export function StrategyView() {
  const totalGaps = mockPriorities.filter((p) => p.status === "gap").length
  const totalCovered = mockPriorities.filter((p) => p.status === "covered").length

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Strategy</h1>
          <p className="text-muted-foreground mt-1">Strategic priorities and experiment coverage</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Priority
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">{mockPriorities.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-chart-3" />
              <span className="text-2xl font-bold text-chart-3">{totalCovered}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-chart-5" />
              <span className="text-2xl font-bold text-chart-5">{totalGaps}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Experiments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                {mockPriorities.reduce((sum, p) => sum + p.experiments, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coverage Map - Full Width */}
      <CoverageMap data={mockCoverageData} compact={false} />

      {/* OKR Alignment */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">OKR Alignment</CardTitle>
          <CardDescription>How experiments map to quarterly objectives</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mockOKRs.map((okr) => (
            <div key={okr.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-foreground">{okr.objective}</h4>
                  <Badge
                    variant="secondary"
                    className={cn(
                      okr.status === "on_track" && "bg-chart-3/10 text-chart-3",
                      okr.status === "at_risk" && "bg-chart-4/10 text-chart-4",
                      okr.status === "behind" && "bg-chart-5/10 text-chart-5"
                    )}
                  >
                    {okr.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 pl-4 border-l-2 border-border">
                {okr.keyResults.map((kr, idx) => {
                  const progress = (kr.current / kr.target) * 100
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{kr.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {kr.experiments} exp
                          </Badge>
                          <span className="font-medium text-foreground">
                            {kr.current}% / {kr.target}%
                          </span>
                        </div>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Priority Details */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Priority Details</CardTitle>
          <CardDescription>Experiment allocation by strategic priority</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPriorities.map((priority) => (
              <div
                key={priority.name}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      priority.status === "covered" && "bg-chart-3",
                      priority.status === "partial" && "bg-chart-4",
                      priority.status === "gap" && "bg-chart-5"
                    )}
                  />
                  <div>
                    <p className="font-medium text-foreground">{priority.name}</p>
                    <p className="text-sm text-muted-foreground">{priority.experiments} active experiments</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{priority.coverage}%</p>
                    <p className="text-xs text-muted-foreground">coverage</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/experiments?priority=${encodeURIComponent(priority.name)}`}>
                      View
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
