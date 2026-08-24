import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { EventsClient } from './EventsClient'

export const metadata = {
  title: 'Trading Events, Tournaments & Bootcamps - ANURAJ FX',
  description:
    'Join live trading tournaments, prop firm bootcamps, forex sessions, and trading competitions. Register for upcoming events on ANURAJ FX.',
}

const EVENTS = [
  {
    id: 'evt-1',
    title: 'ANURAJ FX Trading Tournament Q3 2026',
    type: 'tournament',
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    description:
      'Compete in a 2-week live trading tournament with a $10,000 prize pool. Trade XAUUSD, NQ, and EURUSD on demo accounts. Top 10 traders win cash prizes and prop firm vouchers.',
    date: 'August 15–29, 2026',
    time: '9:00 AM – Market Close (IST)',
    format: 'Online (Demo Trading)',
    seats: 500,
    prize: '$10,000 Prize Pool',
    status: 'upcoming',
    registrationUrl: '#',
    tags: ['Forex', 'Futures', 'Demo'],
  },
  {
    id: 'evt-2',
    title: 'Prop Firm Bootcamp — Beginner to Funded',
    type: 'bootcamp',
    image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    description:
      'Intensive 3-day online bootcamp covering prop firm rules, risk management, challenge strategies, and how to pass FTMO, TopStep, and 5ers evaluations. Includes live mentoring.',
    date: 'July 28–30, 2026',
    time: '7:00 PM – 10:00 PM (IST)',
    format: 'Online (Zoom)',
    seats: 100,
    prize: null,
    status: 'upcoming',
    registrationUrl: '#',
    tags: ['Bootcamp', 'Beginners', 'Mentoring'],
  },
  {
    id: 'evt-3',
    title: 'Live Market Session — US Open & London Close',
    type: 'session',
    image_url: '',
    description:
      'Weekly live trading session streamed on YouTube. Trade alongside Anuraj and his team during the US Open session. Q&A, trade breakdowns, and market structure analysis.',
    date: 'Every Friday',
    time: '7:00 PM – 9:00 PM (IST)',
    format: 'YouTube Live',
    seats: null,
    prize: null,
    status: 'recurring',
    registrationUrl: 'https://youtube.com',
    tags: ['Live Session', 'Free', 'Weekly'],
  },
  {
    id: 'evt-4',
    title: 'Crypto Futures Trading Challenge',
    type: 'tournament',
    description:
      'Week-long crypto futures tournament. Trade BTC, ETH, and SOL futures. Leaderboard ranked by profit % on a fixed starting balance. Entry fee: Free.',
    date: 'September 1–7, 2026',
    time: '24/7 (Open Market Hours)',
    format: 'Online (Demo)',
    seats: 1000,
    prize: '$5,000 Prize Pool',
    status: 'upcoming',
    registrationUrl: '#',
    tags: ['Crypto', 'Futures', 'Free Entry'],
  },
  {
    id: 'evt-5',
    title: 'Risk Management Masterclass',
    type: 'session',
    description:
      'Expert-level 2-hour session on position sizing, drawdown control, and psychological discipline in prop trading. Case studies from funded traders who have achieved consistent payouts.',
    date: 'August 3, 2026',
    time: '6:00 PM – 8:00 PM (IST)',
    format: 'Online (Zoom)',
    seats: 200,
    prize: null,
    status: 'upcoming',
    registrationUrl: '#',
    tags: ['Masterclass', 'Risk Management', 'Psychology'],
  },
  {
    id: 'evt-6',
    title: 'Gaming Trading Tournament (Fantasy Leaderboard)',
    type: 'gaming',
    description:
      'Fun trading tournament with a gaming twist! Build your portfolio with virtual stocks and forex. Compete for bragging rights and community badges. No real money involved.',
    date: 'August 10–20, 2026',
    time: 'Any time',
    format: 'Online (Web App)',
    seats: 2000,
    prize: 'Community Badges + Recognition',
    status: 'upcoming',
    registrationUrl: '#',
    tags: ['Gaming', 'Fun', 'Community'],
  },
]

import { getEvents, getSiteContent } from '@/lib/firebase/server'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const [events, content] = await Promise.all([
    getEvents(),
    getSiteContent('events')
  ])

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <EventsClient content={content} initialEvents={events} />
      </main>

      <Footer />
    </div>
  )
}
