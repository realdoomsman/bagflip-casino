'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function LiveTicker() {
  const [stats, setStats] = useState<string[]>([
    "Loading stats...",
    "Loading stats...",
  ])

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
        `Biggest win: ${data.biggestWin}`,
        `Treasury: ${data.treasurySize}`,
        `House wins: ${data.houseWins || 0}`,
      ]
      
      // Duplicate for seamless scrolling
      setStats([...statsArray, ...statsArray])
    } catch (error) {
      console.error('Error fetching ticker stats:', error)
    }
  }

  return (
    <div className="overflow-hidden py-5 border-y border-white/10 bg-black/20">
      <motion.div
        animate={{ x: [0, -1920] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-12 whitespace-nowrap"
      >
        {stats.map((stat, i) => (
          <span
            key={i}
            className="text-lg font-bold text-neon-green"
          >
            {stat}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
