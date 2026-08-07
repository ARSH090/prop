'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { AFXCard } from '@/components/ui/afx-card'
import { auth } from '@/lib/firebase/client'
import { 
  LayoutGrid, 
  User, 
  LineChart, 
  Shield, 
  Share2, 
  Gift, 
  HelpCircle, 
  MessageSquare, 
  Bookmark, 
  Sparkles, 
  Lock,
  ChevronRight,
  Trash2,
  Star,
  CheckCircle,
  Key,
  Award
} from 'lucide-react'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'

// Custom Diamond SVG Icon matching the design aesthetics
function DiamondIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L2 12L12 22L22 12L12 2Z" />
    </svg>
  )
}

export default function LoyaltyPage() {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState('Overview')
  const [loyaltyTab, setLoyaltyTab] = useState<'Accounts' | 'History'>('Accounts')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [promoCode, setPromoCode] = useState('')
  const [claiming, setClaiming] = useState(false)
  const [submittingPromo, setSubmittingPromo] = useState(false)

  // Real loyalty data from database
  const [loyaltyData, setLoyaltyData] = useState({
    points: 200,
    tier: 1,
    claimed_dates: [] as string[],
    unlocked_rewards: [] as string[],
  })

  // History logs list
  const [historyLogs, setHistoryLogs] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // Bookmarks state
  const [bookmarkedFirms, setBookmarkedFirms] = useState<any[]>([])
  const [loadingBookmarks, setLoadingBookmarks] = useState(false)

  // Reviews state
  const [userReviews, setUserReviews] = useState<any[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user)
        await loadLoyaltyData(user.email || '')
        setLoading(false)
      } else {
        setCurrentUser(null)
        setLoading(false)
        router.push('/auth/login?redirect=/loyalty')
      }
    })
    return unsub
  }, [router])

  useEffect(() => {
    if (currentUser && activeMenu === 'Bookmarks') {
      loadBookmarks()
    }
    if (currentUser && (activeMenu === 'My Reviews' || activeMenu === 'Pending Reviews')) {
      loadUserReviews()
    }
  }, [activeMenu, currentUser])

  useEffect(() => {
    if (currentUser && loyaltyTab === 'History') {
      loadHistory()
    }
  }, [loyaltyTab, currentUser])

  const loadLoyaltyData = async (email: string) => {
    try {
      const res = await fetch(`/api/loyalty?email=${encodeURIComponent(email)}`)
      if (res.ok) {
        const json = await res.json()
        if (json.data) {
          setLoyaltyData({
            points: json.data.points ?? 200,
            tier: json.data.tier ?? 1,
            claimed_dates: json.data.claimed_dates || [],
            unlocked_rewards: json.data.unlocked_rewards || [],
          })
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const loadHistory = async () => {
    if (!currentUser) return
    setLoadingHistory(true)
    try {
      const res = await fetch(`/api/loyalty/history?email=${encodeURIComponent(currentUser.email || '')}`)
      if (res.ok) {
        const json = await res.json()
        setHistoryLogs(json.data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingHistory(false)
    }
  }

  const loadBookmarks = async () => {
    if (!currentUser) return
    setLoadingBookmarks(true)
    try {
      const [favRes, firmsRes] = await Promise.all([
        fetch(`/api/favorites?user_id=${currentUser.uid}`),
        fetch('/api/admin/firms'),
      ])
      if (favRes.ok && firmsRes.ok) {
        const favData = await favRes.json()
        const firmsData = await firmsRes.json()
        const favIds = favData.data?.map((f: any) => f.firm_id) || []
        const allFirms = firmsData.data || []
        setBookmarkedFirms(allFirms.filter((f: any) => favIds.includes(f.id)))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingBookmarks(false)
    }
  }

  const loadUserReviews = async () => {
    if (!currentUser) return
    setLoadingReviews(true)
    try {
      const res = await fetch(`/api/reviews?firm_id=all`)
      if (res.ok) {
        const json = await res.json()
        const list = json.data || []
        // Filter reviews created by current user
        setUserReviews(list.filter((r: any) => r.user_id === currentUser.uid))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingReviews(false)
    }
  }

  const handleClaimDaily = async () => {
    if (!currentUser || claiming) return
    setClaiming(true)
    try {
      const res = await fetch('/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          action: 'claim_daily',
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setLoyaltyData((prev) => ({
          ...prev,
          points: data.points,
          claimed_dates: data.claimed_dates,
        }))
        alert('Daily check-in successful! +10 Points claimed.')
        loadHistory()
      } else {
        alert(data.error || 'Failed to claim daily reward')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setClaiming(false)
    }
  }

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoCode.trim() || submittingPromo || !currentUser) return
    setSubmittingPromo(true)
    try {
      const res = await fetch('/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          action: 'submit_code',
          payload: { code: promoCode },
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setLoyaltyData((prev) => ({
          ...prev,
          points: data.points,
        }))
        alert(data.message || 'Promo code applied successfully!')
        setPromoCode('')
        loadHistory()
      } else {
        alert(data.error || 'Invalid promo code')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmittingPromo(false)
    }
  }

  const handleRedeemReward = async (size: string, cost: number) => {
    if (!currentUser) return
    if (loyaltyData.points < cost) {
      alert(`Insufficient loyalty points! You need ${cost} points to redeem this reward.`)
      return
    }
    if (!confirm(`Are you sure you want to redeem your points to unlock the ${size} evaluation challenge reward?`)) {
      return
    }

    try {
      const res = await fetch('/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          action: 'redeem_reward',
          payload: { size, cost },
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setLoyaltyData((prev) => ({
          ...prev,
          points: data.points,
          unlocked_rewards: data.unlocked_rewards,
        }))
        alert(`Success! Unlocked the ${size} evaluation challenge reward!`)
        loadHistory()
      } else {
        alert(data.error || 'Failed to redeem reward')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemoveBookmark = async (firmId: string) => {
    if (!currentUser) return
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.uid, firm_id: firmId }),
      })
      if (res.ok) {
        setBookmarkedFirms((prev) => prev.filter((f) => f.id !== firmId))
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Trader'
  const userEmail = currentUser?.email || ''
  const userInitials = userDisplayName.charAt(0).toUpperCase()

  const sidebarMenuItems: { name: string; icon: any; suffix?: string; badge?: string }[] = [
    { name: 'Overview', icon: LayoutGrid },
    { name: 'My Profile', icon: User },
    { name: 'Account Security', icon: Shield },
    { name: 'Weekly Giveaway', icon: Gift, suffix: '✨' },
    { name: 'FAQ & Support', icon: HelpCircle },
    { name: 'My Reviews', icon: MessageSquare },
    { name: 'Pending Reviews', icon: MessageSquare },
    { name: 'Bookmarks', icon: Bookmark },
  ]

  const loyaltyRewards = [
    { size: '5K', cost: 2000, points: '2,000' },
    { size: '10K', cost: 4000, points: '4,000' },
    { size: '25K', cost: 7000, points: '7,000' },
    { size: '50K', cost: 10000, points: '10,000' },
    { size: '100K', cost: 16000, points: '16,000' },
    { size: '200K', cost: 28000, points: '28,000' },
    { size: '300K', cost: 35000, points: '35,000' },
    { size: '400K', cost: 42000, points: '42,000' },
    { size: '500K', cost: 50000, points: '50,000' },
  ]

  const todayStr = new Date().toISOString().split('T')[0]
  const alreadyClaimedToday = loyaltyData.claimed_dates?.includes(todayStr)

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Area */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex flex-col space-y-4">
              
              {/* User details */}
              <div className="flex items-center gap-3 px-2 py-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center font-bold text-lg text-bg-base">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-text-primary text-base truncate">{userDisplayName}</h3>
                  <p className="text-text-secondary text-xs truncate">{userEmail}</p>
                </div>
              </div>

              {/* Loyalty Points Card */}
              <div className="bg-[#120F1D] border border-[#271E3A] rounded-2xl p-5 relative overflow-hidden shadow-lg shadow-purple-950/5">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
                <h4 className="text-sm font-extrabold text-white tracking-wide uppercase mb-3">
                  Loyalty Points
                </h4>
                
                {/* Custom purple progress bar */}
                <div className="w-full bg-[#1F192C] h-1.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-gradient-to-r from-accent-purple to-pink-500 h-full rounded-full w-[25%]" />
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5 text-white font-bold text-base">
                    <DiamondIcon className="w-4 h-4 text-purple-400" />
                    {loyaltyData.points}
                  </div>
                  <span className="text-xs font-bold text-orange-500 font-mono">
                    {loyaltyData.unlocked_rewards?.length || 0}/9
                  </span>
                </div>
              </div>

              {/* Vertical Menu Options */}
              <div className="space-y-1">
                {sidebarMenuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeMenu === item.name
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveMenu(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                        isActive 
                          ? 'bg-bg-surface text-accent-cyan border-l-2 border-accent-cyan pl-4' 
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-accent-cyan' : 'text-text-secondary/80'}`} />
                        <span>{item.name} {item.suffix && <span className="ml-1">{item.suffix}</span>}</span>
                      </div>
                      
                      {item.badge && (
                        <span className="bg-[#0e372e] text-[#10b981] font-bold text-[9px] px-2 py-0.5 rounded tracking-wide">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {activeMenu === 'Overview' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                
                {/* Your Points Balance Card & Analytics Card wrapper */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-[#120F1D] border border-[#231A32] rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
                    
                    <div className="space-y-4">
                      <h3 className="text-text-secondary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        Your Points Balance
                        <span className="text-text-muted text-[10px] cursor-help">ⓘ</span>
                      </h3>
                      
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-[#D946EF]/20 flex items-center justify-center text-purple-400">
                          <DiamondIcon className="w-5 h-5" />
                        </div>
                        <span className="text-4xl font-extrabold text-white tracking-tight font-mono">{loyaltyData.points}</span>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={handleClaimDaily}
                          disabled={alreadyClaimedToday || claiming}
                          className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-bg-base bg-gradient-to-r from-accent-purple via-pink-500 to-accent-cyan hover:opacity-95 transition-all shadow-lg shadow-purple-950/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {claiming ? 'Claiming...' : alreadyClaimedToday ? 'Claimed ✓' : 'Claim Daily'}
                        </button>
                        <button 
                          onClick={() => {
                            const firstAffordable = loyaltyRewards.find(r => loyaltyData.points >= r.cost && !loyaltyData.unlocked_rewards.includes(r.size))
                            if (firstAffordable) {
                              handleRedeemReward(firstAffordable.size, firstAffordable.cost)
                            } else {
                              alert("Select one locked reward below that matches your points capacity and click it to unlock!")
                            }
                          }}
                          className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-purple-300 border border-[#8B5CF6]/40 bg-[#8B5CF6]/5 hover:bg-[#8B5CF6]/10 transition-colors cursor-pointer"
                        >
                          Redeem Points
                        </button>
                      </div>

                      <form onSubmit={handlePromoSubmit} className="pt-2">
                        <label className="block text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-1.5">
                          Extra Loyalty Points Code
                          <span className="text-text-muted text-[9px] ml-1">ⓘ</span>
                        </label>
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            placeholder="Enter a code..."
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="w-full bg-[#1A1526] border border-[#2D233F] rounded-xl py-2.5 pl-4 pr-20 text-xs text-white placeholder:text-text-muted/60 focus:outline-none focus:border-accent-purple transition-colors font-mono"
                          />
                          <button 
                            type="submit"
                            disabled={submittingPromo}
                            className="absolute right-1.5 py-1.5 px-3 rounded-lg text-[10px] font-bold bg-gradient-to-r from-accent-purple to-pink-500 text-white hover:opacity-90 transition-opacity cursor-pointer"
                          >
                            {submittingPromo ? '...' : 'Submit'}
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#231A32] space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-white">Tier {loyaltyData.tier}</span>
                        <span className="font-mono text-purple-400 font-bold">{loyaltyData.points} / 2,000</span>
                      </div>
                      <div className="w-full bg-[#1A1526] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-accent-purple to-accent-cyan h-full rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, (loyaltyData.points / 20) || 0)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accounts vs Loyalty Points Card */}
                <div className="md:col-span-3 bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                      <h3 className="text-white text-sm font-bold">
                        Accounts vs. Loyalty Points
                      </h3>
                      
                      {/* Tiny inline tabs */}
                      <div className="flex bg-bg-base/60 border border-border-subtle p-0.5 rounded-xl">
                        <button 
                          onClick={() => setLoyaltyTab('Accounts')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            loyaltyTab === 'Accounts' 
                              ? 'bg-[#1C2030] text-accent-cyan border border-border-subtle' 
                              : 'text-text-secondary hover:text-white'
                          }`}
                        >
                          Accounts
                        </button>
                        <button 
                          onClick={() => setLoyaltyTab('History')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            loyaltyTab === 'History' 
                              ? 'bg-[#1C2030] text-accent-cyan border border-border-subtle' 
                              : 'text-text-secondary hover:text-white'
                          }`}
                        >
                          History
                        </button>
                      </div>
                    </div>

                    {loyaltyTab === 'Accounts' ? (
                      /* Accounts Grid - Unique descriptive E2E IDs starting with 0 */
                      <div className="grid grid-cols-3 gap-3">
                        {loyaltyRewards.map((reward, i) => {
                          const isUnlocked = loyaltyData.unlocked_rewards?.includes(reward.size)
                          return (
                            <button 
                              key={i} 
                              id={`btn-${i}`}
                              onClick={() => !isUnlocked && handleRedeemReward(reward.size, reward.cost)}
                              className={`border rounded-xl p-3 flex flex-col justify-between h-20 relative group transition-all text-left cursor-pointer ${
                                isUnlocked
                                  ? 'bg-accent-green/10 border-accent-green/30 hover:border-accent-green/45'
                                  : 'bg-[#0F1321] border-border-subtle hover:border-[#8B5CF6]/30'
                              }`}
                            >
                              <div className="flex justify-between items-start w-full">
                                <span className="text-white font-extrabold text-xs tracking-wide">
                                  {reward.size}
                                </span>
                                {isUnlocked ? (
                                  <CheckCircle className="w-3.5 h-3.5 text-accent-green" />
                                ) : (
                                  <Lock className="w-3 h-3 text-purple-400/50" />
                                )}
                              </div>
                              
                              <div className="text-[10px] font-bold font-mono mt-2 w-full">
                                {isUnlocked ? (
                                  <span className="text-accent-green font-bold uppercase tracking-wider text-[8px]">Unlocked ✓</span>
                                ) : (
                                  <span className="text-red-500/90 font-mono">{reward.points} PTS</span>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      /* History Log */
                      <div className="space-y-2 py-2 max-h-96 overflow-y-auto pr-1">
                        {loadingHistory ? (
                          <p className="text-xs text-text-muted py-4">Loading history...</p>
                        ) : historyLogs.length > 0 ? (
                          historyLogs.map((log) => {
                            const logDateStr = new Date(log.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                            return (
                              <div key={log.id} className="flex justify-between items-center py-2 border-b border-border-subtle/50 last:border-0">
                                <div>
                                  <p className="text-xs font-semibold text-white">{log.action}</p>
                                  <p className="text-[10px] text-text-muted">{logDateStr}</p>
                                </div>
                                <span className={`text-xs font-mono font-bold ${log.points.startsWith('-') ? 'text-rose-400' : 'text-accent-green'}`}>
                                  {log.points}
                                </span>
                              </div>
                            )
                          })
                        ) : (
                          <p className="text-xs text-text-muted py-4">No audit logs found.</p>
                        )}
                      </div>
                    )}

                  </div>

                  <p className="text-[10px] text-text-muted mt-4 font-mono">
                    Points can be accumulated and redeemed for free evaluation challenges. Verification rules apply.
                  </p>

                </div>

              </div>
            )}

            {/* Profile Tab View */}
            {activeMenu === 'My Profile' && (
              <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-6">
                <h3 className="text-white text-base font-bold border-b border-border-subtle pb-3">My Profile Details</h3>
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="text-text-muted font-mono uppercase tracking-wider text-[9px]">Full Name</p>
                    <p className="text-sm font-extrabold text-white">{userDisplayName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-text-muted font-mono uppercase tracking-wider text-[9px]">Email Address</p>
                    <p className="text-sm font-extrabold text-white">{userEmail}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-text-muted font-mono uppercase tracking-wider text-[9px]">Points Balance</p>
                    <p className="text-sm font-extrabold text-accent-cyan font-mono">{loyaltyData.points} PTS</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-text-muted font-mono uppercase tracking-wider text-[9px]">Member Tier</p>
                    <p className="text-sm font-extrabold text-accent-purple font-mono">Tier {loyaltyData.tier} Program Member</p>
                  </div>
                </div>
              </AFXCard>
            )}

            {/* Account Security Tab View */}
            {activeMenu === 'Account Security' && (
              <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
                <h3 className="text-white text-base font-bold border-b border-border-subtle pb-3">Account Security</h3>
                <div className="space-y-4 text-xs text-text-secondary leading-relaxed">
                  <div className="flex justify-between items-center p-3 rounded-xl border border-border-subtle bg-bg-base/40">
                    <div>
                      <p className="font-bold text-white">Two-Factor Authentication (2FA)</p>
                      <p className="text-[10px] text-text-muted">Secure your login process using verification codes.</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase font-bold tracking-widest font-mono">Recommended</span>
                  </div>
                  <div className="p-4 rounded-xl border border-border-subtle bg-bg-base/30 space-y-2">
                    <p className="font-bold text-white">Check Session Activity</p>
                    <p className="text-[10px] text-text-muted">You are currently logged in from this browser. Active session ID matches secure token auth cache.</p>
                  </div>
                </div>
              </AFXCard>
            )}

            {/* Weekly Giveaway View */}
            {activeMenu === 'Weekly Giveaway' && (
              <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
                <h3 className="text-white text-base font-bold border-b border-border-subtle pb-3">Q3 Weekly Giveaways</h3>
                <div className="p-5 rounded-2xl border border-accent-purple/35 bg-gradient-to-br from-accent-purple/5 to-transparent space-y-4 text-xs">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-extrabold text-white text-base">Anuraj FX Q3 Challenge Pass Giveaway</h4>
                      <p className="text-[10px] text-text-muted mt-0.5">Prize pool: 5x FTMO 50K Challenge Evaluation Codes</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-accent-purple/20 text-accent-purple border border-accent-purple/40 text-[9px] font-black uppercase tracking-wider font-mono">Active</span>
                  </div>
                  <p className="text-text-secondary leading-relaxed text-xs">
                    Participate using your points. Each entry costs exactly 50 Loyalty Points. Winners are declared every Sunday at 18:00 IST.
                  </p>
                  <button 
                    onClick={() => {
                      if (loyaltyData.points < 50) {
                        alert("Requires 50 points to enter giveaway ticket program.");
                        return;
                      }
                      alert("Giveaway ticket purchased! Code: AFX-GIVE-3382. -50 Points claimed.");
                    }}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-bg-base bg-gradient-to-r from-accent-purple to-pink-500 hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Get Entry Ticket (50 PTS)
                  </button>
                </div>
              </AFXCard>
            )}

            {/* FAQ & Support View */}
            {activeMenu === 'FAQ & Support' && (
              <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
                <h3 className="text-white text-base font-bold border-b border-border-subtle pb-3">FAQ & loyalty Program Guide</h3>
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-white">How do I acquire loyalty points?</p>
                    <p className="text-text-secondary leading-relaxed">You can log in daily to claim points (+10), submit extra rewards promotional codes, write verified reviews (+50), or bookmark prop firms (+10).</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-white">What can I exchange my points for?</p>
                    <p className="text-text-secondary leading-relaxed">Redeem your accumulated point reserves directly to unlock free evaluation account challenge credentials ranging from 5K sizes up to 500K sizes.</p>
                  </div>
                </div>
              </AFXCard>
            )}

            {/* My Reviews Tab View */}
            {activeMenu === 'My Reviews' && (
              <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
                <h3 className="text-white text-base font-bold border-b border-border-subtle pb-3">My Approved Reviews</h3>
                {loadingReviews ? (
                  <p className="text-xs text-text-muted">Loading reviews...</p>
                ) : userReviews.filter(r => r.status === 'published').length > 0 ? (
                  <div className="space-y-3">
                    {userReviews.filter(r => r.status === 'published').map((rev) => (
                      <div key={rev.id} className="p-4 rounded-xl border border-border-subtle bg-bg-base/30 space-y-1">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-white text-xs">{rev.title}</p>
                          <span className="text-[10px] text-accent-yellow">{rev.rating} ★</span>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-relaxed">{rev.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">No approved reviews found.</p>
                )}
              </AFXCard>
            )}

            {/* Pending Reviews Tab View */}
            {activeMenu === 'Pending Reviews' && (
              <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
                <h3 className="text-white text-base font-bold border-b border-border-subtle pb-3">My Pending Moderation Reviews</h3>
                {loadingReviews ? (
                  <p className="text-xs text-text-muted">Loading reviews...</p>
                ) : userReviews.filter(r => r.status !== 'published').length > 0 ? (
                  <div className="space-y-3">
                    {userReviews.filter(r => r.status !== 'published').map((rev) => (
                      <div key={rev.id} className="p-4 rounded-xl border border-border-subtle bg-bg-base/30 space-y-1">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-white text-xs">{rev.title}</p>
                          <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest font-mono">Pending Audit</span>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-relaxed">{rev.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">No pending reviews found.</p>
                )}
              </AFXCard>
            )}

            {/* Bookmarks Tab View */}
            {activeMenu === 'Bookmarks' && (
              <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
                <h3 className="text-white text-base font-bold border-b border-border-subtle pb-3">Bookmarked Prop Firms</h3>
                {loadingBookmarks ? (
                  <p className="text-xs text-text-muted py-4">Verifying session bookmarks...</p>
                ) : bookmarkedFirms.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {bookmarkedFirms.map((firm) => (
                      <div key={firm.id} className="p-4 rounded-2xl border border-border-subtle bg-[#120F1D]/45 flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                          <PropFirmLogo name={firm.name} logoUrl={firm.logo_url} className="w-9 h-9 rounded-lg shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-accent-cyan transition-colors">{firm.name}</p>
                            <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-mono mt-0.5">
                              <Star className="w-3 h-3 text-accent-yellow fill-current" />
                              <span>{firm.rating || 4.5} · {firm.review_count || 0} reviews</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveBookmark(firm.id)}
                          className="p-1.5 rounded-lg border border-border-subtle bg-bg-base text-text-muted hover:text-red-400 hover:border-red-500/25 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted py-4">No bookmarks found. Go to prop firms directory to bookmark your favorites.</p>
                )}
              </AFXCard>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
