import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ORACLE_CONTRACT_ADDRESS, giwaExplorerAddressUrl } from '../constants/chain';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const STEPS = [
  {
    num: '01',
    title: 'CRE Nodes Fetch Data',
    desc: "Three independent Chainlink CRE nodes pull rezoning petitions and parcel changes from Wake County's open data API every hour.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
          d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'BFT Consensus → Merkle Root',
    desc: 'Each node independently hashes the events into a SHA-256 Merkle tree. 2 of 3 nodes must agree on the same root before it is committed.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
          d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Root Anchored on GIWA',
    desc: 'The consensus Merkle root (32 bytes) is written to TojiboxOracle.sol on GIWA, an OP Stack EVM L2. Each batch is forever on-chain and publicly verifiable.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    icon: '⛓️',
    title: 'On-Chain Merkle Proof',
    desc: 'Every rezoning petition and parcel change is hashed into a cryptographic Merkle tree. The root is committed to GIWA, tamper-proof and auditable by anyone.',
  },
  {
    icon: '🔮',
    title: 'Chainlink CRE Oracle',
    desc: 'A decentralized oracle network of 3 nodes reaches BFT consensus on zoning data before writing to chain. No single point of failure or trust.',
  },
  {
    icon: '🗺️',
    title: '434k Parcel Map',
    desc: 'Explore all 434,000 Wake County parcels rendered in real-time from Mapbox vector tiles. Click any parcel to see zoning history, owner, and assessed value.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Search',
    desc: 'Ask in plain English: "Show me all N1 to B1 conversions" or "Find commercial rezoning near downtown Raleigh." AI maps the results to parcels on the map.',
  },
];

const TECH = [
  { name: 'Chainlink CRE', sub: 'Decentralized Oracle' },
  { name: 'GIWA', sub: 'On-Chain Proof (OP Stack L2)' },
  { name: 'Mapbox', sub: 'Vector Tile Map' },
  { name: 'Wake County', sub: 'Live GIS Data' },
  { name: 'Claude AI', sub: 'Zoning Assistant' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

export default function Landing() {
  const navigate = useNavigate();
  const contractLink = ORACLE_CONTRACT_ADDRESS ? giwaExplorerAddressUrl(ORACLE_CONTRACT_ADDRESS) : null;

  return (
    <div className="min-h-screen bg-background text-ink overflow-x-hidden">
      <Nav />

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8 text-xs font-medium border border-border text-muted">
            Wake County, NC · Pilot market on GIWA
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-normal text-5xl md:text-7xl leading-[1.05] mb-8 text-ink">
            Due diligence reports<br />built for on-chain proof.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-muted max-w-2xl mb-10 leading-relaxed">
            Tojibox turns county zoning and parcel records into cryptographically verifiable
            due diligence reports, anchored on GIWA by a Chainlink CRE oracle network.
            Live today in Wake County, NC, built to scale to every US county.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap gap-3 mb-20">
            <button
              onClick={() => navigate('/map')}
              className="px-6 py-3 rounded-lg font-semibold text-background bg-ink text-sm hover:opacity-85 transition-opacity">
              Explore 434k Parcels
            </button>
            <a
              href={contractLink || 'https://sepolia-explorer.giwa.io'}
              target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg font-medium text-ink text-sm border border-border hover:bg-surface transition-colors">
              View on GIWA ↗
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-8 max-w-lg border-t border-border pt-8">
            {[
              { value: '434k', label: 'Wake County Parcels' },
              { value: '3-node', label: 'CRE Oracle Network' },
              { value: '100%', label: 'On-Chain Verifiable' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl text-ink">{s.value}</div>
                <div className="text-xs text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="mb-14">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">How It Works</div>
          <h2 className="font-display text-3xl md:text-4xl text-ink">
            From county GIS to on-chain proof
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="rounded-xl p-6 bg-surface border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl font-display text-muted">{step.num}</div>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-surface-alt text-ink">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-ink font-semibold text-base mb-2">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Features</div>
          <h2 className="font-display text-3xl md:text-4xl text-ink">Built for real-world verification</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl p-6 bg-surface border border-border">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-ink font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Tech stack ── */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Tech Stack</div>
        </motion.div>
        <div className="flex flex-wrap gap-3">
          {TECH.map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="px-5 py-3 rounded-xl bg-surface border border-border">
              <div className="font-semibold text-sm text-ink">{t.name}</div>
              <div className="text-muted text-xs mt-0.5">{t.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center rounded-2xl p-12 bg-surface border border-border">
          <h2 className="font-display text-3xl text-ink mb-3">
            Explore the map
          </h2>
          <p className="text-muted mb-8">
            Navigate 434,000 Wake County parcels. Search by address or ask AI. Every result is backed by on-chain data.
          </p>
          <button
            onClick={() => navigate('/map')}
            className="px-8 py-3.5 rounded-lg font-semibold text-background bg-ink text-sm hover:opacity-85 transition-opacity">
            Open Interactive Map
          </button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
