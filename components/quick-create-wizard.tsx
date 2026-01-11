"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Target,
  Users,
  Zap,
  FileText,
  Copy,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SingleMetricPicker, type MetricOption } from "@/components/metric-picker"

interface ExperimentDraft {
  name: string
  hypothesis: string
  primaryMetric: MetricOption | null
  targetLift: number
  audience: string
  duration: number
  template?: string
}

const templates = [
  {
    id: "landing-page",
    name: "Landing Page Test",
    description: "A/B test for landing page variations",
    icon: FileText,
    defaults: {
      duration: 14,
      audience: "All visitors",
    },
  },
  {
    id: "onboarding",
    name: "Onboarding Flow",
    description: "Test new user onboarding experiences",
    icon: Users,
    defaults: {
      duration: 21,
      audience: "New signups",
    },
  },
  {
    id: "feature",
    name: "Feature Experiment",
    description: "Test a new product feature",
    icon: Zap,
    defaults: {
      duration: 28,
      audience: "Active users",
    },
  },
  {
    id: "blank",
    name: "Blank Experiment",
    description: "Start from scratch",
    icon: Sparkles,
    defaults: {
      duration: 14,
      audience: "Custom",
    },
  },
]

const recentExperiments = [
  { id: "exp-001", name: "Mobile Upload Optimization", status: "running" },
  { id: "exp-002", name: "Trust Signals on Upload", status: "completed" },
  { id: "exp-003", name: "SEO Landing Page V2", status: "completed" },
]

interface QuickCreateWizardProps {
  onComplete?: (experiment: ExperimentDraft) => void
  onCancel?: () => void
  sourceInsightId?: string
}

export function QuickCreateWizard({ onComplete, onCancel, sourceInsightId }: QuickCreateWizardProps) {
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<ExperimentDraft>({
    name: "",
    hypothesis: "",
    primaryMetric: null,
    targetLift: 10,
    audience: "",
    duration: 14,
  })

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const updateDraft = (updates: Partial<ExperimentDraft>) => {
    setDraft({ ...draft, ...updates })
  }

  const selectTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      updateDraft({
        template: templateId,
        duration: template.defaults.duration,
        audience: template.defaults.audience,
      })
      setStep(2)
    }
  }

  const duplicateExperiment = (expId: string) => {
    const exp = recentExperiments.find((e) => e.id === expId)
    if (exp) {
      updateDraft({
        name: `${exp.name} (Copy)`,
      })
      setStep(2)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!draft.template
      case 2:
        return draft.name.length > 0 && draft.hypothesis.length > 0
      case 3:
        return draft.primaryMetric !== null
      default:
        return false
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Step {step} of {totalSteps}</span>
          <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step 1: Choose Template */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Create New Experiment</h2>
            <p className="text-muted-foreground mt-1">Choose a template or duplicate an existing experiment</p>
          </div>

          {/* Source Insight */}
          {sourceInsightId && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Creating from insight</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This experiment will be linked to the source insight for tracking.
                </p>
              </div>
            </div>
          )}

          {/* Templates */}
          <div className="space-y-3">
            <Label>Templates</Label>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => {
                const Icon = template.icon
                return (
                  <button
                    key={template.id}
                    onClick={() => selectTemplate(template.id)}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-lg border text-left transition-all",
                      draft.template === template.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      draft.template === template.id ? "bg-primary/10" : "bg-muted"
                    )}>
                      <Icon className={cn("w-5 h-5", draft.template === template.id ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{template.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Duplicate from recent */}
          <div className="space-y-3">
            <Label>Or duplicate from recent</Label>
            <div className="space-y-2">
              {recentExperiments.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => duplicateExperiment(exp.id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Copy className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{exp.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">{exp.status}</Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Basics */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Experiment Basics</h2>
            <p className="text-muted-foreground mt-1">Define what you're testing and why</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Experiment Name</Label>
              <Input
                id="name"
                placeholder="e.g., Mobile Upload Flow V2"
                value={draft.name}
                onChange={(e) => updateDraft({ name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hypothesis">Hypothesis</Label>
              <Textarea
                id="hypothesis"
                placeholder="If we [change], then [outcome] because [reason]..."
                value={draft.hypothesis}
                onChange={(e) => updateDraft({ hypothesis: e.target.value })}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                A good hypothesis is specific, measurable, and explains the expected outcome.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  placeholder="e.g., Mobile users"
                  value={draft.audience}
                  onChange={(e) => updateDraft({ audience: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={7}
                  max={90}
                  value={draft.duration}
                  onChange={(e) => updateDraft({ duration: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Metrics */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Success Metrics</h2>
            <p className="text-muted-foreground mt-1">Define how you'll measure success</p>
          </div>

          <div className="space-y-6">
            <SingleMetricPicker
              label="Primary Metric"
              selectedMetric={draft.primaryMetric}
              onSelect={(metric) => updateDraft({ primaryMetric: metric })}
              placeholder="Select the main metric to optimize..."
            />

            <div className="space-y-2">
              <Label>Target Lift</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={draft.targetLift}
                  onChange={(e) => updateDraft({ targetLift: Number(e.target.value) })}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">% improvement expected</span>
              </div>
            </div>

            {/* Summary Preview */}
            <Card className="border-border bg-muted/30">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-foreground">Experiment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="text-foreground font-medium">{draft.name || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Primary Metric</span>
                  <span className="text-foreground font-medium">{draft.primaryMetric?.displayName || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target Lift</span>
                  <span className="text-foreground font-medium">+{draft.targetLift}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Audience</span>
                  <span className="text-foreground font-medium">{draft.audience || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground font-medium">{draft.duration} days</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={() => (step > 1 ? setStep(step - 1) : onCancel?.())}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {step > 1 ? "Back" : "Cancel"}
        </Button>

        {step < totalSteps ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => onComplete?.(draft)}
            disabled={!canProceed()}
            className="bg-primary hover:bg-primary/90"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Create Experiment
          </Button>
        )}
      </div>
    </div>
  )
}
