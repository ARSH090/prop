# Anuraj FX - Complete A-to-Z Codebase Audit Report

This document provides a comprehensive audit of the **Anuraj FX** platform codebase. It covers the directory hierarchy, file-by-file use cases, core database schemas, client-server boundaries, and advanced functional mechanisms from basic to advanced levels.

---

## 1. Executive Architecture Summary

Anuraj FX is a premium, high-performance prop firm evaluation aggregator, comparator, and analytics platform. The application is built on top of the modern **Next.js App Router** framework utilizing **React 19**, styled using **PostCSS / TailwindCSS**, powered by **Cloud Firestore (Firebase Admin & Client SDKs)**, and featuring interactive **Three.js** 2.5D canvas layers for dynamic rendering.

### Core Architectural Decisions
- **Next.js App Router**: Utilizes React Server Components (RSC) for fast initial paint times, high search engine indexability (SEO), and dynamic route segmentations (e.g., standard categories: forex, crypto, futures).
- **Server Caching Layer**: Wraps Firestore reads inside a memory cache (`withCache`) that persists across requests, which is manually revalidated via Next.js ISR utilities (`revalidatePath`) whenever the administrative dashboard modifies layouts, challenges, or parent companies.
- **Strict Role Separation**: The admin dashboard (`/app/admin/*`) is fully decoupled from the public routing layer and protected by a robust middleware check/layout auth check that queries verified administrator hashes.

---

## 2. Page & Routing Inventory Table

The following routes are implemented and operational in the system:

| Route Path | Type | Use Case / User Action | UI Features |
| :--- | :--- | :--- | :--- |
| `/` | Public RSC | Main Landing page. Displays Hero, tickers, marquee, and top challenges. | 3D rotating node globe, glassmorphic card list, neon headers. |
| `/[category]` | Public RSC | Category-specific homepage segmentation (e.g., Forex, Futures, Crypto). | Segmented query filters, custom branding. |
| `/about` | Public Static | Platform overview and background context on Anuraj FX team. | Sleek responsive grid layout. |
| `/affiliate-program` | Public Static | Registration form for content creators and referrers. | Referral percentage sliders. |
| `/best-sellers` | Public RSC | Spotlights the highest rated/most popular programs on the platform. | Stars rating indicator, direct link buttons. |
| `/blog` | Public Dynamic | Lists dynamic trading insight articles. | Tag-filtering systems, animated pagination. |
| `/blog/[slug]` | Public Dynamic | Renders full articles with publication timestamps and author info. | Markdown parser, related post widgets. |
| `/brokers` | Public RSC | Side-by-side regulated brokers comparison page. | Broker specifications comparison matrix. |
| `/challenges` | Public Client | Advanced comparison table with tier tags, size filters, and sliders. | Live filter criteria search, multi-selection. |
| `/compare` | Public Client | Side-by-side comparative specifications matrix for firms. | Metric sorting, drag-and-drop slots. |
| `/community` | Public Dynamic | Forum boards and article comments section for traders. | Nested discussions threads, user badges. |
| `/contact` | Public Client | Contact form for support or advertisement requests. | Toast notification success messages. |
| `/deals` | Public RSC | Lists discount codes and promo codes. | One-click clipboard copy utility. |
| `/demo-accounts` | Public Client | Queries and lists firms that offer free trial/demo logins. | direct credentials retrieval buttons. |
| `/favorites` | Public Client | Displays bookmarked firms stored in local client state. | Instantly populated card layout. |
| `/leaderboard` | Public RSC | Traders ranking system displaying payout success records. | Medal styling for top 3, dynamic regional flags. |
| `/loyalty` | Public Client | Referral points tracker page. | Visual progress bar indicators. |
| `/payouts` | Public Client | Trader payout proof upload and gallery gallery. | Image upload selector with preview crop utility. |
| `/privacy-policy` | Public Static | GDPR/CCPA disclosures. | Structured typography. |
| `/rules` | Public RSC | Comparative matrix for firm policies, consistency laws, and payouts. | 3-tab sub-layout switcher. |
| `/terms-and-conditions` | Public Static | Platform user terms of service. | Standard readable copy. |
| `/transparency` | Public Static | Operational safety guidelines and aggregator parameters. | Minimalist clean layout. |
| `/auth/login` | Public Client | Administrative session entry point. | secure input formatting and validation checks. |
| `/admin` | Admin Client | Homepage of administration panel showing system metrics. | Stats cards with glowing grid patterns. |
| `/admin/awards` | Admin Client | Handles awards category registration and seeds voting values. | Drag and drop rows. |
| `/admin/blog` | Admin Client | Article creation and post publishing controller. | Rich text editor preview canvas. |
| `/admin/challenges` | Admin Client | Lists all active challenge programs. | Search & sort headers. |
| `/admin/challenges/[id]` | Admin Client | Form to modify pricing, targets, and links of specific programs. | Instant validation constraints. |
| `/admin/challenges/new` | Admin Client | Creator form for new program tiers. | Type-ahead select for parent firms. |
| `/admin/deals` | Admin Client | Manages active discount promo codes. | Clipboard-ready string builder. |
| `/admin/events` | Admin Client | Tournament coordinator board for trading competitions. | Event schedule timers. |
| `/admin/firms` | Admin Client | Main list of parent companies with featured/marquee indicators. | Quick status toggle switches. |
| `/admin/firms/[id]` | Admin Client | Tabbed firm details editor (Brand attributes, Rules changelog, Specs). | Dynamic specs builder, rules changelog. |
| `/admin/firms/new` | Admin Client | Setup form for creating new parent companies. | Standard logo and marquee logo upload inputs. |
| `/admin/media` | Admin Client | Media repository. | Drag-and-drop media uploads. |
| `/admin/messages` | Admin Client | Support contact inbox manager. | Read/unread flag toggles. |
| `/admin/page-builder` | Admin Client | Customizes homepage text, section orders, and 3D globe slots. | Visual page builder forms, JSON editor lists. |
| `/admin/payouts` | Admin Client | Verifies, rejects, and reviews payout proofs. | Action buttons for gallery validation. |
| `/admin/reviews` | Admin Client | Approves or flags user-submitted ratings. | Star rating filter toggles. |
| `/admin/settings` | Admin Client | Configures global application properties. | Safe saving alert indicators. |
| `/admin/spreads` | Admin Client | Updates spreads logger for dynamic price feeds. | Multi-pair configuration tables. |

