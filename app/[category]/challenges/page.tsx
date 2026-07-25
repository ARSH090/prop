import ChallengesPage from '../../challenges/page'
import { notFound } from 'next/navigation'

export default async function CategoryChallengesPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  const category = resolvedParams.category
  
  if (category !== 'futures' && category !== 'crypto') {
    notFound()
  }
  
  return <ChallengesPage params={params} />
}

export const dynamic = 'force-dynamic'
