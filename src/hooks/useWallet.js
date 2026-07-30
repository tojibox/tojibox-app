/**
 * useWallet — standard EVM wallet flow for GIWA Sepolia.
 *
 * GIWA is a plain OP-Stack EVM chain, so unlike the original useHashPack hook
 * this does NOT need the EIP-6963 "find HashPack specifically, even when
 * MetaMask/Phantom are also installed" discovery dance — Hedera payments
 * required HashPack in particular, GIWA works with any standard injected
 * wallet (MetaMask, etc.) via window.ethereum.
 *
 * Flow: connect -> switch/add GIWA Sepolia -> send ETH -> wait 1 confirmation
 * -> build X-Payment header -> fetch (with one light retry, since GIWA's RPC
 * doesn't have Hedera mirror-node indexing lag).
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserProvider, parseEther, getAddress } from 'ethers';
import { GIWA_SEPOLIA, RECEIVER_ADDRESS, ETH_AMOUNT } from '../constants/chain';

export { RECEIVER_ADDRESS, ETH_AMOUNT };

async function ensureGiwaSepolia(provider) {
  try {
    await provider.send('wallet_switchEthereumChain', [{ chainId: GIWA_SEPOLIA.chainId }]);
  } catch (err) {
    // 4902 = chain not added yet; some wallets surface this as -32603 instead.
    if (err.code === 4902 || err.code === -32603) {
      await provider.send('wallet_addEthereumChain', [GIWA_SEPOLIA]);
    } else {
      throw err;
    }
  }
}

export function useWallet() {
  const [hasWallet, setHasWallet] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);
  const providerRef = useRef(null);

  // Detect an injected provider on mount (and shortly after, in case an
  // extension injects window.ethereum slightly after page load).
  useEffect(() => {
    const check = () => setHasWallet(typeof window !== 'undefined' && !!window.ethereum);
    check();
    const t = setTimeout(check, 300);
    return () => clearTimeout(t);
  }, []);

  const payAndFetch = useCallback(async (url) => {
    setError(null);

    if (typeof window === 'undefined' || !window.ethereum) {
      setHasWallet(false);
      throw new Error('No wallet detected. Install MetaMask to continue.');
    }
    setHasWallet(true);

    setPaying(true);
    try {
      const provider = providerRef.current ?? new BrowserProvider(window.ethereum);
      providerRef.current = provider;

      // Connect — wallet popup opens
      await provider.send('eth_requestAccounts', []);

      // Switch to (or add) GIWA Sepolia
      await ensureGiwaSepolia(provider);

      const signer = await provider.getSigner();

      // Send ETH — wallet approval popup opens
      const tx = await signer.sendTransaction({
        to: getAddress(RECEIVER_ADDRESS),
        value: parseEther(String(ETH_AMOUNT)),
        gasLimit: 21000n,
      });

      await tx.wait(1);

      const paymentHeader = btoa(
        JSON.stringify({ txHash: tx.hash, network: 'giwa-sepolia', scheme: 'giwa-eth' }),
      );

      // Retry once on 402 as a light safety net — GIWA's RPC is a normal,
      // reliable OP-Stack endpoint (no mirror-node indexing lag to wait out).
      let res;
      for (let attempt = 0; attempt < 2; attempt++) {
        res = await fetch(url, { headers: { 'X-Payment': paymentHeader } });
        if (res.status !== 402) break;
        if (attempt < 1) await new Promise((r) => setTimeout(r, 1500));
      }
      return res;
    } finally {
      setPaying(false);
    }
  }, []);

  return { hasWallet, paying, error, payAndFetch };
}
