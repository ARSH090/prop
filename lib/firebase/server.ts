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
}

const MOCK_FIRMS = [
  {
    "id": "ftmo",
    "slug": "ftmo",
    "name": "FTMO",
    "type": "prop_firm",
    "category": [
      "forex",
      "futures",
      "crypto"
    ],
    "logo_url": null,
    "country": "CZ",
    "countries_allowed": [
      "IN",
      "UK",
      "EU"
    ],
    "platforms": [
      "MT4",
      "MT5",
      "cTrader"
    ],
    "max_allocation": 400000,
    "years_active": 10,
    "rating": 4.7,
    "review_count": 842,
    "website_url": "https://ftmo.com",
    "affiliate_url": "https://ftmo.com/ref/anurajfx",
    "is_featured": true,
    "is_verified": true,
    "description": "Largest global prop firm with 400k max allocation and 80% profit split. Known for highly audited operations.",
    "rules": {
      "profit_target": "10% (1-Step); 8%+5% (2-Step)",
      "max_drawdown": "10%",
      "daily_loss": "3-5%",
      "profit_split": "80-90%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "5ers",
    "slug": "5ers",
    "name": "The 5%ers",
    "type": "prop_firm",
    "category": [
      "forex"
    ],
    "logo_url": null,
    "country": "GB",
    "countries_allowed": [
      "IN",
      "US",
      "EU",
      "AU"
    ],
    "platforms": [
      "MT5",
      "cTrader",
      "TradingView"
    ],
    "max_allocation": 1380000,
    "years_active": 10,
    "rating": 4.7,
    "review_count": 1246,
    "website_url": "https://5ers.com",
    "affiliate_url": "https://the5ers.com/ref/anurajfx",
    "is_featured": true,
    "is_verified": true,
    "description": "Highly trusted proprietary trading program offering instant funding models and standard evaluations.",
    "rules": {
      "profit_target": "6% per step (Bootcamp); 8%+5% (High Stakes); 10% (Hyper Growth)",
      "max_drawdown": "5-6%",
      "daily_loss": "3-5%",
      "profit_split": "80-100%",
      "steps": 2,
      "duration": "No time limit",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "fundednext",
    "slug": "fundednext",
    "name": "FundedNext",
    "type": "prop_firm",
    "category": [
      "forex",
      "crypto",
      "futures"
    ],
    "logo_url": null,
    "country": "AE",
    "countries_allowed": [
      "IN",
      "UK",
      "EU",
      "AU"
    ],
    "platforms": [
      "cTrader",
      "Match Trader",
      "MT4",
      "MT5"
    ],
    "max_allocation": 300000,
    "years_active": 4,
    "rating": 4.4,
    "review_count": 848,
    "website_url": "https://fundednext.com",
    "affiliate_url": "https://fundednext.com/ref/anurajfx",
    "is_featured": true,
    "is_verified": true,
    "description": "UAE-based prop firm offering standard, instant and Stellar challenge accounts with multi-platform support.",
    "rules": {
      "profit_target": "8%+5% (Stellar); 10% (Express)",
      "max_drawdown": "6-10%",
      "daily_loss": "3-5%",
      "profit_split": "80-95%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "funding-pips",
    "slug": "funding-pips",
    "name": "Funding Pips",
    "type": "prop_firm",
    "category": [
      "forex",
      "crypto"
    ],
    "logo_url": null,
    "country": "AE",
    "countries_allowed": [
      "IN",
      "UK",
      "EU",
      "AU"
    ],
    "platforms": [
      "cTrader",
      "Match Trader",
      "MT5"
    ],
    "max_allocation": 400000,
    "years_active": 3,
    "rating": 4.2,
    "review_count": 1148,
    "website_url": "https://fundingpips.com",
    "affiliate_url": "https://fundingpips.com/?affiliate=anurajfx",
    "is_featured": true,
    "is_verified": true,
    "description": "Offering competitive pricing, cTrader/MT5 integration, and up to $400K maximum allocation.",
    "rules": {
      "profit_target": "10% (1-Step); 10%+6% (2-Step)",
      "max_drawdown": "6-12%",
      "daily_loss": "3-4%",
      "profit_split": "85-95%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "e8-markets",
    "slug": "e8-markets",
    "name": "E8 Markets",
    "type": "prop_firm",
    "category": [
      "forex",
      "crypto",
      "futures"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "UK",
      "EU",
      "AU"
    ],
    "platforms": [
      "cTrader",
      "Match Trader",
      "MT5",
      "TradeLocker"
    ],
    "max_allocation": 1750000,
    "years_active": 4,
    "rating": 4.8,
    "review_count": 478,
    "website_url": "https://e8funding.com",
    "affiliate_url": "https://e8funding.com/?ref=anurajfx",
    "is_featured": true,
    "is_verified": true,
    "description": "Offers straightforward evaluation programs with raw spreads and custom scaling.",
    "rules": {
      "profit_target": "8%+6%",
      "max_drawdown": "8%",
      "daily_loss": "5%",
      "profit_split": "80%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "brightfunded",
    "slug": "brightfunded",
    "name": "BrightFunded",
    "type": "prop_firm",
    "category": [
      "forex",
      "crypto"
    ],
    "logo_url": null,
    "country": "AE",
    "countries_allowed": [
      "IN",
      "UK",
      "EU"
    ],
    "platforms": [
      "DxTrade",
      "cTrader",
      "MT5"
    ],
    "max_allocation": 400000,
    "years_active": 2,
    "rating": 4.5,
    "review_count": 110,
    "website_url": "https://brightfunded.com",
    "affiliate_url": "https://brightfunded.com/?ref=anurajfx",
    "is_featured": true,
    "is_verified": true,
    "description": "Focused on simulated cTrader and DxTrade environments with excellent rules.",
    "rules": {
      "profit_target": "8%+5%",
      "max_drawdown": "10%",
      "daily_loss": "5%",
      "profit_split": "80-90%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "goat-funded",
    "slug": "goat-funded",
    "name": "Goat Funded Trader",
    "type": "prop_firm",
    "category": [
      "forex",
      "crypto"
    ],
    "logo_url": null,
    "country": "AE",
    "countries_allowed": [
      "IN",
      "UK",
      "EU",
      "AU"
    ],
    "platforms": [
      "cTrader",
      "MT5"
    ],
    "max_allocation": 200000,
    "years_active": 2,
    "rating": 4.7,
    "review_count": 900,
    "website_url": "https://goatfundedtrader.com",
    "affiliate_url": "https://goatfundedtrader.com/?ref=anurajfx",
    "is_featured": true,
    "is_verified": true,
    "description": "Very popular multi-asset prop firm with massive discount codes.",
    "rules": {
      "profit_target": "6% per step",
      "max_drawdown": "6%",
      "daily_loss": "4%",
      "profit_split": "80-100%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "onefunded",
    "slug": "onefunded",
    "name": "OneFunded",
    "type": "prop_firm",
    "category": [
      "forex"
    ],
    "logo_url": null,
    "country": "CZ",
    "countries_allowed": [
      "IN",
      "EU",
      "UK"
    ],
    "platforms": [
      "MT5",
      "cTrader"
    ],
    "max_allocation": 300000,
    "years_active": 2,
    "rating": 4.2,
    "review_count": 154,
    "website_url": "https://onefunded.com",
    "affiliate_url": "https://onefunded.com",
    "is_featured": false,
    "is_verified": true,
    "description": "Czech-based prop firm with excellent scaling structure and user dashboard.",
    "rules": {
      "profit_target": "8%+5%",
      "max_drawdown": "10%",
      "daily_loss": "5%",
      "profit_split": "Up to 90%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "fxify",
    "slug": "fxify",
    "name": "FXIFY",
    "type": "prop_firm",
    "category": [
      "forex"
    ],
    "logo_url": null,
    "country": "GB",
    "countries_allowed": [
      "IN",
      "UK",
      "EU"
    ],
    "platforms": [
      "MT4",
      "MT5",
      "cTrader"
    ],
    "max_allocation": 400000,
    "years_active": 3,
    "rating": 4.4,
    "review_count": 134,
    "website_url": "https://fxify.com",
    "affiliate_url": "https://fxify.com/?ref=anurajfx",
    "is_featured": false,
    "is_verified": true,
    "description": "UK-based prop firm regulated by a reputable framework, offering 400k max allocation.",
    "rules": {
      "profit_target": "8%+5%",
      "max_drawdown": "10%",
      "daily_loss": "5%",
      "profit_split": "80%+",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "hola-prime",
    "slug": "hola-prime",
    "name": "Hola Prime",
    "type": "prop_firm",
    "category": [
      "forex"
    ],
    "logo_url": null,
    "country": "AE",
    "countries_allowed": [
      "IN",
      "AE",
      "UK"
    ],
    "platforms": [
      "MT5",
      "cTrader"
    ],
    "max_allocation": 200000,
    "years_active": 2,
    "rating": 4.2,
    "review_count": 88,
    "website_url": "https://holaprime.com",
    "affiliate_url": "https://holaprime.com/?ref=anurajfx",
    "is_featured": false,
    "is_verified": true,
    "description": "UAE prop firm targeting retail forex and indices traders with fast weekly payouts.",
    "rules": {
      "profit_target": "8%+5%",
      "max_drawdown": "10%",
      "daily_loss": "5%",
      "profit_split": "80%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "the-funded-trader",
    "slug": "the-funded-trader",
    "name": "The Funded Trader",
    "type": "prop_firm",
    "category": [
      "forex",
      "crypto"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "EU",
      "UK"
    ],
    "platforms": [
      "MT4",
      "MT5"
    ],
    "max_allocation": 600000,
    "years_active": 4,
    "rating": 4.1,
    "review_count": 167,
    "website_url": "https://thefundedtraderprogram.com",
    "affiliate_url": "https://thefundedtraderprogram.com/?ref=anurajfx",
    "is_featured": false,
    "is_verified": true,
    "description": "Offers high allocation caps at $600K with excellent community support and resources.",
    "rules": {
      "profit_target": "10% / 5%",
      "max_drawdown": "12%",
      "daily_loss": "5%",
      "profit_split": "75-90%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "fundyourfx",
    "slug": "fundyourfx",
    "name": "FundYourFX",
    "type": "prop_firm",
    "category": [
      "forex"
    ],
    "logo_url": null,
    "country": "GB",
    "countries_allowed": [
      "IN",
      "UK",
      "EU"
    ],
    "platforms": [
      "MT5",
      "MatchTrader"
    ],
    "max_allocation": 250000,
    "years_active": 3,
    "rating": 4.3,
    "review_count": 145,
    "website_url": "https://fundyourfx.com",
    "affiliate_url": "https://fundyourfx.com",
    "is_featured": false,
    "is_verified": true,
    "description": "Specialized forex prop firm featuring instant funding programs with no initial evaluations.",
    "rules": {
      "profit_target": "10%",
      "max_drawdown": "10%",
      "daily_loss": "5%",
      "profit_split": "50-80%",
      "steps": 1,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "funderpro",
    "slug": "funderpro",
    "name": "FunderPro",
    "type": "prop_firm",
    "category": [
      "forex",
      "crypto"
    ],
    "logo_url": null,
    "country": "CY",
    "countries_allowed": [
      "IN",
      "UK",
      "EU",
      "AU"
    ],
    "platforms": [
      "cTrader",
      "MT5"
    ],
    "max_allocation": 200000,
    "years_active": 3,
    "rating": 4.4,
    "review_count": 220,
    "website_url": "https://funderpro.com",
    "affiliate_url": "https://funderpro.com",
    "is_featured": false,
    "is_verified": true,
    "description": "Leading multi-asset firm offering real capital payouts with zero virtual demo delays.",
    "rules": {
      "profit_target": "10%",
      "max_drawdown": "10%",
      "daily_loss": "3-5%",
      "profit_split": "80-90%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "blue-guardian",
    "slug": "blue-guardian",
    "name": "Blue Guardian",
    "type": "prop_firm",
    "category": [
      "forex",
      "crypto"
    ],
    "logo_url": null,
    "country": "GB",
    "countries_allowed": [
      "IN",
      "UK",
      "EU"
    ],
    "platforms": [
      "MT5",
      "MatchTrader"
    ],
    "max_allocation": 300000,
    "years_active": 3,
    "rating": 4.1,
    "review_count": 98,
    "website_url": "https://blueguardian.com",
    "affiliate_url": "https://blueguardian.com",
    "is_featured": false,
    "is_verified": true,
    "description": "Popular forex prop firm with simple guidelines and Guardian Protector features.",
    "rules": {
      "profit_target": "8%+5%",
      "max_drawdown": "10%",
      "daily_loss": "5%",
      "profit_split": "85%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "dojotraders",
    "slug": "dojotraders",
    "name": "DojoTraders",
    "type": "prop_firm",
    "category": [
      "forex",
      "futures",
      "crypto"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "EU"
    ],
    "platforms": [
      "MT5",
      "cTrader"
    ],
    "max_allocation": 400000,
    "years_active": 2,
    "rating": 4,
    "review_count": 45,
    "website_url": "https://dojotraders.com",
    "affiliate_url": "https://dojotraders.com",
    "is_featured": false,
    "is_verified": false,
    "description": "New multi-asset prop firm with simplified, gamified challenge features.",
    "rules": {
      "profit_target": "8%+5%",
      "max_drawdown": "8%",
      "daily_loss": "4%",
      "profit_split": "80%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "topstep",
    "slug": "topstep",
    "name": "Topstep",
    "type": "prop_firm",
    "category": [
      "futures"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "UK",
      "AU"
    ],
    "platforms": [
      "NinjaTrader",
      "cTrader",
      "Tradovate"
    ],
    "max_allocation": 150000,
    "years_active": 8,
    "rating": 4.5,
    "review_count": 289,
    "website_url": "https://topsteptrader.com",
    "affiliate_url": "https://topsteptrader.com/ref/anuraj",
    "is_featured": true,
    "is_verified": true,
    "description": "US-based prop firm with flexible rules and strong community support.",
    "rules": {
      "profit_target": "$3K (50K) / $6K (100K) / $9K (150K)",
      "max_drawdown": "$2K / $3K / $4.5K",
      "daily_loss": "$1K / $2K / $3K",
      "profit_split": "90%",
      "steps": 1,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "apex-trader-funding",
    "slug": "apex-trader-funding",
    "name": "Apex Trader Funding",
    "type": "prop_firm",
    "category": [
      "futures"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "UK",
      "EU"
    ],
    "platforms": [
      "NinjaTrader",
      "Tradovate"
    ],
    "max_allocation": 300000,
    "years_active": 5,
    "rating": 4.6,
    "review_count": 1450,
    "website_url": "https://apextraderfunding.com",
    "affiliate_url": "https://apextraderfunding.com",
    "is_featured": true,
    "is_verified": true,
    "description": "Futures prop firm offering 1-Step programs with low targets and massive coupon sales.",
    "rules": {
      "profit_target": "~6% of account",
      "max_drawdown": "Trailing / EOD",
      "daily_loss": "None",
      "profit_split": "100% first $25K, then 90%",
      "steps": 1,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "myfundedfutures",
    "slug": "myfundedfutures",
    "name": "MyFundedFutures (MFFU)",
    "type": "prop_firm",
    "category": [
      "futures"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "UK",
      "EU"
    ],
    "platforms": [
      "NinjaTrader",
      "Tradovate"
    ],
    "max_allocation": 300000,
    "years_active": 2,
    "rating": 4.5,
    "review_count": 540,
    "website_url": "https://myfundedfutures.com",
    "affiliate_url": "https://myfundedfutures.com",
    "is_featured": true,
    "is_verified": true,
    "description": "Core and Flex futures plans with flat fee structures and quick activations.",
    "rules": {
      "profit_target": "~6%",
      "max_drawdown": "Static / Intraday",
      "daily_loss": "Varies",
      "profit_split": "80-90%",
      "steps": 1,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "tradeify",
    "slug": "tradeify",
    "name": "Tradeify",
    "type": "prop_firm",
    "category": [
      "futures"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "CA",
      "AU"
    ],
    "platforms": [
      "NinjaTrader",
      "Tradovate"
    ],
    "max_allocation": 250000,
    "years_active": 2,
    "rating": 4.1,
    "review_count": 76,
    "website_url": "https://tradeify.co",
    "affiliate_url": "https://tradeify.co/?ref=anurajfx",
    "is_featured": false,
    "is_verified": false,
    "description": "US futures prop firm that allows trading on multiple accounts simultaneously.",
    "rules": {
      "profit_target": "6%",
      "max_drawdown": "3%",
      "daily_loss": "2%",
      "profit_split": "90%",
      "steps": 1,
      "duration": "14 days",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "earn2trade",
    "slug": "earn2trade",
    "name": "Earn2Trade",
    "type": "prop_firm",
    "category": [
      "futures"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "EU"
    ],
    "platforms": [
      "NinjaTrader",
      "Finamark"
    ],
    "max_allocation": 200000,
    "years_active": 6,
    "rating": 4.3,
    "review_count": 198,
    "website_url": "https://earn2trade.com",
    "affiliate_url": "https://earn2trade.com",
    "is_featured": false,
    "is_verified": true,
    "description": "Futures program with educational webinars, customized combine programs, and broker setups.",
    "rules": {
      "profit_target": "6%",
      "max_drawdown": "3% EOD",
      "daily_loss": "2%",
      "profit_split": "80%",
      "steps": 1,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "bulenox",
    "slug": "bulenox",
    "name": "Bulenox",
    "type": "prop_firm",
    "category": [
      "futures"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "EU"
    ],
    "platforms": [
      "NinjaTrader",
      "Rithmic"
    ],
    "max_allocation": 150000,
    "years_active": 4,
    "rating": 4.2,
    "review_count": 142,
    "website_url": "https://bulenox.com",
    "affiliate_url": "https://bulenox.com",
    "is_featured": false,
    "is_verified": true,
    "description": "Futures prop trading combine with high profit split up to 90% and quick scaling.",
    "rules": {
      "profit_target": "6%",
      "max_drawdown": "4% trailing",
      "daily_loss": "3%",
      "profit_split": "90%",
      "steps": 1,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "lucid-trading",
    "slug": "lucid-trading",
    "name": "Lucid Trading",
    "type": "prop_firm",
    "category": [
      "futures"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "EU"
    ],
    "platforms": [
      "NinjaTrader"
    ],
    "max_allocation": 200000,
    "years_active": 2,
    "rating": 4.6,
    "review_count": 84,
    "website_url": "https://lucidtrading.com",
    "affiliate_url": "https://lucidtrading.com",
    "is_featured": false,
    "is_verified": false,
    "description": "Features competitive futures combines and low trailing drawdowns.",
    "rules": {
      "profit_target": "6%",
      "max_drawdown": "3%",
      "daily_loss": "2%",
      "profit_split": "80-90%",
      "steps": 1,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "fundedscore",
    "slug": "fundedscore",
    "name": "FundedScore",
    "type": "prop_firm",
    "category": [
      "futures"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "UK"
    ],
    "platforms": [
      "Tradovate",
      "NinjaTrader"
    ],
    "max_allocation": 150000,
    "years_active": 1,
    "rating": 4,
    "review_count": 22,
    "website_url": "https://fundedscore.com",
    "affiliate_url": "https://fundedscore.com",
    "is_featured": false,
    "is_verified": false,
    "description": "New futures evaluation program with simple parameters and fast verification.",
    "rules": {
      "profit_target": "6%",
      "max_drawdown": "3.5%",
      "daily_loss": "2%",
      "profit_split": "85%",
      "steps": 1,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "the-trading-pit",
    "slug": "the-trading-pit",
    "name": "The Trading Pit",
    "type": "prop_firm",
    "category": [
      "futures"
    ],
    "logo_url": null,
    "country": "CY",
    "countries_allowed": [
      "IN",
      "CY",
      "EU"
    ],
    "platforms": [
      "ATAS",
      "Rithmic",
      "cTrader"
    ],
    "max_allocation": 500000,
    "years_active": 3,
    "rating": 4.5,
    "review_count": 145,
    "website_url": "https://thetradingpit.com",
    "affiliate_url": "https://thetradingpit.com",
    "is_featured": false,
    "is_verified": true,
    "description": "Highly regulated multi-asset prop firm with futures, CFDs, and stock models.",
    "rules": {
      "profit_target": "8%",
      "max_drawdown": "6% static",
      "daily_loss": "3%",
      "profit_split": "70-80%",
      "steps": 1,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "take-profit-trader",
    "slug": "take-profit-trader",
    "name": "Take Profit Trader",
    "type": "prop_firm",
    "category": [
      "futures"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "UK"
    ],
    "platforms": [
      "NinjaTrader",
      "Tradovate"
    ],
    "max_allocation": 150000,
    "years_active": 3,
    "rating": 4.4,
    "review_count": 320,
    "website_url": "https://takeprofittrader.com",
    "affiliate_url": "https://takeprofittrader.com",
    "is_featured": false,
    "is_verified": true,
    "description": "Futures prop program featuring EOD trailing drawdowns and immediate payouts.",
    "rules": {
      "profit_target": "6%",
      "max_drawdown": "3% EOD",
      "daily_loss": "2%",
      "profit_split": "80-90%",
      "steps": 1,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "velotrade",
    "slug": "velotrade",
    "name": "Velotrade",
    "type": "prop_firm",
    "category": [
      "crypto",
      "forex"
    ],
    "logo_url": null,
    "country": "CZ",
    "countries_allowed": [
      "IN",
      "EU",
      "UK"
    ],
    "platforms": [
      "MatchTrader",
      "cTrader"
    ],
    "max_allocation": 500000,
    "years_active": 3,
    "rating": 4.6,
    "review_count": 112,
    "website_url": "https://velotrade.com",
    "affiliate_url": "https://velotrade.com",
    "is_featured": true,
    "is_verified": true,
    "description": "Highly customizable crypto/forex prop firm with static drawdowns and no time limits.",
    "rules": {
      "profit_target": "10% / 10%+5%",
      "max_drawdown": "7-10% static",
      "daily_loss": "3-5%",
      "profit_split": "Up to 90%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "eightcap-funded",
    "slug": "eightcap-funded",
    "name": "Eightcap Funded",
    "type": "prop_firm",
    "category": [
      "crypto",
      "forex"
    ],
    "logo_url": null,
    "country": "AU",
    "countries_allowed": [
      "IN",
      "AU",
      "EU"
    ],
    "platforms": [
      "MT5"
    ],
    "max_allocation": 200000,
    "years_active": 2,
    "rating": 4.1,
    "review_count": 56,
    "website_url": "https://eightcap.com",
    "affiliate_url": "https://eightcap.com",
    "is_featured": false,
    "is_verified": true,
    "description": "Crypto CFD and forex evaluation program linked directly to Eightcap spreads.",
    "rules": {
      "profit_target": "8%+5%",
      "max_drawdown": "10%",
      "daily_loss": "5%",
      "profit_split": "80%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "breakout",
    "slug": "breakout",
    "name": "Breakout",
    "type": "prop_firm",
    "category": [
      "crypto"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "EU"
    ],
    "platforms": [
      "MatchTrader"
    ],
    "max_allocation": 100000,
    "years_active": 2,
    "rating": 4.3,
    "review_count": 78,
    "website_url": "https://breakout.com",
    "affiliate_url": "https://breakout.com",
    "is_featured": false,
    "is_verified": true,
    "description": "Pure crypto prop firm with high targets and competitive pricing.",
    "rules": {
      "profit_target": "9-12%",
      "max_drawdown": "8%",
      "daily_loss": "4%",
      "profit_split": "80%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "coinprop",
    "slug": "coinprop",
    "name": "CoinProp",
    "type": "prop_firm",
    "category": [
      "crypto"
    ],
    "logo_url": null,
    "country": "GB",
    "countries_allowed": [
      "IN",
      "UK",
      "EU"
    ],
    "platforms": [
      "MT5",
      "cTrader"
    ],
    "max_allocation": 150000,
    "years_active": 2,
    "rating": 3.9,
    "review_count": 24,
    "website_url": "https://coinprop.io",
    "affiliate_url": "https://coinprop.io",
    "is_featured": false,
    "is_verified": false,
    "description": "A crypto-focused prop firm with flexible profit target steps and scaling.",
    "rules": {
      "profit_target": "8%+5%",
      "max_drawdown": "8%",
      "daily_loss": "4%",
      "profit_split": "80%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "crypto-fund-trader",
    "slug": "crypto-fund-trader",
    "name": "Crypto Fund Trader",
    "type": "prop_firm",
    "category": [
      "crypto",
      "forex"
    ],
    "logo_url": null,
    "country": "CH",
    "countries_allowed": [
      "IN",
      "UK",
      "EU",
      "AU"
    ],
    "platforms": [
      "Bybit",
      "MatchTrader",
      "MT5"
    ],
    "max_allocation": 830000,
    "years_active": 3,
    "rating": 4.1,
    "review_count": 106,
    "website_url": "https://cryptofundtrader.com",
    "affiliate_url": "https://cryptofundtrader.com/?ref=anurajfx",
    "is_featured": false,
    "is_verified": true,
    "description": "Offers direct Bybit integrations and specialized crypto assets.",
    "rules": {
      "profit_target": "10% / 5%",
      "max_drawdown": "10%",
      "daily_loss": "5%",
      "profit_split": "Up to 90%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "mycryptofunding",
    "slug": "mycryptofunding",
    "name": "MyCryptoFunding",
    "type": "prop_firm",
    "category": [
      "crypto"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "EU"
    ],
    "platforms": [
      "cTrader"
    ],
    "max_allocation": 100000,
    "years_active": 1,
    "rating": 4,
    "review_count": 19,
    "website_url": "https://mycryptofunding.com",
    "affiliate_url": "https://mycryptofunding.com",
    "is_featured": false,
    "is_verified": false,
    "description": "Supports trading over 940+ coins on a simulated cTrader interface.",
    "rules": {
      "profit_target": "8%+5%",
      "max_drawdown": "8%",
      "daily_loss": "4%",
      "profit_split": "80%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "fondeo",
    "slug": "fondeo",
    "name": "Fondeo",
    "type": "prop_firm",
    "category": [
      "crypto"
    ],
    "logo_url": null,
    "country": "MX",
    "countries_allowed": [
      "IN",
      "MX",
      "EU"
    ],
    "platforms": [
      "MatchTrader"
    ],
    "max_allocation": 100000,
    "years_active": 1,
    "rating": 3.8,
    "review_count": 12,
    "website_url": "https://fondeo.io",
    "affiliate_url": "https://fondeo.io",
    "is_featured": false,
    "is_verified": false,
    "description": "Latin American prop firm focused on crypto trading and fast payouts.",
    "rules": {
      "profit_target": "8%+5%",
      "max_drawdown": "10%",
      "daily_loss": "5%",
      "profit_split": "75%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "sabiotrade",
    "slug": "sabiotrade",
    "name": "SabioTrade",
    "type": "prop_firm",
    "category": [
      "crypto",
      "forex"
    ],
    "logo_url": null,
    "country": "ES",
    "countries_allowed": [
      "IN",
      "ES",
      "EU"
    ],
    "platforms": [
      "SabioTraderPlatform"
    ],
    "max_allocation": 200000,
    "years_active": 2,
    "rating": 4.1,
    "review_count": 54,
    "website_url": "https://sabiotrade.com",
    "affiliate_url": "https://sabiotrade.com",
    "is_featured": false,
    "is_verified": true,
    "description": "Prop trading platform integrated with real-time crypto pairs and commission refunds.",
    "rules": {
      "profit_target": "8%+5%",
      "max_drawdown": "8%",
      "daily_loss": "4%",
      "profit_split": "80%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "hyrotrader",
    "slug": "hyrotrader",
    "name": "HyroTrader",
    "type": "prop_firm",
    "category": [
      "crypto"
    ],
    "logo_url": null,
    "country": "CZ",
    "countries_allowed": [
      "IN",
      "EU"
    ],
    "platforms": [
      "Bybit"
    ],
    "max_allocation": 200000,
    "years_active": 2,
    "rating": 4.2,
    "review_count": 48,
    "website_url": "https://hyrotrader.com",
    "affiliate_url": "https://hyrotrader.com",
    "is_featured": false,
    "is_verified": true,
    "description": "Crypto prop firm offering direct Bybit API access and tick-by-tick drawdowns.",
    "rules": {
      "profit_target": "10%",
      "max_drawdown": "10%",
      "daily_loss": "5%",
      "profit_split": "70-90%",
      "steps": 1,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "funding-perpetuals",
    "slug": "funding-perpetuals",
    "name": "Funding Perpetuals",
    "type": "prop_firm",
    "category": [
      "crypto"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "EU"
    ],
    "platforms": [
      "Hyperliquid"
    ],
    "max_allocation": 100000,
    "years_active": 1,
    "rating": 4,
    "review_count": 15,
    "website_url": "https://fundingperpetuals.com",
    "affiliate_url": "https://fundingperpetuals.com",
    "is_featured": false,
    "is_verified": false,
    "description": "Specialized prop firm for simulated trading of perpetual futures on Hyperliquid.",
    "rules": {
      "profit_target": "8%+5%",
      "max_drawdown": "8%",
      "daily_loss": "4%",
      "profit_split": "80%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "alpha-capital",
    "slug": "alpha-capital",
    "name": "Alpha Capital Group",
    "type": "prop_firm",
    "category": [
      "forex",
      "crypto"
    ],
    "logo_url": null,
    "country": "GB",
    "countries_allowed": [
      "IN",
      "UK",
      "EU"
    ],
    "platforms": [
      "MT5",
      "cTrader"
    ],
    "max_allocation": 400000,
    "years_active": 3,
    "rating": 4.3,
    "review_count": 198,
    "website_url": "https://alphacapitalgroup.com",
    "affiliate_url": "https://alphacapitalgroup.com",
    "is_featured": false,
    "is_verified": true,
    "description": "UK-based prop firm with static drawdown and reliable payouts.",
    "rules": {
      "profit_target": "8-10%+5%",
      "max_drawdown": "8-10% static",
      "daily_loss": "4-5%",
      "profit_split": "80%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "alpha-futures",
    "slug": "alpha-futures",
    "name": "Alpha Futures",
    "type": "prop_firm",
    "category": [
      "futures"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "EU"
    ],
    "platforms": [
      "NinjaTrader"
    ],
    "max_allocation": 150000,
    "years_active": 1,
    "rating": 4,
    "review_count": 14,
    "website_url": "https://alphafutures.com",
    "affiliate_url": "https://alphafutures.com",
    "is_featured": false,
    "is_verified": false,
    "description": "New futures combine program offering static rules and quick verification.",
    "rules": {
      "profit_target": "6%",
      "max_drawdown": "3%",
      "daily_loss": "2%",
      "profit_split": "80%",
      "steps": 1,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "dna-funded",
    "slug": "dna-funded",
    "name": "DNA Funded",
    "type": "prop_firm",
    "category": [
      "forex",
      "crypto"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "EU"
    ],
    "platforms": [
      "MT5",
      "cTrader"
    ],
    "max_allocation": 200000,
    "years_active": 2,
    "rating": 3.9,
    "review_count": 32,
    "website_url": "https://dnafunded.com",
    "affiliate_url": "https://dnafunded.com",
    "is_featured": false,
    "is_verified": false,
    "description": "Multi-asset prop firm with standard 2-step evaluation rules.",
    "rules": {
      "profit_target": "8%+5%",
      "max_drawdown": "8%",
      "daily_loss": "5%",
      "profit_split": "Up to 90%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "graviton-research",
    "slug": "graviton-research",
    "name": "Graviton Research",
    "type": "prop_firm",
    "category": [
      "futures",
      "stocks"
    ],
    "logo_url": null,
    "country": "IN",
    "countries_allowed": [
      "IN"
    ],
    "platforms": [
      "proprietary"
    ],
    "max_allocation": 1000000,
    "years_active": 5,
    "rating": 4.6,
    "review_count": 18,
    "website_url": "https://gravitonresearch.com",
    "affiliate_url": "https://gravitonresearch.com",
    "is_featured": false,
    "is_verified": true,
    "description": "Institutional proprietary trading firm focused on high frequency execution.",
    "rules": {
      "profit_target": "Varies",
      "max_drawdown": "5%",
      "daily_loss": "2%",
      "profit_split": "80%",
      "steps": 1,
      "duration": "Unlimited",
      "re_entry": "conditional"
    },
    "status": "active"
  },
  {
    "id": "evercrest-funding",
    "slug": "evercrest-funding",
    "name": "Evercrest Funding",
    "type": "prop_firm",
    "category": [
      "forex"
    ],
    "logo_url": null,
    "country": "US",
    "countries_allowed": [
      "IN",
      "US",
      "EU"
    ],
    "platforms": [
      "MT5"
    ],
    "max_allocation": 200000,
    "years_active": 1,
    "rating": 4,
    "review_count": 9,
    "website_url": "https://evercrestfunding.com",
    "affiliate_url": "https://evercrestfunding.com",
    "is_featured": false,
    "is_verified": false,
    "description": "New forex prop firm targeting retail traders with simple guidelines.",
    "rules": {
      "profit_target": "8%+5%",
      "max_drawdown": "10%",
      "daily_loss": "5%",
      "profit_split": "80%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "for-traders",
    "slug": "for-traders",
    "name": "For Traders",
    "type": "prop_firm",
    "category": [
      "forex"
    ],
    "logo_url": null,
    "country": "CZ",
    "countries_allowed": [
      "IN",
      "EU",
      "UK"
    ],
    "platforms": [
      "cTrader",
      "MT5"
    ],
    "max_allocation": 200000,
    "years_active": 2,
    "rating": 4.1,
    "review_count": 56,
    "website_url": "https://fortraders.com",
    "affiliate_url": "https://fortraders.com",
    "is_featured": false,
    "is_verified": true,
    "description": "Offers high profit split up to 99% with raw spreads and fast payouts.",
    "rules": {
      "profit_target": "8%+5%",
      "max_drawdown": "10%",
      "daily_loss": "5%",
      "profit_split": "80-99%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "clarity-traders",
    "slug": "clarity-traders",
    "name": "Clarity Traders",
    "type": "prop_firm",
    "category": [
      "forex"
    ],
    "logo_url": null,
    "country": "GB",
    "countries_allowed": [
      "IN",
      "UK",
      "EU"
    ],
    "platforms": [
      "MT5",
      "cTrader"
    ],
    "max_allocation": 200000,
    "years_active": 2,
    "rating": 4,
    "review_count": 28,
    "website_url": "https://claritytraders.com",
    "affiliate_url": "https://claritytraders.com",
    "is_featured": false,
    "is_verified": false,
    "description": "Forex prop firm offering flexible 2-step evaluation rules and scale targets.",
    "rules": {
      "profit_target": "8%+5%",
      "max_drawdown": "10%",
      "daily_loss": "5%",
      "profit_split": "80%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "funded-trading-plus",
    "slug": "funded-trading-plus",
    "name": "Funded Trading Plus",
    "type": "prop_firm",
    "category": [
      "forex",
      "crypto"
    ],
    "logo_url": null,
    "country": "GB",
    "countries_allowed": [
      "IN",
      "UK",
      "EU",
      "AU"
    ],
    "platforms": [
      "MT4",
      "MT5"
    ],
    "max_allocation": 200000,
    "years_active": 3,
    "rating": 4,
    "review_count": 78,
    "website_url": "https://fundedtradingplus.com",
    "affiliate_url": "https://fundedtradingplus.com/?ref=anurajfx",
    "is_featured": false,
    "is_verified": true,
    "description": "UK-based prop firm with a transparent fee structure and direct payouts.",
    "rules": {
      "profit_target": "10% / 5%",
      "max_drawdown": "10%",
      "daily_loss": "5%",
      "profit_split": "80%",
      "steps": 2,
      "duration": "Unlimited",
      "re_entry": "allowed"
    },
    "status": "active"
  },
  {
    "id": "zerodha",
    "slug": "zerodha",
    "name": "Zerodha",
    "type": "broker",
    "category": [
      "forex",
      "stocks",
      "futures"
    ],
    "logo_url": null,
    "country": "IN",
    "countries_allowed": [
      "IN"
    ],
    "platforms": [
      "web",
      "mobile",
      "API"
    ],
    "max_allocation": 1000000,
    "years_active": 14,
    "rating": 4.8,
    "review_count": 5420,
    "website_url": "https://zerodha.com",
    "affiliate_url": "https://zerodha.com",
    "is_featured": true,
    "is_verified": true,
    "description": "India's largest stock broker with excellent execution and lowest commissions.",
    "rules": {
      "spreads": "0.5-2 pips",
      "leverage": "1:20",
      "deposit_min": "₹10,000",
      "regulation": "SEBI",
      "settlement": "T+1"
    },
    "status": "active"
  }
];

const MOCK_CHALLENGES = [
  {
    "id": "ch-ftmo-100k",
    "firm_id": "ftmo",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 500,
    "popularity_score": 95,
    "price": 540,
    "original_price": 540,
    "currency": "USD",
    "deal_id": "deal-ftmo",
    "affiliate_url": "https://ftmo.com/ref/anurajfx",
    "is_active": true
  },
  {
    "id": "ch-5ers-100k",
    "firm_id": "5ers",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 4,
    "max_loss_pct": 8,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 450,
    "popularity_score": 75,
    "price": 161.1,
    "original_price": 179,
    "currency": "USD",
    "deal_id": "deal-5ers",
    "affiliate_url": "https://5ers.com/ref/anurajfx",
    "is_active": true
  },
  {
    "id": "ch-fundednext-stellar-lite-200k",
    "firm_id": "fundednext",
    "account_size": 200000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 4,
    "max_loss_pct": 8,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 750,
    "popularity_score": 85,
    "price": 743.06,
    "original_price": 798.99,
    "currency": "USD",
    "deal_id": "deal-fundednext",
    "affiliate_url": "https://fundednext.com/ref/anurajfx",
    "is_active": true
  },
  {
    "id": "ch-funding-pips-pro-100k",
    "firm_id": "funding-pips",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Weekly",
    "loyalty_points": 400,
    "popularity_score": 92,
    "price": 337.6,
    "original_price": 422,
    "currency": "USD",
    "deal_id": "deal-fundingpips",
    "affiliate_url": "https://fundingpips.com/?affiliate=anurajfx",
    "is_active": true
  },
  {
    "id": "ch-brightfunded-2step-100k",
    "firm_id": "brightfunded",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 350,
    "popularity_score": 70,
    "price": 357.75,
    "original_price": 477,
    "currency": "EUR",
    "deal_id": "deal-brightfunded",
    "affiliate_url": "https://brightfunded.com/?ref=anurajfx",
    "is_active": true
  },
  {
    "id": "ch-e8-markets-pro-200k",
    "firm_id": "e8-markets",
    "account_size": 200000,
    "steps": 1,
    "profit_target_p1": 8,
    "profit_target_p2": 0,
    "daily_loss_pct": 5,
    "max_loss_pct": 8,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 800,
    "popularity_score": 78,
    "price": 748.5,
    "original_price": 998,
    "currency": "USD",
    "deal_id": "deal-e8-markets",
    "affiliate_url": "https://e8funding.com/?ref=anurajfx",
    "is_active": true
  },
  {
    "id": "ch-goat-funded-premium-100k",
    "firm_id": "goat-funded",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 6,
    "profit_target_p2": 6,
    "daily_loss_pct": 4,
    "max_loss_pct": 6,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 600,
    "popularity_score": 82,
    "price": 599,
    "original_price": 1198,
    "currency": "USD",
    "deal_id": "deal-goat-funded",
    "affiliate_url": "https://goatfundedtrader.com/?ref=anurajfx",
    "is_active": true
  },
  {
    "id": "ch-onefunded-100k",
    "firm_id": "onefunded",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 250,
    "popularity_score": 65,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://onefunded.com",
    "is_active": true
  },
  {
    "id": "ch-fxify-100k",
    "firm_id": "fxify",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 220,
    "popularity_score": 68,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://fxify.com",
    "is_active": true
  },
  {
    "id": "ch-hola-prime-100k",
    "firm_id": "hola-prime",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 200,
    "popularity_score": 63,
    "price": 463.2,
    "original_price": 579,
    "currency": "USD",
    "deal_id": "deal-hola-prime",
    "affiliate_url": "https://holaprime.com",
    "is_active": true
  },
  {
    "id": "ch-the-funded-trader-100k",
    "firm_id": "the-funded-trader",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 10,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 12,
    "pt_dd_ratio": "1:1.2",
    "profit_split_pct": 75,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 210,
    "popularity_score": 64,
    "price": 337.6,
    "original_price": 422,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://thefundedtraderprogram.com",
    "is_active": true
  },
  {
    "id": "ch-fundyourfx-100k",
    "firm_id": "fundyourfx",
    "account_size": 100000,
    "steps": 1,
    "profit_target_p1": 10,
    "profit_target_p2": 0,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 190,
    "popularity_score": 60,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://fundyourfx.com",
    "is_active": true
  },
  {
    "id": "ch-funderpro-100k",
    "firm_id": "funderpro",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 10,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 280,
    "popularity_score": 72,
    "price": 337.6,
    "original_price": 422,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://funderpro.com",
    "is_active": true
  },
  {
    "id": "ch-blue-guardian-100k",
    "firm_id": "blue-guardian",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 85,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 230,
    "popularity_score": 61,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://blueguardian.com",
    "is_active": true
  },
  {
    "id": "ch-dojotraders-100k",
    "firm_id": "dojotraders",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 4,
    "max_loss_pct": 8,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 150,
    "popularity_score": 55,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://dojotraders.com",
    "is_active": true
  },
  {
    "id": "ch-topstep-100k",
    "firm_id": "topstep",
    "account_size": 100000,
    "steps": 1,
    "profit_target_p1": 6,
    "profit_target_p2": 0,
    "daily_loss_pct": 2,
    "max_loss_pct": 3,
    "pt_dd_ratio": "2:1",
    "profit_split_pct": 90,
    "payout_freq": "Weekly",
    "loyalty_points": 150,
    "popularity_score": 88,
    "price": 99,
    "original_price": 150,
    "currency": "USD",
    "deal_id": "deal-topstep",
    "affiliate_url": "https://topsteptrader.com/ref/anuraj",
    "is_active": true
  },
  {
    "id": "ch-apex-100k",
    "firm_id": "apex-trader-funding",
    "account_size": 100000,
    "steps": 1,
    "profit_target_p1": 6,
    "profit_target_p2": 0,
    "daily_loss_pct": 2,
    "max_loss_pct": 3,
    "pt_dd_ratio": "2:1",
    "profit_split_pct": 90,
    "payout_freq": "Weekly",
    "loyalty_points": 350,
    "popularity_score": 91,
    "price": 180,
    "original_price": 240,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://apextraderfunding.com",
    "is_active": true
  },
  {
    "id": "ch-myfundedfutures-100k",
    "firm_id": "myfundedfutures",
    "account_size": 100000,
    "steps": 1,
    "profit_target_p1": 6,
    "profit_target_p2": 0,
    "daily_loss_pct": 2,
    "max_loss_pct": 3,
    "pt_dd_ratio": "2:1",
    "profit_split_pct": 80,
    "payout_freq": "Weekly",
    "loyalty_points": 300,
    "popularity_score": 84,
    "price": 100,
    "original_price": 150,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://myfundedfutures.com",
    "is_active": true
  },
  {
    "id": "ch-tradeify-100k",
    "firm_id": "tradeify",
    "account_size": 100000,
    "steps": 1,
    "profit_target_p1": 6,
    "profit_target_p2": 0,
    "daily_loss_pct": 2,
    "max_loss_pct": 3,
    "pt_dd_ratio": "2:1",
    "profit_split_pct": 90,
    "payout_freq": "Weekly",
    "loyalty_points": 200,
    "popularity_score": 65,
    "price": 99,
    "original_price": 150,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://tradeify.co",
    "is_active": true
  },
  {
    "id": "ch-earn2trade-100k",
    "firm_id": "earn2trade",
    "account_size": 100000,
    "steps": 1,
    "profit_target_p1": 6,
    "profit_target_p2": 0,
    "daily_loss_pct": 2,
    "max_loss_pct": 3,
    "pt_dd_ratio": "2:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 250,
    "popularity_score": 72,
    "price": 150,
    "original_price": 200,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://earn2trade.com",
    "is_active": true
  },
  {
    "id": "ch-bulenox-100k",
    "firm_id": "bulenox",
    "account_size": 100000,
    "steps": 1,
    "profit_target_p1": 6,
    "profit_target_p2": 0,
    "daily_loss_pct": 3,
    "max_loss_pct": 4,
    "pt_dd_ratio": "1.5:1",
    "profit_split_pct": 90,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 280,
    "popularity_score": 71,
    "price": 55,
    "original_price": 99,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://bulenox.com",
    "is_active": true
  },
  {
    "id": "ch-lucid-trading-100k",
    "firm_id": "lucid-trading",
    "account_size": 100000,
    "steps": 1,
    "profit_target_p1": 6,
    "profit_target_p2": 0,
    "daily_loss_pct": 2,
    "max_loss_pct": 3,
    "pt_dd_ratio": "2:1",
    "profit_split_pct": 85,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 150,
    "popularity_score": 55,
    "price": 140,
    "original_price": 180,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://lucidtrading.com",
    "is_active": true
  },
  {
    "id": "ch-fundedscore-100k",
    "firm_id": "fundedscore",
    "account_size": 100000,
    "steps": 1,
    "profit_target_p1": 6,
    "profit_target_p2": 0,
    "daily_loss_pct": 2,
    "max_loss_pct": 3.5,
    "pt_dd_ratio": "1.7:1",
    "profit_split_pct": 85,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 120,
    "popularity_score": 52,
    "price": 145,
    "original_price": 199,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://fundedscore.com",
    "is_active": true
  },
  {
    "id": "ch-the-trading-pit-100k",
    "firm_id": "the-trading-pit",
    "account_size": 100000,
    "steps": 1,
    "profit_target_p1": 8,
    "profit_target_p2": 0,
    "daily_loss_pct": 3,
    "max_loss_pct": 6,
    "pt_dd_ratio": "1.3:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 340,
    "popularity_score": 75,
    "price": 180,
    "original_price": 240,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://thetradingpit.com",
    "is_active": true
  },
  {
    "id": "ch-take-profit-100k",
    "firm_id": "take-profit-trader",
    "account_size": 100000,
    "steps": 1,
    "profit_target_p1": 6,
    "profit_target_p2": 0,
    "daily_loss_pct": 2,
    "max_loss_pct": 3,
    "pt_dd_ratio": "2:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 300,
    "popularity_score": 80,
    "price": 150,
    "original_price": 200,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://takeprofittrader.com",
    "is_active": true
  },
  {
    "id": "ch-velotrade-100k",
    "firm_id": "velotrade",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 10,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 85,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 350,
    "popularity_score": 78,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://velotrade.com",
    "is_active": true
  },
  {
    "id": "ch-eightcap-funded-100k",
    "firm_id": "eightcap-funded",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 280,
    "popularity_score": 68,
    "price": 350,
    "original_price": 450,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://eightcap.com",
    "is_active": true
  },
  {
    "id": "ch-breakout-100k",
    "firm_id": "breakout",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 10,
    "profit_target_p2": 5,
    "daily_loss_pct": 4,
    "max_loss_pct": 8,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 310,
    "popularity_score": 72,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://breakout.com",
    "is_active": true
  },
  {
    "id": "ch-coinprop-100k",
    "firm_id": "coinprop",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 4,
    "max_loss_pct": 8,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 150,
    "popularity_score": 55,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://coinprop.io",
    "is_active": true
  },
  {
    "id": "ch-crypto-fund-trader-100k",
    "firm_id": "crypto-fund-trader",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 10,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 400,
    "popularity_score": 92,
    "price": 500,
    "original_price": 600,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://cryptofundtrader.com",
    "is_active": true
  },
  {
    "id": "ch-mycryptofunding-100k",
    "firm_id": "mycryptofunding",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 4,
    "max_loss_pct": 8,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 180,
    "popularity_score": 58,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://mycryptofunding.com",
    "is_active": true
  },
  {
    "id": "ch-fondeo-100k",
    "firm_id": "fondeo",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 75,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 120,
    "popularity_score": 50,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://fondeo.io",
    "is_active": true
  },
  {
    "id": "ch-sabiotrade-100k",
    "firm_id": "sabiotrade",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 4,
    "max_loss_pct": 8,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 190,
    "popularity_score": 61,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://sabiotrade.com",
    "is_active": true
  },
  {
    "id": "ch-hyrotrader-100k",
    "firm_id": "hyrotrader",
    "account_size": 100000,
    "steps": 1,
    "profit_target_p1": 10,
    "profit_target_p2": 0,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 210,
    "popularity_score": 62,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://hyrotrader.com",
    "is_active": true
  },
  {
    "id": "ch-funding-perpetuals-100k",
    "firm_id": "funding-perpetuals",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 4,
    "max_loss_pct": 8,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 140,
    "popularity_score": 54,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://fundingperpetuals.com",
    "is_active": true
  },
  {
    "id": "ch-alpha-capital-100k",
    "firm_id": "alpha-capital",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 220,
    "popularity_score": 75,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://alphacapitalgroup.com",
    "is_active": true
  },
  {
    "id": "ch-alpha-futures-100k",
    "firm_id": "alpha-futures",
    "account_size": 100000,
    "steps": 1,
    "profit_target_p1": 6,
    "profit_target_p2": 0,
    "daily_loss_pct": 2,
    "max_loss_pct": 3,
    "pt_dd_ratio": "2:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 140,
    "popularity_score": 56,
    "price": 150,
    "original_price": 200,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://alphafutures.com",
    "is_active": true
  },
  {
    "id": "ch-dna-funded-100k",
    "firm_id": "dna-funded",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 8,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 210,
    "popularity_score": 60,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://dnafunded.com",
    "is_active": true
  },
  {
    "id": "ch-graviton-research-100k",
    "firm_id": "graviton-research",
    "account_size": 100000,
    "steps": 1,
    "profit_target_p1": 8,
    "profit_target_p2": 0,
    "daily_loss_pct": 2,
    "max_loss_pct": 5,
    "pt_dd_ratio": "1.6:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 180,
    "popularity_score": 62,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://gravitonresearch.com",
    "is_active": true
  },
  {
    "id": "ch-evercrest-funding-100k",
    "firm_id": "evercrest-funding",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 150,
    "popularity_score": 54,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://evercrestfunding.com",
    "is_active": true
  },
  {
    "id": "ch-for-traders-100k",
    "firm_id": "for-traders",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 90,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 320,
    "popularity_score": 82,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://fortraders.com",
    "is_active": true
  },
  {
    "id": "ch-clarity-traders-100k",
    "firm_id": "clarity-traders",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 8,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 140,
    "popularity_score": 55,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://claritytraders.com",
    "is_active": true
  },
  {
    "id": "ch-funded-trading-plus-100k",
    "firm_id": "funded-trading-plus",
    "account_size": 100000,
    "steps": 2,
    "profit_target_p1": 10,
    "profit_target_p2": 5,
    "daily_loss_pct": 5,
    "max_loss_pct": 10,
    "pt_dd_ratio": "1:1",
    "profit_split_pct": 80,
    "payout_freq": "Bi-weekly",
    "loyalty_points": 240,
    "popularity_score": 70,
    "price": 349,
    "original_price": 499,
    "currency": "USD",
    "deal_id": null,
    "affiliate_url": "https://fundedtradingplus.com",
    "is_active": true
  }
];

const MOCK_SPREADS = [
  { id: 'sp-1', firm_id: 'zerodha', instrument: 'EURUSD', spread_pips: 0.2, commission_note: '$2 per lot', updated_at: new Date().toISOString() },
  { id: 'sp-2', firm_id: 'zerodha', instrument: 'XAUUSD', spread_pips: 1.5, commission_note: '$3 per lot', updated_at: new Date().toISOString() },
  { id: 'sp-3', firm_id: 'zerodha', instrument: 'GBPUSD', spread_pips: 0.4, commission_note: '$2 per lot', updated_at: new Date().toISOString() },
]

const MOCK_PAYOUTS = [
  { id: 'p-1', firm_id: 'ftmo', trader_display_name: 'Rahul S.', amount: 4850, currency: 'USD', proof_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300', payout_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), is_verified: true },
  { id: 'p-2', firm_id: 'topstep', trader_display_name: 'Aditya K.', amount: 3200, currency: 'USD', proof_image_url: 'https://images.unsplash.com/photo-1642390091310-70f1a87d6677?w=300', payout_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), is_verified: true },
  { id: 'p-3', firm_id: '5ers', trader_display_name: 'Pooja M.', amount: 1540, currency: 'USD', proof_image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300', payout_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), is_verified: true },
  { id: 'p-4', firm_id: 'fundednext', trader_display_name: 'Vikram A.', amount: 6720, currency: 'USD', proof_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300', payout_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), is_verified: true },
  { id: 'p-5', firm_id: 'funding-pips', trader_display_name: 'Nikhil T.', amount: 2850, currency: 'USD', proof_image_url: 'https://images.unsplash.com/photo-1642390091310-70f1a87d6677?w=300', payout_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), is_verified: true },
  { id: 'p-6', firm_id: 'e8-markets', trader_display_name: 'Sarah K.', amount: 11400, currency: 'USD', proof_image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300', payout_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), is_verified: true },
  { id: 'p-7', firm_id: 'brightfunded', trader_display_name: 'Hans G.', amount: 4120, currency: 'EUR', proof_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300', payout_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), is_verified: true },
  { id: 'p-8', firm_id: 'crypto-fund-trader', trader_display_name: 'Marco L.', amount: 8900, currency: 'USD', proof_image_url: 'https://images.unsplash.com/photo-1642390091310-70f1a87d6677?w=300', payout_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), is_verified: true },
  { id: 'p-9', firm_id: 'hola-prime', trader_display_name: 'Chen W.', amount: 3350, currency: 'USD', proof_image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300', payout_date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), is_verified: true },
  { id: 'p-10', firm_id: 'atmos-funded', trader_display_name: 'Andreas P.', amount: 1980, currency: 'USD', proof_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300', payout_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), is_verified: true },
  { id: 'p-11', firm_id: 'goat-funded', trader_display_name: 'Edoardo D.', amount: 5640, currency: 'USD', proof_image_url: 'https://images.unsplash.com/photo-1642390091310-70f1a87d6677?w=300', payout_date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), is_verified: true },
  { id: 'p-12', firm_id: 'trade-the-pool', trader_display_name: 'Avi M.', amount: 15800, currency: 'USD', proof_image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300', payout_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), is_verified: true },
  { id: 'p-13', firm_id: 'fundedelite', trader_display_name: 'Giovanni F.', amount: 7200, currency: 'USD', proof_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300', payout_date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), is_verified: true },
  { id: 'p-14', firm_id: 'apex-trader-funding', trader_display_name: 'John D.', amount: 14500, currency: 'USD', proof_image_url: 'https://images.unsplash.com/photo-1642390091310-70f1a87d6677?w=300', payout_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), is_verified: true },
  { id: 'p-15', firm_id: 'alpha-capital', trader_display_name: 'William B.', amount: 8930, currency: 'USD', proof_image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300', payout_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), is_verified: true },
  { id: 'p-16', firm_id: 'blue-guardian', trader_display_name: 'Sophia R.', amount: 3750, currency: 'USD', proof_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300', payout_date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(), is_verified: true }
]

// In-memory query cache storage
const memoryCache: Record<string, { data: any; expiry: number }> = {}
const CACHE_TTL = 30 * 1000 // Cache for 30 seconds

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
        return type ? MOCK_FIRMS.filter((f) => f.type === type) : MOCK_FIRMS
      }
      const list: any[] = []
      snapshot.forEach((doc: any) => {
        list.push(serializeDoc({ id: doc.id, ...doc.data() }))
      })
      return list
    } catch (error) {
      console.warn('Firestore read failed for firms. Returning mock fallbacks.')
      return type ? MOCK_FIRMS.filter((f) => f.type === type) : MOCK_FIRMS
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

export async function getChallenges(): Promise<any[]> {
  return withCache('challenges_all', async () => {
    try {
      const snapshot = await db.collection('challenges').get()
      if (snapshot.empty) {
        return MOCK_CHALLENGES
      }
      const list: any[] = []
      snapshot.forEach((doc: any) => {
        list.push(serializeDoc({ id: doc.id, ...doc.data() }))
      })
      return list
    } catch (error) {
      console.warn('Firestore read failed for challenges. Returning mock fallbacks.')
      return MOCK_CHALLENGES
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
