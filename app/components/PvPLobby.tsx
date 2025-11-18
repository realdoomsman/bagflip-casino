'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'

interface PvPRoom {
  id: string
  creator: string
  creatorChoice?: string
  wager: number
  gameType: 'CoinFlip' | 'Dice' | 'EvenOdd'
  createdAt: number
  expiresAt: number
  status: 'waiting' | 'playing' | 'finished'
}

export default function PvPLobby() {
  const [rooms, setRooms] = useState<PvPRoom[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [selectedGame, setSelectedGame] = useState<'CoinFlip' | 'Dice' | 'EvenOdd'>('CoinFlip')
  const [wager, setWager] = useState('')
  const [filterGame, setFilterGame] = useState<'all' | 'CoinFlip' | 'Dice' | 'EvenOdd'>('all')
  const [filterWager, setFilterWager] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [showResult, setShowResult] = useState<{ won: boolean; amount: number; game: string } | null>(null)
  const { publicKey } = useWallet()

  useEffect(() => {
    fetchRooms()
    const interval = setInterval(fetchRooms, 3000)
    
    // WebSocket for live updates
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'
    const ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      console.log('PvP WebSocket connected')
    }
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'room_created' || data.type === 'room_joined' || data.type === 'room_cancelled') {
        console.log('Room update:', data)
        fetchRooms() // Refresh rooms on any update
      }
    }
    
    ws.onerror = (error) => {
      console.error('PvP WebSocket error:', error)
    }
    
    return () => {
      clearInterval(interval)
      ws.close()
    }
  }, [])

  const fetchRooms = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(backendUrl + '/api/pvp/rooms')
      const data = await response.json()
      setRooms(data)
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setRooms([])
    }
  }

  const createRoom = async () => {
    if (!publicKey || !wager) {
      alert('Please connect wallet and enter wager amount')
      return
    }

    const wagerAmount = parseFloat(wager)
    // Balance check removed for testing - add back in production

    if (wagerAmount <= 0) {
      alert('Wager must be greater than 0')
      return
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(backendUrl + '/api/pvp/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator: publicKey.toString(),
          wager: parseFloat(wager),
          gameType: selectedGame,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Room created:', result)
        setShowCreate(false)
        setWager('')
        fetchRooms()
        alert('Room created! Waiting for opponent...')
      } else {
        const error = await response.json()
        alert(`Failed to create room: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating room:', error)
      alert('Failed to create room. Please try again.')
    }
  }

  const joinRoom = async (roomId: string) => {
    if (!publicKey) {
      alert('Please connect your wallet')
      return
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(backendUrl + '/api/pvp/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          opponent: publicKey.toString(),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Join result:', result)
        
        // Show result modal
        setShowResult({
          won: result.won,
          amount: result.wager,
          game: result.gameType || 'Game'
        })
        
        fetchRooms()
      } else {
        const error = await response.json()
        alert(`Failed to join room: ${error.error}`)
      }
    } catch (error) {
      console.error('Error joining room:', error)
      alert('Failed to join room. Please try again.')
    }
  }

  const cancelRoom = async (roomId: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(backendUrl + `/api/pvp/cancel/${roomId}`, { 
        method: 'DELETE' 
      })
      
      if (response.ok) {
        alert('Room cancelled. Tokens refunded.')
        fetchRooms()
      }
    } catch (error) {
      console.error('Error canceling room:', error)
      alert('Failed to cancel room.')
    }
  }

  const myRooms = rooms.filter(r => r.creator === publicKey?.toString())
  
  // Filter available rooms
  let availableRooms = rooms.filter(r => r.creator !== publicKey?.toString() && r.status === 'waiting')
  
  // Apply game filter
  if (filterGame !== 'all') {
    availableRooms = availableRooms.filter(r => r.gameType === filterGame)
  }
  
  // Apply wager filter
  if (filterWager !== 'all') {
    availableRooms = availableRooms.filter(r => {
      if (filterWager === 'low') return r.wager < 10000
      if (filterWager === 'medium') return r.wager >= 10000 && r.wager < 100000
      if (filterWager === 'high') return r.wager >= 100000
      return true
    })
  }
  
  // Sort rooms: expiring soon first, then by creation time
  availableRooms.sort((a, b) => {
    const aTimeLeft = a.expiresAt - Date.now()
    const bTimeLeft = b.expiresAt - Date.now()
    const aExpiringSoon = aTimeLeft < 60000
    const bExpiringSoon = bTimeLeft < 60000
    
    // Expiring soon rooms first
    if (aExpiringSoon && !bExpiringSoon) return -1
    if (!aExpiringSoon && bExpiringSoon) return 1
    
    // Then by time remaining (ascending)
    return aTimeLeft - bTimeLeft
  })

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-5xl font-black text-neon-purple neon-glow mb-2">PvP LOBBY</h2>
          <p className="text-text-secondary text-lg">Challenge players. Winner takes all. No house edge.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreate(!showCreate)}
          className="px-8 py-4 bg-neon-green text-dark-bg text-xl font-black rounded-xl hover:shadow-2xl hover:shadow-neon-green/50 transition"
        >
          + CREATE ROOM
        </motion.button>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setShowResult(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel rounded-3xl p-12 max-w-md text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-9xl mb-6"
              >
                {showResult.won ? '🎉' : '💀'}
              </motion.div>
              <div className={`text-6xl font-black mb-4 neon-glow ${
                showResult.won ? 'text-neon-green' : 'text-red-500'
              }`}>
                {showResult.won ? 'YOU WIN!' : 'YOU LOSE'}
              </div>
              <div className="text-3xl font-bold text-text-primary mb-2">
                {showResult.game}
              </div>
              <div className="text-2xl text-text-secondary mb-8">
                {showResult.won 
                  ? `+${(showResult.amount * 2).toLocaleString()} $FLIP`
                  : `-${showResult.amount.toLocaleString()} $FLIP`
                }
              </div>
              <button
                onClick={() => setShowResult(null)}
                className="px-12 py-4 bg-neon-purple text-dark-bg text-xl font-black rounded-xl hover:scale-105 transition"
              >
                CLOSE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Room Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel rounded-3xl p-8 mb-8"
          >
            <h3 className="text-3xl font-black mb-6 text-neon-green">Create PvP Room</h3>
            
            {/* Game Selection */}
            <div className="mb-6">
              <label className="block text-sm text-text-secondary mb-3">Choose Game</label>
              <div className="grid grid-cols-3 gap-4">
                <GameButton
                  label="Coin Flip"
                  emoji="🪙"
                  selected={selectedGame === 'CoinFlip'}
                  onClick={() => setSelectedGame('CoinFlip')}
                />
                <GameButton
                  label="Dice"
                  emoji="🎲"
                  selected={selectedGame === 'Dice'}
                  onClick={() => setSelectedGame('Dice')}
                />
                <GameButton
                  label="Even/Odd"
                  emoji="🔢"
                  selected={selectedGame === 'EvenOdd'}
                  onClick={() => setSelectedGame('EvenOdd')}
                />
              </div>
            </div>

            {/* Wager Input */}
            <div className="mb-6">
              <label className="block text-sm text-text-secondary mb-2">Wager Amount ($FLIP)</label>
              <input
                type="number"
                value={wager}
                onChange={(e) => setWager(e.target.value)}
                placeholder="Enter amount..."
                className="w-full px-4 py-4 bg-dark-panel border-2 border-neon-green/30 focus:border-neon-green outline-none text-2xl font-bold rounded-xl"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={createRoom}
                disabled={!wager}
                className="flex-1 py-4 bg-neon-green text-dark-bg text-xl font-black rounded-xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CREATE ROOM
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-8 py-4 glass-panel rounded-xl hover:bg-white/10 transition font-bold"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* My Rooms */}
      {myRooms.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-black mb-4 text-neon-blue">Your Rooms</h3>
          <div className="space-y-4">
            {myRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                isOwner={true}
                onCancel={() => cancelRoom(room.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass-panel rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Game Type Filter */}
          <div>
            <label className="block text-sm text-text-secondary mb-2">Filter by Game</label>
            <div className="grid grid-cols-4 gap-2">
              <FilterButton label="All" active={filterGame === 'all'} onClick={() => setFilterGame('all')} />
              <FilterButton label="🪙" active={filterGame === 'CoinFlip'} onClick={() => setFilterGame('CoinFlip')} />
              <FilterButton label="🎲" active={filterGame === 'Dice'} onClick={() => setFilterGame('Dice')} />
              <FilterButton label="🔢" active={filterGame === 'EvenOdd'} onClick={() => setFilterGame('EvenOdd')} />
            </div>
          </div>

          {/* Wager Size Filter */}
          <div>
            <label className="block text-sm text-text-secondary mb-2">Filter by Wager</label>
            <div className="grid grid-cols-4 gap-2">
              <FilterButton label="All" active={filterWager === 'all'} onClick={() => setFilterWager('all')} />
              <FilterButton label="Low" active={filterWager === 'low'} onClick={() => setFilterWager('low')} />
              <FilterButton label="Med" active={filterWager === 'medium'} onClick={() => setFilterWager('medium')} />
              <FilterButton label="High" active={filterWager === 'high'} onClick={() => setFilterWager('high')} />
            </div>
          </div>
        </div>
      </div>

      {/* Available Rooms */}
      <div>
        <h3 className="text-2xl font-black mb-4 text-neon-purple">
          Available Rooms ({availableRooms.length})
        </h3>
        {availableRooms.length === 0 ? (
          <div className="glass-panel rounded-3xl p-20 text-center">
            <div className="text-8xl mb-6 opacity-30">🎮</div>
            <div className="text-2xl text-text-secondary mb-4">No rooms available</div>
            <div className="text-text-secondary">Create a room to challenge other players!</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                isOwner={false}
                onJoin={() => joinRoom(room.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RoomCard({ room, isOwner, onJoin, onCancel }: any) {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, Math.floor((room.expiresAt - Date.now()) / 1000)))
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, Math.floor((room.expiresAt - Date.now()) / 1000)))
    }, 1000)
    return () => clearInterval(interval)
  }, [room.expiresAt])
  
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isExpiringSoon = timeLeft < 60

  const gameEmoji: Record<string, string> = {
    CoinFlip: '🪙',
    Dice: '🎲',
    EvenOdd: '🔢',
  }
  
  const emoji = gameEmoji[room.gameType] || '🎮'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`glass-panel rounded-2xl p-6 transition-all ${
        isExpiringSoon ? 'ring-2 ring-red-500 ring-opacity-50' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-5xl">{emoji}</div>
          <div>
            <div className="text-xl font-black text-neon-purple">{room.gameType}</div>
            <div className="text-sm text-text-secondary">
              {room.creator.slice(0, 6)}...{room.creator.slice(-4)}
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="px-3 py-1 bg-neon-blue/20 text-neon-blue text-xs font-bold rounded-full">
            YOUR ROOM
          </div>
        )}
      </div>

      {/* Wager */}
      <div className="mb-4">
        <div className="text-sm text-text-secondary mb-1">Wager</div>
        <div className="text-3xl font-black text-neon-green">
          {room.wager.toLocaleString()} $FLIP
        </div>
      </div>

      {/* Timer with Glow */}
      <div className="mb-4">
        <div className="text-sm text-text-secondary mb-1">Time Remaining</div>
        <div className={`text-xl font-bold transition-all ${
          isExpiringSoon 
            ? 'text-red-500 animate-pulse' 
            : 'text-text-primary'
        } ${isExpiringSoon ? 'drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : ''}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
        {isExpiringSoon && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 mt-1 font-bold"
          >
            ⚠️ Expiring soon!
          </motion.div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${room.status === 'waiting' ? 'bg-neon-green animate-pulse' : 'bg-gray-500'}`}></div>
          <div className="text-sm text-text-secondary capitalize">{room.status}</div>
        </div>
      </div>

      {/* Action Button */}
      {isOwner ? (
        <div className="flex gap-2">
          <div className="flex-1 py-3 glass-panel rounded-xl text-center font-bold text-text-secondary">
            Waiting for opponent...
          </div>
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500/30 transition font-bold"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={onJoin}
          className="w-full py-4 bg-neon-purple text-dark-bg text-xl font-black rounded-xl hover:scale-105 transition"
        >
          JOIN ROOM
        </button>
      )}
    </motion.div>
  )
}

function GameButton({ label, emoji, selected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl transition ${
        selected
          ? 'bg-neon-green text-dark-bg'
          : 'glass-panel hover:bg-white/10'
      }`}
    >
      <div className="text-4xl mb-2">{emoji}</div>
      <div className="font-bold">{label}</div>
    </button>
  )
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-3 rounded-lg font-bold transition ${
        active
          ? 'bg-neon-purple text-dark-bg'
          : 'glass-panel hover:bg-white/10 text-text-secondary'
      }`}
    >
      {label}
    </button>
  )
}
