"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  X,
  Users,
  Filter,
  Percent,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SegmentCriteria {
  id: string
  field: string
  operator: "equals" | "not_equals" | "contains" | "gt" | "lt" | "in" | "not_in"
  value: string | string[]
}

interface AudienceSegment {
  id: string
  name: string
  criteria: SegmentCriteria[]
  estimatedSize: number
  percentOfTotal: number
}

const availableFields = [
  { id: "country", label: "Country", type: "select", options: ["US", "UK", "DE", "FR", "JP", "AU", "CA"] },
  { id: "device", label: "Device Type", type: "select", options: ["Desktop", "Mobile", "Tablet"] },
  { id: "plan", label: "Plan Type", type: "select", options: ["Free", "Pro", "Team", "Enterprise"] },
  { id: "signup_date", label: "Signup Date", type: "date" },
  { id: "is_edu", label: "EDU User", type: "boolean" },
  { id: "sessions_7d", label: "Sessions (7 days)", type: "number" },
  { id: "team_size", label: "Team Size", type: "number" },
]

const operatorLabels: Record<SegmentCriteria["operator"], string> = {
  equals: "equals",
  not_equals: "does not equal",
  contains: "contains",
  gt: "greater than",
  lt: "less than",
  in: "is one of",
  not_in: "is not one of",
}

interface AudienceBuilderProps {
  onSave?: (segment: AudienceSegment) => void
  initialSegment?: AudienceSegment
}

export function AudienceBuilder({ onSave, initialSegment }: AudienceBuilderProps) {
  const [segmentName, setSegmentName] = useState(initialSegment?.name || "")
  const [criteria, setCriteria] = useState<SegmentCriteria[]>(
    initialSegment?.criteria || []
  )
  const [trafficAllocation, setTrafficAllocation] = useState(50)
  const [holdoutPercentage, setHoldoutPercentage] = useState(10)

  // Simulated audience size calculation
  const baseAudience = 1000000
  const estimatedSize = Math.round(
    baseAudience * (criteria.length > 0 ? Math.pow(0.7, criteria.length) : 1)
  )
  const percentOfTotal = Math.round((estimatedSize / baseAudience) * 100)
  const experimentSize = Math.round(estimatedSize * (trafficAllocation / 100))
  const holdoutSize = Math.round(experimentSize * (holdoutPercentage / 100))
  const treatmentSize = experimentSize - holdoutSize

  const addCriteria = () => {
    setCriteria([
      ...criteria,
      {
        id: `criteria-${Date.now()}`,
        field: availableFields[0].id,
        operator: "equals",
        value: "",
      },
    ])
  }

  const updateCriteria = (id: string, updates: Partial<SegmentCriteria>) => {
    setCriteria(criteria.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const removeCriteria = (id: string) => {
    setCriteria(criteria.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Segment Name */}
      <div className="space-y-2">
        <Label htmlFor="segment-name">Audience Name</Label>
        <Input
          id="segment-name"
          placeholder="e.g., US Mobile Users"
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
        />
      </div>

      {/* Targeting Criteria */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground text-base">Targeting Criteria</CardTitle>
              <CardDescription>Define who should be included in this experiment</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addCriteria}>
              <Plus className="w-4 h-4 mr-2" />
              Add Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {criteria.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-border rounded-lg">
              <Filter className="w-8 h-8 mx-auto text-muted-foreground opacity-50 mb-2" />
              <p className="text-sm text-muted-foreground">No filters added</p>
              <p className="text-xs text-muted-foreground mt-1">All users will be included</p>
            </div>
          ) : (
            criteria.map((c, idx) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                {idx > 0 && (
                  <Badge variant="outline" className="text-xs">AND</Badge>
                )}
                <select
                  value={c.field}
                  onChange={(e) => updateCriteria(c.id, { field: e.target.value })}
                  className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                >
                  {availableFields.map((field) => (
                    <option key={field.id} value={field.id}>{field.label}</option>
                  ))}
                </select>
                <select
                  value={c.operator}
                  onChange={(e) => updateCriteria(c.id, { operator: e.target.value as SegmentCriteria["operator"] })}
                  className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                >
                  {Object.entries(operatorLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <Input
                  placeholder="Value"
                  value={typeof c.value === "string" ? c.value : c.value.join(", ")}
                  onChange={(e) => updateCriteria(c.id, { value: e.target.value })}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCriteria(c.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Audience Size Preview */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground text-base">Audience Size</CardTitle>
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{estimatedSize.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                {percentOfTotal}% of total user base ({baseAudience.toLocaleString()} users)
              </p>
            </div>
          </div>
          <Progress value={percentOfTotal} className="h-2" />
        </CardContent>
      </Card>

      {/* Traffic Allocation */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground text-base">Traffic Allocation</CardTitle>
          <CardDescription>What percentage of the audience should be in the experiment?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Experiment Allocation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Experiment Traffic</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={trafficAllocation}
                  onChange={(e) => setTrafficAllocation(Number(e.target.value))}
                  className="w-20 text-center"
                />
                <Percent className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={trafficAllocation}
              onChange={(e) => setTrafficAllocation(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Holdout */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label>Holdout Percentage</Label>
                <div className="group relative">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 text-xs">
                    Holdout users won't see any treatment and serve as a long-term control group.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={50}
                  value={holdoutPercentage}
                  onChange={(e) => setHoldoutPercentage(Number(e.target.value))}
                  className="w-20 text-center"
                />
                <Percent className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              value={holdoutPercentage}
              onChange={(e) => setHoldoutPercentage(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Experiment Pool</p>
              <p className="text-lg font-bold text-foreground">{experimentSize.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Treatment</p>
              <p className="text-lg font-bold text-chart-3">{treatmentSize.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Holdout</p>
              <p className="text-lg font-bold text-chart-4">{holdoutSize.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warnings */}
      {estimatedSize < 1000 && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-chart-4/5 border border-chart-4">
          <AlertTriangle className="w-5 h-5 text-chart-4 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-chart-4">Small Audience Warning</p>
            <p className="text-sm text-muted-foreground mt-1">
              This audience size may not provide statistically significant results. Consider broadening your targeting criteria.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline">Preview Audience</Button>
        <Button
          onClick={() =>
            onSave?.({
              id: `segment-${Date.now()}`,
              name: segmentName,
              criteria,
              estimatedSize,
              percentOfTotal,
            })
          }
          disabled={!segmentName || criteria.length === 0}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Save Audience
        </Button>
      </div>
    </div>
  )
}
