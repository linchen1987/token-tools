import HDKey from 'hdkey';
import { publicToAddress, toChecksumAddress } from '@ethereumjs/util';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as ecc from 'tiny-secp256k1';

// Initialize the ECC library
bitcoin.initEccLib(ecc);

interface CryptoAddresses {
  ethereum?: string;
  bitcoinLegacy?: string;
  bitcoinP2sh?: string;
  bitcoinBech32?: string;
  bitcoinTaproot?: string;
  dogecoin?: string;
}

async function generateAddresses(mnemonicPath: string): Promise<CryptoAddresses> {
  // 读取助记词文件
  const mnemonic = fs.readFileSync(mnemonicPath, 'utf-8').trim();

  // 验证助记词
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }

  // 生成种子
  const seed = await bip39.mnemonicToSeed(mnemonic);
  // const entropy = bip39.mnemonicToEntropy(mnemonic);

  const hdkey = HDKey.fromMasterSeed(seed);

  // 生成以太坊地址
  // 派生路径: m/44'/60'/0'/0/0
  const ethPath = "m/44'/60'/0'/0/0";
  const ethChild = hdkey.derive(ethPath);
  if (!ethChild.publicKey) {
    throw new Error('Failed to derive Ethereum public key');
  }
  const ethAddress = publicToAddress(ethChild.publicKey, true);
  const ethAddressHexWithout0x = Buffer.from(ethAddress).toString('hex');
  const ethereumAddress = toChecksumAddress('0x' + ethAddressHexWithout0x);

  // 生成比特币地址
  const bitcoinPathLegacy = "m/44'/0'/0'/0/0";
  const bitcoinChildLegacy = hdkey.derive(bitcoinPathLegacy);
  if (!bitcoinChildLegacy.publicKey) {
    throw new Error('Failed to derive Bitcoin Legacy public key');
  }
  const bitcoinAddressLegacy = bitcoin.payments.p2pkh({
    pubkey: bitcoinChildLegacy.publicKey,
    network: bitcoin.networks.bitcoin,
  }).address;

  // 生成比特币 Taproot 地址
  const bitcoinPathTaproot = "m/86'/0'/0'/0/0";
  const bitcoinChildTaproot = hdkey.derive(bitcoinPathTaproot);
  if (!bitcoinChildTaproot.publicKey) {
    throw new Error('Failed to derive Taproot public key');
  }
  const pubkey = Buffer.from(bitcoinChildTaproot.publicKey.slice(1, 33)); // Convert 33-byte public key to 32-byte x-only pubkey
  const bitcoinAddressTaproot = bitcoin.payments.p2tr({
    internalPubkey: pubkey,
    network: bitcoin.networks.bitcoin,
  }).address;

  // 生成比特币 P2SH 地址
  const bitcoinPathP2sh = "m/49'/0'/0'/0/0";
  const bitcoinChildP2sh = hdkey.derive(bitcoinPathP2sh);
  if (!bitcoinChildP2sh.publicKey) {
    throw new Error('Failed to derive P2SH public key');
  }
  const bitcoinAddressP2sh = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({
      pubkey: bitcoinChildP2sh.publicKey,
      network: bitcoin.networks.bitcoin,
    }),
    network: bitcoin.networks.bitcoin,
  }).address;

  // 生成比特币 Bech32 地址
  const bitcoinPathBech32 = "m/84'/0'/0'/0/0";
  const bitcoinChildBech32 = hdkey.derive(bitcoinPathBech32);
  if (!bitcoinChildBech32.publicKey) {
    throw new Error('Failed to derive Bech32 public key');
  }
  const bitcoinAddressBech32 = bitcoin.payments.p2wpkh({
    pubkey: bitcoinChildBech32.publicKey,
    network: bitcoin.networks.bitcoin,
  }).address;

  // 生成狗狗币地址
  // 派生路径: m/44'/3'/0'/0/0
  const dogePath = "m/44'/3'/0'/0/0";
  const dogeChild = hdkey.derive(dogePath);
  if (!dogeChild.publicKey) {
    throw new Error('Failed to derive Dogecoin public key');
  }
  const { address: dogecoinAddress } = bitcoin.payments.p2pkh({
    pubkey: dogeChild.publicKey,
    network: {
      messagePrefix: '\x19Dogecoin Signed Message:\n',
      bech32: 'dc',
      bip32: {
        public: 0x02facafd,
        private: 0x02fac398,
      },
      pubKeyHash: 0x1e,
      scriptHash: 0x16,
      wif: 0x9e,
    },
  });

  return {
    ethereum: ethereumAddress,
    bitcoinLegacy: bitcoinAddressLegacy,
    bitcoinTaproot: bitcoinAddressTaproot,
    bitcoinP2sh: bitcoinAddressP2sh,
    bitcoinBech32: bitcoinAddressBech32,
    dogecoin: dogecoinAddress!,
  };
}

// 命令行入口
async function main() {
  if (process.argv.length < 3) {
    console.error('请提供助记词文件路径');
    process.exit(1);
  }

  const mnemonicPath = process.argv[2];

  try {
    const addresses = await generateAddresses(mnemonicPath);
    console.log('生成的地址：');
    console.log('以太坊:', addresses.ethereum);
    console.log('比特币 Legacy:', addresses.bitcoinLegacy);
    console.log('比特币 Taproot:', addresses.bitcoinTaproot);
    console.log('比特币 P2SH:', addresses.bitcoinP2sh);
    console.log('比特币 Bech32:', addresses.bitcoinBech32);
    console.log('狗狗币:', addresses.dogecoin);
  } catch (error) {
    console.error('错误:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { generateAddresses };
