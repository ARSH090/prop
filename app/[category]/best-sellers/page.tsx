import BestSellersPage from '../../best-sellers/page'
import { notFound } from 'next/navigation'

export default async function CategoryBestSellersPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  const category = resolvedParams.category
  
  if (category !== 'futures' && category !== 'crypto') {
    notFound()
  }
  
  return <BestSellersPage params={params} />
}

export const dynamic = 'force-dynamic'
