'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import CoinFlip from '@/components/games/CoinFlip'
import DiceGame from '@/components/games/DiceGame'
import EvenOdd from '@/components/games/EvenOdd'

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

export default function Home() {
  const { connected } = useWallet()
  const [activeGame, setActiveGame] = useState<'flip' | 'dice' | 'evenodd'>('flip')
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem('bagflip_welcome')
    if (!seen) setShowWelcome(true)
  }, [])

  const dismissWelcome = () => {
    localStorage.setItem('bagflip_welcome', '1')
    setShowWelcome(false)
  }

  const liveFeed = [
    '7B3 landed HEADS for 2.5 SOL',
    'xK9 won 1.2 SOL on Dice',
    'mP4 lost 0.5 SOL - unlucky',
    'Qz8 hit TAILS for 5 SOL!',
  ]

  return (
    <div className="min-h-screen bg-[#0a0f0f]">
      {/* Live Feed Ticker */}
      <div className="h-8 bg-[#0d1414] border-b border-white/5 overflow-hidden">
        <div className="h-full flex items-center gap-8 animate-marquee whitespace-nowrap px-4">
          {liveFeed.map((msg, i) => (
            <span key={i} className="text-xs text-white/40">
              <span className="text-cyan-400 mr-1">●</span> {msg}
            </span>
          ))}
          {liveFeed.map((msg, i) => (
            <span key={`dup-${i}`} className="text-xs text-white/40">
              <span className="text-cyan-400 mr-1">●</span> {msg}
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-white font-bold text-xl">BagFlip</span>
            </Link>

            {/* Game Tabs */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { id: 'flip', name: 'Coin Flip', icon: '🪙' },
                { id: 'dice', name: 'Dice', icon: '🎲' },
                { id: 'evenodd', name: 'Even/Odd', icon: '🔢' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGame(g.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeGame === g.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{g.icon}</span>
                  <span>{g.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/how-it-works" className="text-sm text-white/40 hover:text-white transition hidden sm:block">
              How it Works
            </Link>
            <WalletMultiButton />
          </div>
        </div>
      </header>

      {/* Mobile Game Tabs */}
      <div className="md:hidden flex gap-2 p-4 overflow-x-auto">
        {[
          { id: 'flip', name: 'Coin Flip', icon: '🪙' },
          { id: 'dice', name: 'Dice', icon: '🎲' },
          { id: 'evenodd', name: 'Even/Odd', icon: '🔢' },
        ].map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGame(g.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              activeGame === g.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-white/50 bg-white/5'
            }`}
          >
            <span>{g.icon}</span>
            <span>{g.name}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="max-w-lg mx-auto">
          {activeGame === 'flip' && <CoinFlip />}
          {activeGame === 'dice' && <DiceGame />}
          {activeGame === 'evenodd' && <EvenOdd />}
        </div>
      </main>

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111a1a] rounded-2xl p-8 max-w-md w-full border border-cyan-500/20 glow-cyan">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <div>
                <span className="text-white font-bold text-xl">BagFlip</span>
                <span className="text-cyan-400 text-sm ml-2">(Beta)</span>
              </div>
            </div>
            
            <p className="text-white/60 text-sm mb-6">
              BagFlip brings instant wagering to Solana. Pick your side, set your bet, and flip to win.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { num: '1', text: 'Choose heads or tails' },
                { num: '2', text: 'Set your wager amount' },
                { num: '3', text: 'Flip and win 1.96x' },
              ].map((step) => (
                <div key={step.num} className="text-center">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-sm">{step.num}</span>
                  </div>
                  <p className="text-xs text-white/50">{step.text}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <div className="text-white font-medium text-sm mb-1">Outcome:</div>
              <p className="text-xs text-white/50">If you win - you get 1.96x. If you lose - you lose your wager.</p>
            </div>

            <button 
              onClick={dismissWelcome}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-xl transition"
            >
              I'm ready to flip
            </button>

            <p className="text-[10px] text-white/30 text-center mt-4">
              By clicking this button, you agree to the terms of service and certify that you are over 18 years old.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
