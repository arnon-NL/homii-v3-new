// ═══════════════════════════════════════════════════════════════
// orgData.js — Org-aware data registry
// Preloads both Rochdale and Portaal datasets and provides
// a getDataset(orgId) function for the data layer.
// ═══════════════════════════════════════════════════════════════

// --- Rochdale (default / root data) ---
import rBuildings from "../../data/buildings.json";
import rServices from "../../data/services.json";
import rServiceCategories from "../../data/serviceCategories.json";
import rBuildingServices from "../../data/buildingServices.json";
import rCostAttribution from "../../data/costAttribution.json";
import rCostCategories from "../../data/costCategories.json";
import rVhes from "../../data/vhes.json";
import rMeters from "../../data/meters.json";
import rLedger from "../../data/ledgerEntries.json";
import rSettlements from "../../data/settlements.json";
import rSettlementChecks from "../../data/settlementChecks.json";
import rSuppliers from "../../data/suppliers.json";
import rSupplierCategories from "../../data/supplierCategories.json";
import rDistributionMethods from "../../data/distributionMethods.json";
import rDistributionModels from "../../data/distributionModels.json";
import rMonthlyClose from "../../data/monthlyCloseStatuses.json";
import rSavedViews from "../../data/savedViews.json";
import rActivities from "../../data/activities.json";
import rHeatingSeasons from "../../data/heatingSeasons.json";
import rModuleConfig from "../../data/moduleConfig.json";

// --- Portaal (energy-only — no ledger, settlement, or supplier data) ---
import pBuildings from "../../data/portaal/buildings.json";
import pServices from "../../data/portaal/services.json";
import pServiceCategories from "../../data/portaal/serviceCategories.json";
import pBuildingServices from "../../data/portaal/buildingServices.json";
import pCostAttribution from "../../data/portaal/costAttribution.json";
import pCostCategories from "../../data/portaal/costCategories.json";
import pVhes from "../../data/portaal/vhes.json";
import pMeters from "../../data/portaal/meters.json";
import pDistributionMethods from "../../data/portaal/distributionMethods.json";
import pDistributionModels from "../../data/portaal/distributionModels.json";
import pHeatingSeasons from "../../data/portaal/heatingSeasons.json";
import pSavedViews from "../../data/portaal/savedViews.json";
import pModuleConfig from "../../data/portaal/moduleConfig.json";

// ── Build indexes for a dataset ─────────────────────────────
function buildIndexes(ds) {
  // Buildings
  ds._buildingMap = new Map();
  for (const b of ds.buildings) ds._buildingMap.set(b.id, b);

  // Services
  ds._serviceMap = new Map();
  ds._serviceByCode = new Map();
  for (const s of ds.services) {
    ds._serviceMap.set(s.id, s);
    ds._serviceByCode.set(s.code, s);
  }

  // BuildingServices
  ds._bsByBuilding = new Map();
  ds._bsByService = new Map();
  ds._bsLookup = new Map();
  for (const bs of ds.buildingServices) {
    if (!ds._bsByBuilding.has(bs.buildingId)) ds._bsByBuilding.set(bs.buildingId, []);
    ds._bsByBuilding.get(bs.buildingId).push(bs);
    if (!ds._bsByService.has(bs.serviceId)) ds._bsByService.set(bs.serviceId, []);
    ds._bsByService.get(bs.serviceId).push(bs);
    ds._bsLookup.set(`${bs.buildingId}|${bs.serviceId}|${bs.year}`, bs);
  }

  // Cost attribution by VHE
  ds._caByVhe = new Map();
  for (const ca of ds.costAttribution) {
    if (!ds._caByVhe.has(ca.vheId)) ds._caByVhe.set(ca.vheId, []);
    ds._caByVhe.get(ca.vheId).push(ca);
  }

  // VHEs
  ds._vheMap = new Map();
  ds._vhesByBuilding = new Map();
  for (const v of ds.vhes) {
    ds._vheMap.set(v.id, v);
    if (!ds._vhesByBuilding.has(v.buildingId)) ds._vhesByBuilding.set(v.buildingId, []);
    ds._vhesByBuilding.get(v.buildingId).push(v);
  }

  // Meters
  ds._metersByBuilding = new Map();
  ds._metersByVhe = new Map();
  for (const m of ds.meters) {
    if (!ds._metersByBuilding.has(m.buildingId)) ds._metersByBuilding.set(m.buildingId, []);
    ds._metersByBuilding.get(m.buildingId).push(m);
    if (m.vheId) {
      if (!ds._metersByVhe.has(m.vheId)) ds._metersByVhe.set(m.vheId, []);
      ds._metersByVhe.get(m.vheId).push(m);
    }
  }

  // Ledger
  ds._ledgerByService = new Map();
  ds._ledgerByBuilding = new Map();
  ds._ledgerByServiceBuilding = new Map();
  for (const e of ds.ledgerEntries) {
    if (!ds._ledgerByService.has(e.serviceId)) ds._ledgerByService.set(e.serviceId, []);
    ds._ledgerByService.get(e.serviceId).push(e);
    if (!ds._ledgerByBuilding.has(e.buildingId)) ds._ledgerByBuilding.set(e.buildingId, []);
    ds._ledgerByBuilding.get(e.buildingId).push(e);
    const key = `${e.serviceId}|${e.buildingId}`;
    if (!ds._ledgerByServiceBuilding.has(key)) ds._ledgerByServiceBuilding.set(key, []);
    ds._ledgerByServiceBuilding.get(key).push(e);
  }

  // Settlements
  ds._settlementsByBuilding = new Map();
  for (const s of ds.settlements) {
    if (!ds._settlementsByBuilding.has(s.buildingId)) ds._settlementsByBuilding.set(s.buildingId, []);
    ds._settlementsByBuilding.get(s.buildingId).push(s);
  }

  // Settlement checks
  ds._checksByBldYear = new Map();
  for (const c of ds.settlementChecks) {
    const key = `${c.buildingId}|${c.year}`;
    if (!ds._checksByBldYear.has(key)) ds._checksByBldYear.set(key, []);
    ds._checksByBldYear.get(key).push(c);
  }

  // Suppliers
  ds._supplierMap = new Map();
  for (const s of ds.suppliers) ds._supplierMap.set(s.id, s);

  // Heating seasons by building
  ds._hsByBuilding = new Map();
  for (const hs of (ds.heatingSeasons || [])) {
    if (!ds._hsByBuilding.has(hs.buildingId)) ds._hsByBuilding.set(hs.buildingId, []);
    ds._hsByBuilding.get(hs.buildingId).push(hs);
  }

  // Distribution models by building
  ds._dmByBuilding = new Map();
  for (const dm of ds.distributionModels) {
    if (!ds._dmByBuilding.has(String(dm.buildingId))) ds._dmByBuilding.set(String(dm.buildingId), []);
    ds._dmByBuilding.get(String(dm.buildingId)).push(dm);
  }

  return ds;
}

