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
    <div className="bg-[#12121a] rounded-2xl border border-white/5 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🪙</span>
          <h2 className="font-semibold text-white">Coin Flip</h2>
        </div>
        <div className="px-2 py-1 bg-green-500/10 rounded text-xs font-bold text-green-400">1.96x</div>
      </div>
      
      <div className="p-5">
        {/* Bet Amount */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-white/40 uppercase tracking-wide">Bet Amount</label>
            <span className="text-xs text-white/30">{balance.toFixed(4)} SOL</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input 
                type="number" 
                value={wager} 
                onChange={(e) => setWager(e.target.value)} 
                placeholder="0.00"
                className="w-full h-12 bg-[#1a1a24] border border-white/10 rounded-xl px-4 pr-24 text-white text-lg font-semibold focus:outline-none focus:border-[#ff6b4a] transition"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button onClick={() => setWager((parseFloat(wager || '0') / 2).toString())} className="px-2 py-1 text-xs font-bold text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded transition">½</button>
                <button onClick={() => setWager((parseFloat(wager || '0') * 2).toString())} className="px-2 py-1 text-xs font-bold text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded transition">2×</button>
                <button onClick={() => setWager(Math.max(0, balance - 0.01).toFixed(2))} className="px-2 py-1 text-xs font-bold text-[#ff6b4a] bg-[#ff6b4a]/10 hover:bg-[#ff6b4a]/20 rounded transition">MAX</button>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            {[0.1, 0.25, 0.5, 1, 5].map((a) => (
              <button key={a} onClick={() => setWager(a.toString())} className="flex-1 py-2 text-xs font-medium text-white/50 hover:text-white bg-[#1a1a24] hover:bg-[#22222e] border border-white/5 rounded-lg transition">
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Pick Side */}
        {!isFlipping && !result && (
          <div className="mb-5">
            <label className="text-xs font-medium text-white/40 uppercase tracking-wide mb-3 block">Pick Side</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setChoice('heads')} 
                className={`p-5 rounded-xl border-2 transition-all ${
                  choice === 'heads' 
                    ? 'bg-[#ff6b4a]/10 border-[#ff6b4a]' 
                    : 'bg-[#1a1a24] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                  <span className="text-amber-900 font-black text-xl">H</span>
                </div>
                <div className="text-white font-semibold">Heads</div>
              </button>
              <button 
                onClick={() => setChoice('tails')} 
                className={`p-5 rounded-xl border-2 transition-all ${
                  choice === 'tails' 
                    ? 'bg-[#ff6b4a]/10 border-[#ff6b4a]' 
                    : 'bg-[#1a1a24] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                  <span className="text-amber-900 font-black text-xl">T</span>
                </div>
                <div className="text-white font-semibold">Tails</div>
              </button>
            </div>
          </div>
        )}

        {/* Result Area */}
        <div className="min-h-[180px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isFlipping ? (
              <motion.div key="flip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <motion.div 
                  className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-xl shadow-yellow-500/30"
                  animate={{ rotateY: [0, 360], y: [0, -30, 0] }} 
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <span className="text-amber-900 font-black text-3xl">?</span>
                </motion.div>
                <div className="text-sm text-white/40 mt-4">Flipping...</div>
              </motion.div>
            ) : result ? (
              <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <div className={`w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-xl ${result.won ? 'shadow-green-500/40 ring-4 ring-green-500/30' : 'shadow-red-500/30'}`}>
                  <span className="text-amber-900 font-black text-4xl">{result.side === 'heads' ? 'H' : 'T'}</span>
                </div>
                <div className={`text-3xl font-bold mt-4 ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                  {result.won ? 'You Won!' : 'You Lost'}
                </div>
                <div className="text-sm text-white/40 mt-1">{result.side.charAt(0).toUpperCase() + result.side.slice(1)}</div>
                <button onClick={reset} className="mt-5 px-6 py-2.5 text-sm font-semibold text-[#ff6b4a] bg-[#ff6b4a]/10 hover:bg-[#ff6b4a]/20 rounded-xl transition">
                  Play Again
                </button>
              </motion.div>
            ) : (
              <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#1a1a24] border border-white/10 flex items-center justify-center">
                  <span className="text-white/20 font-bold text-2xl">?</span>
                </div>
                <div className="text-sm text-white/30 mt-4">Pick a side to play</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Flip Button */}
        {!result && (
          <button 
            onClick={handlePlay} 
            disabled={!choice || !wager || isFlipping || loading}
            className="w-full h-14 bg-gradient-to-r from-[#ff6b4a] to-[#ff9f43] hover:from-[#ff5533] hover:to-[#ff8c2a] disabled:from-[#1a1a24] disabled:to-[#1a1a24] disabled:text-white/20 text-white font-bold text-lg rounded-xl transition disabled:cursor-not-allowed shadow-lg shadow-[#ff6b4a]/20 disabled:shadow-none"
          >
            {isFlipping ? 'Flipping...' : 'Flip Coin'}
          </button>
        )}
      </div>
    </div>
  )
}
