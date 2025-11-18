use anchor_lang::prelude::*;

#[error_code]
pub enum CasinoError {
    #[msg("Game already settled")]
    AlreadySettled,
    #[msg("PvP room is full")]
    RoomFull,
    #[msg("No opponent joined")]
    NoOpponent,
    #[msg("Invalid VRF result")]
    InvalidVRF,
    #[msg("Insufficient treasury balance")]
    InsufficientTreasury,
    #[msg("Wager amount too low")]
    WagerTooLow,
    #[msg("Wager amount too high")]
    WagerTooHigh,
    #[msg("VRF not requested yet")]
    VRFNotRequested,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Room expired")]
    RoomExpired,
    #[msg("Invalid game state")]
    InvalidGameState,
}
