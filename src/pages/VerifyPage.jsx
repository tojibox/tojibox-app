import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyReport } from '../services/api';
import { Nav } from '../components/Nav';

export default function VerifyPage() {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hash) return;
    verifyReport(hash)
      .then(data => { setResult(data); setLoading(false); })
      .catch(() => { setResult({ valid: false, reason: 'Could not reach Tojibox oracle.' }); setLoading(false); });
  }, [hash]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pt-20">
      <Nav />

      <div className="mb-8 text-center">
        <div className="font-wordmark text-xl text-ink tracking-tight">TOJIBOX</div>
        <div className="text-xs text-muted mt-1">Report Authenticity Verification</div>
      </div>

      <div className="w-full max-w-lg bg-surface border border-border rounded-2xl overflow-hidden">

        {/* Status bar */}
        <div className={`h-1.5 w-full ${loading ? 'bg-border' : result?.valid ? 'bg-ink' : 'bg-red-500'}`} />

        <div className="p-8">
          {loading && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted text-sm">Verifying report signature…</p>
            </div>
          )}

          {!loading && result && (
            <>
              {/* Status badge */}
              <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 border ${
                result.valid
                  ? 'bg-surface-alt border-border'
                  : 'bg-red-50 border-red-200'
              }`}>
                <span className="text-2xl">{result.valid ? '✅' : '❌'}</span>
                <div>
                  <div className={`font-semibold text-base ${result.valid ? 'text-ink' : 'text-red-700'}`}>
                    {result.valid ? 'Authentic Tojibox Report' : 'Verification Failed'}
                  </div>
                  <div className="text-xs text-muted mt-0.5">
                    {result.valid
                      ? 'Signed by tojibox.eth oracle · Logged on GIWA · ERC-721 receipt minted'
                      : result.reason || 'Signature does not match the Tojibox oracle'}
                  </div>
                </div>
              </div>

              {result.valid && (
                <div className="space-y-3">
                  <Row label="Issued by" value={result.oracle_ens} highlight />
                  <Row label="Oracle address" value={result.oracle_address} mono />
                  <Row label="Property PIN" value={result.pin} />
                  <Row label="Property" value={result.site_address} />
                  <Row label="Generated" value={result.generated_at?.replace('T', ' ').replace('Z', ' UTC')} />

                  <div className="pt-2 border-t border-border">
                    <div className="text-xs text-muted mb-1">REPORT HASH</div>
                    <div className="font-mono text-xs text-ink break-all">{result.report_hash}</div>
                  </div>

                  {/* On-chain receipt — a single TojiboxReportReceipt (ERC-721) mint on
                      GIWA covers both the audit-timestamp and the receipt NFT, so the
                      API returns one nft_receipt object rather than two proofs. */}
                  {result.nft_receipt && (
                    <div className="pt-2 border-t border-border">
                      <div className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">
                        On-Chain Receipt (ERC-721)
                      </div>
                      <div className="bg-surface-alt border border-border rounded-lg p-3 space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted">Token ID</span>
                          <span className="text-ink font-mono">{result.nft_receipt.token_id}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted">Tx hash</span>
                          <span className="text-ink font-mono">{result.nft_receipt.tx_hash}</span>
                        </div>
                        {result.nft_receipt.explorer_url && (
                          <a
                            href={result.nft_receipt.explorer_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs text-ink underline hover:text-muted mt-1"
                          >
                            View on GIWA Explorer →
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!result.valid && (
                <div className="text-center py-4">
                  <p className="text-muted text-sm">
                    This hash was not issued by the Tojibox oracle, or the report has been tampered with.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-border flex items-center justify-between">
          <div className="text-xs text-muted">
            Signed · Logged on GIWA · ERC-721 minted · GIWA Sepolia
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-xs text-ink hover:text-muted transition-colors"
          >
            ← Back to map
          </button>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted max-w-sm text-center">
        Every Tojibox report is signed with ECDSA, and its hash plus an ERC-721
        receipt are minted on GIWA, a public OP-Stack L2, for tamper-proof,
        on-chain verification.
      </p>
    </div>
  );
}

function Row({ label, value, mono, highlight }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <div className="text-xs text-muted uppercase tracking-wide shrink-0 pt-0.5">{label}</div>
      <div className={`text-sm text-right break-all ${
        highlight ? 'text-ink font-semibold' :
        mono ? 'font-mono text-ink' : 'text-ink'
      }`}>
        {value || '—'}
      </div>
    </div>
  );
}
