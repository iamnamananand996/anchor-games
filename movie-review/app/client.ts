import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MovieReview } from "../target/types/movie_review";

// describe("movie-review", () => {
// Configure the client to use the local cluster.
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const program = anchor.workspace.MovieReview;

const moviereview = {
  title: "to be delete 4",
  content: "This is content is updated",
  reviewId: "4",
};

const createReview = async () => {
  // Add your test here.

  // Derive the PDA using only user public key, not title
  const [reviewAccount] = await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("review"), // Static seed
      provider.wallet.publicKey.toBuffer(), // User's public key
      Buffer.from(moviereview.reviewId),
    ],
    program.programId
  );

  const tx = await program.methods
    .createReview(moviereview.reviewId, moviereview.title, moviereview.content)
    .accounts({
      review: reviewAccount,
      // user: provider.wallet.publicKey,
      // systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
  console.log("Your transaction signature", tx);
};

const updateReview = async () => {
  // Add your test here.

  // Derive the PDA using only user public key, not title
  const [reviewAccount] = await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("review"), // Static seed
      provider.wallet.publicKey.toBuffer(), // User's public key
      Buffer.from(moviereview.reviewId),
    ],
    program.programId
  );

  const tx = await program.methods
    .updateReview(moviereview.reviewId, moviereview.title, moviereview.content)
    .accounts({
      review: reviewAccount,
      // user: provider.wallet.publicKey,
      // systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
  console.log("Your transaction signature", tx);
};

const deleteReview = async () => {
  // Add your test here.

  // Derive the PDA using only user public key, not title
  const [reviewAccount] = await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("review"), // Static seed
      provider.wallet.publicKey.toBuffer(), // User's public key
      Buffer.from(moviereview.reviewId),
    ],
    program.programId
  );

  const tx = await program.methods
    .deleteReview(moviereview.reviewId)
    .accounts({
      review: reviewAccount,
      // user: provider.wallet.publicKey,
      // systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

  console.log("Your transaction signature", tx);
};

async function listReviews() {
  // Fetch all accounts of type 'Review' for the program

  //   console.log({ program });

  const reviews = await program.provider.connection.getProgramAccounts(
    program.programId, // The program ID
    {
      filters: [
        {
          dataSize: 8 + 32 + 256 + 1024, // The size of the review account (8 bytes for discriminator + 32 for creator + 256 for title + 1024 for content)
        },
      ],
    }
  );

  console.log(program.programId);
  console.log({ reviews });

  // Decode and display each review
  for (let review of reviews) {
    const accountData = review.account.data;
    const decodedReview = program.account.review.coder.accounts.decode(
      "review",
      accountData
    );

    console.log(`Review: ${decodedReview.title}`);
    console.log(`Content: ${decodedReview.content}`);
    console.log(`Created by: ${decodedReview.creator.toBase58()}`);
    console.log(`Created by: ${decodedReview.reviewId}`);
    console.log("-------------------------");
  }
}

// createReview();
listReviews();
// updateReview();
// deleteReview();
