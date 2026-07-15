import { db } from './admin'

// Mock Fallback Data matching the seed definitions
const MOCK_SITE_CONTENT: Record<string, Record<string, any>> = {
  home: {
    hero_headline_part1: 'ANURAJ FX',
    hero_headline_part2: 'Trade Intelligence',
    hero_subtext:
      'Compare prop firms, grab verified discount codes, and access regulated brokers—all in one command center for Indian traders.',
    hero_cta_explore: 'Explore Firms',
    hero_cta_brokers: 'Get Broker Links',
    featured_firms_title: 'Featured Prop Firms',
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
      { label: 'Brokers', href: '/brokers' },
      { label: 'Deals', href: '/deals' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  footer: {
    brand_description:
      'Trade intelligence platform for comparing prop firms, brokers, and exclusive deals.',
    risk_disclaimer:
      'Trading Risk Disclaimer: Prop firm trading, CFDs, and forex involve high risk. This is not investment advice. ANURAJ FX is a comparison platform only. Please consult regulated advisors and review SEBI guidelines before trading. All participants must be 18+.',
  },
}

const MOCK_FIRMS = [
  {
    id: 'ftmo',
    slug: 'ftmo',
    name: 'FTMO',
    type: 'prop_firm',
    category: ['forex', 'futures'],
    logo_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&auto=format&fit=crop&q=60',
    country: 'CZ',
    countries_allowed: ['IN', 'US', 'UK', 'EU'],
    platforms: ['MT4', 'MT5'],
    max_allocation: 200000,
    years_active: 10,
    rating: 4.7,
    review_count: 342,
    website_url: 'https://ftmo.com',
    affiliate_url: 'https://ftmo.com/ref/anurajfx',
    is_featured: true,
    is_verified: true,
    description:
      'Largest prop firm with 200k max allocation and 80% profit split. Known for strict rules but transparent operations.',
    rules: {
      profit_target: '10%',
      max_drawdown: '5%',
      daily_loss: '3%',
      profit_split: '80%',
      steps: 2,
      duration: '60 days',
      re_entry: 'allowed',
    },
    status: 'active',
  },
  {
    id: 'topstep',
    slug: 'topstep',
    name: 'TopStep Trader',
    type: 'prop_firm',
    category: ['forex', 'futures'],
    logo_url: 'https://images.unsplash.com/photo-1642390091310-70f1a87d6677?w=200&auto=format&fit=crop&q=60',
    country: 'US',
    countries_allowed: ['IN', 'US', 'UK', 'AU'],
    platforms: ['NinjaTrader', 'cTrader'],
    max_allocation: 150000,
    years_active: 8,
    rating: 4.5,
    review_count: 289,
    website_url: 'https://topsteptrader.com',
    affiliate_url: 'https://topsteptrader.com/ref/anuraj',
    is_featured: true,
    is_verified: true,
    description:
      'US-based prop firm with flexible rules and strong community support. Funded traders get up to 150k accounts.',
    rules: {
      profit_target: '8%',
      max_drawdown: '4%',
      daily_loss: '2.5%',
      profit_split: '75%',
      steps: 1,
      duration: '30 days',
      re_entry: 'allowed',
    },
    status: 'active',
  },
  {
    id: '5ers',
    slug: '5ers',
    name: '5ers',
    type: 'prop_firm',
    category: ['forex', 'futures', 'crypto'],
    logo_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=60',
    country: 'UK',
    countries_allowed: ['IN', 'US', 'EU', 'AU'],
    platforms: ['MT5', 'cTrader'],
    max_allocation: 100000,
    years_active: 6,
    rating: 4.6,
    review_count: 215,
    website_url: 'https://5ers.com',
    affiliate_url: 'https://5ers.com/ref/anurajfx',
    is_featured: true,
    is_verified: true,
    description:
      'UK regulated prop firm with crypto trading access. Known for fair dealing desk and quick payouts.',
    rules: {
      profit_target: '10%',
      max_drawdown: '5%',
      daily_loss: '3%',
      profit_split: '85%',
      steps: 2,
      duration: '45 days',
      re_entry: 'allowed',
    },
    status: 'active',
  },
  {
    id: 'zerodha',
    slug: 'zerodha',
    name: 'Zerodha',
    type: 'broker',
    category: ['forex', 'stocks', 'futures'],
    logo_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=200&auto=format&fit=crop&q=60',
    country: 'IN',
    countries_allowed: ['IN'],
    platforms: ['web', 'mobile', 'API'],
    max_allocation: 1000000,
    years_active: 14,
    rating: 4.8,
    review_count: 5420,
    website_url: 'https://zerodha.com',
    affiliate_url: 'https://zerodha.com',
    is_featured: true,
    is_verified: true,
    description:
      'India\'s largest stock broker with excellent execution and lowest commissions. Perfect for Indian traders.',
    rules: {
      spreads: '0.5-2 pips',
      leverage: '1:20',
      deposit_min: '₹10,000',
      regulation: 'SEBI',
      settlement: 'T+1',
    },
    status: 'active',
  },
]

const MOCK_DEALS = [
  {
    id: 'deal-ftmo',
    firm_id: 'ftmo',
    code: 'AFX-FTMO25',
    title: 'FTMO Challenge 25% Off',
    discount_label: '25% OFF',
    description:
      'Get 25% discount on FTMO challenges this month. Use code AFX-FTMO25 at checkout.',
    is_featured: true,
    status: 'active',
  },
  {
    id: 'deal-topstep',
    firm_id: 'topstep',
    code: 'ANURAJ-TOPSTEP',
    title: 'TopStep Verified Traders',
    discount_label: '20% OFF',
    description:
      'Exclusive 20% discount for verified traders. Limited time offer.',
    is_featured: true,
    status: 'active',
  },
  {
    id: 'deal-5ers',
    firm_id: '5ers',
    code: 'AFX5ERS50',
    title: '5ers Fast Track',
    discount_label: 'FREE',
    description:
      'Fast track evaluation - skip one step with this code. First 50 users.',
    is_featured: true,
    status: 'active',
  },
]

const MOCK_TICKERS = [
  {
    symbol: 'XAUUSD',
    price: 2418.62,
    change_pct: 0.45,
    sparkline: [2410.5, 2412.3, 2415.1, 2413.8, 2416.2, 2418.62],
  },
  {
    symbol: 'NQ',
    price: 18450.75,
    change_pct: 1.23,
    sparkline: [18200.0, 18250.0, 18350.0, 18400.0, 18425.0, 18450.75],
  },
  {
    symbol: 'ES',
    price: 5725.5,
    change_pct: 0.87,
    sparkline: [5680.0, 5695.0, 5710.0, 5715.0, 5720.0, 5725.5],
  },
]

const MOCK_BLOGS = [
  {
    id: 'blog-prop-2024',
    slug: 'best-prop-firms-2024',
    title: 'Best Prop Firms in 2024: Complete Guide',
    cover_image_url:
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60',
    excerpt:
      'Discover the top prop firms for forex and futures trading in 2024. Compare features, rules, and payouts.',
    content_md: `# Best Prop Firms in 2024\n\nProp trading has exploded in popularity. Here are the top firms that traders should consider.\n\n## FTMO\nFTMO remains the gold standard with 80% profit splits and transparent operations.\n\n## TopStep Trader\nGreat for US-based traders with NinjaTrader support and solid community.\n\n## 5ers\nBest for crypto traders looking to trade multiple asset classes.`,
    author_id: 'admin-user-id',
    published: true,
    published_at: new Date().toISOString(),
  },
]

export async function getSiteContent(page: string): Promise<Record<string, any>> {
  try {
    const snapshot = await db.collection('site_content').where('page', '==', page).get()
    if (snapshot.empty) {
      return MOCK_SITE_CONTENT[page] || {}
    }
    const content: Record<string, any> = {}
    snapshot.forEach((doc) => {
      const data = doc.data()
      if (data.is_active) {
        content[data.section_key] =
          data.content_type === 'json' ? JSON.parse(data.value) : data.value
      }
    })
    // Merge fallbacks for missing keys
    return { ...(MOCK_SITE_CONTENT[page] || {}), ...content }
  } catch (error) {
    console.warn(`Firestore read failed for site_content page "${page}". Returning mock fallbacks.`, error)
    return MOCK_SITE_CONTENT[page] || {}
  }
}

export async function getFirms(type?: 'prop_firm' | 'broker'): Promise<any[]> {
  try {
    let query: any = db.collection('firms')
    if (type) {
      query = query.where('type', '==', type)
    }
    const snapshot = await query.get()
    if (snapshot.empty) {
      return type ? MOCK_FIRMS.filter((f) => f.type === type) : MOCK_FIRMS
    }
    const list: any[] = []
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() })
    })
    return list
  } catch (error) {
    console.warn('Firestore read failed for firms. Returning mock fallbacks.', error)
    return type ? MOCK_FIRMS.filter((f) => f.type === type) : MOCK_FIRMS
  }
}

export async function getDeals(): Promise<any[]> {
  try {
    const snapshot = await db.collection('deals').get()
    if (snapshot.empty) {
      return MOCK_DEALS
    }
    const list: any[] = []
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() })
    })
    return list
  } catch (error) {
    console.warn('Firestore read failed for deals. Returning mock fallbacks.', error)
    return MOCK_DEALS
  }
}

export async function getTickers(): Promise<any[]> {
  try {
    const snapshot = await db.collection('market_ticker').get()
    if (snapshot.empty) {
      return MOCK_TICKERS
    }
    const list: any[] = []
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() })
    })
    return list
  } catch (error) {
    console.warn('Firestore read failed for market_tickers. Returning mock fallbacks.', error)
    return MOCK_TICKERS
  }
}

export async function getBlogs(): Promise<any[]> {
  try {
    const snapshot = await db.collection('blog_posts').get()
    if (snapshot.empty) {
      return MOCK_BLOGS
    }
    const list: any[] = []
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() })
    })
    return list
  } catch (error) {
    console.warn('Firestore read failed for blog_posts. Returning mock fallbacks.', error)
    return MOCK_BLOGS
  }
}
