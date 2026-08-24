'use client'

export function openAuthModal(mode: 'signup' | 'signin' = 'signup') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode } }))
  }
}

export function requireAuth(
  user: any,
  action: () => void,
  mode: 'signup' | 'signin' = 'signup'
) {
  if (user) {
    action()
  } else {
    openAuthModal(mode)
  }
}
