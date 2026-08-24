/**
 * Normalization and scoring helpers for Prop Firm comparison radar graph and dense comparison terminal (CHG-009).
 */

export type MetricDirection =
  | 'HIGHER_IS_BETTER'
  | 'LOWER_IS_BETTER'
  | 'LESS_RESTRICTIVE_IS_BETTER'
  | 'MORE_FREQUENT_IS_BETTER'

export interface NormalizedMetric {
  key: string
  label: string
  rawValue: any
  displayValue: string
  score: number // 0 to 100
  direction: MetricDirection
}

/**
 * Utility to parse numbers safely from strings, currencies, percentages.
 */
export function parseCleanNumber(val: any, fallback = 0): number {
  if (typeof val === 'number') return isNaN(val) ? fallback : val
  if (!val) return fallback
  const cleaned = String(val).replace(/[^0-9.]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? fallback : parsed
}

/**
 * Normalizes Profit Split % (Direction: HIGHER_IS_BETTER)
 * Range: typically 70% to 100%
 * Score: 70% -> 50, 80% -> 70, 90% -> 90, 100% -> 100
 */
export function normalizeProfitSplit(rawSplit: any): { score: number; displayValue: string } {
  const split = parseCleanNumber(rawSplit, 80)
  if (split <= 0) {
    return { score: 50, displayValue: 'N/A' }
  }
  // Formula maps 50%-100% into score 20-100
  const score = Math.max(20, Math.min(100, Math.round(((split - 50) / 50) * 80 + 20)))
  return {
    score,
    displayValue: `${split}%`,
  }
}

/**
 * Normalizes Max Loss Limit / Drawdown (Direction: HIGHER_IS_BETTER)
 * In evaluation accounts, higher allowed drawdown gives trader more cushion before termination.
 * Range: typically 4% to 14%
 * Score: 4% -> 30, 6% -> 50, 8% -> 70, 10% -> 85, 12%+ -> 100
 */
export function normalizeMaxLoss(rawMaxLoss: any, isFutures = false, accountSize = 100000): { score: number; displayValue: string } {
  if (rawMaxLoss === undefined || rawMaxLoss === null || rawMaxLoss === '') {
    return { score: 50, displayValue: 'N/A' }
  }

  let lossPct = 0
  let displayValue = ''

  if (isFutures) {
    const rawNum = parseCleanNumber(rawMaxLoss, 5000)
    lossPct = accountSize > 0 ? (rawNum / accountSize) * 100 : 5
    displayValue = `$${rawNum.toLocaleString()}`
  } else {
    lossPct = parseCleanNumber(rawMaxLoss, 10)
    displayValue = `${lossPct}%`
  }

  // Map 3% - 12% into score 25 - 100
  const score = Math.max(20, Math.min(100, Math.round(((lossPct - 3) / 9) * 75 + 25)))
  return {
    score,
    displayValue,
  }
}

/**
 * Normalizes Consistency Rule (Direction: LESS_RESTRICTIVE_IS_BETTER)
 * Less restrictive rule = higher trader freedom = higher score.
 * "No Rule" / "None" -> 100 score
 * "50% Rule" -> 60 score
 * "30% Rule" -> 40 score
 */
export function normalizeConsistency(rawConsistency: any): { score: number; displayValue: string } {
  if (!rawConsistency) {
    return { score: 100, displayValue: 'No Rule' }
  }

  const str = String(rawConsistency).trim().toLowerCase()

  if (
    str === 'none' ||
    str === 'no' ||
    str === 'no rule' ||
    str === 'false' ||
    str === '0' ||
    str === '0%' ||
    str.includes('no rule') ||
    str.includes('none')
  ) {
    return { score: 100, displayValue: 'No Rule' }
  }

  // If numeric consistency constraint, e.g. 40% rule
  const pct = parseCleanNumber(str, 0)
  if (pct > 0) {
    // 50% rule is less restrictive than 30% rule
    const score = Math.max(30, Math.min(85, Math.round(pct * 1.2)))
    return { score, displayValue: `${pct}% Rule` }
  }

  return { score: 65, displayValue: String(rawConsistency) }
}

/**
 * Normalizes Min Trading Days (Direction: LOWER_IS_BETTER)
 * Fewer minimum required days = faster funding = higher score.
 * 0 days (No min) -> 100 score
 * 1-3 days -> 85 score
 * 5 days -> 70 score
 * 10 days -> 45 score
 * 15+ days -> 25 score
 */
export function normalizeMinTradingDays(rawDays: any): { score: number; displayValue: string } {
  if (rawDays === undefined || rawDays === null || rawDays === '') {
    return { score: 100, displayValue: '0 Days' }
  }

  const days = parseCleanNumber(rawDays, 0)
  if (days <= 0) {
    return { score: 100, displayValue: '0 Days (No Min)' }
  }

  // Inverse normalization: 0 days -> 100, 10 days -> 50, 20 days -> 20
  const score = Math.max(20, Math.min(100, Math.round(100 - days * 4.5)))
  return {
    score,
    displayValue: `${days} ${days === 1 ? 'Day' : 'Days'}`,
  }
}

/**
 * Normalizes Payout Frequency (Direction: MORE_FREQUENT_IS_BETTER)
 * More frequent payout = higher score.
 * Daily / On Demand -> 100
 * Weekly / 7 Days -> 85
 * Bi-weekly / 14 Days -> 70
 * Monthly / 30 Days -> 45
 */
export function normalizePayoutFrequency(rawFreq: any): { score: number; displayValue: string } {
  if (!rawFreq) {
    return { score: 70, displayValue: 'Bi-weekly' }
  }

  const str = String(rawFreq).toLowerCase()

  if (str.includes('daily') || str.includes('demand') || str.includes('instant') || str.includes('1 day')) {
    return { score: 100, displayValue: 'Daily / On-Demand' }
  }
  if (str.includes('weekly') || str.includes('7 day')) {
    return { score: 85, displayValue: 'Weekly' }
  }
  if (str.includes('bi-weekly') || str.includes('biweekly') || str.includes('14 day') || str.includes('14-day') || str.includes('2 week')) {
    return { score: 70, displayValue: 'Bi-weekly' }
  }
  if (str.includes('monthly') || str.includes('30 day') || str.includes('4 week')) {
    return { score: 45, displayValue: 'Monthly' }
  }

  return { score: 65, displayValue: String(rawFreq) }
}

/**
 * Normalizes all 5 radar graph metrics deterministically.
 */
export function getRadarComparisonMetrics(firm: any, challenge: any, isFutures = false): NormalizedMetric[] {
  const accountSize = parseCleanNumber(challenge?.account_size, 100000)

  // 1. Profit Split %
  const splitRaw = challenge?.profit_split_percent || challenge?.profit_split_pct || firm?.profit_split_custom || 80
  const splitNorm = normalizeProfitSplit(splitRaw)

  // 2. Max Loss Limit
  const lossRaw = isFutures
    ? (challenge?.max_loss ?? (accountSize * 0.05))
    : (challenge?.max_loss_pct ?? firm?.rules?.max_loss ?? firm?.rules?.max_drawdown ?? 10)
  const lossNorm = normalizeMaxLoss(lossRaw, isFutures, accountSize)

  // 3. Consistency
  const consistencyRaw =
    challenge?.consistency_eval_percent ||
    firm?.rules?.consistency_rule ||
    firm?.rules?.consistency_rule_percent ||
    'No Rule'
  const consistencyNorm = normalizeConsistency(consistencyRaw)

  // 4. Min Trading Days
  const daysRaw =
    challenge?.min_trading_days ??
    firm?.rules?.min_trading_days ??
    0
  const daysNorm = normalizeMinTradingDays(daysRaw)

  // 5. Payout Frequency
  const freqRaw = challenge?.payout_freq || firm?.payout_custom || 'Bi-weekly'
  const freqNorm = normalizePayoutFrequency(freqRaw)

  return [
    {
      key: 'profit_split',
      label: 'Profit Split',
      rawValue: splitRaw,
      displayValue: splitNorm.displayValue,
      score: splitNorm.score,
      direction: 'HIGHER_IS_BETTER',
    },
    {
      key: 'max_loss',
      label: isFutures ? 'Max Loss' : 'Max Loss Limit',
      rawValue: lossRaw,
      displayValue: lossNorm.displayValue,
      score: lossNorm.score,
      direction: 'HIGHER_IS_BETTER',
    },
    {
      key: 'consistency',
      label: 'Consistency',
      rawValue: consistencyRaw,
      displayValue: consistencyNorm.displayValue,
      score: consistencyNorm.score,
      direction: 'LESS_RESTRICTIVE_IS_BETTER',
    },
    {
      key: 'min_days',
      label: 'Min Trading Days',
      rawValue: daysRaw,
      displayValue: daysNorm.displayValue,
      score: daysNorm.score,
      direction: 'LOWER_IS_BETTER',
    },
    {
      key: 'payout_freq',
      label: 'Payout Frequency',
      rawValue: freqRaw,
      displayValue: freqNorm.displayValue,
      score: freqNorm.score,
      direction: 'MORE_FREQUENT_IS_BETTER',
    },
  ]
}

/**
 * Extracts normalized boolean rule flags with deterministic fallbacks.
 */
export function extractFirmRuleFlags(firm: any, challenge?: any) {
  const firmRules = firm?.rules || {}

  // News Trading
  const newsRaw = firmRules.news_trading_allowed ?? firmRules.news_trading ?? firm?.news_trading_allowed ?? true
  const newsAllowed = newsRaw === true || String(newsRaw).toLowerCase() === 'yes' || newsRaw === 1

  // Overnight Holding
  const overnightRaw =
    firmRules.overnight_holding_allowed ??
    firmRules.overnight_holding ??
    firm?.overnight_holding_allowed ??
    true
  const overnightAllowed = overnightRaw === true || String(overnightRaw).toLowerCase() === 'yes' || overnightRaw === 1

  // Weekend Holding
  const weekendRaw =
    firmRules.weekend_holding_allowed ??
    firmRules.weekend_holding ??
    firm?.weekend_holding_allowed ??
    (firm?.type === 'prop_firm' ? true : false)
  const weekendAllowed = weekendRaw === true || String(weekendRaw).toLowerCase() === 'yes' || weekendRaw === 1

  // EA Trading
  const eaRaw = firmRules.ea_allowed ?? firmRules.ea_trading ?? firm?.ea_allowed ?? true
  const eaAllowed = eaRaw === true || String(eaRaw).toLowerCase() === 'yes' || eaRaw === 1

  // Algo Trading (defaults to EA trading status)
  const algoRaw =
    firmRules.algo_trading_allowed ??
    firmRules.algo_trading ??
    firm?.algo_trading_allowed ??
    eaAllowed
  const algoAllowed = algoRaw === true || String(algoRaw).toLowerCase() === 'yes' || algoRaw === 1

  return {
    newsAllowed,
    overnightAllowed,
    weekendAllowed,
    eaAllowed,
    algoAllowed,
  }
}
