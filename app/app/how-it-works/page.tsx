'use client'

import Link from 'next/link'

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#111"/>
    <path d="M8 8h6l4 6-4 6H8l4-6-4-6z" fill="#00ff88"/>
    <path d="M14 8h6l4 6-4 6h-6l4-6-4-6z" fill="#00ff88" fillOpacity="0.5"/>
    <circle cx="24" cy="16" r="3" fill="#00ff88"/>
  </svg>
)

export default function HowItWorks() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-[#0a0a0a]">
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3">
                <Logo />
                <span className="text-xl font-bold text-white">BagFlip</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Play</Link>
                <Link href="/how-it-works" className="text-sm font-medium text-white">How it Works</Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 px-6 lg:px-12 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-8">How BagFlip Works</h1>
        
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">What is BagFlip?</h2>
          <p className="text-white/60 leading-relaxed">
            BagFlip is a provably fair gambling platform built on Solana. You can bet SOL on simple games 
            like coin flips, dice rolls, and even/odd predictions. All outcomes are determined by 
            verifiable random functions (VRF) on-chain.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">How to Play</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#00ff88]">1</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Connect Your Wallet</h3>
                <p className="text-white/50 text-sm">Connect any Solana wallet like Phantom, Solflare, or Backpack.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#00ff88]">2</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Choose a Game</h3>
                <p className="text-white/50 text-sm">Pick from Coin Flip, Dice, or Even/Odd. All games have 50/50 odds.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#00ff88]">3</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Place Your Bet</h3>
                <p className="text-white/50 text-sm">Enter your wager amount in SOL and make your prediction.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#00ff88]">4</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Win or Lose</h3>
                <p className="text-white/50 text-sm">If you win, you get 1.96x your bet. Results are instant and verifiable.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Provably Fair</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            Every game result is generated using Solana VRF (Verifiable Random Function). This means:
          </p>
          <ul className="space-y-2 text-white/50 text-sm">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Results cannot be manipulated by anyone</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Every outcome can be verified on-chain</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>True 50/50 odds on all games</span>
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Payout</h2>
          <div className="bg-[#111] border border-white/10 rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white/50">Win Multiplier</span>
              <span className="text-[#00ff88] font-bold text-lg">1.96x</span>
            </div>
            <p className="text-white/40 text-sm">
              Win and you get 1.96x your wager. The 2% difference covers transaction fees and platform costs.
            </p>
          </div>
        </section>

        <Link href="/" className="inline-flex items-center gap-2 bg-[#00ff88] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#00cc6a] transition-colors">
          Start Playing
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/10 px-6 py-3">
        <div className="flex items-center justify-around">
          <Link href="/" className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs text-white/40">Play</span>
          </Link>
          <Link href="/how-it-works" className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-[#00ff88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-[#00ff88]">Info</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
