import { createPublicClient, http, formatEther } from 'viem';
import dotenv from 'dotenv';
import { CHAINS } from '../configs/networks';

// Load environment variables
dotenv.config();

const { CHAIN, EVM_ADDRESS } = process.env;

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

    console.log('Address Info:', {
      address: EVM_ADDRESS,
      balance: `${balanceInEth} ETH`,
      transactionCount,
    });
  } catch (error) {
    console.error('Error querying address info:', error);
  }
}

// Execute function
getAddressInfo();
