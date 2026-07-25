import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

async function fetchYahooTicker(symbol: string) {
  try {
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 0 } // Bypass Next.js cache for direct cron updates
    })

    if (!res.ok) throw new Error(`Yahoo returned status ${res.status}`)
    const json = await res.json()
    const meta = json.chart?.result?.[0]?.meta
    if (!meta) throw new Error('Invalid Yahoo response format')

    const price = meta.regularMarketPrice
    const prevClose = meta.previousClose || price
    const change = price - prevClose
    const changePct = (change / prevClose) * 100

    return {
      price: Number(price),
      changePct: Number(changePct.toFixed(2))
    }
  } catch (e) {
    console.error(`Failed to fetch Yahoo ticker for ${symbol}:`, e)
    return null
  }
}

export async function POST() {
  try {
    // Fetch live market data from Yahoo Finance
    const [gold, nq, es] = await Promise.all([
      fetchYahooTicker('GC=F'),  // Gold futures (XAUUSD)
      fetchYahooTicker('NQ=F'),    // Nasdaq futures (NQ)
      fetchYahooTicker('ES=F')     // S&P 500 futures (ES)
    ])

    const results = []

    // 1. Update XAUUSD
    if (gold) {
      const docRef = db.collection('market_ticker').doc('XAUUSD')
      const docSnap = await docRef.get()
      let sparkline = [gold.price]
      if (docSnap.exists) {
        const data = docSnap.data()
        if (data?.sparkline) sparkline = [...data.sparkline, gold.price].slice(-6)
      }
      const data = {
        symbol: 'XAUUSD',
        price: gold.price,
        change_pct: gold.changePct,
        sparkline,
        updated_at: new Date().toISOString()
      }
      await docRef.set(data, { merge: true })
      results.push(data)
    }

    // 2. Update NQ
    if (nq) {
      const docRef = db.collection('market_ticker').doc('NQ')
      const docSnap = await docRef.get()
      let sparkline = [nq.price]
      if (docSnap.exists) {
        const data = docSnap.data()
        if (data?.sparkline) sparkline = [...data.sparkline, nq.price].slice(-6)
      }
      const data = {
        symbol: 'NQ',
        price: nq.price,
        change_pct: nq.changePct,
        sparkline,
        updated_at: new Date().toISOString()
      }
      await docRef.set(data, { merge: true })
      results.push(data)
    }

    // 3. Update ES
    if (es) {
      const docRef = db.collection('market_ticker').doc('ES')
      const docSnap = await docRef.get()
      let sparkline = [es.price]
      if (docSnap.exists) {
        const data = docSnap.data()
        if (data?.sparkline) sparkline = [...data.sparkline, es.price].slice(-6)
      }
      const data = {
        symbol: 'ES',
        price: es.price,
        change_pct: es.changePct,
        sparkline,
        updated_at: new Date().toISOString()
      }
      await docRef.set(data, { merge: true })
      results.push(data)
    }

    return NextResponse.json({
      success: true,
      message: 'Automatic pricing feed updated successfully!',
      results
    })
  } catch (error: any) {
    console.error('Failed to run automatic update:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
export async function GET() {
  return POST() // Allow GET triggers for convenience
}
