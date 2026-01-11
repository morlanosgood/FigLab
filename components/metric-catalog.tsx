"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  BarChart3,
  Users,
  DollarSign,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface Metric {
  id: string
  name: string
  displayName: string
  description: string
  formula?: string
  unit: "percentage" | "count" | "currency" | "duration" | "ratio"
  direction: "increase" | "decrease"
  dataSource: string
  owner: string
  tags: string[]
  category: "acquisition" | "activation" | "retention" | "revenue" | "referral"
  status: "active" | "draft" | "deprecated"
  currentValue: number
  previousValue: number
  goal?: {
    target: number
    timeframe: "weekly" | "monthly" | "quarterly"
    progress: number
  }
  qualityScore: number
  lastCalculated: Date
  experimentCount: number
}

const mockMetrics: Metric[] = [
  {
    id: "metric-001",
    name: "signup_conversion_rate",
    displayName: "Signup Conversion Rate",
    description: "Percentage of landing page visitors who complete account creation",
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
  },
  {
    id: "metric-002",
    name: "edu_verification_rate",
    displayName: "EDU Verification Rate",
    description: "Percentage of students who complete identity verification",
    formula: "(verified_students / verification_starts) * 100",
    unit: "percentage",
    direction: "increase",
    dataSource: "SheerID",
    owner: "Michael Torres",
    tags: ["edu", "verification", "funnel"],
    category: "activation",
    status: "active",
    currentValue: 14,
    previousValue: 12.5,
    goal: {
      target: 25,
      timeframe: "quarterly",
      progress: 56,
    },
    qualityScore: 88,
    lastCalculated: new Date(Date.now() - 1000 * 60 * 60),
    experimentCount: 5,
  },
  {
    id: "metric-003",
    name: "day_30_retention",
    displayName: "Day 30 Retention",
    description: "Percentage of users active 30 days after signup",
    formula: "(active_day_30 / signups) * 100",
    unit: "percentage",
    direction: "increase",
    dataSource: "PostHog",
    owner: "Jessica Park",
    tags: ["retention", "engagement"],
    category: "retention",
    status: "active",
    currentValue: 42,
    previousValue: 45,
    goal: {
      target: 50,
      timeframe: "quarterly",
      progress: 84,
    },
    qualityScore: 92,
    lastCalculated: new Date(Date.now() - 1000 * 60 * 60 * 24),
    experimentCount: 12,
  },
  {
    id: "metric-004",
    name: "trial_to_paid_conversion",
    displayName: "Trial to Paid Conversion",
    description: "Percentage of trial users who convert to paid plans",
    formula: "(paid_conversions / trial_starts) * 100",
    unit: "percentage",
    direction: "increase",
    dataSource: "Stripe",
    owner: "David Kim",
    tags: ["monetization", "conversion"],
    category: "revenue",
    status: "active",
    currentValue: 8.2,
    previousValue: 7.8,
    goal: {
      target: 12,
      timeframe: "quarterly",
      progress: 68,
    },
    qualityScore: 98,
    lastCalculated: new Date(Date.now() - 1000 * 60 * 15),
    experimentCount: 6,
  },
  {
    id: "metric-005",
    name: "avg_time_to_value",
    displayName: "Avg Time to Value",
    description: "Average time from signup to first meaningful action",
    unit: "duration",
    direction: "decrease",
    dataSource: "Mixpanel",
    owner: "Emily Watson",
    tags: ["activation", "onboarding"],
    category: "activation",
    status: "active",
    currentValue: 4.5,
    previousValue: 5.2,
    qualityScore: 85,
    lastCalculated: new Date(Date.now() - 1000 * 60 * 60 * 2),
    experimentCount: 3,
  },
  {
    id: "metric-006",
    name: "referral_rate",
    displayName: "Referral Rate",
    description: "Percentage of users who invite at least one team member",
    unit: "percentage",
    direction: "increase",
    dataSource: "Internal",
    owner: "Sarah Chen",
    tags: ["growth", "viral"],
    category: "referral",
    status: "draft",
    currentValue: 18,
    previousValue: 16,
    qualityScore: 72,
    lastCalculated: new Date(Date.now() - 1000 * 60 * 60 * 48),
    experimentCount: 2,
  },
]

const categoryIcons: Record<Metric["category"], React.ElementType> = {
  acquisition: Users,
  activation: Zap,
  retention: Clock,
  revenue: DollarSign,
  referral: ArrowUpRight,
}

