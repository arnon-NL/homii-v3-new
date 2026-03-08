// ═══════════════════════════════════════════════════════════════
// src/lib/data/index.js — Main data layer exports
// Drop-in replacement for mockData.js — all component imports
// should work without changes via the mockData.js wrapper.
// ═══════════════════════════════════════════════════════════════

// --- Buildings ---
export { buildings, getBuilding, getBuildingByComplexId } from "./buildings.js";

// --- Services ---
export {
  services,
  serviceCategories,
  getService,
  getServiceByCode,
  getServicesByCategory as getServicesByCategoryId,
} from "./services.js";

// --- Finance (buildingServices, costAttribution, costCategories) ---
export {
  buildingServices,
  costAttribution,
  costCategories,
  getBuildingServices,
  getBuildingServicesByService,
  getBuildingService,
  getCostAttributionByVhe,
  getCostCategoriesByService,
} from "./finance.js";

// --- VHEs ---
export { vhes, getVhe, getVhesByBuilding } from "./vhes.js";

// --- Meters ---
export { meters, getMetersByBuilding, getMetersByVhe } from "./meters.js";

// --- Ledger ---
export {
  ledgerEntries,
  getLedgerByService,
  getLedgerByBuilding,
  getLedgerByServiceAndBuilding,
  getLedgerGroupedByCostCategory,
  getLedgerSummaryByService,
  getLedgerSummaryByBuilding,
} from "./ledger.js";

// --- Suppliers ---
export {
  suppliers,
  supplierCategories,
  getSupplier,
  getSuppliersByService,
} from "./suppliers.js";

// --- Settlements ---
export {
  buildingSettlements,
  settlementChecks,
  getSettlement,
  getSettlementsByYear,
  getSettlementChecks,
} from "./settlements.js";

// --- Distribution ---
export {
  distributionMethods,
  distributionModels,
  getDistributionMethod,
  getDistributionModel,
} from "./distribution.js";

// --- Monthly Close ---
export {
  monthlyCloseStatuses,
  getMonthlyCloseForBuilding,
  getMonthlyCloseForBuildingService,
  getMonthlyCloseGridForBuilding,
} from "./monthlyClose.js";

// --- Views ---
export { savedViews, getView } from "./views.js";

// --- Config ---
export { moduleConfig, isFeatureEnabled } from "./config.js";

// --- Field Sources ---
export { FIELD_SOURCES, getFieldSource, getEntitySource } from "./fieldSources.js";

// --- Activities (static mock) ---
import rawActivities from "../../data/activities.json";
export const activities = rawActivities;

// ═══════════════════════════════════════════════════════════════
// Compatibility aliases — match original mockData.js signatures
// ═══════════════════════════════════════════════════════════════

import { buildings as _buildings } from "./buildings.js";
import { services as _services, serviceCategories as _cats } from "./services.js";
import { getBuildingServices as _getBs } from "./finance.js";
import { getMetersByVhe as _getMetersByVhe } from "./meters.js";
import { suppliers as _suppliers } from "./suppliers.js";
import { savedViews as _views } from "./views.js";

/** getBuildingServicesByYear: returns { 2024: [...], 2025: [...], 2026: [...] } */
export function getBuildingServicesByYear(buildingId) {
  const all = _getBs(buildingId);
  const byYear = {};
  for (const bs of all) {
    if (!byYear[bs.year]) byYear[bs.year] = [];
    byYear[bs.year].push(bs);
  }
  return byYear;
}

/** getSubmetersByVhe: alias for getMetersByVhe, filtered to type=sub */
export function getSubmetersByVhe(vheId) {
  return _getMetersByVhe(vheId).filter((m) => m.type === "sub");
}

/** getVheMeterReadings: returns meter readings for a VHE+year */
export function getVheMeterReadings(vheId, year) {
  const submeters = _getMetersByVhe(vheId);
  return submeters
    .filter((m) => m.readings && m.readings[year])
    .map((m) => ({ ...m.readings[year], meterId: m.id, utility: m.utility }));
}

/** getActivitiesByBuilding */
export function getActivitiesByBuilding(buildingId) {
  return rawActivities.filter((a) => a.buildingId === String(buildingId));
}

/** getSuppliersByCategory */
export function getSuppliersByCategory(categoryId) {
  return _suppliers.filter(
    (s) => s.categories && s.categories.includes(categoryId),
  );
}

/** getViewsForObject: filter saved views by objectType */
export function getViewsForObject(objectType) {
  return _views.filter((v) => v.objectType === objectType);
}

/** getCategory: get a service category by id */
export function getCategory(categoryId) {
  return _cats.find((c) => c.id === categoryId) || null;
}

/**
 * getServicesByCategory: returns { categoryId: [services], ... }
 * Matches original mockData.js behavior (returns grouped object, not array)
 */
export function getServicesByCategory() {
  const grouped = {};
  for (const cat of _cats) {
    grouped[cat.id] = _services.filter((s) => s.category === cat.id);
  }
  return grouped;
}
