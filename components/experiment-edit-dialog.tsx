"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Save } from "lucide-react"

interface Variant {
  id: string
  name: string
  description: string
  allocation: number
}

interface ExperimentData {
  id: string
  name: string
  status: string
  owner: string
  team: string
  locale: string
  startDate: string
  endDate: string
  riskLevel: "low" | "medium" | "high"
  rationale: string
  hypothesis: string
  successCriteria: string
  primaryMetric: string
  secondaryMetrics: string[]
  guardrailMetrics: string[]
  variants: Variant[]
  sampleSize: number
  trafficAllocation: number
}

interface ExperimentEditDialogProps {
  experiment: ExperimentData
  trigger: React.ReactNode
  onSave?: (data: ExperimentData) => void
}

export function ExperimentEditDialog({ experiment, trigger, onSave }: ExperimentEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("basics")
  const [formData, setFormData] = useState<ExperimentData>(experiment)
  const [newSecondaryMetric, setNewSecondaryMetric] = useState("")
  const [newGuardrailMetric, setNewGuardrailMetric] = useState("")

  const handleSave = () => {
    onSave?.(formData)
    setOpen(false)
  }

  const updateField = <K extends keyof ExperimentData>(field: K, value: ExperimentData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addSecondaryMetric = () => {
    if (newSecondaryMetric.trim()) {
      setFormData((prev) => ({
        ...prev,
        secondaryMetrics: [...prev.secondaryMetrics, newSecondaryMetric.trim()],
      }))
      setNewSecondaryMetric("")
    }
  }

  const removeSecondaryMetric = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      secondaryMetrics: prev.secondaryMetrics.filter((_, i) => i !== index),
    }))
  }

  const addGuardrailMetric = () => {
    if (newGuardrailMetric.trim()) {
      setFormData((prev) => ({
        ...prev,
        guardrailMetrics: [...prev.guardrailMetrics, newGuardrailMetric.trim()],
      }))
      setNewGuardrailMetric("")
    }
  }

  const removeGuardrailMetric = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      guardrailMetrics: prev.guardrailMetrics.filter((_, i) => i !== index),
    }))
  }

  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    }))
  }

  const addVariant = () => {
    const newId = `variant-${formData.variants.length}`
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: newId,
          name: `Variant ${String.fromCharCode(65 + prev.variants.length - 1)}`,
          description: "",
          allocation: 0,
        },
      ],
    }))
  }

  const removeVariant = (index: number) => {
    if (formData.variants.length > 2) {
      setFormData((prev) => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Experiment</DialogTitle>
          <DialogDescription>Make changes to your experiment configuration.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="hypothesis">Hypothesis</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
          </TabsList>

          {/* Basics Tab */}
          <TabsContent value="basics" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Experiment Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={formData.owner}
                  onChange={(e) => updateField("owner", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Input
                  id="team"
                  value={formData.team}
                  onChange={(e) => updateField("team", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locale">Locale/Region</Label>
                <Input
                  id="locale"
                  value={formData.locale}
                  onChange={(e) => updateField("locale", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => updateField("endDate", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskLevel">Risk Level</Label>
              <Select
                value={formData.riskLevel}
                onValueChange={(value: "low" | "medium" | "high") => updateField("riskLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Hypothesis Tab */}
          <TabsContent value="hypothesis" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="rationale">Rationale</Label>
              <Textarea
                id="rationale"
                value={formData.rationale}
                onChange={(e) => updateField("rationale", e.target.value)}
                placeholder="Why are we running this experiment?"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hypothesis">Hypothesis</Label>
              <Textarea
                id="hypothesis"
                value={formData.hypothesis}
                onChange={(e) => updateField("hypothesis", e.target.value)}
                placeholder="If we do X, then Y will happen because Z..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="successCriteria">Success Criteria</Label>
              <Textarea
                id="successCriteria"
                value={formData.successCriteria}
                onChange={(e) => updateField("successCriteria", e.target.value)}
                placeholder="Primary, secondary, and guardrail metrics with targets..."
                className="min-h-[100px]"
              />
            </div>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="primaryMetric">Primary Metric</Label>
              <Input
                id="primaryMetric"
                value={formData.primaryMetric}
                onChange={(e) => updateField("primaryMetric", e.target.value)}
                placeholder="e.g., Conversion Rate"
              />
            </div>

            <div className="space-y-2">
              <Label>Secondary Metrics</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.secondaryMetrics.map((metric, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {metric}
                    <button
                      type="button"
                      onClick={() => removeSecondaryMetric(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSecondaryMetric}
                  onChange={(e) => setNewSecondaryMetric(e.target.value)}
                  placeholder="Add secondary metric"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSecondaryMetric())}
                />
                <Button type="button" variant="outline" size="icon" onClick={addSecondaryMetric}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Guardrail Metrics</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.guardrailMetrics.map((metric, index) => (
                  <Badge key={index} variant="outline" className="gap-1">
                    {metric}
                    <button
                      type="button"
                      onClick={() => removeGuardrailMetric(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newGuardrailMetric}
                  onChange={(e) => setNewGuardrailMetric(e.target.value)}
                  placeholder="Add guardrail metric"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGuardrailMetric())}
                />
                <Button type="button" variant="outline" size="icon" onClick={addGuardrailMetric}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Design Tab */}
          <TabsContent value="design" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Variants</Label>
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Variant
                </Button>
              </div>

              <div className="space-y-3">
                {formData.variants.map((variant, index) => (
                  <div key={variant.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">
                        {index === 0 ? "Control" : `Variant ${String.fromCharCode(64 + index)}`}
                      </h4>
                      {index > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={variant.name}
                          onChange={(e) => updateVariant(index, "name", e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={variant.description}
                          onChange={(e) => updateVariant(index, "description", e.target.value)}
                          className="h-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Traffic Allocation (%)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={variant.allocation}
                        onChange={(e) => updateVariant(index, "allocation", parseInt(e.target.value) || 0)}
                        className="h-8 w-24"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-sm text-muted-foreground">
                Total allocation: {formData.variants.reduce((sum, v) => sum + v.allocation, 0)}%
                {formData.variants.reduce((sum, v) => sum + v.allocation, 0) !== 100 && (
                  <span className="text-destructive ml-2">(should equal 100%)</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sampleSize">Target Sample Size</Label>
                <Input
                  id="sampleSize"
                  type="number"
                  value={formData.sampleSize}
                  onChange={(e) => updateField("sampleSize", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trafficAllocation">Overall Traffic Allocation (%)</Label>
                <Input
                  id="trafficAllocation"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.trafficAllocation}
                  onChange={(e) => updateField("trafficAllocation", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
