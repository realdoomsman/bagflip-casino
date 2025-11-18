# $FLIP Casino - Game Modes Explained

## 🏦 Treasury Mode

**Play instantly against the house**

### How It Works:
1. You choose your game and wager amount
2. Your tokens are sent to the Treasury wallet
3. VRF generates a random result
4. **Win**: Treasury sends you 2x your wager
5. **Lose**: Treasury keeps your wager

### Example:
```
You wager: 1,000 $FLIP
You choose: HEADS

Result: HEADS ✅
You receive: 2,000 $FLIP (1,000 profit)

Result: TAILS ❌
You lose: 1,000 $FLIP (Treasury keeps it)
```

### Pros:
- ✅ Instant play, no waiting
- ✅ Always available
- ✅ Simple and fast

### Cons:
- ❌ House has the supply (can run out)
- ❌ Playing against the casino

---

## 👥 PvP Mode

**Challenge other players, winner takes all**

### How It Works:
1. **Create Room**: You lock your wager in escrow
2. **Wait**: Room appears in lobby for others to join
3. **Opponent Joins**: They lock the same wager amount
4. **VRF Decides**: Random result determines winner
5. **Winner Gets All**: 2x wager from escrow (no house cut)

### Example:
```
Player A creates room: 1,000 $FLIP on HEADS
Player B joins room: 1,000 $FLIP on TAILS

Total in escrow: 2,000 $FLIP

Result: HEADS ✅
Player A receives: 2,000 $FLIP
Player B loses: 1,000 $FLIP

Result: TAILS ✅
Player B receives: 2,000 $FLIP
Player A loses: 1,000 $FLIP
```

### Pros:
- ✅ No house edge (0% fee)
- ✅ Fair player vs player
- ✅ Escrow protects both players
- ✅ More exciting (real opponent)

### Cons:
- ❌ Must wait for opponent
- ❌ Room might timeout if no one joins
- ❌ Need matching wager amounts

---

## 🎯 Which Mode to Choose?

### Choose Treasury if:
- You want to play RIGHT NOW
- You don't want to wait for opponents
- You're okay playing against the house
- You want guaranteed availability

### Choose PvP if:
- You want fair 50/50 odds with no house
- You're willing to wait for an opponent
- You want the thrill of competing against real players
- You want to create custom wager amounts

---

## 💰 Economics

### Treasury Mode:
```
House Supply: 100M $FLIP (example)
Your wager: 1,000 $FLIP

Win: House pays 1,000 $FLIP (supply decreases)
Lose: House gains 1,000 $FLIP (supply increases)

Over time: House supply fluctuates based on wins/losses
```

### PvP Mode:
```
Escrow: 0 $FLIP initially
Player A locks: 1,000 $FLIP
Player B locks: 1,000 $FLIP
Escrow total: 2,000 $FLIP

Winner gets: 2,000 $FLIP
Escrow returns to: 0 $FLIP

Treasury not involved at all!
```

---

## 🔐 Security

### Treasury Mode:
- Treasury wallet is a PDA (Program Derived Address)
- Only the program can move funds
- Treasury authority is a multisig (production)
- Rate limits prevent draining

### PvP Mode:
- Funds locked in escrow PDA
- Neither player can withdraw until VRF settles
- Winner determined by verifiable randomness
- Loser can't rug pull

---

## 🎲 Fairness

Both modes use **Switchboard VRF** (Verifiable Random Function):
- ✅ Provably random
- ✅ Cannot be manipulated
- ✅ Verified on-chain
- ✅ Same odds for both modes (50/50)

The only difference is **who you're playing against**, not the fairness of the game.

---

## 🚀 Future Enhancements

### Treasury Mode:
- Dynamic odds based on treasury size
- Bonus multipliers for large wagers
- Loyalty rewards for frequent players

### PvP Mode:
- Tournament brackets
- Spectator mode
- Chat between players
- Leaderboards for PvP wins

---

**TL;DR**: 
- **Treasury** = Fast, play vs house
- **PvP** = Fair, play vs players, no house edge
