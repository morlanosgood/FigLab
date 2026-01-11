"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Zap,
  Calendar,
  User,
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Globe,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PublicExperimentData {
  id: string
  name: string
  status: "running" | "completed" | "paused"
  owner: string
  startDate: string
  endDate?: string
  hypothesis: string
  primaryMetric: string
  targetLift: number
  currentLift?: number
  progress: number
  daysRemaining?: number
  updatedAt: string
}

const mockExperiment: PublicExperimentData = {
  id: "exp-001",
  name: "Mobile Upload Optimization",
  status: "running",
  owner: "Sarah Chen",
  startDate: "2024-01-15",
  hypothesis: "If we improve the mobile photo capture and upload experience, then we will increase the EDU verification completion rate because users will find it easier to submit their ID documents on mobile devices.",
  primaryMetric: "EDU Verification Rate",
  targetLift: 15,
  currentLift: 8.5,
  progress: 65,
  daysRemaining: 5,
  updatedAt: "2024-01-22T10:30:00Z",
}

const statusConfig = {
  running: {
    label: "Running",
    color: "bg-chart-3/10 text-chart-3",
    icon: Zap,
  },
  completed: {
    label: "Completed",
    color: "bg-muted text-muted-foreground",
    icon: CheckCircle2,
  },
  paused: {
    label: "Paused",
    color: "bg-chart-4/10 text-chart-4",
    icon: AlertTriangle,
  },
}

interface ExperimentPublicViewProps {
  token?: string
}

export function ExperimentPublicView({ token }: ExperimentPublicViewProps) {
  const experiment = mockExperiment
  const statusInfo = statusConfig[experiment.status]
  const StatusIcon = statusInfo.icon

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="w-4 h-4" />
            <span>Shared experiment view</span>
            <span className="text-border">•</span>
            <span>FigLab Growth OS</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{experiment.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{experiment.owner}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Started {formatDate(experiment.startDate)}</span>
                </div>
              </div>
            </div>
            <Badge className={cn("gap-1.5", statusInfo.color)}>
              <StatusIcon className="w-3.5 h-3.5" />
              {statusInfo.label}
            </Badge>
          </div>
        </div>

        {/* Status Card */}
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Progress</p>
                <div className="text-3xl font-bold text-foreground">{experiment.progress}%</div>
                <Progress value={experiment.progress} className="h-2 mt-2" />
              </div>
              <div className="text-center border-x border-border">
                <p className="text-sm text-muted-foreground mb-1">Current Lift</p>
                <div className="flex items-center justify-center gap-2">
                  <span className={cn(
                    "text-3xl font-bold",
                    experiment.currentLift && experiment.currentLift > 0 ? "text-chart-3" : "text-foreground"
                  )}>
                    {experiment.currentLift ? `+${experiment.currentLift}%` : "—"}
                  </span>
                  {experiment.currentLift && experiment.currentLift > 0 && (
                    <TrendingUp className="w-6 h-6 text-chart-3" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Target: +{experiment.targetLift}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Time Remaining</p>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-3xl font-bold text-foreground">
                    {experiment.daysRemaining ?? "—"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hypothesis */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Target className="w-5 h-5" />
              Hypothesis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{experiment.hypothesis}</p>
          </CardContent>
        </Card>

        {/* Key Metric */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Primary Metric</CardTitle>
            <CardDescription>What we're measuring to determine success</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-lg font-semibold text-foreground">{experiment.primaryMetric}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Target improvement: +{experiment.targetLift}%
                </p>
              </div>
              {experiment.currentLift !== undefined && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Current</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    experiment.currentLift >= experiment.targetLift ? "text-chart-3" : "text-chart-4"
                  )}>
                    +{experiment.currentLift}%
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Last updated {formatDate(experiment.updatedAt)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            This is a read-only view. For full access, please contact the experiment owner.
          </p>
        </div>
      </div>
    </div>
  )
}
