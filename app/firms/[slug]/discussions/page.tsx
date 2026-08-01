import React from 'react'
import { db } from '@/lib/firebase/admin'
import { notFound } from 'next/navigation'
import { getFirms } from '@/lib/firebase/server'
import { CommentsSection } from '@/components/ui/comments-section'
import { MessageSquare } from 'lucide-react'

export const revalidate = 10

export default async function FirmDiscussionsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const snapshot = await db.collection('firms').where('slug', '==', slug).limit(1).get()

  let firm: any = null
  if (snapshot.empty) {
    const allMock = await getFirms()
    firm = allMock.find((f: any) => f.slug === slug)
    if (!firm) {
      notFound()
    }
  } else {
    const firmDoc = snapshot.docs[0]
    firm = { id: firmDoc.id, ...firmDoc.data() } as any
  }

  return (
    <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent-cyan" />
          Trader Discussion Board
        </h2>
        <p className="text-xs text-text-secondary mt-1">Post comments, ask questions, or discuss strategy parameters with other traders from India.</p>
      </div>

      <div className="border-t border-border-subtle/40 pt-4">
        <CommentsSection firmId={firm.id} />
      </div>
    </div>
  )
}
