import { db } from './admin'

// Mock Fallback Data matching the seed definitions
export const MOCK_SITE_CONTENT: Record<string, Record<string, any>> = {
  home: {
    hero_headline_part1: 'EMPIRIAL',
    hero_headline_part2: 'Building Empires',
    hero_subtext:
      'Compare prop firms, grab verified discount codes, and access our trading community—all in one command center for Indian traders.',
    hero_cta_explore: 'Explore Firms',
    hero_cta_brokers: 'Join Discord',
    discord_url: 'https://discord.gg/empirial',
    featured_firms_title: 'Featured Prop Firms',
    featured_firms_subtext: 'Compare premium programs, get exclusive discount codes, and buy with one click.',
    featured_deals_title: 'Featured Coupons & Deals',
    featured_deals_subtext: 'Exclusive verified discount codes updated daily',
    challenges_badge: 'Popular Challenges',
    challenges_title: 'Top Challenges',
    challenges_subtext: 'Compare the top-rated prop firm evaluation programs ranked by trader popularity.',
    challenges_cta: 'View All Challenges',
    best_sellers_badge: 'Best Sellers',
    best_sellers_title: 'Top Selling Challenges',
    best_sellers_subtext: 'The most purchased challenge programs by traders this month.',
    best_sellers_cta: 'View All',
    fav_firms_badge: 'Community Favorites',
    fav_firms_title: 'Favorite Firms',
    fav_firms_subtext: 'The most loved prop firms in the ANURAJ FX community—sign in to save your own favorites.',
    fav_firms_cta: 'My Favorites',
    blog_title: 'Latest Articles',
    blog_subtext: 'Trading guidelines, review logs, and industry insights for prop traders.',
    blog_cta: 'View All Posts',
    newsletter_title: 'Never Miss a Verified Deal',
    newsletter_subtext: 'Join our newsletter list to receive weekly comparison reports, broker reviews, and new prop firm codes directly in your inbox.',
    faq_badge: 'FAQ',
    faq_title: 'Frequently Asked Questions',
    faq_subtext: 'Everything Indian traders need to know about prop firms, evaluation challenges, and funded accounts.',
    section_order: [
      'hero',
      'featured_firms',
      'trust_stats',
      'live_tickers',
      'latest_deals',
      'blog_preview',
      'newsletter',
    ],
    trust_stats: [
      { label: 'Firms Verified', value: '60+', icon: '✓' },
      { label: 'Active Challenges', value: '1,500+', icon: '⚡' },
      { label: 'Community Reviews', value: '11K+', icon: '⭐' },
      { label: 'Traders Helped', value: '50K+', icon: '🎯' },
    ],
  },
  nav: {
    links: [
      { label: 'Prop Firms', href: '/firms' },
      { label: 'Deals', href: '/deals' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  footer: {
    brand_description:
      'Empirial - Building Traders. Building Empires.',
    risk_disclaimer:
      'Trading Risk Disclaimer: Prop firm trading, CFDs, and forex involve high risk. This is not investment advice. EMPIRIAL is a comparison platform only. Please consult regulated advisors and review SEBI guidelines before trading. All participants must be 18+.',
  },
  about: {
    headline: 'About ANURAJ FX',
    body: `ANURAJ FX is the ultimate trade intelligence platform built specifically for Indian traders.
    
Our mission is to bring transparency, verification, and premium discount opportunities to the prop trading community. We audit listings, verify payouts, and ensure you get the absolute best terms for your evaluation challenges.`,
  },
  transparency: {
    headline: 'Transparency & Verification',
    body: `We believe in complete transparency. Every discount coupon, prop evaluation parameter, and payout check listed on ANURAJ FX is audited.
    
We do not accept payments to artificially boost reviews or ratings. Traders deserve accurate parameters, real payout details, and verifiable discount rates.`,
  },
  how_it_works: {
    headline: 'How It Works',
    body: `Compare and participate in funded evaluations in 3 easy steps:
    
1. Search & Filter: Use our directory to sort programs by size, steps, drawdown cushion, or split.
2. Secure Codes: Grab exclusive promo coupons verified daily.
3. Get Funded: Open your account, pass the challenge, and get verified payouts with up to 90% profit splits.`,
  },
  loyalty: {
    headline: 'Loyalty Points Program',
    body: `Invite other traders to use our evaluation comparison directories and earn referral points. You can redeem points for premium trader gear, vouchers, and evaluation fee reimbursements.`,
  },
  affiliate_program: {
    headline: 'Affiliate Referral Program',
    body: `Invite other traders to use our evaluation comparison directories and earn referral commissions.
    
Referrers get 15% of evaluation commissions generated when accounts use their codes or links, tracked directly in the trader analytics dashboard.`,
  },
  privacy_policy: {
    headline: 'Privacy Policy',
    body: `We respect trader privacy. We do not store financial credentials or private API keys.
    
1. Data Collection: We collect display names, email subscriptions, and click telemetry.
2. Data Protection: All database access uses strict HTTPS configurations and firewalls.
3. Cookies: Used exclusively to maintain login sessions and track referral bookmarks.`,
  },
  terms_conditions: {
    headline: 'Terms & Conditions',
    body: `Usage guidelines:
    
1. Educational Comparison: ANURAJ FX is not an investment firm. All contents are comparison parameters for mock/demo evaluation challenges.
2. Disclaimer: Prop trading involves loss limits. Please read partner details before enrolling.
3. Copyright: You may not crawl or copy programmatic parameters without permission.`,
  },
  payouts: {
    headline: 'Verified Trader Payouts',
    subtext: 'Real payout receipts and proofs verified by Anuraj FX auditing team. No fake statements.',
  },
  spreads: {
    headline: 'Live Broker Spreads',
    subtext: 'Compare live bid/ask spreads and execution commission structures across registered broker pools.',
  },
  events: {
    badge_text: 'Events & Tournaments',
    headline: 'Trading Events & Community',
    subtext: 'Join live trading tournaments, prop firm bootcamps, educational sessions, and competitive trading events for the ANURAJ FX community.',
  },
  leaderboard: {
    badge_text: 'Live Rankings',
    headline: 'Prop Firm Payouts Tracker',
    subtext: 'Compare payout times, payout totals, and payout history across prop firms. View firm-level payout trends and individual trader rankings.',
  },
  globe: {
    globe_nodes: [
      {
        id: 'slot-gft',
        name: 'GFT',
        full_name: 'GFT Funding',
        href: '/firms/gft-funding',
        color: '#00D2FF',
        logo_url: ''
      },
      {
        id: 'slot-ftmo',
        name: 'FTMO',
        full_name: 'FTMO',
        href: '/firms/ftmo',
        color: '#FF4E00',
        logo_url: ''
      },
      {
        id: 'slot-top1',
        name: 'TOP1',
        full_name: 'Topstep',
        href: '/firms/topstep',
        color: '#FFD700',
        logo_url: ''
      },
      {
        id: 'slot-mff',
        name: 'MFF',
        full_name: 'MyFundedFutures',
        href: '/firms/myfundedfutures',
        color: '#FF007F',
        logo_url: ''
      },
      {
        id: 'slot-pips',
        name: 'PIPS',
        full_name: 'Funding Pips',
        href: '/firms/funding-pips',
        color: '#8A2BE2',
        logo_url: ''
      },
      {
        id: 'slot-e8',
        name: 'E8',
        full_name: 'E8 Markets',
        href: '/firms/e8-markets',
        color: '#00FF66',
        logo_url: ''
      }
    ]
  }
}

export const MOCK_FIRMS: any[] = [];

export const MOCK_CHALLENGES: any[] = [];

const MOCK_SPREADS: any[] = [];
const MOCK_PAYOUTS: any[] = [];
export const MOCK_DEALS: any[] = [];
const MOCK_TICKERS: any[] = [];
const MOCK_BLOGS: any[] = [];

// In-memory query cache storage
const memoryCache: Record<string, { data: any; expiry: number }> = {}
const CACHE_TTL = 5 * 60 * 1000 // Cache for 5 minutes

export function clearServerCache() {
  for (const key in memoryCache) {
    delete memoryCache[key]
  }
}

async function withCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  const cached = memoryCache[key]
  if (cached && cached.expiry > Date.now()) {
    return cached.data
  }
  const freshData = await fetchFn()
  memoryCache[key] = { data: freshData, expiry: Date.now() + CACHE_TTL }
  return freshData
}

export async function getSiteContent(page: string): Promise<Record<string, any>> {
  return withCache(`site_content_${page}`, async () => {
    try {
      const snapshot = await db.collection('site_content').where('page', '==', page).get()
      if (snapshot.empty) {
        return MOCK_SITE_CONTENT[page] || {}
      }
      const content: Record<string, any> = {}
      snapshot.forEach((doc: any) => {
        const data = doc.data()
        if (data.is_active) {
          content[data.section_key] =
            data.content_type === 'json' ? JSON.parse(data.value) : data.value
        }
      })
      return { ...(MOCK_SITE_CONTENT[page] || {}), ...content }
    } catch (error) {
      console.warn(`Firestore read failed for site_content page "${page}". Returning mock fallbacks.`)
      return MOCK_SITE_CONTENT[page] || {}
    }
  })
}

// Serialize Firestore documents to plain JSON-safe objects
// Firestore Timestamps (_seconds/_nanoseconds) cause RSC serialization errors
function serializeDoc(data: any): any {
  if (data === null || data === undefined) return data
  if (typeof data !== 'object') return data
  if (Array.isArray(data)) return data.map(serializeDoc)
  // Check for Firestore Timestamp-like objects
  if (typeof data._seconds === 'number' && typeof data._nanoseconds === 'number') {
    return new Date(data._seconds * 1000 + data._nanoseconds / 1000000).toISOString()
  }
  // Also handle Timestamp objects with toDate method
  if (typeof data.toDate === 'function') {
    return data.toDate().toISOString()
  }
  const result: any = {}
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      result[key] = serializeDoc(data[key])
    }
  }
  return result
}

