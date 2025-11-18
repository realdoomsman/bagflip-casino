'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameLayout from './GameLayout'
import { useFlipCasino } from '@/hooks/useFlipCasino'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletBalance } from '@/hooks/useWalletBalance'

export default function CoinFlip() {
  const [choice, setChoice] = useState<'heads' | 'tails' | null>(null)
  const [wager, setWager] = useState('')
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<{ won: boolean; side: string } | null>(null)
  const balance = useWalletBalance()
  const { playCoinFlip, loading } = useFlipCasino()
  const { publicKey } = useWallet()

  const handlePlay = async () => {
    if (!choice || !wager || !publicKey) return
    
    // Client-side validation
    const wagerAmount = parseFloat(wager)
    
    // Validate wager amount
    if (isNaN(wagerAmount) || wagerAmount <= 0) {
      alert('Please enter a valid wager amount')
      return
    }
    
    // Min/Max wager limits
    const MIN_WAGER = 0.000001 // 1,000 lamports
    const MAX_WAGER = 1000 // 1,000,000,000,000 lamports
    
    if (wagerAmount < MIN_WAGER) {
      alert(`Minimum wager is ${MIN_WAGER} $FLIP`)
      return
    }
    
    if (wagerAmount > MAX_WAGER) {
      alert(`Maximum wager is ${MAX_WAGER} $FLIP`)
      return
    }
    
    // Note: Balance check removed for local testing
    // In production, this should check actual wallet balance
    
    // Prevent spam (debounce)
    if (isFlipping || loading) {
      return
    }
    
    setIsFlipping(true)
    setResult(null)
    
    try {
      // Call real Anchor program (Treasury mode)
      const { vrfResult } = await playCoinFlip(wagerAmount, choice === 'heads')
      
      // Faster settlement for Treasury mode (1.5s animation)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Determine result from VRF
      const won = vrfResult.won
      const side = won ? choice : (choice === 'heads' ? 'tails' : 'heads')
      
      setResult({ won, side })
    } catch (error: any) {
      console.error('Error playing:', error)
      const errorMsg = error?.message || 'Transaction failed. Please try again.'
      alert(errorMsg)
    } finally {
      setIsFlipping(false)
    }
  }

  return (
    <GameLayout
      title="COIN FLIP"
      wager={wager}
      setWager={setWager}
      onPlay={handlePlay}
      disabled={!choice || !wager || isFlipping || loading}
      balance={balance}
    >
      <div className="w-full">
        {/* Choice Buttons */}
        {!isFlipping && !result && (
          <div className="flex gap-6 justify-center mb-12">
            <ChoiceButton
              label="HEADS"
              emoji="🪙"
              selected={choice === 'heads'}
              onClick={() => setChoice('heads')}
              color="neon-green"
            />
            <ChoiceButton
              label="TAILS"
              emoji="🎯"
              selected={choice === 'tails'}
              onClick={() => setChoice('tails')}
              color="neon-blue"
            />
          </div>
        )}

        {/* Animation Area */}
        <div className="flex items-center justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
            {isFlipping ? (
              <motion.div
                key="flipping"
                className="text-[180px]"
                animate={{ 
                  rotateY: [0, 1080]
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                🪙
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="text-center w-full"
              >
                {/* Emoji with Glow */}
                <motion.div 
                  className="text-[180px] lg:text-[200px] mb-6"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  style={{
                    filter: result.won 
                      ? 'drop-shadow(0 0 30px rgba(5, 255, 159, 0.8))' 
                      : 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.8))'
                  }}
                >
                  {result.side === 'heads' ? '🪙' : '🎯'}
                </motion.div>
                
                {/* Big Result Text with Glow */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`text-6xl lg:text-7xl font-black neon-glow mb-4 ${
                    result.won ? 'text-neon-green' : 'text-red-500'
                  }`}
                  style={{
                    textShadow: result.won
                      ? '0 0 20px rgba(5, 255, 159, 1), 0 0 40px rgba(5, 255, 159, 0.8)'
                      : '0 0 20px rgba(239, 68, 68, 1), 0 0 40px rgba(239, 68, 68, 0.8)'
                  }}
                >
                  {result.won ? '🎉 YOU WIN!' : '💀 YOU LOSE'}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl lg:text-3xl text-text-secondary font-bold mb-2"
                >
                  Result: {result.side.toUpperCase()}
                </motion.div>
                
                {/* Play Again Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setResult(null)}
                  className="mt-8 px-12 py-4 bg-neon-green text-dark-bg text-xl lg:text-2xl font-black rounded-xl hover:shadow-2xl hover:shadow-neon-green/50 transition-all"
                >
                  🔁 PLAY AGAIN
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="waiting"
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="text-[150px] opacity-30"
                  animate={{ 
                    rotateY: 360,
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  🪙
                </motion.div>
                <div className="text-2xl text-text-secondary mt-6">
                  Choose Heads or Tails
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GameLayout>
  )
}

function ChoiceButton({ label, emoji, selected, onClick, color }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-16 py-8 rounded-2xl text-2xl font-black transition-all ${
        selected 
          ? `bg-${color} text-dark-bg shadow-2xl shadow-${color}/50` 
          : 'glass-panel hover:bg-white/10'
      }`}
    >
      <div className="text-6xl mb-3">{emoji}</div>
      {label}
    </motion.button>
  )
}
