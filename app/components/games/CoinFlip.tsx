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
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
      {/* Choice */}
      {!isFlipping && !result && (
        <div className="mb-6">
          <label className="block text-sm text-zinc-400 mb-3">Pick a side</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setChoice('heads')} 
              className={`p-5 rounded-xl border-2 transition ${
                choice === 'heads' ? 'border-white bg-white/5' : 'border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 flex items-center justify-center">
                <span className="text-amber-900 font-bold text-lg">H</span>
              </div>
              <div className="text-white text-sm font-medium">Heads</div>
            </button>
            <button 
              onClick={() => setChoice('tails')} 
              className={`p-5 rounded-xl border-2 transition ${
                choice === 'tails' ? 'border-white bg-white/5' : 'border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 flex items-center justify-center">
                <span className="text-amber-900 font-bold text-lg">T</span>
              </div>
              <div className="text-white text-sm font-medium">Tails</div>
            </button>
          </div>
        </div>
      )}

      {/* Wager */}
      {!isFlipping && !result && (
        <div className="mb-6">
          <label className="block text-sm text-zinc-400 mb-3">Bet amount (SOL)</label>
          <input 
            type="number" 
            value={wager} 
            onChange={(e) => setWager(e.target.value)} 
            placeholder="0.00"
            className="w-full h-12 bg-zinc-800 border border-zinc-700 rounded-xl px-4 text-white text-lg font-medium focus:outline-none focus:border-zinc-500 transition"
          />
          <div className="flex gap-2 mt-3">
            {[0.1, 0.5, 1, 5].map((a) => (
              <button key={a} onClick={() => setWager(a.toString())} className="flex-1 py-2 text-sm text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition">
                {a}
              </button>
            ))}
          </div>
          {connected && <div className="text-xs text-zinc-500 mt-3">Balance: {balance.toFixed(4)} SOL</div>}
        </div>
      )}

      {/* Result */}
      <div className="min-h-[160px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isFlipping ? (
            <motion.div key="flip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div 
                className="w-20 h-20 mx-auto rounded-full bg-gradient-to-b from-amber-300 to-amber-500 flex items-center justify-center"
                animate={{ rotateY: [0, 360], y: [0, -20, 0] }} 
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <span className="text-amber-900 font-bold text-2xl">?</span>
              </motion.div>
              <div className="text-zinc-400 mt-4">Flipping...</div>
            </motion.div>
          ) : result ? (
            <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-b from-amber-300 to-amber-500 flex items-center justify-center ${result.won ? 'ring-4 ring-green-500/50' : ''}`}>
                <span className="text-amber-900 font-bold text-3xl">{result.side === 'heads' ? 'H' : 'T'}</span>
              </div>
              <div className={`text-2xl font-bold mt-4 ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                {result.won ? 'You Won!' : 'You Lost'}
              </div>
              <button onClick={reset} className="mt-4 text-sm text-zinc-400 hover:text-white transition">
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
          className="w-full h-12 bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-medium rounded-xl transition"
        >
          {!connected ? 'Connect Wallet' : isFlipping ? 'Flipping...' : 'Flip Coin'}
        </button>
      )}
    </div>
  )
}
