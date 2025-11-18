'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LeaderboardEntry {
  player: string
  total_won: number
  total_games: number
  win_rate: number
  rank: number
}

interface DailyStats {
  biggest_win_today: { player: string; amount: number; game: string }
  biggest_loss_today: { player: string; amount: number; game: string }
  highest_win_streak: { player: string; streak: number }
  highest_wager: { player: string; amount: number; game: string }
  house_profit_loss: number
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'daily'>('leaderboard')

  useEffect(() => {
    fetchLeaderboard()
    fetchDailyStats()
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLeaderboard()
      fetchDailyStats()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(`${backendUrl}/api/leaderboard?limit=100`)
      const data = await response.json()
      setLeaderboard(data)
      setLoading(false)
    } catch (error) {
      console.error('[LEADERBOARD] Error fetching:', error)
      setLoading(false)
    }
  }

  const fetchDailyStats = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(`${backendUrl}/api/daily-stats`)
      const data = await response.json()
      setDailyStats(data)
    } catch (error) {
      console.error('[DAILY STATS] Error fetching:', error)
    }
  }

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M`
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`
    return amount.toString()
  }

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-5xl font-black text-neon-purple neon-glow mb-2">LEADERBOARD</h2>
        <p className="text-text-secondary text-lg">Top players and daily highlights</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-4 rounded-xl font-bold transition ${
            activeTab === 'leaderboard'
              ? 'bg-neon-purple text-dark-bg'
              : 'glass-panel hover:bg-white/10'
          }`}
        >
          🏆 Top Players
        </button>
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex-1 py-4 rounded-xl font-bold transition ${
            activeTab === 'daily'
              ? 'bg-neon-blue text-dark-bg'
              : 'glass-panel hover:bg-white/10'
          }`}
        >
          📊 Daily Stats
        </button>
      </div>

      {/* Content */}
      {activeTab === 'leaderboard' ? (
        <div className="glass-panel rounded-3xl p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <div className="text-text-secondary">Loading leaderboard...</div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎮</div>
              <div className="text-text-secondary">No players yet. Be the first!</div>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.slice(0, 100).map((entry, index) => (
                <motion.div
                  key={entry.player}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`flex items-center gap-4 p-4 rounded-xl transition ${
                    entry.rank <= 3
                      ? 'bg-gradient-to-r from-neon-purple/20 to-transparent border border-neon-purple/30'
                      : 'glass-panel hover:bg-white/5'
                  }`}
                >
                  {/* Rank */}
                  <div className="text-2xl font-black w-16 text-center">
                    {getRankEmoji(entry.rank)}
                  </div>

                  {/* Player */}
                  <div className="flex-1">
                    <div className="font-mono text-sm text-text-secondary">
                      {entry.player.slice(0, 6)}...{entry.player.slice(-4)}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      {entry.total_games} games • {entry.win_rate.toFixed(1)}% win rate
                    </div>
                  </div>

                  {/* Total Won */}
                  <div className="text-right">
                    <div className="text-2xl font-black text-neon-green">
                      {formatAmount(entry.total_won)}
                    </div>
                    <div className="text-xs text-text-secondary">$FLIP won</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Biggest Win Today */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">🎉</div>
              <div>
                <div className="text-lg font-black text-neon-green">Biggest Win Today</div>
                <div className="text-xs text-text-secondary">Largest single win</div>
              </div>
            </div>
            {dailyStats?.biggest_win_today ? (
              <div>
                <div className="text-3xl font-black text-neon-green mb-2">
                  +{formatAmount(dailyStats.biggest_win_today.amount)} $FLIP
                </div>
                <div className="text-sm text-text-secondary">
                  {dailyStats.biggest_win_today.player.slice(0, 6)}...{dailyStats.biggest_win_today.player.slice(-4)}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  on {dailyStats.biggest_win_today.game}
                </div>
              </div>
            ) : (
              <div className="text-text-secondary">No wins yet today</div>
            )}
          </div>

          {/* Biggest Loss Today */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">💀</div>
              <div>
                <div className="text-lg font-black text-red-500">Biggest Loss Today</div>
                <div className="text-xs text-text-secondary">Largest single loss</div>
              </div>
            </div>
            {dailyStats?.biggest_loss_today ? (
              <div>
                <div className="text-3xl font-black text-red-500 mb-2">
                  -{formatAmount(dailyStats.biggest_loss_today.amount)} $FLIP
                </div>
                <div className="text-sm text-text-secondary">
                  {dailyStats.biggest_loss_today.player.slice(0, 6)}...{dailyStats.biggest_loss_today.player.slice(-4)}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  on {dailyStats.biggest_loss_today.game}
                </div>
              </div>
            ) : (
              <div className="text-text-secondary">No losses yet today</div>
            )}
          </div>

          {/* Highest Win Streak */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">🔥</div>
              <div>
                <div className="text-lg font-black text-neon-blue">Highest Win Streak</div>
                <div className="text-xs text-text-secondary">Consecutive wins</div>
              </div>
            </div>
            {dailyStats?.highest_win_streak ? (
              <div>
                <div className="text-3xl font-black text-neon-blue mb-2">
                  {dailyStats.highest_win_streak.streak} wins
                </div>
                <div className="text-sm text-text-secondary">
                  {dailyStats.highest_win_streak.player.slice(0, 6)}...{dailyStats.highest_win_streak.player.slice(-4)}
                </div>
              </div>
            ) : (
              <div className="text-text-secondary">No streaks yet today</div>
            )}
          </div>

          {/* Highest Wager */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">💰</div>
              <div>
                <div className="text-lg font-black text-neon-purple">Highest Wager</div>
                <div className="text-xs text-text-secondary">Biggest bet today</div>
              </div>
            </div>
            {dailyStats?.highest_wager ? (
              <div>
                <div className="text-3xl font-black text-neon-purple mb-2">
                  {formatAmount(dailyStats.highest_wager.amount)} $FLIP
                </div>
                <div className="text-sm text-text-secondary">
                  {dailyStats.highest_wager.player.slice(0, 6)}...{dailyStats.highest_wager.player.slice(-4)}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  on {dailyStats.highest_wager.game}
                </div>
              </div>
            ) : (
              <div className="text-text-secondary">No wagers yet today</div>
            )}
          </div>

          {/* House Profit/Loss */}
          <div className="glass-panel rounded-2xl p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">🏦</div>
              <div>
                <div className="text-lg font-black">House Profit/Loss Today</div>
                <div className="text-xs text-text-secondary">Net treasury change</div>
              </div>
            </div>
            {dailyStats && (
              <div>
                <div className={`text-4xl font-black mb-2 ${
                  dailyStats.house_profit_loss >= 0 ? 'text-neon-green' : 'text-red-500'
                }`}>
                  {dailyStats.house_profit_loss >= 0 ? '+' : ''}
                  {formatAmount(Math.abs(dailyStats.house_profit_loss))} $FLIP
                </div>
                <div className="text-sm text-text-secondary">
                  {dailyStats.house_profit_loss >= 0 ? 'House is winning today' : 'Players are winning today'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
