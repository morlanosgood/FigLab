"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Copy,
  Sparkles,
  BookOpen,
  FileText,
  Clock,
  Tag,
  CheckCircle2,
  Plus,
  X,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuickCreateWizard } from "@/components/quick-create-wizard"

interface ExperimentResult {
  id: string
  name: string
  completedDate: string
  outcome: "win" | "loss" | "neutral"
  lift: number
  category: string
  hypothesis: string
  learnings: string[]
  aiPostMortem: string
  locale: string
  tags: string[]
}

interface ExperimentTemplate {
  id: string
  name: string
  description: string
  category: string
  usageCount: number
  successRate: number
  metrics: string[]
}

const mockResults: ExperimentResult[] = [
  {
    id: "result-001",
    name: "Homepage Hero CTA Test",
    completedDate: "2024-01-10",
    outcome: "win",
    lift: 23,
    category: "Landing Page",
    hypothesis: "Changing CTA from 'Learn More' to 'Get Started Free' will increase conversion",
    learnings: [
      "Action-oriented CTAs outperform informational CTAs by 23%",
      "Users prefer clear next steps over exploratory language",
      "Mobile conversion increased 31% vs desktop 18%",
    ],
    aiPostMortem:
      "Strong statistical significance (p<0.01) with consistent lift across all segments. Mobile users showed particularly strong response. Recommend rolling out globally and testing similar action-oriented language in email campaigns.",
    locale: "North America",
    tags: ["CTA", "conversion", "mobile"],
  },
  {
    id: "result-002",
    name: "Pricing Page Simplification",
    completedDate: "2024-01-08",
    outcome: "loss",
    lift: -8,
    category: "Pricing",
    hypothesis: "Reducing from 4 tiers to 3 tiers will reduce decision paralysis",
    learnings: [
      "Enterprise segment needs dedicated tier, combining hurt conversions",
      "Mid-tier customers confused by new packaging",
      "Churn risk increased 12% among existing customers",
    ],
    aiPostMortem:
      "Clear negative impact with statistical significance. The hypothesis about decision paralysis was incorrect - customers valued the specificity of 4 tiers. Recommend reverting and testing different approach like feature comparison table instead.",
    locale: "Europe",
    tags: ["pricing", "tiers", "enterprise"],
  },
  {
    id: "result-003",
    name: "Social Proof Badge Placement",
    completedDate: "2024-01-05",
    outcome: "neutral",
    lift: 2,
    category: "Social Proof",
    hypothesis: "Moving customer testimonials above the fold will increase trust signals",
    learnings: [
      "Minimal impact on conversion (2% lift, not statistically significant)",
      "Users already scrolling to read testimonials regardless of placement",
      "Above-fold space more valuable for product screenshots",
    ],
    aiPostMortem:
      "Inconclusive results suggest testimonial placement is not a primary driver. Consider testing testimonial format (video vs text) or specificity (industry-specific vs general) as alternative approaches.",
    locale: "North America",
    tags: ["social-proof", "testimonials", "above-fold"],
  },
  {
    id: "result-004",
    name: "Onboarding Progress Indicator",
    completedDate: "2024-01-03",
    outcome: "win",
    lift: 34,
    category: "Onboarding",
    hypothesis: "Adding progress bar to onboarding will increase completion rate",
    learnings: [
      "Completion rate increased 34% with progress indicator",
      "Users spent 15% less time per step but completed more steps",
      "Drop-off at step 3 reduced from 45% to 22%",
    ],
    aiPostMortem:
      "Excellent results with high statistical confidence. Progress indicators provide valuable mental model for multi-step flows. Recommend applying to other funnel experiences like checkout and profile setup. Consider A/B testing different progress styles (steps vs percentage).",
    locale: "Asia Pacific",
    tags: ["onboarding", "progress", "completion"],
  },
  {
    id: "result-005",
    name: "Email Subject Line Personalization",
    completedDate: "2023-12-28",
    outcome: "win",
    lift: 18,
    category: "Email",
    hypothesis: "Including user's first name in subject line will increase open rates",
    learnings: [
      "Open rates increased 18% with personalization",
      "Click-through rates also improved by 12%",
      "Younger demographics (18-34) showed stronger response (+24%)",
    ],
    aiPostMortem:
      "Strong positive results supporting personalization hypothesis. Consider extending to email body content and testing dynamic content based on user behavior. Watch for personalization fatigue in long-term monitoring.",
    locale: "North America",
    tags: ["email", "personalization", "open-rate"],
  },
]

