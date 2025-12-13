'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFlipCasino } from '@/hooks/useFlipCasino'
import { useWalletBalance } from '@/hooks/useWalletBalance'

const GoldCoin = ({ side, size = 120 }: { side: 'heads' | 'tails', size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <defs>
      <linearGradient id="coinGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd700" />
        <stop offset="50%" stopColor="#ffec8b" />
        <stop offset="100%" stopColor="#daa520" />
      </linearGradient>
      <linearGradient id="coinEdge" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b8860b" />
        <stop offset="100%" stopColor="#8b6914" />
      </linearGradient>
      <filter id="coinShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.3"/>
      </filter>
    </defs>
    <ellipse cx="60" cy="64" rx="52" ry="8" fill="#8b6914" opacity="0.4"/>
    <circle cx="60" cy="60" r="54" fill="url(#coinEdge)" filter="url(#coinShadow)"/>
    <circle cx="60" cy="60" r="50" fill="url(#coinGold)"/>
    <circle cx="60" cy="60" r="44" fill="none" stroke="#daa520" strokeWidth="2" opacity="0.5"/>
    <circle cx="60" cy="60" r="38" fill="none" stroke="#b8860b" strokeWidth="1"/>
    {side === 'heads' ? (
      <>
        <circle cx="60" cy="52" r="14" fill="#b8860b" opacity="0.3"/>
        <circle cx="60" cy="52" r="12" fill="none" stroke="#8b6914" strokeWidth="2"/>
        <path d="M52 70 Q60 78 68 70" stroke="#8b6914" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="54" cy="50" r="2" fill="#8b6914"/>
        <circle cx="66" cy="50" r="2" fill="#8b6914"/>
      </>
    ) : (
      <>
        <text x="60" y="68" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#8b6914">SOL</text>
        <path d="M35 45 L85 45" stroke="#b8860b" strokeWidth="2" strokeLinecap="round"/>
        <path d="M35 75 L85 75" stroke="#b8860b" strokeWidth="2" strokeLinecap="round"/>
      </>
    )}
  </svg>
)

const SpinningCoin = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
    <defs>
      <linearGradient id="spinGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd700" />
        <stop offset="50%" stopColor="#ffec8b" />
        <stop offset="100%" stopColor="#daa520" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="64" rx="52" ry="8" fill="#8b6914" opacity="0.4"/>
    <circle cx="60" cy="60" r="54" fill="#b8860b"/>
    <circle cx="60" cy="60" r="50" fill="url(#spinGold)"/>
    <text x="60" y="68" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#8b6914">?</text>
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
      await new Promise(r => setTimeout(r, 2000))
      setResult({ won: vrfResult.won, side: vrfResult.won ? choice : choice === 'heads' ? 'tails' : 'heads' })
    } catch (e: any) {
      alert(e?.message || 'Transaction failed')
    } finally {
      setIsFlipping(false)
    }
  }

  const reset = () => { setResult(null); setChoice(null) }

  return (
    <div className="card p-8">
      {/* Wager */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-white/50 mb-3">Wager Amount</label>
        <div className="flex gap-3">
          <input type="number" value={wager} onChange={(e) => setWager(e.target.value)} placeholder="0.00" className="input flex-1" />
          <button onClick={() => setWager(Math.max(0, balance - 0.01).toFixed(2))} className="btn btn-secondary px-5">MAX</button>
        </div>
        <div className="flex gap-2 mt-3">
          {[0.1, 0.5, 1, 5].map((a) => (
            <button key={a} onClick={() => setWager(a.toString())} className="flex-1 py-3 text-sm font-semibold text-white/40 bg-white/[0.03] rounded-xl border border-white/5 hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/30 transition-all">
              {a} SOL
            </button>
          ))}
        </div>
        <div className="text-sm text-white/30 mt-3">Balance: {balance.toFixed(4)} SOL</div>
      </div>

      {/* Choice */}
      {!isFlipping && !result && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button onClick={() => setChoice('heads')} className={`choice-btn ${choice === 'heads' ? 'choice-btn-selected' : ''}`}>
            <div className="flex justify-center mb-3">
              <GoldCoin side="heads" size={80} />
            </div>
            <div className="text-base font-semibold text-white">Heads</div>
          </button>
          <button onClick={() => setChoice('tails')} className={`choice-btn ${choice === 'tails' ? 'choice-btn-selected' : ''}`}>
            <div className="flex justify-center mb-3">
              <GoldCoin side="tails" size={80} />
            </div>
            <div className="text-base font-semibold text-white">Tails</div>
          </button>
        </div>
      )}

      {/* Animation */}
      <div className="min-h-[220px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isFlipping ? (
            <motion.div key="flip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div
                animate={{ rotateY: [0, 360], y: [0, -30, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <SpinningCoin />
              </motion.div>
              <div className="text-sm text-white/40 mt-6">Flipping...</div>
            </motion.div>
          ) : result ? (
            <motion.div key="result" initial={{ scale: 0.8, opacity: 0, y: -20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="text-center">
              <motion.div 
                initial={{ rotateY: 180 }} 
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.5 }}
                className={result.won ? 'drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]' : 'drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]'}
              >
                <GoldCoin side={result.side} size={120} />
              </motion.div>
              <div className={`text-3xl font-bold mt-4 mb-2 ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                {result.won ? 'You Won!' : 'You Lost'}
              </div>
              <div className="text-sm text-white/40 mb-6">{result.side.charAt(0).toUpperCase() + result.side.slice(1)}</div>
              <button onClick={reset} className="btn btn-secondary">Play Again</button>
            </motion.div>
          ) : (
            <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="opacity-30">
                <GoldCoin side="heads" size={100} />
              </div>
              <div className="text-sm text-white/30 mt-4">Pick heads or tails</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Play */}
      {!result && (
        <button onClick={handlePlay} disabled={!choice || !wager || isFlipping || loading} className="btn btn-primary w-full mt-6">
          {isFlipping ? 'Flipping...' : 'Flip Coin'}
        </button>
      )}
    </div>
  )
}
