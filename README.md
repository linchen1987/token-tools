# Token Tools

A collection of cryptocurrency tools for managing and interacting with various blockchain networks, including XRP Ledger.

这是一个加密货币工具集，用于管理和与各种区块链网络（包括 XRP Ledger）进行交互。

## Features | 功能

- account information query | 账户信息查询
- Send XRP transactions | 发送 XRP 交易

## Prerequisites | 前置要求

- Node.js (v16 or higher)
- npm

## Installation | 安装

```bash
# Clone the repository
git clone [your-repo-url]

# Install dependencies
npm install
```

## Configuration | 配置

Create a `.env` file in the root directory with the following content:

在根目录创建 `.env` 文件，包含以下内容：

```env
ACCOUNT1_ADDRESS=your_xrp_address
ACCOUNT1_SEED=your_xrp_seed
ACCOUNT2_ADDRESS=destination_xrp_address
```

## Available Scripts | 可用脚本

- `tsx scripts/address-info.ts`: Query account information | 查询账户信息
- `tsx scripts/send-xrp.ts`: Send XRP transactions | 发送 XRP 交易
