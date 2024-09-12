import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TinyAdventure } from "../target/types/tiny_adventure";

describe("tiny-adventure", () => {
  // Configure the client to use the local cluster.
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.TinyAdventure as Program<TinyAdventure>;

  it("Is initialized!", async () => {
    // Add your test here.
    // const tx = await program.methods.initialize().rpc();
    // console.log("Your transaction signature", tx);

    let [publicKey, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("Level1", "utf8")],
      program.programId
    );

    const newAccountKp = new anchor.web3.Keypair();

    console.log({ publicKey, bump });

    const data = 0;

    // Add your test here.
    const tx = await program.methods
      .initialize(data)
      .accounts({
        newGameDataAccount: publicKey,
        signer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
