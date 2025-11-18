import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { AnchorWallet } from '@solana/wallet-adapter-react'
import { IDL, FlipCasino } from './idl'

// Use a valid placeholder public key (System Program)
const DEFAULT_PROGRAM_ID = '11111111111111111111111111111111'

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || DEFAULT_PROGRAM_ID
)
export const TREASURY_SEED = Buffer.from('treasury')

export function getProgram(connection: Connection, wallet: AnchorWallet) {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  })
  return new Program(IDL as any, provider)
}

export async function getTreasuryPDA() {
  const [treasuryPDA] = await PublicKey.findProgramAddress(
    [TREASURY_SEED],
    PROGRAM_ID
  )
  return treasuryPDA
}

export async function getGamePDA(player: PublicKey, timestamp: number) {
  const [gamePDA] = await PublicKey.findProgramAddress(
    [
      Buffer.from('game'),
      player.toBuffer(),
      Buffer.from(timestamp.toString()),
    ],
    PROGRAM_ID
  )
  return gamePDA
}

export async function getPvPRoomPDA(creator: PublicKey, timestamp: number) {
  const [roomPDA] = await PublicKey.findProgramAddress(
    [
      Buffer.from('pvp'),
      creator.toBuffer(),
      Buffer.from(timestamp.toString()),
    ],
    PROGRAM_ID
  )
  return roomPDA
}
