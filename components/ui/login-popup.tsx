'use client'

import React, { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase/client'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { X, Mail, Lock, User, ShieldAlert, Sparkles, Send } from 'lucide-react'
import { AFXCard } from './afx-card'
import { AFXButton } from './afx-button'
import { usePathname, useRouter } from 'next/navigation'

export function LoginPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  // Synth SFX Player (Web Audio API)
  const playChimeSfx = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      const now = ctx.currentTime
      
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      osc1.type = 'sine'
      osc2.type = 'triangle'
      
      osc1.connect(gainNode)
      osc2.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      // Play a high-end ascending double-chime sweep
      osc1.frequency.setValueAtTime(523.25, now) // C5
      osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.18) // C6
      
      osc2.frequency.setValueAtTime(261.63, now) // C4
      osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.15) // G5
      
      gainNode.gain.setValueAtTime(0.08, now)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
      
      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.5)
      osc2.stop(now + 0.5)
    } catch (e) {
      console.warn('Web Audio API chime sound was blocked by user interaction policy:', e)
    }
  }

  useEffect(() => {
    // Listen for authentication changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsOpen(false)
      } else {
        // STRICT PAGES: Enforce strict sign-up layout with sound on loyalty page
        if (pathname === '/loyalty') {
          setIsSignUp(true)
          setIsOpen(true)
          playChimeSfx()
        } else {
          // If not logged in, check if they already dismissed the popup in the current session
          const dismissed = sessionStorage.getItem('dismissedLoginPopup')
          if (!dismissed) {
            const timer = setTimeout(() => {
              setIsOpen(true)
              playChimeSfx()
            }, 1500)
            return () => clearTimeout(timer)
          }
        }
      }
    })
    return unsubscribe
  }, [pathname])

  const handleClose = () => {
    sessionStorage.setItem('dismissedLoginPopup', 'true')
    setIsOpen(false)
    // If they dismissed the strict popup on a protected page, kick them back to home
    if (pathname === '/loyalty') {
      router.push('/')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError('Name is required for sign up')
          setIsLoading(false)
          return
        }
        const userCred = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(userCred.user, {
          displayName: name.trim()
        })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      // Popup will auto-close due to the auth state listener
    } catch (err: any) {
      console.error('Authentication error inside popup:', err)
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-md">
        
        {/* Decorative ambient background glows */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent-purple/10 rounded-full blur-3xl pointer-events-none" />

        <AFXCard className="bg-[#120F1D] border border-[#271E3A] p-6 relative shadow-2xl rounded-3xl space-y-5">
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-bg-surface/30 transition-colors cursor-pointer"
            aria-label="Close login popup"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Heading */}
          <div className="text-center space-y-1.5 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-[10px] font-bold uppercase tracking-widest font-mono">
              <Sparkles className="w-3 h-3 text-accent-cyan" />
              Start Trading Now
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              {isSignUp ? 'Create your Account' : 'Welcome to ANURAJ FX'}
            </h3>
            <p className="text-xs text-text-secondary">
              {isSignUp ? 'Join the community of verified funded traders' : 'Sign in to access tools, giveaways & community boards'}
            </p>
          </div>

          {/* Error display */}
          {error && (
            <p className="text-xs text-rose-400 font-mono font-bold flex items-start gap-2 bg-rose-400/5 p-3 rounded-xl border border-rose-400/10">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span className="leading-snug">{error}</span>
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    required
                    placeholder="Trader Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-bg-base border border-[#271E3A] rounded-xl text-text-primary focus:border-accent-cyan focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  required
                  placeholder="trader@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-bg-base border border-[#271E3A] rounded-xl text-text-primary focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-bg-base border border-[#271E3A] rounded-xl text-text-primary focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>
            </div>

            <AFXButton
              type="submit"
              disabled={isLoading}
              variant="primary"
              className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-black py-3 rounded-xl flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider"
            >
              {isLoading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
              <Send className="w-3.5 h-3.5" />
            </AFXButton>
          </form>

          {/* Toggle form view */}
          <div className="text-center text-xs text-text-secondary pt-2 border-t border-[#271E3A]/40">
            <span>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
              }}
              className="text-accent-cyan font-bold hover:underline cursor-pointer"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

        </AFXCard>
      </div>
    </div>
  )
}