const mockTemplates: ExperimentTemplate[] = [
  {
    id: "template-001",
    name: "CTA Optimization",
    description: "Test different call-to-action text, color, and placement to optimize conversion",
    category: "Conversion",
    usageCount: 45,
    successRate: 72,
    metrics: ["Conversion Rate", "Click-through Rate"],
  },
  {
    id: "template-002",
    name: "Pricing Page Test",
    description: "A/B test pricing page layouts, tier structures, and messaging",
    category: "Pricing",
    usageCount: 23,
    successRate: 48,
    metrics: ["Revenue per Visitor", "Plan Selection Rate"],
  },
  {
    id: "template-003",
    name: "Onboarding Flow Optimization",
    description: "Test different onboarding sequences to improve activation",
    category: "Onboarding",
    usageCount: 34,
    successRate: 68,
    metrics: ["Completion Rate", "Time to Value"],
  },
  {
    id: "template-004",
    name: "Email Campaign Test",
    description: "Test subject lines, send times, and content for email campaigns",
    category: "Email",
    usageCount: 56,
    successRate: 65,
    metrics: ["Open Rate", "Click Rate", "Conversion Rate"],
  },
  {
    id: "template-005",
    name: "Landing Page Test",
    description: "Test hero sections, value propositions, and page layouts",
    category: "Landing Page",
    usageCount: 67,
    successRate: 58,
    metrics: ["Bounce Rate", "Conversion Rate", "Time on Page"],
  },
]

