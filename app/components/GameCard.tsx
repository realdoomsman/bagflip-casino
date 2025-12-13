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

const iconMap: Record<string, React.ReactNode> = {
  coin: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v12M9 9h6M9 15h6" />
    </svg>
  ),
  dice: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="16" r="1.5" fill="currentColor" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  ),
  numbers: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 8v8M12 8v8M16 8v8" />
    </svg>
  ),
}

export default function GameCard({
  title,
  subtitle,
  icon,
  buttonText,
  color,
  onClick,
}: GameCardProps) {
  const IconComponent = iconMap[icon] || iconMap.coin

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className="rounded-2xl p-6 cursor-pointer bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
      onClick={onClick}
    >
      {/* Icon */}
      <div
        className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center mb-5 ${color}`}
      >
        {IconComponent}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-1.5 text-white">{title}</h3>

      {/* Subtitle */}
      <p className="text-text-secondary text-sm mb-6">{subtitle}</p>

      {/* Odds indicator */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div className="w-1/2 h-full bg-neon-green/60 rounded-full" />
        </div>
        <span className="text-xs text-text-secondary">50% odds</span>
      </div>

      {/* Button */}
      <button className="w-full py-2.5 text-sm font-medium rounded-xl bg-white text-black hover:bg-white/90 transition-all duration-300">
        {buttonText}
      </button>
    </motion.div>
  )
}
