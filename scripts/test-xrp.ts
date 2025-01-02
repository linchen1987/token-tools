import { Client, Wallet } from 'xrpl';

// const account1Address = 'rNvW4eQtrBY8GKHGYHYt8Nd7K617LibHWX';
// const account1Seed = 'sEdS7AAbV7ZQH4jcKcpoZmbYyAcvQdv';
const account1Address = 'rJSVmuok6bSHtydsY412xfSo2Yx54M8GEg';
const account1Seed = 'sEdSbJmHGYrD8DwmNugRSYrHtFbvvSV';
const account2Address = 'r3FS6prf2zrZ1PwKNjumJmUDWEX44hGVD6';

async function getXRPAccountInfo(accountAddress: string) {
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
      account: accountAddress,
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
    // 创建钱包实例
    const wallet = Wallet.fromSeed(account1Seed);
    console.log('Sending from wallet address:', wallet.address);

    // 准备交易
    const prepared = await client.autofill({
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: '90000000', // 90 XRP (以 drops 为单位)
      Destination: account2Address,
    });

    // 签名交易
    const signed = wallet.sign(prepared);
    console.log('Transaction hash:', signed.hash);

    // 提交交易
    const result = await client.submitAndWait(signed.tx_blob);
    console.log('Transaction result:', result.result.meta.TransactionResult);
    console.log('Transaction details:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.disconnect();
  }
}

// 执行函数
// getXRPAccountInfo(account2Address).catch(console.error);
getXRPAccountInfo(account1Address).catch(console.error);
// sendXRP().catch(console.error);
