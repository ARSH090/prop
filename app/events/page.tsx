import React from 'react'
import Link from 'next/link'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { Calendar, Clock, MapPin, Users, Trophy, BookOpen, Zap, ArrowRight, ExternalLink } from 'lucide-react'

export const metadata = {
  title: 'Trading Events, Tournaments & Bootcamps - ANURAJ FX',
  description:
    'Join live trading tournaments, prop firm bootcamps, forex sessions, and trading competitions. Register for upcoming events on ANURAJ FX.',
}

const EVENTS = [
  {
    id: 'evt-1',
    title: 'ANURAJ FX Trading Tournament Q3 2025',
    type: 'tournament',
    description:
      'Compete in a 2-week live trading tournament with a $10,000 prize pool. Trade XAUUSD, NQ, and EURUSD on demo accounts. Top 10 traders win cash prizes and prop firm vouchers.',
    date: 'August 15–29, 2025',
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
    description:
      'Intensive 3-day online bootcamp covering prop firm rules, risk management, challenge strategies, and how to pass FTMO, TopStep, and 5ers evaluations. Includes live mentoring.',
    date: 'July 28–30, 2025',
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
    date: 'September 1–7, 2025',
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
    date: 'August 3, 2025',
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
    date: 'August 10–20, 2025',
    time: 'Any time',
    format: 'Online (Web App)',
    seats: 2000,
    prize: 'Community Badges + Recognition',
    status: 'upcoming',
    registrationUrl: '#',
    tags: ['Gaming', 'Fun', 'Community'],
  },
]

const EVENT_TYPE_CONFIG: Record<string, { icon: React.ComponentType<any>; color: string; bg: string; label: string }> = {
  tournament: { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', label: 'Tournament' },
  bootcamp: { icon: Zap, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10 border-accent-cyan/30', label: 'Bootcamp' },
  session: { icon: BookOpen, color: 'text-accent-purple', bg: 'bg-accent-purple/10 border-accent-purple/30', label: 'Live Session' },
  gaming: { icon: Trophy, color: 'text-accent-green', bg: 'bg-accent-green/10 border-accent-green/30', label: 'Gaming' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  upcoming: { label: 'Upcoming', color: 'bg-accent-blue/10 text-accent-blue border-accent-blue/30' },
  recurring: { label: 'Recurring', color: 'bg-accent-green/10 text-accent-green border-accent-green/30' },
  past: { label: 'Ended', color: 'bg-bg-base text-text-muted border-border-subtle' },
}

function EventCard({ event }: { event: (typeof EVENTS)[0] }) {
  const typeConfig = EVENT_TYPE_CONFIG[event.type] || EVENT_TYPE_CONFIG.session
  const statusConfig = STATUS_CONFIG[event.status] || STATUS_CONFIG.upcoming
  const TypeIcon = typeConfig.icon

  return (
    <div className="bg-bg-surface border border-border-subtle hover:border-accent-cyan/30 rounded-3xl p-6 space-y-4 transition-all group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/2 to-accent-purple/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 relative">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${typeConfig.bg}`}>
          <TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${typeConfig.bg} ${typeConfig.color}`}>
            {typeConfig.label}
          </span>
          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="relative">
        <h3 className="text-base font-bold text-text-primary group-hover:text-accent-cyan transition-colors leading-tight">
          {event.title}
        </h3>
        <p className="text-text-secondary text-xs leading-relaxed mt-2">{event.description}</p>
      </div>

      {/* Details */}
      <div className="space-y-2 relative">
        <div className="flex items-center gap-2 text-xs text-text-muted font-mono">
          <Calendar className="w-3.5 h-3.5 text-accent-cyan/60 shrink-0" />
          {event.date}
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted font-mono">
          <Clock className="w-3.5 h-3.5 text-accent-cyan/60 shrink-0" />
          {event.time}
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted font-mono">
          <MapPin className="w-3.5 h-3.5 text-accent-cyan/60 shrink-0" />
          {event.format}
        </div>
        {event.seats && (
          <div className="flex items-center gap-2 text-xs text-text-muted font-mono">
            <Users className="w-3.5 h-3.5 text-accent-cyan/60 shrink-0" />
            {event.seats.toLocaleString()} seats available
          </div>
        )}
      </div>

      {/* Prize */}
      {event.prize && (
        <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl px-3 py-2 relative">
          <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Prize</p>
          <p className="text-sm font-bold text-yellow-400 font-mono">{event.prize}</p>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 relative">
        {event.tags.map((tag) => (
          <span
            key={tag}
            className="text-[9px] font-mono px-2 py-0.5 rounded bg-bg-base border border-border-subtle text-text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="pt-2 relative">
        {event.status !== 'past' ? (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm text-bg-base bg-gradient-to-r from-accent-cyan to-accent-blue hover:opacity-90 transition-all"
          >
            Register Now
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <div className="w-full py-2.5 rounded-xl font-bold text-sm text-text-muted bg-bg-base border border-border-subtle text-center">
            Event Ended
          </div>
        )}
      </div>
    </div>
  )
}

export default function EventsPage() {
  const upcoming = EVENTS.filter((e) => e.status === 'upcoming' || e.status === 'recurring')
  const past = EVENTS.filter((e) => e.status === 'past')

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 mb-4">
            <Calendar className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider">Events & Tournaments</span>
          </div>
          <h1 className="text-4xl font-extrabold text-text-primary mb-4 afx-gradient-heading">
            Trading Events & Community
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Join live trading tournaments, prop firm bootcamps, educational sessions, and competitive trading events for the ANURAJ FX community.
          </p>
        </div>

        {/* Event Type Legend */}
        <div className="flex flex-wrap gap-3 mb-8">
          {Object.entries(EVENT_TYPE_CONFIG).map(([type, config]) => (
            <div key={type} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${config.bg} ${config.color}`}>
              <config.icon className="w-3.5 h-3.5" />
              {config.label}
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-green/10 border border-accent-green/30 text-xs font-bold text-accent-green">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              Live & Upcoming
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* Past Events */}
        {past.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-6 text-text-secondary">Past Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Host an Event CTA */}
        <div className="mt-16 bg-bg-surface border border-border-subtle rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-accent-purple/5 pointer-events-none" />
          <div className="relative space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center mx-auto">
              <Zap className="w-7 h-7 text-accent-cyan" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Want to Host an Event?</h2>
            <p className="text-text-secondary text-sm max-w-lg mx-auto">
              Are you a prop firm, trading educator, or community organizer? Partner with ANURAJ FX to host your next trading tournament, bootcamp, or webinar.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-bg-base text-sm bg-gradient-to-r from-accent-cyan to-accent-blue hover:opacity-90 transition-all"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
