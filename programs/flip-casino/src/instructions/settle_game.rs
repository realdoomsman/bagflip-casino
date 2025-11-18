use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct SettleGame<'info> {
    #[account(
        mut,
        has_one = player,
        constraint = !game.settled @ CasinoError::AlreadySettled
    )]
    pub game: Account<'info, Game>,
    
    #[account(mut)]
    pub player: SystemAccount<'info>,
    
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
    
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

pub fn settle_game(ctx: Context<SettleGame>, vrf_result: [u8; 32]) -> Result<()> {
    let game = &mut ctx.accounts.game;
    
    // Anti-cheat: Verify VRF result is not all zeros (invalid)
    require!(
        vrf_result != [0u8; 32],
        CasinoError::InvalidVRF
    );
    
    // Determine win based on game type
    let (player_won, result_value) = match game.game_type {
        GameType::CoinFlip => {
            let coin_result = (vrf_result[0] % 2) == 1;
            let won = coin_result == (game.player_choice == 1);
            (won, coin_result as u8)
        },
        GameType::DiceHighLow => {
            let dice_roll = (vrf_result[0] % 100) + 1;
            let is_high = dice_roll > 50;
            let won = is_high == (game.player_choice == 1);
            (won, dice_roll)
        },
        GameType::EvenOdd => {
            let number = (vrf_result[0] % 100) + 1;
            let is_even = (number % 2) == 0;
            let won = is_even == (game.player_choice == 1);
            (won, number)
        },
    };

    if player_won {
        // Pay out double the wager
        let payout = game.wager * 2;
        
        // Anti-cheat: Verify treasury has sufficient balance
        require!(
            ctx.accounts.treasury_token_account.amount >= payout,
            CasinoError::InsufficientTreasury
        );
        
        let seeds = &[b"treasury".as_ref(), &[ctx.accounts.treasury.bump]];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.treasury_token_account.to_account_info(),
            to: ctx.accounts.player_token_account.to_account_info(),
            authority: ctx.accounts.treasury.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, payout)?;
        
        ctx.accounts.treasury.total_paid += payout;
        
        msg!("Player WON: payout={}, result={}", payout, result_value);
    } else {
        msg!("Player LOST: wager={}, result={}", game.wager, result_value);
    }
    
    game.settled = true;
    game.vrf_requested = true;
    
    Ok(())
}
