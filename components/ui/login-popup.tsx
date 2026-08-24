'use client'

import React, { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase/client'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { X, Mail, Lock, User, ShieldAlert, Sun, Eye, EyeOff } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

export function LoginPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Listen for custom open-auth-modal events site-wide
    const handleOpenModal = (e: any) => {
      const mode = e.detail?.mode || 'signup'
      setIsSignUp(mode === 'signup')
      setError(null)
      setIsOpen(true)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('open-auth-modal', handleOpenModal)
    }

    // Auth state listener with safe error fallback
    const unsubscribe = auth.onAuthStateChanged(
      (user: any) => {
        if (user) {
          setIsOpen(false)
        } else {
          if (pathname === '/loyalty') {
            setIsSignUp(true)
            setIsOpen(true)
          }
        }
      },
      (err: any) => {
        console.warn('Auth state observation note:', err?.message || err)
      }
    )

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('open-auth-modal', handleOpenModal)
      }
      unsubscribe()
    }
  }, [pathname])

  const handleClose = () => {
    sessionStorage.setItem('dismissedLoginPopup', 'true')
    setIsOpen(false)
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
          displayName: name.trim(),
        })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      setIsOpen(false)
    } catch (err: any) {
      console.error('Authentication error:', err)
      const code = err?.code
      if (code === 'auth/network-request-failed') {
        setError('Network error: Unable to reach authentication server. Please check your internet connection.')
      } else if (code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try signing in instead.')
      } else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Invalid email or password.')
      } else if (code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.')
      } else {
        setError(err?.message || 'Authentication failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      setIsOpen(false)
    } catch (err: any) {
      console.error('Google Sign In error:', err)
      if (err?.code === 'auth/popup-closed-by-user') {
        return
      }
      if (err?.code === 'auth/network-request-failed') {
        setError('Network error: Unable to reach Google Auth server. Please check your connection.')
        return
      }
      setError(err?.message || 'Failed to sign in with Google.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-md">
        {/* Ambient background glows */}
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-accent-cyan/20 rounded-full blur-3xl pointer-events-none" />

        {/* Translucent Glass Modal */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-3xl p-8 relative text-white space-y-5">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Close auth popup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Glowing Icon */}
          <div className="text-center pt-2">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Sun className="w-6 h-6 text-white" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isSignUp ? 'Welcome!' : 'Welcome back!'}
            </h2>

            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed px-2">
              {isSignUp
                ? 'Sign up to access your guided tools, write reviews, like firms, and track community posts'
                : 'Sign in to access your guided tools, personal watchlist, and reviews'}
            </p>
          </div>

          {/* Error notification */}
          {error && (
            <div className="text-xs text-rose-300 bg-rose-500/15 p-3 rounded-xl border border-rose-500/30 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Trader Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/15 rounded-2xl text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none transition-colors text-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/15 rounded-2xl text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/15 rounded-2xl text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot Password */}
            {!isSignUp && (
              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-0"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your email.')}
                  className="text-slate-300 hover:text-white hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-full bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 active:scale-[0.98] transition-all shadow-lg shadow-white/10 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          {/* Or Divider Line */}
          <div className="flex items-center gap-3 my-4 text-xs text-slate-400 font-mono">
            <div className="flex-1 h-[1px] bg-white/15" />
            <span>Or</span>
            <div className="flex-1 h-[1px] bg-white/15" />
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-xs font-bold text-white shadow-sm cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign In with Google
          </button>

          {/* Toggle form view footer */}
          <div className="text-center text-xs text-slate-300 pt-2 border-t border-white/10">
            <span>
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
            </span>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
              }}
              className="text-white font-bold underline hover:text-purple-300 transition-colors ml-1 cursor-pointer"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
