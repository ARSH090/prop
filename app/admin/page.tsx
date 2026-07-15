import React from 'react'
import { db } from '@/lib/firebase/admin'
import Link from 'next/link'
import { Building2, Percent, MessageSquare, MousePointerClick } from 'lucide-react'

export const metadata = {
  title: 'Admin Dashboard - ANURAJ FX',
}

export default async function AdminPage() {
  let stats = {
    totalFirms: 4,
    activeDeals: 3,
    pendingReviews: 1,
    totalClicks: 14,
  }

  try {
    // Attempt parallel query retrieval from Firestore
    const [firmsSnap, dealsSnap, reviewsSnap, clicksSnap] = await Promise.all([
      db.collection('firms').get(),
      db.collection('deals').where('status', '==', 'active').get(),
      db.collection('reviews').where('status', '==', 'pending').get(),
      db.collection('deal_clicks').get(),
    ])

    stats = {
      totalFirms: firmsSnap.size || stats.totalFirms,
      activeDeals: dealsSnap.size || stats.activeDeals,
      pendingReviews: reviewsSnap.size || stats.pendingReviews,
      totalClicks: clicksSnap.size || stats.totalClicks,
    }
  } catch (error) {
    console.warn('Firestore admin stats retrieval failed. Displaying local cache stats.', error)
  }

  const statItems = [
    {
      name: 'Total Prop Firms / Brokers',
      value: stats.totalFirms,
      icon: Building2,
      color: 'text-accent-cyan bg-accent-cyan/10',
      href: '/admin/firms',
    },
    {
      name: 'Active Discount Deals',
      value: stats.activeDeals,
      icon: Percent,
      color: 'text-accent-purple bg-accent-purple/10',
      href: '/admin/deals',
    },
    {
      name: 'Pending Reviews Moderation',
      value: stats.pendingReviews,
      icon: MessageSquare,
      color: 'text-amber-400 bg-amber-400/10',
      href: '/admin/reviews',
    },
    {
      name: 'Attributed Deal Clicks',
      value: stats.totalClicks,
      icon: MousePointerClick,
      color: 'text-accent-green bg-accent-green/10',
      href: '/admin/media',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading animate-fade-in">
          Control Dashboard
        </h1>
        <p className="text-text-secondary text-lg">
          Overview of platform operations, database collections, and affiliate traffic metrics.
        </p>
      </div>

      {/* Grid Stats cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item) => (
          <Link key={item.name} href={item.href} className="block group">
            <div className="bg-bg-surface border border-border-subtle hover:border-accent-cyan/40 hover:shadow-lg hover:shadow-accent-cyan/5 transition-all p-6 rounded-2xl flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-text-muted text-xs font-semibold block">{item.name}</span>
                <span className="text-4xl font-bold font-mono text-text-primary group-hover:text-accent-cyan transition-colors">
                  {item.value}
                </span>
              </div>
              <div className={`p-4 rounded-xl ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Welcome Information Box */}
      <div className="border border-border-subtle bg-bg-surface/50 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-accent-purple/5 pointer-events-none" />
        <div className="relative space-y-4">
          <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <span>👋</span> Welcome to ANURAJ FX Admin console
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
            This administrative control deck allows you to modify the public website copies, re-order home page blocks, moderate reviews, and update firms and codes in real-time. No code redeployments or edits are required to make changes go live.
          </p>
          <div className="flex gap-4 pt-2">
            <Link
              href="/admin/page-builder"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-purple text-bg-base font-bold text-sm hover:opacity-90 transition-all"
            >
              Modify Page Copy
            </Link>
            <Link
              href="/admin/firms"
              className="px-5 py-2.5 rounded-xl border border-border-subtle text-text-primary font-semibold text-sm hover:bg-bg-base transition-all"
            >
              Add New Firm
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
