/**
 * GIWA Sepolia — OP Stack EVM L2 testnet.
 * https://sepolia-explorer.giwa.io
 */
export const GIWA_SEPOLIA = {
  chainId: '0x164ce', // 91342 (verified: parseInt('0x164ee',16) is actually 91374, a different chain — that was the bug)
  chainName: 'GIWA Sepolia',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://sepolia-rpc.giwa.io/'],
  blockExplorerUrls: ['https://sepolia-explorer.giwa.io'],
};

export const EXPLORER_BASE = GIWA_SEPOLIA.blockExplorerUrls[0];

export function giwaExplorerTxUrl(hash) {
  return `${EXPLORER_BASE}/tx/${hash}`;
}

export function giwaExplorerAddressUrl(address) {
  return `${EXPLORER_BASE}/address/${address}`;
}

// x402 payment receiver — the oracle's GIWA address that collects report payments.
export const RECEIVER_ADDRESS =
  import.meta.env.VITE_RECEIVER_ADDRESS || '0x0000000000000000000000000000000000000000';

// Price for unlocking a full parcel history + PDF report (matches tojibox-api's
// x402 middleware default price, configurable there via .env).
export const ETH_AMOUNT = 0.0001;

// Deployed contract addresses — optional, used for "view on GIWA" links across
// the app. Left blank until tojibox-scraper / tojibox-api are deployed; UI
// falls back to "not yet deployed" copy when unset. See README TODOs.
export const ORACLE_CONTRACT_ADDRESS = import.meta.env.VITE_ORACLE_CONTRACT_ADDRESS || '';
export const RECEIPT_CONTRACT_ADDRESS = import.meta.env.VITE_RECEIPT_CONTRACT_ADDRESS || '';
