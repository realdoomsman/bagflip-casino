import { PublicKey } from '@solana/web3.js'

// Use a valid placeholder public key (System Program)
const DEFAULT_PUBKEY = '11111111111111111111111111111111'

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || DEFAULT_PUBKEY
)

export const TOKEN_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_TOKEN_MINT || DEFAULT_PUBKEY
)

export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'

export const LAMPORTS_PER_TOKEN = 1e9
