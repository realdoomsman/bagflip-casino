# 🎮 Mock Mode - Local Testing

## Current Setup

The frontend is now running in **Mock Mode** for easier local testing.

### What This Means:

Instead of making actual on-chain transactions to the Solana smart contract, the app:
1. Simulates the transaction delay
2. Calls the backend API directly for game logic
3. Uses the VRF service for random number generation
4. Stores results in the database

### Why Mock Mode?

- The smart contract was built with `--no-idl` flag (due to Anchor 0.30.1 issue)
- Without the IDL file, the frontend can't interact with the contract directly
- Mock mode lets you test the full game flow without blockchain transactions

### What Works in Mock Mode:

✅ All game mechanics (Coin Flip, Dice, Even/Odd)
✅ VRF random number generation
✅ Win/loss calculations
✅ Database persistence
✅ Live feed updates
✅ Leaderboard
✅ PvP lobbies
✅ Stats tracking

### What Doesn't Work:

❌ Actual SOL/token transfers
❌ On-chain transaction signatures
❌ Smart contract state verification
❌ Treasury balance from blockchain

### For Production:

To enable full blockchain integration:

1. **Generate IDL**: Build with IDL support
   ```bash
   # This requires fixing the Anchor 0.30.1 IDL generation issue
   anchor build
   ```

2. **Update IDL file**: Copy generated IDL to `app/lib/anchor/idl.ts`

3. **Restore Anchor calls**: Uncomment the original code in `app/hooks/useFlipCasino.ts`

4. **Deploy contract**: Deploy to devnet/mainnet

5. **Update env vars**: Set `NEXT_PUBLIC_PROGRAM_ID` to deployed program

### Testing Now:

You can fully test the casino experience:
1. Connect wallet
2. Play games
3. See results
4. Check leaderboard
5. Try PvP

Everything works except actual blockchain transactions!

### Backend Integration:

The backend API handles:
- VRF random number generation
- Game settlement logic
- Win/loss calculations
- Database updates
- WebSocket notifications

This is the same logic that would run in production, just without the on-chain component.

---

**Ready to test!** 🎲

Open http://localhost:3001 and start playing!
