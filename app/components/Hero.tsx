'use client'

import { motion } from 'framer-motion'

export default function Hero({ onPlayNow }: { onPlayNow: () => void }) {
  return (
    <div className="text-center py-20">
      {/* Simple bag emoji */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-9xl mb-6"
      >
        💰
      </motion.div>

      {/* Logo */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-7xl md:text-8xl font-black mb-4 text-neon-green"
        style={{ textShadow: '0 0 20px rgba(0, 255, 157, 0.5)' }}
      >
        BAGFLIP
      </motion.h1>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-black mb-8 text-neon-blue"
      >
        $FLIP
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl md:text-3xl font-bold mb-3 text-white"
      >
        Flip Your Bag. Win Big.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-gray-400 mb-10 max-w-xl mx-auto px-4"
      >
        100% fair VRF-powered casino on Solana
      </motion.p>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onPlayNow}
        className="px-12 py-5 text-2xl font-black bg-neon-green text-black rounded-xl hover:bg-emerald-400 transition-colors"
      >
        PLAY NOW 🎮
      </motion.button>
    </div>
  )
}
