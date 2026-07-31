import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

function Arrow({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 shrink-0 w-14">
      <span className="text-[9px] text-muted font-medium text-center leading-tight whitespace-nowrap">{label}</span>
      <svg width="48" height="14" viewBox="0 0 48 14" fill="none">
        <line x1="0" y1="7" x2="36" y2="7" stroke="#B8B2A2" strokeWidth="1.5" strokeDasharray="4 3" />
        <polygon points="48,7 34,1 34,13" fill="#B8B2A2" />
      </svg>
    </div>
  );
}

export default function ProblemPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-ink">
      <Nav />

      <div className="pt-32 pb-20 px-8 flex flex-col min-h-screen">

        {/* Header */}
        <motion.div initial="hidden" animate="show" variants={stagger} className="text-center mb-14 max-w-3xl mx-auto">
          <motion.div variants={fade}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-medium border"
            style={{ background: 'rgba(185,28,28,0.06)', borderColor: 'rgba(185,28,28,0.2)', color: '#B91C1C' }}>
            The Problem
          </motion.div>
          <motion.h1 variants={fade} className="font-display text-4xl md:text-5xl leading-tight mb-4 text-ink">
            Web3 lending is blocked by paper-based due diligence
          </motion.h1>
          <motion.p variants={fade} className="text-muted text-base max-w-2xl mx-auto">
            Before a single token is minted or a dollar is lent, Web3 companies pay legacy
            vendors <strong className="text-ink">$12K–$20K</strong> and wait <strong className="text-ink">over a week</strong> just to verify zoning.
          </motion.p>
        </motion.div>

        {/* ── Full-width horizontal flowchart ── */}
        <motion.div initial="hidden" animate="show" variants={stagger}
          className="flex items-center w-full gap-0">

          {/* Node 1 — Web3 Company */}
          <motion.div variants={fade} className="flex-1 min-w-0">
            <div className="rounded-xl p-4 h-full text-center bg-surface border border-border">
              <div className="text-3xl mb-2">🏦</div>
              <div className="font-semibold text-sm leading-snug text-ink mb-1">Web3 Lending Company</div>
              <div className="text-[11px] text-muted leading-tight">RealT · Propy · Maple Finance · Centrifuge</div>
            </div>
          </motion.div>

          <motion.div variants={fade}><Arrow label="wants to fund" /></motion.div>

          {/* Node 2 — Real estate deal */}
          <motion.div variants={fade} className="flex-1 min-w-0">
            <div className="rounded-xl p-4 text-center bg-surface border border-border">
              <div className="text-3xl mb-2">🏗️</div>
              <div className="font-semibold text-sm leading-snug text-ink mb-1">Real Estate Project</div>
              <div className="text-[11px] text-muted leading-tight">Land loan · RWA tokenization · Fractional</div>
            </div>
          </motion.div>

          <motion.div variants={fade}><Arrow label="requires" /></motion.div>

          {/* Node 3 — DD needed */}
          <motion.div variants={fade} className="flex-1 min-w-0">
            <div className="rounded-xl p-4 text-center bg-surface border border-border">
              <div className="text-3xl mb-2">📋</div>
              <div className="font-semibold text-sm leading-snug text-ink mb-1">Zoning Due Diligence</div>
              <div className="text-[11px] text-muted leading-tight">Zoning history · Petitions · Rezoning risk</div>
            </div>
          </motion.div>

          <motion.div variants={fade}><Arrow label="so they hire" /></motion.div>

          {/* Node 4 — Legacy Vendor BOTTLENECK — stats live inside */}
          <motion.div variants={fade} className="flex-1 min-w-0">
            <div className="rounded-xl p-4 text-center bg-surface" style={{ border: '1px solid rgba(185,28,28,0.35)' }}>
              <div className="inline-flex items-center px-2 py-0.5 rounded-full mb-2 text-[10px] font-bold"
                style={{ background: 'rgba(185,28,28,0.1)', color: '#B91C1C', border: '1px solid rgba(185,28,28,0.3)' }}>
                BOTTLENECK
              </div>
              <div className="text-3xl mb-2">🏢</div>
              <div className="font-semibold text-sm leading-snug text-ink mb-1">Legacy Vendor</div>
              <div className="text-[11px] text-muted leading-tight mb-3">Manual aggregation · County portals</div>
              <div className="flex gap-2 justify-center">
                <div className="flex-1 rounded-lg py-2 px-1 bg-surface-alt">
                  <div className="text-lg font-display text-ink">$20K</div>
                  <div className="text-[9px] text-muted">per report</div>
                </div>
                <div className="flex-1 rounded-lg py-2 px-1 bg-surface-alt">
                  <div className="text-lg font-display text-ink">2 wks</div>
                  <div className="text-[9px] text-muted">to deliver</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fade}><Arrow label="delivers" /></motion.div>

          {/* Node 5 — Unverifiable PDF */}
          <motion.div variants={fade} className="flex-1 min-w-0">
            <div className="rounded-xl p-4 text-center bg-surface border border-border">
              <div className="text-3xl mb-2">📄</div>
              <div className="font-semibold text-sm leading-snug text-muted mb-1">Unverifiable PDF</div>
              <div className="text-[11px] text-muted leading-tight">No on-chain proof · Trusted blindly</div>
            </div>
          </motion.div>

          <motion.div variants={fade}><Arrow label="finally allows" /></motion.div>

          {/* Node 6 — Deal proceeds */}
          <motion.div variants={fade} className="flex-1 min-w-0">
            <div className="rounded-xl p-4 text-center bg-surface border border-border">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-semibold text-sm leading-snug text-muted mb-1">Deal Proceeds</div>
              <div className="text-[11px] text-muted leading-tight">Token minted · Loan originated</div>
            </div>
          </motion.div>

        </motion.div>

        {/* Root cause + CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="mt-14 rounded-2xl p-8 text-center max-w-3xl mx-auto w-full bg-surface border border-border">
          <div className="text-xs font-semibold tracking-widest text-muted mb-3 uppercase">Root Cause</div>
          <p className="text-ink text-sm leading-relaxed">
            Zoning history is <strong>siloed at the county level</strong>, unstructured,
            and requires manual aggregation. No cryptographic proof exists that a report is
            authentic, current, or untampered, so every counterparty has to trust an
            expensive vendor.
          </p>
          <button onClick={() => navigate('/tech')}
            className="mt-6 inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-background bg-ink text-sm hover:opacity-85 transition-opacity">
            See How Tojibox Fixes This →
          </button>
        </motion.div>

      </div>

      <Footer />
    </div>
  );
}
