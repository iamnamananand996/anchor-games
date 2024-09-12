use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use anchor_lang::system_program;

declare_id!("2XKbFecVaBbv59wpG4ugjRZYU3Ygawp4w2XTkbLA8BSx");

#[program]
pub mod tiny_adventure {
    use super::*;

    const CHEST_REWARD: u64 = LAMPORTS_PER_SOL / 10;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.new_game_data_account.player_position = 0;
        msg!("A journey beginns");
        msg!("o...........");
        Ok(())
    }

    pub fn move_left(ctx: Context<MoveLeft>) -> Result<()> {
        let game_data_account = &mut ctx.accounts.game_data_account;
        if game_data_account.player_position == 0 {
            msg!("You are back at the start.");
        } else {
            game_data_account.player_position -= 1;
            print_player(game_data_account.player_position);
        }
        Ok(())
    }

    pub fn move_right(ctx: Context<MoveRight>, password: String) -> Result<()> {
        let game_data_account = &mut ctx.accounts.game_data_account;
        if game_data_account.player_position == 3 {
            msg!("You have reached the end! Super!");
        } else if game_data_account.player_position == 2 {
            if password != "gib" {
                return err!(MyError::WrongPassword);
            }
            game_data_account.player_position = game_data_account.player_position + 1;
            msg!(
                "You made it! Here is your reward {0} lamports",
                CHEST_REWARD
            );
            **ctx
                .accounts
                .chest_vault
                .to_account_info()
                .try_borrow_mut_lamports()? -= CHEST_REWARD;
            **ctx
                .accounts
                .player
                .to_account_info()
                .try_borrow_mut_lamports()? += CHEST_REWARD;
        }
        else {
            game_data_account.player_position = game_data_account.player_position + 1;
            print_player(game_data_account.player_position);
        }
        Ok(())
    }

    pub fn reset_level_and_spawn_chest(ctx: Context<SpawnChest>) -> Result<()> {
        ctx.accounts.game_data_account.player_position = 0;
 
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.payer.to_account_info().clone(),
                to: ctx.accounts.chest_vault.to_account_info().clone(),
            },
        );
        system_program::transfer(cpi_context, CHEST_REWARD)?;
        msg!("Level Reset and Chest Spawned at position 3");
        Ok(())
    }




}

fn print_player(player_position: u8) {
    if player_position == 0 {
        msg!("A Journey Begins!");
        msg!("o.......");
    } else if player_position == 1 {
        msg!("..o.....");
    } else if player_position == 2 {
        msg!("....o...");
    } else if player_position == 3 {
        msg!("........\\o/");
        msg!("You have reached the end! Super!");
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init,
              seeds = [b"Level1"],
              bump,
              payer = signer,
              space = 8 + 1 )]
    pub new_game_data_account: Account<'info, GameDataAccount>,
    #[account(
        init,
        seeds = [b"chestVault"],
        bump,
        payer = signer,
        space = 8 
    )]
    pub  chect_vault: Account<'info, ChestVaultAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MoveLeft<'info> {
    #[account(mut)]
    pub game_data_account: Account<'info, GameDataAccount>,
}

#[derive(Accounts)]
pub struct MoveRight<'info> {
    #[account(mut, seeds = [b"chestVault"], bump)]
    pub chest_vault: Account<'info, ChestVaultAccount>,
    #[account(mut)]
    pub game_data_account: Account<'info, GameDataAccount>,
    #[account(mut)]
    pub player: Signer<'info>,
}

#[account]
pub struct GameDataAccount {
    player_position: u8,
}

#[derive(Accounts)]
pub struct SpawnChest<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut, seeds = [b"chestVault"], bump)]
    pub chest_vault: Account<'info, ChestVaultAccount>,
    #[account(mut)]
    pub game_data_account: Account<'info, GameDataAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct ChestVaultAccount {}

#[error_code]
pub enum MyError {
    #[msg("Password was wrong")]
    WrongPassword,
}
