"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Users,
  ArrowRight,
  Lightbulb,
  BarChart3,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ExperimentResults {
  primaryMetric: {
    name: string
    control: number
    treatment: number
    lift: number
    confidenceInterval: [number, number]
    pValue: number
    isSignificant: boolean
  }
  secondaryMetrics: {
    name: string
    control: number
    treatment: number
    lift: number
    isSignificant: boolean
  }[]
  guardrailMetrics: {
    name: string
    value: number
    threshold: number
    status: "passed" | "warning" | "failed"
  }[]
  sampleSize: {
    control: number
    treatment: number
    expected: number
    actual: number
  }
  duration: {
    planned: number
    actual: number
  }
}

const mockResults: ExperimentResults = {
  primaryMetric: {
    name: "Signup Conversion Rate",
    control: 12.4,
    treatment: 14.8,
    lift: 19.4,
    confidenceInterval: [12.1, 26.7],
    pValue: 0.008,
    isSignificant: true,
  },
  secondaryMetrics: [
    { name: "Time to Signup", control: 4.2, treatment: 3.8, lift: -9.5, isSignificant: true },
    { name: "Form Completion Rate", control: 78, treatment: 82, lift: 5.1, isSignificant: false },
    { name: "Page Bounce Rate", control: 42, treatment: 38, lift: -9.5, isSignificant: true },
  ],
  guardrailMetrics: [
    { name: "Error Rate", value: 0.12, threshold: 1.0, status: "passed" },
    { name: "Page Load Time", value: 2.1, threshold: 3.0, status: "passed" },
    { name: "Revenue Impact", value: -0.5, threshold: -5.0, status: "warning" },
  ],
  sampleSize: {
    control: 24500,
    treatment: 24800,
    expected: 50000,
    actual: 49300,
  },
  duration: {
    planned: 14,
    actual: 12,
  },
}

type Recommendation = "ship" | "iterate" | "stop" | "extend"

interface DecisionSupportProps {
  experimentId?: string
  onDecision?: (decision: Recommendation, notes: string) => void
}

