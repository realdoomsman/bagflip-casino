# 🤝 PvP System - Complete Guide

## How PvP Works

### Overview
Players challenge each other to 50/50 games. Winner takes both wagers. No house edge.

---

## 🎮 User Flow

### Creating a Room

```
1. Player A clicks "CREATE ROOM"
   ↓
2. Selects game type (Coin Flip, Dice, Even/Odd)
   ↓
3. Enters wager amount (e.g., 10,000 $FLIP)
   ↓
4. Clicks "CREATE ROOM"
   ↓
5. Room appears in lobby with:
   - Game type
   - Wager amount
   - Creator wallet
   - 5-minute countdown timer
   ↓
6. Player A waits for opponent...
```

### Joining a Room

```
1. Player B sees room in lobby
   ↓
2. Checks:
   - Game type (do I want to play this?)
   - Wager amount (can I afford this?)
   - Time remaining (is there enough time?)
   ↓
3. Clicks "JOIN ROOM"
   ↓
4. Both players' tokens locked in escrow
   ↓
5. VRF generates random result
   ↓
6. Winner determined
   ↓
7. Winner receives both wagers (2x)
   ↓
8. Room disappears from lobby
```

---

## 💰 Money Flow

### Example: Coin Flip PvP

```
Player A creates room:
├─ Wager: 10,000 $FLIP
├─ Choice: HEADS (locked in)
└─ Tokens: Locked in escrow

Player B joins:
├─ Wager: 10,000 $FLIP (must match)
├─ Choice: TAILS (automatic opposite)
└─ Tokens: Locked in escrow

Escrow now holds: 20,000 $FLIP

VRF Result: HEADS
├─ Player A wins
├─ Receives: 20,000 $FLIP
└─ Player B loses: 10,000 $FLIP

VRF Result: TAILS
├─ Player B wins
├─ Receives: 20,000 $FLIP
└─ Player A loses: 10,000 $FLIP
```

---

## 🏗️ Technical Implementation

### Smart Contract Flow

```solidity
1. create_pvp_room(wager, game_type)
   ├─ Create room PDA
   ├─ Lock creator's tokens in escrow
   ├─ Set expiration (5 minutes)
   └─ Emit RoomCreated event

2. join_pvp_room(room_id)
   ├─ Verify room exists and is waiting
   ├─ Lock opponent's tokens in escrow
   ├─ Request VRF randomness
   └─ Update room status to "playing"

3. settle_pvp(room_id, vrf_result)
   ├─ Verify VRF signature
   ├─ Determine winner based on result
   ├─ Transfer both wagers to winner
   ├─ Close room PDA
   └─ Emit GameSettled event
```

### Backend API

```typescript
// Get all active rooms
GET /api/pvp/rooms
Response: [
  {
    id: "room_123",
    creator: "ABC...XYZ",
    wager: 10000,
    gameType: "CoinFlip",
    createdAt: 1234567890,
    expiresAt: 1234567890 + 300000,
    status: "waiting"
  }
]

// Create new room
POST /api/pvp/create
Body: {
  creator: "ABC...XYZ",
  wager: 10000,
  gameType: "CoinFlip"
}
Response: {
  success: true,
  roomId: "room_123"
}

// Join existing room
POST /api/pvp/join
Body: {
  roomId: "room_123",
  opponent: "DEF...UVW"
}
Response: {
  success: true,
  winner: "ABC...XYZ",
  won: false
}

// Cancel room (creator only)
DELETE /api/pvp/cancel/:roomId
Response: {
  success: true
}
```

---

## ⏱️ Room Lifecycle

### States

```
WAITING (0-5 minutes)
├─ Room visible in lobby
├─ Creator can cancel
├─ Others can join
└─ Timer counting down

PLAYING (instant)
├─ Opponent joined
├─ VRF requested
├─ Result calculated
└─ Winner determined

FINISHED
├─ Winner paid out
├─ Room removed from lobby
└─ PDA closed
```

### Expiration

```
If no one joins after 5 minutes:
├─ Room automatically expires
├─ Creator's tokens unlocked
├─ Room removed from lobby
└─ Creator can create new room
```

---

## 🎲 Game-Specific Logic

### Coin Flip
```
Creator chooses: HEADS
Opponent gets: TAILS (automatic)

VRF generates: 0 or 1
├─ 0 = TAILS → Opponent wins
└─ 1 = HEADS → Creator wins
```

### Dice High/Low
```
Creator chooses: HIGH (51-100)
Opponent gets: LOW (1-50) (automatic)

VRF generates: 1-100
├─ 1-50 = LOW → Opponent wins
└─ 51-100 = HIGH → Creator wins
```

### Even/Odd
```
Creator chooses: EVEN
Opponent gets: ODD (automatic)

VRF generates: 1-100
├─ Even number → Creator wins
└─ Odd number → Opponent wins
```

---

## 🛡️ Security Features

