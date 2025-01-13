import { ethers } from 'ethers';
import { ETH_MAINNET_PROVIDER, ETH_TESTNET_PROVIDER } from '../configs/networks';

const config = {
  providerConfig: ETH_MAINNET_PROVIDER,
  addressConfig: '0x817Eda77C0b5442672bbDcE698712394660d87fb',
};

async function getAddressInfo() {
  const provider = new ethers.JsonRpcProvider(config.providerConfig);

  const address = config.addressConfig;

  try {
    // 获取账户余额
    const balance = await provider.getBalance(address);

    // 将余额转换为 ETH 单位
    const balanceInEth = ethers.formatEther(balance);

    // 获取该地址的交易数量
    const transactionCount = await provider.getTransactionCount(address);

    console.log('地址信息：', {
      address: address,
      余额: `${balanceInEth} ETH`,
      交易次数: transactionCount,
    });
  } catch (error) {
    console.error('查询出错：', error);
  }
}

// 执行函数
getAddressInfo();
