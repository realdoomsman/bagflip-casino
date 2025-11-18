export type FlipCasino = {
  "version": "0.1.0",
  "name": "flip_casino",
  "instructions": [
    {
      "name": "initializeTreasury",
      "accounts": [
        { "name": "treasury", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "tokenAccount", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "createCoinFlip",
      "accounts": [
        { "name": "game", "isMut": true, "isSigner": false },
        { "name": "player", "isMut": true, "isSigner": true },
        { "name": "playerTokenAccount", "isMut": true, "isSigner": false },
        { "name": "treasury", "isMut": true, "isSigner": false },
        { "name": "treasuryTokenAccount", "isMut": true, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "wager", "type": "u64" },
        { "name": "choice", "type": "bool" }
      ]
    },
    {
      "name": "settleGame",
      "accounts": [
        { "name": "game", "isMut": true, "isSigner": false },
        { "name": "player", "isMut": true, "isSigner": false },
        { "name": "playerTokenAccount", "isMut": true, "isSigner": false },
        { "name": "treasury", "isMut": true, "isSigner": false },
        { "name": "treasuryTokenAccount", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": false, "isSigner": true },
        { "name": "tokenProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "vrfResult", "type": { "array": ["u8", 32] } }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Treasury",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "authority", "type": "publicKey" },
          { "name": "tokenAccount", "type": "publicKey" },
          { "name": "totalWagered", "type": "u64" },
          { "name": "totalPaid", "type": "u64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "Game",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "player", "type": "publicKey" },
          { "name": "wager", "type": "u64" },
          { "name": "gameType", "type": { "defined": "GameType" } },
          { "name": "playerChoice", "type": "u8" },
          { "name": "vrfRequested", "type": "bool" },
          { "name": "settled", "type": "bool" },
          { "name": "timestamp", "type": "i64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "GameType",
      "type": {
        "kind": "enum",
        "variants": [
          { "name": "CoinFlip" },
          { "name": "DiceHighLow" },
          { "name": "EvenOdd" }
        ]
      }
    }
  ]
}

export const IDL: FlipCasino = {
  "version": "0.1.0",
  "name": "flip_casino",
  "instructions": [
    {
      "name": "initializeTreasury",
      "accounts": [
        { "name": "treasury", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "tokenAccount", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "createCoinFlip",
      "accounts": [
        { "name": "game", "isMut": true, "isSigner": false },
        { "name": "player", "isMut": true, "isSigner": true },
        { "name": "playerTokenAccount", "isMut": true, "isSigner": false },
        { "name": "treasury", "isMut": true, "isSigner": false },
        { "name": "treasuryTokenAccount", "isMut": true, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "wager", "type": "u64" },
        { "name": "choice", "type": "bool" }
      ]
    },
    {
      "name": "settleGame",
      "accounts": [
        { "name": "game", "isMut": true, "isSigner": false },
        { "name": "player", "isMut": true, "isSigner": false },
        { "name": "playerTokenAccount", "isMut": true, "isSigner": false },
        { "name": "treasury", "isMut": true, "isSigner": false },
        { "name": "treasuryTokenAccount", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": false, "isSigner": true },
        { "name": "tokenProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "vrfResult", "type": { "array": ["u8", 32] } }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Treasury",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "authority", "type": "publicKey" },
          { "name": "tokenAccount", "type": "publicKey" },
          { "name": "totalWagered", "type": "u64" },
          { "name": "totalPaid", "type": "u64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "Game",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "player", "type": "publicKey" },
          { "name": "wager", "type": "u64" },
          { "name": "gameType", "type": { "defined": "GameType" } },
          { "name": "playerChoice", "type": "u8" },
          { "name": "vrfRequested", "type": "bool" },
          { "name": "settled", "type": "bool" },
          { "name": "timestamp", "type": "i64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "GameType",
      "type": {
        "kind": "enum",
        "variants": [
          { "name": "CoinFlip" },
          { "name": "DiceHighLow" },
          { "name": "EvenOdd" }
        ]
      }
    }
  ]
}
