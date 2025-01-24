import { createPublicClient, http, formatEther, formatUnits } from 'viem';
import dotenv from 'dotenv';
import { CHAINS } from '../configs/networks';
import { erc20Abi } from 'viem';

// Load environment variables
dotenv.config();

const { CHAIN, EVM_ADDRESS, TOKEN_ADDRESS } = process.env;

if (!EVM_ADDRESS) {
  throw new Error('EVM_ADDRESS is required in .env file');
}

const transport = http();
const client = createPublicClient({
  chain: CHAINS[CHAIN as keyof typeof CHAINS],
  transport,
});

async function getAddressInfo() {
  try {
    // Get account balance
    const balance = await client.getBalance({ address: EVM_ADDRESS as `0x${string}` });

    // Convert balance to ETH units
    const balanceInEth = formatEther(balance);

    // Get transaction count
    const transactionCount = await client.getTransactionCount({ address: EVM_ADDRESS as `0x${string}` });

    // Get token balance
    let tokenBalance = '';
    if (TOKEN_ADDRESS) {
      const decimals = await client.readContract({
        address: TOKEN_ADDRESS as `0x${string}`,
        abi: erc20Abi,
        functionName: 'decimals',
      });

      const TOKEN_SYMBOL = await client.readContract({
        address: TOKEN_ADDRESS as `0x${string}`,
        abi: erc20Abi,
        functionName: 'symbol',
      });
      const balance = await client.readContract({
        address: TOKEN_ADDRESS as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [EVM_ADDRESS as `0x${string}`],
      });

      // Convert token balance to ETH units
      const balanceInEth = formatUnits(balance, decimals);
      tokenBalance = `${balanceInEth} ${TOKEN_SYMBOL}`;
    }

    console.log('Address Info:', {
      address: EVM_ADDRESS,
      balance: `${balanceInEth} ETH`,
      transactionCount,
      tokenBalance,
    });
  } catch (error) {
    console.error('Error querying address info:', error);
  }
}

// Execute function
getAddressInfo();
