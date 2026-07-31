import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ETH_AMOUNT, ORACLE_CONTRACT_ADDRESS, RECEIPT_CONTRACT_ADDRESS, giwaExplorerAddressUrl } from '../constants/chain';

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

// ── On-chain links ─────────────────────────────────────────────────────────────
// GIWA is plain OP-Stack EVM — no HCS topics / HTS token IDs to link to like the
// Hedera version. Links below resolve to the two Tojibox contracts once
// deployed (see README — addresses come from VITE_ORACLE_CONTRACT_ADDRESS /
// VITE_RECEIPT_CONTRACT_ADDRESS); until then they fall back to the bare
// GIWA Sepolia explorer.
const EXPLORER_FALLBACK = 'https://sepolia-explorer.giwa.io';
const LINKS = {
  oracleContract:  ORACLE_CONTRACT_ADDRESS ? giwaExplorerAddressUrl(ORACLE_CONTRACT_ADDRESS) : EXPLORER_FALLBACK,
  receiptContract: RECEIPT_CONTRACT_ADDRESS ? giwaExplorerAddressUrl(RECEIPT_CONTRACT_ADDRESS) : EXPLORER_FALLBACK,
};

export default function TechPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050a10] text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(5,10,16,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate('/')} className="flex items-center">
          <img src="/tojibox-wordmark.svg" alt="Tojibox" className="h-9 w-auto" />
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/map')}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold text-sky-300 hover:text-white transition-colors"
            style={{ border: '1px solid rgba(14,165,233,0.3)' }}>
            Open Map
          </button>
        </div>
      </nav>

      <div className="pt-24 pb-20 px-6 max-w-5xl mx-auto">

        {/* Hero */}
        <motion.div initial="hidden" animate="show" variants={stagger} className="text-center mb-20">
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold"
            style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', color: '#7dd3fc' }}>
            Technology Stack
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-black leading-none mb-4">
            <span className="bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">
              Built on Three
            </span>
            <br />
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Trustless Pillars
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-slate-400 text-lg max-w-2xl mx-auto">
            Tojibox combines GIWA, Chainlink CRE, and ENS to replace a $12,000–$20,000
            vendor due diligence process with cryptographic proof — verifiable in seconds.
          </motion.p>
        </motion.div>

        {/* Problem / Impact bar */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
          {[
            { label: 'Current cost', value: '$12K – $20K', sub: 'per parcel, paid to vendors', color: '#ef4444' },
            { label: 'Time to verify', value: 'Weeks', sub: 'fragmented county data', color: '#f59e0b' },
            { label: 'With Tojibox', value: '< 5 seconds', sub: 'scan QR · verified on-chain', color: '#22c55e' },
          ].map(({ label, value, sub, color }) => (
            <motion.div key={label} variants={fadeUp}
              className="rounded-2xl p-6 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">{label}</div>
              <div className="text-3xl font-black mb-1" style={{ color }}>{value}</div>
              <div className="text-xs text-slate-500">{sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── GIWA ────────────────────────────────────────────────────────────── */}
        <TechSection
          color="#7C5CFC"
          bgColor="rgba(124,92,252,0.05)"
          borderColor="rgba(124,92,252,0.15)"
          badge="GIWA"
          badgeBg="rgba(124,92,252,0.15)"
          title="Two Contracts. One OP-Stack L2."
          subtitle="Every layer of the Tojibox trust chain writes to a plain EVM contract on GIWA — no separate SDK, no sidecar process, no relay quirks."
          logo={<GiwaLogo />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <GiwaCard
              title="Report Hash Anchored On-Chain"
              chip="TojiboxReportReceipt.sol"
              href={LINKS.receiptContract}
              description="Every time a due diligence report is generated, its hash — along with the property PIN and oracle address — is written into TojiboxReportReceipt's public contract state. Any third party can independently verify on the GIWA explorer without trusting Tojibox."
              icon="📋"
            />
            <GiwaCard
              title="Petition Batch Merkle Root"
              chip="TojiboxOracle.sol"
              href={LINKS.oracleContract}
              description="Every zoning petition batch commit from the CRE oracle calls commitBatch() on TojiboxOracle — anchoring the exact Merkle root, batch ID, and petition count that entered the blockchain. Full audit trail of the data pipeline."
              icon="🗂️"
            />
            <GiwaCard
              title="TojiboxReceipt (ERC-721)"
              chip="TojiboxReportReceipt.sol"
              href={LINKS.receiptContract}
              description="When a user pays for a report via x402, a TojiboxReceipt NFT is minted on GIWA. The token ID is the on-chain receipt — proof that this report was purchased and issued. Standard ERC-721, mintable directly from FastAPI via web3.py."
              icon="🪙"
            />
            <GiwaCard
              title="Automated Batch Commits"
              chip="CRE workflow · cron"
              href={LINKS.oracleContract}
              description="A scheduled pipeline (Chainlink CRE workflow, or a plain cron job) periodically builds the Merkle tree and calls commitBatch() — autonomous on-chain anchoring that runs without a human trigger, no native scheduling primitive required."
              icon="⏰"
            />
          </div>

          <div className="mt-4 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
            style={{ background: 'rgba(124,92,252,0.06)', border: '1px solid rgba(124,92,252,0.15)' }}>
            <FeatureRow icon="💸" title="x402 Payments"
              desc={`Every report download is gated by HTTP 402. The client pays ${ETH_AMOUNT} ETH and retries with the TX hash — verified directly against GIWA's JSON-RPC (eth_getTransactionReceipt), with replay protection.`} />
            <FeatureRow icon="🤖" title="AI Agent Auto-Payments"
              desc="The Tojibox MCP Server gives AI agents (Claude, etc.) tools to query parcels. When the agent gets a 402, it autonomously sends native ETH via ethers.js — no human action, no separate wallet SDK." />
          </div>
        </TechSection>

        {/* ── CHAINLINK CRE ──────────────────────────────────────────────────── */}
        <TechSection
          color="#375BD2"
          bgColor="rgba(55,91,210,0.05)"
          borderColor="rgba(55,91,210,0.15)"
          badge="Chainlink CRE"
          badgeBg="rgba(55,91,210,0.15)"
          title="Trustless Zoning Oracle via BFT Consensus"
          subtitle="Three independent CRE nodes scrape, hash, and reach consensus — turning fragmented county data into a single verifiable source of truth."
          logo={<ChainlinkLogo />}
        >
          <div className="mt-6 space-y-4">
            <div className="rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(55,91,210,0.2)' }}>
              {[
                { step: '01', title: 'Scrape', desc: 'Three CRE nodes independently pull rezoning petitions and parcel changes from Wake County\'s ArcGIS REST API on a schedule. Each node operates in isolation.' },
                { step: '02', title: 'Hash', desc: 'Each node hashes all petition events into a SHA-256 Merkle tree. The Merkle root is a 32-byte cryptographic fingerprint of the entire zoning history.' },
                { step: '03', title: 'Consensus', desc: '2-of-3 nodes must agree on the same Merkle root before a commit is allowed. No single node can corrupt the record — Byzantine Fault Tolerant.' },
                { step: '04', title: 'Commit', desc: 'The consensus root is written to TojiboxOracle.sol on GIWA. Immutable, public, verifiable by anyone.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4 p-4 border-b last:border-b-0"
                  style={{ borderColor: 'rgba(55,91,210,0.15)', background: 'rgba(55,91,210,0.04)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-sm"
                    style={{ background: 'rgba(55,91,210,0.2)', color: '#818cf8' }}>
                    {step}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white mb-0.5">{title}</div>
                    <div className="text-xs text-slate-400 leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <a href={LINKS.oracleContract} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl transition-all hover:opacity-80"
              style={{ background: 'rgba(55,91,210,0.08)', border: '1px solid rgba(55,91,210,0.2)' }}>
              <div>
                <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wide mb-0.5">GIWA Oracle Contract</div>
                <div className="font-mono text-xs text-slate-300">{ORACLE_CONTRACT_ADDRESS || 'Not yet deployed'}</div>
              </div>
              <div className="text-slate-500 text-xs">View on GIWA Explorer →</div>
            </a>
          </div>
        </TechSection>

        {/* ── ENS ────────────────────────────────────────────────────────────── */}
        <TechSection
          color="#5298FF"
          bgColor="rgba(82,152,255,0.05)"
          borderColor="rgba(82,152,255,0.15)"
          badge="ENS"
          badgeBg="rgba(82,152,255,0.15)"
          title="tojibox.eth — Cryptographic Oracle Identity"
          subtitle="The Tojibox oracle is identified by its ENS name. Every report carries a signed proof that traces back to tojibox.eth — verifiable by anyone without trusting Tojibox."
          logo={<ENSLogo />}
        >
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { num: '1', title: 'Oracle Signs', desc: 'The oracle signs every report hash with its ECDSA key (secp256k1 / EIP-191) — the same key that controls tojibox.eth on Sepolia.' },
                { num: '2', title: 'PDF Carries Proof', desc: 'The PDF report embeds the oracle ENS name, address, report hash, ECDSA signature, GIWA tx hash, receipt token ID, and a QR code linking to the verify page.' },
                { num: '3', title: 'Anyone Can Verify', desc: 'Scan the QR → resolve tojibox.eth → recover signer → confirm match. The report is genuine if the addresses match. The GIWA tx and ERC-721 receipt provide two additional proof layers.' },
              ].map(({ num, title, desc }) => (
                <div key={num} className="rounded-xl p-4"
                  style={{ background: 'rgba(82,152,255,0.06)', border: '1px solid rgba(82,152,255,0.15)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs mb-3"
                    style={{ background: 'rgba(82,152,255,0.2)', color: '#93c5fd' }}>
                    {num}
                  </div>
                  <div className="font-bold text-sm text-white mb-1">{title}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: 'rgba(82,152,255,0.06)', border: '1px solid rgba(82,152,255,0.12)' }}>
              <span className="text-2xl mt-0.5">🔐</span>
              <div>
                <div className="text-sm font-bold text-blue-300 mb-1">Why ENS instead of just a raw address?</div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  A raw Ethereum address is opaque. <strong className="text-slate-200">tojibox.eth</strong> is a human-readable, decentralized identity.
                  When a lender or tokenizer receives a PDF, they can independently look up <code className="text-blue-300">tojibox.eth</code> to find
                  the oracle's address without ever visiting the Tojibox website — the identity lives on Ethereum, not on our servers.
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/verify/demo')}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-80"
              style={{ background: 'rgba(82,152,255,0.15)', border: '1px solid rgba(82,152,255,0.3)', color: '#93c5fd' }}>
              Try the Verify Page →
            </button>
          </div>
        </TechSection>

        {/* ── Full flow ──────────────────────────────────────────────────────── */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="mt-8 rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="px-6 pt-6 pb-4"
            style={{ background: 'linear-gradient(135deg, rgba(124,92,252,0.08), rgba(55,91,210,0.08))' }}>
            <motion.div variants={fadeUp} className="text-xs text-slate-500 uppercase tracking-widest mb-1">Full Flow</motion.div>
            <motion.h2 variants={fadeUp} className="text-xl font-black text-white">From County Data to Verified PDF</motion.h2>
          </div>
          <div className="divide-y" style={{ divideColor: 'rgba(255,255,255,0.05)' }}>
            {[
              { icon: '🗺️', actor: 'User', action: 'Searches property address or PIN on the Tojibox map', tech: null },
              { icon: '👁️', actor: 'Oracle', action: 'Shows free petition count preview (no payment)', tech: 'CRE data' },
              { icon: '💸', actor: 'User', action: `Pays ${ETH_AMOUNT} ETH via x402 to unlock the full report`, tech: 'GIWA x402' },
              { icon: '✍️', actor: 'Oracle', action: 'Signs report with tojibox.eth ECDSA key', tech: 'ENS identity' },
              { icon: '📋', actor: 'GIWA', action: 'Report hash written into TojiboxReportReceipt contract state', tech: 'On-chain' },
              { icon: '🪙', actor: 'GIWA', action: 'TojiboxReceipt NFT minted (ERC-721)', tech: 'ERC-721' },
              { icon: '📄', actor: 'User', action: 'Downloads PDF with seal, QR code, GIWA tx, receipt token ID', tech: 'Report' },
              { icon: '✅', actor: 'Anyone', action: 'Scans QR → /verify/hash → checks ECDSA + GIWA tx + ERC-721 receipt', tech: 'All proofs' },
            ].map(({ icon, actor, action, tech }, i) => (
              <motion.div key={i} variants={fadeUp}
                className="flex items-center gap-4 px-6 py-3"
                style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                <div className="text-xl w-8 text-center flex-shrink-0">{icon}</div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-500 mr-2">{actor}</span>
                  <span className="text-sm text-slate-300">{action}</span>
                </div>
                {tech && (
                  <div className="px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0"
                    style={{ background: 'rgba(14,165,233,0.15)', color: '#7dd3fc' }}>
                    {tech}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          className="mt-12 text-center">
          <button
            onClick={() => navigate('/map')}
            className="px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', boxShadow: '0 4px 24px rgba(14,165,233,0.35)' }}>
            Open the Map →
          </button>
          <div className="text-xs text-slate-600 mt-3">
            Powered by GIWA · Chainlink CRE · ENS
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function TechSection({ color, bgColor, borderColor, badge, badgeBg, title, subtitle, logo, children }) {
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
      className="mb-12 rounded-2xl overflow-hidden"
      style={{ background: bgColor, border: `1px solid ${borderColor}` }}>
      <div className="p-6 pb-2">
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: badgeBg, color }}>
              {badge}
            </div>
          </div>
          {logo}
        </motion.div>
        <motion.h2 variants={fadeUp} className="text-xl md:text-2xl font-black text-white mb-2">{title}</motion.h2>
        <motion.p variants={fadeUp} className="text-sm text-slate-400 leading-relaxed">{subtitle}</motion.p>
      </div>
      <div className="px-6 pb-6">{children}</div>
    </motion.div>
  );
}

function GiwaCard({ title, chip, href, description, icon }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="block rounded-xl p-4 transition-all hover:opacity-80"
      style={{ background: 'rgba(124,92,252,0.07)', border: '1px solid rgba(124,92,252,0.15)' }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <div className="text-sm font-bold text-white">{title}</div>
        </div>
        <div className="px-2 py-0.5 rounded text-[10px] font-mono flex-shrink-0"
          style={{ background: 'rgba(124,92,252,0.2)', color: '#c4b5fd' }}>
          {chip}
        </div>
      </div>
      <div className="text-xs text-slate-400 leading-relaxed">{description}</div>
      <div className="text-[10px] text-indigo-400 mt-2">View on GIWA Explorer →</div>
    </a>
  );
}

function FeatureRow({ icon, title, desc }) {
  return (
    <div className="flex gap-3">
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div>
        <div className="text-sm font-bold text-white mb-0.5">{title}</div>
        <div className="text-xs text-slate-400 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

function GiwaLogo() {
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-[10px]"
      style={{ background: 'rgba(124,92,252,0.2)', color: '#c4b5fd' }}>L2</div>
  );
}

function ChainlinkLogo() {
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-xs"
      style={{ background: 'rgba(55,91,210,0.2)', color: '#818cf8' }}>CRE</div>
  );
}

function ENSLogo() {
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-xs"
      style={{ background: 'rgba(82,152,255,0.2)', color: '#93c5fd' }}>ETH</div>
  );
}
