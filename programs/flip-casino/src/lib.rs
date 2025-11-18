use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("HmavNzKbLtzpZPoAVmtAoGUAuJ8FDyL41dTGjD8dEU2J");

pub mod state;
pub mod instructions;
pub mod errors;

use instructions::*;
use state::*;

#[program]
pub mod flip_casino {
    use super::*;

    pub fn initialize_treasury(ctx: Context<InitializeTreasury>) -> Result<()> {
        instructions::initialize_treasury(ctx)
    }

    pub fn create_coin_flip(ctx: Context<CreateGame>, wager: u64, choice: bool) -> Result<()> {
        instructions::create_coin_flip(ctx, wager, choice)
    }

    pub fn create_dice_game(ctx: Context<CreateGame>, wager: u64, choice: DiceChoice) -> Result<()> {
        instructions::create_dice_game(ctx, wager, choice)
    }

    pub fn create_even_odd(ctx: Context<CreateGame>, wager: u64, choice: bool) -> Result<()> {
        instructions::create_even_odd(ctx, wager, choice)
    }

    pub fn settle_game(ctx: Context<SettleGame>, vrf_result: [u8; 32]) -> Result<()> {
        instructions::settle_game(ctx, vrf_result)
    }

    pub fn create_pvp_room(ctx: Context<CreatePvPRoom>, wager: u64, game_type: GameType) -> Result<()> {
        instructions::create_pvp_room(ctx, wager, game_type)
    }

    pub fn join_pvp_room(ctx: Context<JoinPvPRoom>) -> Result<()> {
        instructions::join_pvp_room(ctx)
    }

    pub fn settle_pvp(ctx: Context<SettlePvP>, vrf_result: [u8; 32]) -> Result<()> {
        instructions::settle_pvp(ctx, vrf_result)
    }

    pub fn cancel_pvp_room(ctx: Context<CancelPvPRoom>) -> Result<()> {
        instructions::cancel_pvp_room(ctx)
    }

    pub fn withdraw_treasury(ctx: Context<WithdrawTreasury>, amount: u64) -> Result<()> {
        instructions::withdraw_treasury(ctx, amount)
    }
}
