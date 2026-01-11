"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  MapPin,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  Target,
  Beaker,
  BarChart3,
  MessageSquare,
  GitBranch,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Edit,
  Share2,
} from "lucide-react"
import { ShareDialog } from "@/components/share-dialog"
import { ExperimentEditDialog } from "@/components/experiment-edit-dialog"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface ExperimentDetailProps {
  experimentId: string
}

// Mock data - in production this would come from an API
const mockExperimentData = {
  "exp-001": {
    id: "exp-001",
    name: "Growth SEO Test",
    status: "running" as const,
    owner: "Sarah Chen",
    team: "Growth",
    locale: "North America",
    createdAt: "2024-01-10",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    riskLevel: "low" as const,

    // Lineage
    sourceInsightId: "insight-001",
    sourceInsightTitle: "Search-to-Product Gap: Collaborative Whiteboard",

    // Content
    rationale: "Queries for 'Collaborative Whiteboard' are up 40%, but landing page conversion for these users is 12% below baseline. This suggests an opportunity to improve our SEO landing pages to better capture this growing search demand.",
    hypothesis: "Optimizing meta descriptions and landing page headlines to better match 'Collaborative Whiteboard' search intent will increase organic CTR by 15% and landing page conversion by 10%.",
    successCriteria: "Primary: 15% increase in organic CTR\nSecondary: 10% increase in landing page conversion\nGuardrail: No decrease in time-on-page or bounce rate increase > 5%",

    primaryMetric: "Organic CTR",
    secondaryMetrics: ["Landing Page Conversion", "Time on Page"],
    guardrailMetrics: ["Bounce Rate", "Page Load Time"],

    // Design
    variants: [
      { id: "control", name: "Control", description: "Current landing page", allocation: 50 },
      { id: "variant-a", name: "Variant A", description: "Updated meta description + headline", allocation: 50 },
    ],
    sampleSize: 50000,
    trafficAllocation: 100,

    // Approvals
    approvalStatus: {
      legal: { status: "approved" as const, reviewer: "Legal Team", date: "2024-01-12", notes: "No data privacy concerns" },
      brand: { status: "approved" as const, reviewer: "Brand Team", date: "2024-01-13", notes: "Copy approved" },
      security: { status: "approved" as const, reviewer: "Security Team", date: "2024-01-14", notes: "No security risks" },
    },

    // Results (for running experiments)
    results: {
      sampleSize: 28500,
      sampleSizeTarget: 50000,
      daysElapsed: 12,
      daysTotal: 31,
      variants: [
        { id: "control", name: "Control", sampleSize: 14250, conversionRate: 3.2, confidenceInterval: [2.9, 3.5] },
        { id: "variant-a", name: "Variant A", sampleSize: 14250, conversionRate: 3.8, confidenceInterval: [3.4, 4.2], isWinner: true },
      ],
      currentLift: 18.7,
      pValue: 0.023,
      statisticalPower: 0.82,
      srmDetected: false,
      trendData: [
        { day: 1, control: 3.1, variantA: 3.2 },
        { day: 3, control: 3.2, variantA: 3.4 },
        { day: 5, control: 3.1, variantA: 3.5 },
        { day: 7, control: 3.2, variantA: 3.6 },
        { day: 9, control: 3.2, variantA: 3.7 },
        { day: 12, control: 3.2, variantA: 3.8 },
      ],
      segmentAnalysis: [
        { segment: "Desktop", controlRate: 3.5, variantRate: 4.2, lift: 20 },
        { segment: "Mobile", controlRate: 2.8, variantRate: 3.2, lift: 14 },
        { segment: "New Users", controlRate: 3.0, variantRate: 3.9, lift: 30 },
        { segment: "Returning", controlRate: 3.4, variantRate: 3.7, lift: 9 },
      ],
    },

    // Decision (empty for running)
    decision: null,
    learnings: [],
    aiPostMortem: null,
    followUpExperimentIds: [],
  },
}

