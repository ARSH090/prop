'use client'

import React, { useState, useEffect } from 'react'
import { X, Calendar, Trophy, ArrowRight } from 'lucide-react'
import Link from 'next/link'
interface EventPopupProps {
  initialData?: any
}

export function EventPopup({ initialData }: EventPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [eventData] = useState({
    is_active: initialData?.is_active ?? false,
    title: initialData?.title || 'ANURAJ FX Trading Tournament Q3 2026',
    description: initialData?.description || 'Compete in a 2-week live trading tournament with a $10,000 prize pool. Trade XAUUSD, NQ, and EURUSD on demo accounts. Top 10 traders win cash prizes and prop firm vouchers.',
    date_range: initialData?.date_range || 'August 15–29, 2026',
    prize_pool: initialData?.prize_pool || '$10,000 Prize Pool',
    banner_url: initialData?.banner_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    action_url: initialData?.action_url || '/events',
    action_label: initialData?.action_label || 'Register Now'
  })

  useEffect(() => {
    if (eventData.is_active) {
      const hasSeen = sessionStorage.getItem('afx_seen_event_popup')
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setIsOpen(true)
          sessionStorage.setItem('afx_seen_event_popup', 'true')
        }, 2000)
        return () => clearTimeout(timer)
      }
    }
  }, [eventData.is_active])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0D1321] border border-border-subtle rounded-3xl overflow-hidden shadow-2xl neon-border-cyan animate-slide-up">
        {/* Banner */}
        <div className="h-44 bg-gradient-to-br from-accent-cyan/20 to-accent-purple/30 relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15)_0%,transparent_70%)]" />
          <img
            src={eventData.banner_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80'}
            alt={eventData.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1321] via-transparent to-transparent" />
          
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/25 border border-accent-cyan/40 text-[9px] font-black text-accent-cyan uppercase tracking-widest">
            <Trophy className="w-3 h-3 animate-bounce" /> Hot Event
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-text-primary afx-gradient-heading">
              {eventData.title}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed font-semibold">
              {eventData.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 py-3 border-y border-border-subtle/50 text-xs text-text-secondary">
            {eventData.date_range && (
              <div className="flex items-center gap-1.5 font-bold">
                <Calendar className="w-3.5 h-3.5 text-accent-cyan" />
                <span>{eventData.date_range}</span>
              </div>
            )}
            {eventData.prize_pool && (
              <div className="flex items-center gap-1.5 font-bold">
                <Trophy className="w-3.5 h-3.5 text-accent-purple" />
                <span className="text-accent-purple">{eventData.prize_pool}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary transition-colors bg-transparent border border-border-subtle cursor-pointer"
            >
              Skip
            </button>
            <Link
              href={eventData.action_url || '/events'}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-black text-bg-base bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 transition-all shadow-md shadow-accent-cyan/10"
            >
              {eventData.action_label || 'Register Now'}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-black/60 hover:bg-black text-white hover:text-accent-cyan transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
export default EventPopup
