use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;
use crate::state::*;

#[derive(Accounts)]
pub struct InitializeTreasury<'info> {
    #[account(
        init,
        payer = authority,
        space = Treasury::LEN,
        seeds = [b"treasury"],
        bump
    )]
    pub treasury: Account<'info, Treasury>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_account: Account<'info, TokenAccount>,
    
    pub system_program: Program<'info, System>,
}

pub fn initialize_treasury(ctx: Context<InitializeTreasury>) -> Result<()> {
    let treasury = &mut ctx.accounts.treasury;
    treasury.authority = ctx.accounts.authority.key();
    treasury.token_account = ctx.accounts.token_account.key();
    treasury.total_wagered = 0;
    treasury.total_paid = 0;
    treasury.bump = ctx.bumps.treasury;
    Ok(())
}