export function DecisionSupport({ experimentId, onDecision }: DecisionSupportProps) {
  const results = mockResults

  // Calculate recommendation
  const getRecommendation = (): { type: Recommendation; confidence: number; reasons: string[] } => {
    const reasons: string[] = []
    let score = 50 // Start neutral

    // Primary metric significance
    if (results.primaryMetric.isSignificant && results.primaryMetric.lift > 0) {
      score += 30
      reasons.push("Primary metric shows statistically significant positive lift")
    } else if (!results.primaryMetric.isSignificant) {
      score -= 20
      reasons.push("Primary metric did not reach statistical significance")
    }

    // Guardrail checks
    const failedGuardrails = results.guardrailMetrics.filter((g) => g.status === "failed")
    const warningGuardrails = results.guardrailMetrics.filter((g) => g.status === "warning")
    if (failedGuardrails.length > 0) {
      score -= 40
      reasons.push(`${failedGuardrails.length} guardrail(s) failed`)
    }
    if (warningGuardrails.length > 0) {
      score -= 10
      reasons.push(`${warningGuardrails.length} guardrail(s) showing warnings`)
    }

    // Sample size
    const sampleRatio = results.sampleSize.actual / results.sampleSize.expected
    if (sampleRatio < 0.8) {
      score -= 15
      reasons.push("Sample size below 80% of target")
    }

    // Determine recommendation
    if (score >= 70) return { type: "ship", confidence: Math.min(score, 95), reasons }
    if (score >= 40) return { type: "iterate", confidence: 60, reasons }
    if (score >= 20) return { type: "extend", confidence: 50, reasons }
    return { type: "stop", confidence: Math.abs(score - 50), reasons }
  }

  const recommendation = getRecommendation()

  const recommendationConfig = {
    ship: {
      label: "Ship It",
      description: "Results are strong. Recommend rolling out to 100%.",
      icon: CheckCircle2,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      borderColor: "border-chart-3",
    },
    iterate: {
      label: "Iterate",
      description: "Promising signals but room for improvement. Consider a follow-up test.",
      icon: TrendingUp,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      borderColor: "border-chart-4",
    },
    extend: {
      label: "Extend",
      description: "Insufficient data. Recommend extending the experiment duration.",
      icon: Clock,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      borderColor: "border-chart-2",
    },
    stop: {
      label: "Stop",
      description: "Negative or neutral results. Recommend ending the experiment.",
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive",
    },
  }

  const config = recommendationConfig[recommendation.type]
  const RecommendationIcon = config.icon

  return (
    <div className="space-y-6">
      {/* Recommendation Card */}
      <Card className={cn("border-2", config.borderColor, config.bgColor)}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", config.bgColor)}>
              <RecommendationIcon className={cn("w-6 h-6", config.color)} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={cn("text-xl font-bold", config.color)}>{config.label}</h3>
                <Badge variant="secondary" className={config.bgColor}>
                  {recommendation.confidence}% confidence
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{config.description}</p>
              <div className="space-y-2">
                {recommendation.reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Lightbulb className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Metric */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Primary Metric</CardTitle>
          <CardDescription>{results.primaryMetric.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Control</p>
              <p className="text-2xl font-bold text-foreground">{results.primaryMetric.control}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Treatment</p>
              <p className="text-2xl font-bold text-foreground">{results.primaryMetric.treatment}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Lift</p>
              <div className="flex items-center gap-2">
                <p className={cn("text-2xl font-bold", results.primaryMetric.lift > 0 ? "text-chart-3" : "text-chart-5")}>
                  {results.primaryMetric.lift > 0 ? "+" : ""}{results.primaryMetric.lift}%
                </p>
                {results.primaryMetric.lift > 0 ? (
                  <TrendingUp className="w-5 h-5 text-chart-3" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-chart-5" />
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">p-value</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-foreground">{results.primaryMetric.pValue}</p>
                {results.primaryMetric.isSignificant && (
                  <Badge className="bg-chart-3/10 text-chart-3">Significant</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">
              95% Confidence Interval: [{results.primaryMetric.confidenceInterval[0]}%, {results.primaryMetric.confidenceInterval[1]}%]
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Metrics */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Secondary Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.secondaryMetrics.map((metric) => (
              <div key={metric.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{metric.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Control</p>
                    <p className="text-sm font-medium text-foreground">{metric.control}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Treatment</p>
                    <p className="text-sm font-medium text-foreground">{metric.treatment}</p>
                  </div>
                  <div className="w-20 text-right">
                    <span className={cn(
                      "text-sm font-bold",
                      metric.lift > 0 ? "text-chart-3" : metric.lift < 0 ? "text-chart-5" : "text-foreground"
                    )}>
                      {metric.lift > 0 ? "+" : ""}{metric.lift}%
                    </span>
                  </div>
                  {metric.isSignificant ? (
                    <CheckCircle2 className="w-4 h-4 text-chart-3" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-chart-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guardrail Metrics */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Guardrail Checks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.guardrailMetrics.map((metric) => (
              <div key={metric.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  {metric.status === "passed" && <CheckCircle2 className="w-5 h-5 text-chart-3" />}
                  {metric.status === "warning" && <AlertTriangle className="w-5 h-5 text-chart-4" />}
                  {metric.status === "failed" && <XCircle className="w-5 h-5 text-destructive" />}
                  <span className="text-sm font-medium text-foreground">{metric.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-foreground">{metric.value}</span>
                  <span className="text-xs text-muted-foreground">/ {metric.threshold} threshold</span>
                  <Badge className={cn(
                    metric.status === "passed" && "bg-chart-3/10 text-chart-3",
                    metric.status === "warning" && "bg-chart-4/10 text-chart-4",
                    metric.status === "failed" && "bg-destructive/10 text-destructive"
                  )}>
                    {metric.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sample Size & Duration */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Users className="w-5 h-5" />
              Sample Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Control</span>
                <span className="text-sm font-medium text-foreground">{results.sampleSize.control.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Treatment</span>
                <span className="text-sm font-medium text-foreground">{results.sampleSize.treatment.toLocaleString()}</span>
              </div>
              <Progress value={(results.sampleSize.actual / results.sampleSize.expected) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {results.sampleSize.actual.toLocaleString()} of {results.sampleSize.expected.toLocaleString()} expected
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Planned</span>
                <span className="text-sm font-medium text-foreground">{results.duration.planned} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Actual</span>
                <span className="text-sm font-medium text-foreground">{results.duration.actual} days</span>
              </div>
              <Progress value={(results.duration.actual / results.duration.planned) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Completed {Math.round((results.duration.actual / results.duration.planned) * 100)}% of planned duration
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline">Request Review</Button>
        <Button variant="outline">Download Report</Button>
        <Button onClick={() => onDecision?.(recommendation.type, "")}>
          Make Decision
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
