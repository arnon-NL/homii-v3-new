// ═══════════════════════════════════════════════════════════════
// ledger.js — Ledger entries + getters (mock data, tagged)
// NOTE: Large dataset (~130K entries). Consider lazy-loading in production.
// ═══════════════════════════════════════════════════════════════
import rawLedger from "../../data/ledgerEntries.json";

// Indexes
const byService = new Map();
const byBuilding = new Map();
const byServiceBuilding = new Map();

for (const e of rawLedger) {
  // By service
  if (!byService.has(e.serviceId)) byService.set(e.serviceId, []);
  byService.get(e.serviceId).push(e);
  // By building
  if (!byBuilding.has(e.buildingId)) byBuilding.set(e.buildingId, []);
  byBuilding.get(e.buildingId).push(e);
  // By service+building
  const key = `${e.serviceId}|${e.buildingId}`;
  if (!byServiceBuilding.has(key)) byServiceBuilding.set(key, []);
  byServiceBuilding.get(key).push(e);
}

export const ledgerEntries = rawLedger;

export function getLedgerByService(serviceId) {
  return byService.get(serviceId) || [];
}

export function getLedgerByBuilding(buildingId) {
  return byBuilding.get(String(buildingId)) || [];
}

export function getLedgerByServiceAndBuilding(serviceId, buildingId) {
  return byServiceBuilding.get(`${serviceId}|${String(buildingId)}`) || [];
}

export function getLedgerGroupedByCostCategory(serviceId, buildingId) {
  const entries = buildingId
    ? getLedgerByServiceAndBuilding(serviceId, buildingId)
    : getLedgerByService(serviceId);

  const grouped = {};
  for (const e of entries) {
    const cat = e.costCategoryId || "uncategorized";
    if (!grouped[cat]) grouped[cat] = { total: 0, count: 0, entries: [] };
    grouped[cat].total += e.amount || 0;
    grouped[cat].count += 1;
    grouped[cat].entries.push(e);
  }
  return grouped;
}

export function getLedgerSummaryByService(serviceId) {
  const entries = getLedgerByService(serviceId);
  const byMonth = {};
  for (const e of entries) {
    const key = `${e.year}-${String(e.month).padStart(2, "0")}`;
    if (!byMonth[key]) byMonth[key] = { total: 0, count: 0 };
    byMonth[key].total += e.amount || 0;
    byMonth[key].count += 1;
  }
  return byMonth;
}

export function getLedgerSummaryByBuilding(buildingId) {
  const entries = getLedgerByBuilding(buildingId);
  const byService = {};
  for (const e of entries) {
    if (!byService[e.serviceId])
      byService[e.serviceId] = { total: 0, count: 0 };
    byService[e.serviceId].total += e.amount || 0;
    byService[e.serviceId].count += 1;
  }
  return byService;
}