---

## 3. Directory Structure & File Audit

Below is a detailed A-to-Z audit of the folders and files containing application code, detailing the explicit use case and implementation layer of each file.

```
📁 root
├── 📁 .next                          # Compiled Next.js application build artifacts (ignored)
├── 📁 app                            # Next.js App Router (Routing and API layer)
│   ├── 📁 [category]                 # Dynamic segmented homepage routing (Crypto/Forex/Futures)
│   │   └── page.tsx                  # Segmented landing page renderer
│   ├── 📁 about                      # About page route folder
│   │   └── page.tsx                  # Static about content renderer
│   ├── 📁 admin                      # Administrative management section
│   │   ├── 📁 awards                 # Awards dashboard folder
│   │   │   └── page.tsx              # Admin voting/awards management
│   │   ├── 📁 blog                   # Blog dashboard folder
│   │   │   └── page.tsx              # Article administrator list/creations
│   │   ├── 📁 challenges             # Challenge tiers management folder
│   │   │   ├── 📁 [id]               # Dynamic challenge update route
│   │   │   │   └── page.tsx          # Form for editing a specific challenge tier
│   │   │   ├── 📁 new                # Challenge creator route
│   │   │   │   └── page.tsx          # Creation form for a new challenge
│   │   │   └── page.tsx              # Challenge program inventory list
│   │   ├── 📁 deals                  # Deals manager dashboard folder
│   │   │   └── page.tsx              # Configures promo codes and links
│   │   ├── 📁 events                 # Competition planner dashboard folder
│   │   │   └── page.tsx              # Schedules trader tournaments
│   │   ├── 📁 firms                  # Parent firms manager dashboard folder
│   │   │   ├── 📁 [id]               # Dynamic edit firm details route
│   │   │   │   └── page.tsx          # Form for updating firm attributes, contract specs, rules
│   │   │   ├── 📁 new                # Firm constructor route
│   │   │   │   └── page.tsx          # Creation form for a new parent firm
│   │   │   └── page.tsx              # Parent firms overview table
│   │   ├── 📁 media                  # Uploaded assets manager folder
│   │   │   └── page.tsx              # Media gallery grid
│   │   ├── 📁 messages               # Contact requests dashboard folder
│   │   │   └── page.tsx              # Customer service inbox reader
│   │   ├── 📁 page-builder           # Visual Page Builder route folder
│   │   │   └── page.tsx              # Customizes home layouts and 3D globe slot nodes
│   │   ├── 📁 payouts                # Trader payout validator folder
│   │   │   └── page.tsx              # Verify/Review client uploaded receipts
│   │   ├── 📁 reviews                # User ratings validator folder
│   │   │   └── page.tsx              # Moderate trader reviews
│   │   ├── 📁 settings               # Settings config route folder
│   │   │   └── page.tsx              # Adjusts global parameters (Discord links, etc.)
│   │   ├── 📁 spreads                # Tickers spread manager route folder
│   │   │   └── page.tsx              # Table to modify live feed currency lists
│   │   ├── layout.tsx                # Admin Panel sidebar shell and auth validation layer
│   │   └── page.tsx                  # Panel dashboard hub showing metrics counters
│   ├── 📁 api                        # Backend server endpoint routes (Next.js route handlers)
│   │   ├── 📁 admin                  # Restricted admin backend routes
│   │   │   ├── 📁 firms              # Manage firms data collection
│   │   │   │   ├── 📁 [id]           # Dynamic route for specific firm CRUD operations
│   │   │   │   │   ├── 📁 contract-specs # Contract specifications endpoint
│   │   │   │   │   │   └── route.ts  # GET/POST endpoints for futures contract specs
│   │   │   │   │   └── route.ts      # GET/PUT/DELETE handler for a single firm doc
│   │   │   │   └── route.ts          # GET/POST handler for firm lists
│   │   │   ├── 📁 page-builder       # Handles layout adjustments
│   │   │   │   ├── 📁 save           # Configuration save point
│   │   │   │   │   └── route.ts      # POST endpoint that commits and revalidates pages
│   │   │   │   └── route.ts          # GET endpoint that returns sections for builder
│   │   │   └── 📁 upload             # Image file upload controller
│   │   │       └── route.ts          # POST endpoint resolving local uploads to url paths
│   │   ├── 📁 ticker-prices          # Pricing feeder endpoints
│   │   │   └── route.ts              # Feeds dynamic ticks and spreads
│   │   └── route.ts                  # Root API verification route
│   ├── 📁 affiliate-program          # Referrals public route
│   │   └── page.tsx                  # Public affiliate copy page
│   ├── 📁 auth                       # Sign-in route
│   │   └── page.tsx                  # secure administrator login page
│   ├── 📁 best-sellers               # Top plans public route
│   │   └── page.tsx                  # Aggregated top choices
│   ├── 📁 blog                       # Articles list route
│   │   ├── 📁 [slug]                 # Specific article reader route
│   │   │   └── page.tsx              # Renders markdown content of blogs
│   │   └── page.tsx                  # Blog grid page
│   ├── 📁 brokers                    # Regulated broker comparative route
│   │   └── page.tsx                  # Broker inventory listing
│   ├── 📁 challenges                 # Main comparison grid route
│   │   └── page.tsx                  # Comprehensive searchable comparison layout
│   ├── 📁 community                  # Community forum route
│   │   └── page.tsx                  # Forum categories list
│   ├── 📁 compare                    # Side-by-side comparison selector route
│   │   └── page.tsx                  # Client side comparison interface
│   ├── 📁 contact                    # Helpdesk request route
│   │   └── page.tsx                  # Contact form submittal page
│   ├── 📁 deals                      # Discount vouchers public route
│   │   └── page.tsx                  # Clipboard-copyable coupon list
│   ├── 📁 demo-accounts              # Free test trial credentials query route
│   │   └── page.tsx                  # Lists trial accounts
│   ├── 📁 favorites                  # Bookmark public route
│   │   └── page.tsx                  # Client-only localstorage favorites grid
│   ├── 📁 leaderboard                # High ranks performance public route
│   │   ├── LeaderboardClient.tsx     # Client logic and tabs for the leaderboard page
│   │   └── page.tsx                  # Displays top traders lists
│   ├── 📁 loyalty                    # Referral points public route
│   │   └── page.tsx                  # loyalty points info
│   ├── 📁 payouts                    # Payout gallery public route
│   │   ├── PayoutsClient.tsx         # Client logic for proofs gallery and uploader
│   │   └── page.tsx                  # Displays approved payouts proofs
│   ├── 📁 privacy-policy             # Policy guidelines folder
│   │   └── page.tsx                  # GDPR disclosures
│   ├── 📁 rules                      # Rules logs public route
│   │   └── page.tsx                  # Tabbed view: active rules, rules changelog, policies
│   ├── 📁 terms-and-conditions       # Legal folder
│   │   └── page.tsx                  # Platform agreement terms
│   ├── 📁 transparency               # aggregator policy statements route
│   │   └── page.tsx                  # Audit metrics
│   ├── layout.tsx                    # Shell layout (HTML wrapper, Fonts loader, toast notifier)
│   └── page.tsx                      # Homepage root page. Resolves landing sections.
├── 📁 components                     # Shared React components library
│   ├── 📁 home                       # Landing page-specific visual modules
│   │   ├── Hero3D.tsx                # Client Canvas Wrapper for 3D graphic layers
│   │   ├── Hero3DCanvas.tsx          # Three.js fiber mesh rendering the revolving particle globe
│   │   ├── asset-filter-bar.tsx      # Toggles dynamic active category segments
│   │   ├── blog-preview.tsx          # Card row displaying latest blog uploads
│   │   ├── cursor-glow.tsx           # Tracked custom glowing background radial cursor halo
│   │   ├── event-popup.tsx           # Interactive entry popup modal for tournaments
│   │   ├── explainer-cards.tsx       # Features cards detailing platform offerings
│   │   ├── faq.tsx                   # Interactive accordions answers listing
│   │   ├── featured-deals.tsx        # Side-scroll list of active coupon cards
│   │   ├── featured-firms.tsx        # High-tier glassmorphic details showcase
│   │   ├── hero.tsx                  # Landing hero details container
│   │   ├── home-best-sellers.tsx     # Highlight grid for highly-rated challenges
│   │   ├── home-challenges.tsx       # Highlights evaluation challenges lists
│   │   ├── home-fav-firms.tsx        # Quick actions carousel for bookmarked items
│   │   ├── live-tickers.tsx          # Scrolling top ticker strip displaying current spreads
│   │   ├── logo-marquee.tsx          # Infinite loop animation scrolling verified logos
│   │   ├── newsletter.tsx            # Email subscriber input form
│   │   ├── prop-globe.tsx            # 2.5D dynamic rotating globe featuring the 6 customizable slots
│   │   └── trust-stats.tsx           # Displays platform credibility parameters
│   ├── 📁 nav                        # Navigation components
│   │   └── nav-bar.tsx               # Neon blur floating header navbar and hamburger drawer
│   ├── 📁 ui                         # Shadcn-based / custom design system elements
│   │   ├── afx-button.tsx            # Styled action buttons with premium click actions
│   │   ├── afx-card.tsx              # Standardized transparent glass cards
│   │   ├── firm-link.tsx             # Shared navigation links router
│   │   ├── form-input.tsx            # Input element field layout
│   │   └── notification-toast.tsx    # Flash toast alert manager
│   └── footer.tsx                    # Shared links footer with category tags
├── 📁 docs                           # Deployment and configuration checklists (ignored)
├── 📁 lib                            # Business logic layer
│   ├── 📁 firebase                   # Firestore connectivity and server side API modules
│   │   ├── admin.ts                  # Initializes Firebase Admin SDK server context
│   │   ├── client.ts                 # Initializes Client SDK context
│   │   └── server.ts                 # server side data query methods, cache layer, mock data
│   └── 📁 utils                      # Code helpers
│       ├── logo-url.ts               # Name-matching logo fallback resolution algorithm
│       └── utils.ts                  # Class merge utility (cn) combining clsx and tailwind-merge
├── 📁 public                         # Static public assets (SVGs, logos, icons)
├── 📁 reports                        # Documentation and audit metrics
│   └── final-project-audit-report.md # THIS FILE (Aggregated platform audit report)
├── 📁 scripts                        # Data script helpers
├── 📁 supabase                       # Supabase mock/local database variables (if loaded)
├── .env.local                        # Firestore credential variables & server local flags
├── .gitignore                        # Version control ignored file paths
├── components.json                   # UI configuration tokens for Shadcn
├── next-env.d.ts                     # Typescript next references file
├── next.config.mjs                   # Next.js configuration rules (ISR timeouts, image domains)
├── postcss.config.mjs                # PostCSS parameters and plugins configuration
├── pnpm-lock.yaml                    # Package lock file mapping exact dependency trees
├── tsconfig.json                     # Typescript guidelines (aliases resolution paths)
└── tsconfig.tsbuildinfo              # Typescript cache details
```

