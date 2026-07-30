# togibox-app

React frontend for **Togibox** — a decentralized land registry for Wake County, NC,
ported from the Hedera-based [ZoneProof](https://github.com) project to
**GIWA** (an OP Stack EVM L2, testnet "GIWA Sepolia", chain ID `91342`).

This is one of three sibling repos:

| Repo | Owns |
|---|---|
| `togibox-scraper` | Wake County scraping, merkle-commit pipeline, `TogiboxOracle.sol` |
| `togibox-api` | FastAPI serving layer, x402 payment gate, report signing, `TogiboxReportReceipt.sol` |
| **`togibox-app`** | This repo — React/Vite frontend |

## What it does

1. **Parcel Explorer** — interactive Mapbox map of 434k+ Wake County parcels. Click
   any parcel to see zoning history, owner, assessed value, and on-chain proof.
2. **x402 Paid Reports** — pay a small amount of ETH on GIWA Sepolia (via MetaMask
   or any standard EVM wallet) to unlock full rezoning history and download a
   branded PDF due-diligence report with an embedded QR verification seal.
3. **Report Verification** — `/verify/:hash` independently checks a report's ECDSA
   signature, the GIWA transaction that anchored its hash on-chain, and its
   ERC-721 receipt (`TogiboxReportReceipt`).
4. **AI Zoning Assistant** — ask questions in plain English ("Show N1 to B1
   conversions") and get results mapped directly onto the parcel map.

## Tech stack

- **React 19 + Vite** — fast dev server and build
- **Tailwind CSS** — utility-first styling
- **Mapbox GL JS** — vector tile map rendering (434k parcels served as Mapbox tilesets)
- **Framer Motion** — page and panel animations
- **React Router v6** — client-side routing
- **ethers.js v6** — wallet connection, GIWA Sepolia chain add/switch, ETH payments
- **jsPDF + jspdf-autotable** — client-side PDF report generation
- **Deployed on** Vercel

## Why GIWA instead of Hedera

GIWA is a plain OP-Stack EVM chain, so this frontend is simpler than the original
ZoneProof app in a few concrete ways:

- **Wallet connection** (`src/hooks/useWallet.js`) uses the standard
  `window.ethereum` injected-provider pattern. The original `useHashPack.js` did
  an elaborate EIP-6963 "announce provider" dance specifically to find the
  HashPack extension even when other wallets were installed, because Hedera
  payments required HashPack specifically. GIWA works with any EVM wallet
  (MetaMask, etc.), so that whole detection dance is gone.
- **No mirror-node lag workarounds.** The original hook waited 4 seconds after
  a transaction before querying the oracle (Hedera's mirror node lags behind
  consensus by a few seconds) and retried the paid endpoint up to 3 times.
  GIWA's RPC is a normal, reliably-indexed OP-Stack endpoint, so this is
  trimmed to one light retry as a safety net, no artificial delay.
- **HBAR (ℏ) → ETH** everywhere amounts are shown; HashScan links → GIWA Sepolia
  explorer links (`https://sepolia-explorer.giwa.io`).

## Folder structure

```
togibox-app/
├── index.html                  # HTML shell — title, meta tags, favicon
├── tailwind.config.js          # Tailwind theme
├── vite.config.js              # Vite config — dev proxy to togibox-api (/oracle) + AI chat backend (/api)
├── vercel.json                 # Vercel build config (npm install && npm run build → dist/)
├── public/
│   ├── togibox-wordmark.svg    # Placeholder brand assets — see TODO below
│   ├── togibox-favicon.svg
│   ├── togibox.svg
│   └── Togibox Logo.svg
└── src/
    ├── main.jsx                # React root — mounts App
    ├── App.jsx                 # Router setup — 5 routes: /, /map, /verify/:hash, /tech, /problem
    ├── index.css                # Global styles — Tailwind base, scrollbar, Mapbox overlay classes
    ├── constants/
    │   ├── chain.js             # GIWA Sepolia chain params, receiver address, ETH price, explorer URL builders
    │   └── map.js                # Mapbox token, tileset ID, map styles, center/zoom, petition regex
    ├── services/
    │   └── api.js                 # Centralized oracle fetch calls — getParcel, getParcelHistoryPeek,
    │                              #   getParcelHistory, searchParcels, verifyReport, sendChatMessage
    ├── hooks/
    │   └── useWallet.js           # Wallet connect + GIWA Sepolia switch/add + ETH payment + X-Payment header
    ├── components/
    │   └── PaymentGate.jsx        # x402 payment modal — idle → paying → success → error
    └── pages/
        ├── Landing.jsx             # Marketing landing page
        ├── MapPage.jsx              # Full-screen parcel map + AI chat panel + parcel detail panel + PDF report generator
        ├── VerifyPage.jsx            # /verify/:hash — ECDSA + on-chain audit proof + ERC-721 receipt display
        ├── TechPage.jsx               # "How it works" — GIWA / Chainlink CRE / ENS deep dive
        └── ProblemPage.jsx             # Problem statement flowchart
```

## Key constants (`src/constants/chain.js`)

- `GIWA_SEPOLIA` — chain params passed to `wallet_switchEthereumChain` /
  `wallet_addEthereumChain` (chain ID `0x164ee` = `91342`, RPC
  `https://sepolia-rpc.giwa.io/`, explorer `https://sepolia-explorer.giwa.io`)
- `RECEIVER_ADDRESS` — the oracle's GIWA address that collects x402 payments
- `ETH_AMOUNT` — price to unlock a full report (`0.001` ETH, matches
  togibox-api's x402 middleware default)
- `giwaExplorerTxUrl(hash)` / `giwaExplorerAddressUrl(addr)` — explorer link builders
- `ORACLE_CONTRACT_ADDRESS` / `RECEIPT_CONTRACT_ADDRESS` — optional, enable "view
  on GIWA Explorer" links once togibox-scraper/togibox-api are deployed

## Local setup

```bash
npm install

cp .env.example .env
# fill in VITE_MAPBOX_TOKEN and VITE_RECEIVER_ADDRESS at minimum

npm run dev
# App available at http://localhost:5174
```

The dev server proxies `/oracle/*` to `togibox-api` (default `http://localhost:8001`,
rewritten to `/api/oracle/*`) and `/api/*` to an optional separate AI chat backend
(default `http://localhost:8000`). Adjust the ports in `vite.config.js` if your
local `togibox-api` runs elsewhere.

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL of the AI chat backend (optional separate service) |
| `VITE_MAPBOX_TOKEN` | Mapbox public token (`pk.ey...`) — required for map rendering |
| `VITE_RECEIVER_ADDRESS` | GIWA address that receives x402 report payments |
| `VITE_ORACLE_CONTRACT_ADDRESS` | Deployed `TogiboxOracle.sol` address (optional, enables explorer links) |
| `VITE_RECEIPT_CONTRACT_ADDRESS` | Deployed `TogiboxReportReceipt.sol` address (optional, enables explorer links) |

No secret or real token is committed anywhere in this repo — copy `.env.example`
to `.env` (gitignored) and fill in real values locally.

## TODO — brand assets

`public/togibox-*.svg` and `public/Togibox Logo.svg` are **direct copies of the
original ZoneProof artwork, only renamed** — the logo shapes, wordmark text, and
colors inside them still say "ZoneProof" and were not hand-edited (that requires
real design work this port didn't attempt). Swap these four files for real
Togibox brand assets before shipping. `hedera-icon.png` was dropped entirely
(no GIWA equivalent icon available locally); the on-chain marker badge on the
map now renders a plain inline SVG checkmark instead — see the comment above
`placeOnChainMarker` in `src/pages/MapPage.jsx`.

## Known limitations

- `verification_seal` / `onchain_proof` / `erc721_receipt` field shapes
  (`src/pages/MapPage.jsx`, `src/pages/VerifyPage.jsx`) are **assumed**, not
  confirmed against a live `togibox-api` — that sibling repo didn't exist yet
  at the time this frontend was ported. Adjust field names if the actual API
  response shape differs once `togibox-api`'s `/verify/{hash}` and report
  routes are implemented.
- `ORACLE_CONTRACT_ADDRESS` / `RECEIPT_CONTRACT_ADDRESS` are blank until the
  contracts are deployed; the UI falls back to "not yet deployed" copy.
