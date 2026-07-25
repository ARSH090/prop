import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { CommentsSection } from '@/components/ui/comments-section'
import { WatchlistWidget } from '@/components/ui/watchlist-widget'
import { MessageSquare, Users } from 'lucide-react'

export const metadata = {
  title: 'Trader Community Hub - ANURAJ FX',
  description: 'Discuss prop firm conditions, ask questions, share setups, and keep track of your favorite prop firms in your custom watchlist.',
}

export const dynamic = 'force-dynamic'

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col justify-between">
      <div>
        <NavBar />
        
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
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
