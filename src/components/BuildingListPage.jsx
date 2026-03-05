import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Building2,
  Droplets,
  Flame,
  ShowerHead,
  Zap,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Send,
  Circle,
} from "lucide-react";
import { brand } from "@/lib/brand";
import { buildings, getSettlementsByYear } from "@/lib/mockData";
import { t, useLang } from "@/lib/i18n";
import { StatusBadge } from "./ui/status-badge";

/* ── Utility icon map ── */
const utilityConfig = {
  heat:        { icon: Flame,      color: "#EF4444", label: { en: "Heat",       nl: "Warmte" } },
  water:       { icon: Droplets,   color: "#3B82F6", label: { en: "Water",      nl: "Water" } },
  warmWater:   { icon: ShowerHead, color: "#F59E0B", label: { en: "Warm water", nl: "Warm water" } },
  electricity: { icon: Zap,        color: "#8B5CF6", label: { en: "Electricity",nl: "Elektriciteit" } },
};

function UtilityIcons({ utilities, lang }) {
  return (
    <div className="flex items-center gap-1.5">
      {utilities.map((u) => {
        const cfg = utilityConfig[u];
        if (!cfg) return null;
        const Icon = cfg.icon;
        return (
          <div
            key={u}
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ background: cfg.color + "15" }}
            title={cfg.label[lang] || cfg.label.en}
          >
            <Icon size={13} style={{ color: cfg.color }} />
          </div>
        );
      })}
    </div>
  );
}

/* ── Budget progress bar ── */
function BudgetBar({ spent, total }) {
  const pct = total > 0 ? Math.min((spent / total) * 100, 100) : 0;
  const isOver = pct > 90;
  const fmt = (v) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);

  return (
    <div className="min-w-[120px]">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-slate-500 tabular-nums">{fmt(spent)}</span>
        <span className="text-[10px] text-slate-400 tabular-nums">{fmt(total)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: isOver ? brand.red : pct > 70 ? brand.amber : brand.blue,
          }}
        />
      </div>
      <div className="text-[10px] text-slate-400 mt-0.5 tabular-nums text-right">
        {pct.toFixed(0)}%
      </div>
    </div>
  );
}

/* ── Settlement badge ── */
const settlementConfig = {
  not_started:  { icon: Circle,        color: "#94A3B8", bg: "#F8FAFC", label: { en: "Not started",  nl: "Niet gestart" } },
  monitoring:   { icon: Clock,         color: "#3B82F6", bg: "#EFF6FF", label: { en: "Monitoring",   nl: "Monitoring" } },
  in_review:    { icon: AlertTriangle, color: "#F59E0B", bg: "#FFFBEB", label: { en: "In review",    nl: "In controle" } },
  approved:     { icon: FileCheck,     color: "#22C55E", bg: "#F0FDF4", label: { en: "Approved",     nl: "Goedgekeurd" } },
  distributed:  { icon: Send,          color: "#8B5CF6", bg: "#F5F3FF", label: { en: "Distributed",  nl: "Afgerekend" } },
};

function SettlementBadge({ status, lang }) {
  const cfg = settlementConfig[status] || settlementConfig.not_started;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon size={11} />
      {cfg.label[lang] || cfg.label.en}
    </span>
  );
}

/* ── Net result display ── */
function NetResult({ value, lang }) {
  if (value == null) return <span className="text-slate-300">—</span>;
  const isPositive = value >= 0;
  const fmt = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Math.abs(value));
  return (
    <span
      className="text-[12px] font-medium tabular-nums"
      style={{ color: isPositive ? brand.green : brand.red }}
    >
      {isPositive ? `+${fmt}` : `-${fmt}`}
      <span className="text-[10px] font-normal ml-1 opacity-70">
        {isPositive
          ? (lang === "nl" ? "teruggave" : "refund")
          : (lang === "nl" ? "naheffing" : "surcharge")}
      </span>
    </span>
  );
}

