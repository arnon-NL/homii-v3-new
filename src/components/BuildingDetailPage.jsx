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
  Circle,
  FileCheck,
  Send,
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

  // Monthly close aggregation
  const now = new Date();
  const thisYear = now.getFullYear();
  const currentMonth = year < thisYear ? 12 : year === thisYear ? now.getMonth() : 0;
  const servicesOnTrack = monthlyCloseGrid.filter(
    (row) => row.overallStatus === "closed"
  ).length;
  const servicesNeedReview = monthlyCloseGrid.filter(
    (row) => row.overallStatus === "review"
  ).length;
  const servicesOpen = monthlyCloseGrid.filter(
    (row) => row.overallStatus === "open"
  ).length;

  const flaggedCount = enrichedBs.reduce((s, bs) => {
    const ledger = ledgerByService[bs.serviceId];
    return s + (ledger?.flagged || 0);
  }, 0);

  // Overall building health verdict
  const budgetPct = totalBudget > 0 ? Math.round((totalActual / totalBudget) * 100) : 0;
  const yearPct = Math.round((currentMonth / 12) * 100);
  const isOnPace = budgetPct <= yearPct + 10; // within 10pp of expected pace
  const verdictStatus = servicesOpen > 0 || flaggedCount > 2
    ? "attention"
    : servicesNeedReview > 0 || flaggedCount > 0
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

                  {/* ── Layer 1: Verdict Card ── */}
                  <Card className="border-slate-200 bg-white overflow-hidden">
                    <div
                      className="h-1"
                      style={{
                        background: verdictStatus === "on_track" ? brand.green
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
                              background: verdictStatus === "on_track" ? "#F0FDF4"
                                : verdictStatus === "review" ? "#FFFBEB"
                                : "#FEF2F2",
                            }}
                          >
                            {verdictStatus === "on_track" ? (
                              <CheckCircle2 size={18} style={{ color: brand.green }} />
                            ) : verdictStatus === "review" ? (
                              <Clock size={18} style={{ color: brand.amber }} />
                            ) : (
                              <AlertTriangle size={18} style={{ color: brand.red }} />
                            )}
                          </div>
                          <div>
                            <p className="text-[14px] font-semibold" style={{ color: brand.navy }}>
                              {verdictStatus === "on_track"
                                ? (lang === "nl" ? "Complex op koers" : "Building on track")
                                : verdictStatus === "review"
                                  ? (lang === "nl" ? "Aandacht nodig" : "Needs review")
                                  : (lang === "nl" ? "Actie vereist" : "Action required")}
                            </p>
                            <p className="text-[12px] text-slate-500 mt-0.5">
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
                        <div className="flex items-center gap-4 text-[12px]">
                          <div className="text-center">
                            <span className="text-lg font-bold tabular-nums" style={{ color: brand.green }}>
                              {servicesOnTrack}
                            </span>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                              {lang === "nl" ? "op koers" : "on track"}
                            </p>
                          </div>
                          {servicesNeedReview > 0 && (
                            <div className="text-center">
                              <span className="text-lg font-bold tabular-nums" style={{ color: brand.amber }}>
                                {servicesNeedReview}
                              </span>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                                {lang === "nl" ? "review" : "review"}
                              </p>
                            </div>
                          )}
                          {servicesOpen > 0 && (
                            <div className="text-center">
                              <span className="text-lg font-bold tabular-nums" style={{ color: brand.red }}>
                                {servicesOpen}
                              </span>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                                {lang === "nl" ? "open" : "open"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ── Layer 2: Single merged service table ── */}
                  <Card className="border-slate-200 bg-white overflow-hidden">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/50">
                              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2.5 whitespace-nowrap">
                                {lang === "nl" ? "Dienst" : "Service"}
                              </th>
                              <th className="text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">
                                {lang === "nl" ? "Budget" : "Budget"}
                              </th>
                              <th className="text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">
                                {lang === "nl" ? "Werkelijk" : "Actual"}
                              </th>
                              {isFeatureEnabled("monthlyClose") && (
                                <th className="text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-2.5 whitespace-nowrap hidden sm:table-cell">
                                  {["J","F","M","A","M","J","J","A","S","O","N","D"].join("  ")}
                                </th>
                              )}
                              <th className="text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2.5 w-10">
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {enrichedBs.map((bs) => {
                              const v = bs.budget - bs.actual;
                              const ledger = ledgerByService[bs.serviceId];
                              const closeRow = monthlyCloseGrid.find(
                                (r) => r.serviceId === bs.serviceId
                              );

                              // Row-level status: combines budget variance + close status + flags
                              const hasFlagged = (ledger?.flagged || 0) > 0;
                              const hasOpen = closeRow?.openCount > 0;
                              const hasReview = closeRow?.reviewCount > 0;
                              const overBudget = v < 0;

                              let rowStatus = "ok"; // green
                              if (hasFlagged || overBudget || hasOpen) rowStatus = "attention"; // red
                              else if (hasReview) rowStatus = "review"; // amber

                              const statusColor = rowStatus === "ok" ? brand.green
                                : rowStatus === "review" ? brand.amber
                                : brand.red;

                              return (
                                <tr
                                  key={bs.id}
                                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                                  onClick={() => {
                                    setActiveTab("services");
                                    setExpandedService(bs.serviceId);
                                  }}
                                >
                                  <td className="px-4 py-2.5">
                                    <div className="flex items-center gap-2.5">
                                      <div
                                        className="w-1.5 h-8 rounded-full shrink-0"
                                        style={{ background: statusColor }}
                                      />
                                      <div>
                                        <span className="text-[12px] font-medium text-slate-800 group-hover:text-slate-900">
                                          {bs.service?.name[lang] || bs.serviceId}
                                        </span>
                                        <span className="text-[11px] text-slate-400 ml-2 font-mono">
                                          {bs.service?.code}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2.5 text-right text-[12px] font-mono text-slate-500 tabular-nums">
                                    {fmt(bs.budget)}
                                  </td>
                                  <td className="px-3 py-2.5 text-right text-[12px] font-mono tabular-nums font-medium" style={{ color: brand.navy }}>
                                    {fmt(bs.actual)}
                                  </td>
                                  {isFeatureEnabled("monthlyClose") && closeRow && (
                                    <td className="px-2 py-2.5 hidden sm:table-cell">
                                      <div className="flex items-center justify-center gap-[3px]">
                                        {closeRow.months.map((month, idx) => {
                                          let dotColor = "#E2E8F0";
                                          if (month.status === "closed") dotColor = brand.green;
                                          else if (month.status === "review") dotColor = brand.amber;
                                          else if (month.status === "open") dotColor = brand.red;
                                          return (
                                            <div
                                              key={idx}
                                              className="w-[6px] h-[6px] rounded-full"
                                              style={{ background: dotColor }}
                                              title={`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][idx]}: ${month.status}`}
                                            />
                                          );
                                        })}
                                      </div>
                                    </td>
                                  )}
                                  {isFeatureEnabled("monthlyClose") && !closeRow && (
                                    <td className="px-2 py-2.5 hidden sm:table-cell" />
                                  )}
                                  <td className="px-3 py-2.5 text-center">
                                    <ChevronRight size={13} className="text-slate-300 group-hover:text-slate-500 transition-colors mx-auto" />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          {/* Footer */}
                          <tfoot>
                            <tr className="border-t border-slate-200 bg-slate-50/50">
                              <td className="px-4 py-2.5 text-[12px] font-semibold text-slate-600">
                                {lang === "nl" ? "Totaal" : "Total"} ({enrichedBs.length} {lang === "nl" ? "diensten" : "services"})
                              </td>
                              <td className="px-3 py-2.5 text-right text-[12px] font-mono font-semibold text-slate-600 tabular-nums">
                                {fmt(totalBudget)}
                              </td>
                              <td className="px-3 py-2.5 text-right text-[12px] font-mono font-semibold tabular-nums" style={{ color: brand.navy }}>
                                {fmt(totalActual)}
                              </td>
                              {isFeatureEnabled("monthlyClose") && (
                                <td className="px-2 py-2.5 text-center text-[11px] font-medium text-slate-500 hidden sm:table-cell">
                                  {servicesOnTrack}/{enrichedBs.length} {lang === "nl" ? "op koers" : "on track"}
                                </td>
                              )}
                              <td className="px-3 py-2.5" />
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ── Layer 3: Alerts (only if any exist) ── */}
                  {activityList.filter((a) => a.type === "alert").length > 0 && (
                    <div className="space-y-2">
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
                              <GroupIcon size={11} />
                            </div>
                            <span
                              className="text-[12px] font-semibold uppercase tracking-wider"
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
                              const closeRow = monthlyCloseGrid.find(
                                (r) => r.serviceId === bs.serviceId
                              );
                              const costCats = getCostCategoriesByService(bs.serviceId);
                              const ledgerEntries = isExpanded
                                ? getLedgerByServiceAndBuilding(bs.serviceId, buildingId, year)
                                    .sort((a, b) => b.date.localeCompare(a.date))
                                : [];

                              // Row status
                              const hasFlagged = (ledger?.flagged || 0) > 0;
                              const hasOpen = closeRow?.openCount > 0;
                              const overBudget = v < 0;
                              let rowStatusColor = brand.green;
                              if (hasFlagged || overBudget || hasOpen) rowStatusColor = brand.red;
                              else if (closeRow?.reviewCount > 0) rowStatusColor = brand.amber;

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
                                        size={13}
                                        className={`text-slate-400 transition-transform duration-150 shrink-0 ${isExpanded ? "rotate-90" : ""}`}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[13px] font-semibold text-slate-800">
                                            {bs.service?.name[lang] || bs.serviceId}
                                          </span>
                                          <span className="text-[11px] font-mono text-slate-400">
                                            {bs.service?.code}
                                          </span>
                                          {bs.service?.metered && (
                                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium text-slate-500 bg-slate-100">
                                              {lang === "nl" ? "Gemeten" : "Metered"}
                                            </span>
                                          )}
                                        </div>
                                        {/* Compact monthly dots */}
                                        {isFeatureEnabled("monthlyClose") && closeRow && (
                                          <div className="flex items-center gap-[3px] mt-1">
                                            {closeRow.months.map((month, idx) => {
                                              let dotColor = "#E2E8F0";
                                              if (month.status === "closed") dotColor = brand.green;
                                              else if (month.status === "review") dotColor = brand.amber;
                                              else if (month.status === "open") dotColor = brand.red;
                                              return (
                                                <div
                                                  key={idx}
                                                  className="w-[5px] h-[5px] rounded-full"
                                                  style={{ background: dotColor }}
                                                />
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-4 shrink-0">
                                        <div className="text-right">
                                          <p className="text-[12px] font-mono tabular-nums font-medium" style={{ color: brand.navy }}>
                                            {fmt(bs.actual)}
                                          </p>
                                          <p className="text-[10px] text-slate-400 tabular-nums">
                                            {lang === "nl" ? "van" : "of"} {fmt(bs.budget)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Expanded detail — progressive disclosure */}
                                    {isExpanded && (
                                      <div className="border-t border-slate-100 px-4 py-4 space-y-5 bg-slate-50/30">
                                        {/* Section A: Monthly Closing Grid for this service */}
                                        {isFeatureEnabled("monthlyClose") && closeRow && (
                                          <div>
                                            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2">
                                              {lang === "nl" ? "Maandafsluiting" : "Monthly Close"}
                                            </p>
                                            <div className="flex items-center gap-1">
                                              {closeRow.months.map((month, idx) => {
                                                let bg = "#F1F5F9"; // future
                                                let fg = "#94A3B8";
                                                let label = ["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"][idx];
                                                if (lang === "en") label = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][idx];
                                                if (month.status === "closed") { bg = "#F0FDF4"; fg = brand.green; }
                                                else if (month.status === "review") { bg = "#FFFBEB"; fg = brand.amber; }
                                                else if (month.status === "open") { bg = "#FEF2F2"; fg = brand.red; }

                                                return (
                                                  <div
                                                    key={idx}
                                                    className="flex flex-col items-center gap-1 flex-1"
                                                    title={`${label}: ${month.status}`}
                                                  >
                                                    <div
                                                      className="w-full h-6 rounded flex items-center justify-center"
                                                      style={{ background: bg }}
                                                    >
                                                      {month.status === "closed" && <CheckCircle2 size={11} style={{ color: fg }} />}
                                                      {month.status === "review" && <Clock size={11} style={{ color: fg }} />}
                                                      {month.status === "open" && <AlertTriangle size={11} style={{ color: fg }} />}
                                                      {month.status === "future" && <Lock size={9} style={{ color: fg }} />}
                                                    </div>
                                                    <span className="text-[8px] text-slate-400 uppercase">{label}</span>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}

                                        {/* Section B: Cost Categories */}
                                        <div>
                                          <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2">
                                            {lang === "nl" ? "Kostensoorten" : "Cost Categories"} ({costCats.length})
                                          </p>
                                          {costCats.length === 0 ? (
                                            <p className="text-[11px] text-slate-400 italic">
                                              {lang === "nl" ? "Geen kostensoorten geconfigureerd" : "No cost categories configured"}
                                            </p>
                                          ) : (
                                            <div className="space-y-1">
                                              {costCats.map((cc) => {
                                                const ccBudget = bs.budget * cc.budgetShare;
                                                // Simple proportional YTD estimate
                                                const ccActualEstimate = bs.actual * cc.budgetShare;
                                                const freqLabel = {
                                                  monthly: lang === "nl" ? "maandelijks" : "monthly",
                                                  quarterly: lang === "nl" ? "per kwartaal" : "quarterly",
                                                  annual: lang === "nl" ? "jaarlijks" : "annual",
                                                  irregular: lang === "nl" ? "onregelmatig" : "irregular",
                                                }[cc.invoiceFrequency] || cc.invoiceFrequency;

                                                return (
                                                  <div
                                                    key={cc.id}
                                                    className="flex items-center justify-between text-[11px] px-3 py-2 rounded-md bg-white border border-slate-100"
                                                  >
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                      <span className="font-medium text-slate-700">{cc.name[lang] || cc.name.en}</span>
                                                      {cc.supplier && (
                                                        <span className="text-slate-400 truncate">· {cc.supplier}</span>
                                                      )}
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0 ml-2">
                                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-500">
                                                        {freqLabel}
                                                      </span>
                                                      {cc.unit && cc.unitPrice && (
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                          €{Math.abs(cc.unitPrice).toFixed(2)}/{cc.unit}
                                                        </span>
                                                      )}
                                                      <span className="font-mono text-slate-600 tabular-nums">
                                                        {fmtEur2(ccActualEstimate)}
                                                      </span>
                                                    </div>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>

                                        {/* Section C: Consumption vs Cost check (metered services only) */}
                                        {isFeatureEnabled("consumptionControl") && bs.service?.metered && (() => {
                                          // Find meter(s) for this service's utility type
                                          const utilityMap = {
                                            "SVC-108": "heat", "SVC-107": "heat",
                                            "SVC-102": "water", "SVC-104": "water",
                                            "SVC-105": "electricity", "SVC-106": "electricity",
                                            "SVC-110": "electricity", "SVC-133": "electricity",
                                          };
                                          const utilType = utilityMap[bs.serviceId];
                                          const svcMeters = meterList.filter(
                                            (m) => m.utility === utilType && m.type === "main"
                                          );
                                          const totalConsumption = svcMeters.reduce(
                                            (s, m) => s + (m.consumption || 0), 0
                                          );
                                          // Find weighted unit price from cost categories
                                          const meteredCats = costCats.filter(
                                            (cc) => cc.unit && cc.unitPrice
                                          );
                                          const avgUnitPrice = meteredCats.length > 0
                                            ? meteredCats.reduce(
                                                (s, cc) => s + Math.abs(cc.unitPrice) * cc.budgetShare, 0
                                              ) / meteredCats.reduce((s, cc) => s + cc.budgetShare, 0)
                                            : 0;
                                          const expectedCost = totalConsumption * avgUnitPrice;
                                          const variancePct = bs.actual > 0
                                            ? Math.round(((bs.actual - expectedCost) / expectedCost) * 100)
                                            : 0;
                                          const unit = meteredCats[0]?.unit || "—";

                                          if (totalConsumption === 0 || avgUnitPrice === 0) return null;

                                          return (
                                            <div>
                                              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2">
                                                {lang === "nl" ? "Verbruikscontrole" : "Consumption Check"}
                                              </p>
                                              <div className="px-3 py-2.5 rounded-md bg-white border border-slate-100">
                                                <div className="grid grid-cols-3 gap-4 text-[11px]">
                                                  <div>
                                                    <p className="text-slate-400 mb-1">
                                                      {lang === "nl" ? "Verbruik" : "Consumption"}
                                                    </p>
                                                    <p className="font-mono font-medium text-slate-700 tabular-nums">
                                                      {totalConsumption.toLocaleString("nl-NL")} {unit}
                                                    </p>
                                                  </div>
                                                  <div>
                                                    <p className="text-slate-400 mb-1">
                                                      {lang === "nl" ? "Verwachte kosten" : "Expected cost"}
                                                    </p>
                                                    <p className="font-mono font-medium text-slate-700 tabular-nums">
                                                      {fmtEur2(expectedCost)}
                                                    </p>
                                                    <p className="text-[9px] text-slate-400 mt-0.5">
                                                      {totalConsumption.toLocaleString("nl-NL")} × €{avgUnitPrice.toFixed(2)}/{unit}
                                                    </p>
                                                  </div>
                                                  <div>
                                                    <p className="text-slate-400 mb-1">
                                                      {lang === "nl" ? "Geboekt" : "Booked"}
                                                    </p>
                                                    <p className="font-mono font-medium tabular-nums" style={{ color: brand.navy }}>
                                                      {fmtEur2(bs.actual)}
                                                    </p>
                                                    {Math.abs(variancePct) > 15 && (
                                                      <p
                                                        className="text-[9px] font-medium mt-0.5"
                                                        style={{ color: variancePct > 0 ? brand.red : brand.amber }}
                                                      >
                                                        {variancePct > 0 ? "+" : ""}{variancePct}% {lang === "nl" ? "afwijking" : "variance"}
                                                      </p>
                                                    )}
                                                  </div>
                                                </div>
                                                {Math.abs(variancePct) > 50 && (
                                                  <p className="text-[10px] text-slate-400 mt-2 italic">
                                                    {lang === "nl"
                                                      ? "Let op: verschil kan komen door vastrecht, netbeheer, of seizoenscorrectie"
                                                      : "Note: variance may include fixed charges, grid costs, or seasonal adjustments"}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })()}

                                        {/* Section D: Ledger entries (drill-down) */}
                                        {isFeatureEnabled("ledger") && ledgerEntries.length > 0 && (
                                          <div>
                                            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2">
                                              {lang === "nl" ? "Boekingen" : "Ledger Entries"} ({ledgerEntries.length})
                                            </p>
                                            <div className="space-y-1">
                                              {ledgerEntries.slice(0, 6).map((entry) => (
                                                <div key={entry.id} className="flex items-center justify-between text-[11px] px-3 py-1.5 rounded-md bg-white border border-slate-100">
                                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <span className="text-slate-400 tabular-nums shrink-0">{fmtDate(entry.date)}</span>
                                                    <span className="text-slate-600 truncate">
                                                      {typeof entry.description === "object"
                                                        ? (entry.description[lang] || entry.description.en)
                                                        : entry.description}
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center gap-2 shrink-0 ml-2">
                                                    <span className="font-mono text-slate-700 tabular-nums">{fmtEur2(entry.amount)}</span>
                                                    <LedgerStatusBadge status={entry.status} lang={lang} />
                                                  </div>
                                                </div>
                                              ))}
                                              {ledgerEntries.length > 6 && (
                                                <p className="text-[10px] text-slate-400 italic px-3 py-1">
                                                  + {ledgerEntries.length - 6} {lang === "nl" ? "meer" : "more"}
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
                                            <ArrowUpRight size={11} />
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