### Anti-Cheat
```typescript
// Prevent same user joining own room
if (opponent === room.creator) {
  return error("Cannot join your own room")
}

// Verify wager matches
if (opponentWager !== room.wager) {
  return error("Wager must match room wager")
}

// Check room not expired
if (now > room.expiresAt) {
  return error("Room expired")
}

// Verify room status
if (room.status !== 'waiting') {
  return error("Room not available")
}
```

### Escrow Protection
```
✅ Tokens locked in PDA (program-owned)
✅ Neither player can withdraw until settled
✅ Only program can move tokens
✅ VRF result determines winner
✅ Loser cannot rug pull
```

---

## 📱 UI Components

### Lobby View
```
┌─────────────────────────────────────┐
│  PvP LOBBY          [CREATE ROOM]   │
├─────────────────────────────────────┤
│                                     │
│  Your Rooms (1)                     │
│  ┌─────────────────────────────┐   │
│  │ 🪙 Coin Flip                │   │
│  │ 10,000 $FLIP                │   │
│  │ Time: 4:23                  │   │
│  │ [Waiting...] [Cancel]       │   │
│  └─────────────────────────────┘   │
│                                     │
│  Available Rooms (3)                │
│  ┌──────────┐ ┌──────────┐         │
│  │ 🎲 Dice  │ │ 🔢 Even  │         │
│  │ 5K $FLIP │ │ 20K $FLIP│         │
│  │ [JOIN]   │ │ [JOIN]   │         │
│  └──────────┘ └──────────┘         │
└─────────────────────────────────────┘
```

### Create Room Modal
```
┌─────────────────────────────────────┐
│  Create PvP Room                    │
├─────────────────────────────────────┤
│                                     │
│  Choose Game:                       │
│  [🪙 Coin] [🎲 Dice] [🔢 Even/Odd] │
│                                     │
│  Wager Amount:                      │
│  [________] $FLIP                   │
│                                     │
│  [CREATE ROOM] [Cancel]             │
└─────────────────────────────────────┘
```

### Waiting Screen (for creator)
```
┌─────────────────────────────────────┐
│  Waiting for Opponent...            │
├─────────────────────────────────────┤
│                                     │
│         🎮                          │
│                                     │
│  Room ID: room_123                  │
│  Game: Coin Flip                    │
│  Wager: 10,000 $FLIP                │
│                                     │
│  Time Remaining: 4:23               │
│                                     │
│  [Cancel Room]                      │
└─────────────────────────────────────┘
```

### Playing Screen (for both)
```
┌─────────────────────────────────────┐
│  Game Starting...                   │
├─────────────────────────────────────┤
│                                     │
│  You: HEADS                         │
│  Opponent: TAILS                    │
│                                     │
│  Wager: 10,000 $FLIP each           │
│  Prize Pool: 20,000 $FLIP           │
│                                     │
│  [Flipping coin...]                 │
└─────────────────────────────────────┘
```

---

## 🎯 User Experience Tips

### For Creators
```
✅ Set reasonable wager amounts
✅ Popular amounts: 1K, 5K, 10K, 50K, 100K
✅ Lower amounts = faster matches
✅ Higher amounts = bigger thrill
✅ Can cancel anytime before someone joins
```

### For Joiners
```
✅ Check wager amount before joining
✅ Make sure you have enough balance
✅ Check time remaining (need 30+ seconds)
✅ Once joined, no backing out
✅ Result is instant after joining
```

---

## 📊 Analytics to Track

### Room Metrics
```
- Total rooms created
- Average wait time
- Match success rate
- Most popular game type
- Most popular wager amounts
- Peak hours for PvP
```

### Player Metrics
```
- PvP win rate per player
- Total PvP volume
- Biggest PvP wins
- Most active PvP players
- Average wager size
```

---

## 🚀 Future Enhancements

### Phase 2
- [ ] Private rooms (invite-only)
- [ ] Best of 3 matches
- [ ] Spectator mode
- [ ] Chat between players
- [ ] Rematch button

### Phase 3
- [ ] Tournaments (bracket style)
- [ ] Leaderboards (PvP only)
- [ ] Achievements/badges
- [ ] Replay system
- [ ] Betting on other matches

---

## 💡 Marketing Angles

**Why PvP is Better:**
```
Treasury Mode:
- Play vs house
- House has unlimited supply
- You're alone

PvP Mode:
- Play vs real players
- Winner takes all
- No house edge
- More exciting
- Bragging rights
```

**Social Proof:**
```
"@whale just won 100K $FLIP in PvP!"
"@degen lost 50K to @shark in Coin Flip"
"PvP room filled in 3 seconds!"
```

---

## 🎉 TL;DR

1. **Create Room**: Choose game, set wager, wait
2. **Join Room**: See room, click join, instant game
3. **Winner Takes All**: 2x wager, no fees
4. **5 Min Timeout**: Room expires if no one joins
5. **Fair & Fast**: VRF verified, instant results

**PvP = Pure player vs player action. No house. Just degens battling it out. 🔥**