const DEFAULT_PAYOUT_PROGRAMS = [
  {
    id: 'prog-flex',
    program_name: 'LucidFlex',
    minimum_payout: 250,
    payout_frequency_days: 14,
    trading_days_rule_content: '<p>Traders must achieve at least 5 profitable trading days of at least $100 profit per day during each payout cycle to request a profit split. Payouts are processed on bi-weekly basis.</p>',
    display_order: 1,
    tiers: [
      { account_size: 25000, min_profit_per_day: 100, max_payout_per_cycle: 1500 },
      { account_size: 50000, min_profit_per_day: 200, max_payout_per_cycle: 2500 },
      { account_size: 100000, min_profit_per_day: 400, max_payout_per_cycle: 5000 },
      { account_size: 150000, min_profit_per_day: 600, max_payout_per_cycle: 7500 }
    ]
  },
  {
    id: 'prog-pro',
    program_name: 'LucidPro',
    minimum_payout: 500,
    payout_frequency_days: 7,
    trading_days_rule_content: '<p>LucidPro account model offers weekly payouts with zero minimum trading days constraint. However, scaling limits apply based on profit milestones.</p>',
    display_order: 2,
    tiers: [
      { account_size: 25000, min_profit_per_day: 0, max_payout_per_cycle: 3000 },
      { account_size: 50000, min_profit_per_day: 0, max_payout_per_cycle: 5000 },
      { account_size: 100000, min_profit_per_day: 0, max_payout_per_cycle: 10000 },
      { account_size: 150000, min_profit_per_day: 0, max_payout_per_cycle: 15000 }
    ]
  }
]

