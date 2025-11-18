use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct WithdrawTreasury<'info> {
    #[account(
        mut,
        seeds = [b"treasury"],
        bump = treasury.bump,
        has_one = authority
    )]
    pub treasury: Account<'info, Treasury>,
    
    #[account(mut)]
    pub treasury_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub destination_token_account: Account<'info, TokenAccount>,
    
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CancelPvPRoom<'info> {
    #[account(
        mut,
        has_one = creator,
        constraint = room.opponent.is_none() @ CasinoError::RoomFull,
        constraint = !room.settled @ CasinoError::AlreadySettled,
        close = creator
    )]
    pub room: Account<'info, PvPRoom>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    #[account(mut)]
    pub creator_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

pub fn withdraw_treasury(ctx: Context<WithdrawTreasury>, amount: u64) -> Result<()> {
    // Only treasury authority can withdraw
    // Check sufficient balance
    require!(
        ctx.accounts.treasury_token_account.amount >= amount,
        CasinoError::InsufficientTreasury
    );

    let seeds = &[b"treasury".as_ref(), &[ctx.accounts.treasury.bump]];
    let signer = &[&seeds[..]];
    
    let cpi_accounts = Transfer {
        from: ctx.accounts.treasury_token_account.to_account_info(),
        to: ctx.accounts.destination_token_account.to_account_info(),
        authority: ctx.accounts.treasury.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    token::transfer(cpi_ctx, amount)?;
    
    msg!("Treasury withdrawal: {} tokens", amount);
    Ok(())
}

pub fn cancel_pvp_room(ctx: Context<CancelPvPRoom>) -> Result<()> {
    // Refund creator's wager from escrow
    let room = &ctx.accounts.room;
    
    let seeds = &[
        b"pvp".as_ref(),
        room.creator.as_ref(),
        &room.created_at.to_le_bytes(),
        &[room.bump]
    ];
    let signer = &[&seeds[..]];
    
    let cpi_accounts = Transfer {
        from: ctx.accounts.escrow_token_account.to_account_info(),
        to: ctx.accounts.creator_token_account.to_account_info(),
        authority: room.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    token::transfer(cpi_ctx, room.wager)?;
    
    msg!("PvP room cancelled, wager refunded: {}", room.wager);
    Ok(())
}
