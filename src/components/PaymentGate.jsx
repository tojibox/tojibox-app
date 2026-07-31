/**
 * PaymentGate — x402 payment modal
 *
 * Click "Pay with MetaMask" → wallet extension popup opens → user approves → done.
 * Uses window.ethereum via ethers.js, targeting GIWA Sepolia.
 * No polling, no copy-paste, no memos.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet, RECEIVER_ADDRESS, ETH_AMOUNT, rpcErrorCode } from '../hooks/useWallet';
import { giwaExplorerAddressUrl } from '../constants/chain';

export function PaymentGate({ url, onPaid, onClose }) {
  const { hasWallet, paying, error: walletError, payAndFetch } = useWallet();

  const [step, setStep] = useState('idle'); // idle | paying | success | error
  const [errMsg, setErrMsg] = useState('');
  const [detecting, setDetecting] = useState(true);

  // Give wallet detection a brief moment before showing "not detected"
  useEffect(() => {
    const t = setTimeout(() => setDetecting(false), 400);
    return () => clearTimeout(t);
  }, []);

  async function handlePay() {
    setStep('paying');
    setErrMsg('');
    try {
      const res = await payAndFetch(url);
      if (!res.ok) throw new Error(`Oracle returned ${res.status} after payment`);
      setStep('success');
      onPaid(res);
    } catch (err) {
      // User rejected the transaction in their wallet
      if (rpcErrorCode(err) === 4001 || err.message?.includes('rejected') || err.message?.includes('denied')) {
        setStep('idle');
        setErrMsg('Transaction rejected in wallet.');
      } else {
        setStep('error');
        setErrMsg(err.message || 'Payment failed');
      }
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm"
        onClick={e => e.target === e.currentTarget && step !== 'paying' && onClose()}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.28 }}
          className="w-[380px] rounded-2xl shadow-2xl overflow-hidden bg-surface border border-border"
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg bg-surface-alt text-ink">
                  Ξ
                </div>
                <div>
                  <div className="text-ink font-semibold text-sm">Download Report</div>
                  <div className="text-muted text-xs">x402 · GIWA Sepolia</div>
                </div>
              </div>
              {step !== 'paying' && (
                <button onClick={onClose} className="text-muted hover:text-ink transition-colors p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Amount */}
            <div className="rounded-xl py-5 text-center bg-surface-alt border border-border">
              <div className="font-display text-4xl text-ink tracking-tight">
                {ETH_AMOUNT} <span className="text-muted">ETH</span>
              </div>
              <div className="text-xs text-muted mt-1.5">one-time access</div>
              <div className="text-xs text-muted font-mono mt-1">→ {RECEIVER_ADDRESS}</div>
            </div>

            {/* Idle — show pay button */}
            {step === 'idle' && (
              <div className="space-y-3">
                {detecting ? (
                  <div className="flex items-center justify-center gap-2 py-3 text-muted text-sm">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Detecting wallet…
                  </div>
                ) : !hasWallet ? (
                  <div className="rounded-xl p-4 bg-red-50 border border-red-200">
                    <p className="text-red-700 text-sm font-medium mb-1">No wallet detected</p>
                    <p className="text-muted text-xs leading-relaxed mb-2">
                      Install MetaMask (or any standard EVM wallet) to continue.
                    </p>
                    <a href="https://metamask.io/download" target="_blank" rel="noreferrer"
                      className="text-xs text-ink underline hover:text-muted transition-colors">
                      Install MetaMask ↗
                    </a>
                  </div>
                ) : (
                  <>
                    <button onClick={handlePay}
                      className="w-full py-3.5 rounded-lg font-semibold text-sm transition-opacity hover:opacity-85 flex items-center justify-center gap-2.5 bg-ink text-background">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                      Pay with MetaMask
                    </button>
                    <p className="text-[11px] text-muted text-center">
                      Your wallet will open to confirm the transaction
                    </p>
                  </>
                )}

                {errMsg && (
                  <p className="text-xs text-amber-700 text-center">{errMsg}</p>
                )}
              </div>
            )}

            {/* Paying — waiting for wallet approval */}
            {step === 'paying' && (
              <div className="flex flex-col items-center gap-3 py-4">
                <svg className="w-10 h-10 animate-spin text-ink" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <div className="text-center">
                  <div className="text-ink text-sm font-medium">Waiting for your wallet…</div>
                  <div className="text-muted text-xs mt-0.5">Approve the transaction in your extension</div>
                </div>
              </div>
            )}

            {/* Success */}
            {step === 'success' && (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-50 border border-green-200">
                  <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div className="text-green-700 font-semibold text-sm">Payment confirmed on GIWA</div>
                <div className="text-muted text-xs">Generating your report…</div>
              </div>
            )}

            {/* Error */}
            {step === 'error' && (
              <div className="space-y-3">
                <div className="rounded-xl p-3 bg-red-50 border border-red-200">
                  <div className="text-red-700 text-xs font-semibold mb-1">Payment failed</div>
                  <div className="text-red-700/70 text-xs leading-relaxed">{errMsg}</div>
                </div>
                <button onClick={() => { setStep('idle'); setErrMsg(''); }}
                  className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors bg-surface-alt border border-border text-ink hover:bg-border">
                  Try again
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-4 text-center">
            <a href={giwaExplorerAddressUrl(RECEIVER_ADDRESS)}
              target="_blank" rel="noreferrer"
              className="text-[11px] text-muted hover:text-ink transition-colors">
              View receiving address on GIWA Explorer ↗
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
