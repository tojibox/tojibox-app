/**
 * Centralized calls to tojibox-api's oracle routes (proxied through Vite's
 * `/oracle` -> `/api/oracle` rewrite in dev, same-origin in prod) plus the
 * optional AI chat backend. Mirrors the uszoning-app `services/api.js`
 * convention — the original zoneproof frontend called `fetch` inline from
 * MapPage.jsx/VerifyPage.jsx instead.
 */

const ORACLE_BASE = '/oracle';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function asJson(res) {
  if (!res.ok) throw new Error(`Oracle returned ${res.status}`);
  return res.json();
}

/** URL for the paid parcel-history endpoint (x402-gated) — used by PaymentGate/useWallet. */
export function parcelHistoryUrl(pin) {
  return `${ORACLE_BASE}/parcels/${encodeURIComponent(pin)}/history`;
}

/** Free — basic parcel info. */
export async function getParcel(pin) {
  const res = await fetch(`${ORACLE_BASE}/parcels/${encodeURIComponent(pin)}`);
  if (res.status === 404) return null;
  return asJson(res);
}

/** Free — petition count preview, no payment required. */
export async function getParcelHistoryPeek(pin) {
  const res = await fetch(`${ORACLE_BASE}/parcels/${encodeURIComponent(pin)}/history/peek`);
  if (!res.ok) return null;
  return res.json();
}

/** Paid — full rezoning history. Requires an X-Payment header from a completed on-chain payment. */
export async function getParcelHistory(pin, paymentHeader) {
  const res = await fetch(parcelHistoryUrl(pin), { headers: { 'X-Payment': paymentHeader } });
  return asJson(res);
}

/** Petition geometry lookup, used for search-by-petition-number ("Z-29-2023"). */
export async function searchParcels(petitionNumber) {
  const res = await fetch(`${ORACLE_BASE}/petitions/${encodeURIComponent(petitionNumber)}/geojson`);
  if (!res.ok) return null;
  return res.json();
}

/** Report authenticity check for /verify/:hash. */
export async function verifyReport(hash) {
  const res = await fetch(`${ORACLE_BASE}/verify/${encodeURIComponent(hash)}`);
  return res.json();
}

/** AI zoning assistant chat (MapPage AiPanel). */
export async function sendChatMessage(message, countyId = 'raleigh_nc', conversationHistory = []) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, county_id: countyId, conversation_history: conversationHistory }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export { API_BASE };