// ── Create dataset objects ──────────────────────────────────
const rochdale = buildIndexes({
  buildings: rBuildings,
  services: rServices,
  serviceCategories: rServiceCategories,
  buildingServices: rBuildingServices,
  costAttribution: rCostAttribution,
  costCategories: rCostCategories,
  vhes: rVhes,
  meters: rMeters,
  ledgerEntries: rLedger,
  settlements: rSettlements,
  settlementChecks: rSettlementChecks,
  suppliers: rSuppliers,
  supplierCategories: rSupplierCategories,
  distributionMethods: rDistributionMethods,
  distributionModels: rDistributionModels,
  monthlyCloseStatuses: rMonthlyClose,
  savedViews: rSavedViews,
  activities: rActivities,
  moduleConfig: rModuleConfig,
  heatingSeasons: rHeatingSeasons,
});

const portaal = buildIndexes({
  buildings: pBuildings,
  services: pServices,
  serviceCategories: pServiceCategories,
  buildingServices: pBuildingServices,
  costAttribution: pCostAttribution,
  costCategories: pCostCategories,
  vhes: pVhes,
  meters: pMeters,
  ledgerEntries: [],          // energy-only: no ledger
  settlements: [],            // energy-only: no settlements
  settlementChecks: [],       // energy-only: no settlement checks
  suppliers: [],              // energy-only: no suppliers
  supplierCategories: [],     // energy-only: no supplier categories
  distributionMethods: pDistributionMethods,
  distributionModels: pDistributionModels,
  monthlyCloseStatuses: [],   // energy-only: no monthly close
  savedViews: pSavedViews,
  activities: [],             // energy-only: no activity feed
  moduleConfig: pModuleConfig,
  heatingSeasons: pHeatingSeasons,
});

const datasets = {
  rochdale,
  portaal,
};

/**
 * Get the dataset for an org. Falls back to rochdale.
 */
export function getDataset(orgId) {
  return datasets[orgId] || rochdale;
}

/**
 * Get available years for an org's buildings data.
 * Derived from buildingServices years.
 */
export function getAvailableYears(orgId) {
  const ds = getDataset(orgId);
  const years = new Set();
  for (const bs of ds.buildingServices) {
    if (bs.year) years.add(bs.year);
  }
  const sorted = [...years].sort((a, b) => a - b);
  return sorted.length > 0 ? sorted : [2024, 2025, 2026];
}
