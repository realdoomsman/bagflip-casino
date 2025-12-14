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
    <div className="bg-[#111a1a] rounded-2xl border border-cyan-500/20 overflow-hidden glow-cyan">
      <div className="p-6">
        {/* Choice */}
        {!isFlipping && !result && (
          <div className="mb-6">
            <label className="block text-xs text-white/40 mb-3 uppercase tracking-wider">Pick Your Side</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setChoice('heads')} 
                className={`p-6 rounded-xl border-2 transition-all ${
                  choice === 'heads' 
                    ? 'border-cyan-500 bg-cyan-500/10' 
                    : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                  <span className="text-yellow-900 font-black text-2xl">H</span>
                </div>
                <div className="text-white font-semibold">Heads</div>
              </button>
              <button 
                onClick={() => setChoice('tails')} 
                className={`p-6 rounded-xl border-2 transition-all ${
                  choice === 'tails' 
                    ? 'border-cyan-500 bg-cyan-500/10' 
                    : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                  <span className="text-yellow-900 font-black text-2xl">T</span>
                </div>
                <div className="text-white font-semibold">Tails</div>
              </button>
            </div>
          </div>
        )}

        {/* Wager */}
        {!isFlipping && !result && (
          <div className="mb-6">
            <label className="block text-xs text-white/40 mb-3 uppercase tracking-wider">Wager Amount</label>
            <div className="relative">
              <input 
                type="number" 
                value={wager} 
                onChange={(e) => setWager(e.target.value)} 
                placeholder="0.00"
                className="w-full h-14 bg-[#0a0f0f] border border-white/10 rounded-xl px-4 pr-16 text-white text-xl font-semibold focus:outline-none focus:border-cyan-500 transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 font-medium">SOL</span>
            </div>
            <div className="flex gap-2 mt-3">
              {[0.1, 0.5, 1, 2, 5].map((a) => (
                <button key={a} onClick={() => setWager(a.toString())} className="flex-1 py-2 text-sm text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition">
                  {a}
                </button>
              ))}
            </div>
            {connected && <div className="text-xs text-white/30 mt-3">Balance: {balance.toFixed(4)} SOL</div>}
          </div>
        )}

        {/* Animation / Result */}
        <div className="min-h-[180px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isFlipping ? (
              <motion.div key="flip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <motion.div 
                  className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl"
                  animate={{ rotateY: [0, 360], y: [0, -30, 0] }} 
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <span className="text-yellow-900 font-black text-3xl">?</span>
                </motion.div>
                <div className="text-white/40 mt-4">Flipping...</div>
              </motion.div>
            ) : result ? (
              <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <div className={`w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl ${result.won ? 'ring-4 ring-green-500/50' : ''}`}>
                  <span className="text-yellow-900 font-black text-4xl">{result.side === 'heads' ? 'H' : 'T'}</span>
                </div>
                <div className={`text-3xl font-bold mt-4 ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                  {result.won ? 'You Won!' : 'You Lost'}
                </div>
                <div className="text-white/40 mt-1">{result.side.charAt(0).toUpperCase() + result.side.slice(1)}</div>
                <button onClick={reset} className="mt-6 px-6 py-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition">
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
            className="w-full h-14 bg-cyan-500 hover:bg-cyan-600 disabled:bg-white/10 disabled:text-white/30 text-white font-semibold text-lg rounded-xl transition"
          >
            {!connected ? 'Connect Wallet' : isFlipping ? 'Flipping...' : 'Flip Coin'}
          </button>
        )}
      </div>
    </div>
  )
}
