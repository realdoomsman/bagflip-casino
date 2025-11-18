use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;

#[derive(Accounts)]
pub struct CreateGame<'info> {
    #[account(
        init,
        payer = player,
        space = Game::LEN,
        seeds = [b"game", player.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub game: Account<'info, Game>,
    
    #[account(mut)]
    pub player: Signer<'info>,
    
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"treasury"],
        bump = treasury.bump
    )]
    pub treasury: Account<'info, Treasury>,
    
    #[account(mut)]
    pub treasury_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn create_coin_flip(ctx: Context<CreateGame>, wager: u64, choice: bool) -> Result<()> {
    create_game_internal(ctx, wager, GameType::CoinFlip, choice as u8)
}

pub fn create_dice_game(ctx: Context<CreateGame>, wager: u64, choice: DiceChoice) -> Result<()> {
    create_game_internal(ctx, wager, GameType::DiceHighLow, choice as u8)
}

pub fn create_even_odd(ctx: Context<CreateGame>, wager: u64, choice: bool) -> Result<()> {
    create_game_internal(ctx, wager, GameType::EvenOdd, choice as u8)
}

fn create_game_internal(ctx: Context<CreateGame>, wager: u64, game_type: GameType, choice: u8) -> Result<()> {
    // Anti-cheat: Validate wager amount
    const MIN_WAGER: u64 = 1_000; // 0.000001 tokens (assuming 9 decimals)
    const MAX_WAGER: u64 = 1_000_000_000_000; // 1000 tokens
    
    require!(wager >= MIN_WAGER, crate::errors::CasinoError::WagerTooLow);
    require!(wager <= MAX_WAGER, crate::errors::CasinoError::WagerTooHigh);
    
    // Anti-cheat: Check treasury has enough to pay out if player wins
    let potential_payout = wager * 2;
    require!(
        ctx.accounts.treasury_token_account.amount >= potential_payout,
        crate::errors::CasinoError::InsufficientTreasury
    );

    // Lock player's wager
    let cpi_accounts = Transfer {
        from: ctx.accounts.player_token_account.to_account_info(),
        to: ctx.accounts.treasury_token_account.to_account_info(),
        authority: ctx.accounts.player.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, wager)?;

    let game = &mut ctx.accounts.game;
    game.player = ctx.accounts.player.key();
    game.wager = wager;
    game.game_type = game_type;
    game.player_choice = choice;
    game.vrf_requested = false;
    game.settled = false;
    game.timestamp = Clock::get()?.unix_timestamp;
    game.bump = ctx.bumps.game;

    ctx.accounts.treasury.total_wagered += wager;
    
    msg!("Game created: type={:?}, wager={}, choice={}", game_type, wager, choice);
    Ok(())
}
