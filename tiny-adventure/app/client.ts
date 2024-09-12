import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TinyAdventure } from "../target/types/tiny_adventure";

// Configure the client to use the local cluster.
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = anchor.workspace.TinyAdventure as Program<TinyAdventure>;

async function clientProgram() {
  let [pda] = await anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("Level1", "utf8")],
    program.programId
  );

  const newAccountKp = new anchor.web3.Keypair();

  // console.log({ publicKey, bump });

  const data = 1;

  // Add your test here.
  // const tx = await program.methods
  //   .initialize()
  //   .accounts({
  //     newGameDataAccount: pda,
  //     signer: provider.wallet.publicKey,
  //     systemProgram: anchor.web3.SystemProgram.programId,
  //   })
  //   .rpc();
  // console.log("Your transaction signature", tx);

  // Here you can play around now, move left and right
  const txHash = await program.methods
    // .moveLeft()
    .moveRight()
    .accounts({
      gameDataAccount: pda,
    })

    .rpc();
  console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
  await provider.connection.confirmTransaction(txHash);

  const gameDateAccount = await program.account.gameDataAccount.fetch(pda);

  console.log("Player position is:", gameDateAccount.playerPosition.toString());

  switch (gameDateAccount.playerPosition) {
    case 0:
      console.log("A journey begins...");
      console.log("o........");
      break;
    case 1:
      console.log("....o....");
      break;
    case 2:
      console.log("......o..");
      break;
    case 3:
      console.log(".........\\o/");
      break;
  }
}

clientProgram();
