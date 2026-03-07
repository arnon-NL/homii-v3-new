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
  Circle,
  HelpCircle,
  FileCheck,
  Send,
  ShieldCheck,
  Flag,
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
  serviceCategories,
  getLedgerSummaryByBuilding,
  getLedgerGroupedByCostCategory,
  meters,
  getCostCategoriesByService,
  isFeatureEnabled,
} from "@/lib/mockData";
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
  water: { icon: Droplets, color: "#64748B" },
  electricity: { icon: Zap, color: "#64748B" },
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
  distributed:  { icon: Send,          color: "#94A3B8", bg: "#F8FAFC", label: { en: "Distributed",  nl: "Afgerekend" } },
};

/* ── Settlement check icon ── */
function CheckIcon({ passed, label }) {
  return (
    <div className="flex items-center gap-2" title={label}>
      {passed ? (
        <CheckCircle2 size={14} className="text-green-500" />
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
  verified: { icon: ShieldCheck,  color: "#94A3B8", bg: "#F8FAFC", label: { en: "Verified",  nl: "Geverifieerd" } },
  flagged:  { icon: Flag,         color: "#EF4444", bg: "#FEF2F2", label: { en: "Flagged",   nl: "Gemarkeerd" } },
  pending:  { icon: Clock,        color: "#94A3B8", bg: "#F8FAFC", label: { en: "Pending",   nl: "In afwachting" } },
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
function YearSelector({ year, setYear }) {
  const years = [2024, 2025, 2026];
  return (
    <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5">
      {years.map((y) => (
        <button
          key={y}
          onClick={() => setYear(y)}
          className={`px-3 h-7 rounded-lg text-xs font-medium tabular-nums transition-colors ${
            year === y
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {y}
        </button>
      ))}
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
  const [year, setYear] = useState(2025);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedVhe, setExpandedVhe] = useState(null);
  const [expandedService, setExpandedService] = useState(null);
  const [expandedCostCats, setExpandedCostCats] = useState({});  // { [ccId]: true }
  const toggleCostCat = (ccId) => setExpandedCostCats((prev) => ({ ...prev, [ccId]: !prev[ccId] }));

  const building = getBuilding(buildingId);

  const isPastYear = year < new Date().getFullYear();

  // Related data
  const bsRelations = useMemo(
    () => getBuildingServices(buildingId, year),
    [buildingId, year]
  );
  const vheList = useMemo(() => getVhesByBuilding(buildingId), [buildingId]);
  const meterList = useMemo(
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
    { label: t("buildings", lang), to: "/buildings" },
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
                <StatusBadge status={building.dataQuality} />
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
          <YearSelector year={year} setYear={setYear} />
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

                  // 2. Flagged ledger entries
                  const totalFlaggedEntries = Object.entries(ledgerByService).reduce((sum, [, l]) => sum + (l.flagged || 0), 0);
                  const totalPendingEntries = Object.entries(ledgerByService).reduce((sum, [, l]) => sum + (l.pending || 0), 0);
                  if (totalFlaggedEntries > 0) {
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
                  if (totalPendingEntries > 0) {
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

                  // 5. Settlement check failures (past year)
                  if (isPastYear && sChecks.length > 0) {
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
                  {/* Settlement banner (past year only) */}
                  {isPastYear && settlement && (
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

                  {/* ── Layer 1: Verdict Card ── */}
                  <Card className="border-slate-200 bg-white overflow-hidden">
                    <div
                      className="h-1"
                      style={{
                        background: verdictStatus === "on_track" ? brand.blue
                          : verdictStatus === "review" ? brand.amber
                          : brand.red,
                      }}
                    />
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
                                    className="text-[11px] font-medium shrink-0 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors"
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
                            <div key={act.id} className="flex items-start gap-3 px-4 py-2.5">
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
                <div className="mt-4 space-y-4">
                  {(() => {
                    const visibleCategories = isFeatureEnabled("nonUtilityServices")
                      ? serviceCategories
                      : serviceCategories.filter((c) => c.id === "energy");
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
                                      <div
                                        className="w-1.5 h-8 rounded-full shrink-0"
                                        style={{ background: rowStatusColor }}
                                      />
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
                                                      className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                                                      onClick={() => toggleCostCat(cc.id)}
                                                    >
                                                      {isCcExpanded
                                                        ? <ChevronDown size={12} className="text-slate-400 shrink-0" />
                                                        : <ChevronRight size={12} className="text-slate-400 shrink-0" />
                                                      }
                                                      <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                          <span className="text-[11px] font-medium text-slate-700">{cc.name[lang] || cc.name.en}</span>
                                                          {cc.supplier && (
                                                            <span className="text-[11px] text-slate-400 truncate hidden sm:inline">· {cc.supplier}</span>
                                                          )}
                                                          {ccFlagged > 0 && (
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 font-medium" style={{ color: brand.red }}>
                                                              {ccFlagged} ⚑
                                                            </span>
                                                          )}
                                                        </div>
                                                        {/* Mini progress bar */}
                                                        <div className="flex items-center gap-1.5 mt-1 max-w-[120px]">
                                                          <div className="flex-1 h-[2px] rounded-full bg-slate-100 overflow-hidden">
                                                            <div className="h-full rounded-full" style={{ width: `${Math.min(ccPct, 100)}%`, background: ccBarCol }} />
                                                          </div>
                                                          <span className="text-[10px] text-slate-400 tabular-nums">{ccPct}%</span>
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
                                                          <p className="text-[10px] text-slate-400 italic px-3 pl-8 py-1.5">
                                                            + {ccEntries.length - 8} {lang === "nl" ? "meer" : "more"}
                                                          </p>
                                                        )}
                                                      </div>
                                                    )}
                                                    {isCcExpanded && ccEntries.length === 0 && (
                                                      <div className="border-t border-slate-100 bg-slate-50/30 px-3 pl-8 py-2">
                                                        <p className="text-[10px] text-slate-400 italic">
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
                                            <div className="flex items-center gap-1.5 mb-2">
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
                                                <p className="text-[10px] text-amber-500 italic px-3 py-1.5">
                                                  + {unassignedEntries.length - 5} {lang === "nl" ? "meer" : "more"}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        )}

                                        {/* Footer: Distribution + cross-navigation */}
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                          <div className="text-[11px] text-slate-500">
                                            <span className="font-medium">{lang === "nl" ? "Verdeling" : "Distribution"}:</span>{" "}
                                            {bs.distMethod?.name[lang] || bs.distMethod?.name.en || "—"}
                                          </div>
                                          <button
                                            className="text-[11px] font-medium flex items-center gap-1 hover:underline"
                                            style={{ color: brand.blue }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              navigate(`/services/${bs.serviceId}`);
                                            }}
                                          >
                                            {lang === "nl" ? "Bekijk alle complexen" : "View all buildings"}
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
              </TabsContent>

              {/* ═══ METERS TAB (requires consumption feature) ═══ */}
              {isFeatureEnabled("consumption") && <TabsContent value="meters">
                <div className="mt-4 space-y-4">
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
                                  <span className={`text-[11px] font-medium whitespace-nowrap ml-2 ${isOverdue ? "text-amber-600" : "text-green-600"}`}>
                                    {isOverdue ? t("readingsOverdue", lang) : t("readingsUpToDate", lang)}
                                  </span>
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
                                  <span className="text-sm font-semibold tabular-nums" style={{ color: brand.navy }}>
                                    {(m.consumption || 0).toLocaleString("nl-NL")} {m.unit}
                                  </span>
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
                <div className="mt-4 space-y-3">
                  {vheList.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-400">
                      {t("noResults", lang)}
                    </div>
                  ) : (
                    vheList.map((vhe) => {
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
                                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                                  <AttributePanel>
                                    <AttrSection title={lang === "nl" ? "Details" : "Details"}>
                                      <AttrRow
                                        label={lang === "nl" ? "VHE ID" : "VHE ID"}
                                        value={vhe.id}
                                      />
                                      <AttrRow
                                        label={lang === "nl" ? "Oppervlakte" : "Area"}
                                        value={`${vhe.m2} m²`}
                                      />
                                      <AttrRow
                                        label={lang === "nl" ? "Status" : "Status"}
                                        value={vhe.status}
                                      />
                                    </AttrSection>
                                  </AttributePanel>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </React.Fragment>
                      );
                    })
                  )}
                </div>
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
                <AttrRow label={lang === "nl" ? "Complex ID" : "Complex ID"} value={building.complexId} />
                <AttrRow label={lang === "nl" ? "Locatie" : "Location"} value={building.location} />
                <AttrRow label={lang === "nl" ? "VHE" : "VHE"} value={building.vhe} />
                <AttrRow
                  label={lang === "nl" ? "Datakwaliteit" : "Data Quality"}
                  value={building.dataQuality}
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
