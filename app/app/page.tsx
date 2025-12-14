'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import CoinFlip from '@/components/games/CoinFlip'
import DiceGame from '@/components/games/DiceGame'
import EvenOdd from '@/components/games/EvenOdd'

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)
const WalletBalance = dynamic(() => import('@/components/WalletBalance'), { ssr: false })

export default function Home() {
  const { connected } = useWallet()
  const [activeGame, setActiveGame] = useState<'flip' | 'dice' | 'evenodd'>('flip')

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold tracking-tight text-white">
                bag<span className="text-emerald-400">flip</span>
              </Link>
              <div className="hidden sm:flex items-center gap-1">
                <Link href="/" className="px-4 py-2 text-sm text-white rounded-lg bg-white/5">Play</Link>
                <Link href="/how-it-works" className="px-4 py-2 text-sm text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition">How it Works</Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {connected && <WalletBalance />}
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          {/* Game Selector */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[
              { id: 'flip', label: 'Coin Flip' },
              { id: 'dice', label: 'Dice' },
              { id: 'evenodd', label: 'Even/Odd' }
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveGame(g.id as any)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeGame === g.id
                    ? 'bg-emerald-500 text-white'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Game Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGame}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {!connected ? (
                <div className="bg-[#151515] rounded-2xl border border-white/5 p-8 sm:p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">Connect Wallet</h2>
                  <p className="text-white/40 text-sm mb-6">Connect your Solana wallet to start playing</p>
                  <WalletMultiButton />
                </div>
              ) : (
                <>
                  {activeGame === 'flip' && <CoinFlip />}
                  {activeGame === 'dice' && <DiceGame />}
                  {activeGame === 'evenodd' && <EvenOdd />}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Info */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/30">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Provably Fair</span>
            </div>
            <div>1.96x Payout</div>
            <div>50/50 Odds</div>
          </div>
        </div>
      </main>

      {/* Mobile Nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-white/5 px-6 py-3 z-50">
        <div className="flex items-center justify-around">
          <Link href="/" className="flex flex-col items-center gap-1 text-emerald-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-[10px]">Play</span>
          </Link>
          <Link href="/how-it-works" className="flex flex-col items-center gap-1 text-white/40">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px]">Info</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
