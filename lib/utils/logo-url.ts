/**
 * Shared utility for resolving prop firm logo URLs.
 *
 * Priority order:
 * 1. If a valid custom URL is stored (http/https or local path, excluding known bad domains), use it.
 * 2. If no valid URL, use name-based GCS bucket fallback for well-known firms.
 * 3. Final fallback: slug-based GCS URL derived from firm name.
 */
export const getCleanLogoUrl = (name: string, url: string | null | undefined): string => {
  // Priority 1: Valid stored URL — always respect it, even for well-known firms
  if (
    url &&
    (url.startsWith('http') || url.startsWith('/')) &&
    !url.includes('images.unsplash.com') &&
    !url.includes('ftmo.com/wp-content/themes') &&
    !url.includes('the5ers.com/wp-content')
  ) {
    return url
  }

  // Priority 2: Name-based GCS fallbacks (only when no valid custom URL stored)
  const cleanName = (name || '').toLowerCase().trim()

  if (cleanName.includes('5%ers') || cleanName.includes('5ers') || cleanName.includes('the-5ers')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/the-5ers.png'
  }
  if (cleanName.includes('e8')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/e8-funding.png'
  }
  if (cleanName.includes('ftmo')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/ftmo.png'
  }
  if (cleanName.includes('myfundedfutures') || cleanName.includes('mffu')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/myfundedfutures.png'
  }
  if (cleanName.includes('alpha capital')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/alpha-capital-group.png'
  }
  if (cleanName.includes('take profit')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/take-profit-trader.png'
  }
  if (cleanName.includes('goat funded')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/goat-funded-trader.png'
  }
  if (cleanName.includes('apex')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/apex-trader-funding.png'
  }
  if (cleanName.includes('topstep') || cleanName.includes('top step')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/topstep.png'
  }
  if (cleanName.includes('funding pips') || cleanName.includes('fundingpips')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/funding-pips.png'
  }
  if (cleanName.includes('fundednext') || cleanName.includes('funded next')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/fundednext.png'
  }
  if (cleanName.includes('hola prime') || cleanName.includes('holaprime')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/hola-prime.png'
  }
  if (cleanName.includes('blue guardian')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/blue-guardian.png'
  }

  // Priority 3: Generic slug-based fallback
  const slug = (name || 'firm')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return `https://storage.googleapis.com/prop-firm-match-production-logos/${slug}.png`
}

/**
 * Identifies if a prop firm logo is known to have a dark background.
 * This is used to style the image container's background to match the logo (e.g. dark blue/black instead of stark white).
 */
export const isDarkLogo = (name: string | null | undefined): boolean => {
  if (!name) return false
  const clean = name.toLowerCase()
  return (
    clean.includes('5%ers') ||
    clean.includes('5ers') ||
    clean.includes('the-5ers') ||
    clean.includes('funding pips') ||
    clean.includes('fundingpips') ||
    clean.includes('take profit') ||
    clean.includes('myfundedfutures') ||
    clean.includes('mffu')
  )
}
