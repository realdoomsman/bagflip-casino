'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#0a0f0f]">
      <header className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-white font-bold text-xl">BagFlip</span>
            </Link>
          </div>
          <WalletMultiButton />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">How BagFlip Works</h1>

        <div className="space-y-6">
          {[
            { num: '1', title: 'Pick your side', desc: 'Choose heads or tails, high or low, even or odd.' },
            { num: '2', title: 'Set your wager', desc: 'Enter how much SOL you want to bet.' },
            { num: '3', title: 'Flip and win', desc: 'If you win, you get 1.96x your bet instantly.' },
          ].map((step) => (
            <div key={step.num} className="flex gap-4 p-5 bg-[#111a1a] rounded-xl border border-cyan-500/20">
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">{step.num}</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-white/50">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-5 bg-[#111a1a] rounded-xl border border-cyan-500/20">
          <h3 className="text-white font-semibold mb-2">Provably Fair</h3>
          <p className="text-sm text-white/50">All results use Solana VRF. Outcomes are verifiable on-chain and cannot be manipulated.</p>
        </div>

        <Link href="/" className="inline-block mt-8 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition">
          Start Playing →
        </Link>
      </main>
    </div>
  )
}
