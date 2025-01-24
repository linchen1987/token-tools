import { createWalletClient, http, parseEther, parseUnits, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import dotenv from 'dotenv';

import { CHAINS } from '../configs/networks';
// Load environment variables
dotenv.config();

const { FROM_EVM_ADDRESS, FROM_EVM_SK, TO_EVM_ADDRESS, AMOUNT, CHAIN = 'hardhat', TOKEN_ADDRESS } = process.env;

// Select chain from environment variable
if (!['mainnet', 'hardhat'].includes(CHAIN)) {
  throw new Error('Invalid chain specified. Use "mainnet" or "hardhat"');
}

const chain = CHAINS[CHAIN as keyof typeof CHAINS];

// Check for required environment variables
if (!FROM_EVM_ADDRESS || !FROM_EVM_SK || !TO_EVM_ADDRESS || !TOKEN_ADDRESS) {
  throw new Error('Missing required environment variables');
}

// Validate private key format
const normalizedPrivateKey = FROM_EVM_SK.startsWith('0x') ? FROM_EVM_SK : `0x${FROM_EVM_SK}`;
if (!/^0x[0-9a-fA-F]{64}$/.test(normalizedPrivateKey)) {
  throw new Error('Invalid private key format');
}

// ERC20 ABI for transfer and decimals functions
const erc20ABI = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
] as const;

async function sendToken() {
  try {
    // Create account from private key
    const account = privateKeyToAccount(normalizedPrivateKey as `0x${string}`);

    // Create wallet client
    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(),
    });

    // Create public client to read contract data
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    // Get token decimals
    const decimals = (await publicClient.readContract({
      address: TOKEN_ADDRESS as `0x${string}`,
      abi: erc20ABI,
      functionName: 'decimals',
    })) as number;

    // Parse amount with correct decimals
    const amount = parseUnits(AMOUNT || '0.01', decimals);

    // Send transaction
    const hash = await walletClient.writeContract({
      address: TOKEN_ADDRESS as `0x${string}`,
      abi: erc20ABI,
      functionName: 'transfer',
      args: [TO_EVM_ADDRESS as `0x${string}`, amount],
    });

    console.log('Transaction sent!');
    console.log('Transaction hash:', hash);

    return hash;
  } catch (error) {
    console.error('Error sending token:', error);
    throw error;
  }
}

// Execute the transfer
sendToken().catch(console.error);
