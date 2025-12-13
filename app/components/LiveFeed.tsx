'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GameEvent {
  id: string
  player: string
  game: string
  wager: number
  won: boolean
  timestamp: number
  result?: number
}

export default function LiveFeed({ limit = 20 }: { limit?: number }) {
  const [events, setEvents] = useState<GameEvent[]>([])

  useEffect(() => {
    // Fetch initial feed
    fetchLiveFeed()

    // Setup WebSocket for real-time updates
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'
    const ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      console.log('[LIVE FEED] WebSocket connected')
    }
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.type === 'game_result' || data.type === 'treasury_game_result') {
        setEvents(prev => [data.event, ...prev].slice(0, limit))
      } else if (data.type === 'pvp_result') {
        // Add PvP result to feed
        const pvpEvent = {
          id: data.roomId,
          player: data.winner,
          game: `PvP ${data.gameType}`,
          wager: data.wager,
          won: true,
          timestamp: Date.now()
        }
        setEvents(prev => [pvpEvent, ...prev].slice(0, limit))
      }
    }
    
    ws.onerror = (error) => {
      console.error('[LIVE FEED] WebSocket error:', error)
    }

    return () => ws.close()
  }, [limit])

  const fetchLiveFeed = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(`${backendUrl}/api/live-feed?limit=${limit}`)
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('[LIVE FEED] Error fetching:', error)
    }
  }

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const formatWager = (wager: number) => {
    if (wager >= 1000000) return `${(wager / 1000000).toFixed(1)}M`
    if (wager >= 1000) return `${(wager / 1000).toFixed(1)}K`
    return wager.toString()
  }

  return (
    <div className="w-full">
      <div className="space-y-2 max-h-[450px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {events.length === 0 ? (
            <div className="text-center py-6 text-text-secondary">
              <div className="text-xs">No recent activity</div>
            </div>
          ) : (
            events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-secondary font-mono">
                    {event.player.slice(0, 4)}...{event.player.slice(-4)}
                  </span>
                  <span className="text-xs text-text-secondary">{getTimeAgo(event.timestamp)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">{formatWager(event.wager)} SOL</span>
                  <span
                    className={`text-xs font-medium ${event.won ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {event.won ? 'Won' : 'Lost'}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
