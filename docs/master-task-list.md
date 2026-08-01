# Master Task List — Anuraj FX Platform

Generated after Phase 1 (COMPARE) and Phase 2 (PLAN) analysis.

---

## P0 — Blocking Bugs (site is broken/unusable without these)

- [x] **Logo not updating after admin save** — `app/api/admin/firms/[id]/route.ts` and `app/api/admin/challenges/[id]/route.ts`: Add `revalidatePath` calls alongside `clearServerCache()` so Next.js ISR cache is busted after every PUT. Without this, admin logo changes don't reflect on public pages.
- [x] **Logo rendering broken for custom-uploaded logos on well-known firms** — `getCleanLogoUrl()` function (duplicated in 5 files): Extract to shared `lib/utils/logo-url.ts` utility; ensure name-based GCS overrides run ONLY when no valid custom URL is stored (currently already true in code structure, but the shared utility removes the risk of divergence).
- [x] **Country name appearing twice in challenge/firm pages** — `app/challenges/ChallengesClient.tsx`: Deduplicate category filter options using `Array.from(new Set(...map(...).flat()))`. Also fix the restricted-countries section in `app/firms/[slug]/page.tsx` so alt text vs visible text never duplicate country code AND name.
- [x] **Horizontal scroll appears on Firms page** — `app/firms/page.tsx`: The `overflow-x-auto` without `scrollbar-none` on the container causes visible scroll. Remove left-right scroll from the table wrapper on desktop by adding `scrollbar-none` class.

---

## P1 — Missing Core Features (present on reference, missing/broken here)

- [x] **FirmLink doesn't wrap firm name in Firms directory table** — `app/firms/page.tsx` line 378-380: Firm name `<h3>` is NOT wrapped in `<FirmLink>`. Every clickable element for a firm should route to `/firms/[slug]`. The "Firm" button in actions column IS wrapped, but the logo and name row are not — add click navigation to the row itself.
- [x] **ChallengeLink not used in challenges table** — `app/challenges/ChallengesClient.tsx`: The firm name in the challenges table (line 693-695) renders as plain `<span>`. Wrap with `<ChallengeLink>` so clicking firm name goes to `/firms/[slug]/challenges`.
- [x] **Logo size/fit: logos appear oversized or cut off in Firms directory** — `app/firms/page.tsx` and `app/challenges/ChallengesClient.tsx`: Logo containers should be `w-12 h-12` for firms table and `w-10 h-10` for challenges table, always with `object-contain p-1.5` and white bg. Ensure no overflow.
- [x] **Logo size/fit: logos appear oversized/cut off in Challenges page** — Same as above for challenges.

---

## P2 — Data/Content Depth Gaps

- [x] **Challenges page filter: category dropdown shows raw strings not deduplicated** — `ChallengesClient.tsx`: The category filter `<select>` should show unique values derived from `firms.flatMap(f => f.category || [])` deduplicated with `Set`.
- [x] **Firm detail — Instruments & Assets section uses hardcoded data** — `app/firms/[slug]/page.tsx` lines 103-116: Should read from `firm.instruments` or `firm.assets` array from Firestore, with fallback to the current hardcoded values.
- [x] **Firm detail — Commissions section is fully hardcoded** — Same file lines 180-188: Should read from `firm.commissions` text field, with existing text as fallback.
- [x] **Firm detail — Leverage/Contract Specs section is hardcoded** — Should read from `firm.leverage_params` or from the contract_specs Firestore collection.

---

## P3 — Nice-to-have additions

- [ ] **Dedicated `/compare` comparison tool** — Allows side-by-side comparison of 2-3 firms. Basic skeleton exists in `/compare` page.
- [ ] **`/rules` page** — Shows all firm rules with category filtering (exists at `/rules` already).
- [ ] **Best Sellers page improvements** — `/best-sellers` route exists but may lack real data.

---

## P4 — Performance & SEO

- [x] **Add `revalidatePath` to ALL admin PUT routes** — ensures ISR refresh on firm/challenge edits (this covers logo update bug AND perf).
- [ ] **Image optimization** — Replace `<img>` with Next.js `<Image>` component for logos to enable lazy loading and WebP conversion. (P4, non-critical)
- [ ] **Meta tags** — Already present on most pages. Audit `/firms/[slug]` layout for proper OG tags per firm. (partially done)
