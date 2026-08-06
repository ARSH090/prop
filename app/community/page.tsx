import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { CommentsSection } from '@/components/ui/comments-section'
import { WatchlistWidget } from '@/components/ui/watchlist-widget'
import { MessageSquare, Users, Bell } from 'lucide-react'
import { db } from '@/lib/firebase/admin'

export const metadata = {
  title: 'Trader Community Hub - ANURAJ FX',
  description: 'Discuss prop firm conditions, ask questions, share setups, and keep track of your favorite prop firms in your custom watchlist.',
}

export const dynamic = 'force-dynamic'

export default async function CommunityPage() {
  let announcements: any[] = []
  try {
    const snap = await db.collection('announcements').orderBy('created_at', 'desc').limit(5).get()
    snap.forEach((doc: any) => {
      const data = doc.data()
      announcements.push({
        id: doc.id,
        title: data.title,
        content: data.content,
        created_at: data.created_at?.toDate() ? data.created_at.toDate().toISOString() : new Date().toISOString(),
      })
    })
  } catch (err) {
    console.warn('Failed to load announcements for community board page:', err)
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col justify-between">
      <div>
        <NavBar />
        
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          {/* Header Block */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Trader Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight afx-gradient-heading">
              AFX Community Discussions
            </h1>
            <p className="text-text-secondary text-base leading-relaxed">
              Connect with fellow prop traders, share challenge reviews, flag payout delays, and monitor active firm watchlists in real-time.
            </p>
          </div>

          {/* Official Announcements Section */}
          {announcements.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
                Official Announcements
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {announcements.slice(0, 2).map((ann) => {
                  const annDateStr = new Date(ann.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                  return (
                    <div
                      key={ann.id}
                      className="bg-gradient-to-br from-bg-surface to-bg-surface/50 border border-accent-cyan/15 p-5 rounded-2xl relative overflow-hidden group shadow-lg"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-accent-cyan/5 rounded-full blur-xl pointer-events-none" />
                      <div className="space-y-2 relative z-10">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="font-extrabold text-text-primary text-sm group-hover:text-accent-cyan transition-colors">{ann.title}</h4>
                          <span className="text-[9px] text-text-muted font-mono shrink-0">{annDateStr}</span>
                        </div>
                        <p className="text-text-secondary text-xs leading-relaxed line-clamp-2">{ann.content}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Discussion Thread (left 2 cols) */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-bg-surface border border-border-default p-6 rounded-3xl">
                <CommentsSection />
              </div>
            </div>

            {/* Watchlist & Widget Panel (right 1 col) */}
            <div className="md:col-span-1 space-y-6">
              <WatchlistWidget />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
