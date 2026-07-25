import ReviewsPage from '../../reviews/page'
import { notFound } from 'next/navigation'

export default async function CategoryReviewsPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  const category = resolvedParams.category
  
  if (category !== 'futures' && category !== 'crypto') {
    notFound()
  }
  
  return <ReviewsPage params={params} />
}

export const dynamic = 'force-dynamic'
