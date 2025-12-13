'use client'

import { ReactNode, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LiveFeed from '../LiveFeed'

function LiveFeedPanel() {
  return (
    <div className="rounded-2xl p-5 sticky top-24 bg-white/[0.02] border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-xs text-text-secondary">Live</span>
        </div>
      </div>
      <LiveFeed />
    </div>
  )
}

interface GameLayoutProps {
  title: string
  wager: string
  setWager: (value: string) => void
  onPlay: () => void
  disabled: boolean
  balance?: number
  mode?: 'treasury' | 'pvp'
  onModeChange?: (mode: 'treasury' | 'pvp') => void
  children: ReactNode
}

export default function GameLayout({
  title,
  wager,
  setWager,
  onPlay,
  disabled,
  balance = 0,
  mode: externalMode,
  onModeChange,
  children,
}: GameLayoutProps) {
  const [internalMode, setInternalMode] = useState<'treasury' | 'pvp'>('treasury')
  const mode = externalMode ?? internalMode

  const [treasuryBalance, setTreasuryBalance] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const response = await fetch(backendUrl + '/api/stats')
        const data = await response.json()
        const treasuryStr = data.treasurySize.replace(/[^0-9.]/g, '')
        setTreasuryBalance(parseFloat(treasuryStr) || 0)
      } catch (error) {
        console.error('Error fetching treasury stats:', error)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleModeChange = (newMode: 'treasury' | 'pvp') => {
    if (onModeChange) {
      onModeChange(newMode)
    } else {
      setInternalMode(newMode)
    }
  }

  const setMax = () => {
    setWager(balance.toString())
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      {/* Left Panel - Wager Box */}
      <div className="lg:col-span-3 order-3 lg:order-1">
        <div className="rounded-2xl p-5 lg:sticky lg:top-24 fixed lg:relative bottom-0 left-0 right-0 lg:bottom-auto z-50 lg:z-auto max-h-[80vh] lg:max-h-none overflow-y-auto bg-white/[0.02] border border-white/5">
          <h3 className="text-sm font-semibold mb-4 text-white">Place Wager</h3>

          {/* Wager Input */}
          <div className="mb-4">
            <label className="block text-xs text-text-secondary mb-1.5">Amount (SOL)</label>
            <input
              type="number"
              value={wager}
              onChange={(e) => setWager(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-3 bg-white/[0.03] border border-white/10 focus:border-white/20 outline-none text-xl font-semibold rounded-xl transition"
            />
          </div>

          {/* Quick amounts */}
          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {[0.1, 0.5, 1, 5].map((amount) => (
              <button
                key={amount}
                onClick={() => setWager(amount.toString())}
                className="py-2 text-xs font-medium rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition"
              >
                {amount}
              </button>
            ))}
          </div>

          {/* Balance */}
          <div className="flex items-center justify-between text-sm mb-5 pb-5 border-b border-white/5">
            <span className="text-text-secondary">Balance</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{balance.toFixed(4)} SOL</span>
              <button onClick={setMax} className="text-xs text-neon-green hover:underline">
                Max
              </button>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="mb-5">
            <label className="block text-xs text-text-secondary mb-1.5">Mode</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleModeChange('treasury')}
                className={`py-2.5 rounded-lg text-sm font-medium transition ${
                  mode === 'treasury'
                    ? 'bg-white text-black'
                    : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.06]'
                }`}
              >
                Treasury
              </button>
              <button
                onClick={() => handleModeChange('pvp')}
                className={`py-2.5 rounded-lg text-sm font-medium transition ${
                  mode === 'pvp'
                    ? 'bg-white text-black'
                    : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.06]'
                }`}
              >
                PvP
              </button>
            </div>
          </div>

          {/* Treasury Info */}
          {mode === 'treasury' && (
            <div className="mb-5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Treasury</span>
                <span className="font-medium text-white">{treasuryBalance.toFixed(2)} SOL</span>
              </div>
            </div>
          )}

          {/* Play Button */}
          <motion.button
            whileHover={!disabled ? { scale: 1.01 } : {}}
            whileTap={!disabled ? { scale: 0.99 } : {}}
            onClick={onPlay}
            disabled={disabled}
            className={`w-full py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
              disabled
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            {disabled ? 'Processing...' : 'Place Bet'}
          </motion.button>

          {/* Provably fair note */}
          <div className="mt-4 flex items-center gap-2 text-xs text-text-secondary">
            <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Provably fair with VRF</span>
          </div>
        </div>
      </div>

      {/* Center Panel - Game Area */}
      <div className="lg:col-span-6 order-1 lg:order-2 mb-[300px] lg:mb-0">
        <div className="rounded-2xl p-6 lg:p-8 min-h-[400px] lg:min-h-[550px] flex flex-col bg-white/[0.02] border border-white/5">
          <h2 className="text-xl font-semibold text-center mb-6 text-white">{title}</h2>
          <div className="flex-1 flex items-center justify-center">{children}</div>
        </div>
      </div>

      {/* Right Panel - Live Feed */}
      <div className="lg:col-span-3 order-2 lg:order-3 hidden lg:block">
        <LiveFeedPanel />
      </div>
    </div>
  )
}