const DEFAULT_RESTRICTED_COUNTRIES = ['AF', 'BY', 'IR', 'IQ', 'KP', 'RU', 'SY', 'YE']

const DEFAULT_CONSISTENCY_RULES = `
  <h2>Consistency Target Rules</h2>
  <p>To ensure steady and disciplined trading performance, the firm mandates a consistency check during the evaluations:</p>
  <ul>
    <li>No single trading day should account for more than 40% of the total profit target.</li>
    <li>Drawdown limits must be adhered to at all times under penalty of breach.</li>
    <li>Minimum of 5 active trading days are required before requesting phase completion.</li>
  </ul>
`

const DEFAULT_FIRM_RULES = `
  <h2>General Evaluation Rules</h2>
  <p>Please review our general rules carefully before beginning your evaluation challenge:</p>
  <ul>
    <li><strong>Daily Loss Limit:</strong> Evaluated based on previous day's end-of-day equity.</li>
    <li><strong>Trailing Drawdown:</strong> Monitored in real-time, updated tick-by-tick or at the end of the day depending on package.</li>
    <li><strong>Hedging:</strong> Allowed across different pairs but prohibited within the same asset.</li>
    <li><strong>News Trading:</strong> Restricted within 2 minutes before and after high-impact macroeconomic releases for simulated funding accounts.</li>
  </ul>
`

