'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { motion, AnimatePresence } from 'framer-motion'
import { useFlipCasino } from '@/hooks/useFlipCasino'
import { useWalletBalance } from '@/hooks/useWalletBalance'

export default function CoinFlip() {
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()
  const [choice, setChoice] = useState<'heads' | 'tails' | null>(null)
  const [wager, setWager] = useState('')
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<{ won: boolean; side: 'heads' | 'tails' } | null>(null)
  const balance = useWalletBalance()
  const { playCoinFlip, loading } = useFlipCasino()

  const handlePlay = async () => {
    if (!connected) { setVisible(true); return }
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
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 glow-purple">
      {/* Choice */}
      {!isFlipping && !result && (
        <div className="mb-6">
          <label className="block text-sm text-white/50 mb-3">Pick a side</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setChoice('heads')} 
              className={`p-5 rounded-xl border-2 transition-all ${
                choice === 'heads' 
                  ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10' 
                  : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
              }`}
            >
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="text-amber-900 font-black text-xl">H</span>
              </div>
              <div className="text-white font-medium">Heads</div>
            </button>
            <button 
              onClick={() => setChoice('tails')} 
              className={`p-5 rounded-xl border-2 transition-all ${
                choice === 'tails' 
                  ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10' 
                  : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
              }`}
            >
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="text-amber-900 font-black text-xl">T</span>
              </div>
              <div className="text-white font-medium">Tails</div>
            </button>
          </div>
        </div>
      )}

      {/* Wager */}
      {!isFlipping && !result && (
        <div className="mb-6">
          <label className="block text-sm text-white/50 mb-3">Bet amount (SOL)</label>
          <input 
            type="number" 
            value={wager} 
            onChange={(e) => setWager(e.target.value)} 
            placeholder="0.00"
            className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-xl px-4 text-white text-xl font-semibold focus:outline-none focus:border-violet-500 transition"
          />
          <div className="flex gap-2 mt-3">
            {[0.1, 0.5, 1, 5].map((a) => (
              <button key={a} onClick={() => setWager(a.toString())} className="flex-1 py-2.5 text-sm text-white/50 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-lg transition">
                {a}
              </button>
            ))}
          </div>
          {connected && <div className="text-xs text-white/30 mt-3">Balance: {balance.toFixed(4)} SOL</div>}
        </div>
      )}

      {/* Result */}
      <div className="min-h-[180px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isFlipping ? (
            <motion.div key="flip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div 
                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 flex items-center justify-center shadow-2xl shadow-amber-500/30"
                animate={{ rotateY: [0, 360], y: [0, -25, 0] }} 
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <span className="text-amber-900 font-black text-3xl">?</span>
              </motion.div>
              <div className="text-white/40 mt-5">Flipping...</div>
            </motion.div>
          ) : result ? (
            <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className={`w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 flex items-center justify-center shadow-2xl ${result.won ? 'shadow-green-500/40 ring-4 ring-green-500/30' : 'shadow-amber-500/30'}`}>
                <span className="text-amber-900 font-black text-4xl">{result.side === 'heads' ? 'H' : 'T'}</span>
              </div>
              <div className={`text-3xl font-bold mt-5 ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                {result.won ? 'You Won!' : 'You Lost'}
              </div>
              <div className="text-white/40 mt-1">{result.side.charAt(0).toUpperCase() + result.side.slice(1)}</div>
              <button onClick={reset} className="mt-5 px-5 py-2 text-sm text-violet-400 hover:bg-violet-500/10 rounded-lg transition">
                Play Again
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Button */}
      {!result && (
        <button 
          onClick={handlePlay} 
          disabled={!choice || !wager || isFlipping || loading}
          className="w-full h-14 bg-gradient-to-r from-violet-500 to-indigo-500 hover:opacity-90 disabled:from-white/5 disabled:to-white/5 disabled:text-white/30 text-white font-semibold text-lg rounded-xl transition shadow-lg shadow-violet-500/20 disabled:shadow-none"
        >
          {!connected ? 'Connect Wallet' : isFlipping ? 'Flipping...' : 'Flip Coin'}
        </button>
      )}
    </div>
  )
}
