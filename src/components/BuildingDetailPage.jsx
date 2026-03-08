import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Hash,
  Home,
  Wrench,
  Gauge,
  Activity,
  Flame,
  Droplets,
  Zap,
  Sparkles,
  HardHat,
  FolderOpen,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Users,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Circle,
  HelpCircle,
  FileCheck,
  Send,
  ShieldCheck,
  Flag,
  LayoutList,
  CreditCard,
} from "lucide-react";
import { brand } from "@/lib/brand";
import {
  getBuilding,
  getService,
  getBuildingServices,
  getVhesByBuilding,
  getMetersByBuilding,
  getActivitiesByBuilding,
  getDistributionMethod,
  getSettlement,
  getSettlementChecks,
  getServiceCategories,
  getLedgerSummaryByBuilding,
  getLedgerGroupedByCostCategory,
  getMeters,
  getCostCategoriesByService,
  getDistributionModel,
  isFeatureEnabled,
  getFieldSource,
  getAvailableYears,
  getHeatingSeasonsByBuilding,
  getDistributionModelsByBuilding,
} from "@/lib/mockData";
import { useOrg } from "@/lib/OrgContext";
import { t, useLang } from "@/lib/i18n";
import Breadcrumbs from "./Breadcrumbs";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import {
  AttributePanel,
  AttrSection,
  AttrRow,
} from "./ui/attribute-panel";
import { StatusBadge } from "./ui/status-badge";

/* ── Category icon + color config ── */
const categoryConfig = {
  energy:        { icon: Zap,        color: "#F59E0B", bg: "#FFFBEB" },
  installations: { icon: Wrench,     color: "#3B82F6", bg: "#EFF6FF" },
  cleaning:      { icon: Sparkles,   color: "#8B5CF6", bg: "#F5F3FF" },
  management:    { icon: HardHat,    color: "#64748B", bg: "#F8FAFC" },
  other:         { icon: FolderOpen, color: "#64748B", bg: "#F8FAFC" },
};

/* ── Ledger formatters ── */
const fmtEur2 = (v) =>
  new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);

const fmtDate = (d) => {
  const dt = new Date(d);
  return dt.toLocaleDateString("nl-NL", { day: "2-digit", month: "short" });
};

const fmt = (v) =>
  new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v);

/* ── Ledger status config ── */
const ledgerStatusCfg = {
  booked:  { color: brand.blue, bg: "#F0FAFB", label: { en: "Booked", nl: "Geboekt" }, icon: CheckCircle2 },
  pending: { color: brand.amber, bg: "#FFFBEB", label: { en: "Pending", nl: "In afwachting" }, icon: Clock },
  flagged: { color: brand.red,   bg: "#FEF2F2", label: { en: "Flagged", nl: "Gemarkeerd" }, icon: AlertTriangle },
};

function LedgerStatusBadge({ status, lang }) {
  const cfg = ledgerStatusCfg[status];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon size={14} />
      {cfg.label[lang]}
    </span>
  );
}

/* ── Utility icon ── */
const utilityIcon = {
  heat: { icon: Flame, color: "#EF4444" },
  water: { icon: Droplets, color: "#3B82F6" },
  electricity: { icon: Zap, color: "#F59E0B" },
};

/* ── Activity icon ── */
const activityIcons = {
  meter_reading: { icon: Gauge, color: brand.blue },
  ledger_entry: { icon: FileText, color: brand.blue },
  distribution: { icon: Activity, color: brand.amber },
  contract_change: { icon: Users, color: brand.blue },
  alert: { icon: AlertTriangle, color: brand.red },
};

/* ── Settlement status config ── */
const settlementStatusConfig = {
  not_started:  { icon: Circle,        color: "#94A3B8", bg: "#F8FAFC", label: { en: "Not started",  nl: "Niet gestart" } },
  monitoring:   { icon: Clock,         color: "#94A3B8", bg: "#F8FAFC", label: { en: "Monitoring",   nl: "Monitoring" } },
  in_review:    { icon: AlertTriangle, color: "#F59E0B", bg: "#FFFBEB", label: { en: "In review",    nl: "In controle" } },
  approved:     { icon: FileCheck,     color: "#3EB1C8", bg: "#F0FAFB", label: { en: "Approved",     nl: "Goedgekeurd" } },
  distributed:  { icon: Send,          color: "#3EB1C8", bg: "#F0FAFB", label: { en: "Distributed",  nl: "Afgerekend" } },
};

/* ── Settlement check icon ── */
function CheckIcon({ passed, label }) {
  return (
    <div className="flex items-center gap-2" title={label}>
      {passed ? (
        <CheckCircle2 size={14} className="text-sky-500" />
      ) : passed === false ? (
        <AlertTriangle size={14} className="text-amber-500" />
      ) : (
        <Circle size={14} className="text-slate-300" />
      )}
      <span className={`text-[11px] ${passed ? "text-slate-600" : passed === false ? "text-amber-600 font-medium" : "text-slate-400"}`}>
        {label}
      </span>
    </div>
  );
}

/* ── Settlement check status badge ── */
const checkStatusConfig = {
  approved: { icon: CheckCircle2, color: "#3EB1C8", bg: "#F0FAFB", label: { en: "Approved",  nl: "Goedgekeurd" } },
  verified: { icon: ShieldCheck,  color: "#3EB1C8", bg: "#F0FAFB", label: { en: "Verified",  nl: "Geverifieerd" } },
  flagged:  { icon: Flag,         color: "#EF4444", bg: "#FEF2F2", label: { en: "Flagged",   nl: "Gemarkeerd" } },
  pending:  { icon: Clock,        color: "#F59E0B", bg: "#FFFBEB", label: { en: "Pending",   nl: "In afwachting" } },
};

function CheckStatusBadge({ status, lang }) {
  const cfg = checkStatusConfig[status] || checkStatusConfig.pending;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon size={14} />
      {cfg.label[lang] || cfg.label.en}
    </span>
  );
}

