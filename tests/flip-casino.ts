import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { FlipCasino } from "../target/types/flip_casino";
import { expect } from "chai";

describe("flip-casino", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.FlipCasino as Program<FlipCasino>;

  it("Initializes treasury", async () => {
    // TODO: Implement test
  });

  it("Creates coin flip game", async () => {
    // TODO: Implement test
  });

  it("Settles game with VRF", async () => {
    // TODO: Implement test
  });

  it("Creates PvP room", async () => {
    // TODO: Implement test
  });

  it("Joins PvP room", async () => {
    // TODO: Implement test
  });

  it("Settles PvP game", async () => {
    // TODO: Implement test
  });
});
