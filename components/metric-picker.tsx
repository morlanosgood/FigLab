"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Search, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface MetricOption {
  id: string
  name: string
  displayName: string
  category: "acquisition" | "activation" | "retention" | "revenue" | "referral"
  unit: string
}

const availableMetrics: MetricOption[] = [
  { id: "metric-001", name: "signup_conversion_rate", displayName: "Signup Conversion Rate", category: "acquisition", unit: "%" },
  { id: "metric-002", name: "edu_verification_rate", displayName: "EDU Verification Rate", category: "activation", unit: "%" },
  { id: "metric-003", name: "day_30_retention", displayName: "Day 30 Retention", category: "retention", unit: "%" },
  { id: "metric-004", name: "trial_to_paid_conversion", displayName: "Trial to Paid Conversion", category: "revenue", unit: "%" },
  { id: "metric-005", name: "avg_time_to_value", displayName: "Avg Time to Value", category: "activation", unit: "min" },
  { id: "metric-006", name: "referral_rate", displayName: "Referral Rate", category: "referral", unit: "%" },
  { id: "metric-007", name: "bounce_rate", displayName: "Bounce Rate", category: "acquisition", unit: "%" },
  { id: "metric-008", name: "session_duration", displayName: "Session Duration", category: "activation", unit: "min" },
]

const categoryColors: Record<MetricOption["category"], string> = {
  acquisition: "bg-chart-1/10 text-chart-1",
  activation: "bg-chart-2/10 text-chart-2",
  retention: "bg-chart-3/10 text-chart-3",
  revenue: "bg-chart-4/10 text-chart-4",
  referral: "bg-chart-5/10 text-chart-5",
}

interface MetricPickerProps {
  label?: string
  selectedMetrics: MetricOption[]
  onSelect: (metrics: MetricOption[]) => void
  maxSelections?: number
  placeholder?: string
}

export function MetricPicker({
  label,
  selectedMetrics,
  onSelect,
  maxSelections = 3,
  placeholder = "Select metrics...",
}: MetricPickerProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMetrics = availableMetrics.filter(
    (metric) =>
      metric.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleMetric = (metric: MetricOption) => {
    const isSelected = selectedMetrics.some((m) => m.id === metric.id)
    if (isSelected) {
      onSelect(selectedMetrics.filter((m) => m.id !== metric.id))
    } else if (selectedMetrics.length < maxSelections) {
      onSelect([...selectedMetrics, metric])
    }
  }

  const removeMetric = (metricId: string) => {
    onSelect(selectedMetrics.filter((m) => m.id !== metricId))
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent"
          >
            <span className={cn(selectedMetrics.length === 0 && "text-muted-foreground")}>
              {selectedMetrics.length === 0
                ? placeholder
                : `${selectedMetrics.length} metric${selectedMetrics.length > 1 ? "s" : ""} selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search metrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2">
            {filteredMetrics.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No metrics found</p>
            ) : (
              <div className="space-y-1">
                {filteredMetrics.map((metric) => {
                  const isSelected = selectedMetrics.some((m) => m.id === metric.id)
                  const isDisabled = !isSelected && selectedMetrics.length >= maxSelections

                  return (
                    <button
                      key={metric.id}
                      onClick={() => !isDisabled && toggleMetric(metric)}
                      disabled={isDisabled}
                      className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors",
                        isSelected && "bg-primary/5",
                        !isDisabled && "hover:bg-muted",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded border flex items-center justify-center flex-shrink-0",
                          isSelected ? "bg-primary border-primary" : "border-border"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{metric.displayName}</p>
                        <p className="text-xs text-muted-foreground">{metric.name}</p>
                      </div>
                      <Badge variant="secondary" className={cn("text-xs", categoryColors[metric.category])}>
                        {metric.category}
                      </Badge>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          <div className="p-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {selectedMetrics.length} of {maxSelections} metrics selected
            </p>
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected metrics display */}
      {selectedMetrics.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedMetrics.map((metric) => (
            <Badge
              key={metric.id}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {metric.displayName}
              <button
                onClick={() => removeMetric(metric.id)}
                className="ml-1 p-0.5 rounded-full hover:bg-muted-foreground/20"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

// Single metric picker variant
interface SingleMetricPickerProps {
  label?: string
  selectedMetric: MetricOption | null
  onSelect: (metric: MetricOption | null) => void
  placeholder?: string
}

export function SingleMetricPicker({
  label,
  selectedMetric,
  onSelect,
  placeholder = "Select primary metric...",
}: SingleMetricPickerProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMetrics = availableMetrics.filter(
    (metric) =>
      metric.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent"
          >
            <span className={cn(!selectedMetric && "text-muted-foreground")}>
              {selectedMetric ? selectedMetric.displayName : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search metrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2">
            {filteredMetrics.map((metric) => {
              const isSelected = selectedMetric?.id === metric.id

              return (
                <button
                  key={metric.id}
                  onClick={() => {
                    onSelect(isSelected ? null : metric)
                    setOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors hover:bg-muted",
                    isSelected && "bg-primary/5"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0",
                      isSelected ? "bg-primary border-primary" : "border-border"
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{metric.displayName}</p>
                    <p className="text-xs text-muted-foreground">{metric.name}</p>
                  </div>
                  <Badge variant="secondary" className={cn("text-xs", categoryColors[metric.category])}>
                    {metric.category}
                  </Badge>
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
