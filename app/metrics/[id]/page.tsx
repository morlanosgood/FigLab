import { FigLabLayout } from "@/components/figlab-layout"
import { MetricDetail } from "@/components/metric-detail"

interface MetricPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function MetricPage({ params }: MetricPageProps) {
  const { id } = await params
  return (
    <FigLabLayout>
      <MetricDetail metricId={id} />
    </FigLabLayout>
  )
}
