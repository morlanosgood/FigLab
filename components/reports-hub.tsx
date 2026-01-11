"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Clock,
  BarChart3,
  GraduationCap,
  Users,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Minus,
  Calendar,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock data for reports
const velocityData = [
  { week: "W1", experiments: 8 },
  { week: "W2", experiments: 12 },
  { week: "W3", experiments: 10 },
  { week: "W4", experiments: 15 },
  { week: "W5", experiments: 14 },
  { week: "W6", experiments: 18 },
  { week: "W7", experiments: 16 },
  { week: "W8", experiments: 20 },
]

const outcomeData = [
  { name: "Wins", value: 45, color: "hsl(var(--chart-3))" },
  { name: "Losses", value: 28, color: "hsl(var(--chart-5))" },
  { name: "Neutral", value: 27, color: "hsl(var(--muted-foreground))" },
]

const teamPerformance = [
  { team: "Growth", experiments: 34, winRate: 72, avgLift: 15.2 },
  { team: "Product", experiments: 28, winRate: 64, avgLift: 12.8 },
  { team: "Marketing", experiments: 22, winRate: 68, avgLift: 18.4 },
  { team: "Engineering", experiments: 16, winRate: 75, avgLift: 22.1 },
]

const recentCompletedExperiments = [
  { name: "Homepage Hero CTA Test", outcome: "win", lift: 23, date: "2024-01-10" },
  { name: "Pricing Page Simplification", outcome: "loss", lift: -8, date: "2024-01-08" },
  { name: "Social Proof Badge Placement", outcome: "neutral", lift: 2, date: "2024-01-05" },
  { name: "Onboarding Progress Indicator", outcome: "win", lift: 34, date: "2024-01-03" },
]

export function ReportsHub() {
  const stats = {
    velocityCurrentWeek: 20,
    velocityChange: 25,
    winRate: 68,
    winRateChange: 5,
    avgLift: 16.4,
    avgLiftChange: 2.3,
    activeExperiments: 24,
    pendingApprovals: 7,
    completedThisMonth: 18,
    timeToDecision: 14, // days
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Portfolio metrics, experiment velocity, and team performance
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Q1 2024 - Week 4 of 13</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Experiment Velocity
              </CardTitle>
              <Zap className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{stats.velocityCurrentWeek}</div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-chart-3" />
                <span className="text-chart-3 font-medium">+{stats.velocityChange}%</span>
                <span className="text-muted-foreground">vs last week</span>
              </div>
              <p className="text-xs text-muted-foreground">Experiments launched this week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
              <Target className="w-4 h-4 text-chart-3" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{stats.winRate}%</div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-chart-3" />
                <span className="text-chart-3 font-medium">+{stats.winRateChange}%</span>
                <span className="text-muted-foreground">vs last quarter</span>
              </div>
              <Progress value={stats.winRate} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Lift
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-chart-3" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">+{stats.avgLift}%</div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-chart-3" />
                <span className="text-chart-3 font-medium">+{stats.avgLiftChange}%</span>
                <span className="text-muted-foreground">improvement</span>
              </div>
              <p className="text-xs text-muted-foreground">For winning experiments</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Time to Decision
              </CardTitle>
              <Clock className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{stats.timeToDecision} days</div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="w-4 h-4 text-chart-3" />
                <span className="text-chart-3 font-medium">-2 days</span>
                <span className="text-muted-foreground">vs last quarter</span>
              </div>
              <p className="text-xs text-muted-foreground">Average experiment duration</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Velocity Trend */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Experiment Velocity Trend</CardTitle>
            <CardDescription>Experiments launched per week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="experiments"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Outcome Distribution */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Experiment Outcomes</CardTitle>
            <CardDescription>Distribution of experiment results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={outcomeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {outcomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4">
                {outcomeData.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-foreground">{item.name}</span>
                    <span className="text-sm font-bold text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance & Recent Experiments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Team Performance</CardTitle>
            <CardDescription>Experiment metrics by team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamPerformance.map((team) => (
                <div
                  key={team.team}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{team.team}</p>
                      <p className="text-xs text-muted-foreground">
                        {team.experiments} experiments
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-right">
                      <p className="text-chart-3 font-medium">{team.winRate}%</p>
                      <p className="text-xs text-muted-foreground">Win rate</p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground font-medium">+{team.avgLift}%</p>
                      <p className="text-xs text-muted-foreground">Avg lift</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Completed */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Recent Completions</CardTitle>
              <CardDescription>Latest experiment results</CardDescription>
            </div>
            <Link href="/library">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCompletedExperiments.map((exp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    {exp.outcome === "win" ? (
                      <CheckCircle2 className="w-5 h-5 text-chart-3" />
                    ) : exp.outcome === "loss" ? (
                      <XCircle className="w-5 h-5 text-chart-5" />
                    ) : (
                      <Minus className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium text-foreground text-sm">{exp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(exp.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      exp.outcome === "win"
                        ? "bg-chart-3/10 text-chart-3"
                        : exp.outcome === "loss"
                        ? "bg-chart-5/10 text-chart-5"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {exp.lift > 0 ? "+" : ""}
                    {exp.lift}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links to Specific Reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/reports/edu-funnel">
          <Card className="border-border bg-card hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">EDU Funnel Report</CardTitle>
                  <CardDescription>Student verification analytics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">14%</p>
                  <p className="text-xs text-muted-foreground">Conversion rate</p>
                </div>
                <Badge variant="destructive">70% drop-off</Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-border bg-card opacity-50 pointer-events-none cursor-not-allowed select-none">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Attribution Report</CardTitle>
                <CardDescription>Marketing vs Product attribution</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>

        <Card className="border-border bg-card opacity-50 pointer-events-none cursor-not-allowed select-none">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Target className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Goals Report</CardTitle>
                <CardDescription>OKR progress tracking</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
