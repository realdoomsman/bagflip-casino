'use client'

import { motion } from 'framer-motion'

interface GameCardProps {
  title: string
  subtitle: string
  icon: string
  buttonText: string
  color: string
  onClick: () => void
}

export default function GameCard({ title, subtitle, icon, buttonText, color, onClick }: GameCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      className="glass-panel rounded-2xl p-8 cursor-pointer border border-white/10 hover:border-white/20 transition-all"
      onClick={onClick}
    >
      {/* Icon */}
      <div className="text-7xl mb-4">
        {icon}
      </div>

      {/* Title */}
      <h3 className={`text-3xl font-black mb-3 ${color}`}>
        {title}
      </h3>

      {/* Subtitle */}
      <p className="text-gray-400 text-base mb-6">
        {subtitle}
      </p>

      {/* Button */}
      <button
        className={`w-full py-3 text-lg font-bold rounded-lg border-2 ${color} hover:bg-white/5 transition-colors`}
      >
        {buttonText} →
      </button>
    </motion.div>
  )
}
