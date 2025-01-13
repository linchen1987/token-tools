import { Client, Wallet } from 'xrpl';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 从环境变量中读取账户信息
const fromAddress = process.env.FROM_ADDRESS!;
const fromSeed = process.env.FROM_SEED!;
const toAddress = process.env.TO_ADDRESS!;

async function getXRPAccountInfo(fromAddress: string) {
  // 连接到 XRP Testnet
  const client = new Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();

  try {
    // 创建钱包实例
    // const wallet = Wallet.fromSeed(account1Seed);
    // console.log('Wallet address:', wallet.address);

    // 获取账户信息
    const account_info = await client.request({
      command: 'account_info',
      account: fromAddress,
      ledger_index: 'validated',
    });

    console.log('Account Info:', JSON.stringify(account_info.result, null, 2));

    // 获取账户余额
    const balance = account_info.result.account_data.Balance;
    console.log('Balance:', Number(balance) / 1000000, 'XRP'); // 转换 drops 为 XRP
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.disconnect();
  }
}

async function sendXRP() {
  const client = new Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();

  try {
    const wallet = Wallet.fromSeed(fromSeed);
    console.log('Sending from wallet address:', wallet.address);

    const prepared = await client.autofill({
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: '8000000',
      Destination: toAddress,
    });

    const signed = wallet.sign(prepared);
    console.log('Transaction hash:', signed.hash);

    const result = await client.submitAndWait(signed.tx_blob);
    // 修复类型错误，添加类型检查
    if (typeof result.result.meta === 'object' && result.result.meta) {
      console.log('Transaction result:', result.result.meta.TransactionResult);
    }
    console.log('Transaction details:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.disconnect();
  }
}

// 执行函数
getXRPAccountInfo(fromAddress).catch(console.error);
sendXRP().catch(console.error);