export function ExperimentDetail({ experimentId }: ExperimentDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // In production, fetch experiment data by ID
  const initialExperiment = mockExperimentData[experimentId as keyof typeof mockExperimentData] || mockExperimentData["exp-001"]
  const [experiment, setExperiment] = useState(initialExperiment)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-chart-3/10 text-chart-3 border-chart-3/20">Running</Badge>
      case "pending_approval":
        return <Badge className="bg-chart-4/10 text-chart-4 border-chart-4/20">Pending Approval</Badge>
      case "approved":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Ready to Launch</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "completed":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Experiments
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-foreground">{experiment.name}</h1>
              {getStatusBadge(experiment.status)}
              <Badge
                variant="secondary"
                className={
                  experiment.riskLevel === "high"
                    ? "bg-chart-5/10 text-chart-5"
                    : experiment.riskLevel === "medium"
                    ? "bg-chart-4/10 text-chart-4"
                    : "bg-chart-3/10 text-chart-3"
                }
              >
                {experiment.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{experiment.owner}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{experiment.locale}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(experiment.startDate).toLocaleDateString()} -{" "}
                  {new Date(experiment.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {experiment.status === "approved" && (
              <Button className="bg-chart-3 hover:bg-chart-3/90 text-white">
                <Play className="w-4 h-4 mr-2" />
                Launch Experiment
              </Button>
            )}
            {experiment.status === "running" && (
              <Button variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            <ShareDialog
              experimentId={experiment.id}
              experimentName={experiment.name}
              trigger={
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              }
            />
            <ExperimentEditDialog
              experiment={experiment}
              trigger={
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              }
              onSave={(updatedData) => {
                // Update local state (in production, this would also call an API)
                setExperiment((prev) => ({
                  ...prev,
                  ...updatedData,
                }))
              }}
            />
          </div>
        </div>
      </div>

      {/* Lifecycle Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted p-1 h-auto flex-wrap">
          <TabsTrigger value="overview" className="gap-2">
            <Target className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="rationale" className="gap-2">
            <Lightbulb className="w-4 h-4" />
            Rationale
          </TabsTrigger>
          <TabsTrigger value="hypothesis" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Hypothesis
          </TabsTrigger>
          <TabsTrigger value="design" className="gap-2">
            <Beaker className="w-4 h-4" />
            Design
          </TabsTrigger>
          <TabsTrigger value="run" className="gap-2">
            <Play className="w-4 h-4" />
            Run
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="decision" className="gap-2">
            <GitBranch className="w-4 h-4" />
            Decision
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Experiment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Hypothesis</h4>
                    <p className="text-sm text-foreground">{experiment.hypothesis}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Primary Metric</h4>
                    <p className="text-sm text-foreground">{experiment.primaryMetric}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Sample Size Target</h4>
                      <p className="text-sm text-foreground">{experiment.sampleSize.toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Traffic Allocation</h4>
                      <p className="text-sm text-foreground">{experiment.trafficAllocation}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Results Preview */}
              {experiment.status === "running" && experiment.results && (
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>Live Results</CardTitle>
                    <CardDescription>Real-time experiment metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          {experiment.results.currentLift > 0 ? (
                            <TrendingUp className="w-5 h-5 text-chart-3" />
                          ) : experiment.results.currentLift < 0 ? (
                            <TrendingDown className="w-5 h-5 text-chart-5" />
                          ) : (
                            <Minus className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span
                            className={`text-2xl font-bold ${
                              experiment.results.currentLift > 0
                                ? "text-chart-3"
                                : experiment.results.currentLift < 0
                                ? "text-chart-5"
                                : "text-muted-foreground"
                            }`}
                          >
                            {experiment.results.currentLift > 0 ? "+" : ""}
                            {experiment.results.currentLift}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Current Lift</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-foreground">
                          {experiment.results.pValue < 0.05 ? (
                            <span className="text-chart-3">Significant</span>
                          ) : (
                            <span>p={experiment.results.pValue}</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Statistical Significance</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-foreground">
                          {experiment.results.daysTotal - experiment.results.daysElapsed}
                        </div>
                        <p className="text-xs text-muted-foreground">Days Remaining</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Sample Progress</span>
                        <span className="font-medium text-foreground">
                          {experiment.results.sampleSize.toLocaleString()} / {experiment.results.sampleSizeTarget.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={(experiment.results.sampleSize / experiment.results.sampleSizeTarget) * 100}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Approval Status */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-base">Approval Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(experiment.approvalStatus).map(([key, approval]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {approval.status === "approved" ? (
                          <CheckCircle2 className="w-4 h-4 text-chart-3" />
                        ) : approval.status === "rejected" ? (
                          <XCircle className="w-4 h-4 text-chart-5" />
                        ) : (
                          <Clock className="w-4 h-4 text-chart-4" />
                        )}
                        <span className="text-sm capitalize text-foreground">{key}</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          approval.status === "approved"
                            ? "bg-chart-3/10 text-chart-3"
                            : approval.status === "rejected"
                            ? "bg-chart-5/10 text-chart-5"
                            : "bg-chart-4/10 text-chart-4"
                        }
                      >
                        {approval.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Source Insight */}
              {experiment.sourceInsightId && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-primary" />
                      <CardTitle className="text-base">Source Insight</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="/insights"
                      className="text-sm text-primary hover:underline"
                    >
                      {experiment.sourceInsightTitle}
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-base">Experiment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="text-foreground">{new Date(experiment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Team</span>
                    <span className="text-foreground">{experiment.team}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Variants</span>
                    <span className="text-foreground">{experiment.variants.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Rationale Tab */}
        <TabsContent value="rationale" className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Experiment Rationale</CardTitle>
              <CardDescription>Why we're running this experiment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground whitespace-pre-line">{experiment.rationale}</p>
              </div>

              {experiment.sourceInsightId && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <h4 className="font-medium text-foreground">Originated from Insight</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    This experiment was created based on an automatically detected insight.
                  </p>
                  <Link
                    href="/insights"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    View Source Insight
                    <ArrowLeft className="w-3 h-3 rotate-180" />
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hypothesis Tab */}
        <TabsContent value="hypothesis" className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Hypothesis</CardTitle>
              <CardDescription>What we believe will happen and how we'll measure success</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Hypothesis Statement</h4>
                <p className="text-foreground p-4 bg-muted rounded-lg">{experiment.hypothesis}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Success Criteria</h4>
                <p className="text-foreground p-4 bg-muted rounded-lg whitespace-pre-line">
                  {experiment.successCriteria}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-border">
                  <h4 className="text-sm font-medium text-foreground mb-2">Primary Metric</h4>
                  <Badge variant="default">{experiment.primaryMetric}</Badge>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <h4 className="text-sm font-medium text-foreground mb-2">Secondary Metrics</h4>
                  <div className="flex flex-wrap gap-1">
                    {experiment.secondaryMetrics.map((metric) => (
                      <Badge key={metric} variant="secondary">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <h4 className="text-sm font-medium text-foreground mb-2">Guardrail Metrics</h4>
                  <div className="flex flex-wrap gap-1">
                    {experiment.guardrailMetrics.map((metric) => (
                      <Badge key={metric} variant="outline">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Design Tab */}
        <TabsContent value="design" className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Experiment Design</CardTitle>
              <CardDescription>Variants, targeting, and traffic allocation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Variants */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Variants</h4>
                <div className="space-y-3">
                  {experiment.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div>
                        <h5 className="font-medium text-foreground">{variant.name}</h5>
                        <p className="text-sm text-muted-foreground">{variant.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">{variant.allocation}%</div>
                        <p className="text-xs text-muted-foreground">Traffic</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Size & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-border">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Target Sample Size</h4>
                  <p className="text-2xl font-bold text-foreground">
                    {experiment.sampleSize.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Traffic Allocation</h4>
                  <p className="text-2xl font-bold text-foreground">{experiment.trafficAllocation}%</p>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Target Locale</h4>
                  <p className="text-2xl font-bold text-foreground">{experiment.locale}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Run Tab */}
        <TabsContent value="run" className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Experiment Execution</CardTitle>
              <CardDescription>Real-time status and runtime monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {experiment.status === "running" && experiment.results ? (
                <>
                  {/* Progress */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Sample Progress</span>
                        <span className="font-medium text-foreground">
                          {Math.round((experiment.results.sampleSize / experiment.results.sampleSizeTarget) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(experiment.results.sampleSize / experiment.results.sampleSizeTarget) * 100}
                        className="h-3"
                      />
                      <p className="text-xs text-muted-foreground">
                        {experiment.results.sampleSize.toLocaleString()} of{" "}
                        {experiment.results.sampleSizeTarget.toLocaleString()} users
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Time Progress</span>
                        <span className="font-medium text-foreground">
                          {Math.round((experiment.results.daysElapsed / experiment.results.daysTotal) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(experiment.results.daysElapsed / experiment.results.daysTotal) * 100}
                        className="h-3"
                      />
                      <p className="text-xs text-muted-foreground">
                        Day {experiment.results.daysElapsed} of {experiment.results.daysTotal}
                      </p>
                    </div>
                  </div>

                  {/* Health Checks */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`p-4 rounded-lg border ${
                        !experiment.results.srmDetected
                          ? "border-chart-3/20 bg-chart-3/5"
                          : "border-chart-5/20 bg-chart-5/5"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {!experiment.results.srmDetected ? (
                          <CheckCircle2 className="w-4 h-4 text-chart-3" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-chart-5" />
                        )}
                        <h4 className="text-sm font-medium text-foreground">Sample Ratio</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {!experiment.results.srmDetected ? "No mismatch detected" : "SRM detected - investigate"}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border border-chart-3/20 bg-chart-3/5">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-chart-3" />
                        <h4 className="text-sm font-medium text-foreground">Data Quality</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">All metrics tracking correctly</p>
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-muted">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <h4 className="text-sm font-medium text-foreground">Pacing</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">On track for completion</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground">Experiment Not Running</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Launch the experiment to see runtime metrics
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {experiment.status === "running" && experiment.results ? (
            <>
              {/* Main Results */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Results Summary</CardTitle>
                  <CardDescription>Statistical analysis and performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Variant Comparison */}
                  <div className="space-y-4">
                    {experiment.results.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className={`p-4 rounded-lg border ${
                          variant.isWinner ? "border-chart-3/50 bg-chart-3/5" : "border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground">{variant.name}</h4>
                              {variant.isWinner && (
                                <Badge className="bg-chart-3 text-white">Leading</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {variant.sampleSize.toLocaleString()} users
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-foreground">
                              {variant.conversionRate}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                              CI: [{variant.confidenceInterval[0]}, {variant.confidenceInterval[1]}]
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Trend Chart */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-4">Conversion Trend</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={experiment.results.trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="control"
                          name="Control"
                          stroke="hsl(var(--muted-foreground))"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="variantA"
                          name="Variant A"
                          stroke="hsl(var(--chart-3))"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Segment Analysis */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-4">Segment Analysis</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 text-muted-foreground font-medium">Segment</th>
                            <th className="text-right py-2 text-muted-foreground font-medium">Control</th>
                            <th className="text-right py-2 text-muted-foreground font-medium">Variant</th>
                            <th className="text-right py-2 text-muted-foreground font-medium">Lift</th>
                          </tr>
                        </thead>
                        <tbody>
                          {experiment.results.segmentAnalysis.map((seg) => (
                            <tr key={seg.segment} className="border-b border-border">
                              <td className="py-2 text-foreground">{seg.segment}</td>
                              <td className="py-2 text-right text-muted-foreground">{seg.controlRate}%</td>
                              <td className="py-2 text-right text-foreground">{seg.variantRate}%</td>
                              <td className="py-2 text-right">
                                <span
                                  className={
                                    seg.lift > 0 ? "text-chart-3" : seg.lift < 0 ? "text-chart-5" : "text-muted-foreground"
                                  }
                                >
                                  {seg.lift > 0 ? "+" : ""}
                                  {seg.lift}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="py-12 text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">No Results Yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Results will appear once the experiment starts collecting data
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Decision Tab */}
        <TabsContent value="decision" className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Decision & Next Steps</CardTitle>
              <CardDescription>Record the outcome and plan follow-up experiments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {experiment.decision ? (
                <div>Decision recorded</div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto p-6 flex flex-col items-center gap-2 border-chart-3/50 hover:bg-chart-3/10"
                    >
                      <CheckCircle2 className="w-8 h-8 text-chart-3" />
                      <span className="font-medium text-foreground">Ship It</span>
                      <span className="text-xs text-muted-foreground text-center">
                        Roll out the winning variant
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-6 flex flex-col items-center gap-2 border-chart-4/50 hover:bg-chart-4/10"
                    >
                      <GitBranch className="w-8 h-8 text-chart-4" />
                      <span className="font-medium text-foreground">Iterate</span>
                      <span className="text-xs text-muted-foreground text-center">
                        Create a follow-up experiment
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-6 flex flex-col items-center gap-2 border-chart-5/50 hover:bg-chart-5/10"
                    >
                      <XCircle className="w-8 h-8 text-chart-5" />
                      <span className="font-medium text-foreground">Kill</span>
                      <span className="text-xs text-muted-foreground text-center">
                        End without shipping
                      </span>
                    </Button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Learnings</h4>
                    <Textarea
                      placeholder="What did we learn from this experiment?"
                      className="min-h-[100px] bg-card border-border"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h4 className="text-sm font-medium text-foreground">AI Post-Mortem</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      An AI-generated analysis will be created when you record a decision, summarizing key insights and recommending next steps.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
