"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Lightbulb, ArrowRight, Sparkles } from "lucide-react"
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

const insights = [
  {
    id: 1,
    type: "Search-to-Product Gap",
    title: "Collaborative Whiteboard Opportunity",
    description:
      "Queries for 'Collaborative Whiteboard' are up 40%, but landing page conversion for these users is 12% below baseline.",
    confidence: "High",
    impact: ["Marketing", "Product"],
    trend: [65, 68, 72, 75, 82, 88, 91],
    strength: 85,
    sources: ["GSC", "Mixpanel"],
  },
  {
    id: 2,
    type: "EDU Funnel Friction",
    title: "UK Student ID Upload Barrier",
    description:
      "UK-based students are dropping off at the 'ID Upload' stage at a 3x higher rate than US students due to non-standard ID formats.",
    confidence: "High",
    impact: ["Product", "Design_Systems"],
    trend: [45, 48, 52, 58, 65, 71, 78],
    strength: 92,
    sources: ["SheerID", "Internal Events"],
  },
  {
    id: 3,
    type: "Generative Search (SGE) Shift",
    title: "AI Search Visibility Declining",
    description:
      "Figma's share of voice in 'Best Design Tools 2026' AI summaries dropped 5% this month; competitor mentions are rising in 'Prototyping' queries.",
    confidence: "Medium",
    impact: ["Marketing", "SEO"],
    trend: [82, 80, 78, 75, 72, 69, 77],
    strength: 73,
    sources: ["LLM Scrapers", "Attribution"],
  },
  {
    id: 4,
    type: "Retention Correlation",
    title: "Community Templates Drive Retention",
    description:
      "Users acquired via 'Community Template' landing pages have a 25% higher Day-30 retention than those from 'Feature' pages.",
    confidence: "High",
    impact: ["Marketing", "Growth"],
    trend: [55, 58, 62, 68, 72, 78, 84],
    strength: 88,
    sources: ["PostHog", "Marketing Spend"],
  },
]

const sgeData = [
  {
    tool: "Figma",
    mentions: 45,
    sentiment: 78,
    shareOfVoice: 42,
  },
  {
    tool: "Adobe Express",
    mentions: 38,
    sentiment: 72,
    shareOfVoice: 35,
  },
  {
    tool: "Canva",
    mentions: 25,
    sentiment: 68,
    shareOfVoice: 23,
  },
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

export function ObservationsView() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Observations & Trend Intelligence</h1>
        <p className="text-muted-foreground mt-1">
          Algorithmic insights that bridge raw data to actionable experiments
        </p>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList>
          <TabsTrigger value="insights">Insight Feed</TabsTrigger>
          <TabsTrigger value="sge">GEO Intelligence</TabsTrigger>
          <TabsTrigger value="friction">Friction Heatmap</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {insights.map((insight) => (
            <Card key={insight.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {insight.type}
                    </Badge>
                    <Badge
                      variant={
                        insight.confidence === "High"
                          ? "default"
                          : insight.confidence === "Medium"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {insight.confidence} Confidence
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
                  <Button size="sm" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Create Experiment
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-3 border-t border-border text-xs text-muted-foreground">
                <span>Data Sources:</span>
                {insight.sources.map((source) => (
                  <Badge key={source} variant="outline" className="text-xs">
                    {source}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sge" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Generative Search Intelligence: AI Mentions</h3>
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
              <Button className="gap-2">
                <Sparkles className="w-4 h-4" />
                Create Experiment
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
