import LeaderboardPage from '../../leaderboard/page'
import { notFound } from 'next/navigation'

export default async function CategoryLeaderboardPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  const category = resolvedParams.category
  
  if (category !== 'futures' && category !== 'crypto') {
    notFound()
  }
  
  return <LeaderboardPage params={params} />
}

export const dynamic = 'force-dynamic'
