import { FigLabLayout } from "@/components/figlab-layout"
import { ExperimentDetail } from "@/components/experiment-detail"

interface ExperimentPageProps {
  params: Promise<{ id: string }>
}

export default async function ExperimentPage({ params }: ExperimentPageProps) {
  const { id } = await params

  return (
    <FigLabLayout>
      <ExperimentDetail experimentId={id} />
    </FigLabLayout>
  )
}
