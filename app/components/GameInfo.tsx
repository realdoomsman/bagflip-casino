'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GameInfoProps {
  game: 'flip' | 'dice' | 'evenodd'
}

const gameData = {
  flip: {
    name: 'Coin Flip',
    description: 'Classic heads or tails. Pick a side and flip.',
    odds: '50%',
    payout: '1.96x',
    color: 'emerald',
    rules: [
      'Choose heads or tails',
      'Set your wager amount',
      'VRF determines the result',
      'Win = 1.96x your wager'
    ]
  },
  dice: {
    name: 'Dice Roll',
    description: 'Predict if the roll will be high (51-100) or low (1-50).',
    odds: '50%',
    payout: '1.96x',
    color: 'cyan',
    rules: [
      'Choose high (51-100) or low (1-50)',
      'Set your wager amount',
      'VRF generates a number 1-100',
      'Win = 1.96x your wager'
    ]
  },
  evenodd: {
    name: 'Even/Odd',
    description: 'Guess if the random number will be even or odd.',
    odds: '50%',
    payout: '1.96x',
    color: 'purple',
    rules: [
      'Choose even or odd',
      'Set your wager amount',
      'VRF generates a number',
      'Win = 1.96x your wager'
    ]
  }
}

export default function GameInfo({ game }: GameInfoProps) {
  const [isOpen, setIsOpen] = useState(false)
  const data = gameData[game]
  const colorClass = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  }[data.color]

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
        title="Game Info"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{data.name}</h3>
                  <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-sm text-white/60 mb-4">{data.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`p-3 rounded-xl border ${colorClass}`}>
                    <div className="text-xl font-bold">{data.odds}</div>
                    <div className="text-xs opacity-60">Win Chance</div>
                  </div>
                  <div className={`p-3 rounded-xl border ${colorClass}`}>
                    <div className="text-xl font-bold">{data.payout}</div>
                    <div className="text-xs opacity-60">Payout</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-white/40 uppercase tracking-wide">How to Play</div>
                  {data.rules.map((rule, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-white/60">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${colorClass}`}>
                        {i + 1}
                      </span>
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
