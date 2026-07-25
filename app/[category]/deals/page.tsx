import DealsPage from '../../deals/page'
import { notFound } from 'next/navigation'

export default async function CategoryDealsPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  const category = resolvedParams.category
  
  if (category !== 'futures' && category !== 'crypto') {
    notFound()
  }
  
  return <DealsPage params={params} />
}

export const dynamic = 'force-dynamic'
