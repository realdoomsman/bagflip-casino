'use client'

import Link from 'next/link'

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold tracking-tight text-white">
                bag<span className="text-emerald-400">flip</span>
              </Link>
              <div className="hidden sm:flex items-center gap-1">
                <Link href="/" className="px-4 py-2 text-sm text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition">Play</Link>
                <Link href="/how-it-works" className="px-4 py-2 text-sm text-white rounded-lg bg-white/5">How it Works</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">How it Works</h1>
          <p className="text-white/50 mb-10">Simple, fair, on-chain gambling</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Connect Wallet</h2>
              <p className="text-white/50 text-sm leading-relaxed">
                Connect any Solana wallet (Phantom, Solflare, Backpack, etc.) to get started.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. Pick a Game</h2>
              <p className="text-white/50 text-sm leading-relaxed">
                Choose from Coin Flip, Dice, or Even/Odd. All games have true 50/50 odds.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Place Your Bet</h2>
              <p className="text-white/50 text-sm leading-relaxed">
                Enter your wager in SOL, make your prediction, and confirm the transaction.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Win 1.96x</h2>
              <p className="text-white/50 text-sm leading-relaxed">
                If you win, you get 1.96x your bet instantly. Results are determined by VRF and verifiable on-chain.
              </p>
            </section>
          </div>

          <div className="mt-12 p-6 bg-[#151515] rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-white font-semibold">Provably Fair</h3>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Every result is generated using Solana VRF (Verifiable Random Function). 
              This means outcomes cannot be manipulated and can be verified on-chain by anyone.
            </p>
          </div>

          <Link 
            href="/" 
            className="inline-flex items-center gap-2 mt-10 bg-emerald-500 text-white font-medium px-6 py-3 rounded-full hover:bg-emerald-600 transition"
          >
            Start Playing
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </main>

      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-white/5 px-6 py-3 z-50">
        <div className="flex items-center justify-around">
          <Link href="/" className="flex flex-col items-center gap-1 text-white/40">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-[10px]">Play</span>
          </Link>
          <Link href="/how-it-works" className="flex flex-col items-center gap-1 text-emerald-400">
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
