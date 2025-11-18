'use client'

import { ReactNode, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LiveFeed from '../LiveFeed'

function LiveFeedPanel() {
  return (
    <div className="glass-panel rounded-3xl p-6 sticky top-8 max-h-[600px] overflow-y-auto">
      <h3 className="text-2xl font-black mb-6 text-neon-blue neon-glow">
        Live Feed
      </h3>
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
  children 
}: GameLayoutProps) {
  const [internalMode, setInternalMode] = useState<'treasury' | 'pvp'>('treasury')
  const mode = externalMode ?? internalMode
  
  const [treasuryBalance, setTreasuryBalance] = useState(0)
  const [houseStats, setHouseStats] = useState({
    wins: 0,
    losses: 0,
    winRate: 0
  })

  // Fetch real treasury stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const response = await fetch(backendUrl + '/api/stats')
        const data = await response.json()
        
        // Parse treasury size (remove commas and convert)
        const treasuryStr = data.treasurySize.replace(/[^0-9.]/g, '')
        const treasury = parseFloat(treasuryStr) || 0
        setTreasuryBalance(treasury)
        
        setHouseStats({
          wins: data.houseWins || 0,
          losses: data.houseLosses || 0,
          winRate: parseFloat(data.houseWinRate) || 0
        })
      } catch (error) {
        console.error('Error fetching treasury stats:', error)
      }
    }
    
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  })

  const handleModeChange = (newMode: 'treasury' | 'pvp') => {
    if (onModeChange) {
      onModeChange(newMode)
    } else {
      setInternalMode(newMode)
    }
  }

  const adjustWager = (percent: number) => {
    const current = parseFloat(wager) || 0
    const newAmount = current * (1 + percent / 100)
    setWager(Math.floor(newAmount).toString())
  }

  const setMax = () => {
    setWager(balance.toString())
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
      {/* Left Panel - Wager Box (Desktop) / Bottom Drawer (Mobile) */}
      <div className="lg:col-span-3 order-3 lg:order-1">
        <div className="glass-panel rounded-3xl p-6 lg:sticky lg:top-8 fixed lg:relative bottom-0 left-0 right-0 lg:bottom-auto z-50 lg:z-auto max-h-[80vh] lg:max-h-none overflow-y-auto">
          <h3 className="text-2xl font-black mb-6 text-neon-green neon-glow">
            Place Wager
          </h3>

          {/* Wager Input */}
          <div className="mb-4">
            <label className="block text-sm text-text-secondary mb-2">Amount (SOL)</label>
            <input
              type="number"
              value={wager}
              onChange={(e) => setWager(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-4 bg-dark-panel border-2 border-neon-green/30 focus:border-neon-green outline-none text-2xl font-bold rounded-xl transition"
            />
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => adjustWager(-10)}
              className="py-2 glass-panel rounded-lg hover:bg-white/10 transition font-bold"
            >
              -10%
            </button>
            <button
              onClick={() => adjustWager(10)}
              className="py-2 glass-panel rounded-lg hover:bg-white/10 transition font-bold"
            >
              +10%
            </button>
            <button
              onClick={setMax}
              className="py-2 glass-panel rounded-lg hover:bg-white/10 transition font-bold text-neon-green"
            >
              MAX
            </button>
          </div>

          {/* Balance */}
          <div className="text-sm text-text-secondary mb-6">
            Your Balance: <span className="text-neon-green font-bold">{balance.toLocaleString()} SOL</span>
          </div>

          {/* Mode Selector */}
          <div className="mb-6">
            <label className="block text-sm text-text-secondary mb-2">Game Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleModeChange('treasury')}
                className={`py-3 rounded-xl font-bold transition ${
                  mode === 'treasury'
                    ? 'bg-neon-green text-dark-bg'
                    : 'glass-panel hover:bg-white/10'
                }`}
              >
                Treasury
              </button>
              <button
                onClick={() => handleModeChange('pvp')}
                className={`py-3 rounded-xl font-bold transition ${
                  mode === 'pvp'
                    ? 'bg-neon-blue text-dark-bg'
                    : 'glass-panel hover:bg-white/10'
                }`}
              >
                PvP
              </button>
            </div>
          </div>

          {/* Treasury Stats (only show in Treasury mode) */}
          {mode === 'treasury' && (
            <div className="mb-6 glass-panel rounded-xl p-4">
              <div className="text-xs text-text-secondary mb-2 uppercase font-bold">Treasury Info</div>
              
              {/* Treasury Balance */}
              <div className="mb-3">
                <div className="text-xs text-text-secondary">Treasury Balance</div>
                <div className="text-lg font-black text-neon-blue">
                  {treasuryBalance.toFixed(2)} SOL
                </div>
              </div>

              {/* House Stats */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-dark-panel rounded-lg p-2">
                  <div className="text-xs text-text-secondary">House Wins</div>
                  <div className="text-sm font-bold text-red-500">{houseStats.wins}</div>
                </div>
                <div className="bg-dark-panel rounded-lg p-2">
                  <div className="text-xs text-text-secondary">House Losses</div>
                  <div className="text-sm font-bold text-neon-green">{houseStats.losses}</div>
                </div>
              </div>

              {/* Win Rate */}
              <div className="mt-3 text-center">
                <div className="text-xs text-text-secondary">House Win Rate</div>
                <div className="text-sm font-bold text-neon-purple">{houseStats.winRate}%</div>
              </div>
            </div>
          )}

          {/* Play Button - Sticky on Mobile */}
          <motion.button
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            onClick={onPlay}
            disabled={disabled}
            className={`w-full py-4 text-xl font-black rounded-xl transition sticky bottom-4 lg:static ${
              disabled
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-neon-green text-dark-bg hover:shadow-2xl hover:shadow-neon-green/50'
            }`}
          >
            {disabled ? '🎲 PLAYING...' : '🎮 PLAY'}
          </motion.button>
        </div>
      </div>

      {/* Center Panel - Animation Area */}
      <div className="lg:col-span-6 order-1 lg:order-2 mb-[400px] lg:mb-0">
        <div className="glass-panel rounded-3xl p-4 lg:p-8 min-h-[400px] lg:min-h-[600px] flex flex-col">
          <h2 className="text-5xl font-black text-center mb-8 neon-glow text-neon-green">
            {title}
          </h2>
          <div className="flex-1 flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>

      {/* Right Panel - Live Feed */}
      <div className="lg:col-span-3 order-2 lg:order-3 hidden lg:block">
        <LiveFeedPanel />
      </div>
    </div>
  )
}
