'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFlipCasino } from '@/hooks/useFlipCasino'
import { useWalletBalance } from '@/hooks/useWalletBalance'

const GoldCoin = ({ side, size = 100 }: { side: 'heads' | 'tails', size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="coinGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd700" />
        <stop offset="50%" stopColor="#ffec8b" />
        <stop offset="100%" stopColor="#daa520" />
      </linearGradient>
      <filter id="coinShadow"><feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.3"/></filter>
    </defs>
    <circle cx="50" cy="50" r="46" fill="#b8860b" filter="url(#coinShadow)"/>
    <circle cx="50" cy="50" r="42" fill="url(#coinGold)"/>
    <circle cx="50" cy="50" r="36" fill="none" stroke="#b8860b" strokeWidth="2" opacity="0.5"/>
    {side === 'heads' ? (
      <text x="50" y="58" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#8b6914">H</text>
    ) : (
      <text x="50" y="58" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#8b6914">SOL</text>
    )}
  </svg>
)

export default function CoinFlip() {
  const [choice, setChoice] = useState<'heads' | 'tails' | null>(null)
  const [wager, setWager] = useState('')
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<{ won: boolean; side: 'heads' | 'tails' } | null>(null)
  const balance = useWalletBalance()
  const { playCoinFlip, loading } = useFlipCasino()

  const handlePlay = async () => {
    if (!choice || !wager) return
    const amt = parseFloat(wager)
    if (isNaN(amt) || amt <= 0 || isFlipping || loading) return
    setIsFlipping(true)
    setResult(null)
    try {
      const { vrfResult } = await playCoinFlip(amt, choice === 'heads')
      await new Promise(r => setTimeout(r, 1800))
      setResult({ won: vrfResult.won, side: vrfResult.won ? choice : choice === 'heads' ? 'tails' : 'heads' })
    } catch (e: any) {
      alert(e?.message || 'Transaction failed')
    } finally {
      setIsFlipping(false)
    }
  }

  const reset = () => { setResult(null); setChoice(null) }

  return (
    <div className="card p-5 sm:p-8">
      {/* Wager */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/50 mb-2">Wager Amount</label>
        <div className="flex gap-2">
          <input type="number" value={wager} onChange={(e) => setWager(e.target.value)} placeholder="0.00" className="input flex-1" />
          <button onClick={() => setWager(Math.max(0, balance - 0.01).toFixed(2))} className="btn btn-secondary px-4 text-sm">MAX</button>
        </div>
        <div className="flex gap-2 mt-2">
          {[0.1, 0.5, 1, 5].map((a) => (
            <button key={a} onClick={() => setWager(a.toString())} className="flex-1 py-2.5 text-xs sm:text-sm font-medium text-white/40 bg-white/[0.02] rounded-xl border border-white/5 hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/20 transition-all">
              {a}
            </button>
          ))}
        </div>
        <div className="text-xs text-white/30 mt-2">Balance: {balance.toFixed(4)} SOL</div>
      </div>

      {/* Choice */}
      {!isFlipping && !result && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => setChoice('heads')} className={`choice-btn ${choice === 'heads' ? 'choice-btn-selected' : ''}`}>
            <div className="flex justify-center mb-2"><GoldCoin side="heads" size={60} /></div>
            <div className="text-sm font-semibold text-white">Heads</div>
          </button>
          <button onClick={() => setChoice('tails')} className={`choice-btn ${choice === 'tails' ? 'choice-btn-selected' : ''}`}>
            <div className="flex justify-center mb-2"><GoldCoin side="tails" size={60} /></div>
            <div className="text-sm font-semibold text-white">Tails</div>
          </button>
        </div>
      )}

      {/* Animation */}
      <div className="min-h-[180px] sm:min-h-[200px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isFlipping ? (
            <motion.div key="flip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div animate={{ rotateY: [0, 360], y: [0, -20, 0] }} transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}>
                <GoldCoin side="heads" size={90} />
              </motion.div>
              <div className="text-sm text-white/40 mt-4">Flipping...</div>
            </motion.div>
          ) : result ? (
            <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <motion.div className={result.won ? 'drop-shadow-[0_0_25px_rgba(34,197,94,0.5)]' : 'drop-shadow-[0_0_25px_rgba(239,68,68,0.4)]'}>
                <GoldCoin side={result.side} size={100} />
              </motion.div>
              <div className={`text-2xl sm:text-3xl font-bold mt-4 mb-1 ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                {result.won ? 'You Won!' : 'You Lost'}
              </div>
              <div className="text-sm text-white/40 mb-4">{result.side.charAt(0).toUpperCase() + result.side.slice(1)}</div>
              <button onClick={reset} className="btn btn-secondary text-sm">Play Again</button>
            </motion.div>
          ) : (
            <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="opacity-25"><GoldCoin side="heads" size={80} /></div>
              <div className="text-sm text-white/30 mt-3">Pick heads or tails</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Play */}
      {!result && (
        <button onClick={handlePlay} disabled={!choice || !wager || isFlipping || loading} className="btn btn-primary w-full mt-4">
          {isFlipping ? 'Flipping...' : 'Flip Coin'}
        </button>
      )}
    </div>
  )
}
