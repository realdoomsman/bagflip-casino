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
          <h2 className="text-3xl font-bold text-neon-purple mb-2">PvP Lobby</h2>
          <p className="text-text-secondary text-sm">Challenge players. Winner takes all. No house edge.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreate(!showCreate)}
          className="px-6 py-3 bg-gradient-to-r from-neon-green to-emerald-400 text-dark-bg text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-neon-green/25 transition-all duration-300"
        >
          Create Room
        </motion.button>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowResult(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel rounded-2xl p-10 max-w-sm text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.4, repeat: 2 }}
                className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  showResult.won ? 'bg-neon-green/10 border-2 border-neon-green' : 'bg-red-500/10 border-2 border-red-500'
                }`}
              >
                <svg className={`w-10 h-10 ${showResult.won ? 'text-neon-green' : 'text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  {showResult.won ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  )}
                </svg>
              </motion.div>
              <div className={`text-3xl font-bold mb-3 ${
                showResult.won ? 'text-neon-green' : 'text-red-500'
              }`}>
                {showResult.won ? 'You Win' : 'You Lose'}
              </div>
              <div className="text-lg font-medium text-white/90 mb-2">
                {showResult.game}
              </div>
              <div className="text-base text-text-secondary mb-8">
                {showResult.won 
                  ? `+${(showResult.amount * 2).toLocaleString()} $FLIP`
                  : `-${showResult.amount.toLocaleString()} $FLIP`
                }
              </div>
              <button
                onClick={() => setShowResult(null)}
                className="px-8 py-3 bg-gradient-to-r from-neon-purple to-purple-400 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-300"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Room Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel rounded-2xl p-6 mb-8"
          >
            <h3 className="text-xl font-bold mb-5 text-neon-green">Create PvP Room</h3>
            
            {/* Game Selection */}
            <div className="mb-5">
              <label className="block text-sm text-text-secondary mb-3">Choose Game</label>
              <div className="grid grid-cols-3 gap-3">
                <GameButton
                  label="Coin Flip"
                  selected={selectedGame === 'CoinFlip'}
                  onClick={() => setSelectedGame('CoinFlip')}
                />
                <GameButton
                  label="Dice"
                  selected={selectedGame === 'Dice'}
                  onClick={() => setSelectedGame('Dice')}
                />
                <GameButton
                  label="Even/Odd"
                  selected={selectedGame === 'EvenOdd'}
                  onClick={() => setSelectedGame('EvenOdd')}
                />
              </div>
            </div>

            {/* Wager Input */}
            <div className="mb-5">
              <label className="block text-sm text-text-secondary mb-2">Wager Amount ($FLIP)</label>
              <input
                type="number"
                value={wager}
                onChange={(e) => setWager(e.target.value)}
                placeholder="Enter amount..."
                className="w-full px-4 py-3 bg-dark-panel border border-white/10 focus:border-neon-green/50 outline-none text-xl font-bold rounded-xl transition-colors"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={createRoom}
                disabled={!wager}
                className="flex-1 py-3 bg-gradient-to-r from-neon-green to-emerald-400 text-dark-bg text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-neon-green/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Room
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-6 py-3 glass-panel rounded-xl hover:bg-white/5 transition-all duration-300 text-sm font-medium"
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
          <h3 className="text-lg font-bold mb-4 text-neon-blue">Your Rooms</h3>
          <div className="space-y-3">
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
      <div className="glass-panel rounded-2xl p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Game Type Filter */}
          <div>
            <label className="block text-xs text-text-secondary mb-2 font-medium">Filter by Game</label>
            <div className="grid grid-cols-4 gap-2">
              <FilterButton label="All" active={filterGame === 'all'} onClick={() => setFilterGame('all')} />
              <FilterButton label="Flip" active={filterGame === 'CoinFlip'} onClick={() => setFilterGame('CoinFlip')} />
              <FilterButton label="Dice" active={filterGame === 'Dice'} onClick={() => setFilterGame('Dice')} />
              <FilterButton label="E/O" active={filterGame === 'EvenOdd'} onClick={() => setFilterGame('EvenOdd')} />
            </div>
          </div>

          {/* Wager Size Filter */}
          <div>
            <label className="block text-xs text-text-secondary mb-2 font-medium">Filter by Wager</label>
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
        <h3 className="text-lg font-bold mb-4 text-neon-purple">
          Available Rooms ({availableRooms.length})
        </h3>
        {availableRooms.length === 0 ? (
          <div className="glass-panel rounded-2xl p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl border border-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-lg text-white/80 mb-2">No rooms available</div>
            <div className="text-sm text-text-secondary">Create a room to challenge other players</div>
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

  const gameLabel: Record<string, string> = {
    CoinFlip: 'Flip',
    Dice: 'Dice',
    EvenOdd: 'E/O',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`glass-panel rounded-2xl p-5 transition-all ${
        isExpiringSoon ? 'ring-1 ring-red-500/50' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center">
            <span className="text-sm font-bold text-neon-purple">{gameLabel[room.gameType] || 'Game'}</span>
          </div>
          <div>
            <div className="text-base font-bold text-white/90">{room.gameType}</div>
            <div className="text-xs text-text-secondary font-mono">
              {room.creator.slice(0, 6)}...{room.creator.slice(-4)}
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="px-2.5 py-1 bg-neon-blue/10 text-neon-blue text-xs font-medium rounded-lg border border-neon-blue/20">
            Your Room
          </div>
        )}
      </div>

      {/* Wager */}
      <div className="mb-4">
        <div className="text-xs text-text-secondary mb-1">Wager</div>
        <div className="text-xl font-bold text-neon-green">
          {room.wager.toLocaleString()} $FLIP
        </div>
      </div>

      {/* Timer */}
      <div className="mb-4">
        <div className="text-xs text-text-secondary mb-1">Time Remaining</div>
        <div className={`text-base font-semibold transition-all ${
          isExpiringSoon ? 'text-red-500' : 'text-white/80'
        }`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
        {isExpiringSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-500 mt-1 font-medium"
          >
            Expiring soon
          </motion.div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${room.status === 'waiting' ? 'bg-neon-green' : 'bg-gray-500'}`}></div>
          <div className="text-xs text-text-secondary capitalize">{room.status}</div>
        </div>
      </div>

      {/* Action Button */}
      {isOwner ? (
        <div className="flex gap-2">
          <div className="flex-1 py-2.5 glass-panel rounded-xl text-center text-sm font-medium text-text-secondary">
            Waiting for opponent...
          </div>
          <button
            onClick={onCancel}
            className="px-4 py-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all duration-300 text-sm font-medium border border-red-500/20"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={onJoin}
          className="w-full py-3 bg-gradient-to-r from-neon-purple to-purple-400 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-300"
        >
          Join Room
        </button>
      )}
    </motion.div>
  )
}

function GameButton({ label, selected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl transition-all duration-300 ${
        selected
          ? 'bg-gradient-to-r from-neon-green to-emerald-400 text-dark-bg'
          : 'glass-panel hover:bg-white/5'
      }`}
    >
      <div className="text-sm font-bold">{label}</div>
    </button>
  )
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300 ${
        active
          ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
          : 'glass-panel hover:bg-white/5 text-text-secondary'
      }`}
    >
      {label}
    </button>
  )
}