const populateFirmDefaults = (firm: any) => {
  return {
    consistency_rules_content: DEFAULT_CONSISTENCY_RULES,
    firm_rules_content: DEFAULT_FIRM_RULES,
    payout_programs: DEFAULT_PAYOUT_PROGRAMS,
    restricted_countries: DEFAULT_RESTRICTED_COUNTRIES,
    ...firm
  }
}

export async function getFirms(type?: 'prop_firm' | 'broker'): Promise<any[]> {
  const cacheKey = `firms_${type || 'all'}`
  return withCache(cacheKey, async () => {
    try {
      let query: any = db.collection('firms')
      if (type) {
        query = query.where('type', '==', type)
      }
      const snapshot = await query.get()
      if (snapshot.empty) {
        const fallbacks = type ? MOCK_FIRMS.filter((f) => f.type === type) : MOCK_FIRMS
        return fallbacks.map(populateFirmDefaults)
      }
      const list: any[] = []
      snapshot.forEach((doc: any) => {
        list.push(serializeDoc({ id: doc.id, ...doc.data() }))
      })
      return list.map(populateFirmDefaults)
    } catch (error) {
      console.warn('Firestore read failed for firms. Returning mock fallbacks.')
      const fallbacks = type ? MOCK_FIRMS.filter((f) => f.type === type) : MOCK_FIRMS
      return fallbacks.map(populateFirmDefaults)
    }
  })
}

export async function getDeals(): Promise<any[]> {
  return withCache('deals_all', async () => {
    try {
      const snapshot = await db.collection('deals').get()
      if (snapshot.empty) {
        return MOCK_DEALS
      }
      const list: any[] = []
      snapshot.forEach((doc: any) => {
        list.push(serializeDoc({ id: doc.id, ...doc.data() }))
      })
      return list
    } catch (error) {
      console.warn('Firestore read failed for deals. Returning mock fallbacks.')
      return MOCK_DEALS
    }
  })
}

export async function getTickers(): Promise<any[]> {
  return withCache('tickers_all', async () => {
    try {
      const snapshot = await db.collection('market_ticker').get()
      if (snapshot.empty) {
        return MOCK_TICKERS
      }
      const list: any[] = []
      snapshot.forEach((doc: any) => {
        list.push(serializeDoc({ id: doc.id, ...doc.data() }))
      })
      return list
    } catch (error) {
      console.warn('Firestore read failed for market_tickers. Returning mock fallbacks.')
      return MOCK_TICKERS
    }
  })
}

export async function getBlogs(): Promise<any[]> {
  return withCache('blogs_all', async () => {
    try {
      const snapshot = await db.collection('blog_posts').get()
      if (snapshot.empty) {
        return MOCK_BLOGS
      }
      const list: any[] = []
      snapshot.forEach((doc: any) => {
        list.push(serializeDoc({ id: doc.id, ...doc.data() }))
      })
      return list
    } catch (error) {
      console.warn('Firestore read failed for blog_posts. Returning mock fallbacks.')
      return MOCK_BLOGS
    }
  })
}