/* ── Year selector ── */
function YearSelector({ year, setYear, availableYears, heatingSeasons }) {
  // If we have heating seasons, prefer those for labels
  const seasonMap = useMemo(() => {
    const map = {};
    for (const hs of (heatingSeasons || [])) {
      map[hs.yearKey] = hs;
    }
    return map;
  }, [heatingSeasons]);

  const years = availableYears && availableYears.length > 0 ? availableYears : [2024, 2025, 2026];
  return (
    <div className="inline-flex flex-col items-start gap-1">
      <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5">
        {years.map((y) => {
          const season = seasonMap[y];
          const label = season ? season.yearLabel : String(y);
          return (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`px-3 h-7 rounded-lg text-xs font-medium tabular-nums transition-colors ${
                year === y
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      {/* Show season date range subtitle for active year */}
      {(() => {
        const activeSeason = seasonMap[year];
        if (!activeSeason) return null;
        const startDate = new Date(activeSeason.seasonStart);
        const endDate = new Date(activeSeason.seasonEnd);
        const fmtMonth = (d) => d.toLocaleDateString("nl-NL", { month: "short", year: "numeric" });
        return (
          <span className="text-[11px] text-slate-400 ml-1">
            {fmtMonth(startDate)} – {fmtMonth(endDate)}
          </span>
        );
      })()}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/* ██  MAIN COMPONENT                                          ██ */
/* ══════════════════════════════════════════════════════════════ */

export default function BuildingDetailPage() {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  const lang = useLang();
  const { data, orgId } = useOrg();
  const availableYears = useMemo(() => getAvailableYears(), []);
  // Years this specific building has service data for
  const buildingYears = useMemo(() => {
    const allBs = getBuildingServices(buildingId);
    return [...new Set(allBs.map((bs) => bs.year))].sort((a, b) => a - b);
  }, [buildingId]);
  const [year, setYear] = useState(() => {
    const currentYear = new Date().getFullYear();
    // Prefer current year if this building has data for it
    if (buildingYears.includes(currentYear)) return currentYear;
    // Fall back to latest year this building has data for
    if (buildingYears.length > 0) return buildingYears[buildingYears.length - 1];
    // Last resort: global available years
    const yrs = getAvailableYears();
    if (yrs.includes(currentYear)) return currentYear;
    return yrs.length > 0 ? yrs[yrs.length - 1] : 2025;
  });
  const heatingSeasons = useMemo(() => getHeatingSeasonsByBuilding(buildingId), [buildingId]);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedVhe, setExpandedVhe] = useState(null);
  const [vheViewMode, setVheViewMode] = useState("cards"); // "cards" or "table"
  const [expandedService, setExpandedService] = useState(null);
  const [expandedCostCats, setExpandedCostCats] = useState({});  // { [ccId]: true }
  const toggleCostCat = (ccId) => setExpandedCostCats((prev) => ({ ...prev, [ccId]: !prev[ccId] }));
  const [distDrilldown, setDistDrilldown] = useState(null); // { serviceId, buildingId } when viewing distribution
  const [showDismounted, setShowDismounted] = useState(false);

  const building = getBuilding(buildingId);

  const isPastYear = year < new Date().getFullYear();

  // Related data
  const bsRelations = useMemo(
    () => getBuildingServices(buildingId, year),
    [buildingId, year]
  );
  const vheList = useMemo(() => getVhesByBuilding(buildingId), [buildingId]);
  const allMeters = useMemo(
    () =>
      getMetersByBuilding(buildingId).map((m) => {
        const r = m.readings?.[year];
        return {
          ...m,
          lastReading: r?.end ?? 0,
          previousReading: r?.start ?? 0,
          consumption: r?.consumption ?? 0,
          readingDate: r?.readingDate ?? "—",
        };
      }),
    [buildingId, year]
  );
  const meterList = useMemo(
    () => showDismounted ? allMeters : allMeters.filter(m => !m.dismounted),
    [allMeters, showDismounted]
  );
  const dismountedCount = useMemo(
    () => allMeters.filter(m => m.dismounted).length,
    [allMeters]
  );
  const activityList = useMemo(
    () => getActivitiesByBuilding(buildingId),
    [buildingId]
  );
  const settlement = useMemo(
    () => getSettlement(buildingId, year),
    [buildingId, year]
  );
  const sChecks = useMemo(
    () => getSettlementChecks(buildingId, year),
    [buildingId, year]
  );
  const ledgerByService = useMemo(
    () => getLedgerSummaryByBuilding(buildingId, year),
    [buildingId, year]
  );
  // Derived KPIs
  const avgCompleteness =
    bsRelations.length > 0
      ? Math.round(
          bsRelations.reduce((s, bs) => s + bs.completeness, 0) /
            bsRelations.length
        )
      : 0;
  const completeCount = bsRelations.filter(
    (bs) => bs.status === "complete"
  ).length;
  const activeVhe = vheList.filter((v) => v.status === "active").length;
  const vacantVhe = vheList.filter((v) => v.status === "vacant").length;
  const mainMeters = meterList.filter((m) => m.type === "main");
  const subMeters = meterList.filter((m) => m.type === "sub");

  if (!building)
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
        {t("noResults", lang)}
      </div>
    );

  const crumbs = [
    { label: t("buildings", lang), to: `/${orgId}/buildings` },
    { label: building.complex },
  ];

  // Enrich services with names
  const enrichedBs = bsRelations.map((bs) => {
    const svc = getService(bs.serviceId);
    const dm = getDistributionMethod(bs.distributionMethod);
    return { ...bs, service: svc, distMethod: dm };
  });

  // Calculate year KPIs for monitoring cockpit
  const totalBudget = enrichedBs.reduce((s, bs) => s + bs.budget, 0);
  const totalActual = enrichedBs.reduce((s, bs) => s + bs.actual, 0);
  const variance = totalBudget - totalActual;

  // Budget progress tracking
  const now = new Date();
  const thisYear = now.getFullYear();
  const currentMonth = year < thisYear ? 12 : year === thisYear ? now.getMonth() : 0;

  const flaggedCount = enrichedBs.reduce((s, bs) => {
    const ledger = ledgerByService[bs.serviceId];
    return s + (ledger?.flagged || 0);
  }, 0);

  // Per-service budget status
  const budgetPct = totalBudget > 0 ? Math.round((totalActual / totalBudget) * 100) : 0;
  const yearPct = Math.round((currentMonth / 12) * 100);
  const isOnPace = budgetPct <= yearPct + 10;

  const servicesUnderBudget = enrichedBs.filter((bs) => {
    const pct = bs.budget > 0 ? (bs.actual / bs.budget) * 100 : 0;
    return pct <= yearPct + 10;
  }).length;
  const servicesOverBudget = enrichedBs.filter((bs) => {
    const pct = bs.budget > 0 ? (bs.actual / bs.budget) * 100 : 0;
    return pct > yearPct + 10;
  }).length;

  // Overall building health verdict (budget-based)
  const verdictStatus = servicesOverBudget > 2 || flaggedCount > 2
    ? "attention"
    : servicesOverBudget > 0 || flaggedCount > 0
      ? "review"
      : "on_track";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <Breadcrumbs items={crumbs} />

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: brand.navy + "10" }}
            >
              <Building2 size={20} style={{ color: brand.navy }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1
                  className="text-xl font-semibold truncate"
                  style={{ color: brand.navy }}
                >
                  {building.complex}
                </h1>
                <StatusBadge status={building.status} />
                <StatusBadge status={building.dataQuality} size="xs" />
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {building.location}
                </span>
                <span className="w-px h-3 bg-slate-200" />
                <span className="flex items-center gap-1">
                  <Hash size={14} /> {building.complexId}
                </span>
                <span className="w-px h-3 bg-slate-200" />
                <span className="flex items-center gap-1">
                  <Home size={14} /> {building.vhe} VHE
                </span>
              </div>
            </div>
          </div>
          <YearSelector year={year} setYear={setYear} availableYears={availableYears} heatingSeasons={heatingSeasons} />
        </div>

        {/* ── Content: tabs + attribute panel ── */}
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Underline-style tabs */}
              <TabsList className="bg-transparent h-10 gap-0 p-0 border-b border-slate-200 w-full justify-start rounded-none overflow-x-auto">
                {[
                  { value: "overview", label: t("overview", lang) },
                  {
                    value: "services",
                    label: `${t("services", lang)} (${bsRelations.length})`,
                  },
                  isFeatureEnabled("consumption") && {
                    value: "meters",
                    label: `${t("meters", lang)} (${meterList.length})`,
                  },
                  {
                    value: "vhe",
                    label: `VHE (${vheList.length})`,
                  },
                  { value: "activity", label: t("activity", lang) },
                ].filter(Boolean).map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#3EB1C8] data-[state=active]:text-slate-900 data-[state=active]:shadow-none px-4 text-sm text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* ═══ OVERVIEW TAB — SERVICE CHARGE HEALTH DASHBOARD ═══ */}
              <TabsContent value="overview">
                {(() => {
                  // ── Compute attention items (cross-cutting insights) ──
                  const attentionItems = [];

                  // 1. Services running ahead of budget pace
                  enrichedBs.forEach((bs) => {
                    const bsPct = bs.budget > 0 ? (bs.actual / bs.budget) * 100 : 0;
                    if (bsPct > yearPct + 10) {
                      const overBy = Math.round(bsPct - yearPct);
                      attentionItems.push({
                        id: `budget-${bs.serviceId}`,
                        severity: bsPct > 100 ? "error" : "warning",
                        icon: AlertTriangle,
                        text: {
                          en: `${bs.service?.name.en || bs.serviceId} is ${overBy}pp ahead of budget pace (${Math.round(bsPct)}% spent, year ${yearPct}% elapsed)`,
                          nl: `${bs.service?.name.nl || bs.serviceId} loopt ${overBy}pp voor op budgettempo (${Math.round(bsPct)}% besteed, jaar ${yearPct}% verstreken)`,
                        },
                        action: () => { setActiveTab("services"); setExpandedService(bs.serviceId); },
                        actionLabel: { en: "View service", nl: "Bekijk dienst" },
                      });
                    }
                  });

                  // 2. Flagged ledger entries (only for orgs with ledger data)
                  const totalFlaggedEntries = Object.entries(ledgerByService).reduce((sum, [, l]) => sum + (l.flagged || 0), 0);
                  const totalPendingEntries = Object.entries(ledgerByService).reduce((sum, [, l]) => sum + (l.pending || 0), 0);
                  if (isFeatureEnabled("ledger") && totalFlaggedEntries > 0) {
                    attentionItems.push({
                      id: "flagged-ledger",
                      severity: "error",
                      icon: Flag,
                      text: {
                        en: `${totalFlaggedEntries} ledger ${totalFlaggedEntries === 1 ? "entry" : "entries"} flagged for review`,
                        nl: `${totalFlaggedEntries} ${totalFlaggedEntries === 1 ? "boeking" : "boekingen"} gemarkeerd voor controle`,
                      },
                      action: () => setActiveTab("services"),
                      actionLabel: { en: "Review", nl: "Bekijk" },
                    });
                  }
                  if (isFeatureEnabled("ledger") && totalPendingEntries > 0) {
                    attentionItems.push({
                      id: "pending-ledger",
                      severity: "info",
                      icon: Clock,
                      text: {
                        en: `${totalPendingEntries} ledger ${totalPendingEntries === 1 ? "entry" : "entries"} pending approval`,
                        nl: `${totalPendingEntries} ${totalPendingEntries === 1 ? "boeking" : "boekingen"} wachten op goedkeuring`,
                      },
                      action: () => setActiveTab("services"),
                      actionLabel: { en: "Review", nl: "Bekijk" },
                    });
                  }

                  // 3. Overdue meter readings
                  const overdueMeters = meterList.filter((m) => m.status === "warning");
                  if (overdueMeters.length > 0) {
                    attentionItems.push({
                      id: "overdue-meters",
                      severity: "warning",
                      icon: Gauge,
                      text: {
                        en: `${overdueMeters.length} meter ${overdueMeters.length === 1 ? "reading" : "readings"} overdue (${overdueMeters.map((m) => m.meterNumber).join(", ")})`,
                        nl: `${overdueMeters.length} meter${overdueMeters.length === 1 ? "stand" : "standen"} achterstallig (${overdueMeters.map((m) => m.meterNumber).join(", ")})`,
                      },
                      action: () => setActiveTab("meters"),
                      actionLabel: { en: "View meters", nl: "Bekijk meters" },
                    });
                  }

                  // 4. Consumption vs cost variance (metered services)
                  if (isFeatureEnabled("consumptionControl")) {
                    const utilityMap = {
                      "SVC-108": "heat", "SVC-107": "heat",
                      "SVC-102": "water", "SVC-104": "water",
                      "SVC-105": "electricity", "SVC-106": "electricity",
                      "SVC-110": "electricity", "SVC-133": "electricity",
                    };
                    enrichedBs.filter((bs) => bs.service?.metered).forEach((bs) => {
                      const utilType = utilityMap[bs.serviceId];
                      if (!utilType) return;
                      const svcMeters = meterList.filter((m) => m.utility === utilType && m.type === "main");
                      const totalConsumption = svcMeters.reduce((s, m) => s + (m.consumption || 0), 0);
                      const meteredCats = getCostCategoriesByService(bs.serviceId).filter((cc) => cc.unit && cc.unitPrice);
                      const avgUnitPrice = meteredCats.length > 0
                        ? meteredCats.reduce((s, cc) => s + Math.abs(cc.unitPrice) * cc.budgetShare, 0) / meteredCats.reduce((s, cc) => s + cc.budgetShare, 0)
                        : 0;
                      if (totalConsumption === 0 || avgUnitPrice === 0) return;
                      const expectedCost = totalConsumption * avgUnitPrice;
                      const variancePct = Math.round(((bs.actual - expectedCost) / expectedCost) * 100);
                      if (Math.abs(variancePct) > 20) {
                        attentionItems.push({
                          id: `consumption-${bs.serviceId}`,
                          severity: Math.abs(variancePct) > 50 ? "error" : "warning",
                          icon: Activity,
                          text: {
                            en: `${bs.service?.name.en}: invoiced cost ${variancePct > 0 ? "+" : ""}${variancePct}% vs consumption-based estimate`,
                            nl: `${bs.service?.name.nl}: geboekte kosten ${variancePct > 0 ? "+" : ""}${variancePct}% t.o.v. verbruiksschatting`,
                          },
                          action: () => { setActiveTab("services"); setExpandedService(bs.serviceId); },
                          actionLabel: { en: "Investigate", nl: "Onderzoek" },
                        });
                      }
                    });
                  }

                  // 5. Settlement check failures (past year — only for orgs with ledger)
                  if (isFeatureEnabled("ledger") && isPastYear && sChecks.length > 0) {
                    const failedChecks = sChecks.filter((sc) => sc.status === "flagged" || sc.status === "pending");
                    const incompleteChecks = sChecks.filter((sc) => !sc.ledgerComplete);
                    if (failedChecks.length > 0) {
                      attentionItems.push({
                        id: "settlement-checks",
                        severity: "error",
                        icon: FileCheck,
                        text: {
                          en: `${failedChecks.length} settlement ${failedChecks.length === 1 ? "check" : "checks"} ${failedChecks.some((sc) => sc.status === "flagged") ? "flagged" : "pending"}`,
                          nl: `${failedChecks.length} afrekening${failedChecks.length === 1 ? "scontrole" : "scontroles"} ${failedChecks.some((sc) => sc.status === "flagged") ? "gemarkeerd" : "in afwachting"}`,
                        },
                        action: null,
                        actionLabel: null,
                      });
                    }
                    if (incompleteChecks.length > 0) {
                      attentionItems.push({
                        id: "incomplete-ledger",
                        severity: "warning",
                        icon: FileText,
                        text: {
                          en: `${incompleteChecks.length} ${incompleteChecks.length === 1 ? "service has" : "services have"} incomplete ledger data for settlement`,
                          nl: `${incompleteChecks.length} ${incompleteChecks.length === 1 ? "dienst heeft" : "diensten hebben"} onvolledige boekingsdata voor afrekening`,
                        },
                        action: null,
                        actionLabel: null,
                      });
                    }
                  }

                  // Sort: errors first, then warnings, then info
                  const severityOrder = { error: 0, warning: 1, info: 2 };
                  attentionItems.sort((a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9));

                  const severityStyles = {
                    error:   { border: "border-red-200",   bg: "bg-red-50/50",   iconColor: brand.red },
                    warning: { border: "border-amber-200", bg: "bg-amber-50/50", iconColor: brand.amber },
                    info:    { border: "border-slate-200", bg: "bg-slate-50/50", iconColor: brand.muted },
                  };

                  return (
                <div className="mt-4 space-y-4">
                  {/* Settlement banner (past year only, ledger orgs) */}
                  {isFeatureEnabled("ledger") && isPastYear && settlement && (
                    <Card className="border-slate-200 bg-white overflow-hidden">
                      <div
                        className="h-1"
                        style={{ background: (settlementStatusConfig[settlement.status]?.color || "#94A3B8") }}
                      />
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {(() => {
                              const sCfg = settlementStatusConfig[settlement.status];
                              const SIcon = sCfg?.icon || Circle;
                              return (
                                <div
                                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                  style={{ background: sCfg?.bg }}
                                >
                                  <SIcon size={20} style={{ color: sCfg?.color }} />
                                </div>
                              );
                            })()}
                            <div>
                              <p className="text-sm font-semibold" style={{ color: brand.navy }}>
                                {lang === "nl" ? "Afrekening" : "Settlement"} {year}
                              </p>
                              <p className="text-xs text-slate-500">
                                {settlementStatusConfig[settlement.status]?.label[lang]}
                                {settlement.approvedAt && (
                                  <span className="ml-2 text-slate-400">
                                    {lang === "nl" ? "Goedgekeurd:" : "Approved:"} {settlement.approvedAt}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          {settlement.netResult != null && (
                            <div className="text-right">
                              <span
                                className="text-lg font-semibold tabular-nums"
                                style={{ color: settlement.netResult >= 0 ? brand.blue : brand.red }}
                              >
                                {settlement.netResult >= 0 ? "+" : ""}{fmt(settlement.netResult)}
                              </span>
                              <p className="text-[11px] text-slate-400">
                                {settlement.netResult >= 0
                                  ? (lang === "nl" ? "teruggave" : "refund")
                                  : (lang === "nl" ? "naheffing" : "surcharge")}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* ── Cost basis indicator ── */}
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3 text-[11px]"
                    style={{ background: isFeatureEnabled("ledger") ? "#F0FAFB" : "#FFFBEB" }}
                  >
                    {isFeatureEnabled("ledger") ? (
                      <>
                        <FileText size={14} style={{ color: brand.blue }} />
                        <span className="font-medium" style={{ color: brand.blue }}>
                          {lang === "nl" ? "Kosten uit grootboek" : "Costs from ledger"}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">
                          {lang === "nl"
                            ? "Werkelijke kosten op basis van facturen en boekingen per kostensoort"
                            : "Actual costs from invoices and bookings per cost category"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Gauge size={14} style={{ color: brand.amber }} />
                        <span className="font-medium" style={{ color: brand.amber }}>
                          {lang === "nl" ? "Kosten uit verbruiksdata" : "Costs from consumption data"}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">
                          {lang === "nl"
                            ? "Verwachte kosten berekend op meterdata — geen kostensoorten beschikbaar"
                            : "Expected costs calculated from metering data — no cost categories available"}
                        </span>
                      </>
                    )}
                  </div>

                  {/* ── Layer 1: Verdict Card ── */}
                  <Card className="border-slate-200 bg-white overflow-hidden">
                    <CardContent className="px-5 py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background: verdictStatus === "on_track" ? "#F0FAFB"
                                : verdictStatus === "review" ? "#FFFBEB"
                                : "#FEF2F2",
                            }}
                          >
                            {verdictStatus === "on_track" ? (
                              <CheckCircle2 size={20} style={{ color: brand.blue }} />
                            ) : verdictStatus === "review" ? (
                              <Clock size={20} style={{ color: brand.amber }} />
                            ) : (
                              <AlertTriangle size={20} style={{ color: brand.red }} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: brand.navy }}>
                              {verdictStatus === "on_track"
                                ? (lang === "nl" ? "Complex op koers" : "Building on track")
                                : verdictStatus === "review"
                                  ? (lang === "nl" ? "Aandacht nodig" : "Needs review")
                                  : (lang === "nl" ? "Actie vereist" : "Action required")}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {fmt(totalActual)} {lang === "nl" ? "van" : "of"} {fmt(totalBudget)} ({budgetPct}%)
                              <span className="mx-1.5 text-slate-300">·</span>
                              {lang === "nl" ? "Jaar" : "Year"}: {yearPct}% {lang === "nl" ? "verstreken" : "elapsed"}
                              {!isOnPace && budgetPct > yearPct + 10 && (
                                <span className="ml-1.5 text-amber-600 font-medium">
                                  — {lang === "nl" ? "loopt voor op budget" : "ahead of budget pace"}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="text-center">
                            <span className="text-lg font-semibold tabular-nums" style={{ color: brand.blue }}>
                              {servicesUnderBudget}
                            </span>
                            <p className="text-[11px] text-slate-400 uppercase tracking-wider">
                              {lang === "nl" ? "op koers" : "on track"}
                            </p>
                          </div>
                          {servicesOverBudget > 0 && (
                            <div className="text-center">
                              <span className="text-lg font-semibold tabular-nums" style={{ color: brand.amber }}>
                                {servicesOverBudget}
                              </span>
                              <p className="text-[11px] text-slate-400 uppercase tracking-wider">
                                {lang === "nl" ? "boven budget" : "over budget"}
                              </p>
                            </div>
                          )}
                          {flaggedCount > 0 && (
                            <div className="text-center">
                              <span className="text-lg font-semibold tabular-nums" style={{ color: brand.red }}>
                                {flaggedCount}
                              </span>
                              <p className="text-[11px] text-slate-400 uppercase tracking-wider">
                                {lang === "nl" ? "gemarkeerd" : "flagged"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ── Layer 2: Attention Items (exception-only insights) ── */}
                  {attentionItems.length > 0 ? (
                    <Card className="border-slate-200 bg-white overflow-hidden">
                      <CardContent className="p-0">
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            {lang === "nl" ? "Aandachtspunten" : "Attention items"}
                            <span className="ml-1.5 text-slate-300">({attentionItems.length})</span>
                          </p>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {attentionItems.map((item) => {
                            const sty = severityStyles[item.severity] || severityStyles.info;
                            const ItemIcon = item.icon;
                            return (
                              <div
                                key={item.id}
                                className={`flex items-start gap-3 px-4 py-3 ${sty.bg}`}
                              >
                                <ItemIcon
                                  size={14}
                                  className="mt-0.5 shrink-0"
                                  style={{ color: sty.iconColor }}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-slate-700 leading-relaxed">
                                    {item.text[lang] || item.text.en}
                                  </p>
                                </div>
                                {item.action && (
                                  <button
                                    onClick={item.action}
                                    className="text-[11px] font-medium shrink-0 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                                    style={{ color: brand.blue }}
                                  >
                                    {item.actionLabel[lang] || item.actionLabel.en} →
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-5 rounded-lg border border-slate-200 bg-white">
                      <CheckCircle2 size={16} style={{ color: brand.blue }} className="shrink-0" />
                      <p className="text-xs text-slate-500">
                        {lang === "nl"
                          ? "Geen aandachtspunten — alle diensten zijn op koers."
                          : "No attention items — all services are on track."}
                      </p>
                    </div>
                  )}

                  {/* ── Layer 3: Recent Activity ── */}
                  {activityList.length > 0 && (
                    <Card className="border-slate-200 bg-white overflow-hidden">
                      <CardContent className="p-0">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            {lang === "nl" ? "Recente activiteit" : "Recent activity"}
                          </p>
                          <button
                            onClick={() => setActiveTab("activity")}
                            className="text-[11px] font-medium hover:underline transition-colors"
                            style={{ color: brand.blue }}
                          >
                            {lang === "nl" ? "Bekijk alles" : "View all"} →
                          </button>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {activityList.slice(0, 5).map((act) => (
                            <div key={act.id} className="flex items-start gap-3 px-4 py-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-600 truncate">
                                  {act.description[lang] || act.description.en}
                                </p>
                                <p className="text-[11px] text-slate-400">{act.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                );
                })()}
              </TabsContent>

              {/* ═══ SERVICES TAB — DETAIL & INVESTIGATION ═══ */}
              <TabsContent value="services">
                {/* ── Distribution drill-down view ── */}
                {distDrilldown ? (() => {
                  const dm = getDistributionModel(distDrilldown.buildingId, distDrilldown.serviceId);
                  const svc = getService(distDrilldown.serviceId);
                  const svcName = svc ? (svc.name[lang] || svc.name.en) : distDrilldown.serviceId;

                  // Resolve intermediate values from the split tree
                  const resolveValue = (outputId) => {
                    // Check inputs first
                    const input = dm?.inputs?.find(i => i.id === outputId);
                    if (input) return input.resolvedValue;
                    // Check splits
                    const split = dm?.splits?.find(s => s.output === outputId);
                    if (!split) return 0;
                    const sourceVal = resolveValue(split.source);
                    if (split.additionalSources) {
                      const extra = split.additionalSources.reduce((sum, sid) => sum + resolveValue(sid), 0);
                      return (sourceVal + extra) * split.ratio;
                    }
                    return sourceVal * split.ratio;
                  };

                  const totalDistributed = dm?.invoiceLines?.reduce((sum, line) => sum + resolveValue(line.source), 0) || 0;

                  return (
                    <div className="mt-4 space-y-5">
                      {/* Back navigation */}
                      <button
                        onClick={() => setDistDrilldown(null)}
                        className="flex items-center gap-1 text-xs font-medium transition-colors hover:underline"
                        style={{ color: brand.blue }}
                      >
                        <ArrowLeft size={14} />
                        {lang === "nl" ? "Terug naar diensten" : "Back to services"}
                      </button>

                      {/* Header */}
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          {lang === "nl" ? "Verdelingsmodel" : "Distribution Model"}: {svcName}
                        </h3>
                        {dm && (
                          <p className="text-[11px] text-slate-400 mt-1">
                            {dm.provider || (lang === "nl" ? "Standaard" : "Standard")} · v{dm.formulaVersion} · {lang === "nl" ? "Laatst bijgewerkt" : "Last updated"}: {new Date(dm.lastUpdated).toLocaleDateString("nl-NL", { day: "2-digit", month: "short", year: "numeric" })}
                          </p>
                        )}
                      </div>

                      {!dm ? (
                        <Card className="border-slate-200 bg-white">
                          <CardContent className="py-8 text-center">
                            <HelpCircle size={20} className="mx-auto mb-2 text-slate-300" />
                            <p className="text-xs text-slate-400">
                              {lang === "nl" ? "Geen verdelingsmodel beschikbaar voor deze dienst" : "No distribution model available for this service"}
                            </p>
                          </CardContent>
                        </Card>
                      ) : dm && !dm.inputs ? (
                        // Simple energy distribution model view
                        <Card className="border-slate-200 bg-white">
                          <CardContent className="py-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <Gauge size={16} className="text-slate-500" />
                              <span className="text-xs font-semibold text-slate-700">
                                {dm.description?.[lang] || dm.description?.en || "Metered distribution"}
                              </span>
                            </div>
                            {dm.provider && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400">{lang === "nl" ? "Meetbedrijf" : "Metering provider"}</span>
                                <span className="font-medium text-slate-700">{dm.provider}</span>
                              </div>
                            )}
                            {dm.meterTypes && dm.meterTypes.length > 0 && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400">{lang === "nl" ? "Metertypes" : "Meter types"}</span>
                                <span className="font-medium text-slate-700">{dm.meterTypes.join(", ")}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ) : (
                        <>
                          {/* ── LANE 1: Cost Inputs ── */}
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                              {lang === "nl" ? "1. Kostenopbouw" : "1. Cost Inputs"}
                            </p>
                            <Card className="border-slate-200 bg-white">
                              <CardContent className="py-0">
                                {dm.inputs.map((input, idx) => (
                                  <div key={input.id} className={`flex items-center justify-between py-3 ${idx < dm.inputs.length - 1 ? "border-b border-slate-100" : ""}`}>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-medium text-slate-700">
                                        {input.label[lang] || input.label.en}
                                      </p>
                                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono truncate">
                                        {input.formula}
                                      </p>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-800 tabular-nums ml-4">
                                      {fmt(input.resolvedValue)}
                                    </span>
                                  </div>
                                ))}
                                {/* Total inputs */}
                                <div className="flex items-center justify-between py-2 border-t border-slate-200 bg-slate-50/50">
                                  <p className="text-[11px] font-medium text-slate-500">
                                    {lang === "nl" ? "Totaal invoer" : "Total inputs"}
                                  </p>
                                  <span className="text-xs font-semibold text-slate-700 tabular-nums">
                                    {fmt(dm.inputs.reduce((s, i) => s + i.resolvedValue, 0))}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* ── LANE 2: Component Split ── */}
                          {dm.splits.length > 0 && (
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                {lang === "nl" ? "2. Componentensplitsing" : "2. Component Split"}
                              </p>
                              <Card className="border-slate-200 bg-white">
                                <CardContent className="py-0">
                                  {dm.splits.map((split, idx) => {
                                    const sourceLabel = dm.inputs.find(i => i.id === split.source)?.label
                                      || dm.splits.find(s => s.output === split.source)?.label
                                      || { en: split.source, nl: split.source };
                                    const resolvedAmt = resolveValue(split.output);

                                    return (
                                      <div key={idx} className={`py-3 ${idx < dm.splits.length - 1 ? "border-b border-slate-100" : ""}`}>
                                        <div className="flex items-center justify-between">
                                          <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-slate-700">
                                              {split.label[lang] || split.label.en}
                                            </p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                              <span className="text-[11px] text-slate-400">
                                                {(split.ratio * 100).toFixed(1)}% {lang === "nl" ? "van" : "of"} {sourceLabel[lang] || sourceLabel.en}
                                              </span>
                                              {split.method === "meter_based" && (
                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-1 rounded text-[9px] font-medium bg-blue-50" style={{ color: brand.blue }}>
                                                  <Gauge size={9} />
                                                  {lang === "nl" ? "meter" : "metered"}
                                                </span>
                                              )}
                                              {split.method === "meter_ratio" && (
                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-1 rounded text-[9px] font-medium bg-blue-50" style={{ color: brand.blue }}>
                                                  <Gauge size={9} />
                                                  {lang === "nl" ? "verhouding" : "ratio"}
                                                </span>
                                              )}
                                            </div>
                                            {split.note && (
                                              <p className="text-[11px] text-slate-400 mt-0.5 italic">
                                                {split.note[lang] || split.note.en}
                                              </p>
                                            )}
                                          </div>
                                          <span className="text-xs font-semibold text-slate-700 tabular-nums ml-4">
                                            {fmt(resolvedAmt)}
                                          </span>
                                        </div>
                                        {/* Mini progress bar */}
                                        <div className="mt-1.5 h-1 rounded-full bg-slate-100 overflow-hidden">
                                          <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                              width: `${Math.min(split.ratio * 100, 100)}%`,
                                              background: split.method === "meter_based" || split.method === "meter_ratio" ? brand.blue : brand.navy,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </CardContent>
                              </Card>
                            </div>
                          )}

                          {/* ── LANE 3: Invoice Lines ── */}
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                              {dm.splits.length > 0
                                ? (lang === "nl" ? "3. Verdeelregels" : "3. Invoice Lines")
                                : (lang === "nl" ? "2. Verdeelregels" : "2. Invoice Lines")}
                            </p>
                            <Card className="border-slate-200 bg-white">
                              <CardContent className="py-0">
                                {dm.invoiceLines.map((line, idx) => {
                                  const lineAmt = resolveValue(line.source);
                                  const pct = totalDistributed > 0 ? (lineAmt / totalDistributed) * 100 : 0;

                                  return (
                                    <div key={idx} className={`py-3 ${idx < dm.invoiceLines.length - 1 ? "border-b border-slate-100" : ""}`}>
                                      <div className="flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                          <p className="text-xs font-medium text-slate-700">
                                            {line.label[lang] || line.label.en}
                                          </p>
                                          <div className="flex items-center gap-1 mt-0.5">
                                            <span className="inline-flex items-center gap-0.5 px-1.5 py-1 rounded text-[9px] font-medium bg-slate-100 text-slate-500">
                                              {line.keyLabel[lang] || line.keyLabel.en}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="text-right ml-4">
                                          <span className="text-xs font-semibold text-slate-700 tabular-nums">{fmt(lineAmt)}</span>
                                          <p className="text-[11px] text-slate-400 tabular-nums">{pct.toFixed(1)}%</p>
                                        </div>
                                      </div>
                                      {/* Proportion bar */}
                                      <div className="mt-1.5 h-1 rounded-full bg-slate-100 overflow-hidden">
                                        <div
                                          className="h-full rounded-full"
                                          style={{ width: `${pct}%`, background: brand.navy }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                                {/* Total distributed */}
                                <div className="flex items-center justify-between py-2 border-t border-slate-200 bg-slate-50/50">
                                  <p className="text-[11px] font-medium text-slate-500">
                                    {lang === "nl" ? "Totaal verdeeld" : "Total distributed"}
                                  </p>
                                  <span className="text-xs font-semibold text-slate-700 tabular-nums">
                                    {fmt(totalDistributed)}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* ── Distribution key legend ── */}
                          <div className="px-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                              {lang === "nl" ? "Verdeelsleutels" : "Distribution Keys"}
                            </p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                              {[...new Set(dm.invoiceLines.map(l => l.distributionKey))].map(key => {
                                const line = dm.invoiceLines.find(l => l.distributionKey === key);
                                return (
                                  <span key={key} className="text-[11px] text-slate-400">
                                    <span className="font-mono text-slate-500">{key.replace("cost_key_", "")}</span>
                                    {" = "}{line.keyLabel[lang] || line.keyLabel.en}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })() : (
                <div className="mt-4 space-y-4">
                  {(() => {
                    const visibleCategories = isFeatureEnabled("nonUtilityServices")
                      ? data.serviceCategories
                      : data.serviceCategories.filter((c) => c.id === "energy");
                    const grouped = visibleCategories
                      .map((cat) => ({
                        ...cat,
                        items: enrichedBs.filter(
                          (bs) => bs.service?.category === cat.id
                        ),
                      }))
                      .filter((g) => g.items.length > 0);

                    if (grouped.length === 0)
                      return (
                        <div className="px-4 py-8 text-center text-sm text-slate-400">
                          {t("noResults", lang)}
                        </div>
                      );

                    return grouped.map((group) => {
                      const cfg = categoryConfig[group.id];
                      const GroupIcon = cfg?.icon || Wrench;
                      return (
                        <div key={group.id}>
                          {/* Category header */}
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-5 h-5 rounded flex items-center justify-center"
                              style={{ background: cfg?.bg, color: cfg?.color }}
                            >
                              <GroupIcon size={14} />
                            </div>
                            <span
                              className="text-xs font-semibold uppercase tracking-wider"
                              style={{ color: cfg?.color }}
                            >
                              {group.label[lang] || group.label.en}
                            </span>
                          </div>

                          {/* Service rows */}
                          <div className="space-y-2 mb-5">
                            {group.items.map((bs) => {
                              const isExpanded = expandedService === bs.serviceId;
                              const v = bs.budget - bs.actual;
                              const ledger = ledgerByService[bs.serviceId];
                              const costCats = getCostCategoriesByService(bs.serviceId);
                              const { grouped: ledgerByCc, unassigned: unassignedEntries } = isExpanded
                                ? getLedgerGroupedByCostCategory(bs.serviceId, buildingId, year)
                                : { grouped: {}, unassigned: [] };

                              // Row status (budget-based)
                              const hasFlagged = (ledger?.flagged || 0) > 0;
                              const overBudget = v < 0;
                              const svcPct = bs.budget > 0 ? (bs.actual / bs.budget) * 100 : 0;
                              const svcAheadOfPace = svcPct > yearPct + 10;
                              let rowStatusColor = brand.blue;
                              if (hasFlagged || overBudget) rowStatusColor = brand.red;
                              else if (svcAheadOfPace) rowStatusColor = brand.amber;

                              return (
                                <Card
                                  key={bs.id}
                                  className={`border-slate-200 bg-white transition-shadow ${isExpanded ? "shadow-md ring-1 ring-slate-200" : "hover:shadow-md cursor-pointer"}`}
                                >
                                  <CardContent className="p-0">
                                    {/* Summary row — always visible */}
                                    <div
                                      className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                                      onClick={() =>
                                        setExpandedService(isExpanded ? null : bs.serviceId)
                                      }
                                    >
                                      <ChevronRight
                                        size={14}
                                        className={`text-slate-400 transition-transform duration-150 shrink-0 ${isExpanded ? "rotate-90" : ""}`}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-semibold text-slate-800">
                                            {bs.service?.name[lang] || bs.serviceId}
                                          </span>
                                          <span className="text-[11px] font-mono text-slate-400">
                                            {bs.service?.code}
                                          </span>
                                          {bs.service?.metered && (
                                            <span className="text-[11px] px-2 py-1 rounded-full font-medium text-slate-500 bg-slate-100">
                                              {lang === "nl" ? "Gemeten" : "Metered"}
                                            </span>
                                          )}
                                        </div>
                                        {/* Budget progress indicator */}
                                        {(() => {
                                          const pct = bs.budget > 0 ? Math.round((bs.actual / bs.budget) * 100) : 0;
                                          const barCol = overBudget ? brand.red : svcAheadOfPace ? brand.amber : brand.blue;
                                          return (
                                            <div className="flex items-center gap-2 mt-1 max-w-[140px]">
                                              <div className="flex-1 h-[3px] rounded-full bg-slate-100 overflow-hidden">
                                                <div
                                                  className="h-full rounded-full"
                                                  style={{ width: `${Math.min(pct, 100)}%`, background: barCol }}
                                                />
                                              </div>
                                              <span className="text-[11px] text-slate-400 tabular-nums">{pct}%</span>
                                            </div>
                                          );
                                        })()}
                                      </div>
                                      <div className="flex items-center gap-4 shrink-0">
                                        <div className="text-right">
                                          <p className="text-xs tabular-nums font-medium" style={{ color: brand.navy }}>
                                            {fmt(bs.actual)}
                                          </p>
                                          <p className="text-[11px] text-slate-400 tabular-nums">
                                            {lang === "nl" ? "van" : "of"} {fmt(bs.budget)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Expanded detail — progressive disclosure */}
                                    {isExpanded && (
                                      <div className="border-t border-slate-100 px-4 py-4 space-y-5 bg-slate-50/30">
                                        {/* Cost basis indicator */}
                                        <div
                                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px]"
                                          style={{ background: isFeatureEnabled("ledger") ? "#F0FAFB" : "#FFFBEB" }}
                                        >
                                          {isFeatureEnabled("ledger") ? (
                                            <>
                                              <FileText size={14} style={{ color: brand.blue }} />
                                              <span className="font-medium" style={{ color: brand.blue }}>
                                                {lang === "nl" ? "Kosten uit grootboek" : "Costs from ledger"}
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <Gauge size={14} style={{ color: brand.amber }} />
                                              <span className="font-medium" style={{ color: brand.amber }}>
                                                {lang === "nl" ? "Kosten uit verbruiksdata" : "Costs from consumption data"}
                                              </span>
                                              <span className="text-slate-400">·</span>
                                              <span className="text-slate-500">
                                                {lang === "nl" ? "prognose" : "forecast"}
                                              </span>
                                            </>
                                          )}
                                        </div>

                                        {/* Section A: Budget Progress for this service */}
                                        {(() => {
                                          const pct = bs.budget > 0 ? Math.round((bs.actual / bs.budget) * 100) : 0;
                                          const barCol = overBudget ? brand.red : svcAheadOfPace ? brand.amber : brand.blue;
                                          return (
                                            <div>
                                              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2">
                                                {lang === "nl" ? "Budget voortgang" : "Budget Progress"}
                                              </p>
                                              <div className="flex items-center gap-3">
                                                <div className="flex-1 h-[6px] rounded-full bg-slate-100 overflow-hidden relative">
                                                  <div
                                                    className="h-full rounded-full transition-colors"
                                                    style={{ width: `${Math.min(pct, 100)}%`, background: barCol }}
                                                  />
                                                  {/* Year pace marker */}
                                                  {yearPct > 0 && yearPct < 100 && (
                                                    <div
                                                      className="absolute top-[-2px] w-[2px] h-[10px] bg-slate-300 rounded-full"
                                                      style={{ left: `${yearPct}%` }}
                                                      title={`${lang === "nl" ? "Jaar" : "Year"}: ${yearPct}%`}
                                                    />
                                                  )}
                                                </div>
                                                <span className="text-[11px] text-slate-500 tabular-nums shrink-0">
                                                  {pct}% {lang === "nl" ? "van budget" : "of budget"}
                                                </span>
                                              </div>
                                              <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400">
                                                <span>{fmt(bs.actual)} / {fmt(bs.budget)}</span>
                                                <span>
                                                  {lang === "nl" ? "Jaar" : "Year"} {yearPct}% {lang === "nl" ? "verstreken" : "elapsed"}
                                                  {pct > yearPct + 10 && (
                                                    <span className="ml-1 text-amber-500 font-medium">
                                                      · {lang === "nl" ? "voor op schema" : "ahead of pace"}
                                                    </span>
                                                  )}
                                                </span>
                                              </div>
                                            </div>
                                          );
                                        })()}

                                        {/* Section A2: Consumption Progress (from heating season data) */}
                                        {(() => {
                                          if (!isFeatureEnabled("consumptionControl")) return null;
                                          const season = heatingSeasons.find(h => h.yearKey === year);
                                          if (!season || season.ytdTotalCost == null) return null;

                                          const utilType = bs.service?.utility;
                                          const utilCfg = {
                                            heat: { unit: "GJ", color: "#EF4444" },
                                            gas: { unit: "m³", color: "#F59E0B" },
                                            water: { unit: "m³", color: "#3B82F6" },
                                            warmWater: { unit: "m³", color: "#8B5CF6" },
                                            electricity: { unit: "kWh", color: "#F59E0B" },
                                          }[utilType] || { unit: "GJ", color: "#64748B" };

                                          const unitPrice = season.m3Price || season.gjPrice || 0;
                                          const vheCount = building.vhe || 1;

                                          const now = new Date();
                                          const start = new Date(season.seasonStart);
                                          const end = new Date(season.seasonEnd);
                                          const totalDays = Math.max(1, (end - start) / 86400000);
                                          const elapsedDays = Math.max(0, Math.min(totalDays, (now - start) / 86400000));
                                          const seasonPct = Math.round((elapsedDays / totalDays) * 100);

                                          const ytdCost = season.ytdTotalCost || 0;
                                          const endCost = (season.endCostPerApartment || 0) * vheCount;
                                          const costPct = endCost > 0 ? Math.round((ytdCost / endCost) * 100) : 0;

                                          const ytdConsumption = unitPrice > 0 ? ytdCost / unitPrice : 0;
                                          const endConsumption = unitPrice > 0 ? endCost / unitPrice : 0;

                                          const fmtNum = (n) => Math.round(n).toLocaleString("nl-NL");

                                          return (
                                            <div>
                                              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-3">
                                                {lang === "nl" ? "Verbruiksvoortgang" : "Consumption Progress"}
                                                <span className="ml-2 font-normal normal-case">
                                                  ({lang === "nl" ? "seizoen" : "season"} {seasonPct}% {lang === "nl" ? "verstreken" : "elapsed"})
                                                </span>
                                              </p>
                                              <div className="grid grid-cols-2 gap-3">
                                                {/* Consumption */}
                                                <div className="rounded-lg border border-slate-100 bg-white p-3">
                                                  <div className="flex items-center gap-1.5 mb-2">
                                                    <Gauge size={14} style={{ color: utilCfg.color }} />
                                                    <span className="text-[11px] font-medium text-slate-500">
                                                      {lang === "nl" ? "Verbruik" : "Consumption"} ({utilCfg.unit})
                                                    </span>
                                                  </div>
                                                  <div className="flex items-baseline gap-2 mb-1">
                                                    <span className="text-sm font-semibold tabular-nums" style={{ color: brand.navy }}>
                                                      {fmtNum(ytdConsumption)}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">
                                                      {lang === "nl" ? "tot heden" : "to date"}
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex-1 h-[4px] rounded-full bg-slate-100 overflow-hidden">
                                                      <div
                                                        className="h-full rounded-full"
                                                        style={{ width: `${Math.min(costPct, 100)}%`, background: utilCfg.color }}
                                                      />
                                                    </div>
                                                    <span className="text-[11px] text-slate-400 tabular-nums">{costPct}%</span>
                                                  </div>
                                                  <div className="text-[11px] text-slate-400">
                                                    {lang === "nl" ? "Verwacht einde seizoen" : "Expected end of season"}: <span className="font-medium text-slate-600">{fmtNum(endConsumption)} {utilCfg.unit}</span>
                                                  </div>
                                                </div>
                                                {/* Costs */}
                                                <div className="rounded-lg border border-slate-100 bg-white p-3">
                                                  <div className="flex items-center gap-1.5 mb-2">
                                                    <FileText size={14} style={{ color: brand.blue }} />
                                                    <span className="text-[11px] font-medium text-slate-500">
                                                      {lang === "nl" ? "Kosten" : "Costs"} (€)
                                                    </span>
                                                  </div>
                                                  <div className="flex items-baseline gap-2 mb-1">
                                                    <span className="text-sm font-semibold tabular-nums" style={{ color: brand.navy }}>
                                                      {fmt(ytdCost)}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">
                                                      {lang === "nl" ? "tot heden" : "to date"}
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex-1 h-[4px] rounded-full bg-slate-100 overflow-hidden">
                                                      <div
                                                        className="h-full rounded-full"
                                                        style={{ width: `${Math.min(costPct, 100)}%`, background: brand.blue }}
                                                      />
                                                    </div>
                                                    <span className="text-[11px] text-slate-400 tabular-nums">{costPct}%</span>
                                                  </div>
                                                  <div className="text-[11px] text-slate-400">
                                                    {lang === "nl" ? "Verwacht einde seizoen" : "Expected end of season"}: <span className="font-medium text-slate-600">{fmt(endCost)}</span>
                                                  </div>
                                                  {unitPrice > 0 && (
                                                    <div className="text-[11px] text-slate-400 mt-1">
                                                      {lang === "nl" ? "Tarief" : "Rate"}: €{unitPrice.toFixed(2)}/{utilCfg.unit}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                              {season.avgAdvance > 0 && (
                                                <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2">
                                                  <span>{lang === "nl" ? "Gem. voorschot" : "Avg. advance"}:</span>
                                                  <span className="font-medium text-slate-600">{fmtEur2(season.avgAdvance)}/{lang === "nl" ? "mnd" : "mo"}</span>
                                                  {season.endDebtorRisk > 0 && (
                                                    <>
                                                      <span className="text-slate-300">·</span>
                                                      <span style={{ color: brand.amber }}>
                                                        {lang === "nl" ? "Debiteurrisico" : "Debtor risk"}: {fmt(season.endDebtorRisk)}
                                                      </span>
                                                    </>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })()}

                                        {/* Section B: Consumption insight (metered services — cross-cutting, stays at service level) */}
                                        {isFeatureEnabled("consumptionControl") && bs.service?.metered && (() => {
                                          const utilityMap = {
                                            "SVC-108": "heat", "SVC-107": "heat",
                                            "SVC-102": "water", "SVC-104": "water",
                                            "SVC-105": "electricity", "SVC-106": "electricity",
                                            "SVC-110": "electricity", "SVC-133": "electricity",
                                          };
                                          const utilType = utilityMap[bs.serviceId];
                                          const svcMeters = meterList.filter((m) => m.utility === utilType && m.type === "main");
                                          const totalConsumption = svcMeters.reduce((s, m) => s + (m.consumption || 0), 0);
                                          const meteredCats = costCats.filter((cc) => cc.unit && cc.unitPrice);
                                          const avgUnitPrice = meteredCats.length > 0
                                            ? meteredCats.reduce((s, cc) => s + Math.abs(cc.unitPrice) * cc.budgetShare, 0) / meteredCats.reduce((s, cc) => s + cc.budgetShare, 0)
                                            : 0;
                                          const expectedCost = totalConsumption * avgUnitPrice;
                                          const variancePct = expectedCost > 0 ? Math.round(((bs.actual - expectedCost) / expectedCost) * 100) : 0;
                                          const unit = meteredCats[0]?.unit || "—";
                                          if (totalConsumption === 0 || avgUnitPrice === 0) return null;
                                          return (
                                            <div className="px-3 py-3 rounded-lg bg-white border border-slate-100">
                                              <div className="grid grid-cols-3 gap-4 text-[11px]">
                                                <div>
                                                  <p className="text-slate-400 mb-1">{lang === "nl" ? "Verbruik" : "Consumption"}</p>
                                                  <p className="font-medium text-slate-700 tabular-nums">{totalConsumption.toLocaleString("nl-NL")} {unit}</p>
                                                </div>
                                                <div>
                                                  <p className="text-slate-400 mb-1">{lang === "nl" ? "Verwachte kosten" : "Expected cost"}</p>
                                                  <p className="font-medium text-slate-700 tabular-nums">{fmtEur2(expectedCost)}</p>
                                                  <p className="text-[11px] text-slate-400 mt-0.5">{totalConsumption.toLocaleString("nl-NL")} × €{avgUnitPrice.toFixed(2)}/{unit}</p>
                                                </div>
                                                <div>
                                                  <p className="text-slate-400 mb-1">{lang === "nl" ? "Geboekt" : "Booked"}</p>
                                                  <p className="font-medium tabular-nums" style={{ color: brand.navy }}>{fmtEur2(bs.actual)}</p>
                                                  {Math.abs(variancePct) > 15 && (
                                                    <p className="text-[11px] font-medium mt-0.5" style={{ color: variancePct > 0 ? brand.red : brand.amber }}>
                                                      {variancePct > 0 ? "+" : ""}{variancePct}% {lang === "nl" ? "afwijking" : "variance"}
                                                    </p>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })()}

                                        {/* Section C: Cost Categories with nested Ledger Entries */}
                                        <div>
                                          <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2">
                                            {lang === "nl" ? "Kostensoorten" : "Cost Categories"} ({costCats.length})
                                          </p>
                                          {costCats.length === 0 ? (
                                            <p className="text-[11px] text-slate-400 italic">
                                              {lang === "nl" ? "Geen kostensoorten geconfigureerd" : "No cost categories configured"}
                                            </p>
                                          ) : (
                                            <div className="space-y-1.5">
                                              {costCats.map((cc) => {
                                                const ccEntries = (ledgerByCc[cc.id] || []).sort((a, b) => b.date.localeCompare(a.date));
                                                const ccActual = ccEntries.reduce((s, e) => s + e.amount, 0);
                                                const ccBudget = bs.budget * cc.budgetShare;
                                                const ccPct = ccBudget > 0 ? Math.round((ccActual / ccBudget) * 100) : 0;
                                                const ccOver = ccActual > ccBudget;
                                                const ccAhead = ccPct > yearPct + 10;
                                                const ccBarCol = ccOver ? brand.red : ccAhead ? brand.amber : brand.blue;
                                                const isCcExpanded = expandedCostCats[cc.id];
                                                const ccFlagged = ccEntries.filter((e) => e.status === "flagged").length;

                                                const freqLabel = {
                                                  monthly: lang === "nl" ? "mnd" : "mo",
                                                  quarterly: lang === "nl" ? "kw" : "qtr",
                                                  annual: lang === "nl" ? "jr" : "yr",
                                                  irregular: lang === "nl" ? "onr" : "irr",
                                                }[cc.invoiceFrequency] || cc.invoiceFrequency;

                                                return (
                                                  <div key={cc.id} className="rounded-lg bg-white border border-slate-100 overflow-hidden">
                                                    {/* Cost Category header row — clickable */}
                                                    <div
                                                      className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-slate-50/50 transition-colors"
                                                      onClick={() => toggleCostCat(cc.id)}
                                                    >
                                                      {isCcExpanded
                                                        ? <ChevronDown size={12} className="text-slate-400 shrink-0" />
                                                        : <ChevronRight size={12} className="text-slate-400 shrink-0" />
                                                      }
                                                      <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1">
                                                          <span className="text-[11px] font-medium text-slate-700">{(cc.name || cc.label)?.[lang] || (cc.name || cc.label)?.en || cc.id}</span>
                                                          {cc.supplier && (
                                                            <span className="text-[11px] text-slate-400 truncate hidden sm:inline">· {cc.supplier}</span>
                                                          )}
                                                          {ccFlagged > 0 && (
                                                            <span className="text-[11px] px-1.5 py-1 rounded bg-red-50 font-medium" style={{ color: brand.red }}>
                                                              {ccFlagged} ⚑
                                                            </span>
                                                          )}
                                                        </div>
                                                        {/* Mini progress bar */}
                                                        <div className="flex items-center gap-1 mt-1 max-w-[120px]">
                                                          <div className="flex-1 h-[2px] rounded-full bg-slate-100 overflow-hidden">
                                                            <div className="h-full rounded-full" style={{ width: `${Math.min(ccPct, 100)}%`, background: ccBarCol }} />
                                                          </div>
                                                          <span className="text-[11px] text-slate-400 tabular-nums">{ccPct}%</span>
                                                        </div>
                                                      </div>
                                                      <div className="flex items-center gap-2.5 shrink-0 text-[11px]">
                                                        <span className="text-slate-400 tabular-nums hidden sm:inline">{freqLabel}</span>
                                                        {cc.unit && cc.unitPrice && (
                                                          <span className="text-slate-400 tabular-nums hidden sm:inline">€{Math.abs(cc.unitPrice).toFixed(2)}/{cc.unit}</span>
                                                        )}
                                                        <span className="font-medium tabular-nums" style={{ color: ccOver ? brand.red : brand.navy }}>
                                                          {fmtEur2(ccActual)}
                                                        </span>
                                                        <span className="text-slate-400 tabular-nums">
                                                          / {fmtEur2(ccBudget)}
                                                        </span>
                                                      </div>
                                                    </div>

                                                    {/* Expanded: nested ledger entries */}
                                                    {isCcExpanded && ccEntries.length > 0 && (
                                                      <div className="border-t border-slate-100 bg-slate-50/30">
                                                        {ccEntries.slice(0, 8).map((entry) => (
                                                          <div key={entry.id} className="flex items-center justify-between text-[11px] px-3 py-1.5 pl-8 border-b border-slate-50 last:border-b-0">
                                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                              <span className="text-slate-400 tabular-nums shrink-0">{fmtDate(entry.date)}</span>
                                                              <span className="text-slate-600 truncate">
                                                                {typeof entry.description === "object" ? (entry.description[lang] || entry.description.en) : entry.description}
                                                              </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                                              <span className="text-slate-700 tabular-nums">{fmtEur2(entry.amount)}</span>
                                                              <LedgerStatusBadge status={entry.status} lang={lang} />
                                                            </div>
                                                          </div>
                                                        ))}
                                                        {ccEntries.length > 8 && (
                                                          <p className="text-[11px] text-slate-400 italic px-3 pl-8 py-1.5">
                                                            + {ccEntries.length - 8} {lang === "nl" ? "meer" : "more"}
                                                          </p>
                                                        )}
                                                      </div>
                                                    )}
                                                    {isCcExpanded && ccEntries.length === 0 && (
                                                      <div className="border-t border-slate-100 bg-slate-50/30 px-3 pl-8 py-2">
                                                        <p className="text-[11px] text-slate-400 italic">
                                                          {lang === "nl" ? "Geen boekingen gevonden" : "No entries found"}
                                                        </p>
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>

                                        {/* Section D: Unclassified entries — data quality signal */}
                                        {unassignedEntries.length > 0 && (
                                          <div>
                                            <div className="flex items-center gap-1 mb-2">
                                              <HelpCircle size={12} style={{ color: brand.amber }} />
                                              <p className="text-[11px] text-amber-600 font-medium uppercase tracking-wider">
                                                {lang === "nl" ? "Niet-geclassificeerd" : "Unclassified"} ({unassignedEntries.length})
                                              </p>
                                            </div>
                                            <div className="rounded-lg bg-amber-50/30 border border-amber-100 overflow-hidden">
                                              {unassignedEntries.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map((entry) => (
                                                <div key={entry.id} className="flex items-center justify-between text-[11px] px-3 py-1.5 border-b border-amber-50 last:border-b-0">
                                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <span className="text-slate-400 tabular-nums shrink-0">{fmtDate(entry.date)}</span>
                                                    <span className="text-slate-600 truncate">
                                                      {typeof entry.description === "object" ? (entry.description[lang] || entry.description.en) : entry.description}
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center gap-2 shrink-0 ml-2">
                                                    <span className="text-slate-700 tabular-nums">{fmtEur2(entry.amount)}</span>
                                                    <LedgerStatusBadge status={entry.status} lang={lang} />
                                                  </div>
                                                </div>
                                              ))}
                                              {unassignedEntries.length > 5 && (
                                                <p className="text-[11px] text-amber-500 italic px-3 py-1.5">
                                                  + {unassignedEntries.length - 5} {lang === "nl" ? "meer" : "more"}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        )}

                                        {/* Footer: Distribution model + cross-navigation */}
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                          <button
                                            className="text-[11px] font-medium flex items-center gap-1 transition-colors hover:underline"
                                            style={{ color: brand.blue }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setDistDrilldown({ serviceId: bs.serviceId, buildingId });
                                            }}
                                          >
                                            <Activity size={12} />
                                            {lang === "nl" ? "Bekijk verdelingsmodel" : "View distribution model"}
                                            <ChevronRight size={12} />
                                          </button>
                                          <button
                                            className="text-[11px] font-medium flex items-center gap-1 hover:underline"
                                            style={{ color: brand.blue }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              navigate(`/${orgId}/services/${bs.serviceId}`);
                                            }}
                                          >
                                            {lang === "nl" ? "Alle complexen" : "All buildings"}
                                            <ArrowUpRight size={14} />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
                )}
              </TabsContent>

              {/* ═══ METERS TAB (requires consumption feature) ═══ */}
              {isFeatureEnabled("consumption") && <TabsContent value="meters">
                <div className="mt-4 space-y-4">
                  {/* Dismounted meter filter */}
                  {dismountedCount > 0 && (
                    <div className="flex items-center justify-end mb-3">
                      <button
                        onClick={() => setShowDismounted(!showDismounted)}
                        className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <span className={`w-3.5 h-3.5 rounded border transition-colors flex items-center justify-center ${showDismounted ? 'bg-slate-700 border-slate-700' : 'border-slate-300'}`}>
                          {showDismounted && <CheckCircle2 size={10} className="text-white" />}
                        </span>
                        {lang === "nl" ? `Gedemonteerde meters tonen (${dismountedCount})` : `Show dismounted meters (${dismountedCount})`}
                      </button>
                    </div>
                  )}
                  {/* Main meters */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 mb-3">
                      {lang === "nl" ? "Hoofdmeters" : "Main Meters"}
                    </h3>
                    {mainMeters.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-slate-400">
                        {t("noResults", lang)}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {mainMeters.map((m) => {
                          const ui = utilityIcon[m.utility] || {};
                          const Icon = ui.icon || Gauge;
                          const isOverdue = m.status === "warning";
                          return (
                            <Card key={m.id} className="border-slate-200 bg-white">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div
                                      className="w-8 h-8 rounded flex items-center justify-center shrink-0"
                                      style={{ background: (ui.color || "#94A3B8") + "15" }}
                                    >
                                      <Icon size={14} style={{ color: ui.color || "#94A3B8" }} />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs text-slate-700 font-medium">{m.meterNumber}</p>
                                      <p className="text-[11px] text-slate-400">{t(m.utility, lang)} · {m.unit}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 ml-2">
                                    {m.dismounted && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-1 rounded text-[11px] font-medium bg-slate-100 text-slate-400">
                                        {lang === "nl" ? "Gedemonteerd" : "Dismounted"}
                                      </span>
                                    )}
                                    <span className={`text-[11px] font-medium whitespace-nowrap ${isOverdue ? "text-amber-600" : "text-green-600"}`}>
                                      {isOverdue ? t("readingsOverdue", lang) : t("readingsUpToDate", lang)}
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 px-3 py-2 bg-slate-50 rounded">
                                  <div>
                                    <p className="text-[11px] text-slate-500 uppercase font-medium">
                                      {lang === "nl" ? "Huidig" : "Current"}
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900">
                                      {(m.lastReading || 0).toLocaleString("nl-NL")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[11px] text-slate-500 uppercase font-medium">
                                      {lang === "nl" ? "Verbruik" : "Consumption"}
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900">
                                      {(m.consumption || 0).toLocaleString("nl-NL")} {m.unit}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[11px] text-slate-500 uppercase font-medium">
                                      {lang === "nl" ? "Aflezing" : "Reading date"}
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900">
                                      {m.readingDate}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Sub meters */}
                  {subMeters.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-600 mb-3">
                        {lang === "nl" ? "Submeters" : "Sub Meters"} ({subMeters.length})
                      </h3>
                      <div className="space-y-2">
                        {subMeters.map((m) => {
                          const ui = utilityIcon[m.utility] || {};
                          const Icon = ui.icon || Gauge;
                          return (
                            <Card key={m.id} className="border-slate-200 bg-white">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div
                                      className="w-8 h-8 rounded flex items-center justify-center shrink-0"
                                      style={{ background: (ui.color || "#94A3B8") + "15" }}
                                    >
                                      <Icon size={14} style={{ color: ui.color || "#94A3B8" }} />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs text-slate-700 font-medium">{m.meterNumber}</p>
                                      <p className="text-[11px] text-slate-400">{m.vheId}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {m.dismounted && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-1 rounded text-[11px] font-medium bg-slate-100 text-slate-400">
                                        {lang === "nl" ? "Gedemonteerd" : "Dismounted"}
                                      </span>
                                    )}
                                    <span className="text-sm font-semibold tabular-nums" style={{ color: brand.navy }}>
                                      {(m.consumption || 0).toLocaleString("nl-NL")} {m.unit}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>}

              {/* ═══ VHE TAB ═══ */}
              <TabsContent value="vhe">
                {/* View mode toggle */}
                <div className="mt-4 mb-3 flex items-center justify-between">
                  <p className="text-[11px] text-slate-400">
                    {vheList.length} {lang === "nl" ? "eenheden" : "units"}
                  </p>
                  <div className="flex items-center gap-0.5 rounded-md border border-slate-200 bg-white p-0.5">
                    <button
                      onClick={() => setVheViewMode("cards")}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-colors ${
                        vheViewMode === "cards"
                          ? "bg-slate-100 text-slate-700 font-medium"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                      title={lang === "nl" ? "Kaartweergave" : "Card view"}
                    >
                      <CreditCard size={12} />
                      <span className="hidden sm:inline">{lang === "nl" ? "Kaarten" : "Cards"}</span>
                    </button>
                    <button
                      onClick={() => setVheViewMode("table")}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-colors ${
                        vheViewMode === "table"
                          ? "bg-slate-100 text-slate-700 font-medium"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                      title={lang === "nl" ? "Tabelweergave" : "Table view"}
                    >
                      <LayoutList size={12} />
                      <span className="hidden sm:inline">{lang === "nl" ? "Tabel" : "Table"}</span>
                    </button>
                  </div>
                </div>

                {vheList.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-400">
                    {t("noResults", lang)}
                  </div>
                ) : vheViewMode === "table" ? (
                  /* ── TABLE VIEW ── */
                  <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-100">
                            <th className="text-left px-3 py-2 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
                              {t("unit", lang)}
                            </th>
                            <th className="text-left px-3 py-2 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
                              {lang === "nl" ? "Adres" : "Address"}
                            </th>
                            <th className="text-left px-3 py-2 font-semibold text-slate-500 text-[11px] uppercase tracking-wider hidden sm:table-cell">
                              m²
                            </th>
                            <th className="text-left px-3 py-2 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
                              Status
                            </th>
                            <th className="text-left px-3 py-2 font-semibold text-slate-500 text-[11px] uppercase tracking-wider hidden sm:table-cell">
                              {lang === "nl" ? "Contract" : "Contract"}
                            </th>
                            <th className="text-right px-3 py-2 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
                              {lang === "nl" ? "Voorschot" : "Advance"}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {vheList.map((vhe) => {
                            const isExp = expandedVhe === vhe.id;
                            return (
                              <React.Fragment key={vhe.id}>
                                <tr
                                  className={`cursor-pointer transition-colors ${isExp ? "bg-slate-50" : "hover:bg-slate-50/50"}`}
                                  onClick={() => setExpandedVhe(isExp ? null : vhe.id)}
                                >
                                  <td className="px-3 py-2.5 text-slate-600 font-mono tabular-nums">
                                    <div className="flex items-center gap-1.5">
                                      <ChevronRight
                                        size={12}
                                        className={`text-slate-400 transition-transform duration-150 shrink-0 ${isExp ? "rotate-90" : ""}`}
                                      />
                                      {vhe.unit}
                                    </div>
                                  </td>
                                  <td className="px-3 py-2.5 text-slate-700 font-medium max-w-[200px] truncate">
                                    {vhe.address}
                                  </td>
                                  <td className="px-3 py-2.5 text-slate-500 tabular-nums hidden sm:table-cell">
                                    {vhe.m2 ? `${vhe.m2}` : "—"}
                                  </td>
                                  <td className="px-3 py-2.5">
                                    <StatusBadge status={vhe.status} size="xs" />
                                  </td>
                                  <td className="px-3 py-2.5 hidden sm:table-cell">
                                    {vhe.contract ? (
                                      <StatusBadge status={vhe.contract.status} size="xs" />
                                    ) : (
                                      <span className="text-slate-300">—</span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2.5 text-right font-medium tabular-nums" style={{ color: brand.navy }}>
                                    {fmt(vhe.voorschot)}
                                  </td>
                                </tr>
                                {isExp && (
                                  <tr>
                                    <td colSpan={6} className="p-0">
                                      <div className="px-4 py-4 bg-slate-50/70 border-t border-slate-100 space-y-3">
                                        <AttributePanel>
                                          <AttrSection title={lang === "nl" ? "Details" : "Details"}>
                                            <AttrRow
                                              label={lang === "nl" ? "VHE ID" : "VHE ID"}
                                              value={vhe.id}
                                            />
                                            {vhe.m2 && (
                                              <AttrRow
                                                label={lang === "nl" ? "Oppervlakte" : "Area"}
                                                value={`${vhe.m2} m²`}
                                              />
                                            )}
                                            <AttrRow
                                              label={lang === "nl" ? "Status" : "Status"}
                                              value={<StatusBadge status={vhe.status} size="xs" />}
                                            />
                                            {vhe.contract && (
                                              <>
                                                <AttrRow
                                                  label={lang === "nl" ? "Contract" : "Contract"}
                                                  value={<StatusBadge status={vhe.contract.status} size="xs" />}
                                                />
                                                <AttrRow
                                                  label={lang === "nl" ? "Ingangsdatum" : "Start date"}
                                                  value={vhe.contract.startDate || "—"}
                                                />
                                              </>
                                            )}
                                          </AttrSection>
                                        </AttributePanel>

                                        {/* Service cost breakdown */}
                                        {vhe.voorschotBreakdown?.length > 0 && (
                                          <div>
                                            <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
                                              {lang === "nl" ? "Servicekosten" : "Service Charges"}
                                            </h4>
                                            <div className="rounded-lg border border-slate-100 bg-white divide-y divide-slate-50">
                                              {vhe.voorschotBreakdown.map((item) => {
                                                const svc = getService(item.s);
                                                return (
                                                  <div key={item.s} className="flex items-center justify-between px-3 py-2">
                                                    <div className="min-w-0">
                                                      <span className="text-[11px] font-mono text-slate-400 mr-1.5">{svc?.code || item.s}</span>
                                                      <span className="text-xs text-slate-600">
                                                        {svc?.name?.[lang] || svc?.name?.en || "—"}
                                                      </span>
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-700 tabular-nums shrink-0 ml-2">
                                                      {fmt(item.a)}
                                                    </span>
                                                  </div>
                                                );
                                              })}
                                              <div className="flex items-center justify-between px-3 py-2 bg-slate-50/50">
                                                <span className="text-xs font-semibold text-slate-600">
                                                  {lang === "nl" ? "Totaal" : "Total"}
                                                </span>
                                                <span className="text-xs font-bold tabular-nums" style={{ color: brand.navy }}>
                                                  {fmt(vhe.voorschot)}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="bg-slate-50/80 border-t border-slate-200">
                            <td colSpan={5} className="px-3 py-2 text-[11px] font-semibold text-slate-500">
                              {lang === "nl" ? "Totaal" : "Total"} ({vheList.length})
                            </td>
                            <td className="px-3 py-2 text-right text-xs font-bold tabular-nums" style={{ color: brand.navy }}>
                              {fmt(vheList.reduce((s, v) => s + (v.voorschot || 0), 0))}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* ── CARD VIEW (existing dropdown) ── */
                  <div className="space-y-3">
                    {vheList.map((vhe) => {
                      const isExpanded = expandedVhe === vhe.id;
                      return (
                        <React.Fragment key={vhe.id}>
                          <Card
                            className="border-slate-200 bg-white cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() =>
                              setExpandedVhe(isExpanded ? null : vhe.id)
                            }
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <ChevronRight
                                    size={14}
                                    className={`text-slate-400 transition-transform duration-150 shrink-0 ${isExpanded ? "rotate-90" : ""}`}
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs text-slate-700 font-medium truncate">
                                      {vhe.address}
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                      {t("unit", lang)} {vhe.unit}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <StatusBadge status={vhe.status} />
                                  <p className="text-[11px] text-slate-400 mt-1 tabular-nums">
                                    {lang === "nl" ? "Voorschot:" : "Advance:"} {fmt(vhe.voorschot)}
                                  </p>
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                                  <AttributePanel>
                                    <AttrSection title={lang === "nl" ? "Details" : "Details"}>
                                      <AttrRow
                                        label={lang === "nl" ? "VHE ID" : "VHE ID"}
                                        value={vhe.id}
                                      />
                                      {vhe.m2 && (
                                        <AttrRow
                                          label={lang === "nl" ? "Oppervlakte" : "Area"}
                                          value={`${vhe.m2} m²`}
                                        />
                                      )}
                                      <AttrRow
                                        label={lang === "nl" ? "Status" : "Status"}
                                        value={<StatusBadge status={vhe.status} size="xs" />}
                                      />
                                      {vhe.contract && (
                                        <>
                                          <AttrRow
                                            label={lang === "nl" ? "Contract" : "Contract"}
                                            value={<StatusBadge status={vhe.contract.status} size="xs" />}
                                          />
                                          <AttrRow
                                            label={lang === "nl" ? "Ingangsdatum" : "Start date"}
                                            value={vhe.contract.startDate || "—"}
                                          />
                                        </>
                                      )}
                                    </AttrSection>
                                  </AttributePanel>

                                  {/* Service cost breakdown */}
                                  {vhe.voorschotBreakdown?.length > 0 && (
                                    <div>
                                      <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
                                        {lang === "nl" ? "Servicekosten" : "Service Charges"}
                                      </h4>
                                      <div className="rounded-lg border border-slate-100 bg-white divide-y divide-slate-50">
                                        {vhe.voorschotBreakdown.map((item) => {
                                          const svc = getService(item.s);
                                          return (
                                            <div key={item.s} className="flex items-center justify-between px-3 py-2">
                                              <div className="min-w-0">
                                                <span className="text-[11px] font-mono text-slate-400 mr-1.5">{svc?.code || item.s}</span>
                                                <span className="text-xs text-slate-600">
                                                  {svc?.name?.[lang] || svc?.name?.en || "—"}
                                                </span>
                                              </div>
                                              <span className="text-xs font-medium text-slate-700 tabular-nums shrink-0 ml-2">
                                                {fmt(item.a)}
                                              </span>
                                            </div>
                                          );
                                        })}
                                        <div className="flex items-center justify-between px-3 py-2 bg-slate-50/50">
                                          <span className="text-xs font-semibold text-slate-600">
                                            {lang === "nl" ? "Totaal" : "Total"}
                                          </span>
                                          <span className="text-xs font-bold tabular-nums" style={{ color: brand.navy }}>
                                            {fmt(vhe.voorschot)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* ═══ ACTIVITY TAB ═══ */}
              <TabsContent value="activity">
                <div className="mt-4 space-y-2">
                  {activityList.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-400">
                      {t("noResults", lang)}
                    </div>
                  ) : (
                    activityList.map((activity) => {
                      const cfg = activityIcons[activity.type] || {};
                      const Icon = cfg.icon || Activity;
                      return (
                        <Card key={activity.id} className="border-slate-200 bg-white">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                style={{ background: (cfg.color || brand.blue) + "15" }}
                              >
                                <Icon size={14} style={{ color: cfg.color || brand.blue }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-700 font-medium">
                                  {typeof activity.description === "object" ? (activity.description[lang] || activity.description.en) : activity.description}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-1">
                                  {fmtDate(activity.date)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* ── Attribute panel (right sidebar) ── */}
          <div className="w-full xl:w-80 shrink-0">
            <AttributePanel>
              <AttrSection title={lang === "nl" ? "Informatie" : "Information"}>
                <AttrRow label={lang === "nl" ? "Complex ID" : "Complex ID"} value={building.complexId} source={getFieldSource("building", "complexId")} />
                <AttrRow label={lang === "nl" ? "Locatie" : "Location"} value={building.location} source={getFieldSource("building", "location")} />
                <AttrRow label={lang === "nl" ? "VHE" : "VHE"} value={building.vhe} source={getFieldSource("building", "vhe")} />
                <AttrRow
                  label={lang === "nl" ? "Datakwaliteit" : "Data Quality"}
                  value={building.dataQuality}
                  source={getFieldSource("building", "dataQuality")}
                />
                <AttrRow
                  label={lang === "nl" ? "Staat" : "Status"}
                  value={building.status}
                />
              </AttrSection>
            </AttributePanel>
          </div>
        </div>
      </div>
    </div>
  );
}
