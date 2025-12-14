'use client'

import Link from 'next/link'

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#0d0d12]">
      <header className="h-14 bg-[#12121a] border-b border-white/5">
        <div className="h-full max-w-[1600px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff6b4a] to-[#ff9f43] flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-white font-bold text-lg">BagFlip</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 text-sm font-medium text-white/50 hover:text-white rounded-lg transition">Games</Link>
              <Link href="/how-it-works" className="px-4 py-2 text-sm font-medium text-white bg-white/5 rounded-lg">How it Works</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-2">How <span className="text-[#ff6b4a]">BagFlip</span> Works</h1>
        <p className="text-white/50 mb-10">Provably fair gambling on Solana</p>

        <div className="space-y-4">
          {[
            { num: '1', title: 'Connect Wallet', desc: 'Connect any Solana wallet like Phantom, Solflare, or Backpack to get started.' },
            { num: '2', title: 'Choose a Game', desc: 'Pick from Coin Flip, Dice, or Even/Odd. All games have true 50/50 odds.' },
            { num: '3', title: 'Place Your Bet', desc: 'Enter your wager in SOL, make your prediction, and confirm the transaction.' },
            { num: '4', title: 'Win 1.96x', desc: 'Win and get 1.96x your bet instantly. Results are verified on-chain using VRF.' },
          ].map((step) => (
            <div key={step.num} className="flex gap-4 p-5 bg-[#12121a] rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff6b4a] to-[#ff9f43] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">{step.num}</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-sm text-white/50">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-[#12121a] rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-white">Provably Fair</h3>
          </div>
          <p className="text-sm text-white/50 leading-relaxed">
            Every result is generated using Solana VRF (Verifiable Random Function). 
            This means outcomes cannot be manipulated by anyone and can be independently verified on-chain.
          </p>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-gradient-to-r from-[#ff6b4a] to-[#ff9f43] text-white font-semibold rounded-xl shadow-lg shadow-[#ff6b4a]/20 hover:shadow-[#ff6b4a]/30 transition">
          Start Playing
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#12121a] border-t border-white/5 flex items-center justify-around z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-white/40">
          <span className="text-lg">🎮</span>
          <span className="text-[10px] font-medium">Games</span>
        </Link>
        <Link href="/how-it-works" className="flex flex-col items-center gap-1 text-[#ff6b4a]">
          <span className="text-lg">ℹ️</span>
          <span className="text-[10px] font-medium">Info</span>
        </Link>
      </nav>
    </div>
  )
}
