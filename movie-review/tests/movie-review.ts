import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MovieReview } from "../target/types/movie_review";

describe("movie-review", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.MovieReview as Program<MovieReview>;

  it("Is initialized!", async () => {
    // Add your test here.

    const moviereview = { title: "Movie 1", content: "This is content" };

    const [reviewAccount] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(moviereview.title)],
      program.programId
    );

    console.log({ reviewAccount });
    console.log(provider.wallet.publicKey);
    console.log(anchor.web3.SystemProgram.programId);

    const tx = await program.methods
      .createReview(moviereview.title, moviereview.content)
      .accounts({
        review: reviewAccount,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
