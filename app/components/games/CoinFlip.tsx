'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFlipCasino } from '@/hooks/useFlipCasino'
import { useWalletBalance } from '@/hooks/useWalletBalance'

const Coin = ({ side, size = 80 }: { side: 'heads' | 'tails', size?: number }) => (
  <div 
    className="rounded-full flex items-center justify-center font-bold"
    style={{
      width: size,
      height: size,
      background: 'linear-gradient(145deg, #ffd700, #b8860b)',
      boxShadow: '0 4px 20px rgba(255, 215, 0, 0.3)',
      fontSize: size * 0.3
    }}
  >
    <span className="text-amber-900">{side === 'heads' ? 'H' : 'T'}</span>
  </div>
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
    <div className="game-card">
      {/* Wager Input */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-white/50">Wager</label>
          <span className="text-xs text-white/30">{balance.toFixed(4)} SOL</span>
        </div>
        <div className="flex gap-2">
          <input 
            type="number" 
            value={wager} 
            onChange={(e) => setWager(e.target.value)} 
            placeholder="0.00" 
            className="game-input flex-1" 
          />
          <button 
            onClick={() => setWager(Math.max(0, balance - 0.01).toFixed(2))} 
            className="quick-amt px-4"
          >
            MAX
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {[0.1, 0.5, 1, 5].map((a) => (
            <button key={a} onClick={() => setWager(a.toString())} className="quick-amt">
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Choice */}
      {!isFlipping && !result && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={() => setChoice('heads')} 
            className={`choice-btn ${choice === 'heads' ? 'selected' : ''}`}
          >
            <div className="flex justify-center mb-3">
              <Coin side="heads" size={56} />
            </div>
            <div className="text-white font-medium">Heads</div>
          </button>
          <button 
            onClick={() => setChoice('tails')} 
            className={`choice-btn ${choice === 'tails' ? 'selected' : ''}`}
          >
            <div className="flex justify-center mb-3">
              <Coin side="tails" size={56} />
            </div>
            <div className="text-white font-medium">Tails</div>
          </button>
        </div>
      )}

      {/* Animation Area */}
      <div className="min-h-[200px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isFlipping ? (
            <motion.div key="flip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div animate={{ rotateY: [0, 360], y: [0, -15, 0] }} transition={{ duration: 0.4, repeat: Infinity }}>
                <Coin side="heads" size={80} />
              </motion.div>
              <div className="text-sm text-white/40 mt-4">Flipping...</div>
            </motion.div>
          ) : result ? (
            <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className={result.won ? 'drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]' : ''}>
                <Coin side={result.side} size={90} />
              </div>
              <div className={`text-2xl font-bold mt-5 ${result.won ? 'text-emerald-400' : 'text-red-400'}`}>
                {result.won ? 'You Won!' : 'You Lost'}
              </div>
              <div className="text-sm text-white/40 mt-1 mb-5">{result.side.charAt(0).toUpperCase() + result.side.slice(1)}</div>
              <button onClick={reset} className="btn-secondary">Play Again</button>
            </motion.div>
          ) : (
            <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="opacity-20"><Coin side="heads" size={70} /></div>
              <div className="text-sm text-white/30 mt-4">Pick heads or tails</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Play Button */}
      {!result && (
        <button 
          onClick={handlePlay} 
          disabled={!choice || !wager || isFlipping || loading} 
          className="btn-play mt-4"
        >
          {isFlipping ? 'Flipping...' : 'Flip Coin'}
        </button>
      )}
    </div>
  )
}
