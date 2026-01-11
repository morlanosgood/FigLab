"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertTriangle, Lightbulb, ArrowRight, Sparkles, CheckCircle2, Eye, FlaskConical } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface Insight {
  id: string
  type: "anomaly" | "correlation" | "funnel_friction" | "search_gap" | "competitive_shift" | "cohort_pattern"
  title: string
  description: string
  confidence: "high" | "medium" | "low"
  impact: string[]
  trend: number[]
  strength: number
  sources: string[]
  detectedAt: string
  status: "new" | "reviewed" | "actioned" | "dismissed"
  linkedExperimentIds: string[]
}

const insights: Insight[] = [
  {
    id: "insight-001",
    type: "search_gap",
    title: "Collaborative Whiteboard Opportunity",
    description:
      "Queries for 'Collaborative Whiteboard' are up 40%, but landing page conversion for these users is 12% below baseline.",
    confidence: "high",
    impact: ["Marketing", "Product"],
    trend: [65, 68, 72, 75, 82, 88, 91],
    strength: 85,
    sources: ["GSC", "Mixpanel"],
    detectedAt: "2024-01-18",
    status: "actioned",
    linkedExperimentIds: ["exp-001"],
  },
  {
    id: "insight-002",
    type: "funnel_friction",
    title: "UK Student ID Upload Barrier",
    description:
      "UK-based students are dropping off at the 'ID Upload' stage at a 3x higher rate than US students due to non-standard ID formats.",
    confidence: "high",
    impact: ["Product", "Design_Systems"],
    trend: [45, 48, 52, 58, 65, 71, 78],
    strength: 92,
    sources: ["SheerID", "Internal Events"],
    detectedAt: "2024-01-17",
    status: "actioned",
    linkedExperimentIds: ["exp-007"],
  },
  {
    id: "insight-003",
    type: "competitive_shift",
    title: "AI Search Visibility Declining",
    description:
      "Figma's share of voice in 'Best Design Tools 2026' AI summaries dropped 5% this month; competitor mentions are rising in 'Prototyping' queries.",
    confidence: "medium",
    impact: ["Marketing", "SEO"],
    trend: [82, 80, 78, 75, 72, 69, 77],
    strength: 73,
    sources: ["LLM Scrapers", "Attribution"],
    detectedAt: "2024-01-16",
    status: "new",
    linkedExperimentIds: [],
  },
  {
    id: "insight-004",
    type: "correlation",
    title: "Community Templates Drive Retention",
    description:
      "Users acquired via 'Community Template' landing pages have a 25% higher Day-30 retention than those from 'Feature' pages.",
    confidence: "high",
    impact: ["Marketing", "Growth"],
    trend: [55, 58, 62, 68, 72, 78, 84],
    strength: 88,
    sources: ["PostHog", "Marketing Spend"],
    detectedAt: "2024-01-15",
    status: "reviewed",
    linkedExperimentIds: [],
  },
  {
    id: "insight-005",
    type: "anomaly",
    title: "Mobile Conversion Drop",
    description:
      "Mobile conversion rate dropped 15% in the last 7 days. Correlates with latest app update deployment.",
    confidence: "high",
    impact: ["Engineering", "Product"],
    trend: [78, 75, 68, 62, 58, 55, 52],
    strength: 94,
    sources: ["Mixpanel", "App Store"],
    detectedAt: "2024-01-19",
    status: "new",
    linkedExperimentIds: [],
  },
]

const sgeData = [
  { tool: "Figma", mentions: 45, sentiment: 78, shareOfVoice: 42 },
  { tool: "Adobe Express", mentions: 38, sentiment: 72, shareOfVoice: 35 },
  { tool: "Canva", mentions: 25, sentiment: 68, shareOfVoice: 23 },
]

const radarData = [
  { category: "Prototyping", figma: 85, adobe: 72, canva: 45 },
  { category: "Collaboration", figma: 92, adobe: 65, canva: 78 },
  { category: "UI Design", figma: 95, adobe: 88, canva: 58 },
  { category: "Templates", figma: 68, adobe: 62, canva: 92 },
  { category: "Ease of Use", figma: 75, adobe: 70, canva: 88 },
]

const frictionData = [
  { step: "Landing", dropoff: 8, critical: false },
  { step: "Account", dropoff: 15, critical: false },
  { step: "ID Upload", dropoff: 42, critical: true },
  { step: "Verification", dropoff: 12, critical: false },
]

const getTypeLabel = (type: Insight["type"]) => {
  const labels: Record<Insight["type"], string> = {
    anomaly: "Anomaly",
    correlation: "Correlation",
    funnel_friction: "Funnel Friction",
    search_gap: "Search-to-Product Gap",
    competitive_shift: "Competitive Shift",
    cohort_pattern: "Cohort Pattern",
  }
  return labels[type]
}

const getStatusIcon = (status: Insight["status"]) => {
  switch (status) {
    case "actioned":
      return <FlaskConical className="w-3 h-3" />
    case "reviewed":
      return <Eye className="w-3 h-3" />
    case "dismissed":
      return <CheckCircle2 className="w-3 h-3" />
    default:
      return <Sparkles className="w-3 h-3" />
  }
}

