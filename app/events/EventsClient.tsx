'use client'

import React, { useState } from 'react'
import { Calendar, Clock, MapPin, Users, Trophy, BookOpen, Zap, ArrowRight, ExternalLink, Gamepad2 } from 'lucide-react'

interface Event {
  id: string
  title: string
  type: string
  image_url?: string
  description: string
  date: string
  time: string
  format: string
  seats: number | null
  prize: string | null
  status: string
  registrationUrl: string
  tags: string[]
}

interface EventsClientProps {
  content: any
  initialEvents: Event[]
}

const TABS = [
  { id: 'all', label: 'All Events' },
  { id: 'tournament', label: 'Trading Tournaments' },
  { id: 'gaming', label: 'Gaming Tournaments' },
  { id: 'bootcamp-session', label: 'Bootcamps & Sessions' }
] as const

const EVENT_TYPE_CONFIG: Record<string, { icon: React.ComponentType<any>; color: string; bg: string; label: string }> = {
  tournament: { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', label: 'Tournament' },
  bootcamp: { icon: Zap, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10 border-accent-cyan/30', label: 'Bootcamp' },
  session: { icon: BookOpen, color: 'text-accent-purple', bg: 'bg-accent-purple/10 border-accent-purple/30', label: 'Live Session' },
  gaming: { icon: Gamepad2, color: 'text-accent-green', bg: 'bg-accent-green/10 border-accent-green/30', label: 'Gaming Event' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  upcoming: { label: 'Upcoming', color: 'bg-accent-blue/10 text-accent-blue border-accent-blue/30' },
  recurring: { label: 'Recurring', color: 'bg-accent-green/10 text-accent-green border-accent-green/30' },
  past: { label: 'Ended', color: 'bg-bg-base text-text-muted border-border-subtle' },
}

export function EventsClient({ content, initialEvents }: EventsClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'tournament' | 'gaming' | 'bootcamp-session'>('all')

  const badge_text = content.badge_text || 'Events & Tournaments'
  const headline = content.headline || 'Trading Events & Community'
  const subtext = content.subtext || 'Join live trading tournaments, prop firm bootcamps, and gaming competitions.'

  // Include extra thematic Gaming Tournaments to fill up the list
  const fullEvents = [
    ...initialEvents,
    {
      id: 'gam-1',
      title: 'ANURAJ FX Apex Legends Esports Showdown',
      type: 'gaming',
      image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      description: 'The ultimate gaming cup for our discord server members. Assemble your squad, dominate the arena, and compete for $2,500 in prop firm challenge passes.',
      date: 'September 12, 2026',
      time: '6:00 PM – 10:00 PM (IST)',
      format: 'Online (Apex Legends)',
      seats: 60,
      prize: '$2,500 Challenge Vouchers',
      status: 'upcoming',
      registrationUrl: '#',
      tags: ['Esports', 'Gaming', 'Prizes']
    },
    {
      id: 'gam-2',
      title: 'Valorant Traders Arena Cup',
      type: 'gaming',
      image_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
      description: 'Weekly Valorant tournament hosted on the Anuraj FX gaming channels. Join teams of fellow prop traders, show your tactical aim, and win exclusive badges + PTS.',
      date: 'Every Saturday',
      time: '8:00 PM (IST)',
      format: 'Online (Valorant India)',
      seats: 120,
      prize: '5,000 Loyalty PTS pool',
      status: 'recurring',
      registrationUrl: '#',
      tags: ['Valorant', 'Weekly', 'Loyalty PTS']
    }
  ]

  const filteredEvents = fullEvents.filter(event => {
    if (activeTab === 'all') return true
    if (activeTab === 'tournament') return event.type === 'tournament'
    if (activeTab === 'gaming') return event.type === 'gaming'
    if (activeTab === 'bootcamp-session') return event.type === 'bootcamp' || event.type === 'session'
    return true
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 mb-4">
          <Calendar className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider">{badge_text}</span>
        </div>
        <h1 className="text-4xl font-extrabold text-text-primary mb-4 afx-gradient-heading">
          {headline}
        </h1>
        <p className="text-text-secondary text-base max-w-2xl">
          {subtext}
        </p>
      </div>

      {/* Menu Tabs bar */}
      <div className="flex flex-wrap gap-2 border-b border-border-subtle/50 pb-px">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-xs md:text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-accent-cyan text-accent-cyan font-black'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full border border-border-subtle bg-bg-surface/30 p-12 text-center rounded-3xl">
            <p className="text-text-secondary text-sm font-semibold">No active events in this category.</p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const typeConfig = EVENT_TYPE_CONFIG[event.type] || EVENT_TYPE_CONFIG.session
            const statusConfig = STATUS_CONFIG[event.status] || STATUS_CONFIG.upcoming
            const TypeIcon = typeConfig.icon

            const isGaming = event.type === 'gaming'

            return (
              <div 
                key={event.id} 
                className={`bg-bg-surface border hover:border-accent-cyan/30 rounded-3xl overflow-hidden transition-all group relative flex flex-col justify-between ${
                  isGaming ? 'border-accent-green/30 hover:border-accent-green/50 shadow-lg shadow-green-950/5' : 'border-border-subtle'
                }`}
              >
                <div>
                  {/* Banner Image */}
                  {event.image_url ? (
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-bg-surface/20 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-4 bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10" />
                  )}

                  <div className="p-6 space-y-4">
                    {/* Header badges */}
                    <div className="flex items-start justify-between gap-3">
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

                    {/* Title & description */}
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-text-primary group-hover:text-accent-cyan transition-colors leading-tight">
                        {event.title}
                      </h3>
                      <p className="text-text-secondary text-xs leading-relaxed">{event.description}</p>
                    </div>

                    {/* Meta info details */}
                    <div className="space-y-2 pt-2">
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

                    {/* Prize details */}
                    {event.prize && (
                      <div className={`border rounded-xl px-3 py-2 ${
                        isGaming ? 'bg-accent-green/5 border-accent-green/20' : 'bg-yellow-400/5 border-yellow-400/20'
                      }`}>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${isGaming ? 'text-accent-green' : 'text-yellow-400'}`}>Prize Pool</p>
                        <p className={`text-sm font-bold font-mono ${isGaming ? 'text-accent-green' : 'text-yellow-400'}`}>{event.prize}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons CTA */}
                <div className="p-6 pt-0">
                  {event.status !== 'past' ? (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-95 ${
                        isGaming 
                          ? 'text-bg-base bg-gradient-to-r from-accent-green to-emerald-500 shadow-md shadow-green-950/20' 
                          : 'text-bg-base bg-gradient-to-r from-accent-cyan to-accent-blue shadow-md'
                      }`}
                    >
                      {isGaming ? 'Join Tournament' : 'Register Now'}
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
          })
        )}
      </div>
    </div>
  )
}
