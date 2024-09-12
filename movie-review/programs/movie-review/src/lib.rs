use anchor_lang::prelude::*;

declare_id!("HGSvevDenij6XyPhuPwg7Btp5zZfyqw8UAvdbyFPsrGB");

#[program]
pub mod movie_review {
    use super::*;

    pub fn create_review(ctx: Context<CreateReview>, review_id: String, title: String, content: String) -> Result<()> {
        let review = &mut ctx.accounts.review;

        // Ensure review account is uninitialized before proceeding
        if review.creator != Pubkey::default() {
            return Err(ProgramError::AccountAlreadyInitialized.into());
        }

        review.creator = *ctx.accounts.user.key;
        review.title = title;
        review.content = content;
        review.review_id = review_id;

        Ok(())
    }

    pub fn update_review(ctx: Context<UpdateReview>, review_id: String, title: String, content: String) -> Result<()> {
        let review = &mut ctx.accounts.review;
       
        review.title = title;
        review.content = content;
        review.review_id = review_id;

        Ok(())
    }

    pub fn delete_review(_ctx: Context<DeleteReview>, review_id: String) -> Result<()> {
        msg!("Movie review for {} deleted", review_id);

        Ok(())
    }

}

#[derive(Accounts)]
#[instruction(review_id: String)]
pub struct CreateReview<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + 32 + 256 + 1024, 
        seeds = [b"review", user.key().as_ref(), review_id.as_bytes()],
    bump)]
    pub review: Account<'info, Review>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(review_id: String)]
pub struct UpdateReview<'info> {
    #[account(
        mut, 
        seeds = [b"review", user.key().as_ref(), review_id.as_bytes()],
        realloc = 8 + 32 + 256 + 1024,
        realloc::payer = user, 
        realloc::zero = true, 
    bump)]
    pub review: Account<'info, Review>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(review_id: String)]
pub struct DeleteReview<'info> {
    #[account(
        mut, 
        seeds = [b"review", user.key().as_ref(), review_id.as_bytes()],
        bump,
        close = user
    )]
    pub review: Account<'info, Review>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}



#[account]
pub struct Review {
    pub creator: Pubkey,
    title: String,
    content: String,
    review_id: String
}