export function Library() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedOutcome, setSelectedOutcome] = useState<string>("all")
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false)
  const [cloneSource, setCloneSource] = useState<{ name: string; hypothesis: string } | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [experiments, setExperiments] = useState<ExperimentResult[]>(mockResults)
  const [newExperiment, setNewExperiment] = useState({
    name: "",
    completedDate: new Date().toISOString().split("T")[0],
    outcome: "win" as "win" | "loss" | "neutral",
    lift: 0,
    category: "Landing Page",
    hypothesis: "",
    learnings: [""],
    locale: "North America",
    tags: "",
  })

  const handleAddExperiment = () => {
    const experiment: ExperimentResult = {
      id: `result-${Date.now()}`,
      name: newExperiment.name,
      completedDate: newExperiment.completedDate,
      outcome: newExperiment.outcome,
      lift: newExperiment.lift,
      category: newExperiment.category,
      hypothesis: newExperiment.hypothesis,
      learnings: newExperiment.learnings.filter((l) => l.trim() !== ""),
      aiPostMortem: "AI analysis will be generated after submission.",
      locale: newExperiment.locale,
      tags: newExperiment.tags.split(",").map((t) => t.trim()).filter((t) => t !== ""),
    }
    setExperiments([experiment, ...experiments])
    setAddDialogOpen(false)
    setNewExperiment({
      name: "",
      completedDate: new Date().toISOString().split("T")[0],
      outcome: "win",
      lift: 0,
      category: "Landing Page",
      hypothesis: "",
      learnings: [""],
      locale: "North America",
      tags: "",
    })
  }

  const addLearning = () => {
    setNewExperiment({ ...newExperiment, learnings: [...newExperiment.learnings, ""] })
  }

  const updateLearning = (index: number, value: string) => {
    const updated = [...newExperiment.learnings]
    updated[index] = value
    setNewExperiment({ ...newExperiment, learnings: updated })
  }

  const removeLearning = (index: number) => {
    if (newExperiment.learnings.length > 1) {
      setNewExperiment({ ...newExperiment, learnings: newExperiment.learnings.filter((_, i) => i !== index) })
    }
  }

  const filteredResults = experiments.filter((result) => {
    const matchesSearch =
      result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.hypothesis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.learnings.some((learning) => learning.toLowerCase().includes(searchQuery.toLowerCase())) ||
      result.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || result.category === selectedCategory
    const matchesOutcome = selectedOutcome === "all" || result.outcome === selectedOutcome

    return matchesSearch && matchesCategory && matchesOutcome
  })

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(experiments.map((r) => r.category)))]

  // Stats
  const stats = {
    totalExperiments: experiments.length,
    wins: experiments.filter((r) => r.outcome === "win").length,
    avgLift:
      experiments.filter((r) => r.outcome === "win").reduce((acc, r) => acc + r.lift, 0) /
        experiments.filter((r) => r.outcome === "win").length || 0,
    templates: mockTemplates.length,
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Library</h1>
          <p className="text-muted-foreground mt-1">
            Explore past experiments and reusable templates
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Experiment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Past Experiments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <div className="text-2xl font-bold text-foreground">{stats.totalExperiments}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Winning Experiments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-chart-3" />
              <div className="text-2xl font-bold text-chart-3">{stats.wins}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Win Lift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">+{stats.avgLift.toFixed(0)}%</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Templates Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <div className="text-2xl font-bold text-foreground">{stats.templates}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="results" className="space-y-6">
        <TabsList>
          <TabsTrigger value="results">Past Experiments</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search experiments, hypotheses, learnings, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border text-foreground"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px] bg-card border-border">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedOutcome} onValueChange={setSelectedOutcome}>
            <SelectTrigger className="w-full md:w-[180px] bg-card border-border">
              <SelectValue placeholder="Outcome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outcomes</SelectItem>
              <SelectItem value="win">Wins</SelectItem>
              <SelectItem value="loss">Losses</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Past Experiments */}
        <TabsContent value="results" className="space-y-4">
          {filteredResults.map((result) => (
            <Card key={result.id} className="border-border bg-card">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <CardTitle className="text-foreground">{result.name}</CardTitle>
                      <Badge
                        variant="secondary"
                        className={
                          result.outcome === "win"
                            ? "bg-chart-3/10 text-chart-3"
                            : result.outcome === "loss"
                            ? "bg-chart-5/10 text-chart-5"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {result.outcome === "win" ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : result.outcome === "loss" ? (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        ) : (
                          <Minus className="w-3 h-3 mr-1" />
                        )}
                        {result.outcome === "win"
                          ? `+${result.lift}%`
                          : result.outcome === "loss"
                          ? `${result.lift}%`
                          : `${result.lift}%`}
                      </Badge>
                      <Badge variant="outline" className="border-border">
                        {result.category}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(result.completedDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span>{result.locale}</span>
                    </CardDescription>
                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-3 h-3 text-muted-foreground" />
                      {result.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    onClick={() => {
                      setCloneSource({ name: `${result.name} (Copy)`, hypothesis: result.hypothesis })
                      setCloneDialogOpen(true)
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Clone Experiment
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hypothesis */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Hypothesis</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.hypothesis}</p>
                </div>

                {/* Lessons Learned */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Key Learnings</h4>
                  <ul className="space-y-1">
                    {result.learnings.map((learning, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-primary flex-shrink-0">•</span>
                        <span>{learning}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Post-Mortem */}
                <div className="space-y-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-semibold text-foreground">AI Post-Mortem</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.aiPostMortem}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredResults.length === 0 && (
            <Card className="border-dashed border-border bg-card">
              <CardContent className="pt-12 pb-12 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">No results found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="border-border bg-card hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <Badge variant="outline" className="mt-2">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{template.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Used {template.usageCount} times</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-chart-3" />
                      <span className="text-chart-3 font-medium">{template.successRate}% success</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.metrics.map((metric) => (
                      <Badge key={metric} variant="secondary" className="text-xs">
                        {metric}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      setCloneSource({ name: `New ${template.name}`, hypothesis: template.description })
                      setCloneDialogOpen(true)
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <Card className="border-dashed border-border bg-card">
              <CardContent className="pt-12 pb-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">No templates found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Clone/Template Dialog */}
      <Dialog open={cloneDialogOpen} onOpenChange={setCloneDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create from {cloneSource?.name.includes("Copy") ? "Clone" : "Template"}</DialogTitle>
            <DialogDescription>
              Pre-filled with data from the selected {cloneSource?.name.includes("Copy") ? "experiment" : "template"}
            </DialogDescription>
          </DialogHeader>
          <QuickCreateWizard
            onComplete={(experiment) => {
              console.log("New experiment created from clone/template:", experiment)
              setCloneDialogOpen(false)
              setCloneSource(null)
            }}
            onCancel={() => {
              setCloneDialogOpen(false)
              setCloneSource(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Add Prior Experiment Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Prior Experiment</DialogTitle>
            <DialogDescription>
              Record a completed experiment to the library for future reference
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="exp-name">Experiment Name</Label>
              <Input
                id="exp-name"
                placeholder="e.g., Homepage Hero CTA Test"
                value={newExperiment.name}
                onChange={(e) => setNewExperiment({ ...newExperiment, name: e.target.value })}
              />
            </div>

            {/* Outcome and Lift */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Outcome</Label>
                <Select
                  value={newExperiment.outcome}
                  onValueChange={(v) => setNewExperiment({ ...newExperiment, outcome: v as "win" | "loss" | "neutral" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="win">Win</SelectItem>
                    <SelectItem value="loss">Loss</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-lift">Lift (%)</Label>
                <Input
                  id="exp-lift"
                  type="number"
                  placeholder="e.g., 23"
                  value={newExperiment.lift}
                  onChange={(e) => setNewExperiment({ ...newExperiment, lift: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Category and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={newExperiment.category}
                  onValueChange={(v) => setNewExperiment({ ...newExperiment, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Landing Page">Landing Page</SelectItem>
                    <SelectItem value="Pricing">Pricing</SelectItem>
                    <SelectItem value="Onboarding">Onboarding</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Social Proof">Social Proof</SelectItem>
                    <SelectItem value="Checkout">Checkout</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-date">Completion Date</Label>
                <Input
                  id="exp-date"
                  type="date"
                  value={newExperiment.completedDate}
                  onChange={(e) => setNewExperiment({ ...newExperiment, completedDate: e.target.value })}
                />
              </div>
            </div>

            {/* Locale */}
            <div className="space-y-2">
              <Label>Locale</Label>
              <Select
                value={newExperiment.locale}
                onValueChange={(v) => setNewExperiment({ ...newExperiment, locale: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                  <SelectItem value="Latin America">Latin America</SelectItem>
                  <SelectItem value="Global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hypothesis */}
            <div className="space-y-2">
              <Label htmlFor="exp-hypothesis">Hypothesis</Label>
              <Textarea
                id="exp-hypothesis"
                placeholder="What was the hypothesis tested?"
                value={newExperiment.hypothesis}
                onChange={(e) => setNewExperiment({ ...newExperiment, hypothesis: e.target.value })}
                rows={2}
              />
            </div>

            {/* Key Learnings */}
            <div className="space-y-2">
              <Label>Key Learnings</Label>
              {newExperiment.learnings.map((learning, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Learning ${index + 1}`}
                    value={learning}
                    onChange={(e) => updateLearning(index, e.target.value)}
                  />
                  {newExperiment.learnings.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeLearning(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addLearning}>
                <Plus className="w-4 h-4 mr-2" />
                Add Learning
              </Button>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="exp-tags">Tags (comma-separated)</Label>
              <Input
                id="exp-tags"
                placeholder="e.g., CTA, conversion, mobile"
                value={newExperiment.tags}
                onChange={(e) => setNewExperiment({ ...newExperiment, tags: e.target.value })}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddExperiment}
                disabled={!newExperiment.name || !newExperiment.hypothesis}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Add to Library
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
