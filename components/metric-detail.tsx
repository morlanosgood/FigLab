"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Edit,
  History,
  Link2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Zap,
  DollarSign,
  TrendingUp,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { Metric } from "@/components/metric-catalog"

interface MetricDetailProps {
  metricId: string
}

// Mock historical data
const historyData = [
  { date: "Jan 1", value: 10.2 },
  { date: "Jan 8", value: 10.5 },
  { date: "Jan 15", value: 11.0 },
  { date: "Jan 22", value: 11.2 },
  { date: "Jan 29", value: 11.8 },
  { date: "Feb 5", value: 12.0 },
  { date: "Feb 12", value: 12.4 },
]

// Mock linked experiments
const linkedExperiments = [
  {
    id: "exp-001",
    name: "Growth SEO Test",
    status: "running",
    impact: "+1.2%",
    startDate: "2024-01-15",
  },
  {
    id: "exp-003",
    name: "Email Nurture Sequence",
    status: "approved",
    impact: "Pending",
    startDate: "2024-01-22",
  },
  {
    id: "exp-007",
    name: "Landing Page V3",
    status: "completed",
    impact: "+0.8%",
    startDate: "2023-12-01",
  },
]

// Mock version history
const versionHistory = [
  {
    version: 3,
    date: "2024-01-15",
    author: "Sarah Chen",
    changes: "Updated formula to exclude bot traffic",
  },
  {
    version: 2,
    date: "2023-11-20",
    author: "Michael Torres",
    changes: "Added mobile/desktop segmentation",
  },
  {
    version: 1,
    date: "2023-09-01",
    author: "Sarah Chen",
    changes: "Initial metric definition",
  },
]

const mockMetric: Metric = {
  id: "metric-001",
  name: "signup_conversion_rate",
  displayName: "Signup Conversion Rate",
  description: "Percentage of landing page visitors who complete account creation. This metric is the primary indicator of top-of-funnel health and is influenced by landing page design, copy, and load performance.",
  formula: "(signups / landing_page_visits) * 100",
  unit: "percentage",
  direction: "increase",
  dataSource: "Mixpanel",
  owner: "Sarah Chen",
  tags: ["growth", "acquisition", "funnel"],
  category: "acquisition",
  status: "active",
  currentValue: 12.4,
  previousValue: 11.2,
  goal: {
    target: 15,
    timeframe: "quarterly",
    progress: 82,
  },
  qualityScore: 95,
  lastCalculated: new Date(Date.now() - 1000 * 60 * 30),
  experimentCount: 8,
}

const categoryIcons: Record<Metric["category"], React.ElementType> = {
  acquisition: Users,
  activation: Zap,
  retention: Clock,
  revenue: DollarSign,
  referral: ArrowUpRight,
}

export function MetricDetail({ metricId }: MetricDetailProps) {
  const metric = mockMetric
  const CategoryIcon = categoryIcons[metric.category]
  const change = metric.currentValue - metric.previousValue
  const changePercent = ((change / metric.previousValue) * 100).toFixed(1)
  const isPositive = metric.direction === "increase" ? change > 0 : change < 0

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <Link href="/metrics" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Metrics
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CategoryIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{metric.displayName}</h1>
                <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">
                  {metric.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{metric.name}</p>
            </div>
          </div>
        </div>
        <Button variant="outline">
          <Edit className="w-4 h-4 mr-2" />
          Edit Metric
        </Button>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Current Value</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">{metric.currentValue}%</span>
              <div className={cn("flex items-center gap-0.5 text-sm", isPositive ? "text-chart-3" : "text-chart-5")}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{changePercent}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {metric.goal && (
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Goal ({metric.goal.timeframe})</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{metric.goal.target}%</span>
                <span className="text-sm text-muted-foreground">{metric.goal.progress}% there</span>
              </div>
              <Progress value={metric.goal.progress} className="h-1.5 mt-2" />
            </CardContent>
          </Card>
        )}

        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Data Quality</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-foreground">{metric.qualityScore}%</span>
              <CheckCircle2 className="w-5 h-5 text-chart-3" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last updated 30 min ago</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Linked Experiments</p>
            <span className="text-3xl font-bold text-foreground">{metric.experimentCount}</span>
            <p className="text-xs text-muted-foreground mt-1">3 running, 5 completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experiments">Experiments</TabsTrigger>
          <TabsTrigger value="history">Version History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Description */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{metric.description}</p>

              {metric.formula && (
                <div className="p-3 rounded-lg bg-muted font-mono text-sm">
                  <span className="text-muted-foreground">Formula: </span>
                  <span className="text-foreground">{metric.formula}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {metric.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trend Chart */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Trend</CardTitle>
              <CardDescription>Last 8 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[8, 16]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    {metric.goal && (
                      <ReferenceLine
                        y={metric.goal.target}
                        stroke="hsl(var(--chart-3))"
                        strokeDasharray="5 5"
                        label={{ value: "Goal", position: "right", fill: "hsl(var(--chart-3))" }}
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Owner</span>
                  <span className="text-foreground font-medium">{metric.owner}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data Source</span>
                  <span className="text-foreground font-medium">{metric.dataSource}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span className="text-foreground font-medium capitalize">{metric.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Direction</span>
                  <span className="text-foreground font-medium capitalize">{metric.direction}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unit</span>
                  <span className="text-foreground font-medium capitalize">{metric.unit}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Data Quality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-3" />
                    <span className="text-sm text-foreground">Data freshness</span>
                  </div>
                  <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">Excellent</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-3" />
                    <span className="text-sm text-foreground">Formula validated</span>
                  </div>
                  <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-3" />
                    <span className="text-sm text-foreground">Documentation</span>
                  </div>
                  <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-chart-4" />
                    <span className="text-sm text-foreground">Segment coverage</span>
                  </div>
                  <Badge variant="secondary" className="bg-chart-4/10 text-chart-4">Partial</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="experiments" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Linked Experiments</CardTitle>
              <CardDescription>Experiments measuring this metric</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {linkedExperiments.map((exp) => (
                  <Link key={exp.id} href={`/experiments/${exp.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          exp.status === "running" && "bg-chart-3 animate-pulse",
                          exp.status === "approved" && "bg-chart-4",
                          exp.status === "completed" && "bg-muted-foreground"
                        )} />
                        <div>
                          <p className="text-sm font-medium text-foreground">{exp.name}</p>
                          <p className="text-xs text-muted-foreground">Started {exp.startDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="capitalize">{exp.status}</Badge>
                        <span className={cn(
                          "text-sm font-medium",
                          exp.impact.startsWith("+") ? "text-chart-3" : "text-muted-foreground"
                        )}>
                          {exp.impact}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Version History</CardTitle>
              <CardDescription>Changes to metric definition over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {versionHistory.map((version, idx) => (
                  <div key={version.version} className="relative pl-6 pb-4 last:pb-0">
                    {idx < versionHistory.length - 1 && (
                      <div className="absolute left-[9px] top-4 bottom-0 w-px bg-border" />
                    )}
                    <div className="absolute left-0 top-1 w-[18px] h-[18px] rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary">{version.version}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{version.changes}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {version.author} • {version.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
