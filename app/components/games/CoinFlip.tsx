'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFlipCasino } from '@/hooks/useFlipCasino'
import { useWalletBalance } from '@/hooks/useWalletBalance'

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
    <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
      {/* Amount */}
      <div className="mb-6">
        <label className="block text-sm text-white/50 mb-2">Amount (SOL)</label>
        <input 
          type="number" 
          value={wager} 
          onChange={(e) => setWager(e.target.value)} 
          placeholder="0.00"
          className="w-full h-12 bg-[#1a1a1a] border border-white/10 rounded-lg px-4 text-white font-mono text-lg focus:outline-none focus:border-[#ef4444] transition"
        />
        <div className="flex gap-2 mt-2">
          {[0.1, 0.5, 1, 5].map((a) => (
            <button key={a} onClick={() => setWager(a.toString())} className="flex-1 py-1.5 text-xs text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded transition">
              {a}
            </button>
          ))}
          <button onClick={() => setWager(Math.max(0, balance - 0.01).toFixed(2))} className="px-3 py-1.5 text-xs text-[#ef4444] bg-[#ef4444]/10 hover:bg-[#ef4444]/20 rounded transition">
            MAX
          </button>
        </div>
      </div>

      {/* Choice */}
      {!isFlipping && !result && (
        <div className="mb-6">
          <label className="block text-sm text-white/50 mb-2">Pick Side</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setChoice('heads')} 
              className={`p-4 rounded-lg border transition ${
                choice === 'heads' 
                  ? 'border-[#ef4444] bg-[#ef4444]/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-3xl mb-1">🪙</div>
              <div className="text-white font-medium">Heads</div>
            </button>
            <button 
              onClick={() => setChoice('tails')} 
              className={`p-4 rounded-lg border transition ${
                choice === 'tails' 
                  ? 'border-[#ef4444] bg-[#ef4444]/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-3xl mb-1">🪙</div>
              <div className="text-white font-medium">Tails</div>
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      <div className="min-h-[140px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isFlipping ? (
            <motion.div key="flip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div className="text-6xl" animate={{ rotateY: [0, 360] }} transition={{ duration: 0.4, repeat: Infinity }}>
                🪙
              </motion.div>
              <div className="text-sm text-white/40 mt-2">Flipping...</div>
            </motion.div>
          ) : result ? (
            <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className="text-6xl mb-2">🪙</div>
              <div className={`text-2xl font-bold ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                {result.won ? 'You Won!' : 'You Lost'}
              </div>
              <div className="text-sm text-white/40 mt-1">{result.side}</div>
              <button onClick={reset} className="mt-4 px-4 py-2 text-sm text-[#ef4444] hover:bg-[#ef4444]/10 rounded transition">
                Play Again
              </button>
            </motion.div>
          ) : (
            <div className="text-center text-white/20">
              <div className="text-5xl mb-2">🪙</div>
              <div className="text-sm">Select a side</div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Button */}
      {!result && (
        <button 
          onClick={handlePlay} 
          disabled={!choice || !wager || isFlipping || loading}
          className="w-full h-12 bg-[#ef4444] hover:bg-[#dc2626] disabled:bg-white/5 disabled:text-white/20 text-white font-medium rounded-lg transition"
        >
          {isFlipping ? 'Flipping...' : 'Flip Coin'}
        </button>
      )}
    </div>
  )
}
