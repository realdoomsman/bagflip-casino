'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bagflip-casino-production.up.railway.app'

interface PvPRoom {
  id: string
  creator: string
  wager: number
  gameType: 'CoinFlip' | 'Dice' | 'EvenOdd'
  createdAt: number
  expiresAt: number
  status: 'waiting' | 'playing' | 'finished'
}

export default function PvPLobby() {
  const { user, token, refreshUser } = useAuth()
  const [rooms, setRooms] = useState<PvPRoom[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [selectedGame, setSelectedGame] = useState<
    'CoinFlip' | 'Dice' | 'EvenOdd'
  >('CoinFlip')
  const [wager, setWager] = useState('')
  const [showResult, setShowResult] = useState<{
    won: boolean
    amount: number
  } | null>(null)

  useEffect(() => {
    fetchRooms()
    const interval = setInterval(fetchRooms, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/api/pvp/rooms`)
      if (response.ok) {
        const data = await response.json()
        setRooms(data)
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }

  const createRoom = async () => {
    if (!user || !token || !wager) return
    const amt = parseInt(wager)
    if (amt > user.balance) {
      alert('Insufficient balance')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/pvp/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          creator: user.username,
          wager: amt,
          gameType: selectedGame,
        }),
      })

      if (response.ok) {
        setShowCreate(false)
        setWager('')
        fetchRooms()
      }
    } catch (error) {
      console.error('Error creating room:', error)
    }
  }

  const joinRoom = async (roomId: string) => {
    if (!user || !token) return

    try {
      const response = await fetch(`${API_URL}/api/pvp/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId,
          opponent: user.username,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setShowResult({ won: result.won, amount: result.wager })
        fetchRooms()
        refreshUser()
      }
    } catch (error) {
      console.error('Error joining room:', error)
    }
  }

  const cancelRoom = async (roomId: string) => {
    try {
      await fetch(`${API_URL}/api/pvp/cancel/${roomId}`, { method: 'DELETE' })
      fetchRooms()
    } catch (error) {
      console.error('Error canceling room:', error)
    }
  }

  const myRooms = rooms.filter((r) => r.creator === user?.username)
  const availableRooms = rooms.filter(
    (r) => r.creator !== user?.username && r.status === 'waiting'
  )

  const gameLabels: Record<string, string> = {
    CoinFlip: 'Flip',
    Dice: 'Dice',
    EvenOdd: 'E/O',
  }

  if (!user) {
    return (
      <div className="card p-8 text-center">
        <p className="text-[#5a6a7a] text-sm mb-3">Sign in to play PvP</p>
        <p className="text-[#3a4556] text-xs">
          Challenge other players and winner takes all!
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg">
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
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-6 text-center max-w-xs"
            >
              <div
                className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center ${
                  showResult.won ? 'bg-green-400/10' : 'bg-red-400/10'
                }`}
              >
                {showResult.won ? (
                  <svg
                    className="w-7 h-7 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg
                    className="w-7 h-7 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div
                className={`text-xl font-bold mb-1 ${showResult.won ? 'text-green-400' : 'text-red-400'}`}
              >
                {showResult.won ? 'You Won!' : 'You Lost'}
              </div>
              <div
                className={`text-lg mb-4 ${showResult.won ? 'text-green-400' : 'text-red-400'}`}
              >
                {showResult.won
                  ? `+${showResult.amount * 2}`
                  : `-${showResult.amount}`}{' '}
                $BAG
              </div>
              <button
                onClick={() => setShowResult(null)}
                className="btn-primary px-6 py-2"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <p className="text-[#5a6a7a] text-sm">
          Winner takes all. No house edge.
        </p>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 4v16m8-8H4" />
          </svg>
          Create
        </button>
      </div>

      {/* Create Room */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-4 mb-5"
          >
            <div className="mb-3">
              <label className="text-xs text-[#5a6a7a] mb-2 block uppercase tracking-wider">
                Game
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['CoinFlip', 'Dice', 'EvenOdd'] as const).map((game) => (
                  <button
                    key={game}
                    onClick={() => setSelectedGame(game)}
                    className={`btn-outline py-2 text-xs ${selectedGame === game ? 'active' : ''}`}
                  >
                    {gameLabels[game]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs text-[#5a6a7a] mb-2 block uppercase tracking-wider">
                Wager
              </label>
              <input
                type="number"
                value={wager}
                onChange={(e) => setWager(e.target.value)}
                placeholder="Amount in $BAG"
                className="w-full h-10 bg-[#080c14] border border-[#1e2a3a] rounded-lg px-3 text-white text-sm focus:outline-none focus:border-[#f7b32b] transition"
              />
              <p className="text-[10px] text-[#3a4556] mt-1">
                Balance: {user.balance.toLocaleString()} $BAG
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={createRoom}
                disabled={!wager || parseInt(wager) > user.balance}
                className="btn-primary flex-1 py-2.5 text-sm"
              >
                Create Room
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="btn-outline px-4 py-2.5 text-sm"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* My Rooms */}
      {myRooms.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs text-[#f7b32b] uppercase tracking-wider mb-2">
            Your Rooms
          </h3>
          <div className="space-y-1.5">
            {myRooms.map((room) => (
              <div
                key={room.id}
                className="card p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f7b32b]/10 flex items-center justify-center text-[#f7b32b] text-xs font-bold">
                    {gameLabels[room.gameType]}
                  </div>
                  <div>
                    <div className="text-[#f7b32b] text-sm font-medium">
                      {room.wager.toLocaleString()} $BAG
                    </div>
                    <div className="text-[10px] text-[#3a4556]">Waiting...</div>
                  </div>
                </div>
                <button
                  onClick={() => cancelRoom(room.id)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Rooms */}
      <div>
        <h3 className="text-xs text-[#5a6a7a] uppercase tracking-wider mb-2">
          Open Rooms ({availableRooms.length})
        </h3>
        {availableRooms.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#151d2a] flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-[#3a4556]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-[#5a6a7a] text-sm">No rooms available</p>
            <p className="text-[#3a4556] text-xs mt-1">
              Create one to challenge others
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {availableRooms.map((room) => (
              <div
                key={room.id}
                className="card p-3 flex items-center justify-between hover:border-[#1e2a3a] transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f7b32b]/10 flex items-center justify-center text-[#f7b32b] text-xs font-bold">
                    {gameLabels[room.gameType]}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">
                      {room.wager.toLocaleString()} $BAG
                    </div>
                    <div className="text-[10px] text-[#3a4556]">
                      by {room.creator}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => joinRoom(room.id)}
                  disabled={room.wager > user.balance}
                  className="btn-primary px-4 py-1.5 text-xs"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
