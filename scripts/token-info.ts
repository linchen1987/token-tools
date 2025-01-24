import { createPublicClient, http, formatUnits } from 'viem';
import { erc20Abi } from 'viem';
import dotenv from 'dotenv';
import { CHAINS } from '../configs/networks';

// Load environment variables
dotenv.config();

const { CHAIN, TOKEN_ADDRESS } = process.env;

if (!CHAIN) {
  throw new Error('CHAIN is required in .env file');
}

if (!TOKEN_ADDRESS) {
  throw new Error('TOKEN_ADDRESS is required in .env file');
}

const transport = http();
const client = createPublicClient({
  chain: CHAINS[CHAIN as keyof typeof CHAINS],
  transport,
});

async function getTokenInfo() {
  try {
    // Get token basic information
    const name = await client.readContract({
      address: TOKEN_ADDRESS as `0x${string}`,
      abi: erc20Abi,
      functionName: 'name',
    });

    const symbol = await client.readContract({
      address: TOKEN_ADDRESS as `0x${string}`,
      abi: erc20Abi,
      functionName: 'symbol',
    });

    const decimals = await client.readContract({
      address: TOKEN_ADDRESS as `0x${string}`,
      abi: erc20Abi,
      functionName: 'decimals',
    });

    const totalSupply = await client.readContract({
      address: TOKEN_ADDRESS as `0x${string}`,
      abi: erc20Abi,
      functionName: 'totalSupply',
    });

    console.log('Token Info:', {
      address: TOKEN_ADDRESS,
      name,
      symbol,
      decimals,
      totalSupply: formatUnits(totalSupply, decimals),
    });
  } catch (error) {
    console.error('Error querying token info:', error);
  }
}

// Execute function
getTokenInfo();
