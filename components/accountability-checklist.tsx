"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Rocket,
  FileText,
  Users,
  Calendar,
  ArrowRight,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ChecklistItem {
  id: string
  category: "decision" | "rollout" | "documentation" | "follow_up"
  title: string
  description: string
  required: boolean
  completed: boolean
  completedBy?: string
  completedAt?: Date
  notes?: string
}

interface DecisionLog {
  decision: "ship" | "iterate" | "stop"
  rationale: string
  decidedBy: string
  decidedAt: Date
  stakeholders: string[]
}

const defaultChecklist: ChecklistItem[] = [
  {
    id: "decision-1",
    category: "decision",
    title: "Document decision rationale",
    description: "Explain why this decision was made based on the results",
    required: true,
    completed: false,
  },
  {
    id: "decision-2",
    category: "decision",
    title: "Stakeholder sign-off",
    description: "Get approval from relevant stakeholders before proceeding",
    required: true,
    completed: false,
  },
  {
    id: "rollout-1",
    category: "rollout",
    title: "Define rollout plan",
    description: "Specify rollout percentage and timeline",
    required: true,
    completed: false,
  },
  {
    id: "rollout-2",
    category: "rollout",
    title: "Set monitoring alerts",
    description: "Configure alerts for key metrics during rollout",
    required: true,
    completed: false,
  },
  {
    id: "rollout-3",
    category: "rollout",
    title: "Prepare rollback plan",
    description: "Document steps to revert if issues arise",
    required: false,
    completed: false,
  },
  {
    id: "doc-1",
    category: "documentation",
    title: "Update experiment documentation",
    description: "Record final results and decision in the experiment record",
    required: true,
    completed: false,
  },
  {
    id: "doc-2",
    category: "documentation",
    title: "Archive experiment data",
    description: "Ensure raw data is preserved for future reference",
    required: false,
    completed: false,
  },
  {
    id: "follow-1",
    category: "follow_up",
    title: "Schedule post-rollout review",
    description: "Plan a review meeting 2-4 weeks after full rollout",
    required: true,
    completed: false,
  },
  {
    id: "follow-2",
    category: "follow_up",
    title: "Create follow-up experiment",
    description: "Document ideas for next iteration or related tests",
    required: false,
    completed: false,
  },
]

const categoryConfig = {
  decision: {
    label: "Decision",
    icon: MessageSquare,
    color: "text-primary",
  },
  rollout: {
    label: "Rollout",
    icon: Rocket,
    color: "text-chart-3",
  },
  documentation: {
    label: "Documentation",
    icon: FileText,
    color: "text-chart-4",
  },
  follow_up: {
    label: "Follow-up",
    icon: Calendar,
    color: "text-chart-2",
  },
}

interface AccountabilityChecklistProps {
  experimentId: string
  experimentName: string
  decision?: DecisionLog
  onComplete?: (checklist: ChecklistItem[], decision: DecisionLog) => void
}

export function AccountabilityChecklist({
  experimentId,
  experimentName,
  decision: initialDecision,
  onComplete,
}: AccountabilityChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist)
  const [decision, setDecision] = useState<Partial<DecisionLog>>(initialDecision || {
    decision: "ship",
    rationale: "",
    decidedBy: "John Doe",
    decidedAt: new Date(),
    stakeholders: [],
  })
  const [rolloutPercentage, setRolloutPercentage] = useState(100)
  const [rolloutDate, setRolloutDate] = useState("")

  const toggleItem = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
              completedBy: !item.completed ? "John Doe" : undefined,
              completedAt: !item.completed ? new Date() : undefined,
            }
          : item
      )
    )
  }

  const completedCount = checklist.filter((item) => item.completed).length
  const requiredCount = checklist.filter((item) => item.required).length
  const completedRequiredCount = checklist.filter((item) => item.required && item.completed).length
  const progress = (completedCount / checklist.length) * 100
  const allRequiredComplete = completedRequiredCount === requiredCount

  const groupedChecklist = Object.entries(categoryConfig).map(([category, config]) => ({
    category,
    ...config,
    items: checklist.filter((item) => item.category === category),
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Post-Experiment Checklist</h2>
        <p className="text-muted-foreground mt-1">
          Complete these items to close <span className="font-medium text-foreground">{experimentName}</span>
        </p>
      </div>

      {/* Progress */}
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                {completedCount} of {checklist.length} items completed
              </p>
              <p className="text-xs text-muted-foreground">
                {completedRequiredCount} of {requiredCount} required items
              </p>
            </div>
            <Badge
              className={cn(
                allRequiredComplete ? "bg-chart-3/10 text-chart-3" : "bg-chart-4/10 text-chart-4"
              )}
            >
              {allRequiredComplete ? "Ready to close" : "In progress"}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Decision Section */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Decision Record</CardTitle>
          <CardDescription>Document the experiment decision and rationale</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Decision</Label>
            <div className="grid grid-cols-3 gap-3">
              {(["ship", "iterate", "stop"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDecision({ ...decision, decision: d })}
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all capitalize",
                    decision.decision === d
                      ? d === "ship"
                        ? "border-chart-3 bg-chart-3/5 text-chart-3"
                        : d === "iterate"
                        ? "border-chart-4 bg-chart-4/5 text-chart-4"
                        : "border-destructive bg-destructive/5 text-destructive"
                      : "border-border hover:border-primary/50 text-foreground"
                  )}
                >
                  {d === "ship" && <Rocket className="w-4 h-4" />}
                  {d === "iterate" && <ArrowRight className="w-4 h-4" />}
                  {d === "stop" && <AlertTriangle className="w-4 h-4" />}
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rationale">Rationale</Label>
            <Textarea
              id="rationale"
              placeholder="Explain why this decision was made..."
              value={decision.rationale}
              onChange={(e) => setDecision({ ...decision, rationale: e.target.value })}
              rows={3}
            />
          </div>

          {decision.decision === "ship" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rollout Percentage</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={10}
                    value={rolloutPercentage}
                    onChange={(e) => setRolloutPercentage(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-foreground w-12">{rolloutPercentage}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rollout-date">Target Rollout Date</Label>
                <input
                  type="date"
                  id="rollout-date"
                  value={rolloutDate}
                  onChange={(e) => setRolloutDate(e.target.value)}
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Checklist by Category */}
      {groupedChecklist.map((group) => {
        const Icon = group.icon
        const groupCompleted = group.items.filter((i) => i.completed).length

        return (
          <Card key={group.category} className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={cn("w-5 h-5", group.color)} />
                  <CardTitle className="text-foreground">{group.label}</CardTitle>
                </div>
                <span className="text-sm text-muted-foreground">
                  {groupCompleted}/{group.items.length}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                      item.completed
                        ? "border-chart-3/50 bg-chart-3/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="mt-0.5">
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-chart-3" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={cn(
                          "text-sm font-medium",
                          item.completed ? "text-muted-foreground line-through" : "text-foreground"
                        )}>
                          {item.title}
                        </p>
                        {item.required && (
                          <Badge variant="outline" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      {item.completed && item.completedBy && (
                        <p className="text-xs text-chart-3 mt-2">
                          Completed by {item.completedBy} • {item.completedAt?.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button variant="outline">Save Progress</Button>
        <Button
          onClick={() => onComplete?.(checklist, decision as DecisionLog)}
          disabled={!allRequiredComplete || !decision.rationale}
          className="bg-primary hover:bg-primary/90"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Close Experiment
        </Button>
      </div>
    </div>
  )
}
