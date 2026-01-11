import { ExperimentPublicView } from "@/components/experiment-public-view"

interface SharePageProps {
  params: Promise<{
    token: string
  }>
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params
  return <ExperimentPublicView token={token} />
}
