// ═══════════════════════════════════════════════════════════════
// distributions.js — Distribution process objects
// ═══════════════════════════════════════════════════════════════
import rawDistributions from "../../data/distributions.json";

export const STEP_ORDER = [
  "validation",
  "comparison",
  "control",
  "check",
  "approval",
  "distribution",
];

export const STEP_CONFIG = {
  validation:   { label: { en: "Validation",   nl: "Validatie"    }, index: 0 },
  comparison:   { label: { en: "Comparison",   nl: "Vergelijking" }, index: 1 },
  control:      { label: { en: "Control",      nl: "Controle"     }, index: 2 },
  check:        { label: { en: "Check",        nl: "Check"        }, index: 3 },
  approval:     { label: { en: "Approval",     nl: "Goedkeuring"  }, index: 4 },
  distribution: { label: { en: "Distribution", nl: "Verdeling"    }, index: 5 },
};

// Build indexes
const _distMap     = new Map();
const _distByBuilding = new Map();

for (const d of rawDistributions) {
  _distMap.set(d.id, d);
  if (!_distByBuilding.has(d.buildingId)) _distByBuilding.set(d.buildingId, []);
  _distByBuilding.get(d.buildingId).push(d);
}

export const distributions = rawDistributions;

export function getDistributionById(id) {
  return _distMap.get(id) || null;
}

export function getDistributionsByBuilding(buildingId) {
  return _distByBuilding.get(String(buildingId)) || [];
}

export function getDistribution(buildingId, period) {
  const all = _distByBuilding.get(String(buildingId)) || [];
  return all.find((d) => d.period === period) || null;
}

/** Returns the current (most recent non-complete) or latest distribution for a building */
export function getActiveDistribution(buildingId) {
  const all = _distByBuilding.get(String(buildingId)) || [];
  if (!all.length) return null;
  const active = all.find((d) => d.currentStep !== "complete");
  return active || all.sort((a, b) => b.period - a.period)[0];
}

/** Returns step index (0-5) for a distribution's current step */
export function getStepIndex(distribution) {
  if (distribution.currentStep === "complete") return 6;
  return STEP_ORDER.indexOf(distribution.currentStep);
}

/** Returns how many services are flagged in a distribution */
export function getFlaggedServiceCount(distribution) {
  return (distribution.services || []).filter((s) => s.status === "flagged").length;
}
