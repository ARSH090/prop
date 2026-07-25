import HomePage from '../page'
import { notFound } from 'next/navigation'

export default async function CategoryHomePage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  const category = resolvedParams.category
  
  if (category !== 'futures' && category !== 'crypto') {
    notFound()
  }
  
  return <HomePage params={params} />
}

export const dynamic = 'force-dynamic'
