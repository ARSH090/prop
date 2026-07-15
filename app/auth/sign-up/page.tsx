'use client'

import { auth } from '@/lib/firebase/client'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { AFXButton } from '@/components/ui/afx-button'
import { AFXCard } from '@/components/ui/afx-card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push('/')
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-bg-base">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center mb-4">
            <h1 className="font-playfair text-3xl font-bold afx-gradient-heading mb-2">
              ANURAJ FX
            </h1>
            <p className="text-text-secondary text-sm">Create your trader account</p>
          </div>

          <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Email</label>
                <input
                  type="email"
                  placeholder="trader@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded font-mono border border-red-500/20">{error}</p>}
              
              <AFXButton 
                type="submit" 
                disabled={isLoading}
                variant="primary"
                className="w-full font-bold bg-gradient-to-r from-accent-cyan to-accent-purple text-bg-base py-3 rounded-xl hover:opacity-95"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </AFXButton>
            </form>

            <div className="text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-accent-cyan hover:text-accent-cyan/80 underline underline-offset-4 font-semibold"
              >
                Sign in
              </Link>
            </div>
          </AFXCard>

          <p className="text-xs text-text-muted text-center">
            By signing up, you agree to our{' '}
            <Link href="/transparency" className="text-accent-cyan hover:underline">
              terms and disclaimers
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
