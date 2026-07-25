import { redirect } from 'next/navigation'

export default async function CategoryOffersRedirect({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  redirect(`/${resolvedParams.category}/deals`)
}
