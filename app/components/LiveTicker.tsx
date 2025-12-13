'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function LiveTicker() {
  const [stats, setStats] = useState<string[]>(['Loading...', 'Loading...'])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(backendUrl + '/api/stats')
      const data = await response.json()

      const statsArray = [
        `${data.totalGames || 0} games played`,
        `Treasury: ${data.treasurySize}`,
        `Biggest win: ${data.biggestWin}`,
        'Provably fair with Switchboard VRF',
      ]

      setStats([...statsArray, ...statsArray])
    } catch (error) {
      console.error('Error fetching ticker stats:', error)
    }
  }

  return (
    <div className="overflow-hidden py-3 border-y border-white/5">
      <motion.div
        animate={{ x: [0, -1920] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="flex gap-12 whitespace-nowrap"
      >
        {stats.map((stat, i) => (
          <span key={i} className="text-xs font-medium text-text-secondary">
            {stat}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
