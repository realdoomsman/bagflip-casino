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
    <div className="bg-[#181818] rounded-2xl border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <h2 className="font-semibold text-white">Coin Flip</h2>
        <span className="text-xs text-green-400 font-medium">1.96x</span>
      </div>
      
      <div className="p-5">
        {/* Wager */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-white/40">BET AMOUNT</label>
            <span className="text-xs text-white/30">{balance.toFixed(4)} SOL</span>
          </div>
          <div className="relative">
            <input 
              type="number" 
              value={wager} 
              onChange={(e) => setWager(e.target.value)} 
              placeholder="0.00"
              className="w-full h-12 bg-[#0f0f0f] border border-white/[0.08] rounded-lg px-4 text-white text-lg font-semibold focus:outline-none focus:border-blue-500 transition"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button onClick={() => setWager((parseFloat(wager || '0') / 2).toString())} className="px-2 py-1 text-xs font-medium text-white/40 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded transition">½</button>
              <button onClick={() => setWager((parseFloat(wager || '0') * 2).toString())} className="px-2 py-1 text-xs font-medium text-white/40 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded transition">2x</button>
              <button onClick={() => setWager(Math.max(0, balance - 0.01).toFixed(2))} className="px-2 py-1 text-xs font-medium text-white/40 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded transition">MAX</button>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            {[0.1, 0.25, 0.5, 1].map((a) => (
              <button key={a} onClick={() => setWager(a.toString())} className="flex-1 py-2 text-xs font-medium text-white/40 hover:text-white bg-[#0f0f0f] hover:bg-white/[0.04] border border-white/[0.06] rounded-lg transition">
                {a} SOL
              </button>
            ))}
          </div>
        </div>

        {/* Choice */}
        {!isFlipping && !result && (
          <div className="mb-5">
            <label className="text-xs font-medium text-white/40 mb-2 block">PICK SIDE</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setChoice('heads')} 
                className={`p-5 rounded-xl border-2 transition-all ${
                  choice === 'heads' 
                    ? 'bg-blue-500/10 border-blue-500' 
                    : 'bg-[#0f0f0f] border-white/[0.06] hover:border-white/20'
                }`}
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                  <span className="text-yellow-900 font-bold text-lg">H</span>
                </div>
                <div className="text-white font-medium text-sm">Heads</div>
              </button>
              <button 
                onClick={() => setChoice('tails')} 
                className={`p-5 rounded-xl border-2 transition-all ${
                  choice === 'tails' 
                    ? 'bg-blue-500/10 border-blue-500' 
                    : 'bg-[#0f0f0f] border-white/[0.06] hover:border-white/20'
                }`}
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                  <span className="text-yellow-900 font-bold text-lg">T</span>
                </div>
                <div className="text-white font-medium text-sm">Tails</div>
              </button>
            </div>
          </div>
        )}

        {/* Animation */}
        <div className="min-h-[160px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isFlipping ? (
              <motion.div key="flip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <motion.div 
                  className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-xl"
                  animate={{ rotateY: [0, 360], y: [0, -20, 0] }} 
                  transition={{ duration: 0.4, repeat: Infinity }}
                >
                  <span className="text-yellow-900 font-bold text-2xl">?</span>
                </motion.div>
                <div className="text-sm text-white/40 mt-4">Flipping...</div>
              </motion.div>
            ) : result ? (
              <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-xl ${result.won ? 'ring-4 ring-green-500/50' : ''}`}>
                  <span className="text-yellow-900 font-bold text-3xl">{result.side === 'heads' ? 'H' : 'T'}</span>
                </div>
                <div className={`text-2xl font-bold mt-4 ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                  {result.won ? 'You Won!' : 'You Lost'}
                </div>
                <div className="text-sm text-white/40 mt-1">{result.side.charAt(0).toUpperCase() + result.side.slice(1)}</div>
                <button onClick={reset} className="mt-4 px-6 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition">
                  Play Again
                </button>
              </motion.div>
            ) : (
              <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <span className="text-white/20 font-bold text-xl">?</span>
                </div>
                <div className="text-sm text-white/30 mt-3">Select a side to play</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Play Button */}
        {!result && (
          <button 
            onClick={handlePlay} 
            disabled={!choice || !wager || isFlipping || loading}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-white/[0.06] disabled:text-white/20 text-white font-semibold rounded-lg transition disabled:cursor-not-allowed"
          >
            {isFlipping ? 'Flipping...' : 'Flip Coin'}
          </button>
        )}
      </div>
    </div>
  )
}
