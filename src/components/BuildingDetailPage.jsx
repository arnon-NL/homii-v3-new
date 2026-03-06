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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Circle,
  FileCheck,
  Send,
  Ban,
  ShieldCheck,
  Flag,
  Lock,
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
  getLedgerByServiceAndBuilding,
  meters,
  getCostCategoriesByService,
  getMonthlyCloseGridForBuilding,
  costCategories,
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
  AttrLink,
} from "./ui/attribute-panel";
import { StatusBadge } from "./ui/status-badge";

/* ── Category icon + color config ── */
const categoryConfig = {
  energy:        { icon: Zap,        color: "#EF4444", bg: "#FEF2F2" },
  installations: { icon: Wrench,     color: "#8B5CF6", bg: "#F5F3FF" },
  cleaning:      { icon: Sparkles,   color: "#22C55E", bg: "#F0FDF4" },
  management:    { icon: HardHat,    color: "#F59E0B", bg: "#FFFBEB" },
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
  booked:  { color: brand.green, bg: "#F0FDF4", label: { en: "Booked", nl: "Geboekt" }, icon: CheckCircle2 },
  pending: { color: brand.amber, bg: "#FFFBEB", label: { en: "Pending", nl: "In afwachting" }, icon: Clock },
  flagged: { color: brand.red,   bg: "#FEF2F2", label: { en: "Flagged", nl: "Gemarkeerd" }, icon: AlertTriangle },
};

function LedgerStatusBadge({ status, lang }) {
  const cfg = ledgerStatusCfg[status];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon size={10} />
      {cfg.label[lang]}
    </span>
  );
}

