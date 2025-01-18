import { mainnet } from 'viem/chains';
import { Chain } from 'viem';

export const ETH_MAINNET_PROVIDER = 'https://eth.llamarpc.com';
export const ETH_MAINNET_CHAIN_ID = 1;
export const ETH_MAINNET_CHAIN_NAME = 'Ethereum Mainnet';
export const ETH_MAINNET_CHAIN_SYMBOL = 'ETH';
export const ETH_MAINNET_CHAIN_DECIMALS = 18;
export const ETH_MAINNET_CHAIN_BLOCK_EXPLORER = 'https://etherscan.io';

export const ETH_TESTNET_PROVIDER = 'https://api.zan.top/eth-sepolia';
export const ETH_TESTNET_CHAIN_ID = 11155111;
export const ETH_TESTNET_CHAIN_NAME = 'Sepolia';
export const ETH_TESTNET_CHAIN_SYMBOL = 'ETH';
export const ETH_TESTNET_CHAIN_DECIMALS = 18;
export const ETH_TESTNET_CHAIN_BLOCK_EXPLORER = 'https://sepolia.etherscan.io';

export const CHAINS = {
  mainnet,
  hardhat: {
    id: 31337,
    name: 'Hardhat',
    network: 'hardhat',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: { http: ['http://127.0.0.1:8545'] },
      public: { http: ['http://127.0.0.1:8545'] },
    },
  } as Chain,
};
