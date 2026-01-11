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
  AlertTriangle,
  HelpCircle,
  Plus,
  X,
  BookOpen,
  Tag,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Learning {
  id: string
  type: "insight" | "hypothesis_validated" | "hypothesis_invalidated" | "unexpected_finding" | "best_practice"
  title: string
  description: string
  evidence: string
  confidence: "low" | "medium" | "high"
  applicability: string[]
  tags: string[]
  shouldShare: boolean
}

interface LearningWizardProps {
  experimentId: string
  experimentName: string
  onComplete?: (learnings: Learning[]) => void
  onCancel?: () => void
}

const learningTypes = [
  {
    id: "hypothesis_validated",
    label: "Hypothesis Validated",
    description: "The experiment confirmed our hypothesis",
    icon: CheckCircle2,
    color: "text-chart-3 bg-chart-3/10",
  },
  {
    id: "hypothesis_invalidated",
    label: "Hypothesis Invalidated",
    description: "The experiment disproved our hypothesis",
    icon: AlertTriangle,
    color: "text-chart-5 bg-chart-5/10",
  },
  {
    id: "unexpected_finding",
    label: "Unexpected Finding",
    description: "We discovered something we didn't expect",
    icon: Lightbulb,
    color: "text-chart-4 bg-chart-4/10",
  },
  {
    id: "best_practice",
    label: "Best Practice",
    description: "A reusable approach or technique",
    icon: BookOpen,
    color: "text-primary bg-primary/10",
  },
]

const suggestedTags = [
  "acquisition",
  "activation",
  "retention",
  "mobile",
  "desktop",
  "onboarding",
  "pricing",
  "edu",
  "conversion",
  "ux",
]

export function LearningWizard({ experimentId, experimentName, onComplete, onCancel }: LearningWizardProps) {
  const [learnings, setLearnings] = useState<Learning[]>([])
  const [currentLearning, setCurrentLearning] = useState<Partial<Learning>>({
    type: "insight",
    confidence: "medium",
    applicability: [],
    tags: [],
    shouldShare: true,
  })
  const [step, setStep] = useState(1)
  const [tagInput, setTagInput] = useState("")

  const addLearning = () => {
    if (currentLearning.title && currentLearning.description) {
      const newLearning: Learning = {
        id: `learning-${Date.now()}`,
        type: currentLearning.type as Learning["type"],
        title: currentLearning.title,
        description: currentLearning.description,
        evidence: currentLearning.evidence || "",
        confidence: currentLearning.confidence as Learning["confidence"],
        applicability: currentLearning.applicability || [],
        tags: currentLearning.tags || [],
        shouldShare: currentLearning.shouldShare || false,
      }
      setLearnings([...learnings, newLearning])
      setCurrentLearning({
        type: "insight",
        confidence: "medium",
        applicability: [],
        tags: [],
        shouldShare: true,
      })
    }
  }

  const removeLearning = (id: string) => {
    setLearnings(learnings.filter((l) => l.id !== id))
  }

  const addTag = (tag: string) => {
    if (tag && !currentLearning.tags?.includes(tag)) {
      setCurrentLearning({
        ...currentLearning,
        tags: [...(currentLearning.tags || []), tag],
      })
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setCurrentLearning({
      ...currentLearning,
      tags: currentLearning.tags?.filter((t) => t !== tag),
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Extract Learnings</h2>
        <p className="text-muted-foreground mt-1">
          Document what we learned from <span className="font-medium text-foreground">{experimentName}</span>
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
        <BookOpen className="w-5 h-5 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{learnings.length} learning{learnings.length !== 1 ? "s" : ""} captured</p>
          <p className="text-xs text-muted-foreground">At least 1 learning is required before closing the experiment</p>
        </div>
      </div>

      {/* Current Learnings */}
      {learnings.length > 0 && (
        <div className="space-y-3">
          <Label>Captured Learnings</Label>
          {learnings.map((learning) => {
            const typeConfig = learningTypes.find((t) => t.id === learning.type)
            const TypeIcon = typeConfig?.icon || Lightbulb

            return (
              <Card key={learning.id} className="border-border bg-card">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", typeConfig?.color)}>
                        <TypeIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{learning.title}</p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{learning.description}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">{typeConfig?.label}</Badge>
                          <Badge variant="secondary" className="text-xs capitalize">{learning.confidence} confidence</Badge>
                          {learning.shouldShare && (
                            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                              <Share2 className="w-3 h-3 mr-1" />
                              Shared
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLearning(learning.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add New Learning */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground text-base">Add Learning</CardTitle>
          <CardDescription>Document an insight or finding from this experiment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Learning Type */}
          <div className="space-y-2">
            <Label>Type of Learning</Label>
            <div className="grid grid-cols-2 gap-2">
              {learningTypes.map((type) => {
                const Icon = type.icon
                const isSelected = currentLearning.type === type.id

                return (
                  <button
                    key={type.id}
                    onClick={() => setCurrentLearning({ ...currentLearning, type: type.id as Learning["type"] })}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", type.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{type.label}</p>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="learning-title">Title</Label>
            <Input
              id="learning-title"
              placeholder="Brief summary of the learning"
              value={currentLearning.title || ""}
              onChange={(e) => setCurrentLearning({ ...currentLearning, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="learning-description">Description</Label>
            <Textarea
              id="learning-description"
              placeholder="Detailed explanation of what we learned and why it matters..."
              value={currentLearning.description || ""}
              onChange={(e) => setCurrentLearning({ ...currentLearning, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Evidence */}
          <div className="space-y-2">
            <Label htmlFor="learning-evidence">Supporting Evidence</Label>
            <Textarea
              id="learning-evidence"
              placeholder="Data points, metrics, or observations that support this learning..."
              value={currentLearning.evidence || ""}
              onChange={(e) => setCurrentLearning({ ...currentLearning, evidence: e.target.value })}
              rows={2}
            />
          </div>

          {/* Confidence */}
          <div className="space-y-2">
            <Label>Confidence Level</Label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setCurrentLearning({ ...currentLearning, confidence: level })}
                  className={cn(
                    "flex-1 py-2 rounded-lg border text-sm font-medium transition-all capitalize",
                    currentLearning.confidence === level
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50 text-foreground"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {currentLearning.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag(tagInput)}
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={() => addTag(tagInput)}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {suggestedTags
                .filter((t) => !currentLearning.tags?.includes(t))
                .slice(0, 6)
                .map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 text-muted-foreground"
                  >
                    + {tag}
                  </button>
                ))}
            </div>
          </div>

          {/* Share */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Add to shared learnings library</span>
            </div>
            <Button
              variant={currentLearning.shouldShare ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentLearning({ ...currentLearning, shouldShare: !currentLearning.shouldShare })}
            >
              {currentLearning.shouldShare ? "Sharing" : "Not sharing"}
            </Button>
          </div>

          {/* Add Button */}
          <Button
            className="w-full"
            onClick={addLearning}
            disabled={!currentLearning.title || !currentLearning.description}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Learning
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onComplete?.(learnings)}
          disabled={learnings.length === 0}
          className="bg-primary hover:bg-primary/90"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Save Learnings ({learnings.length})
        </Button>
      </div>
    </div>
  )
}