/* ── Mini monthly bar chart ── */
function MonthlyBarChart({ entries, budgetPerMonth }) {
  const monthTotals = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return entries
      .filter((e) => e.month === month)
      .reduce((sum, e) => sum + e.amount, 0);
  });
  const maxVal = Math.max(...monthTotals, budgetPerMonth || 1);
  const monthLabels = ["J","F","M","A","M","J","J","A","S","O","N","D"];

  return (
    <div className="flex items-end gap-1 h-[48px]">
      {monthTotals.map((val, i) => {
        const h = maxVal > 0 ? (val / maxVal) * 44 : 0;
        const overBudget = budgetPerMonth && val > budgetPerMonth * 1.15;
        return (
          <div key={i} className="flex flex-col items-center gap-0.5" style={{ width: 18 }}>
            <div
              className="w-3 rounded-sm transition-all"
              style={{
                height: Math.max(2, h),
                background: overBudget ? brand.red : val > 0 ? brand.blue : "#E2E8F0",
              }}
            />
            <span className="text-[8px] text-slate-400">{monthLabels[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Completeness bar ── */
function CompletenessBar({ pct }) {
  const color =
    pct >= 100 ? brand.green : pct >= 75 ? brand.amber : brand.red;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[80px]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(pct, 100)}%`, background: color }}
        />
      </div>
      <span className="text-[11px] tabular-nums font-medium" style={{ color }}>
        {pct}%
      </span>
    </div>
  );
}

/* ── Utility icon ── */
const utilityIcon = {
  heat: { icon: Flame, color: "#EF4444" },
  water: { icon: Droplets, color: "#3B82F6" },
  electricity: { icon: Zap, color: "#8B5CF6" },
};

/* ── Activity icon ── */
const activityIcons = {
  meter_reading: { icon: Gauge, color: brand.blue },
  ledger_entry: { icon: FileText, color: brand.green },
  distribution: { icon: Activity, color: brand.amber },
  contract_change: { icon: Users, color: brand.midBlue },
  alert: { icon: AlertTriangle, color: brand.red },
};

/* ── Settlement status config ── */
const settlementStatusConfig = {
  not_started:  { icon: Circle,        color: "#94A3B8", bg: "#F8FAFC", label: { en: "Not started",  nl: "Niet gestart" } },
  monitoring:   { icon: Clock,         color: "#3B82F6", bg: "#EFF6FF", label: { en: "Monitoring",   nl: "Monitoring" } },
  in_review:    { icon: AlertTriangle, color: "#F59E0B", bg: "#FFFBEB", label: { en: "In review",    nl: "In controle" } },
  approved:     { icon: FileCheck,     color: "#22C55E", bg: "#F0FDF4", label: { en: "Approved",     nl: "Goedgekeurd" } },
  distributed:  { icon: Send,          color: "#8B5CF6", bg: "#F5F3FF", label: { en: "Distributed",  nl: "Afgerekend" } },
};

/* ── Settlement check icon ── */
function CheckIcon({ passed, label }) {
  return (
    <div className="flex items-center gap-1.5" title={label}>
      {passed ? (
        <CheckCircle2 size={13} className="text-green-500" />
      ) : passed === false ? (
        <AlertTriangle size={13} className="text-amber-500" />
      ) : (
        <Circle size={13} className="text-slate-300" />
      )}
      <span className={`text-[11px] ${passed ? "text-slate-600" : passed === false ? "text-amber-600 font-medium" : "text-slate-400"}`}>
        {label}
      </span>
    </div>
  );
}

/* ── Settlement check status badge ── */
const checkStatusConfig = {
  approved: { icon: CheckCircle2, color: "#22C55E", bg: "#F0FDF4", label: { en: "Approved",  nl: "Goedgekeurd" } },
  verified: { icon: ShieldCheck,  color: "#3B82F6", bg: "#EFF6FF", label: { en: "Verified",  nl: "Geverifieerd" } },
  flagged:  { icon: Flag,         color: "#EF4444", bg: "#FEF2F2", label: { en: "Flagged",   nl: "Gemarkeerd" } },
  pending:  { icon: Clock,        color: "#94A3B8", bg: "#F8FAFC", label: { en: "Pending",   nl: "In afwachting" } },
};

function CheckStatusBadge({ status, lang }) {
  const cfg = checkStatusConfig[status] || checkStatusConfig.pending;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon size={10} />
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
          className={`px-3 h-7 rounded-md text-xs font-medium tabular-nums transition-all ${
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

/* ── KPI Card ── */
function KpiCard({ label, value, sub, color, icon: Icon }) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          {Icon && (
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: (color || brand.blue) + "15" }}
            >
              <Icon size={13} style={{ color: color || brand.blue }} />
            </div>
          )}
        </div>
        <span
          className="text-2xl font-bold tabular-nums"
          style={{ color: color || brand.navy }}
        >
          {value}
        </span>
        {sub && (
          <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
        )}
      </CardContent>
    </Card>
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
  const [expandedVhe, setExpandedVhe] = useState(null);
  const [expandedService, setExpandedService] = useState(null);
  const [expandedBudgetService, setExpandedBudgetService] = useState(null);

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
  const monthlyCloseGrid = useMemo(
    () => getMonthlyCloseGridForBuilding(buildingId, year),
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
  const monthsClosed = monthlyCloseGrid
    .flatMap((row) => row.months)
    .filter((m) => m.status === "closed").length;
  const flaggedCount = enrichedBs.reduce((s, bs) => {
    const ledger = ledgerByService[bs.serviceId];
    return s + (ledger?.flagged || 0);
  }, 0);

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
                  <MapPin size={11} /> {building.location}
                </span>
                <span className="w-px h-3 bg-slate-200" />
                <span className="flex items-center gap-1">
                  <Hash size={11} /> {building.complexId}
                </span>
                <span className="w-px h-3 bg-slate-200" />
                <span className="flex items-center gap-1">
                  <Home size={11} /> {building.vhe} VHE
                </span>
              </div>
            </div>
          </div>
          <YearSelector year={year} setYear={setYear} />
        </div>

        {/* ── Content: tabs + attribute panel ── */}
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <Tabs defaultValue="overview">
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
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#3EB1C8] data-[state=active]:text-slate-900 data-[state=active]:shadow-none px-4 text-[13px] text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* ═══ OVERVIEW TAB — MONITORING COCKPIT ═══ */}
              <TabsContent value="overview">
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
                                  <SIcon size={18} style={{ color: sCfg?.color }} />
                                </div>
                              );
                            })()}
                            <div>
                              <p className="text-[13px] font-semibold" style={{ color: brand.navy }}>
                                {lang === "nl" ? "Afrekening" : "Settlement"} {year}
                              </p>
                              <p className="text-[12px] text-slate-500">
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
                                className="text-lg font-bold tabular-nums"
                                style={{ color: settlement.netResult >= 0 ? brand.green : brand.red }}
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

                  {/* Section 1: Year KPI Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <KpiCard
                      label={lang === "nl" ? "Totaal budget" : "Total budget"}
                      value={fmt(totalBudget)}
                      color={brand.blue}
                    />
                    <KpiCard
                      label={lang === "nl" ? "Werkelijk" : "Actual"}
                      value={fmt(totalActual)}
                      color={brand.navy}
                    />
                    <KpiCard
                      label={lang === "nl" ? "Verschil" : "Variance"}
                      value={fmt(variance)}
                      color={variance >= 0 ? brand.green : brand.red}
                      sub={variance >= 0 ? (lang === "nl" ? "Onder budget" : "Under budget") : (lang === "nl" ? "Over budget" : "Over budget")}
                    />
                    <KpiCard
                      label={lang === "nl" ? "Maanden" : "Months"}
                      value={`${monthsClosed}/12`}
                      color={brand.green}
                      sub={lang === "nl" ? "afgesloten" : "closed"}
                    />
                    <KpiCard
                      label={lang === "nl" ? "Vlaggen" : "Flags"}
                      value={flaggedCount}
                      color={flaggedCount > 0 ? brand.red : brand.muted}
                      sub={flaggedCount > 0 ? (lang === "nl" ? "vereist aandacht" : "needs attention") : (lang === "nl" ? "geen problemen" : "all clear")}
                    />
                  </div>

                  {/* Section 2: Monthly Closing Grid (requires ledger/monthlyClose) */}
                  {isFeatureEnabled("monthlyClose") && (
                  <Card className="border-slate-200 bg-white overflow-hidden">
                    <CardContent className="p-5">
                      <h3 className="text-[13px] font-semibold text-slate-600 mb-4">
                        {lang === "nl" ? "Maandelijkse afsluitingsstatus" : "Monthly Closing Status"}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="text-left px-3 py-2 font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-white z-10">
                                {lang === "nl" ? "Dienst" : "Service"}
                              </th>
                              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, idx) => (
                                <th key={idx} className="text-center px-2 py-2 font-semibold text-slate-500 uppercase tracking-wider w-8">
                                  {m}
                                </th>
                              ))}
                              <th className="text-center px-3 py-2 font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                {lang === "nl" ? "Totaal" : "Total"}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {monthlyCloseGrid.map((row, rowIdx) => {
                              const closedCount = row.months.filter((m) => m.status === "closed").length;
                              return (
                                <tr key={rowIdx} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                                  <td className="text-left px-3 py-2 font-medium text-slate-700 whitespace-nowrap sticky left-0 bg-white z-10">
                                    <div className="text-[11px]">{(() => { const svc = getService(row.serviceId); return svc ? svc.code : row.serviceId; })()}</div>
                                    <div className="text-[12px] font-semibold">{(() => { const svc = getService(row.serviceId); return svc ? (svc.name[lang] || svc.name.en) : row.serviceId; })()}</div>
                                  </td>
                                  {row.months.map((month, monthIdx) => {
                                    let dotColor = "#E2E8F0"; // future
                                    if (month.status === "closed") dotColor = brand.green;
                                    else if (month.status === "review") dotColor = brand.amber;
                                    else if (month.status === "open") dotColor = brand.red;

                                    return (
                                      <td key={monthIdx} className="text-center px-2 py-2">
                                        <div
                                          className="w-2.5 h-2.5 rounded-full mx-auto"
                                          style={{ background: dotColor }}
                                          title={month.status}
                                        />
                                      </td>
                                    );
                                  })}
                                  <td className="text-center px-3 py-2 font-semibold text-slate-700 whitespace-nowrap">
                                    <span className="text-[12px]">{closedCount}/12</span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                  )}

                  {/* Section 3: Budget vs Actual Summary Table (requires ledger) */}
                  {isFeatureEnabled("ledger") && (
                  <Card className="border-slate-200 bg-white overflow-hidden">
                    <CardContent className="p-5">
                      <h3 className="text-[13px] font-semibold text-slate-600 mb-4">
                        {lang === "nl" ? "Budget monitoring per dienst" : "Budget Monitoring per Service"}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80">
                              <th className="w-8 px-2 py-2" />
                              {[
                                { key: "code", align: "left" },
                                { key: "service", align: "left" },
                                { key: "budget", align: "right", label: lang === "nl" ? "Budget" : "Budget" },
                                { key: "actual", align: "right", label: lang === "nl" ? "Werkelijk" : "Actual" },
                                { key: "variance", align: "right", label: lang === "nl" ? "Verschil" : "Variance" },
                                { key: "status", align: "center", label: lang === "nl" ? "Status" : "Status" },
                              ].map((col) => (
                                <th
                                  key={col.key}
                                  className={`text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 sm:px-4 py-2 text-${col.align} whitespace-nowrap`}
                                >
                                  {col.label || t(col.key, lang)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {enrichedBs.map((bs) => {
                              const v = bs.budget - bs.actual;
                              const ledger = ledgerByService[bs.serviceId];
                              const isExpanded = expandedBudgetService === bs.serviceId;
                              const ledgerEntries = isExpanded
                                ? getLedgerByServiceAndBuilding(bs.serviceId, buildingId, year)
                                    .sort((a, b) => b.date.localeCompare(a.date))
                                : [];

                              // Determine status dot color
                              let statusColor = brand.green;
                              if (v < 0) statusColor = brand.red;
                              else if (v < (bs.budget * 0.1)) statusColor = brand.amber;

                              return (
                                <React.Fragment key={bs.id}>
                                  <tr
                                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                                    onClick={() =>
                                      setExpandedBudgetService(isExpanded ? null : bs.serviceId)
                                    }
                                  >
                                    <td className="px-2 py-2.5 w-8">
                                      <ChevronRight
                                        size={13}
                                        className={`text-slate-400 transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}
                                      />
                                    </td>
                                    <td className="px-3 sm:px-4 py-2.5 text-[11px] font-mono text-slate-500">
                                      {bs.service?.code || "—"}
                                    </td>
                                    <td className="px-3 sm:px-4 py-2.5 text-[12px] text-slate-700 font-medium">
                                      {bs.service?.name[lang] || bs.serviceId}
                                    </td>
                                    <td className="px-3 sm:px-4 py-2.5 text-right text-[12px] font-mono text-slate-700">
                                      {fmt(bs.budget)}
                                    </td>
                                    <td className="px-3 sm:px-4 py-2.5 text-right text-[12px] font-mono text-slate-700">
                                      {fmt(bs.actual)}
                                    </td>
                                    <td className="px-3 sm:px-4 py-2.5 text-right text-[12px] font-mono font-medium" style={{ color: statusColor }}>
                                      {v >= 0 ? "+" : ""}{fmt(v)}
                                    </td>
                                    <td className="px-3 sm:px-4 py-2.5 text-center">
                                      <div
                                        className="w-2.5 h-2.5 rounded-full mx-auto"
                                        style={{ background: statusColor }}
                                      />
                                    </td>
                                  </tr>
                                  {isExpanded && (
                                    <tr className="bg-slate-50/50">
                                      <td colSpan="7" className="px-3 sm:px-4 py-4">
                                        <div className="space-y-3">
                                          {/* Monthly bar chart */}
                                          <div>
                                            <p className="text-[11px] text-slate-500 font-medium mb-2 uppercase tracking-wider">
                                              {lang === "nl" ? "Maandelijks patroon" : "Monthly pattern"}
                                            </p>
                                            <MonthlyBarChart
                                              entries={ledgerEntries}
                                              budgetPerMonth={bs.budget / 12}
                                            />
                                          </div>

                                          {/* Ledger entries */}
                                          {ledgerEntries.length > 0 && (
                                            <div>
                                              <p className="text-[11px] text-slate-500 font-medium mb-2 uppercase tracking-wider">
                                                {lang === "nl" ? "Boeking" : "Entries"} ({ledgerEntries.length})
                                              </p>
                                              <div className="space-y-1">
                                                {ledgerEntries.slice(0, 5).map((entry) => (
                                                  <div key={entry.id} className="flex items-center justify-between text-[11px] px-2 py-1.5 rounded bg-white/60 border border-slate-100">
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                      <span className="text-slate-400">{fmtDate(entry.date)}</span>
                                                      <span className="text-slate-600 truncate">{typeof entry.description === "object" ? (entry.description[lang] || entry.description.en) : entry.description}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0 ml-2">
                                                      <span className="font-mono text-slate-700">{fmtEur2(entry.amount)}</span>
                                                      <LedgerStatusBadge status={entry.status} lang={lang} />
                                                    </div>
                                                  </div>
                                                ))}
                                                {ledgerEntries.length > 5 && (
                                                  <p className="text-[10px] text-slate-400 italic px-2 py-1">
                                                    {lang === "nl" ? "+" : "+"} {ledgerEntries.length - 5} {lang === "nl" ? "meer" : "more"}
                                                  </p>
                                                )}
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
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                  )}

                  {/* Section 4: Alerts Strip */}
                  {activityList.filter((a) => a.type === "alert").length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-[13px] font-semibold text-slate-600">
                        {lang === "nl" ? "Waarschuwingen" : "Alerts"}
                      </h3>
                      {activityList
                        .filter((a) => a.type === "alert")
                        .slice(0, 3)
                        .map((alert) => (
                          <div
                            key={alert.id}
                            className="flex items-start gap-3 px-4 py-3 rounded-lg border border-amber-200 bg-amber-50/50"
                          >
                            <AlertTriangle
                              size={14}
                              className="text-amber-500 mt-0.5 shrink-0"
                            />
                            <div>
                              <p className="text-[12px] text-slate-700">
                                {alert.description[lang] || alert.description.en}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {alert.date}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ═══ SERVICES TAB — CONFIGURATION ONLY ═══ */}
              <TabsContent value="services">
                <div className="mt-4 space-y-5">
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
                          <div className="flex items-center gap-2 mb-3">
                            <div
                              className="w-5 h-5 rounded flex items-center justify-center"
                              style={{ background: cfg?.bg, color: cfg?.color }}
                            >
                              <GroupIcon size={11} />
                            </div>
                            <span
                              className="text-[12px] font-semibold uppercase tracking-wider"
                              style={{ color: cfg?.color }}
                            >
                              {group.label[lang] || group.label.en}
                            </span>
                          </div>

                          {/* Service cards */}
                          <div className="grid gap-3 mb-4">
                            {group.items.map((bs) => (
                              <Card key={bs.id} className="border-slate-200 bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/services/${bs.serviceId}`)}>
                                <CardContent className="p-4">
                                  {/* Header: Service code + name + metered badge */}
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[12px] font-mono text-slate-500">{bs.service?.code}</span>
                                        <span className="text-[13px] font-semibold text-slate-900">{bs.service?.name[lang]}</span>
                                      </div>
                                    </div>
                                    {bs.service?.metered === true && (
                                      <span className="text-[10px] px-2 py-1 rounded-full font-medium text-slate-600 bg-slate-100">
                                        {lang === "nl" ? "Gemeten" : "Metered"}
                                      </span>
                                    )}
                                  </div>

                                  {/* Cost categories */}
                                  <div className="mb-3 pb-3 border-b border-slate-100">
                                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                                      {lang === "nl" ? "Kostensoorten" : "Cost Categories"}
                                    </p>
                                    <div className="space-y-1.5">
                                      {(() => {
                                        const costCats = getCostCategoriesByService(bs.serviceId);
                                        if (costCats.length === 0) {
                                          return (
                                            <p className="text-[11px] text-slate-400 italic">
                                              {lang === "nl" ? "Geen kostensoorten" : "No cost categories"}
                                            </p>
                                          );
                                        }
                                        return costCats.slice(0, 4).map((cc, idx) => (
                                          <div key={idx} className="flex items-center justify-between text-[11px]">
                                            <div>
                                              <span className="text-slate-700 font-medium">{cc.name[lang] || cc.name.en}</span>
                                              <span className="text-slate-400 ml-2">({cc.supplier})</span>
                                            </div>
                                            <span className="text-slate-500">{cc.invoiceFrequency}</span>
                                          </div>
                                        ));
                                      })()}
                                      {(() => {
                                        const costCats = getCostCategoriesByService(bs.serviceId);
                                        if (costCats.length > 4) {
                                          return (
                                            <p className="text-[10px] text-slate-400 italic pt-1">
                                              {lang === "nl" ? "+" : "+"} {costCats.length - 4} {lang === "nl" ? "meer" : "more"}
                                            </p>
                                          );
                                        }
                                      })()}
                                    </div>
                                  </div>

                                  {/* Distribution method + budget */}
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-1">
                                        {lang === "nl" ? "Verdeling" : "Distribution"}
                                      </p>
                                      <p className="text-[12px] text-slate-700">
                                        {bs.distMethod?.name[lang] || bs.distMethod?.name.en || "—"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-1 text-right">
                                        {lang === "nl" ? "Budget" : "Budget"}
                                      </p>
                                      <p className="text-[14px] font-bold text-slate-900 text-right" style={{ color: brand.navy }}>
                                        {fmt(bs.budget)}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
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
                    <h3 className="text-[13px] font-semibold text-slate-600 mb-3">
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
                                      <p className="text-[12px] text-slate-700 font-medium">{m.meterNumber}</p>
                                      <p className="text-[11px] text-slate-400">{t(m.utility, lang)} · {m.unit}</p>
                                    </div>
                                  </div>
                                  <span className={`text-[11px] font-medium whitespace-nowrap ml-2 ${isOverdue ? "text-amber-600" : "text-green-600"}`}>
                                    {isOverdue ? t("readingsOverdue", lang) : t("readingsUpToDate", lang)}
                                  </span>
                                </div>

                                <div className="grid grid-cols-3 gap-3 px-3 py-2 bg-slate-50 rounded">
                                  <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-medium">
                                      {lang === "nl" ? "Huidig" : "Current"}
                                    </p>
                                    <p className="text-[13px] font-bold text-slate-900">
                                      {(m.lastReading || 0).toLocaleString("nl-NL")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-medium">
                                      {lang === "nl" ? "Verbruik" : "Consumption"}
                                    </p>
                                    <p className="text-[13px] font-bold text-slate-900">
                                      {(m.consumption || 0).toLocaleString("nl-NL")} {m.unit}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-medium">
                                      {lang === "nl" ? "Aflezing" : "Reading date"}
                                    </p>
                                    <p className="text-[13px] font-bold text-slate-900">
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
                      <h3 className="text-[13px] font-semibold text-slate-600 mb-3">
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
                                      <p className="text-[12px] text-slate-700 font-medium">{m.meterNumber}</p>
                                      <p className="text-[11px] text-slate-400">{m.vheId}</p>
                                    </div>
                                  </div>
                                  <span className="text-[13px] font-bold tabular-nums" style={{ color: brand.navy }}>
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
                                    size={13}
                                    className={`text-slate-400 transition-transform duration-150 shrink-0 ${isExpanded ? "rotate-90" : ""}`}
                                  />
                                  <div className="min-w-0">
                                    <p className="text-[12px] text-slate-700 font-medium truncate">
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
                                <p className="text-[12px] text-slate-700 font-medium">
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