export async function getRulesHistory(): Promise<any[]> {
  return withCache('rules_history_all', async () => {
    try {
      const snapshot = await db.collection('firm_rules').get()
      const list: any[] = []
      snapshot.forEach((doc: any) => {
        list.push(serializeDoc({ id: doc.id, ...doc.data() }))
      })
      // Sort by effective_date DESC
      return list.sort((a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime())
    } catch (error) {
      console.warn('Firestore read failed for firm_rules. Returning empty list.')
      return []
    }
  })
}

export async function getContractSpecs(): Promise<any[]> {
  return withCache('contract_specs_all', async () => {
    try {
      const snapshot = await db.collection('firm_contract_specs').get()
      const list: any[] = []
      snapshot.forEach((doc: any) => {
        list.push(serializeDoc({ id: doc.id, ...doc.data() }))
      })
      return list
    } catch (error) {
      console.warn('Firestore read failed for firm_contract_specs. Returning empty list.')
      return []
    }
  })
}

const populateChallengeDefaults = (ch: any) => {
  return {
    activation_fee: ch.activation_fee !== undefined ? ch.activation_fee : 'None',
    max_contract_size_minis: ch.max_contract_size_minis !== undefined ? ch.max_contract_size_minis : 10,
    max_contract_size_micros: ch.max_contract_size_micros !== undefined ? ch.max_contract_size_micros : 100,
    profit_target: ch.profit_target !== undefined ? ch.profit_target : ch.account_size * 0.08,
    max_loss: ch.max_loss !== undefined ? ch.max_loss : ch.account_size * 0.05,
    max_loss_type: ch.max_loss_type !== undefined ? ch.max_loss_type : 'eod_trailing',
    pt_dd_ratio: ch.pt_dd_ratio !== undefined ? ch.pt_dd_ratio : '1:1',
    profit_split_percent: ch.profit_split_percent !== undefined ? ch.profit_split_percent : ch.profit_split_pct || 80,
    max_payout_amount: ch.max_payout_amount !== undefined ? ch.max_payout_amount : 15000,
    min_payout_threshold: ch.min_payout_threshold !== undefined ? ch.min_payout_threshold : 250,
    consistency_eval_percent: ch.consistency_eval_percent !== undefined ? ch.consistency_eval_percent : 40,
    ...ch
  }
}

export async function getChallenges(): Promise<any[]> {
  return withCache('challenges_all', async () => {
    try {
      const snapshot = await db.collection('challenges').get()
      if (snapshot.empty) {
        return MOCK_CHALLENGES.map(populateChallengeDefaults)
      }
      const list: any[] = []
      snapshot.forEach((doc: any) => {
        list.push(serializeDoc({ id: doc.id, ...doc.data() }))
      })
      return list.map(populateChallengeDefaults)
    } catch (error) {
      console.warn('Firestore read failed for challenges. Returning mock fallbacks.')
      return MOCK_CHALLENGES.map(populateChallengeDefaults)
    }
  })
}

export async function getBrokerSpreads(): Promise<any[]> {
  return withCache('spreads_all', async () => {
    try {
      const snapshot = await db.collection('broker_spreads').get()
      if (snapshot.empty) {
        return MOCK_SPREADS
      }
      const list: any[] = []
      snapshot.forEach((doc: any) => {
        list.push(serializeDoc({ id: doc.id, ...doc.data() }))
      })
      return list
    } catch (error) {
      console.warn('Firestore read failed for spreads. Returning mock fallbacks.')
      return MOCK_SPREADS
    }
  })
}

export async function getPayouts(): Promise<any[]> {
  return withCache('payouts_all', async () => {
    try {
      const snapshot = await db.collection('payouts').get()
      if (snapshot.empty) {
        return MOCK_PAYOUTS
      }
      const list: any[] = []
      snapshot.forEach((doc: any) => {
        list.push(serializeDoc({ id: doc.id, ...doc.data() }))
      })
      return list
    } catch (error) {
      console.warn('Firestore read failed for payouts. Returning mock fallbacks.')
      return MOCK_PAYOUTS
    }
  })
}

export async function getFavorites(userId: string): Promise<any[]> {
  try {
    const snapshot = await db.collection('favorites').where('user_id', '==', userId).get()
    const list: any[] = []
    snapshot.forEach((doc: any) => {
      list.push(serializeDoc({ id: doc.id, ...doc.data() }))
    })
    return list
  } catch (error) {
    console.warn('Firestore read failed for favorites.')
    return []
  }
}

export async function getCommentsCountForFirms(): Promise<Record<string, number>> {
  try {
    const snapshot = await db.collection('comments').where('status', '==', 'visible').get()
    const counts: Record<string, number> = {}
    snapshot.forEach((doc: any) => {
      const data = doc.data()
      if (data.firm_id) {
        counts[data.firm_id] = (counts[data.firm_id] || 0) + 1
      }
    })
    return counts
  } catch (e) {
    console.warn('Firestore read failed for comments count.')
    return {}
  }
}

export async function getEventPopupSettings(): Promise<Record<string, any> | null> {
  return withCache('event_popup_settings', async () => {
    try {
      const doc = await db.collection('site_settings').doc('event_popup').get()
      if (doc.exists) {
        return serializeDoc(doc.data())
      }
    } catch (error) {
      console.warn('Error fetching event popup settings on server:', error)
    }
    return null
  })
}

export async function getGlobeNodes(): Promise<any[]> {
  return withCache('globe_nodes_all', async () => {
    try {
      const snapshot = await db.collection('site_content')
        .where('page', '==', 'globe')
        .where('section_key', '==', 'globe_nodes')
        .limit(1)
        .get()

      if (snapshot.empty) {
        return MOCK_SITE_CONTENT.globe.globe_nodes
      }

      const doc = snapshot.docs[0]
      return JSON.parse(doc.data().value)
    } catch (error) {
      console.warn('Error fetching globe nodes from Firestore. Using fallbacks.')
      return MOCK_SITE_CONTENT.globe.globe_nodes
    }
  })
}

export const MOCK_EVENTS = [
  {
    id: 'evt-1',
    title: 'ANURAJ FX Trading Tournament Q3 2026',
    type: 'tournament',
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    description: 'Compete in a 2-week live trading tournament with a $10,000 prize pool. Trade XAUUSD, NQ, and EURUSD on demo accounts. Top 10 traders win cash prizes and prop firm vouchers.',
    date: 'August 15–29, 2026',
    time: '9:00 AM – Market Close (IST)',
    format: 'Online (Demo Trading)',
    seats: 500,
    prize: '$10,000 Prize Pool',
    status: 'upcoming',
    registrationUrl: '#',
    tags: ['Forex', 'Futures', 'Demo'],
  },
  {
    id: 'evt-2',
    title: 'Prop Firm Bootcamp — Beginner to Funded',
    type: 'bootcamp',
    image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    description: 'Intensive 3-day online bootcamp covering prop firm rules, risk management, challenge strategies, and how to pass FTMO, TopStep, and 5ers evaluations. Includes live mentoring.',
    date: 'July 28–30, 2026',
    time: '7:00 PM – 10:00 PM (IST)',
    format: 'Online (Zoom)',
    seats: 100,
    prize: null,
    status: 'upcoming',
    registrationUrl: '#',
    tags: ['Bootcamp', 'Beginners', 'Mentoring'],
  },
  {
    id: 'evt-3',
    title: 'Live Market Session — US Open & London Close',
    type: 'session',
    image_url: '',
    description: 'Weekly live trading session streamed on YouTube. Trade alongside Anuraj and his team during the US Open session. Q&A, trade breakdowns, and market structure analysis.',
    date: 'Every Friday',
    time: '7:00 PM – 9:00 PM (IST)',
    format: 'YouTube Live',
    seats: null,
    prize: null,
    status: 'recurring',
    registrationUrl: 'https://youtube.com',
    tags: ['Live Session', 'Free', 'Weekly'],
  },
  {
    id: 'evt-4',
    title: 'Crypto Futures Trading Challenge',
    type: 'tournament',
    image_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
    description: 'Week-long crypto futures tournament. Trade BTC, ETH, and SOL futures. Leaderboard ranked by profit % on a fixed starting balance. Entry fee: Free.',
    date: 'September 1–7, 2026',
    time: '24/7 (Open Market Hours)',
    format: 'Online (Demo)',
    seats: 1000,
    prize: '$5,000 Prize Pool',
    status: 'upcoming',
    registrationUrl: '#',
    tags: ['Crypto', 'Futures', 'Free Entry'],
  },
  {
    id: 'evt-5',
    title: 'Risk Management Masterclass',
    type: 'session',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    description: 'Expert-level 2-hour session on position sizing, drawdown control, and psychological discipline in prop trading. Case studies from funded traders who have achieved consistent payouts.',
    date: 'August 3, 2026',
    time: '6:00 PM – 8:00 PM (IST)',
    format: 'Online (Zoom)',
    seats: 200,
    prize: null,
    status: 'upcoming',
    registrationUrl: '#',
    tags: ['Masterclass', 'Risk Management', 'Psychology'],
  },
  {
    id: 'evt-6',
    title: 'Gaming Trading Tournament (Fantasy Leaderboard)',
    type: 'gaming',
    image_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
    description: 'Fun trading tournament with a gaming twist! Build your portfolio with virtual stocks and forex. Compete for bragging rights and community badges. No real money involved.',
    date: 'August 10–20, 2026',
    time: 'Any time',
    format: 'Online (Web App)',
    seats: 2000,
    prize: 'Community Badges + Recognition',
    status: 'upcoming',
    registrationUrl: '#',
    tags: ['Gaming', 'Fun', 'Community'],
  }
]

export async function getEvents(): Promise<any[]> {
  return withCache('events_all', async () => {
    try {
      const snapshot = await db.collection('events').get()
      if (snapshot.empty) {
        return MOCK_EVENTS
      }
      const list: any[] = []
      snapshot.forEach((doc: any) => {
        list.push(serializeDoc({ id: doc.id, ...doc.data() }))
      })
      return list.sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
        return bTime - aTime
      })
    } catch (error) {
      console.warn('Firestore read failed for events. Returning mock fallbacks.')
      return MOCK_EVENTS
    }
  })
}
