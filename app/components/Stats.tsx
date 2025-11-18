'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface StatsData {
  treasurySize: string
  flipsToday: string
  biggestWin: string
  biggestLoss: string
}

export default function Stats() {
  const [stats, setStats] = useState<StatsData>({
    treasurySize: 'Loading...',
    flipsToday: 'Loading...',
    biggestWin: 'Loading...',
    biggestLoss: 'Loading...',
  })

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(backendUrl + '/api/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setStats({
        treasurySize: '0',
        flipsToday: '0',
        biggestWin: '0',
        biggestLoss: '0',
      })
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard label="Treasury Size" value={stats.treasurySize} color="text-neon-green" />
      <StatCard label="Flips Today" value={stats.flipsToday} color="text-neon-blue" />
      <StatCard label="Biggest Win" value={stats.biggestWin} color="text-neon-purple" />
      <StatCard label="Biggest Loss" value={stats.biggestLoss} color="text-red-500" />
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-panel p-5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
    >
      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{label}</div>
      <div className={`text-2xl font-black ${color}`}>{value}</div>
    </motion.div>
  )
}
