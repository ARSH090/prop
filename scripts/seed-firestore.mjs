import fs from 'fs'
import path from 'path'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore'

// Parse .env.local file
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (match) {
      const key = match[1]
      let value = match[2] || ''
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.substring(1, value.length - 1)
      }
      process.env[key] = value
    }
  })
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

if (!firebaseConfig.projectId) {
  console.error('ERROR: NEXT_PUBLIC_FIREBASE_PROJECT_ID not found in .env.local')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function seed() {
  console.log('Starting Firestore seeding (Client SDK)...')

  // 1. Site Content Seeding
  const siteContent = [
    {
      page: 'home',
      section_key: 'hero_headline_part1',
      content_type: 'text',
      value: 'ANURAJ FX',
    },
    {
      page: 'home',
      section_key: 'hero_headline_part2',
      content_type: 'text',
      value: 'Trade Intelligence',
    },
    {
      page: 'home',
      section_key: 'hero_subtext',
      content_type: 'text',
      value: 'Compare prop firms, grab verified discount codes, and access regulated brokers—all in one command center for Indian traders.',
    },
    {
      page: 'home',
      section_key: 'hero_cta_explore',
      content_type: 'text',
      value: 'Explore Firms',
    },
    {
      page: 'home',
      section_key: 'hero_cta_brokers',
      content_type: 'text',
      value: 'Get Broker Links',
    },
    {
      page: 'home',
      section_key: 'featured_firms_title',
      content_type: 'text',
      value: 'Featured Prop Firms',
    },
    {
      page: 'home',
      section_key: 'section_order',
      content_type: 'json',
      value: JSON.stringify([
        'hero',
        'featured_firms',
        'trust_stats',
        'live_tickers',
        'latest_deals',
        'blog_preview',
        'newsletter',
      ]),
    },
    {
      page: 'home',
      section_key: 'trust_stats',
      content_type: 'json',
      value: JSON.stringify([
        { label: 'Firms Verified', value: '60+', icon: '✓' },
        { label: 'Active Challenges', value: '1,500+', icon: '⚡' },
        { label: 'Community Reviews', value: '11K+', icon: '⭐' },
        { label: 'Traders Helped', value: '50K+', icon: '🎯' },
      ]),
    },
    {
      page: 'nav',
      section_key: 'links',
      content_type: 'json',
      value: JSON.stringify([
        { label: 'Prop Firms', href: '/firms' },
        { label: 'Brokers', href: '/brokers' },
        { label: 'Deals', href: '/deals' },
        { label: 'Blog', href: '/blog' },
      ]),
    },
    {
      page: 'footer',
      section_key: 'brand_description',
      content_type: 'text',
      value: 'Trade intelligence platform for comparing prop firms, brokers, and exclusive deals.',
    },
    {
      page: 'footer',
      section_key: 'risk_disclaimer',
      content_type: 'text',
      value: 'Trading Risk Disclaimer: Prop firm trading, CFDs, and forex involve high risk. This is not investment advice. ANURAJ FX is a comparison platform only. Please consult regulated advisors and review SEBI guidelines before trading. All participants must be 18+.',
    },
  ]

  console.log('Seeding site_content...')
  for (const content of siteContent) {
    const docId = `${content.page}_${content.section_key}`
    await setDoc(doc(db, 'site_content', docId), {
      ...content,
      is_active: true,
      updated_at: serverTimestamp(),
    })
  }

  // 2. Firms Seeding
  const firms = [
    {
      id: 'ftmo',
      slug: 'ftmo',
      name: 'FTMO',
      type: 'prop_firm',
      category: ['forex', 'futures', 'crypto'],
      logo_url: 'https://ftmo.com/wp-content/themes/ftmo/dist/images/logo.svg',
      country: 'CZ',
      countries_allowed: ['IN', 'UK', 'EU'],
      platforms: ['MT4', 'MT5', 'cTrader'],
      max_allocation: 400000,
      years_active: 10,
      rating: 4.7,
      review_count: 342,
      website_url: 'https://ftmo.com',
      affiliate_url: 'https://ftmo.com/ref/anurajfx',
      is_featured: true,
      is_verified: true,
      description: 'Largest global prop firm with 400k max allocation and 80% profit split. Known for highly audited operations.',
      rules: {
        profit_target: '10% / 5%',
        max_drawdown: '10%',
        daily_loss: '5%',
        profit_split: '80%',
        steps: 2,
        duration: '30-60 days',
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
      description: 'US-based prop firm with flexible rules and strong community support. Funded traders get up to 150k accounts.',
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
      logo_url: 'https://the5ers.com/wp-content/uploads/2020/12/the5ers-logo.svg',
      country: 'IL',
      countries_allowed: ['IN', 'US', 'EU', 'AU'],
      platforms: ['MT5', 'cTrader'],
      max_allocation: 100000,
      years_active: 8,
      rating: 4.6,
      review_count: 215,
      website_url: 'https://5ers.com',
      affiliate_url: 'https://the5ers.com/ref/anurajfx',
      is_featured: true,
      is_verified: true,
      description: 'Highly trusted proprietary trading program offering instant funding models and standard evaluations.',
      rules: {
        profit_target: '8% / 5%',
        max_drawdown: '10%',
        daily_loss: '5%',
        profit_split: '50-80%',
        steps: 2,
        duration: 'No time limit',
        re_entry: 'allowed',
      },
      status: 'active',
    },
    {
      id: 'fundednext',
      slug: 'fundednext',
      name: 'FundedNext',
      type: 'prop_firm',
      category: ['forex', 'futures', 'crypto'],
      logo_url: 'https://fundednext.com/wp-content/uploads/2022/03/logo.svg',
      country: 'AE',
      countries_allowed: ['IN', 'US', 'UK', 'EU'],
      platforms: ['MT4', 'MT5', 'cTrader'],
      max_allocation: 200000,
      years_active: 4,
      rating: 4.5,
      review_count: 198,
      website_url: 'https://fundednext.com',
      affiliate_url: 'https://fundednext.com/ref/anurajfx',
      is_featured: true,
      is_verified: true,
      description: 'Provides biweekly payouts, standard/one-step evaluations, and deep liquidity feeds.',
      rules: {
        profit_target: '10% / 5%',
        max_drawdown: '10%',
        daily_loss: '5%',
        profit_split: '80-90%',
        steps: 2,
        duration: 'Unlimited',
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
      description: 'India\'s largest stock broker with excellent execution and lowest commissions. Perfect for Indian traders.',
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

  console.log('Seeding firms...')
  for (const firm of firms) {
    await setDoc(doc(db, 'firms', firm.id), {
      ...firm,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
  }

  // 3. Deals Seeding
  const deals = [
    {
      id: 'deal-ftmo',
      firm_id: 'ftmo',
      code: 'AFX-FTMO25',
      title: 'FTMO Challenge 25% Off',
      discount_label: '25% OFF',
      description: 'Get 25% discount on FTMO challenges this month. Use code AFX-FTMO25 at checkout.',
      is_featured: true,
      status: 'active',
    },
    {
      id: 'deal-topstep',
      firm_id: 'topstep',
      code: 'ANURAJ-TOPSTEP',
      title: 'TopStep Verified Traders',
      discount_label: '20% OFF',
      description: 'Exclusive 20% discount for verified traders. Limited time offer.',
      is_featured: true,
      status: 'active',
    },
    {
      id: 'deal-5ers',
      firm_id: '5ers',
      code: 'AFX5ERS50',
      title: '5ers Fast Track',
      discount_label: 'FREE',
      description: 'Fast track evaluation - skip one step with this code. First 50 users.',
      is_featured: true,
      status: 'active',
    },
  ]

  console.log('Seeding deals...')
  for (const deal of deals) {
    await setDoc(doc(db, 'deals', deal.id), {
      ...deal,
      created_at: serverTimestamp(),
      starts_at: serverTimestamp(),
      expires_at: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days
      click_count: 0,
    })
  }

  // 4. Market Ticker Seeding
  const tickers = [
    { symbol: 'XAUUSD', price: 2418.62, change_pct: 0.45, sparkline: [2410.5, 2412.3, 2415.1, 2413.8, 2416.2, 2418.62] },
    { symbol: 'NQ', price: 18450.75, change_pct: 1.23, sparkline: [18200.0, 18250.0, 18350.0, 18400.0, 18425.0, 18450.75] },
    { symbol: 'ES', price: 5725.5, change_pct: 0.87, sparkline: [5680.0, 5695.0, 5710.0, 5715.0, 5720.0, 5725.5] },
  ]

  console.log('Seeding market_ticker...')
  for (const ticker of tickers) {
    await setDoc(doc(db, 'market_ticker', ticker.symbol), {
      ...ticker,
      updated_at: serverTimestamp(),
    })
  }

  // 5. Blog Posts Seeding
  const blogs = [
    {
      id: 'blog-prop-2024',
      slug: 'best-prop-firms-2024',
      title: 'Best Prop Firms in 2024: Complete Guide',
      cover_image_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60',
      excerpt: 'Discover the top prop firms for forex and futures trading in 2024. Compare features, rules, and payouts.',
      content_md: `# Best Prop Firms in 2024\n\nProp trading has exploded in popularity. Here are the top firms that traders should consider.\n\n## FTMO\nFTMO remains the gold standard with 80% profit splits and transparent operations.\n\n## TopStep Trader\nGreat for US-based traders with NinjaTrader support and solid community.\n\n## 5ers\nBest for crypto traders looking to trade multiple asset classes.`,
      author_id: 'admin-user-id',
      published: true,
    },
  ]

  console.log('Seeding blog_posts...')
  for (const blog of blogs) {
    await setDoc(doc(db, 'blog_posts', blog.id), {
      ...blog,
      published_at: serverTimestamp(),
      created_at: serverTimestamp(),
    })
  }

  // 6. Default Admin User Profile Seeding
  console.log('Seeding admin profile...')
  await setDoc(doc(db, 'profiles', 'admin-user-id'), {
    full_name: 'Anuraj Admin',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
    role: 'admin',
    created_at: serverTimestamp(),
  })

  console.log('Seeding completed successfully!')
}

seed().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
