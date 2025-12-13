#!/bin/bash

# Build and deploy to devnet
anchor build
anchor deploy --provider.cluster devnet

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/flip_casino-keypair.json)
echo "Program deployed: $PROGRAM_ID"