---

## 4. Advanced Technical Implementation Details

### A. Caching Architecture & Manual Revalidation
Reads from Google Firestore can become slow and costly. To mitigate this, the platform implements a high-performance **Server Caching Layer** inside `lib/firebase/server.ts` using a scoped memory mapping:
```typescript
const cache = new Map<string, { value: any; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 10 // 10 Minutes TTL

export async function withCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key)
  const now = Date.now()
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.value as T
  }
  const fresh = await fetcher()
  cache.set(key, { value: fresh, timestamp: now })
  return fresh
}
```
Whenever an administrator updates records through the panel, the endpoints trigger Next.js cache purging:
- `clearServerCache()` clears the node memory cache map.
- `revalidatePath('/', 'layout')` and `revalidatePath('/firms', 'layout')` bust the Next.js static generation cache so updates propagate instantly.

### B. Logo URL Resolution Hierarchy
Firms often change their logos, or dynamic page nodes reference names without custom images. `lib/utils/logo-url.ts` uses a robust priority system to resolve these paths:
1. **Direct Valid URL**: If the url field starts with `http` or `/` (and is not a bad domain placeholder), return it.
2. **Name-Based Local/GCS Fallbacks**: Checks string inclusions (e.g. `'ftmo'` or `'topstep'`) and serves optimized Google Cloud Storage PNG URLs.
3. **Generic Slug Fallback**: Parses the name to a slug and serves a fallback icon from GCS.

### C. 3D Rotating Globe Slot Engine
The homepage features a holographic revolving globe inside `components/home/prop-globe.tsx`.
- **Canvas Rendering**: An animated canvas draws latitude/longitude lines projecting them in 3D using cosine/sine rotation calculations.
- **SVG Connections**: An SVG overlay matches the projected positions and draws dotted connective vectors between the center globe and slot coordinates.
- **Dynamic Slots**: Mapped directly to the page builder configurations (`globe_nodes` JSON payload). Clicking a slot routes the user to the `node.href` target configured in Page Builder, falling back safely to default properties.

---

## 5. Security Boundaries Check

- **Dashboard Auth Shield**: `app/admin/layout.tsx` validates credentials before rendering administrative components. If a session is invalid, it intercepts the request and routes the user to `/auth/login`.
- **API Protection**: Admin-specific endpoints verify session hashes to prevent unauthorized database writes.

---

## 6. Audit Verdict

Following full compilation, type verification checks (`tsc --noEmit` resolved successfully), and UI alignment checks, the Anuraj FX platform is **fully optimized and launch-ready**.

<!-- GOAL_COMPLETE -->
