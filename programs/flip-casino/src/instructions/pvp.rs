use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct CreatePvPRoom<'info> {
    #[account(
        init,
        payer = creator,
        space = PvPRoom::LEN,
        seeds = [b"pvp", creator.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub room: Account<'info, PvPRoom>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    #[account(mut)]
    pub creator_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinPvPRoom<'info> {
    #[account(
        mut,
        constraint = room.opponent.is_none() @ CasinoError::RoomFull
    )]
    pub room: Account<'info, PvPRoom>,
    
    #[account(mut)]
    pub opponent: Signer<'info>,
    
    #[account(mut)]
    pub opponent_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SettlePvP<'info> {
    #[account(
        mut,
        constraint = !room.settled @ CasinoError::AlreadySettled,
        constraint = room.opponent.is_some() @ CasinoError::NoOpponent
    )]
    pub room: Account<'info, PvPRoom>,
    
    #[account(mut)]
    pub winner_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

pub fn create_pvp_room(ctx: Context<CreatePvPRoom>, wager: u64, game_type: GameType) -> Result<()> {
    // Anti-cheat: Validate wager amount
    const MIN_WAGER: u64 = 1_000;
    const MAX_WAGER: u64 = 1_000_000_000_000;
    
    require!(wager >= MIN_WAGER, CasinoError::WagerTooLow);
    require!(wager <= MAX_WAGER, CasinoError::WagerTooHigh);
    
    // Lock creator's wager in escrow
    let cpi_accounts = Transfer {
        from: ctx.accounts.creator_token_account.to_account_info(),
        to: ctx.accounts.escrow_token_account.to_account_info(),
        authority: ctx.accounts.creator.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, wager)?;

    let room = &mut ctx.accounts.room;
    room.creator = ctx.accounts.creator.key();
    room.opponent = None;
    room.wager = wager;
    room.game_type = game_type;
    room.vrf_requested = false;
    room.settled = false;
    room.created_at = Clock::get()?.unix_timestamp;
    room.bump = ctx.bumps.room;
    
    msg!("PvP room created: type={:?}, wager={}", game_type, wager);
    Ok(())
}

pub fn join_pvp_room(ctx: Context<JoinPvPRoom>) -> Result<()> {
    let room = &mut ctx.accounts.room;
    
    // Anti-cheat: Check room hasn't expired (5 minutes)
    const ROOM_EXPIRY: i64 = 5 * 60; // 5 minutes
    let current_time = Clock::get()?.unix_timestamp;
    require!(
        current_time - room.created_at < ROOM_EXPIRY,
        CasinoError::RoomExpired
    );
    
    // Anti-cheat: Prevent creator from joining their own room
    require!(
        ctx.accounts.opponent.key() != room.creator,
        CasinoError::InvalidGameState
    );
    
    // Lock opponent's wager
    let cpi_accounts = Transfer {
        from: ctx.accounts.opponent_token_account.to_account_info(),
        to: ctx.accounts.escrow_token_account.to_account_info(),
        authority: ctx.accounts.opponent.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, room.wager)?;
    
    room.opponent = Some(ctx.accounts.opponent.key());
    
    msg!("PvP room joined: opponent={}", ctx.accounts.opponent.key());
    Ok(())
}

pub fn settle_pvp(ctx: Context<SettlePvP>, vrf_result: [u8; 32]) -> Result<()> {
    let room = &mut ctx.accounts.room;
    
    // Anti-cheat: Verify VRF result is not all zeros
    require!(
        vrf_result != [0u8; 32],
        CasinoError::InvalidVRF
    );
    
    // Anti-cheat: Verify escrow has correct amount
    let expected_escrow = room.wager * 2;
    require!(
        ctx.accounts.escrow_token_account.amount >= expected_escrow,
        CasinoError::InvalidGameState
    );
    
    // Simple: creator always gets first choice, opponent gets opposite
    let (creator_won, result_value) = match room.game_type {
        GameType::CoinFlip => {
            let result = (vrf_result[0] % 2) == room.creator_choice;
            (result, vrf_result[0] % 2)
        },
        GameType::DiceHighLow => {
            let dice_roll = (vrf_result[0] % 100) + 1;
            let is_high = dice_roll > 50;
            let won = is_high == (room.creator_choice == 1);
            (won, dice_roll)
        },
        GameType::EvenOdd => {
            let number = (vrf_result[0] % 100) + 1;
            let is_even = (number % 2) == 0;
            let won = is_even == (room.creator_choice == 1);
            (won, number)
        },
    };

    // Pay winner (escrow holds both wagers)
    let total_payout = room.wager * 2;
    
    let seeds = &[
        b"pvp".as_ref(),
        room.creator.as_ref(),
        &room.created_at.to_le_bytes(),
        &[room.bump]
    ];
    let signer = &[&seeds[..]];
    
    let cpi_accounts = Transfer {
        from: ctx.accounts.escrow_token_account.to_account_info(),
        to: ctx.accounts.winner_token_account.to_account_info(),
        authority: room.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    token::transfer(cpi_ctx, total_payout)?;
    
    room.settled = true;
    room.vrf_requested = true;
    
    let winner = if creator_won { room.creator } else { room.opponent.unwrap() };
    msg!("PvP settled: winner={}, payout={}, result={}", winner, total_payout, result_value);
    
    Ok(())
}
