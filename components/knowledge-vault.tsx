"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, TrendingDown, Minus, Copy, Sparkles } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  },
]

export function KnowledgeVault() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedOutcome, setSelectedOutcome] = useState<string>("all")

  const filteredResults = mockResults.filter((result) => {
    const matchesSearch =
      result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.hypothesis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.learnings.some((learning) => learning.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || result.category === selectedCategory
    const matchesOutcome = selectedOutcome === "all" || result.outcome === selectedOutcome

    return matchesSearch && matchesCategory && matchesOutcome
  })

  const categories = ["all", ...Array.from(new Set(mockResults.map((r) => r.category)))]

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground text-balance">Knowledge Vault</h1>
        <p className="text-muted-foreground mt-1">Searchable database of experiment results and learnings</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search experiments, hypotheses, learnings..."
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">{mockResults.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Experiments</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-chart-3">
              {mockResults.filter((r) => r.outcome === "win").length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Wins</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-chart-5">
              {mockResults.filter((r) => r.outcome === "loss").length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Losses</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-muted-foreground">
              {mockResults.filter((r) => r.outcome === "neutral").length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Neutral</div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredResults.map((result) => (
          <Card key={result.id} className="border-border bg-card">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
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
                  <CardDescription>
                    Completed{" "}
                    {new Date(result.completedDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    • {result.locale}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Clone to Hypothesis
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
                <h4 className="text-sm font-semibold text-foreground">Lessons Learned</h4>
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
      </div>
    </div>
  )
}
