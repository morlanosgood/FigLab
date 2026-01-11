# FigLab Growth OS

A comprehensive growth experimentation platform for managing, tracking, and optimizing A/B tests and growth experiments at scale. Built for growth teams who need visibility into experiment velocity, strategic alignment, and cumulative impact.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

### Executive Dashboard
Answer three key questions in 30 seconds:
- **Are we moving fast enough?** — Velocity tracking with sparkline trends
- **Are we learning and winning?** — Cumulative impact and goal progress
- **Are we focused on the right things?** — Strategic priority coverage

Includes:
- AI-style narrative briefing ("This Week's Story")
- Attention Required section for blockers and action items
- Strategic Coverage Map (Priority × Funnel matrix)

### Experiment Management
- **Portfolio View** — All active, draft, and completed experiments
- **Experiment Detail** — Full experiment cards with hypothesis, metrics, variants, and results
- **Quick Create Wizard** — Guided experiment setup flow
- **Edit Dialog** — Modify experiment details, metrics, and variants

### Roadmap & Prioritization
- **Priority Queue** — ICE-scored experiment backlog
- **Drag & Drop Reordering** — Reprioritize experiments visually
- **Calendar View** — Weekly experiment scheduling
- **Backlog Management** — Unscheduled experiment pool

### Strategy & OKR Alignment
- **Coverage Map** — Visual matrix of experiments by priority and funnel stage
- **OKR Tracking** — Map experiments to quarterly objectives
- **Gap Analysis** — Identify underserved strategic priorities
- **Priority Management** — Track experiment allocation

### Metrics Catalog
- **Metric Definitions** — Centralized metric registry with formulas
- **Goal Tracking** — Quarterly targets with progress visualization
- **Quality Scores** — Metric health and reliability indicators
- **Experiment Linkage** — See which experiments affect each metric

### Library & Templates
- **Past Experiments** — Searchable archive with learnings
- **AI Post-Mortems** — Automated experiment analysis
- **Templates** — Reusable experiment patterns
- **Clone & Iterate** — Build on past successes

### Insights & Observations
- **Data-Driven Insights** — Actionable findings from experiments
- **Observation Log** — Track hypotheses and ideas
- **Tagging & Filtering** — Organize by theme and priority

### Reports & Analytics
- **Portfolio Performance** — Win rate, velocity, and impact trends
- **Attribution Analysis** — Marketing vs Product contribution
- **EDU Funnel Analytics** — Student verification flow analysis
- **Governance Hub** — Approval queue for Legal, Brand, Security

### Additional Features
- **Notifications** — Real-time alerts for experiment events
- **Command Palette** — Quick navigation (⌘K)
- **Settings & Integrations** — Connect analytics platforms
- **Share & Collaborate** — Team permissions and external views

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **UI:** React 19
- **Styling:** Tailwind CSS 4
- **Components:** Radix UI primitives
- **Charts:** Recharts
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fig-lab-growth-os
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
fig-lab-growth-os/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home (redirects to experiments)
│   ├── experiments/       # Experiment routes
│   ├── roadmap/           # Roadmap page
│   ├── strategy/          # Strategy & OKR page
│   ├── insights/          # Insights page
│   ├── metrics/           # Metrics catalog
│   ├── library/           # Past experiments & templates
│   ├── reports/           # Analytics & reports
│   ├── settings/          # Configuration
│   └── notifications/     # Notification center
├── components/
│   ├── ui/                # Base UI components (shadcn/ui style)
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── the-briefing.tsx
│   │   ├── velocity-card.tsx
│   │   ├── impact-card.tsx
│   │   ├── focus-card.tsx
│   │   ├── attention-required.tsx
│   │   └── coverage-map.tsx
│   ├── figlab-layout.tsx  # Main layout with sidebar
│   ├── dashboard.tsx      # Executive dashboard
│   ├── experiments-list.tsx
│   ├── experiment-detail.tsx
│   ├── roadmap-view.tsx
│   ├── strategy-view.tsx
│   ├── metric-catalog.tsx
│   ├── library.tsx
│   ├── reports-hub.tsx
│   └── ...
├── lib/
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Executive Dashboard with velocity, impact, and strategic coverage |
| `/experiments` | Experiment portfolio list |
| `/experiments/[id]` | Individual experiment detail view |
| `/roadmap` | Prioritized backlog and calendar scheduling |
| `/strategy` | Strategic priorities and OKR alignment |
| `/insights` | Data observations and hypotheses |
| `/metrics` | Metric catalog with goals |
| `/library` | Past experiments and templates |
| `/reports` | Analytics dashboards |
| `/settings` | Integrations and configuration |
| `/notifications` | Notification center |

## Configuration

The app uses CSS variables for theming. Customize colors in `app/globals.css`:

```css
:root {
  --primary: 262 83% 58%;      /* Purple */
  --chart-1: 220 70% 50%;      /* Blue */
  --chart-2: 160 60% 45%;      /* Teal */
  --chart-3: 142 76% 36%;      /* Green */
  --chart-4: 43 96% 56%;       /* Yellow */
  --chart-5: 0 84% 60%;        /* Red */
}
```

## Data

Currently uses mock data for demonstration. In production, integrate with:
- **Analytics:** Mixpanel, Amplitude, PostHog
- **A/B Testing:** LaunchDarkly, Split, Optimizely
- **Data Warehouse:** Snowflake, BigQuery
- **Identity:** SheerID (for EDU verification)

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

---

Built with Next.js and Tailwind CSS.
