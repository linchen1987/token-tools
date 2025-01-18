import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import dotenv from 'dotenv';

import { CHAINS } from '../configs/networks';
// Load environment variables
dotenv.config();

const { FROM_EVM_ADDRESS, FROM_EVM_SK, TO_EVM_ADDRESS, AMOUNT, CHAIN = 'hardhat' } = process.env;

// Select chain from environment variable
if (!['mainnet', 'hardhat'].includes(CHAIN)) {
  throw new Error('Invalid chain specified. Use "mainnet" or "hardhat"');
}

const chain = CHAINS[CHAIN as keyof typeof CHAINS];

// Check for required environment variables
if (!FROM_EVM_ADDRESS || !FROM_EVM_SK || !TO_EVM_ADDRESS) {
  throw new Error('Missing required environment variables');
}

// Validate private key format
const normalizedPrivateKey = FROM_EVM_SK.startsWith('0x') ? FROM_EVM_SK : `0x${FROM_EVM_SK}`;
if (!/^0x[0-9a-fA-F]{64}$/.test(normalizedPrivateKey)) {
  throw new Error('Invalid private key format');
}

async function sendEth() {
  try {
    // Create account from private key
    const account = privateKeyToAccount(normalizedPrivateKey as `0x${string}`);

    // Create wallet client
    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(),
    });

    // Amount to send (in this case 0.01 ETH)
    const amount = parseEther(AMOUNT || '0.01');

    // Send transaction
    const hash = await walletClient.sendTransaction({
      to: TO_EVM_ADDRESS as `0x${string}`,
      value: amount,
    });

    console.log('Transaction sent!');
    console.log('Transaction hash:', hash);

    return hash;
  } catch (error) {
    console.error('Error sending ETH:', error);
    throw error;
  }
}

// Execute the transfer
sendEth().catch(console.error);