export function InsightsView() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredInsights = insights.filter((insight) => {
    const matchesStatus = statusFilter === "all" || insight.status === statusFilter
    const matchesType = typeFilter === "all" || insight.type === typeFilter
    return matchesStatus && matchesType
  })

  const newInsightsCount = insights.filter((i) => i.status === "new").length

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Insights</h1>
          <p className="text-muted-foreground mt-1">
            Data-driven observations that bridge raw data to actionable experiments
          </p>
        </div>
        {newInsightsCount > 0 && (
          <Badge className="bg-primary text-primary-foreground">
            {newInsightsCount} new insights
          </Badge>
        )}
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList>
          <TabsTrigger value="insights">Insight Feed</TabsTrigger>
          <TabsTrigger value="sge">GEO Intelligence</TabsTrigger>
          <TabsTrigger value="friction">Friction Heatmap</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-card border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="actioned">Actioned</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px] bg-card border-border">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="anomaly">Anomaly</SelectItem>
                <SelectItem value="correlation">Correlation</SelectItem>
                <SelectItem value="funnel_friction">Funnel Friction</SelectItem>
                <SelectItem value="search_gap">Search Gap</SelectItem>
                <SelectItem value="competitive_shift">Competitive Shift</SelectItem>
                <SelectItem value="cohort_pattern">Cohort Pattern</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Insights List */}
          {filteredInsights.map((insight) => (
            <Card key={insight.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {getTypeLabel(insight.type)}
                    </Badge>
                    <Badge
                      variant={
                        insight.confidence === "high"
                          ? "default"
                          : insight.confidence === "medium"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {insight.confidence.charAt(0).toUpperCase() + insight.confidence.slice(1)} Confidence
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={
                        insight.status === "new"
                          ? "bg-primary/10 text-primary"
                          : insight.status === "actioned"
                          ? "bg-chart-3/10 text-chart-3"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {getStatusIcon(insight.status)}
                      <span className="ml-1 capitalize">{insight.status}</span>
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {insight.impact.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Linked Experiments */}
                  {insight.linkedExperimentIds.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-chart-3" />
                      <span className="text-sm text-muted-foreground">
                        {insight.linkedExperimentIds.length} experiment(s) created
                      </span>
                      <Link
                        href={`/experiments/${insight.linkedExperimentIds[0]}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  )}
                </div>
                <div className="ml-6 flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Signal Strength</p>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-12">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={insight.trend.map((value, idx) => ({ value, day: idx }))}>
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="hsl(var(--primary))"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <span className="text-2xl font-bold text-primary">{insight.strength}</span>
                    </div>
                  </div>
                  {insight.status !== "actioned" && insight.status !== "dismissed" && (
                    <Link href="/experiments/new">
                      <Button size="sm" className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        Create Experiment
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Data Sources:</span>
                  {insight.sources.map((source) => (
                    <Badge key={source} variant="outline" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
                <span>
                  Detected{" "}
                  {new Date(insight.detectedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </Card>
          ))}

          {filteredInsights.length === 0 && (
            <Card className="p-12 text-center border-dashed">
              <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">No insights match your filters</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your filters or check back later
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sge" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Generative Search Intelligence: AI Mentions
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Track Figma's visibility in AI-powered search results compared to competitors
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-4">Mention Frequency</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sgeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="tool" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="mentions" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-4">Competitive Positioning</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                    <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
                    <Radar
                      name="Figma"
                      dataKey="figma"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Adobe Express"
                      dataKey="adobe"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name="Canva"
                      dataKey="canva"
                      stroke="hsl(var(--chart-3))"
                      fill="hsl(var(--chart-3))"
                      fillOpacity={0.4}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Action Required</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Figma's share of voice in "Prototyping" queries has declined 5% this month. Consider content
                    optimization experiments targeting AI search summaries.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="friction" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">EDU Funnel Friction Heatmap</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Visual representation of where users are experiencing the most friction in the EDU verification flow
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={frictionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="step" type="category" stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="dropoff" radius={[0, 8, 8, 0]}>
                  {frictionData.map((entry, index) => (
                    <Bar
                      key={`cell-${index}`}
                      fill={entry.critical ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <Card className="p-4 bg-muted">
                <p className="text-xs text-muted-foreground mb-1">Critical Drop-off</p>
                <p className="text-2xl font-bold text-destructive">42%</p>
                <p className="text-xs text-muted-foreground mt-1">ID Upload Stage</p>
              </Card>
              <Card className="p-4 bg-muted">
                <p className="text-xs text-muted-foreground mb-1">Top Region</p>
                <p className="text-2xl font-bold text-foreground">UK</p>
                <p className="text-xs text-muted-foreground mt-1">3x higher drop-off</p>
              </Card>
              <Card className="p-4 bg-muted">
                <p className="text-xs text-muted-foreground mb-1">Root Cause</p>
                <p className="text-sm font-medium text-foreground mt-2">Non-standard ID formats</p>
              </Card>
            </div>
            <div className="mt-6 flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Suggested Experiment</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Test alternative ID verification methods for UK students (passport, driver's license alternatives)
                  </p>
                </div>
              </div>
              <Link href="/experiments/new">
                <Button className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Create Experiment
                </Button>
              </Link>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
