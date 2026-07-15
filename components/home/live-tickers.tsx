'use client'

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface Ticker {
  symbol: string
  price: number
  change_pct: number
  sparkline: number[]
}

interface LiveTickersProps {
  tickers: Ticker[]
}

export function LiveTickers({ tickers }: LiveTickersProps) {
  return (
    <div className="bg-bg-surface/30 border-y border-border-subtle py-4 overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-text-secondary tracking-widest uppercase font-mono">
              LIVE MARKETS
            </span>
          </div>

          <div className="flex flex-1 justify-around gap-6 items-center w-full overflow-x-auto no-scrollbar py-1">
            {tickers.map((ticker) => {
              const isPositive = ticker.change_pct >= 0
              return (
                <div
                  key={ticker.symbol}
                  className="flex items-center gap-4 bg-bg-card/40 border border-border-subtle/50 px-4 py-2 rounded-xl backdrop-blur-sm hover:border-accent-cyan/20 transition-all min-w-[150px] justify-between"
                >
                  <div>
                    <span className="text-text-muted text-[10px] block font-mono font-semibold">
                      {ticker.symbol}
                    </span>
                    <span className="text-xs font-bold font-mono text-text-primary">
                      {ticker.price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div
                    className={`flex items-center text-[10px] font-mono font-bold ${
                      isPositive ? 'text-accent-green' : 'text-red-400'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                    )}
                    {isPositive ? '+' : ''}
                    {ticker.change_pct}%
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
export default LiveTickers
