'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WelcomeModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: 'Welcome to BagFlip',
      content: (
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center animate-float shadow-lg shadow-violet-500/30">
            <span className="text-4xl font-bold text-white">B</span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            The simplest way to flip your SOL. Fair odds, instant payouts, fully on-chain.
          </p>
          <div className="flex justify-center gap-10">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50%</div>
              <div className="text-xs text-white/40 mt-1">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-400">1.96x</div>
              <div className="text-xs text-white/40 mt-1">Payout</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'How to Play',
      content: (
        <div className="space-y-4">
          {[
            { n: '1', t: 'Connect Wallet', d: 'Phantom, Solflare, or any Solana wallet' },
            { n: '2', t: 'Pick Your Game', d: 'Coin Flip, Dice Roll, or Even/Odd' },
            { n: '3', t: 'Place Your Bet', d: 'Choose your side and set wager' },
            { n: '4', t: 'Win Instantly', d: 'Results verified, payouts instant' }
          ].map((s) => (
            <div key={s.n} className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.03]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
                <span className="text-sm font-bold text-white">{s.n}</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{s.t}</div>
                <div className="text-xs text-white/40">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Provably Fair',
      content: (
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center border border-violet-500/30">
            <svg className="w-10 h-10 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            Every game uses Switchboard VRF for verifiable randomness. Results cannot be manipulated and are recorded on-chain.
          </p>
          <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <div className="flex items-center justify-center gap-2 text-sm">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white/70">Smart contract verified on Solscan</span>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#1a1a2e]/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-violet-500/10"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">{steps[step].title}</h2>
            <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.15 }}>
              {steps[step].content}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-8 pb-8">
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <button key={i} onClick={() => setStep(i)} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-violet-500' : 'w-2 bg-white/20'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            {step > 0 && <button onClick={() => setStep(step - 1)} className="btn btn-secondary flex-1">Back</button>}
            <button onClick={() => step < steps.length - 1 ? setStep(step + 1) : onClose()} className="btn btn-primary flex-1">
              {step < steps.length - 1 ? 'Next' : 'Start Playing'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
