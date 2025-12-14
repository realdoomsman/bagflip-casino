'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let success = false
      if (mode === 'login') {
        success = await login(username, password)
        if (!success) setError('Invalid username or password')
      } else {
        success = await register(username, password, email || undefined)
        if (!success) setError('Username or email already taken')
      }

      if (success) {
        onClose()
        setUsername('')
        setPassword('')
        setEmail('')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="card p-6 w-full max-w-sm"
          >
            <h2 className="text-xl font-bold text-white mb-1">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-[#5a6a7a] text-sm mb-5">
              {mode === 'login'
                ? 'Sign in to play with your balance'
                : 'Sign up to start flipping'}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full h-11 bg-[#080c14] border border-[#1e2a3a] rounded-lg px-4 text-white text-sm focus:outline-none focus:border-[#f7b32b] transition"
                  required
                  minLength={3}
                  maxLength={20}
                />
                {mode === 'register' && (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email (optional)"
                    className="w-full h-11 bg-[#080c14] border border-[#1e2a3a] rounded-lg px-4 text-white text-sm focus:outline-none focus:border-[#f7b32b] transition"
                  />
                )}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-11 bg-[#080c14] border border-[#1e2a3a] rounded-lg px-4 text-white text-sm focus:outline-none focus:border-[#f7b32b] transition"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs mb-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm mb-3"
              >
                {loading
                  ? 'Loading...'
                  : mode === 'login'
                    ? 'Sign In'
                    : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-[#5a6a7a] text-xs">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => setMode('register')}
                    className="text-[#f7b32b] hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-[#f7b32b] hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
