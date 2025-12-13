'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import CoinFlip from '@/components/games/CoinFlip'
import DiceGame from '@/components/games/DiceGame'
import EvenOdd from '@/components/games/EvenOdd'
import WelcomeModal from '@/components/WelcomeModal'

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)
const WalletBalance = dynamic(() => import('@/components/WalletBalance'), { ssr: false })

export default function Home() {
  const { connected } = useWallet()
  const [activeGame, setActiveGame] = useState<'flip' | 'dice' | 'evenodd'>('flip')
  const [showWelcome, setShowWelcome] = useState(false)
  const [recentWins, setRecentWins] = useState<{addr: string, amount: number, won: boolean}[]>([])

  useEffect(() => {
    if (!localStorage.getItem('bagflip_visited')) {
      setShowWelcome(true)
      localStorage.setItem('bagflip_visited', 'true')
    }
    const fetchRecent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/live-feed?limit=5`)
        const data = await res.json()
        setRecentWins(data.map((g: any) => ({ addr: g.player1, amount: g.amount, won: g.won })))
      } catch {}
    }
    fetchRecent()
    const i = setInterval(fetchRecent, 5000)
    return () => clearInterval(i)
  }, [])

  return (
    <main className="min-h-screen">
      <AnimatePresence>{showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}</AnimatePresence>

      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowWelcome(true)}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <span className="text-lg font-bold text-white">B</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">BagFlip</span>
            </div>
            <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-xl border border-white/5">
              {[
                { id: 'flip', label: 'Coin Flip' },
                { id: 'dice', label: 'Dice' },
                { id: 'evenodd', label: 'Even/Odd' }
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGame(g.id as any)}
                  className={`tab ${activeGame === g.id ? 'tab-active' : ''}`}
                >
                  {g.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {connected && <WalletBalance />}
            <WalletMultiButton />
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Game */}
          <div className="lg:col-span-8">
            {/* Mobile tabs */}
            <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { id: 'flip', label: 'Coin Flip' },
                { id: 'dice', label: 'Dice' },
                { id: 'evenodd', label: 'Even/Odd' }
              ].map((g) => (
                <button key={g.id} onClick={() => setActiveGame(g.id as any)} className={`tab whitespace-nowrap ${activeGame === g.id ? 'tab-active' : ''}`}>
                  {g.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeGame} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {!connected ? (
                  <div className="card p-16 text-center">
                    <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center border border-violet-500/20">
                      <svg className="w-12 h-12 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h2>
                    <p className="text-white/40 mb-8">Connect a Solana wallet to start playing</p>
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-5">
            {/* Live */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="live-dot" />
                <span className="text-sm font-semibold text-white">Live Activity</span>
              </div>
              <div className="space-y-3">
                {recentWins.length === 0 ? (
                  <div className="text-sm text-white/30 text-center py-6">No recent games</div>
                ) : (
                  recentWins.map((w, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex items-center justify-center">
                          <span className="text-xs font-bold text-violet-300">{w.addr.slice(0,2)}</span>
                        </div>
                        <span className="text-sm text-white/60">{w.addr.slice(0,4)}...{w.addr.slice(-4)}</span>
                      </div>
                      <span className={`text-sm font-bold ${w.won ? 'text-green-400' : 'text-red-400'}`}>
                        {w.won ? '+' : '-'}{w.amount} SOL
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Provably Fair */}
            <div className="card p-5 border-violet-500/20 bg-violet-500/5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold text-violet-300">Provably Fair</span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed">
                All results verified by Switchboard VRF. Every outcome recorded on-chain.
              </p>
            </div>

            {/* Help */}
            <button onClick={() => setShowWelcome(true)} className="w-full card p-4 text-left hover:bg-white/[0.05] transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-violet-500/20 transition-all">
                  <svg className="w-5 h-5 text-white/40 group-hover:text-violet-400 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">How does it work?</div>
                  <div className="text-xs text-white/40">Learn about BagFlip</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-white/30">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">B</span>
            </div>
            <span>BagFlip</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <a href="#" className="hover:text-violet-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-violet-400 transition-colors">Privacy</a>
            <a href="https://github.com" target="_blank" className="hover:text-violet-400 transition-colors">GitHub</a>
            <a href="https://twitter.com" target="_blank" className="hover:text-violet-400 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
