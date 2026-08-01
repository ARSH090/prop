'use client'

import { auth, db } from '@/lib/firebase/client'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { AFXButton } from '@/components/ui/afx-button'
import { AFXCard } from '@/components/ui/afx-card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { Check, X, Eye, EyeOff, Mail } from 'lucide-react'

interface PasswordRule {
  label: string
  test: (pw: string) => boolean
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter (A-Z)', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One number (0-9)', test: (pw) => /\d/.test(pw) },
  { label: 'One special character (!@#$...)', test: (pw) => /[!@#$%^&*(),.?":{}|<>_\-]/.test(pw) },
]

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length
  if (passed <= 1) return { score: 1, label: 'Weak', color: '#ef4444' }
  if (passed === 2) return { score: 2, label: 'Fair', color: '#f59e0b' }
  if (passed === 3) return { score: 3, label: 'Good', color: '#22c55e' }
  return { score: 4, label: 'Strong', color: '#22d3ee' }
}

export default function Page() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeat, setShowRepeat] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])
  const allRulesPassed = PASSWORD_RULES.every((r) => r.test(password))

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!allRulesPassed) {
      setError('Password does not meet all requirements.')
      return
    }
    if (password !== repeatPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Update display name if provided
      if (displayName.trim()) {
        await updateProfile(user, { displayName: displayName.trim() })
      }
      
      // Create user profile in Firestore
      const isDomainAdmin = email.toLowerCase().endsWith('@anurajfx.com') || 
                           email.toLowerCase().endsWith('@empirial.com') ||
                           email.toLowerCase().includes('admin')
      
      await setDoc(doc(db, 'profiles', user.uid), {
        id: user.uid,
        email: email,
        displayName: displayName.trim() || email.split('@')[0],
        role: isDomainAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      })
      
      // Send email verification
      await sendEmailVerification(user)
      
      setSuccess(true)
    } catch (err: any) {
      const msg = err?.code === 'auth/email-already-in-use'
        ? 'This email is already registered. Try signing in instead.'
        : err?.code === 'auth/invalid-email'
        ? 'Please enter a valid email address.'
        : err?.message || 'An error occurred. Please try again.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-bg-base">
        <div className="w-full max-w-sm">
          <AFXCard className="bg-bg-surface border border-border-subtle p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center mx-auto">
              <Mail className="w-7 h-7 text-accent-cyan" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-2">Verify Your Email</h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                A verification email has been sent to{' '}
                <span className="text-accent-cyan font-semibold">{email}</span>.{' '}
                Please check your inbox and verify your account before logging in.
              </p>
            </div>
            <div className="bg-accent-cyan/5 border border-accent-cyan/20 rounded-xl p-3 text-xs text-text-secondary">
              Didn't receive it? Check your spam folder, or{' '}
              <button
                onClick={async () => {
                  if (auth.currentUser) {
                    await sendEmailVerification(auth.currentUser)
                    alert('Verification email resent!')
                  }
                }}
                className="text-accent-cyan underline hover:text-accent-cyan/80"
              >
                resend verification email
              </button>
              .
            </div>
            <Link
              href="/auth/login"
              className="block w-full py-3 rounded-xl font-bold text-bg-base text-center text-sm bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 transition-all"
            >
              Go to Sign In
            </Link>
          </AFXCard>
        </div>
      </div>
    )
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

          <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-5">
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Display Name (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Trader"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              {/* Email */}
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

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Bar */}
                {password.length > 0 && (
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-text-muted font-mono">Strength</span>
                      <span className="text-[10px] font-bold" style={{ color: passwordStrength.color }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-1.5 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: i <= passwordStrength.score ? passwordStrength.color : '#1E2536',
                          }}
                        />
                      ))}
                    </div>

                    {/* Password Rules */}
                    <div className="space-y-1.5 pt-1">
                      {PASSWORD_RULES.map((rule) => {
                        const passed = rule.test(password)
                        return (
                          <div key={rule.label} className="flex items-center gap-2">
                            {passed ? (
                              <Check className="w-3.5 h-3.5 text-accent-green shrink-0" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-text-muted shrink-0" />
                            )}
                            <span
                              className={`text-[10px] font-mono transition-colors ${
                                passed ? 'text-accent-green' : 'text-text-muted'
                              }`}
                            >
                              {rule.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showRepeat ? 'text' : 'password'}
                    className={`w-full px-4 py-2.5 pr-10 rounded-xl bg-bg-base border text-text-primary text-sm focus:outline-none transition-colors ${
                      repeatPassword && password !== repeatPassword
                        ? 'border-red-500/50 focus:border-red-500'
                        : repeatPassword && password === repeatPassword
                        ? 'border-accent-green/50 focus:border-accent-green'
                        : 'border-border-subtle focus:border-accent-cyan'
                    }`}
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepeat(!showRepeat)}
                    className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showRepeat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {repeatPassword && password !== repeatPassword && (
                  <p className="text-[10px] text-red-400 font-mono">Passwords do not match</p>
                )}
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded font-mono border border-red-500/20">
                  {error}
                </p>
              )}

              <AFXButton
                type="submit"
                disabled={isLoading || !allRulesPassed || password !== repeatPassword}
                variant="primary"
                className="w-full font-bold bg-gradient-to-r from-accent-cyan to-accent-purple text-bg-base py-3 rounded-xl hover:opacity-95 disabled:opacity-50"
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
