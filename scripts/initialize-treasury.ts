import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { FlipCasino } from '../target/types/flip_casino'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token'

async function main() {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.FlipCasino as Program<FlipCasino>
  
  console.log('🏦 Initializing Treasury...')
  
  // Create $FLIP token mint
  const mint = await createMint(
    provider.connection,
    provider.wallet.payer,
    provider.wallet.publicKey,
    null,
    9
  )
  
  console.log('💰 Token mint created:', mint.toString())
  
  // Get treasury PDA
  const [treasuryPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('treasury')],
    program.programId
  )
  
  // Create treasury token account
  const treasuryTokenAccount = await getOrCreateAssociatedTokenAccount(
    provider.connection,
    provider.wallet.payer,
    mint,
    treasuryPDA,
    true
  )
  
  // Mint initial supply to treasury (100M tokens)
  await mintTo(
    provider.connection,
    provider.wallet.payer,
    mint,
    treasuryTokenAccount.address,
    provider.wallet.publicKey,
    100_000_000 * 1e9
  )
  
  console.log('💵 Minted 100M tokens to treasury')
  
  // Initialize treasury
  const tx = await program.methods
    .initializeTreasury()
    .accounts({
      treasury: treasuryPDA,
      authority: provider.wallet.publicKey,
      tokenAccount: treasuryTokenAccount.address,
      systemProgram: SystemProgram.programId,
    })
    .rpc()
  
  console.log('✅ Treasury initialized!')
  console.log('Transaction:', tx)
  console.log('Treasury PDA:', treasuryPDA.toString())
  console.log('Token Mint:', mint.toString())
  console.log('Treasury Token Account:', treasuryTokenAccount.address.toString())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
