use anchor_lang::prelude::*;

#[account]
pub struct Treasury {
    pub authority: Pubkey,
    pub token_account: Pubkey,
    pub total_wagered: u64,
    pub total_paid: u64,
    pub bump: u8,
}

#[account]
pub struct Game {
    pub player: Pubkey,
    pub wager: u64,
    pub game_type: GameType,
    pub player_choice: u8,
    pub vrf_requested: bool,
    pub settled: bool,
    pub timestamp: i64,
    pub bump: u8,
}

#[account]
pub struct PvPRoom {
    pub creator: Pubkey,
    pub opponent: Option<Pubkey>,
    pub wager: u64,
    pub game_type: GameType,
    pub creator_choice: u8,
    pub opponent_choice: u8,
    pub vrf_requested: bool,
    pub settled: bool,
    pub created_at: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Debug)]
pub enum GameType {
    CoinFlip,
    DiceHighLow,
    EvenOdd,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum DiceChoice {
    Low,  // 1-50
    High, // 51-100
}

impl Treasury {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 8 + 1;
}

impl Game {
    pub const LEN: usize = 8 + 32 + 8 + 1 + 1 + 1 + 1 + 8 + 1;
}

impl PvPRoom {
    pub const LEN: usize = 8 + 32 + 33 + 8 + 1 + 1 + 1 + 1 + 1 + 8 + 1;
}
