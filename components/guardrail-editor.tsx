"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  X,
  Shield,
  AlertTriangle,
  Pause,
  StopCircle,
  Bell,
  TrendingDown,
  TrendingUp,
  Percent,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface GuardrailRule {
  id: string
  name: string
  metric: string
  condition: "below" | "above" | "change_exceeds"
  threshold: number
  unit: "percentage" | "absolute"
  action: "alert" | "pause" | "stop"
  cooldownHours: number
  enabled: boolean
}

const defaultGuardrails: GuardrailRule[] = [
  {
    id: "guard-1",
    name: "Bounce Rate Spike",
    metric: "bounce_rate",
    condition: "above",
    threshold: 65,
    unit: "percentage",
    action: "pause",
    cooldownHours: 24,
    enabled: true,
  },
  {
    id: "guard-2",
    name: "Conversion Drop",
    metric: "conversion_rate",
    condition: "below",
    threshold: 8,
    unit: "percentage",
    action: "alert",
    cooldownHours: 12,
    enabled: true,
  },
  {
    id: "guard-3",
    name: "Error Rate",
    metric: "error_rate",
    condition: "above",
    threshold: 5,
    unit: "percentage",
    action: "stop",
    cooldownHours: 1,
    enabled: true,
  },
]

const availableMetrics = [
  { id: "conversion_rate", label: "Conversion Rate" },
  { id: "bounce_rate", label: "Bounce Rate" },
  { id: "error_rate", label: "Error Rate" },
  { id: "page_load_time", label: "Page Load Time" },
  { id: "revenue_per_user", label: "Revenue per User" },
  { id: "session_duration", label: "Session Duration" },
]

const actionColors = {
  alert: "bg-chart-4/10 text-chart-4",
  pause: "bg-chart-5/10 text-chart-5",
  stop: "bg-destructive/10 text-destructive",
}

const actionIcons = {
  alert: Bell,
  pause: Pause,
  stop: StopCircle,
}

interface GuardrailEditorProps {
  onSave?: (guardrails: GuardrailRule[]) => void
  initialGuardrails?: GuardrailRule[]
}

