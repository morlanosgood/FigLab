"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  AlertTriangle,
  TrendingDown,
  Lightbulb,
  Users,
  FileCheck,
  Upload,
  CheckCircle2,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface FunnelStep {
  id: number
  name: string
  icon: React.ElementType
  visitors: number
  conversionRate: number
  dropOffRate: number
  isCritical?: boolean
}

const funnelSteps: FunnelStep[] = [
  {
    id: 1,
    name: "Landing Page Visit",
    icon: Users,
    visitors: 50000,
    conversionRate: 100,
    dropOffRate: 0,
  },
  {
    id: 2,
    name: "Account Creation",
    icon: FileCheck,
    visitors: 28500,
    conversionRate: 57,
    dropOffRate: 43,
  },
  {
    id: 3,
    name: "Identity Upload",
    icon: Upload,
    visitors: 8550,
    conversionRate: 17,
    dropOffRate: 70,
    isCritical: true,
  },
  {
    id: 4,
    name: "Verification Success",
    icon: CheckCircle2,
    visitors: 6840,
    conversionRate: 14,
    dropOffRate: 20,
  },
]

const knownIssues = [
  {
    title: "File Upload UX Friction",
    description: "Users confused by accepted file formats and size limits",
    impact: "High",
  },
  {
    title: "Privacy Concerns",
    description: "70% of drop-offs occur before file upload, indicating trust issues",
    impact: "Critical",
  },
  {
    title: "Mobile Upload Difficulty",
    description: "Mobile conversion rate 45% lower than desktop for this step",
    impact: "High",
  },
  {
    title: "Slow Processing Time",
    description: "Average wait time of 3.2 minutes causing abandonment",
    impact: "Medium",
  },
]

export function EduFunnel() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground text-balance">EDU Funnel Analytics</h1>
        <p className="text-muted-foreground mt-1">Student verification rates and lifecycle analysis</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">50,000</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-3">6,840</div>
            <p className="text-xs text-muted-foreground mt-1">14% conversion rate</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Drop-off</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-5">70%</div>
            <p className="text-xs text-muted-foreground mt-1">At identity upload step</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Time to Verify</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">8.4min</div>
            <p className="text-xs text-muted-foreground mt-1">From landing to success</p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Visualization */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Verification Funnel</CardTitle>
          <CardDescription>Step-by-step conversion analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          {funnelSteps.map((step, index) => {
            const StepIcon = step.icon
            const isLast = index === funnelSteps.length - 1

            return (
              <div key={step.id}>
                <div className="space-y-4">
                  {/* Step Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          step.isCritical
                            ? "bg-chart-5/10 border border-chart-5"
                            : "bg-primary/10 border border-primary/30"
                        }`}
                      >
                        <StepIcon className={`w-5 h-5 ${step.isCritical ? "text-chart-5" : "text-primary"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">
                            Step {step.id}: {step.name}
                          </h4>
                          {step.isCritical && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Critical Drop-off
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.visitors.toLocaleString()} visitors • {step.conversionRate}% of total
                        </p>
                      </div>
                    </div>
                    {step.isCritical && (
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Propose Fix
                      </Button>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Progress
                      value={step.conversionRate}
                      className={`h-6 ${step.isCritical ? "[&>div]:bg-chart-5" : "[&>div]:bg-primary"}`}
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{step.visitors.toLocaleString()} users</span>
                      {step.dropOffRate > 0 && (
                        <div className="flex items-center gap-1 text-chart-5">
                          <TrendingDown className="w-3 h-3" />
                          <span className="font-medium">{step.dropOffRate}% drop-off</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Critical Issues Callout */}
                  {step.isCritical && (
                    <div className="p-4 rounded-lg bg-chart-5/5 border border-chart-5/20 space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-chart-5" />
                        <h5 className="font-semibold text-foreground">Why users drop off here</h5>
                      </div>
                      <ul className="space-y-2 pl-7">
                        <li className="text-sm text-muted-foreground">
                          • Privacy concerns - users hesitant to upload sensitive documents
                        </li>
                        <li className="text-sm text-muted-foreground">
                          • Poor file format communication - users don't know what to upload
                        </li>
                        <li className="text-sm text-muted-foreground">
                          • Mobile experience - difficult to take/upload photos on mobile devices
                        </li>
                        <li className="text-sm text-muted-foreground">
                          • Long processing times - average 3.2 minute wait causes abandonment
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Arrow between steps */}
                {!isLast && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Known Issues */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Known Issues</CardTitle>
          <CardDescription>Identified friction points requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {knownIssues.map((issue, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-border bg-muted/30 flex items-start justify-between gap-4"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-semibold text-foreground text-sm">{issue.title}</h5>
                    <Badge
                      variant="secondary"
                      className={
                        issue.impact === "Critical"
                          ? "bg-chart-5/10 text-chart-5"
                          : issue.impact === "High"
                            ? "bg-chart-4/10 text-chart-4"
                            : "bg-muted text-muted-foreground"
                      }
                    >
                      {issue.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{issue.description}</p>
                </div>
                <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                  Create Test
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cohort Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Device Breakdown</CardTitle>
            <CardDescription>Conversion by device type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Desktop</span>
                <span className="font-semibold text-foreground">22% conversion</span>
              </div>
              <Progress value={22} className="h-2 [&>div]:bg-chart-3" />
              <p className="text-xs text-muted-foreground">28,000 visitors</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Mobile</span>
                <span className="font-semibold text-chart-5">8% conversion</span>
              </div>
              <Progress value={8} className="h-2 [&>div]:bg-chart-5" />
              <p className="text-xs text-muted-foreground">20,000 visitors</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tablet</span>
                <span className="font-semibold text-foreground">12% conversion</span>
              </div>
              <Progress value={12} className="h-2" />
              <p className="text-xs text-muted-foreground">2,000 visitors</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Time to Completion</CardTitle>
            <CardDescription>Distribution of completion times</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{"< 5 minutes"}</span>
                <span className="font-semibold text-chart-3">42%</span>
              </div>
              <Progress value={42} className="h-2 [&>div]:bg-chart-3" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">5-10 minutes</span>
                <span className="font-semibold text-foreground">35%</span>
              </div>
              <Progress value={35} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">10-15 minutes</span>
                <span className="font-semibold text-foreground">18%</span>
              </div>
              <Progress value={18} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{"> 15 minutes"}</span>
                <span className="font-semibold text-chart-5">5%</span>
              </div>
              <Progress value={5} className="h-2 [&>div]:bg-chart-5" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
