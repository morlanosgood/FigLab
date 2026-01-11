"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  FlaskConical,
  Lightbulb,
  BookOpen,
  BarChart3,
  Settings,
  Plus,
  Search,
  Clock,
  TrendingUp,
  Star,
  FileText,
} from "lucide-react"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock recent items
const recentItems = [
  { id: "exp-001", name: "Growth SEO Test", type: "experiment", href: "/experiments/exp-001" },
  { id: "exp-003", name: "Email Nurture Sequence", type: "experiment", href: "/experiments/exp-003" },
  { id: "insight-002", name: "UK Student ID Upload Barrier", type: "insight", href: "/insights" },
]

// Mock saved views
const savedViews = [
  { id: "view-1", name: "My Running Experiments", href: "/?status=running&owner=me" },
  { id: "view-2", name: "Last 30 Days Results", href: "/library?timeframe=30d" },
  { id: "view-3", name: "High-Impact Wins", href: "/library?outcome=win&lift=10" },
]

// Mock experiments for search
const mockExperiments = [
  { id: "exp-001", name: "Growth SEO Test", status: "running" },
  { id: "exp-002", name: "Pricing Experiment", status: "pending" },
  { id: "exp-003", name: "Email Nurture Sequence", status: "approved" },
  { id: "exp-004", name: "Onboarding Flow V2", status: "draft" },
  { id: "exp-005", name: "Brand Campaign", status: "approved" },
]

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")

  const runCommand = useCallback(
    (command: () => void) => {
      onOpenChange(false)
      command()
    },
    [onOpenChange]
  )

  const filteredExperiments = mockExperiments.filter((exp) =>
    exp.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search experiments, insights, templates..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => router.push("/experiments/new"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Experiment</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/insights"))}>
            <Lightbulb className="mr-2 h-4 w-4" />
            <span>View Latest Insights</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Recent Items */}
        {!search && (
          <>
            <CommandGroup heading="Recent">
              {recentItems.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => runCommand(() => router.push(item.href))}
                >
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{item.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground capitalize">
                    {item.type}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {/* Saved Views */}
            <CommandGroup heading="Saved Views">
              {savedViews.map((view) => (
                <CommandItem
                  key={view.id}
                  onSelect={() => runCommand(() => router.push(view.href))}
                >
                  <Star className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{view.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />
          </>
        )}

        {/* Experiments Search Results */}
        {search && filteredExperiments.length > 0 && (
          <>
            <CommandGroup heading="Experiments">
              {filteredExperiments.map((exp) => (
                <CommandItem
                  key={exp.id}
                  onSelect={() => runCommand(() => router.push(`/experiments/${exp.id}`))}
                >
                  <FlaskConical className="mr-2 h-4 w-4" />
                  <span>{exp.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground capitalize">
                    {exp.status}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <FlaskConical className="mr-2 h-4 w-4" />
            <span>Experiments</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/insights"))}>
            <Lightbulb className="mr-2 h-4 w-4" />
            <span>Insights</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/library"))}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Library</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/reports"))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Reports</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/reports/edu-funnel"))}>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>EDU Funnel Report</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