const categoryColors: Record<Metric["category"], string> = {
  acquisition: "text-chart-1 bg-chart-1/10",
  activation: "text-chart-2 bg-chart-2/10",
  retention: "text-chart-3 bg-chart-3/10",
  revenue: "text-chart-4 bg-chart-4/10",
  referral: "text-chart-5 bg-chart-5/10",
}

function formatUnit(value: number, unit: Metric["unit"]): string {
  switch (unit) {
    case "percentage":
      return `${value}%`
    case "currency":
      return `$${value.toLocaleString()}`
    case "duration":
      return `${value} min`
    case "count":
      return value.toLocaleString()
    case "ratio":
      return `${value}x`
    default:
      return String(value)
  }
}

function MetricCard({ metric }: { metric: Metric }) {
  const CategoryIcon = categoryIcons[metric.category]
  const change = metric.currentValue - metric.previousValue
  const changePercent = ((change / metric.previousValue) * 100).toFixed(1)
  const isPositive = metric.direction === "increase" ? change > 0 : change < 0

  return (
    <Link href={`/metrics/${metric.id}`}>
      <Card className="border-border bg-card hover:border-primary/50 transition-colors cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", categoryColors[metric.category])}>
                <CategoryIcon className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-foreground">{metric.displayName}</CardTitle>
                <p className="text-xs text-muted-foreground">{metric.dataSource}</p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs",
                metric.status === "active" && "bg-chart-3/10 text-chart-3",
                metric.status === "draft" && "bg-chart-4/10 text-chart-4",
                metric.status === "deprecated" && "bg-muted text-muted-foreground"
              )}
            >
              {metric.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Value */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {formatUnit(metric.currentValue, metric.unit)}
              </span>
              <div className={cn("flex items-center gap-0.5 text-sm", isPositive ? "text-chart-3" : "text-chart-5")}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{changePercent}%</span>
              </div>
            </div>
          </div>

          {/* Goal Progress */}
          {metric.goal && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Goal: {formatUnit(metric.goal.target, metric.unit)}</span>
                <span className="font-medium text-foreground">{metric.goal.progress}%</span>
              </div>
              <Progress value={metric.goal.progress} className="h-1.5" />
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <span>{metric.experimentCount} experiments</span>
            <div className="flex items-center gap-1">
              <span className={cn("w-1.5 h-1.5 rounded-full", metric.qualityScore >= 90 ? "bg-chart-3" : metric.qualityScore >= 70 ? "bg-chart-4" : "bg-chart-5")} />
              <span>Quality: {metric.qualityScore}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function MetricCatalog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Metric["category"] | "all">("all")

  const filteredMetrics = mockMetrics.filter((metric) => {
    const matchesSearch =
      metric.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || metric.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories: { value: Metric["category"] | "all"; label: string }[] = [
    { value: "all", label: "All Metrics" },
    { value: "acquisition", label: "Acquisition" },
    { value: "activation", label: "Activation" },
    { value: "retention", label: "Retention" },
    { value: "revenue", label: "Revenue" },
    { value: "referral", label: "Referral" },
  ]

  // Summary stats
  const activeMetrics = mockMetrics.filter((m) => m.status === "active").length
  const metricsWithGoals = mockMetrics.filter((m) => m.goal).length
  const avgQuality = Math.round(mockMetrics.reduce((acc, m) => acc + m.qualityScore, 0) / mockMetrics.length)

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Metric Catalog</h1>
          <p className="text-muted-foreground mt-1">Centralized metric definitions and goal tracking</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Metric
        </Button>
      </div>

      {/* Summary Stats */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Metrics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground">Active Metrics</p>
                <p className="text-xl font-bold text-foreground">{activeMetrics}</p>
              </div>
              <BarChart3 className="w-6 h-6 text-primary opacity-50" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground">With Goals</p>
                <p className="text-xl font-bold text-foreground">{metricsWithGoals}</p>
              </div>
              <Target className="w-6 h-6 text-chart-3 opacity-50" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground">Avg Quality Score</p>
                <p className="text-xl font-bold text-foreground">{avgQuality}%</p>
              </div>
              <CheckCircle2 className="w-6 h-6 text-chart-3 opacity-50" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground">Total Experiments</p>
                <p className="text-xl font-bold text-foreground">
                  {mockMetrics.reduce((acc, m) => acc + m.experimentCount, 0)}
                </p>
              </div>
              <Zap className="w-6 h-6 text-chart-4 opacity-50" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as Metric["category"] | "all")}>
          <TabsList className="bg-muted">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value} className="text-xs">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {filteredMetrics.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
          <p className="text-muted-foreground">No metrics found matching your search</p>
        </div>
      )}
    </div>
  )
}
