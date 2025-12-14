'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>
      <header className="relative border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-white font-bold text-xl">BagFlip</span>
            </Link>
          </div>
          <WalletMultiButton />
        </div>
      </header>

      <main className="relative max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">How BagFlip Works</h1>

        <div className="space-y-4 mb-12">
          {[
            { title: '1. Pick your side', desc: 'Choose heads or tails, high or low, even or odd. All games have true 50/50 odds.' },
            { title: '2. Set your bet', desc: 'Enter how much SOL you want to wager. Quick buttons make it easy.' },
            { title: '3. Flip and win', desc: 'Confirm the transaction and watch the result. Win and get 1.96x your bet instantly.' },
          ].map((step, i) => (
            <div key={i} className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
              <h3 className="text-white font-semibold mb-1">{step.title}</h3>
              <p className="text-sm text-white/50">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 mb-8">
          <h3 className="text-white font-semibold mb-2">Provably Fair</h3>
          <p className="text-sm text-white/50">All results use Solana VRF. Outcomes cannot be manipulated and can be verified on-chain. Check our GitHub for the full source code.</p>
        </div>

        <Link href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 transition hover:opacity-90">
          Start Playing →
        </Link>
      </main>
    </div>
  )
}
