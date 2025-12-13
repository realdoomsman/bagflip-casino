'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Hero({ onPlayNow }: { onPlayNow: () => void }) {
  const [stats, setStats] = useState({ totalGames: 0, totalVolume: '0', players: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const response = await fetch(backendUrl + '/api/stats')
        const data = await response.json()
        setStats({
          totalGames: data.totalGames || 0,
          totalVolume: data.treasurySize || '0 SOL',
          players: data.uniquePlayers || 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="py-20">
      {/* Main Hero Content */}
      <div className="text-center mb-16">
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/5 border border-neon-green/20 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-sm font-medium text-neon-green">Verified on Solana</span>
        </motion.div>

        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-white"
        >
          BagFlip
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-medium mb-3 text-white/80"
        >
          Provably Fair Gaming on Solana
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-base text-text-secondary mb-10 max-w-lg mx-auto"
        >
          Every game uses Switchboard VRF for verifiable randomness. 
          All results are recorded on-chain and can be independently verified.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={onPlayNow}
            className="px-8 py-3.5 text-base font-semibold bg-white text-black rounded-xl hover:bg-white/90 transition-all duration-300 min-w-[180px]"
          >
            Start Playing
          </button>
          <a
            href="https://solscan.io"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 text-base font-semibold border border-white/20 text-white/80 rounded-xl hover:bg-white/5 transition-all duration-300 min-w-[180px]"
          >
            View Contract
          </a>
        </motion.div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-3 gap-6 max-w-3xl mx-auto"
      >
        <div className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="text-3xl font-bold text-white mb-1">{stats.totalGames.toLocaleString()}</div>
          <div className="text-sm text-text-secondary">Games Played</div>
        </div>
        <div className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="text-3xl font-bold text-white mb-1">{stats.totalVolume}</div>
          <div className="text-sm text-text-secondary">Total Volume</div>
        </div>
        <div className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="text-3xl font-bold text-white mb-1">50%</div>
          <div className="text-sm text-text-secondary">Win Rate</div>
        </div>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap justify-center gap-8 mt-12 text-text-secondary text-sm"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-neon-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Audited Smart Contract</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-neon-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Switchboard VRF</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-neon-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Instant Payouts</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-neon-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Open Source</span>
        </div>
      </motion.div>
    </div>
  )
}
