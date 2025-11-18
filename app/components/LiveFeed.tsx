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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black text-neon-blue">
          LIVE FEED
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400 font-bold">LIVE</span>
        </div>
      </div>
      
      <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">👀</div>
              <div>Waiting for games...</div>
            </div>
          ) : (
            events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-panel p-3 rounded-lg hover:bg-white/5 transition-colors border-l-2"
                style={{ borderLeftColor: event.won ? '#00ff9d' : '#ef4444' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400 font-mono">
                        {event.player.slice(0, 4)}...{event.player.slice(-4)}
                      </span>
                      <span className={`text-xs font-bold ${event.won ? 'text-neon-green' : 'text-red-500'}`}>
                        {event.won ? 'WON' : 'LOST'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {formatWager(event.wager)} $FLIP
                      </span>
                      <span className="text-xs text-gray-500">
                        {event.game}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {getTimeAgo(event.timestamp)}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
