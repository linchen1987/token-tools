import * as dotenv from 'dotenv';
import { Turnkey, DEFAULT_ETHEREUM_ACCOUNTS } from '@turnkey/sdk-server';
import { ethers } from 'ethers';
import { TurnkeySigner } from '@turnkey/ethers';
// Load environment variables from .env file
dotenv.config();

const turnkeySigner = new Turnkey({
  apiBaseUrl: 'https://api.turnkey.com',
  apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
  apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
  defaultOrganizationId: process.env.TURNKEY_ORGANIZATION_ID!,
});

const apiClient = turnkeySigner.apiClient();

(async () => {
  const walletResponse = await apiClient.createWallet({
    walletName: 'Example Wallet 1',
    accounts: DEFAULT_ETHEREUM_ACCOUNTS,
  });

  const walletId = walletResponse.walletId;
  const accountAddress = walletResponse.addresses[0];
  console.log(walletId, accountAddress);

  const turnkeySigner = new TurnkeySigner({
    client: apiClient,
    organizationId: process.env.TURNKEY_ORGANIZATION_ID!,
    signWith: accountAddress,
  });

  // a provider is required if you want to interact with the live network,
  // i.e. broadcast transactions, fetch gas prices, etc.
  // const provider = new ethers.JsonRpcProvider(<provider API URL>);
  // const connectedSigner = turnkeySigner.connect(provider);

  // const transactionRequest = {
  //   to: <destination address>,
  //   value: ethers.parseEther(<amount to send>),
  //   type: 2
  // }
  // const transactionResult = await connectedSigner.sendTransaction(transactionRequest);
})();
