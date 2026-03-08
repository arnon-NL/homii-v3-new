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
  Search,
  ArrowUpDown,
  Link2,
  Radio,
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
  getVhe,
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

/* ── Category icon + color config (all neutral — differentiate by icon shape + label) ── */
const categoryConfig = {
  energy:        { icon: Zap,        color: "#64748B", bg: "#F8FAFC" },
  installations: { icon: Wrench,     color: "#64748B", bg: "#F8FAFC" },
  cleaning:      { icon: Sparkles,   color: "#64748B", bg: "#F8FAFC" },
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
  booked:  { color: "#64748B", bg: "#F8FAFC", label: { en: "Booked", nl: "Geboekt" }, icon: CheckCircle2 },
  pending: { color: "#F59E0B", bg: "#F8FAFC", label: { en: "Pending", nl: "In afwachting" }, icon: Clock },
  flagged: { color: "#EF4444", bg: "#F8FAFC", label: { en: "Flagged", nl: "Gemarkeerd" }, icon: AlertTriangle },
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

/* ── Utility icon — tinted per utility type ── */
const utilityIcon = {
  heat: { icon: Flame, color: "#EF4444", bg: "#FEE2E2" },
  water: { icon: Droplets, color: "#3B82F6", bg: "#DBEAFE" },
  electricity: { icon: Zap, color: "#F59E0B", bg: "#FEF3C7" },
  gas: { icon: Flame, color: "#F97316", bg: "#FFF7ED" },
  "water-hot": { icon: Droplets, color: "#EC4899", bg: "#FCE7F3" },
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
  in_review:    { icon: AlertTriangle, color: "#F59E0B", bg: "#F8FAFC", label: { en: "In review",    nl: "In controle" } },
  approved:     { icon: FileCheck,     color: "#64748B", bg: "#F8FAFC", label: { en: "Approved",     nl: "Goedgekeurd" } },
  distributed:  { icon: Send,          color: "#64748B", bg: "#F8FAFC", label: { en: "Distributed",  nl: "Afgerekend" } },
};

/* ── Settlement check icon ── */
function CheckIcon({ passed, label }) {
  return (
    <div className="flex items-center gap-2" title={label}>
      {passed ? (
        <CheckCircle2 size={14} className="text-slate-400" />
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
  approved: { icon: CheckCircle2, color: "#64748B", bg: "#F8FAFC", label: { en: "Approved",  nl: "Goedgekeurd" } },
  verified: { icon: ShieldCheck,  color: "#64748B", bg: "#F8FAFC", label: { en: "Verified",  nl: "Geverifieerd" } },
  flagged:  { icon: Flag,         color: "#EF4444", bg: "#F8FAFC", label: { en: "Flagged",   nl: "Gemarkeerd" } },
  pending:  { icon: Clock,        color: "#F59E0B", bg: "#F8FAFC", label: { en: "Pending",   nl: "In afwachting" } },
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
  const [expandedService, setExpandedService] = useState(null);
  // VHE tab state
  const [vheSortField, setVheSortField] = useState("unit");
  const [vheSortDir, setVheSortDir] = useState("asc");
  const [vheContractFilter, setVheContractFilter] = useState("all"); // all | active | ended | vacant
  const [vheSearch, setVheSearch] = useState("");
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

  // Kostenverdeler map: serviceId (e.g. "SVC-108") → [{id, name, shortName}]
  const kostenverdelerMap = useMemo(() => {
    const map = {};
    (data.suppliers || []).forEach((s) => {
      if (s.kostenverdeler && s.serviceIds) {
        const shortName = s.name
          .replace(/\s+(BV|B\.V\.|NV|N\.V\.)$/i, "")
          .replace(/\s+Energy Services$/i, "");
        s.serviceIds.forEach((sid) => {
          if (!map[sid]) map[sid] = [];
          map[sid].push({ id: s.id, name: s.name, shortName });
        });
      }
    });
    return map;
  }, [data.suppliers]);

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

        {/* ── Settlement context strip (past year + ledger orgs only) ── */}
        {isFeatureEnabled("ledger") && isPastYear && settlement && (
          <div className="flex items-center gap-2 mb-4 text-[12px] text-slate-500">
            {(() => {
              const sCfg = settlementStatusConfig[settlement.status];
              const SIcon = sCfg?.icon || Circle;
              return (
                <>
                  <SIcon size={14} style={{ color: sCfg?.color }} />
                  <span className="font-medium" style={{ color: sCfg?.color }}>
                    {lang === "nl" ? "Afrekening" : "Settlement"} {year}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span>{sCfg?.label[lang]}</span>
                  {settlement.approvedAt && (
                    <>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-400">
                        {lang === "nl" ? "Goedgekeurd" : "Approved"} {settlement.approvedAt}
                      </span>
                    </>
                  )}
                  {settlement.distributedAt && (
                    <>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-400">
                        {lang === "nl" ? "Afgerekend" : "Distributed"} {settlement.distributedAt}
                      </span>
                    </>
                  )}
                  {settlement.netResult != null && (
                    <>
                      <span className="text-slate-300 ml-auto">·</span>
                      <span
                        className="font-semibold tabular-nums"
                        style={{ color: settlement.netResult >= 0 ? brand.blue : brand.red }}
                      >
                        {settlement.netResult >= 0 ? "+" : ""}{fmt(settlement.netResult)}
                      </span>
                      <span className="text-slate-400">
                        {settlement.netResult >= 0
                          ? (lang === "nl" ? "teruggave" : "refund")
                          : (lang === "nl" ? "naheffing" : "surcharge")}
                      </span>
                    </>
                  )}
                </>
              );
            })()}
          </div>
        )}

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
                  isFeatureEnabled("consumptionControl") && {
                    value: "consumption",
                    label: lang === "nl" ? "Verbruik" : "Consumption",
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
                  {/* ── Layer 1: Mode-aware Verdict Card ── */}
                  {isFeatureEnabled("ledger") && isPastYear && settlement ? (
                    /* ═══ SETTLEMENT MODE — Readiness cockpit ═══ */
                    <Card className="border-slate-200 bg-white overflow-hidden">
                      <CardContent className="px-5 py-4">
                        {/* Settlement progress stepper */}
                        <div className="flex items-center gap-1 mb-4">
                          {["monitoring", "in_review", "approved", "distributed"].map((step, i, arr) => {
                            const stepOrder = { monitoring: 0, in_review: 1, approved: 2, distributed: 3 };
                            const currentOrder = stepOrder[settlement.status] ?? -1;
                            const isComplete = stepOrder[step] <= currentOrder;
                            const isCurrent = step === settlement.status;
                            const cfg = settlementStatusConfig[step];
                            return (
                              <React.Fragment key={step}>
                                <div className="flex items-center gap-1.5">
                                  <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors"
                                    style={{
                                      background: isCurrent ? cfg?.color : isComplete ? brand.blue : "#F1F5F9",
                                      opacity: isComplete && !isCurrent ? 0.5 : 1,
                                    }}
                                  >
                                    {isComplete ? (
                                      <CheckCircle2 size={14} className="text-white" />
                                    ) : (
                                      <Circle size={14} style={{ color: "#CBD5E1" }} />
                                    )}
                                  </div>
                                  <span
                                    className={`text-[11px] ${isCurrent ? "font-semibold" : isComplete ? "font-medium" : ""} hidden sm:inline`}
                                    style={{ color: isCurrent ? cfg?.color : isComplete ? brand.navy : "#94A3B8" }}
                                  >
                                    {cfg?.label[lang]}
                                  </span>
                                </div>
                                {i < arr.length - 1 && (
                                  <div
                                    className="flex-1 h-px mx-1"
                                    style={{ background: stepOrder[arr[i + 1]] <= currentOrder ? brand.blue : "#E2E8F0" }}
                                  />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>

                        {/* Settlement readiness summary */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold" style={{ color: brand.navy }}>
                              {(() => {
                                const passedChecks = sChecks.filter((sc) => sc.status === "approved" || sc.status === "verified").length;
                                const totalChecks = sChecks.length;
                                if (settlement.status === "distributed") return lang === "nl" ? "Afrekening afgerond" : "Settlement completed";
                                if (settlement.status === "approved") return lang === "nl" ? "Goedgekeurd — klaar voor distributie" : "Approved — ready for distribution";
                                if (totalChecks > 0 && passedChecks === totalChecks) return lang === "nl" ? "Alle controles geslaagd" : "All checks passed";
                                return lang === "nl" ? "Afrekening in voorbereiding" : "Settlement in preparation";
                              })()}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {fmt(totalActual)} {lang === "nl" ? "werkelijk" : "actual"}
                              <span className="mx-1.5 text-slate-300">·</span>
                              {fmt(totalBudget)} {lang === "nl" ? "voorschot" : "advance"}
                              <span className="mx-1.5 text-slate-300">·</span>
                              <span style={{ color: totalBudget - totalActual >= 0 ? brand.blue : brand.red }}>
                                {totalBudget - totalActual >= 0 ? "+" : ""}{fmt(totalBudget - totalActual)} {lang === "nl" ? "netto" : "net"}
                              </span>
                            </p>
                          </div>
                          {sChecks.length > 0 && (
                            <div className="flex items-center gap-4 text-xs">
                              <div className="text-center">
                                <span className="text-lg font-semibold tabular-nums" style={{ color: brand.blue }}>
                                  {sChecks.filter((sc) => sc.status === "approved" || sc.status === "verified").length}
                                </span>
                                <p className="text-[11px] text-slate-400 uppercase tracking-wider">
                                  {lang === "nl" ? "geslaagd" : "passed"}
                                </p>
                              </div>
                              {sChecks.filter((sc) => sc.status === "flagged").length > 0 && (
                                <div className="text-center">
                                  <span className="text-lg font-semibold tabular-nums" style={{ color: brand.red }}>
                                    {sChecks.filter((sc) => sc.status === "flagged").length}
                                  </span>
                                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">
                                    {lang === "nl" ? "gemarkeerd" : "flagged"}
                                  </p>
                                </div>
                              )}
                              {sChecks.filter((sc) => sc.status === "pending").length > 0 && (
                                <div className="text-center">
                                  <span className="text-lg font-semibold tabular-nums" style={{ color: brand.amber }}>
                                    {sChecks.filter((sc) => sc.status === "pending").length}
                                  </span>
                                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">
                                    {lang === "nl" ? "in afwachting" : "pending"}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    /* ═══ MONITORING MODE — Budget pace verdict ═══ */
                    <Card className="border-slate-200 bg-white overflow-hidden">
                      <CardContent className="px-5 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                              style={{
                                background: verdictStatus === "on_track" ? "#F8FAFC"
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
                  )}

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
                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-1 rounded text-[9px] font-medium bg-slate-50" style={{ color: "#64748B" }}>
                                                  <Gauge size={9} />
                                                  {lang === "nl" ? "meter" : "metered"}
                                                </span>
                                              )}
                                              {split.method === "meter_ratio" && (
                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-1 rounded text-[9px] font-medium bg-slate-50" style={{ color: "#64748B" }}>
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
                <div className="mt-4 space-y-2">
                  {(() => {
                    const visibleCategories = isFeatureEnabled("nonUtilityServices")
                      ? data.serviceCategories
                      : data.serviceCategories.filter((c) => c.id === "energy");

                    // Flat list: external services first, then internal
                    const visibleCatIds = new Set(visibleCategories.map((c) => c.id));
                    const allVisible = enrichedBs.filter((bs) => visibleCatIds.has(bs.service?.category));
                    const externalItems = allVisible.filter((bs) => kostenverdelerMap[bs.serviceId]);
                    const internalItems = allVisible.filter((bs) => !kostenverdelerMap[bs.serviceId]);
                    const flatList = [...externalItems, ...internalItems];

                    if (flatList.length === 0)
                      return (
                        <div className="px-4 py-8 text-center text-sm text-slate-400">
                          {t("noResults", lang)}
                        </div>
                      );

                    // Find the divider index: between last external and first internal
                    const dividerIndex = externalItems.length;

                    // Build external supplier label for divider
                    const kvSuppliers = [...new Set(externalItems.flatMap((bs) =>
                      (kostenverdelerMap[bs.serviceId] || []).map((k) => k.shortName)
                    ))];

                    return flatList.map((bs, idx) => {
                              const isExternal = !!kostenverdelerMap[bs.serviceId];
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
                              return (
                              <React.Fragment key={bs.id}>
                                {/* iOS-style inline section divider */}
                                {idx === 0 && dividerIndex > 0 && (
                                  <div className="flex items-center gap-2 pt-1 pb-1">
                                    <span className="text-[11px] font-medium text-slate-400 tracking-wide">
                                      {lang === "nl" ? "Extern" : "External"} · {kvSuppliers.join(", ")}
                                    </span>
                                    <div className="flex-1 h-px bg-slate-200" />
                                  </div>
                                )}
                                {idx === dividerIndex && dividerIndex > 0 && dividerIndex < flatList.length && (
                                  <div className="flex items-center gap-2 pt-3 pb-1">
                                    <span className="text-[11px] font-medium text-slate-400 tracking-wide">
                                      {lang === "nl" ? "Intern" : "Internal"}
                                    </span>
                                    <div className="flex-1 h-px bg-slate-200" />
                                  </div>
                                )}
                                <Card
                                  className={`bg-white transition-shadow border-slate-200 ${isExpanded ? "shadow-md ring-1 ring-slate-200" : "hover:shadow-md cursor-pointer"}`}
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
                                          {kostenverdelerMap[bs.serviceId] && (
                                            <span className="text-[11px] px-2 py-1 rounded-full font-medium text-slate-500 bg-slate-100">
                                              ⇄ {kostenverdelerMap[bs.serviceId].map(k => k.shortName).join(", ")}
                                            </span>
                                          )}
                                        </div>
                                        {/* Budget progress indicator */}
                                        {(() => {
                                          const pct = bs.budget > 0 ? Math.round((bs.actual / bs.budget) * 100) : 0;
                                          const barCol = overBudget ? "#DC2626" : "#64748B";
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
                                        {/* ── Budget progress (financial only) ── */}
                                        {(() => {
                                          const budgetPct = bs.budget > 0 ? Math.round((bs.actual / bs.budget) * 100) : 0;
                                          // Muted, professional bar colors — only slate/navy tones, red only for over-budget
                                          const barCol = overBudget ? "#DC2626" : "#64748B";

                                          return (
                                            <div>
                                              {/* Budget vs actual — clean, single-line */}
                                              <div className="flex items-center gap-2 mb-1.5">
                                                <div className="flex-1 h-[4px] rounded-full bg-slate-100 overflow-hidden relative">
                                                  <div className="h-full rounded-full" style={{ width: `${Math.min(budgetPct, 100)}%`, background: barCol }} />
                                                  {yearPct > 0 && yearPct < 100 && (
                                                    <div className="absolute top-[-1.5px] w-[1.5px] h-[7px] rounded-full bg-slate-300" style={{ left: `${yearPct}%` }} />
                                                  )}
                                                </div>
                                                <span className="text-[11px] text-slate-400 tabular-nums shrink-0">{budgetPct}%</span>
                                              </div>
                                              <div className="flex items-center justify-between text-[11px] text-slate-400">
                                                <span>{bs.ledgerEntries || 0} / {bs.expectedEntries || 12} {lang === "nl" ? "facturen" : "invoices"}</span>
                                                {overBudget && <span className="text-red-600 font-medium">{lang === "nl" ? "Over budget" : "Over budget"}</span>}
                                                {!overBudget && svcAheadOfPace && <span className="text-slate-500">{lang === "nl" ? "Voor op schema" : "Ahead of pace"}</span>}
                                              </div>
                                            </div>
                                          );
                                        })()}

                                        {/* Section B: Consumption cost estimate (metered services only) */}
                                        {bs.consumption?.mainMeterId && (() => {
                                          const c = bs.consumption;
                                          const linkedMeter = allMeters.find((m) => m.id === c.mainMeterId);
                                          const fmtNum = (n) => Math.round(n).toLocaleString("nl-NL");
                                          const consCostPct = (c.endCost || 0) > 0 ? Math.round(((c.ytdCost || 0) / c.endCost) * 100) : 0;
                                          const costDiffVsBudget = (c.endCost || 0) - bs.budget;
                                          const costDiffPct = bs.budget > 0 ? Math.round((costDiffVsBudget / bs.budget) * 100) : 0;
                                          return (
                                            <div className="rounded-lg border border-slate-100 bg-white p-3">
                                              <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-1.5">
                                                  <Gauge size={12} className="text-slate-400" />
                                                  <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                                                    {lang === "nl" ? "Verbruikskosten" : "Consumption cost"}
                                                  </span>
                                                </div>
                                                <button
                                                  className="text-[11px] font-medium flex items-center gap-1 hover:underline"
                                                  style={{ color: brand.blue }}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveTab("consumption");
                                                  }}
                                                >
                                                  <Flame size={11} />
                                                  {linkedMeter?.meterNumber || c.mainMeterNumber || c.mainMeterId}
                                                  <ArrowUpRight size={11} />
                                                </button>
                                              </div>
                                              <div className="grid grid-cols-2 gap-3 text-[11px] mb-2">
                                                <div>
                                                  <p className="text-slate-400 mb-0.5">{lang === "nl" ? "Huidige kosten" : "Current cost"}</p>
                                                  <p className="text-sm font-bold tabular-nums" style={{ color: brand.navy }}>{fmt(c.ytdCost || 0)}</p>
                                                </div>
                                                <div>
                                                  <p className="text-slate-400 mb-0.5">{lang === "nl" ? "Verwachte eindkosten" : "Expected end cost"}</p>
                                                  <p className="text-sm font-bold tabular-nums text-slate-500">{fmt(Math.round(c.endCost || 0))}</p>
                                                </div>
                                              </div>
                                              {/* Comparison with budget */}
                                              {bs.budget > 0 && (c.endCost || 0) > 0 && (
                                                <div className="flex items-center gap-2 text-[11px] mb-2 px-2 py-1.5 rounded bg-slate-50">
                                                  <span className="text-slate-400">{lang === "nl" ? "vs. budget" : "vs. budget"}</span>
                                                  <span className="font-medium tabular-nums text-slate-500">{fmt(bs.budget)}</span>
                                                  <span className="text-slate-300">→</span>
                                                  <span className={`font-semibold tabular-nums ${Math.abs(costDiffPct) > 10 ? (costDiffVsBudget > 0 ? "text-red-600" : "text-emerald-600") : "text-slate-500"}`}>
                                                    {costDiffVsBudget > 0 ? "+" : ""}{fmt(costDiffVsBudget)} ({costDiffPct > 0 ? "+" : ""}{costDiffPct}%)
                                                  </span>
                                                </div>
                                              )}
                                              {/* Physical consumption context */}
                                              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                                <span className="tabular-nums">{fmtNum(c.ytdConsumption)} / {fmtNum(c.endConsumption)} {c.unit}</span>
                                                {c.unitPrice > 0 && (
                                                  <>
                                                    <span className="w-px h-3 bg-slate-200" />
                                                    <span className="font-mono tabular-nums">€{c.unitPrice?.toFixed(2)}/{c.unit}</span>
                                                  </>
                                                )}
                                                {c.meterCount > 0 && (
                                                  <>
                                                    <span className="w-px h-3 bg-slate-200" />
                                                    <span>{c.meterCount} {lang === "nl" ? "submeters" : "sub-meters"}</span>
                                                  </>
                                                )}
                                                {c.tenantExceedingBudget > 0 && (
                                                  <span className="text-amber-600 font-medium">
                                                    · {c.tenantExceedingBudget} {lang === "nl" ? "boven voorschot" : "over advance"}
                                                  </span>
                                                )}
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
                                                const ccBarCol = ccOver ? "#DC2626" : "#64748B";
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
                              </React.Fragment>
                              );
                            });

                  })()}
                </div>
                )}
              </TabsContent>

              {/* ═══ CONSUMPTION TAB — Meter-centric physical view ═══ */}
              {isFeatureEnabled("consumptionControl") && (
              <TabsContent value="consumption">
                <div className="mt-4 space-y-3">
                  {(() => {
                    // Group by Main Meter (physical), not by service (bookkeeping)
                    const meterConsumption = mainMeters.map((meter) => {
                      // Find buildingServices linked to this meter via consumption.mainMeterId
                      const linkedBs = enrichedBs.filter(
                        (bs) => bs.consumption && bs.consumption.mainMeterId === meter.id
                      );
                      // Aggregate consumption from meter readings
                      const reading = meter.readings?.[year];
                      const ytdConsumption = reading?.consumption || linkedBs.reduce((s, bs) => s + (bs.consumption?.ytdConsumption || 0), 0);
                      const endConsumption = linkedBs.reduce((s, bs) => s + (bs.consumption?.endConsumption || 0), 0) || (ytdConsumption * (100 / Math.max(yearPct, 1)));
                      const ytdCost = reading?.cost || linkedBs.reduce((s, bs) => s + (bs.consumption?.ytdCost || 0), 0);
                      const endCost = linkedBs.reduce((s, bs) => s + (bs.consumption?.endCost || 0), 0) || ytdCost;
                      const unitPrice = linkedBs[0]?.consumption?.unitPrice || 0;

                      return { meter, linkedBs, ytdConsumption, endConsumption, ytdCost, endCost, unitPrice };
                    });

                    if (meterConsumption.length === 0) {
                      return (
                        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-4 py-10 text-center">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                            <Radio size={18} className="text-slate-400" />
                          </div>
                          <p className="text-sm font-medium text-slate-500">
                            {lang === "nl"
                              ? "Geen hoofdmeters geregistreerd"
                              : "No main meters registered"}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {lang === "nl"
                              ? "Verbruiksgegevens worden zichtbaar zodra meters zijn gekoppeld"
                              : "Consumption data will appear once meters are linked"}
                          </p>
                        </div>
                      );
                    }

                    const fmtNum = (n) => Math.round(n).toLocaleString("nl-NL");

                    const utilLabels = {
                      electricity: { icon: Zap, label: lang === "nl" ? "Elektriciteit" : "Electricity", color: "#F59E0B", bg: "#FEF3C7" },
                      heat: { icon: Flame, label: lang === "nl" ? "Warmte" : "Heat", color: "#EF4444", bg: "#FEE2E2" },
                      gas: { icon: Flame, label: "Gas", color: "#F97316", bg: "#FFF7ED" },
                      water: { icon: Droplets, label: "Water", color: "#3B82F6", bg: "#DBEAFE" },
                      "water-hot": { icon: Droplets, label: lang === "nl" ? "Warm water" : "Hot water", color: "#EC4899", bg: "#FCE7F3" },
                    };

                    return meterConsumption.map(({ meter, linkedBs, ytdConsumption, endConsumption, ytdCost, endCost, unitPrice }) => {
                      const consPct = endConsumption > 0 ? Math.round((ytdConsumption / endConsumption) * 100) : 0;
                      const consOver = consPct > 100;
                      const consAhead = consPct > yearPct + 10;
                      const barCol = consOver ? "#DC2626" : consAhead ? "#F59E0B" : brand.blue;
                      const util = utilLabels[meter.utility] || { icon: Gauge, label: meter.utility, color: "#64748B", bg: "#F1F5F9" };
                      const UtilIcon = util.icon;

                      return (
                        <div key={meter.id} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                          {/* Meter header — physical info */}
                          <div className="px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                                style={{ background: util.bg, color: util.color }}
                              >
                                <UtilIcon size={14} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold" style={{ color: brand.navy }}>{util.label}</span>
                                  <span className="text-[11px] text-slate-400 font-mono">{meter.meterNumber}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                                  {meter.ean && <span>EAN {meter.ean}</span>}
                                  {meter.provider && (
                                    <>
                                      {meter.ean && <span className="text-slate-200">·</span>}
                                      <span>{meter.provider}</span>
                                    </>
                                  )}
                                  {meter.latestDate && (
                                    <>
                                      <span className="text-slate-200">·</span>
                                      <span>{lang === "nl" ? "Laatste aflezing" : "Last reading"} {fmtDate(meter.latestDate)}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0 ml-2">
                              <p className="text-sm font-bold tabular-nums" style={{ color: brand.navy }}>
                                {fmtNum(ytdConsumption)} <span className="text-xs font-normal text-slate-400">{meter.unit}</span>
                              </p>
                              <p className="text-[11px] text-slate-400 tabular-nums">
                                {lang === "nl" ? "van" : "of"} {fmtNum(Math.round(endConsumption))} {lang === "nl" ? "verwacht" : "expected"}
                              </p>
                            </div>
                          </div>

                          {/* Consumption progress */}
                          <div className="px-4 pb-3 space-y-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <div className="flex-1 h-[5px] rounded-full bg-slate-100 overflow-hidden relative">
                                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(consPct, 100)}%`, background: barCol }} />
                                  {yearPct > 0 && yearPct < 100 && (
                                    <div className="absolute top-[-2px] w-[2px] h-[9px] rounded-full bg-slate-300" style={{ left: `${yearPct}%` }} />
                                  )}
                                </div>
                                <span className="text-[11px] font-semibold tabular-nums shrink-0" style={{ color: barCol }}>{consPct}%</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-3 text-slate-400">
                                  <span className="inline-flex items-center gap-1">
                                    <span className="font-medium text-slate-600 tabular-nums">{fmt(ytdCost)}</span>
                                    {lang === "nl" ? "kosten" : "cost"}
                                  </span>
                                  <span className="w-px h-3 bg-slate-200" />
                                  <span className="inline-flex items-center gap-1">
                                    <span className="tabular-nums">{fmt(Math.round(endCost))}</span>
                                    {lang === "nl" ? "verwacht" : "expected"}
                                  </span>
                                  {unitPrice > 0 && (
                                    <>
                                      <span className="w-px h-3 bg-slate-200" />
                                      <span className="font-mono tabular-nums">€{unitPrice.toFixed(2)}/{meter.unit}</span>
                                    </>
                                  )}
                                </div>
                                {consOver && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 font-semibold">
                                    {lang === "nl" ? "Boven verwachting" : "Above expected"}
                                  </span>
                                )}
                                {!consOver && consAhead && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">
                                    {lang === "nl" ? "Voor op schema" : "Ahead of pace"}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Linked services */}
                            {linkedBs.length > 0 && (
                              <div className="pt-2 border-t border-slate-100">
                                <div className="flex items-center gap-1.5 mb-2">
                                  <Link2 size={11} className="text-slate-300" />
                                  <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                                    {lang === "nl" ? "Gekoppelde diensten" : "Linked services"}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {linkedBs.map((bs) => {
                                    const share = bs.consumption?.allocationShare || 1;
                                    const allocCost = (bs.consumption?.endCost || 0);
                                    return (
                                      <div key={bs.id} className="flex items-center justify-between text-[11px] pl-4 py-0.5">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-slate-600">{bs.service?.name?.[lang] || bs.serviceCode}</span>
                                          {share < 1 && (
                                            <span className="text-slate-300 font-mono">({Math.round(share * 100)}%)</span>
                                          )}
                                        </div>
                                        <span className="text-slate-600 font-medium tabular-nums">{fmt(allocCost)}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}

                  {/* Year progress context */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2">
                    <div className="w-20 h-[3px] rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${yearPct}%`, background: brand.blue }} />
                    </div>
                    <span className="tabular-nums font-medium">{lang === "nl" ? "Jaar" : "Year"} {yearPct}%</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-400">{lang === "nl" ? "De staande streep toont de jaarpositie" : "Tick mark shows year position"}</span>
                  </div>
                </div>
              </TabsContent>
              )}

              {/* ═══ METERS TAB — Physical meter inventory ═══ */}
              {isFeatureEnabled("consumption") && <TabsContent value="meters">
                <div className="mt-4 space-y-4">
                  {/* Summary strip */}
                  {(() => {
                    const totalMain = mainMeters.length;
                    const totalSub = subMeters.length;
                    const overdueMain = mainMeters.filter((m) => {
                      const d = m.latestDate ? Math.floor((new Date() - new Date(m.latestDate)) / 86400000) : 999;
                      return d >= 90;
                    }).length;
                    const staleMain = mainMeters.filter((m) => {
                      const d = m.latestDate ? Math.floor((new Date() - new Date(m.latestDate)) / 86400000) : 999;
                      return d >= 30 && d < 90;
                    }).length;
                    const uniqueUtils = [...new Set(mainMeters.map((m) => m.utility))];

                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                          <p className="text-[11px] text-slate-400 font-medium">{lang === "nl" ? "Hoofdmeters" : "Main meters"}</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-lg font-bold tabular-nums" style={{ color: brand.navy }}>{totalMain}</p>
                            <div className="flex items-center gap-1">
                              {uniqueUtils.map((u) => {
                                const uCfg = utilityIcon[u] || {};
                                const UIcon = uCfg.icon || Gauge;
                                return <UIcon key={u} size={12} style={{ color: uCfg.color || "#94A3B8" }} />;
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                          <p className="text-[11px] text-slate-400 font-medium">{lang === "nl" ? "Submeters" : "Sub meters"}</p>
                          <p className="text-lg font-bold tabular-nums" style={{ color: brand.navy }}>{totalSub}</p>
                        </div>
                        <div className={`rounded-lg border px-3 py-2.5 ${overdueMain > 0 ? "border-red-200 bg-red-50/30" : "border-slate-200 bg-white"}`}>
                          <p className="text-[11px] text-slate-400 font-medium">{lang === "nl" ? "Achterstallig" : "Overdue"}</p>
                          <p className={`text-lg font-bold tabular-nums ${overdueMain > 0 ? "text-red-600" : "text-slate-400"}`}>{overdueMain}</p>
                        </div>
                        <div className={`rounded-lg border px-3 py-2.5 ${staleMain > 0 ? "border-amber-200 bg-amber-50/30" : "border-slate-200 bg-white"}`}>
                          <p className="text-[11px] text-slate-400 font-medium">{lang === "nl" ? "Verouderd" : "Stale"}</p>
                          <p className={`text-lg font-bold tabular-nums ${staleMain > 0 ? "text-amber-600" : "text-slate-400"}`}>{staleMain}</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Dismounted meter filter */}
                  {dismountedCount > 0 && (
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => setShowDismounted(!showDismounted)}
                        className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <span className={`w-3.5 h-3.5 rounded border transition-colors flex items-center justify-center ${showDismounted ? 'border-[#3EB1C8] bg-[#3EB1C8]' : 'border-slate-300'}`}>
                          {showDismounted && <CheckCircle2 size={10} className="text-white" />}
                        </span>
                        {lang === "nl" ? `Gedemonteerde meters tonen (${dismountedCount})` : `Show dismounted meters (${dismountedCount})`}
                      </button>
                    </div>
                  )}

                  {/* ── Main Meters ── */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {lang === "nl" ? "Hoofdmeters" : "Main Meters"}
                      </h3>
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-[11px] text-slate-400">{mainMeters.length}</span>
                    </div>
                    {mainMeters.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-4 py-10 text-center">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                          <Gauge size={18} className="text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">
                          {lang === "nl" ? "Geen hoofdmeters geregistreerd" : "No main meters registered"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {mainMeters.map((m) => {
                          const ui = utilityIcon[m.utility] || {};
                          const Icon = ui.icon || Gauge;
                          // Data quality: derive from latestDate recency
                          const daysSinceReading = m.latestDate ? Math.floor((new Date() - new Date(m.latestDate)) / 86400000) : 999;
                          const quality = daysSinceReading < 30 ? "good" : daysSinceReading < 90 ? "warning" : "overdue";
                          const qualityCfg = {
                            good: { color: "#16A34A", bg: "bg-emerald-50", label: lang === "nl" ? "Actueel" : "Up to date" },
                            warning: { color: "#F59E0B", bg: "bg-amber-50", label: lang === "nl" ? "Verouderd" : "Stale" },
                            overdue: { color: "#EF4444", bg: "bg-red-50", label: lang === "nl" ? "Achterstallig" : "Overdue" },
                          }[quality];

                          return (
                            <div key={m.id} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                              <div className="p-4">
                                {/* Row 1: Meter identity */}
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div
                                      className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                                      style={{ background: ui.bg || "#F1F5F9", color: ui.color || "#64748B" }}
                                    >
                                      <Icon size={15} />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold" style={{ color: brand.navy }}>{m.meterNumber}</p>
                                        <span className="text-[11px] text-slate-400">
                                          {t(m.utility, lang)} · {m.unit}
                                          {m.meterType && <> · {m.meterType}</>}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                                        {m.ean && <span>EAN <span className="font-mono text-slate-500">{m.ean}</span></span>}
                                        {m.provider && (
                                          <>
                                            {m.ean && <span className="w-px h-2.5 bg-slate-200" />}
                                            <span>{m.provider}</span>
                                          </>
                                        )}
                                        {m.vendorId && (
                                          <>
                                            <span className="w-px h-2.5 bg-slate-200" />
                                            <span className="font-mono">{m.vendorId}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 ml-2">
                                    {m.dismounted && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-400">
                                        {lang === "nl" ? "Gedemonteerd" : "Dismounted"}
                                      </span>
                                    )}
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${qualityCfg.bg}`} style={{ color: qualityCfg.color }}>
                                      {qualityCfg.label}
                                    </span>
                                  </div>
                                </div>

                                {/* Reading values */}
                                <div className="grid grid-cols-3 gap-3 px-3 py-2.5 rounded-lg border border-slate-100 bg-slate-50/50 ml-10">
                                  <div>
                                    <p className="text-[11px] text-slate-400 font-medium">{lang === "nl" ? "Meterstand" : "Reading"}</p>
                                    <p className="text-sm font-bold tabular-nums" style={{ color: brand.navy }}>
                                      {(m.lastReading || 0).toLocaleString("nl-NL")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[11px] text-slate-400 font-medium">{lang === "nl" ? "Verbruik" : "Consumption"}</p>
                                    <p className="text-sm font-bold tabular-nums" style={{ color: brand.navy }}>
                                      {(m.consumption || 0).toLocaleString("nl-NL")} <span className="text-xs font-normal text-slate-400">{m.unit}</span>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[11px] text-slate-400 font-medium">{lang === "nl" ? "Aflees­datum" : "Reading date"}</p>
                                    <p className="text-sm font-medium text-slate-600">{m.readingDate || "—"}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* ── Sub Meters — table format for scalability ── */}
                  {subMeters.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          {lang === "nl" ? "Submeters" : "Sub Meters"}
                        </h3>
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-[11px] text-slate-400">{subMeters.length}</span>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="w-5 px-2 py-2.5"></th>
                                <th className="text-left px-3 py-2.5 font-semibold text-slate-500 text-[11px]">{lang === "nl" ? "Meter" : "Meter"}</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-slate-500 text-[11px]">VHE</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-slate-500 text-[11px] hidden sm:table-cell">{lang === "nl" ? "Utiliteit" : "Utility"}</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-slate-500 text-[11px] hidden md:table-cell">{lang === "nl" ? "Type" : "Type"}</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-slate-500 text-[11px] hidden md:table-cell">{lang === "nl" ? "Leverancier" : "Supplier"}</th>
                                <th className="text-right px-3 py-2.5 font-semibold text-slate-500 text-[11px]">{lang === "nl" ? "Verbruik" : "Consumption"}</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-slate-500 text-[11px] hidden sm:table-cell">{lang === "nl" ? "Aflezing" : "Reading"}</th>
                                <th className="text-center px-3 py-2.5 font-semibold text-slate-500 text-[11px] hidden lg:table-cell">{lang === "nl" ? "Status" : "Status"}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {(() => {
                                const SUB_LIMIT = 50;
                                const [showAllSubs, setShowAll] = [subMeters.length <= SUB_LIMIT, null]; // Show all if under limit
                                const visibleSubs = subMeters.slice(0, showAllSubs ? subMeters.length : SUB_LIMIT);
                                return visibleSubs.map((m) => {
                                  const vhe = m.vheId ? getVhe(m.vheId) : null;
                                  const daysSince = m.latestDate ? Math.floor((new Date() - new Date(m.latestDate)) / 86400000) : 999;
                                  const qCfg = daysSince < 30
                                    ? { color: "#16A34A", bg: "bg-emerald-50", label: "OK" }
                                    : daysSince < 90
                                    ? { color: "#F59E0B", bg: "bg-amber-50", label: lang === "nl" ? "Verouderd" : "Stale" }
                                    : { color: "#EF4444", bg: "bg-red-50", label: lang === "nl" ? "Achterstallig" : "Overdue" };
                                  const subUi = utilityIcon[m.utility] || {};
                                  const SubIcon = subUi.icon || Gauge;
                                  return (
                                    <tr key={m.id} className="hover:bg-slate-50/50">
                                      <td className="px-2 py-2.5">
                                        <SubIcon size={12} style={{ color: subUi.color || "#94A3B8" }} />
                                      </td>
                                      <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: brand.navy }}>{m.meterNumber}</td>
                                      <td className="px-3 py-2.5 text-slate-600 text-[11px] max-w-[160px] truncate font-medium">
                                        {vhe ? `${vhe.unit} · ${vhe.address}` : (m.vheId || "—")}
                                      </td>
                                      <td className="px-3 py-2.5 text-slate-500 text-[11px] hidden sm:table-cell">{t(m.utility, lang)}</td>
                                      <td className="px-3 py-2.5 text-slate-500 text-[11px] font-mono hidden md:table-cell">{m.meterType || "—"}</td>
                                      <td className="px-3 py-2.5 text-slate-500 text-[11px] hidden md:table-cell">{m.provider || "—"}</td>
                                      <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-[11px]" style={{ color: brand.navy }}>
                                        {(m.consumption || 0).toLocaleString("nl-NL")} <span className="text-slate-400 font-normal">{m.unit}</span>
                                      </td>
                                      <td className="px-3 py-2.5 text-slate-500 text-[11px] hidden sm:table-cell">{m.readingDate || "—"}</td>
                                      <td className="px-3 py-2.5 hidden lg:table-cell text-center">
                                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${qCfg.bg}`} style={{ color: qCfg.color }}>{qCfg.label}</span>
                                      </td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                        {subMeters.length > 50 && (
                          <div className="px-3 py-2.5 border-t border-slate-100 text-center bg-slate-50/50">
                            <span className="text-[11px] text-slate-500 font-medium">
                              {lang === "nl" ? `Eerste 50 van ${subMeters.length} submeters getoond` : `Showing first 50 of ${subMeters.length} sub meters`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>}

              {/* ═══ VHE TAB — Enhanced table with sort/filter ═══ */}
              <TabsContent value="vhe">
                {(() => {
                  // Get active heating season for "Since" column
                  const activeSeason = heatingSeasons?.find((hs) => hs.yearKey === year);
                  const seasonStart = activeSeason?.seasonStart;

                  // Compute derived fields for each VHE
                  const enrichedVheList = vheList.map((vhe) => {
                    // Contract status
                    const contractStatus = vhe.contract?.status === "active" ? "Active"
                      : vhe.contract?.status === "ended" ? "Ended"
                      : "Vacant";

                    // Since: effective start date in this heating season
                    let since = null;
                    if (vhe.contract?.startDate) {
                      since = seasonStart && vhe.contract.startDate < seasonStart
                        ? seasonStart
                        : vhe.contract.startDate;
                    }

                    // Expected: sum of building-service endCostPerVhe for services this VHE participates in
                    const expected = vhe.suggestedBreakdown
                      ? vhe.suggestedBreakdown.reduce((s, item) => {
                          // Find the BS to get endCostPerVhe
                          const bs = enrichedBs.find((b) => b.serviceId === item.s);
                          return s + (bs?.consumption?.endCostPerVhe || 0);
                        }, 0)
                      : 0;

                    // Advance (monthly)
                    const advance = vhe.voorschot || 0;

                    // Suggested (monthly)
                    const suggested = vhe.suggestedTotal || advance;

                    // Diff
                    const diff = Math.round((suggested - advance) * 100) / 100;

                    return { ...vhe, contractStatus, since, expected, advance, suggested, diff };
                  });

                  // Filter
                  let filtered = enrichedVheList;
                  if (vheContractFilter !== "all") {
                    filtered = filtered.filter((v) => v.contractStatus.toLowerCase() === vheContractFilter);
                  }
                  if (vheSearch.trim()) {
                    const q = vheSearch.toLowerCase();
                    filtered = filtered.filter((v) => v.address?.toLowerCase().includes(q) || v.unit?.toLowerCase().includes(q));
                  }

                  // Sort
                  const sortedVhes = [...filtered].sort((a, b) => {
                    const dir = vheSortDir === "asc" ? 1 : -1;
                    switch (vheSortField) {
                      case "unit": return dir * String(a.unit).localeCompare(String(b.unit), "nl", { numeric: true });
                      case "address": return dir * (a.address || "").localeCompare(b.address || "");
                      case "m2": return dir * ((a.m2 || 0) - (b.m2 || 0));
                      case "contract": return dir * a.contractStatus.localeCompare(b.contractStatus);
                      case "advance": return dir * (a.advance - b.advance);
                      case "suggested": return dir * (a.suggested - b.suggested);
                      case "diff": return dir * (a.diff - b.diff);
                      default: return 0;
                    }
                  });

                  const toggleSort = (field) => {
                    if (vheSortField === field) setVheSortDir(vheSortDir === "asc" ? "desc" : "asc");
                    else { setVheSortField(field); setVheSortDir("asc"); }
                  };

                  const SortHeader = ({ field, children, align }) => (
                    <th
                      className={`px-3 py-2 font-semibold text-slate-500 text-[11px] cursor-pointer hover:text-slate-700 select-none ${align === "right" ? "text-right" : "text-left"}`}
                      onClick={() => toggleSort(field)}
                    >
                      <span className="inline-flex items-center gap-0.5">
                        {children}
                        {vheSortField === field && (
                          <ArrowUpDown size={10} className="text-slate-400" />
                        )}
                      </span>
                    </th>
                  );

                  const activeCount = enrichedVheList.filter((v) => v.contractStatus === "Active").length;
                  const endedCount = enrichedVheList.filter((v) => v.contractStatus === "Ended").length;
                  const vacantCount = enrichedVheList.filter((v) => v.contractStatus === "Vacant").length;

                  // Summary stats
                  const totalAdvance = enrichedVheList.reduce((s, v) => s + (v.advance || 0), 0);
                  const totalSuggested = enrichedVheList.reduce((s, v) => s + (v.suggested || 0), 0);
                  const totalDiff = totalSuggested - totalAdvance;
                  const needsAdjustment = enrichedVheList.filter((v) => Math.abs(v.diff) > 5).length;

                  return (
                    <>
                      {/* Summary strip */}
                      <div className="mt-4 mb-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                          <p className="text-[11px] text-slate-400 font-medium">{lang === "nl" ? "Eenheden" : "Units"}</p>
                          <p className="text-lg font-bold tabular-nums" style={{ color: brand.navy }}>{enrichedVheList.length}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                          <p className="text-[11px] text-slate-400 font-medium">{lang === "nl" ? "Voorschot / mnd" : "Advance / mo"}</p>
                          <p className="text-lg font-bold tabular-nums" style={{ color: brand.navy }}>{fmt(totalAdvance)}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                          <p className="text-[11px] text-slate-400 font-medium">{lang === "nl" ? "Advies / mnd" : "Suggested / mo"}</p>
                          <p className="text-lg font-bold tabular-nums text-slate-500">{fmt(totalSuggested)}</p>
                        </div>
                        <div className={`rounded-lg border px-3 py-2.5 ${Math.abs(totalDiff) > 50 ? "border-red-200 bg-red-50/30" : "border-slate-200 bg-white"}`}>
                          <p className="text-[11px] text-slate-400 font-medium">{lang === "nl" ? "Aanpassing nodig" : "Needs adjustment"}</p>
                          <div className="flex items-baseline gap-2">
                            <p className={`text-lg font-bold tabular-nums ${totalDiff > 5 ? "text-red-600" : totalDiff < -5 ? "text-emerald-600" : "text-slate-400"}`}>
                              {totalDiff > 0 ? "+" : ""}{fmt(totalDiff)}
                            </p>
                            {needsAdjustment > 0 && (
                              <span className="text-[11px] text-slate-400">{needsAdjustment} {lang === "nl" ? "eenheden" : "units"}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Toolbar: search + filter */}
                      <div className="mb-3 flex items-center gap-2 flex-wrap">
                        <div className="relative flex-1 min-w-[160px] max-w-xs">
                          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input
                            type="text"
                            value={vheSearch}
                            onChange={(e) => setVheSearch(e.target.value)}
                            placeholder={lang === "nl" ? "Zoek adres of eenheid..." : "Search address or unit..."}
                            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#3EB1C8]/30 focus:border-[#3EB1C8]"
                          />
                        </div>
                        <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5">
                          {[
                            { key: "all", label: `${lang === "nl" ? "Alle" : "All"} (${enrichedVheList.length})` },
                            { key: "active", label: `${lang === "nl" ? "Actief" : "Active"} (${activeCount})` },
                            { key: "ended", label: `${lang === "nl" ? "Beëindigd" : "Ended"} (${endedCount})` },
                            { key: "vacant", label: `${lang === "nl" ? "Leeg" : "Vacant"} (${vacantCount})` },
                          ].map((f) => (
                            <button
                              key={f.key}
                              onClick={() => setVheContractFilter(f.key)}
                              className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                                vheContractFilter === f.key
                                  ? "bg-[#3EB1C8]/10 text-[#3EB1C8] font-semibold"
                                  : "text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {sortedVhes.length === 0 ? (
                        <div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-400">
                          {t("noResults", lang)}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100">
                                  <th className="w-6 px-2 py-2"></th>
                                  <SortHeader field="unit">{t("unit", lang)}</SortHeader>
                                  <SortHeader field="address">{lang === "nl" ? "Adres" : "Address"}</SortHeader>
                                  <SortHeader field="m2">m²</SortHeader>
                                  <SortHeader field="contract">{lang === "nl" ? "Contract" : "Contract"}</SortHeader>
                                  <th className="text-left px-3 py-2 font-semibold text-slate-500 text-[11px] hidden lg:table-cell">{lang === "nl" ? "Sinds" : "Since"}</th>
                                  <SortHeader field="advance" align="right">{lang === "nl" ? "Voorschot" : "Advance"}</SortHeader>
                                  <SortHeader field="suggested" align="right">{lang === "nl" ? "Advies" : "Suggested"}</SortHeader>
                                  <SortHeader field="diff" align="right">{lang === "nl" ? "Verschil" : "Diff"}</SortHeader>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {sortedVhes.map((vhe) => {
                                  const isExp = expandedVhe === vhe.id;
                                  const contractCfg = {
                                    Active: { bg: "bg-emerald-50", text: "text-emerald-700", label: lang === "nl" ? "Actief" : "Active" },
                                    Ended: { bg: "bg-slate-100", text: "text-slate-500", label: lang === "nl" ? "Beëindigd" : "Ended" },
                                    Vacant: { bg: "bg-amber-50", text: "text-amber-700", label: lang === "nl" ? "Leeg" : "Vacant" },
                                  }[vhe.contractStatus] || { bg: "bg-slate-100", text: "text-slate-500", label: vhe.contractStatus };
                                  const diffColor = vhe.diff > 5 ? "text-red-600" : vhe.diff < -5 ? "text-emerald-600" : "text-slate-400";
                                  const diffBg = Math.abs(vhe.diff) > 5 ? (vhe.diff > 5 ? "bg-red-50" : "bg-emerald-50") : "";

                                  return (
                                    <React.Fragment key={vhe.id}>
                                      <tr
                                        className={`cursor-pointer transition-colors ${isExp ? "bg-slate-50" : "hover:bg-slate-50/50"}`}
                                        onClick={() => setExpandedVhe(isExp ? null : vhe.id)}
                                      >
                                        <td className="px-2 py-2.5">
                                          <ChevronRight
                                            size={12}
                                            className={`text-slate-400 transition-transform duration-150 ${isExp ? "rotate-90" : ""}`}
                                          />
                                        </td>
                                        <td className="px-3 py-2.5 text-slate-600 font-mono tabular-nums">{vhe.unit}</td>
                                        <td className="px-3 py-2.5 font-medium max-w-[180px] truncate" style={{ color: brand.navy }}>{vhe.address}</td>
                                        <td className="px-3 py-2.5 text-slate-500 tabular-nums">{vhe.m2 || "—"}</td>
                                        <td className="px-3 py-2.5">
                                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${contractCfg.bg} ${contractCfg.text}`}>
                                            {contractCfg.label}
                                          </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-slate-500 text-[11px] hidden lg:table-cell">
                                          {vhe.since ? fmtDate(vhe.since) : "—"}
                                        </td>
                                        <td className="px-3 py-2.5 text-right font-semibold tabular-nums" style={{ color: brand.navy }}>{fmt(vhe.advance)}</td>
                                        <td className="px-3 py-2.5 text-right tabular-nums text-slate-500">{fmt(vhe.suggested)}</td>
                                        <td className={`px-3 py-2.5 text-right font-semibold tabular-nums ${diffColor}`}>
                                          <span className={`inline-flex px-1.5 py-0.5 rounded ${diffBg}`}>
                                            {vhe.diff > 0 ? "+" : ""}{fmt(vhe.diff)}
                                          </span>
                                        </td>
                                      </tr>
                                      {isExp && (
                                        <tr>
                                          <td colSpan={9} className="p-0">
                                            <div className="px-5 py-3 bg-white border-t border-slate-100">
                                              {/* Per-service breakdown */}
                                              {vhe.suggestedBreakdown?.length > 0 ? (
                                                <div>
                                                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                                    {lang === "nl" ? "Voorschot per dienst" : "Advance per service"}
                                                  </h4>
                                                  <div className="rounded-lg border border-slate-100 overflow-hidden">
                                                    <table className="w-full text-[11px]">
                                                      <thead>
                                                        <tr className="bg-slate-50/80 border-b border-slate-100">
                                                          <th className="text-left px-3 py-1.5 text-slate-400 font-semibold">{lang === "nl" ? "Dienst" : "Service"}</th>
                                                          <th className="text-right px-3 py-1.5 text-slate-400 font-semibold">{lang === "nl" ? "Huidig" : "Current"}</th>
                                                          <th className="text-right px-3 py-1.5 text-slate-400 font-semibold">{lang === "nl" ? "Advies" : "Suggested"}</th>
                                                          <th className="text-right px-3 py-1.5 text-slate-400 font-semibold">{lang === "nl" ? "Verschil" : "Diff"}</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody className="divide-y divide-slate-50">
                                                        {vhe.suggestedBreakdown.map((item) => {
                                                          const svc = getService(item.s);
                                                          const itemDiffColor = item.diff > 2 ? "text-red-600" : item.diff < -2 ? "text-emerald-600" : "text-slate-400";
                                                          return (
                                                            <tr key={item.s} className="hover:bg-slate-50/50">
                                                              <td className="px-3 py-1.5 text-slate-600 font-medium">
                                                                {svc?.name?.[lang] || item.s}
                                                              </td>
                                                              <td className="px-3 py-1.5 text-right tabular-nums font-medium" style={{ color: brand.navy }}>{fmtEur2(item.current)}</td>
                                                              <td className="px-3 py-1.5 text-right tabular-nums text-slate-500">{fmtEur2(item.suggested)}</td>
                                                              <td className={`px-3 py-1.5 text-right tabular-nums font-semibold ${itemDiffColor}`}>
                                                                {item.diff > 0 ? "+" : ""}{fmtEur2(item.diff)}
                                                              </td>
                                                            </tr>
                                                          );
                                                        })}
                                                      </tbody>
                                                      <tfoot>
                                                        <tr className="border-t border-slate-200 bg-slate-50/80">
                                                          <td className="px-3 py-2 font-bold text-slate-700">{lang === "nl" ? "Totaal" : "Total"}</td>
                                                          <td className="px-3 py-2 text-right font-bold tabular-nums" style={{ color: brand.navy }}>{fmtEur2(vhe.advance)}</td>
                                                          <td className="px-3 py-2 text-right font-bold tabular-nums text-slate-500">{fmtEur2(vhe.suggested)}</td>
                                                          <td className={`px-3 py-2 text-right font-bold tabular-nums ${diffColor}`}>
                                                            {vhe.diff > 0 ? "+" : ""}{fmtEur2(vhe.diff)}
                                                          </td>
                                                        </tr>
                                                      </tfoot>
                                                    </table>
                                                  </div>
                                                </div>
                                              ) : vhe.voorschotBreakdown?.length > 0 ? (
                                                <div>
                                                  <h4 className="text-[11px] font-semibold text-slate-500 mb-2">
                                                    {lang === "nl" ? "Voorschot per dienst" : "Advance per service"}
                                                  </h4>
                                                  <div className="rounded-lg border border-slate-100 bg-white divide-y divide-slate-50">
                                                    {vhe.voorschotBreakdown.map((item) => {
                                                      const svc = getService(item.s);
                                                      return (
                                                        <div key={item.s} className="flex items-center justify-between px-3 py-1.5">
                                                          <span className="text-[11px] text-slate-600">{svc?.name?.[lang] || item.s}</span>
                                                          <span className="text-[11px] font-medium text-slate-700 tabular-nums">{fmtEur2(item.a)}</span>
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              ) : (
                                                <p className="text-[11px] text-slate-400">{lang === "nl" ? "Geen voorschot gegevens" : "No advance data available"}</p>
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
                                <tr className="bg-slate-50 border-t-2 border-slate-200">
                                  <td colSpan={6} className="px-3 py-2.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                    {filtered.length === enrichedVheList.length
                                      ? `${lang === "nl" ? "Totaal" : "Total"} (${enrichedVheList.length})`
                                      : `${filtered.length} / ${enrichedVheList.length} ${lang === "nl" ? "eenheden" : "units"}`
                                    }
                                  </td>
                                  <td className="px-3 py-2.5 text-right text-xs font-bold tabular-nums" style={{ color: brand.navy }}>
                                    {fmt(sortedVhes.reduce((s, v) => s + (v.advance || 0), 0))}
                                  </td>
                                  <td className="px-3 py-2.5 text-right text-xs font-bold tabular-nums text-slate-500">
                                    {fmt(sortedVhes.reduce((s, v) => s + (v.suggested || 0), 0))}
                                  </td>
                                  <td className="px-3 py-2.5 text-right text-xs font-bold tabular-nums">
                                    {(() => {
                                      const fDiff = sortedVhes.reduce((s, v) => s + (v.diff || 0), 0);
                                      return <span className={fDiff > 5 ? "text-red-600" : fDiff < -5 ? "text-emerald-600" : "text-slate-500"}>{fDiff > 0 ? "+" : ""}{fmt(fDiff)}</span>;
                                    })()}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
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