export function GuardrailEditor({ onSave, initialGuardrails }: GuardrailEditorProps) {
  const [guardrails, setGuardrails] = useState<GuardrailRule[]>(
    initialGuardrails || defaultGuardrails
  )
  const [editingId, setEditingId] = useState<string | null>(null)

  const addGuardrail = () => {
    const newGuardrail: GuardrailRule = {
      id: `guard-${Date.now()}`,
      name: "New Guardrail",
      metric: availableMetrics[0].id,
      condition: "above",
      threshold: 0,
      unit: "percentage",
      action: "alert",
      cooldownHours: 24,
      enabled: true,
    }
    setGuardrails([...guardrails, newGuardrail])
    setEditingId(newGuardrail.id)
  }

  const updateGuardrail = (id: string, updates: Partial<GuardrailRule>) => {
    setGuardrails(guardrails.map((g) => (g.id === id ? { ...g, ...updates } : g)))
  }

  const removeGuardrail = (id: string) => {
    setGuardrails(guardrails.filter((g) => g.id !== id))
  }

  const toggleEnabled = (id: string) => {
    setGuardrails(guardrails.map((g) => (g.id === id ? { ...g, enabled: !g.enabled } : g)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Guardrails</h3>
          <p className="text-sm text-muted-foreground">Automatic safety checks during experiment runtime</p>
        </div>
        <Button variant="outline" size="sm" onClick={addGuardrail}>
          <Plus className="w-4 h-4 mr-2" />
          Add Guardrail
        </Button>
      </div>

      {/* Guardrails List */}
      <div className="space-y-4">
        {guardrails.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <Shield className="w-10 h-10 mx-auto text-muted-foreground opacity-50 mb-3" />
            <p className="text-sm text-muted-foreground">No guardrails configured</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add guardrails to automatically monitor experiment health
            </p>
          </div>
        ) : (
          guardrails.map((guardrail) => {
            const isEditing = editingId === guardrail.id
            const ActionIcon = actionIcons[guardrail.action]
            const metricLabel = availableMetrics.find((m) => m.id === guardrail.metric)?.label || guardrail.metric

            return (
              <Card
                key={guardrail.id}
                className={cn(
                  "border-border bg-card transition-all",
                  !guardrail.enabled && "opacity-50"
                )}
              >
                <CardContent className="pt-4">
                  {isEditing ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Guardrail Name</Label>
                          <Input
                            value={guardrail.name}
                            onChange={(e) => updateGuardrail(guardrail.id, { name: e.target.value })}
                            placeholder="e.g., Bounce Rate Spike"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Metric to Monitor</Label>
                          <select
                            value={guardrail.metric}
                            onChange={(e) => updateGuardrail(guardrail.id, { metric: e.target.value })}
                            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                          >
                            {availableMetrics.map((metric) => (
                              <option key={metric.id} value={metric.id}>{metric.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Condition</Label>
                          <select
                            value={guardrail.condition}
                            onChange={(e) => updateGuardrail(guardrail.id, { condition: e.target.value as GuardrailRule["condition"] })}
                            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                          >
                            <option value="above">Goes above</option>
                            <option value="below">Falls below</option>
                            <option value="change_exceeds">Change exceeds</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Threshold</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={guardrail.threshold}
                              onChange={(e) => updateGuardrail(guardrail.id, { threshold: Number(e.target.value) })}
                            />
                            <Percent className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Action</Label>
                          <select
                            value={guardrail.action}
                            onChange={(e) => updateGuardrail(guardrail.id, { action: e.target.value as GuardrailRule["action"] })}
                            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                          >
                            <option value="alert">Send Alert</option>
                            <option value="pause">Pause Experiment</option>
                            <option value="stop">Stop Experiment</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Cooldown Period (hours)</Label>
                        <Input
                          type="number"
                          value={guardrail.cooldownHours}
                          onChange={(e) => updateGuardrail(guardrail.id, { cooldownHours: Number(e.target.value) })}
                          className="w-32"
                        />
                        <p className="text-xs text-muted-foreground">
                          Minimum time between triggered actions
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                          Done
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", actionColors[guardrail.action])}>
                          <ActionIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{guardrail.name}</p>
                          <p className="text-sm text-muted-foreground">
                            If <span className="font-medium">{metricLabel}</span>{" "}
                            {guardrail.condition === "above" && "goes above"}
                            {guardrail.condition === "below" && "falls below"}
                            {guardrail.condition === "change_exceeds" && "changes by more than"}{" "}
                            <span className="font-medium">{guardrail.threshold}%</span>
                            {" → "}
                            <span className={cn("font-medium capitalize",
                              guardrail.action === "alert" && "text-chart-4",
                              guardrail.action === "pause" && "text-chart-5",
                              guardrail.action === "stop" && "text-destructive"
                            )}>
                              {guardrail.action}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={guardrail.enabled}
                          onCheckedChange={() => toggleEnabled(guardrail.id)}
                        />
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(guardrail.id)}>
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeGuardrail(guardrail.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* SRM Detection */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground text-base">Sample Ratio Mismatch (SRM) Detection</CardTitle>
              <CardDescription>Automatically detect randomization issues</CardDescription>
            </div>
            <Switch defaultChecked />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-3/5 border border-chart-3/20">
            <CheckCircle2 className="w-5 h-5 text-chart-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">SRM detection is enabled</p>
              <p className="text-xs text-muted-foreground mt-1">
                The system will alert you if treatment/control ratios deviate significantly from expected values,
                indicating potential issues with randomization or data collection.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={() => onSave?.(guardrails)}>
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Save Guardrails
        </Button>
      </div>
    </div>
  )
}