/* ── Year picker ── */
function YearPicker({ year, setYear }) {
  return (
    <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5">
      {[2024, 2025].map((y) => (
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

/* ── Data quality filter options ── */
const qualityFilters = [
  { value: "all",     label: { en: "All",     nl: "Alle" } },
  { value: "good",    label: { en: "Good",    nl: "Goed" } },
  { value: "warning", label: { en: "Warning", nl: "Waarschuwing" } },
  { value: "error",   label: { en: "Error",   nl: "Fout" } },
];

/* ── Settlement filter options ── */
const settlementFilters = [
  { value: "all",          label: { en: "All",          nl: "Alle" } },
  { value: "not_started",  label: { en: "Not started",  nl: "Niet gestart" } },
  { value: "in_review",    label: { en: "In review",    nl: "In controle" } },
  { value: "approved",     label: { en: "Approved",     nl: "Goedgekeurd" } },
  { value: "distributed",  label: { en: "Distributed",  nl: "Afgerekend" } },
];

/* ── Main component ── */
export default function BuildingListPage() {
  const lang = useLang();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [qualityFilter, setQualityFilter] = useState("all");
  const [year, setYear] = useState(2025);
  const [settlementFilter, setSettlementFilter] = useState("all");

  const isPastYear = year < new Date().getFullYear();
  const settlements = useMemo(() => getSettlementsByYear(year), [year]);

  // Build enriched list: building + settlement for selected year
  const enriched = useMemo(() => {
    return buildings.map((b) => {
      const stl = settlements.find((s) => s.buildingId === b.id);
      return { ...b, settlement: stl };
    });
  }, [settlements]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return enriched.filter((b) => {
      const matchSearch =
        !q ||
        b.complex.toLowerCase().includes(q) ||
        b.complexId.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q);
      const matchQuality =
        qualityFilter === "all" || b.dataQuality === qualityFilter;
      const matchSettlement =
        !isPastYear ||
        settlementFilter === "all" ||
        b.settlement?.status === settlementFilter;
      return matchSearch && matchQuality && matchSettlement;
    });
  }, [search, qualityFilter, enriched, isPastYear, settlementFilter]);

  // Settlement summary counts for past year
  const settlementSummary = useMemo(() => {
    if (!isPastYear) return null;
    const counts = { not_started: 0, in_review: 0, approved: 0, distributed: 0 };
    settlements.forEach((s) => {
      if (counts[s.status] !== undefined) counts[s.status]++;
    });
    return counts;
  }, [settlements, isPastYear]);

  const fmt = (v) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">

        {/* Title + year + count */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-xl font-semibold" style={{ color: brand.navy }}>
              {t("buildingsTitle", lang)}
            </h1>
            <span className="text-sm text-slate-400">{filtered.length}</span>
          </div>
          <YearPicker year={year} setYear={setYear} />
        </div>

        {/* Settlement summary bar (past year only) */}
        {isPastYear && settlementSummary && (
          <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mr-2">
              {lang === "nl" ? "Afrekening" : "Settlement"} {year}
            </span>
            {Object.entries(settlementSummary).map(([status, count]) => {
              const cfg = settlementConfig[status];
              const Icon = cfg.icon;
              const isActive = settlementFilter === status;
              return (
                <button
                  key={status}
                  onClick={() =>
                    setSettlementFilter(isActive ? "all" : status)
                  }
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                    isActive
                      ? "ring-2 ring-offset-1 shadow-sm"
                      : "hover:bg-white"
                  }`}
                  style={{
                    background: isActive ? cfg.bg : "transparent",
                    color: cfg.color,
                    ringColor: isActive ? cfg.color : undefined,
                  }}
                >
                  <Icon size={12} />
                  <span className="tabular-nums font-bold">{count}</span>
                  <span className="hidden sm:inline">{cfg.label[lang] || cfg.label.en}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Search & filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Search input */}
          <div className="relative flex-1 min-w-[200px] max-w-[320px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`${t("search", lang)}...`}
              className="w-full h-8 pl-8 pr-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3EB1C8]/30 focus:border-[#3EB1C8] transition-all"
            />
          </div>

          {/* Quality filter */}
          <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5">
            {qualityFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setQualityFilter(f.value)}
                className={`px-3 h-7 rounded-md text-xs font-medium transition-all ${
                  qualityFilter === f.value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f.label[lang] || f.label.en}
              </button>
            ))}
          </div>
        </div>

        {/* ── Mobile card view ── */}
        <div className="block md:hidden space-y-3">
          {filtered.map((b) => (
            <button
              key={b.id}
              onClick={() => navigate(`/buildings/${b.id}`)}
              className="w-full text-left rounded-lg border border-slate-200 bg-white p-4 hover:border-[#3EB1C8] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div
                    className="text-[13px] font-semibold"
                    style={{ color: brand.navy }}
                  >
                    {b.complex}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {b.complexId}
                  </div>
                </div>
                <StatusBadge status={b.dataQuality} size="xs" />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
                <span>{b.location}</span>
                <span className="w-px h-3 bg-slate-200" />
                <span>{b.vhe} VHE</span>
                <span className="w-px h-3 bg-slate-200" />
                <span>
                  {b.components} {t("components", lang).toLowerCase()}
                </span>
              </div>

              {isPastYear && b.settlement ? (
                <div className="flex items-center justify-between gap-3">
                  <SettlementBadge status={b.settlement.status} lang={lang} />
                  <NetResult value={b.settlement.netResult} lang={lang} />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <UtilityIcons utilities={b.utilities} lang={lang} />
                  <BudgetBar spent={b.budgetSpent} total={b.budgetTotal} />
                </div>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              {t("noResults", lang)}
            </div>
          )}
        </div>

        {/* ── Desktop table view ── */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                {[
                  { key: "complex",       align: "left" },
                  { key: "complexId",     align: "left" },
                  { key: "location",      align: "left" },
                  { key: "vhe",           align: "right" },
                  { key: "components",    align: "right" },
                  { key: "utilities",     align: "left" },
                  ...(isPastYear
                    ? [
                        { key: "settlementStatus", align: "center", label: { en: "Settlement", nl: "Afrekening" } },
                        { key: "netResult",        align: "right",  label: { en: "Net Result", nl: "Netto Resultaat" } },
                      ]
                    : [
                        { key: "budgetProgress",align: "left" },
                      ]),
                  { key: "dataQuality",   align: "center" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className={`text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 sm:px-4 py-2.5 text-${col.align} whitespace-nowrap`}
                  >
                    {col.label ? (col.label[lang] || col.label.en) : t(col.key, lang)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => navigate(`/buildings/${b.id}`)}
                >
                  {/* Complex name */}
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-slate-100">
                        <Building2 size={13} className="text-slate-400" />
                      </div>
                      <span
                        className="text-[13px] font-medium"
                        style={{ color: brand.navy }}
                      >
                        {b.complex}
                      </span>
                    </div>
                  </td>

                  {/* Complex ID */}
                  <td className="px-3 sm:px-4 py-3">
                    <span className="text-[12px] font-mono text-slate-500">
                      {b.complexId}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="px-3 sm:px-4 py-3 text-[13px] text-slate-600">
                    {b.location}
                  </td>

                  {/* VHE */}
                  <td className="px-3 sm:px-4 py-3 text-right">
                    <span className="text-[13px] font-semibold tabular-nums text-slate-700">
                      {b.vhe}
                    </span>
                  </td>

                  {/* Components */}
                  <td className="px-3 sm:px-4 py-3 text-right">
                    <span className="text-[13px] tabular-nums text-slate-600">
                      {b.components}
                    </span>
                  </td>

                  {/* Utilities */}
                  <td className="px-3 sm:px-4 py-3">
                    <UtilityIcons utilities={b.utilities} lang={lang} />
                  </td>

                  {/* Conditional columns: settlement (past year) or budget (current) */}
                  {isPastYear ? (
                    <>
                      <td className="px-3 sm:px-4 py-3 text-center">
                        {b.settlement && (
                          <SettlementBadge status={b.settlement.status} lang={lang} />
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-right">
                        <NetResult value={b.settlement?.netResult} lang={lang} />
                      </td>
                    </>
                  ) : (
                    <td className="px-3 sm:px-4 py-3">
                      <BudgetBar spent={b.budgetSpent} total={b.budgetTotal} />
                    </td>
                  )}

                  {/* Data quality */}
                  <td className="px-3 sm:px-4 py-3 text-center">
                    <StatusBadge status={b.dataQuality} size="xs" />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={isPastYear ? 9 : 8}
                    className="px-3 sm:px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("noResults", lang)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
