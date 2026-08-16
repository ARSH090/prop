'use client'

import React, { useState } from 'react'
import { Calendar, Clock, MapPin, Users, Trophy, BookOpen, Zap, ExternalLink } from 'lucide-react'

// Define Configs
const EVENT_TYPE_CONFIG: Record<string, { icon: React.ComponentType<any>; color: string; bg: string; label: string }> = {
  tournament: { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', label: 'Tournament' },
  bootcamp: { icon: Zap, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10 border-accent-cyan/30', label: 'Bootcamp' },
  session: { icon: BookOpen, color: 'text-accent-purple', bg: 'bg-accent-purple/10 border-accent-purple/30', label: 'Live Session' },
  gaming: { icon: Trophy, color: 'text-accent-green', bg: 'bg-accent-green/10 border-accent-green/30', label: 'Gaming' },
  webinar: { icon: BookOpen, color: 'text-accent-blue', bg: 'bg-accent-blue/10 border-accent-blue/30', label: 'Webinar' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  upcoming: { label: 'Upcoming', color: 'bg-accent-blue/10 text-accent-blue border-accent-blue/30' },
  recurring: { label: 'Recurring', color: 'bg-accent-green/10 text-accent-green border-accent-green/30' },
  past: { label: 'Ended', color: 'bg-bg-base text-text-muted border-border-subtle' },
}

function EventCard({ event }: { event: any }) {
  const typeConfig = EVENT_TYPE_CONFIG[event.type] || EVENT_TYPE_CONFIG.session
  const statusConfig = STATUS_CONFIG[event.status] || STATUS_CONFIG.upcoming
  const TypeIcon = typeConfig.icon

  return (
    <div className="bg-bg-surface border border-border-subtle hover:border-accent-cyan/30 rounded-3xl overflow-hidden transition-all group relative flex flex-col justify-between h-full">
      {/* Banner Image */}
      {event.image_url && (
        <div className="h-40 overflow-hidden relative">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-bg-surface/20 to-transparent" />
        </div>
      )}

      <div className="p-6 space-y-4 relative flex-1 flex flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/2 to-accent-purple/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="space-y-4">
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
            {event.time && (
              <div className="flex items-center gap-2 text-xs text-text-muted font-mono">
                <Clock className="w-3.5 h-3.5 text-accent-cyan/60 shrink-0" />
                {event.time}
              </div>
            )}
            {event.format && (
              <div className="flex items-center gap-2 text-xs text-text-muted font-mono">
                <MapPin className="w-3.5 h-3.5 text-accent-cyan/60 shrink-0" />
                {event.format}
              </div>
            )}
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
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 relative">
              {event.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-[9px] font-mono px-2 py-0.5 rounded bg-bg-base border border-border-subtle text-text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="pt-4 relative mt-auto">
          {event.status !== 'past' ? (
            <a
              href={event.registrationUrl || '#'}
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
    </div>
  )
}

interface EventsClientProps {
  initialEvents: any[]
}

export function EventsClient({ initialEvents }: EventsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const upcoming = initialEvents.filter((e) => e.status === 'upcoming' || e.status === 'recurring')
  const past = initialEvents.filter((e) => e.status === 'past')

  // Group events by category
  const tournaments = upcoming.filter((e) => e.type === 'tournament')
  const bootcamps = upcoming.filter((e) => e.type === 'bootcamp')
  const sessions = upcoming.filter((e) => e.type === 'session')
  const gaming = upcoming.filter((e) => e.type === 'gaming')
  const webinars = upcoming.filter((e) => e.type === 'webinar')

  const categories = [
    { key: 'all', label: 'All Events', count: upcoming.length },
    { key: 'tournament', label: 'Tournaments', count: tournaments.length },
    { key: 'bootcamp', label: 'Bootcamps', count: bootcamps.length },
    { key: 'session', label: 'Live Sessions', count: sessions.length },
    { key: 'gaming', label: 'Gaming', count: gaming.length },
    { key: 'webinar', label: 'Webinars', count: webinars.length },
  ].filter(cat => cat.key === 'all' || cat.count > 0)

  // Determine what to display
  const categorySections = [
    { key: 'tournament', label: 'Tournaments & Competitions', events: tournaments, icon: Trophy, accent: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', desc: 'Compete for prizes and glory in our live trading tournaments.' },
    { key: 'bootcamp', label: 'Bootcamps & Intensives', events: bootcamps, icon: Zap, accent: 'text-accent-cyan', bg: 'bg-accent-cyan/10 border-accent-cyan/30', desc: 'Intensive training programs to accelerate your trading skills.' },
    { key: 'session', label: 'Live Sessions & Masterclasses', events: sessions, icon: BookOpen, accent: 'text-accent-purple', bg: 'bg-accent-purple/10 border-accent-purple/30', desc: 'Weekly live trading sessions and expert-led masterclasses.' },
    { key: 'gaming', label: 'Gaming & Fun Events', events: gaming, icon: Trophy, accent: 'text-accent-green', bg: 'bg-accent-green/10 border-accent-green/30', desc: 'Fun community events with a trading twist.' },
    { key: 'webinar', label: 'Webinars & Discussions', events: webinars, icon: BookOpen, accent: 'text-accent-blue', bg: 'bg-accent-blue/10 border-accent-blue/30', desc: 'Expert panels and scheduled educational webinars.' },
  ].filter((s) => s.events.length > 0 && (selectedCategory === 'all' || s.key === selectedCategory))

  return (
    <div className="space-y-12">
      {/* Interactive Category filter tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-border-subtle/30 overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.key
                ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base shadow-lg shadow-accent-cyan/10'
                : 'bg-bg-surface hover:bg-bg-surface/80 border border-border-subtle text-text-secondary hover:text-text-primary'
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Category Sections */}
      <div className="space-y-16">
        {categorySections.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border-subtle rounded-3xl bg-bg-surface/20">
            <p className="text-text-muted text-sm font-semibold">No active events in this category right now.</p>
          </div>
        ) : (
          categorySections.map((section) => {
            const SectionIcon = section.icon
            return (
              <div key={section.key} className="space-y-6">
                {/* Section Header */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${section.bg}`}>
                    <SectionIcon className={`w-6 h-6 ${section.accent}`} />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-extrabold ${section.accent}`}>{section.label}</h2>
                    <p className="text-text-muted text-sm">{section.desc}</p>
                  </div>
                  <div className="ml-auto hidden sm:flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-green/10 border border-accent-green/30 text-xs font-bold text-accent-green">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                      {section.events.length} {section.events.length === 1 ? 'Event' : 'Events'} Active
                    </span>
                  </div>
                </div>

                {/* Separator line */}
                <div className={`h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20 ${section.accent}`} />

                {/* Events Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Past Events */}
      {past.length > 0 && selectedCategory === 'all' && (
        <div className="pt-12 border-t border-border-subtle/30">
          <h2 className="text-xl font-bold text-text-secondary mb-6">Past Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
