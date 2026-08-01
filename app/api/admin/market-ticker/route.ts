import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

const SEED_TICKERS = [
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

// GET: load tickers from database (or seed if empty)
export async function GET() {
  try {
    const snapshot = await db.collection('market_ticker').get()
    const tickers: any[] = []
    
    if (snapshot.empty) {
      // Seed initial mock tickers
      for (const t of SEED_TICKERS) {
        await db.collection('market_ticker').doc(t.symbol).set(t)
        tickers.push(t)
      }
    } else {
      snapshot.forEach((doc: any) => {
        tickers.push(doc.data())
      })
    }

    return NextResponse.json({ success: true, tickers })
  } catch (error: any) {
    console.error('Error loading tickers:', error)
    return NextResponse.json({ success: true, tickers: SEED_TICKERS })
  }
}

// POST: save overrides from admin panel
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { symbol, price, change_pct } = body

    if (!symbol || price === undefined || change_pct === undefined) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 })
    }

    const docRef = db.collection('market_ticker').doc(symbol)
    const docSnap = await docRef.get()
    
    let sparkline = [Number(price)]
    if (docSnap.exists) {
      const data = docSnap.data()
      if (data?.sparkline) {
        sparkline = [...data.sparkline, Number(price)].slice(-6)
      }
    }

    const updated = {
      symbol,
      price: Number(price),
      change_pct: Number(change_pct),
      sparkline
    }

    await docRef.set(updated, { merge: true })
    return NextResponse.json({ success: true, ticker: updated })
  } catch (error: any) {
    console.error('Error saving overrides:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
