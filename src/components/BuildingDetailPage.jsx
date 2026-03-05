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
} from "@/lib/mockData";

/* ── Category icon + color config ── */
const categoryConfig = {
  energy:        { icon: Zap,        color: "#EF4444", bg: "#FEF2F2" },
  installations: { icon: Wrench,     color: "#8B5CF6", bg: "#F5F3FF" },
  cleaning:      { icon: Sparkles,   color: "#22C55E", bg: "#F0FDF4" },
  management:    { icon: HardHat,    color: "#F59E0B", bg: "#FFFBEB" },
  other:         { icon: FolderOpen, color: "#64748B", bg: "#F8FAFC" },
};
import {
  Circle,
  FileCheck,
  Send,
  Ban,
  ShieldCheck,
  Flag,
} from "lucide-react";
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

/* ── KPI card ── */
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

/* ── Currency formatter ── */
const fmt = (v) =>
  new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v);

/* ══════════════════════════════════════════════════════════════ */
/* ██  MAIN COMPONENT                                          ██ */
/* ══════════════════════════════════════════════════════════════ */

export default function BuildingDetailPage() {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  const lang = useLang();
  const [year, setYear] = useState(2025);

  const building = getBuilding(buildingId);

  const isPastYear = year < new Date().getFullYear();

  // Related data
  const bsRelations = useMemo(
    () => getBuildingServices(buildingId, year),
    [buildingId, year]
  );
  const vheList = useMemo(() => getVhesByBuilding(buildingId), [buildingId]);
  const meterList = useMemo(
    () => getMetersByBuilding(buildingId),
    [buildingId]
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

  // Derived KPIs
  const totalBudget = bsRelations.reduce((s, bs) => s + bs.budget, 0);
  const totalActual = bsRelations.reduce((s, bs) => s + bs.actual, 0);
  const variance = totalBudget - totalActual;
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

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
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
                  {
                    value: "meters",
                    label: `${t("meters", lang)} (${meterList.length})`,
                  },
                  {
                    value: "vhe",
                    label: `VHE (${vheList.length})`,
                  },
                  { value: "activity", label: t("activity", lang) },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#3EB1C8] data-[state=active]:text-slate-900 data-[state=active]:shadow-none px-4 text-[13px] text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* ═══ OVERVIEW TAB ═══ */}
              <TabsContent value="overview">
                <div className="mt-4 space-y-4">
                  {/* KPI cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <KpiCard
                      label={t("budgetProgress", lang)}
                      value={fmt(totalBudget)}
                      sub={`${t("actual", lang)}: ${fmt(totalActual)}`}
                      icon={Activity}
                      color={brand.navy}
                    />
                    <KpiCard
                      label={t("variance", lang)}
                      value={fmt(variance)}
                      sub={
                        variance >= 0
                          ? t("underBudget", lang)
                          : t("overBudget", lang)
                      }
                      icon={Activity}
                      color={variance >= 0 ? brand.green : brand.red}
                    />
                    {isPastYear && settlement ? (
                      <KpiCard
                        label={t("settlementReadiness", lang)}
                        value={
                          settlement.netResult != null
                            ? (settlement.netResult >= 0 ? "+" : "") + fmt(settlement.netResult)
                            : "—"
                        }
                        sub={settlementStatusConfig[settlement.status]?.label[lang]}
                        icon={settlementStatusConfig[settlement.status]?.icon || Circle}
                        color={settlementStatusConfig[settlement.status]?.color}
                      />
                    ) : (
                      <KpiCard
                        label={t("settlementReadiness", lang)}
                        value={`${avgCompleteness}%`}
                        sub={`${completeCount}/${bsRelations.length} ${t("services", lang).toLowerCase()}`}
                        icon={CheckCircle2}
                        color={
                          avgCompleteness >= 100
                            ? brand.green
                            : avgCompleteness >= 75
                            ? brand.amber
                            : brand.red
                        }
                      />
                    )}
                    <KpiCard
                      label={t("activeServices", lang)}
                      value={bsRelations.length}
                      sub={`${mainMeters.length} ${t("mainMeters", lang).toLowerCase()}`}
                      icon={Wrench}
                      color={brand.blue}
                    />
                  </div>

                  {/* Alerts */}
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

                  {/* Cost breakdown by service */}
                  <Card className="border-slate-200 bg-white">
                    <CardContent className="p-5">
                      <h3 className="text-[13px] font-semibold text-slate-600 mb-3">
                        {t("costBreakdown", lang)}
                      </h3>
                      <div className="space-y-2.5">
                        {enrichedBs.map((bs) => {
                          const pct =
                            totalBudget > 0
                              ? Math.round((bs.budget / totalBudget) * 100)
                              : 0;
                          return (
                            <div key={bs.id} className="flex items-center gap-3">
                              <span className="text-[12px] text-slate-600 w-[180px] truncate">
                                {bs.service?.name[lang] || bs.serviceId}
                              </span>
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${pct}%`,
                                    background: brand.blue,
                                  }}
                                />
                              </div>
                              <span className="text-[11px] tabular-nums text-slate-500 w-[60px] text-right">
                                {fmt(bs.budget)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* ═══ SERVICES TAB — grouped by category, with settlement controls ═══ */}
              <TabsContent value="services">
                <div className="mt-4 space-y-5">

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

                        {/* Settlement checks summary */}
                        {sChecks.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-100">
                            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                              {lang === "nl" ? "Controles per dienst" : "Checks per service"}
                            </p>
                            <div className="grid gap-2">
                              {sChecks.map((sc) => {
                                const svc = getService(sc.serviceId);
                                return (
                                  <div
                                    key={sc.id}
                                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="text-[11px] font-mono text-slate-500">{svc?.code}</span>
                                      <span className="text-[12px] text-slate-700 truncate">
                                        {svc?.name[lang] || sc.serviceId}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                      <div className="hidden lg:flex items-center gap-3">
                                        <CheckIcon passed={sc.ledgerComplete} label={lang === "nl" ? "Boekhouding" : "Ledger"} />
                                        <CheckIcon passed={sc.budgetApproved} label={lang === "nl" ? "Budget" : "Budget"} />
                                        <CheckIcon passed={!sc.yoyFlagged} label="YoY" />
                                        {sc.consumptionVerified !== false && (
                                          <CheckIcon passed={sc.consumptionVerified} label={lang === "nl" ? "Verbruik" : "Usage"} />
                                        )}
                                      </div>
                                      <CheckStatusBadge status={sc.status} lang={lang} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Category-grouped service tables */}
                  {(() => {
                    const grouped = serviceCategories
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

                          {/* Table */}
                          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80">
                                  {[
                                    { key: "code", align: "left" },
                                    { key: "service", align: "left" },
                                    { key: "distributionMethod", align: "left" },
                                    { key: "budgetProgress", align: "right" },
                                    { key: "actual", align: "right" },
                                    { key: "variance", align: "right" },
                                    { key: "completeness", align: "center" },
                                  ].map((col) => (
                                    <th
                                      key={col.key}
                                      className={`text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 sm:px-4 py-2 text-${col.align} whitespace-nowrap`}
                                    >
                                      {t(col.key, lang)}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {group.items.map((bs) => {
                                  const v = bs.budget - bs.actual;
                                  return (
                                    <tr
                                      key={bs.id}
                                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                                      onClick={() =>
                                        navigate(`/services/${bs.serviceId}`)
                                      }
                                    >
                                      <td className="px-3 sm:px-4 py-2.5">
                                        <span className="text-[12px] font-mono font-semibold text-slate-600">
                                          {bs.service?.code}
                                        </span>
                                      </td>
                                      <td className="px-3 sm:px-4 py-2.5">
                                        <div
                                          className="text-[13px] font-medium"
                                          style={{ color: brand.navy }}
                                        >
                                          {bs.service?.name[lang] || bs.serviceId}
                                        </div>
                                      </td>
                                      <td className="px-3 sm:px-4 py-2.5">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                                          {bs.distMethod?.name[lang] ||
                                            bs.distributionMethod}
                                        </span>
                                      </td>
                                      <td className="px-3 sm:px-4 py-2.5 text-right tabular-nums text-[13px] text-slate-600">
                                        {fmt(bs.budget)}
                                      </td>
                                      <td className="px-3 sm:px-4 py-2.5 text-right tabular-nums text-[13px] text-slate-600">
                                        {fmt(bs.actual)}
                                      </td>
                                      <td className="px-3 sm:px-4 py-2.5 text-right">
                                        <span
                                          className="text-[13px] tabular-nums font-medium"
                                          style={{
                                            color:
                                              v >= 0 ? brand.green : brand.red,
                                          }}
                                        >
                                          {v >= 0 ? "+" : ""}
                                          {fmt(v)}
                                        </span>
                                      </td>
                                      <td className="px-3 sm:px-4 py-2.5">
                                        <CompletenessBar
                                          pct={bs.completeness}
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </TabsContent>

              {/* ═══ METERS TAB ═══ */}
              <TabsContent value="meters">
                <div className="mt-4 space-y-4">
                  {/* Main meters */}
                  <div>
                    <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      {t("mainMeters", lang)}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {mainMeters.map((m) => {
                        const ui = utilityIcon[m.utility] || {};
                        const Icon = ui.icon || Gauge;
                        const svc = getService(m.serviceId);
                        return (
                          <Card
                            key={m.id}
                            className="border-slate-200 bg-white"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-7 h-7 rounded-md flex items-center justify-center"
                                    style={{
                                      background: (ui.color || "#94A3B8") + "15",
                                    }}
                                  >
                                    <Icon
                                      size={14}
                                      style={{ color: ui.color || "#94A3B8" }}
                                    />
                                  </div>
                                  <div>
                                    <div
                                      className="text-[13px] font-medium"
                                      style={{ color: brand.navy }}
                                    >
                                      {svc?.name[lang] || m.utility}
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-mono">
                                      {m.meterNumber}
                                    </div>
                                  </div>
                                </div>
                                <StatusBadge status={m.status} size="xs" />
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="text-xl font-bold tabular-nums" style={{ color: brand.navy }}>
                                  {m.lastReading.toLocaleString("nl-NL")}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {m.unit}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1">
                                {t("lastReading", lang)}: {m.readingDate}
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submeters */}
                  {subMeters.length > 0 && (
                    <div>
                      <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        {t("subMeters", lang)} ({subMeters.length})
                      </h3>
                      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80">
                              <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 text-left">
                                {t("meterNumber", lang)}
                              </th>
                              <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 text-left">
                                {t("service", lang)}
                              </th>
                              <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 text-left">
                                VHE
                              </th>
                              <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 text-right">
                                {t("lastReading", lang)}
                              </th>
                              <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 text-center">
                                {t("status", lang)}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {subMeters.map((m) => {
                              const svc = getService(m.serviceId);
                              const vhe = vheList.find(
                                (v) => v.id === m.vheId
                              );
                              return (
                                <tr
                                  key={m.id}
                                  className="hover:bg-slate-50/80 transition-colors"
                                >
                                  <td className="px-3 py-2.5 text-[12px] font-mono text-slate-600">
                                    {m.meterNumber}
                                  </td>
                                  <td className="px-3 py-2.5 text-[12px] text-slate-600">
                                    {svc?.name[lang] || m.serviceId}
                                  </td>
                                  <td className="px-3 py-2.5">
                                    {vhe ? (
                                      <button
                                        className="text-[12px] font-medium text-[#3B8EA5] hover:text-[#3EB1C8] transition-colors"
                                        onClick={() =>
                                          navigate(`/vhe/${vhe.id}`)
                                        }
                                      >
                                        {vhe.unit}
                                      </button>
                                    ) : (
                                      <span className="text-[12px] text-slate-400">
                                        —
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2.5 text-right text-[13px] tabular-nums font-medium text-slate-700">
                                    {m.lastReading.toLocaleString("nl-NL")}{" "}
                                    <span className="text-slate-400 font-normal">
                                      {m.unit}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2.5 text-center">
                                    <StatusBadge status={m.status} size="xs" />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {meterList.length === 0 && (
                    <div className="text-center py-8 text-sm text-slate-400">
                      {t("noResults", lang)}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ═══ VHE TAB ═══ */}
              <TabsContent value="vhe">
                <div className="mt-4">
                  <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                          {[
                            { key: "unit", align: "left" },
                            { key: "address", align: "left" },
                            { key: "floor", align: "center" },
                            { key: "m2", align: "right" },
                            { key: "contractHolder", align: "left" },
                            { key: "voorschot", align: "right" },
                            { key: "status", align: "center" },
                          ].map((col) => (
                            <th
                              key={col.key}
                              className={`text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 sm:px-4 py-2.5 text-${col.align} whitespace-nowrap`}
                            >
                              {t(col.key, lang)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {vheList.map((v) => (
                          <tr
                            key={v.id}
                            className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                            onClick={() => navigate(`/vhe/${v.id}`)}
                          >
                            <td className="px-3 sm:px-4 py-3">
                              <span
                                className="text-[13px] font-semibold"
                                style={{ color: brand.navy }}
                              >
                                {v.unit}
                              </span>
                            </td>
                            <td className="px-3 sm:px-4 py-3 text-[12px] text-slate-600">
                              {v.address}
                            </td>
                            <td className="px-3 sm:px-4 py-3 text-center text-[12px] text-slate-500">
                              {v.floor}
                            </td>
                            <td className="px-3 sm:px-4 py-3 text-right text-[13px] tabular-nums text-slate-600">
                              {v.m2} m²
                            </td>
                            <td className="px-3 sm:px-4 py-3 text-[12px] text-slate-600">
                              {v.contractHolder || (
                                <span className="text-slate-300 italic">
                                  {t("vacant", lang)}
                                </span>
                              )}
                            </td>
                            <td className="px-3 sm:px-4 py-3 text-right text-[13px] tabular-nums text-slate-600">
                              {v.voorschot > 0
                                ? fmt(v.voorschot) + "/mo"
                                : "—"}
                            </td>
                            <td className="px-3 sm:px-4 py-3 text-center">
                              <StatusBadge
                                status={
                                  v.status === "vacant" ? "warning" : "active"
                                }
                                size="xs"
                              />
                            </td>
                          </tr>
                        ))}
                        {vheList.length === 0 && (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-4 py-8 text-center text-sm text-slate-400"
                            >
                              {t("noResults", lang)}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              {/* ═══ ACTIVITY TAB ═══ */}
              <TabsContent value="activity">
                <div className="mt-4 space-y-1">
                  {activityList.map((a, idx) => {
                    const cfg = activityIcons[a.type] || activityIcons.alert;
                    const Icon = cfg.icon;
                    return (
                      <div
                        key={a.id}
                        className="flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="relative">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: cfg.color + "15" }}
                          >
                            <Icon size={13} style={{ color: cfg.color }} />
                          </div>
                          {idx < activityList.length - 1 && (
                            <div className="absolute top-7 left-1/2 -translate-x-1/2 w-px h-4 bg-slate-200" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-slate-700">
                            {a.description[lang] || a.description.en}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {a.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {activityList.length === 0 && (
                    <div className="text-center py-8 text-sm text-slate-400">
                      {t("noResults", lang)}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* ── Right: Attribute Panel ── */}
          <AttributePanel>
            <AttrSection title={t("details", lang)}>
              <AttrRow label={t("complex", lang)} value={building.complex} />
              <AttrRow label={t("complexId", lang)} value={building.complexId} />
              <AttrRow label={t("location", lang)} value={building.location} />
              <AttrRow label="VHE" value={`${building.vhe} (${activeVhe} ${t("active", lang).toLowerCase()}, ${vacantVhe} ${t("vacant", lang).toLowerCase()})`} />
              <AttrRow label={t("components", lang)} value={building.components} />
              <AttrRow label={t("dataQuality", lang)} value={<StatusBadge status={building.dataQuality} size="xs" />} />
            </AttrSection>

            <AttrSection title={t("utilities", lang)}>
              <div className="flex items-center gap-2">
                {building.utilities.map((u) => {
                  const ui = utilityIcon[u];
                  if (!ui) return null;
                  const Icon = ui.icon;
                  return (
                    <div
                      key={u}
                      className="w-7 h-7 rounded-md flex items-center justify-center"
                      style={{ background: ui.color + "15" }}
                      title={u}
                    >
                      <Icon size={14} style={{ color: ui.color }} />
                    </div>
                  );
                })}
              </div>
            </AttrSection>

            <AttrLink
              title={t("services", lang)}
              items={enrichedBs.map((bs) => ({
                label: `${bs.service?.code} — ${bs.service?.name[lang] || bs.serviceId}`,
                onClick: () => navigate(`/services/${bs.serviceId}`),
              }))}
            />

            {mainMeters.length > 0 && (
              <AttrSection title={t("mainMeters", lang)}>
                {mainMeters.map((m) => (
                  <AttrRow
                    key={m.id}
                    label={m.meterNumber}
                    value={`${m.lastReading.toLocaleString("nl-NL")} ${m.unit}`}
                  />
                ))}
              </AttrSection>
            )}
          </AttributePanel>
        </div>
      </div>
    </div>
  );
}
