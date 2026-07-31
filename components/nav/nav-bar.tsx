'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { AFXButton } from '@/components/ui/afx-button'
import {
  ChevronDown,
  Menu,
  X,
  LogOut,
  Star,
  Building2,
  Award,
  BarChart3,
  Zap,
  BookOpen,
  Trophy,
  Calendar,
  ArrowUpDown,
  DollarSign,
  Globe,
  Percent,
  Home,
  Users,
  Search,
} from 'lucide-react'
import { auth } from '@/lib/firebase/client'
import { signOut } from 'firebase/auth'

interface NavLink {
  label: string
  href: string
}

interface NavBarProps {
  links?: NavLink[]
}

const toolsLinks = [
  { label: 'Rules Comparison', href: '/rules', icon: BookOpen },
  { label: 'Broker Spreads', href: '/spreads', icon: ArrowUpDown },
  { label: 'Payout Proofs', href: '/payouts', icon: DollarSign },
  { label: 'Payout Leaderboard', href: '/leaderboard', icon: Trophy },
  { label: 'Industry Awards', href: '/awards', icon: Award },
  { label: 'Demo Accounts', href: '/demo-accounts', icon: Globe },
]

const subNavLinks = [
  { label: 'Home', href: '/' },
  { label: 'Offers', href: '/deals' },
  { label: 'Challenges', href: '/challenges' },
  { label: 'Best Sellers', href: '/best-sellers' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Favorite Firms', href: '/favorites' },
  { label: 'Prop Firm Rules', href: '/rules' },
  { label: 'Spreads', href: '/spreads' },
  { label: 'Payouts', href: '/payouts' },
]

const mobileMenuCategories = [
  {
    title: 'DISCOVER',
    links: [
      { label: 'Home', href: '/', icon: Home },
      { label: 'Prop Firms', href: '/firms', icon: Building2 },
      { label: 'Challenges', href: '/challenges', icon: Award },
      { label: 'Best Sellers', href: '/best-sellers', icon: Star },
      { label: 'Compare Firms', href: '/compare', icon: BarChart3 },
    ],
  },
  {
    title: 'DEALS & OFFERS',
    links: [
      { label: 'Discount Codes', href: '/deals', icon: Percent },
      { label: 'Favorites', href: '/favorites', icon: Star },
    ],
  },
  {
    title: 'TOOLS',
    links: [
      { label: 'Rules Comparison', href: '/rules', icon: BookOpen },
      { label: 'Broker Spreads', href: '/spreads', icon: ArrowUpDown },
      { label: 'Payout Proofs', href: '/payouts', icon: DollarSign },
      { label: 'Payout Leaderboard', href: '/leaderboard', icon: Trophy },
      { label: 'Industry Awards', href: '/awards', icon: Award },
      { label: 'Demo Accounts', href: '/demo-accounts', icon: Globe },
    ],
  },
  {
    title: 'COMMUNITY',
    links: [
      { label: 'Discussions Hub', href: '/community', icon: Users },
      { label: 'Blog & Guides', href: '/blog', icon: BookOpen },
      { label: 'Events', href: '/events', icon: Calendar },
    ],
  },
]

export function NavBar({ links = subNavLinks }: NavBarProps) {
  const [toolsOpen, setToolsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const toolsCloseTimer = useRef<NodeJS.Timeout | null>(null)
  const userMenuCloseTimer = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Determine active category and relative path
  let activeCategory = 'forex'
  let relativePath = pathname

  if (pathname.startsWith('/futures')) {
    activeCategory = 'futures'
    relativePath = pathname.replace('/futures', '') || '/'
  } else if (pathname.startsWith('/crypto')) {
    activeCategory = 'crypto'
    relativePath = pathname.replace('/crypto', '') || '/'
  }

  if (!relativePath.startsWith('/')) {
    relativePath = '/' + relativePath
  }

  const handleCategoryChange = (newCat: string) => {
    let targetPath = ''
    if (newCat === 'forex') {
      targetPath = relativePath
    } else {
      targetPath = `/${newCat}${relativePath === '/' ? '' : relativePath}`
    }
    // Safeguard to redirect home if on a non-category route
    const allowedBasePaths = ['/', '/best-sellers', '/challenges', '/deals', '/leaderboard', '/offers', '/reviews']
    if (!allowedBasePaths.includes(relativePath)) {
      targetPath = newCat === 'forex' ? '/' : `/${newCat}`
    }
    router.push(targetPath)
  }

  const getSubNavLinkHref = (href: string) => {
    if (activeCategory === 'forex') return href
    if (href === '/') return `/${activeCategory}`
    const isGlobalRoute = ['/favorites', '/rules', '/spreads', '/payouts'].includes(href)
    if (isGlobalRoute) return href
    return `/${activeCategory}${href}`
  }

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
    return unsub
  }, [])

  const handleToolsMouseEnter = () => {
    if (toolsCloseTimer.current) clearTimeout(toolsCloseTimer.current)
    setToolsOpen(true)
  }

  const handleToolsMouseLeave = () => {
    toolsCloseTimer.current = setTimeout(() => {
      setToolsOpen(false)
    }, 300)
  }

  const handleUserMenuMouseEnter = () => {
    if (userMenuCloseTimer.current) clearTimeout(userMenuCloseTimer.current)
    setUserMenuOpen(true)
  }

  const handleUserMenuMouseLeave = () => {
    userMenuCloseTimer.current = setTimeout(() => {
      setUserMenuOpen(false)
    }, 300)
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setUserMenuOpen(false)
      router.push('/')
    } catch (err) {
      console.error(err)
    }
  }

  const getUserInitials = (user: any) => {
    if (!user) return 'U'
    const name = user.displayName || user.email || 'User'
    return name.charAt(0).toUpperCase()
  }

  const getUserDisplayName = (user: any) => {
    if (!user) return 'User'
    return user.displayName || user.email?.split('@')[0] || 'Trader'
  }

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border-subtle bg-bg-surface/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Row 1: Brand Logo, Mock Search, Category Switcher & Main Actions */}
          <div className="flex h-16 items-center justify-between gap-4 border-b border-border-subtle/30">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 text-text-primary shrink-0">
              <img src="/logo.png" alt="EMPIRIAL Logo" className="h-8 w-auto rounded-lg object-contain" />
              <span className="text-lg font-black tracking-tight afx-gradient-heading">
                EMPIRIAL
              </span>
            </Link>

            {/* Mock Search & Category Switcher Row */}
            <div className="hidden lg:flex items-center gap-4 flex-1 max-w-xl justify-center">
              {/* Mock Search */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-base border border-border-subtle w-44 text-text-secondary text-xs">
                <Search className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-text-muted">Search...</span>
              </div>

              {/* Category Pills Switcher */}
              <div className="flex items-center gap-1 bg-bg-base border border-border-subtle rounded-full p-1 shadow-lg shadow-black/10">
                {[
                  { id: 'forex', label: 'Forex', badge: null },
                  { id: 'futures', label: 'Futures', badge: null },
                  { id: 'crypto', label: 'Crypto', badge: 'NEW' },
                ].map((tab) => {
                  const isActive = activeCategory === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleCategoryChange(tab.id)}
                      className={`relative px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-gradient-cta text-bg-base shadow-sm shadow-cyan-500/10'
                          : 'text-text-secondary hover:text-text-primary bg-transparent'
                      }`}
                    >
                      {tab.label}
                      {tab.badge && (
                        <span className="bg-emerald-500 text-white text-[8px] font-black px-1 py-0.5 rounded leading-none">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Action Buttons & Hamburger Menu */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                /* Logged-in User Menu */
                <div
                  className="relative"
                  onMouseEnter={handleUserMenuMouseEnter}
                  onMouseLeave={handleUserMenuMouseLeave}
                >
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-base border border-border-subtle hover:border-accent-cyan/40 transition-all">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-xs font-bold text-bg-base">
                      {getUserInitials(currentUser)}
                    </div>
                    <span className="text-xs font-semibold text-text-primary hidden sm:block max-w-[100px] truncate">
                      {getUserDisplayName(currentUser)}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute top-10 right-0 w-48 bg-bg-surface border border-border-subtle rounded-xl shadow-xl py-2 mt-1 backdrop-blur-md animate-fade-in z-50">
                      <div className="px-4 py-2 border-b border-border-subtle mb-1">
                        <p className="text-xs font-bold text-text-primary truncate">{getUserDisplayName(currentUser)}</p>
                        <p className="text-[10px] text-text-muted truncate">{currentUser.email}</p>
                      </div>
                      <Link
                        href="/favorites"
                        className="flex items-center gap-3 px-4 py-2.5 text-xs text-text-secondary hover:text-accent-cyan hover:bg-bg-base/50 transition-colors font-medium"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Star className="w-3.5 h-3.5" />
                        My Favorites
                      </Link>
                      <Link
                        href="/payouts"
                        className="flex items-center gap-3 px-4 py-2.5 text-xs text-text-secondary hover:text-accent-cyan hover:bg-bg-base/50 transition-colors font-medium"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        Payout Proofs
                      </Link>
                      <div className="border-t border-border-subtle mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs text-red-400 hover:bg-bg-base/50 transition-colors font-medium w-full text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth/login" className="hidden sm:block">
                    <AFXButton variant="ghost" size="sm">
                      Sign In
                    </AFXButton>
                  </Link>
                  <Link href="/auth/sign-up" className="hidden sm:block">
                    <AFXButton variant="primary" size="sm" className="bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base font-bold">
                      Sign Up
                    </AFXButton>
                  </Link>
                </>
              )}

              {/* Tools Dropdown Button */}
              <div
                className="relative hidden lg:block"
                onMouseEnter={handleToolsMouseEnter}
                onMouseLeave={handleToolsMouseLeave}
              >
                <button className="flex items-center gap-1 text-text-secondary hover:text-accent-cyan transition-colors text-xs font-semibold uppercase tracking-wider focus:outline-none">
                  Tools
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
                </button>
                {toolsOpen && (
                  <div className="absolute top-6 right-0 w-52 bg-bg-surface border border-border-subtle rounded-xl shadow-xl py-2 mt-1 backdrop-blur-md animate-fade-in z-50">
                    {toolsLinks.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs text-text-secondary hover:text-accent-cyan hover:bg-bg-base/50 transition-colors font-medium"
                        onClick={() => setToolsOpen(false)}
                      >
                        <tool.icon className="w-3.5 h-3.5 text-accent-cyan/60" />
                        {tool.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Hamburger Button (Always visible on all screen sizes next to actions) */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary hover:border-accent-cyan/40 transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Row 2: Sub-navigation links */}
          <div className="flex h-12 items-center justify-start md:justify-center overflow-x-auto scrollbar-none gap-6 md:gap-8 pt-2 pb-1">
            {links.map((link) => {
              const resolvedHref = getSubNavLinkHref(link.href)
              const isActive = pathname === resolvedHref
              return (
                <Link
                  key={link.href}
                  href={resolvedHref}
                  className={`relative pb-2 text-[11px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                    isActive 
                      ? 'text-text-primary border-b-2 border-[#EC4899]' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-in Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[90vw] bg-bg-surface border-l border-border-subtle flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="EMPIRIAL Logo" className="h-8 w-auto rounded-lg object-contain" />
            <span className="text-lg font-black tracking-tight text-text-primary">
              EMPIRIAL
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl bg-bg-base border border-border-subtle text-text-muted hover:text-text-primary transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile User Status */}
        {currentUser ? (
          <div className="p-4 border-b border-border-subtle flex items-center gap-3 bg-accent-cyan/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-sm font-bold text-bg-base shrink-0">
              {getUserInitials(currentUser)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-primary truncate">{getUserDisplayName(currentUser)}</p>
              <p className="text-xs text-text-muted truncate">{currentUser.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg text-text-muted hover:text-red-400 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-4 border-b border-border-subtle flex gap-3">
            <Link href="/auth/login" className="flex-1" onClick={() => setMobileOpen(false)}>
              <AFXButton variant="ghost" className="w-full text-sm">Sign In</AFXButton>
            </Link>
            <Link href="/auth/sign-up" className="flex-1" onClick={() => setMobileOpen(false)}>
              <AFXButton variant="primary" className="w-full text-sm bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base font-bold">Sign Up</AFXButton>
            </Link>
          </div>
        )}

        {/* Mobile Navigation Categories */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {/* Mobile Category pills switcher */}
          <div className="px-3 mb-4">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Category</p>
            <div className="flex items-center gap-1 bg-bg-base border border-border-subtle rounded-full p-1 shadow-lg w-full justify-around">
              {['forex', 'futures', 'crypto'].map((tab) => {
                const isActive = activeCategory === tab
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      handleCategoryChange(tab)
                      setMobileOpen(false)
                    }}
                    className={`relative px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex-1 text-center ${
                      isActive
                        ? 'bg-gradient-cta text-bg-base'
                        : 'text-text-secondary hover:text-text-primary bg-transparent'
                    }`}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>
          </div>

          {mobileMenuCategories.map((category) => (
            <div key={category.title}>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-3 mb-2">{category.title}</p>
              <div className="space-y-1">
                {category.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-accent-cyan hover:bg-bg-base/50 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    <link.icon className="w-4 h-4 text-accent-cyan/60 shrink-0" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Footer */}
        <div className="p-4 border-t border-border-subtle">
          <Link href="/deals" onClick={() => setMobileOpen(false)}>
            <AFXButton variant="primary" className="w-full bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base font-bold">
              <Zap className="w-4 h-4 mr-2" />
              Get Exclusive Codes
            </AFXButton>
          </Link>
        </div>
      </div>
    </>
  )
}

export default NavBar
