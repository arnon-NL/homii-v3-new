import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Building2,
  Droplets,
  Flame,
  ShowerHead,
  Zap,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Send,
  Circle,
  LayoutGrid,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Bookmark,
  Save,
  X,
  Eye,
} from "lucide-react";
import { brand } from "@/lib/brand";
import { getSettlementsByYear, getView } from "@/lib/mockData";
import { useOrg } from "@/lib/OrgContext";
import { t, useLang } from "@/lib/i18n";
import { StatusBadge } from "./ui/status-badge";

/* ── Utility icon map ── */
const utilityConfig = {
  heat:        { icon: Flame,      color: "#EF4444", label: { en: "Heat",       nl: "Warmte" } },
  water:       { icon: Droplets,   color: "#3B82F6", label: { en: "Water",      nl: "Water" } },
  warmWater:   { icon: ShowerHead, color: "#8B5CF6", label: { en: "Warm water", nl: "Warm water" } },
  electricity: { icon: Zap,        color: "#F59E0B", label: { en: "Electricity",nl: "Elektriciteit" } },
};

function UtilityIcons({ utilities, lang }) {
  return (
    <div className="flex items-center gap-2">
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
            <Icon size={14} style={{ color: cfg.color }} />
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
        <span className="text-[11px] text-slate-400 tabular-nums">{fmt(total)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-colors duration-500"
          style={{
            width: `${pct}%`,
            background: isOver ? brand.red : pct > 70 ? brand.amber : brand.blue,
          }}
        />
      </div>
      <div className="text-[11px] text-slate-400 mt-0.5 tabular-nums text-right">
        {pct.toFixed(0)}%
      </div>
    </div>
  );
}

/* ── Settlement badge ── */
const settlementConfig = {
  not_started:  { icon: Circle,        color: "#94A3B8", bg: "#F8FAFC", label: { en: "Not started",  nl: "Niet gestart" } },
  monitoring:   { icon: Clock,         color: "#94A3B8", bg: "#F8FAFC", label: { en: "Monitoring",   nl: "Monitoring" } },
  in_review:    { icon: AlertTriangle, color: "#F59E0B", bg: "#F8FAFC", label: { en: "In review",    nl: "In controle" } },
  approved:     { icon: FileCheck,     color: "#3EB1C8", bg: "#F0FAFB", label: { en: "Approved",     nl: "Goedgekeurd" } },
  distributed:  { icon: Send,          color: "#3EB1C8", bg: "#F0FAFB", label: { en: "Distributed",  nl: "Afgerekend" } },
};

function SettlementBadge({ status, lang }) {
  const cfg = settlementConfig[status] || settlementConfig.not_started;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
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
      className="text-xs font-medium tabular-nums"
      style={{ color: isPositive ? brand.blue : brand.red }}
    >
      {isPositive ? `+${fmt}` : `-${fmt}`}
      <span className="text-[11px] font-normal ml-1 opacity-70">
        {isPositive
          ? (lang === "nl" ? "teruggave" : "refund")
          : (lang === "nl" ? "naheffing" : "surcharge")}
      </span>
    </span>
  );
}

/* ── Data quality filter options ── */
const qualityFilters = [
  { value: "all",     label: { en: "All",     nl: "Alle" } },
  { value: "good",    label: { en: "Good",    nl: "Goed" } },
  { value: "warning", label: { en: "Warning", nl: "Waarschuwing" } },
  { value: "error",   label: { en: "Error",   nl: "Fout" } },
];

/* ── Utility filter options ── */
const utilityFilterOptions = [
  { value: "heat",        label: { en: "Heat",       nl: "Warmte" },     icon: Flame,      color: "#EF4444" },
  { value: "water",       label: { en: "Water",      nl: "Water" },      icon: Droplets,   color: "#3B82F6" },
  { value: "warmWater",   label: { en: "Warm water", nl: "Warm water" }, icon: ShowerHead,  color: "#8B5CF6" },
  { value: "electricity", label: { en: "Electricity",nl: "Elektriciteit"},icon: Zap,        color: "#F59E0B" },
];

/* ── Column definitions ── */
const allColumns = {
  complex:          { align: "left",   sortable: false },
  complexId:        { align: "left",   sortable: false },
  location:         { align: "left",   sortable: false },
  vhe:              { align: "right",  sortable: true },
  components:       { align: "right",  sortable: true },
  utilities:        { align: "left",   sortable: true, sortKey: "utilityCount" },
  budgetProgress:   { align: "left",   sortable: false },
  settlementStatus: { align: "center", sortable: false, label: { en: "Settlement", nl: "Afrekening" } },
  netResult:        { align: "right",  sortable: false, label: { en: "Net Result", nl: "Netto Resultaat" } },
  dataQuality:      { align: "center", sortable: false },
};

/* ── Default columns for Complexes (no view) — core object attributes only ── */
const defaultComplexColumns = [
  "complex", "complexId", "location", "vhe", "components", "utilities", "dataQuality",
];

/* ── Main component ── */
export default function BuildingListPage() {
  const lang = useLang();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [qualityFilter, setQualityFilter] = useState("all");
  const [utilityFilters, setUtilityFilters] = useState([]);
  const [settlementFilter, setSettlementFilter] = useState("all");
  const [sortCol, setSortCol] = useState(null); // null | "vhe" | "components" | "utilityCount"
  const [sortDir, setSortDir] = useState("desc"); // "asc" | "desc"
  const { data, orgId } = useOrg();

  // Resolve active view from URL
  const viewId = searchParams.get("view");
  const activeView = viewId ? getView(viewId) : null;

  // Views can lock a year (settlement views)
  const isViewWithYear = activeView?.year != null;
  const year = activeView?.year ?? null;
  const currentYear = new Date().getFullYear();
  const isPastYear = year != null && year < currentYear;

  const settlements = useMemo(() => {
    if (year == null) return [];
    return getSettlementsByYear(year);
  }, [year]);

  // Resolve which columns to show
  const visibleColumns = useMemo(() => {
    if (activeView?.columns?.length) return activeView.columns;
    return defaultComplexColumns;
  }, [activeView]);

  // Build enriched list: building + settlement for selected year
  const enriched = useMemo(() => {
    return data.buildings.map((b) => {
      const stl = year != null ? settlements.find((s) => s.buildingId === b.id) : null;
      return { ...b, settlement: stl, utilityCount: b.utilities.length };
    });
  }, [settlements, year]);

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
      const matchUtility =
        utilityFilters.length === 0 ||
        utilityFilters.every((u) => b.utilities.includes(u));
      const matchSettlement =
        !isPastYear ||
        settlementFilter === "all" ||
        b.settlement?.status === settlementFilter;
      return matchSearch && matchQuality && matchUtility && matchSettlement;
    });
  }, [search, qualityFilter, utilityFilters, enriched, isPastYear, settlementFilter]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    const key = sortCol;
    return [...filtered].sort((a, b) => {
      const av = a[key] ?? 0;
      const bv = b[key] ?? 0;
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [filtered, sortCol, sortDir]);

  // Pagination
  const PAGE_SIZE = 50;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = useMemo(() => {
    const start = page * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);
  // Reset page when filters change
  useMemo(() => setPage(0), [search, qualityFilter, utilityFilters, settlementFilter]);

  // Settlement summary counts for past year
  const settlementSummary = useMemo(() => {
    if (!isPastYear) return null;
    const counts = { not_started: 0, monitoring: 0, in_review: 0, approved: 0, distributed: 0 };
    settlements.forEach((s) => {
      if (counts[s.status] !== undefined) counts[s.status]++;
    });
    return counts;
  }, [settlements, isPastYear]);

  const showSettlement = visibleColumns.includes("settlementStatus");

  // Page title: view name or default
  const pageTitle = activeView
    ? (activeView.name[lang] || activeView.name.en)
    : t("buildingsTitle", lang);

  // Toggle sort on a column
  function handleSort(colKey) {
    const col = allColumns[colKey];
    if (!col?.sortable) return;
    const key = col.sortKey || colKey;
    if (sortCol === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(key);
      setSortDir("desc");
    }
  }

  // Toggle utility filter
  function toggleUtility(u) {
    setUtilityFilters((prev) =>
      prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]
    );
  }

  /* ── Cell renderer ── */
  function renderCell(col, b) {
    switch (col) {
      case "complex":
        return (
          <td key={col} className="px-3 sm:px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center bg-slate-100">
                <Building2 size={14} className="text-slate-400" />
              </div>
              <span className="text-sm font-medium" style={{ color: brand.navy }}>
                {b.complex}
              </span>
            </div>
          </td>
        );
      case "complexId":
        return (
          <td key={col} className="px-3 sm:px-4 py-3">
            <span className="text-xs font-mono text-slate-500">{b.complexId}</span>
          </td>
        );
      case "location":
        return (
          <td key={col} className="px-3 sm:px-4 py-3 text-sm text-slate-600">
            {b.location}
          </td>
        );
      case "vhe":
        return (
          <td key={col} className="px-3 sm:px-4 py-3 text-right">
            <span className="text-sm font-semibold tabular-nums text-slate-700">{b.vhe}</span>
          </td>
        );
      case "components":
        return (
          <td key={col} className="px-3 sm:px-4 py-3 text-right">
            <span className="text-sm tabular-nums text-slate-600">{b.components}</span>
          </td>
        );
      case "utilities":
        return (
          <td key={col} className="px-3 sm:px-4 py-3">
            <UtilityIcons utilities={b.utilities} lang={lang} />
          </td>
        );
      case "budgetProgress":
        return (
          <td key={col} className="px-3 sm:px-4 py-3">
            <BudgetBar spent={b.budgetSpent} total={b.budgetTotal} />
          </td>
        );
      case "settlementStatus":
        return (
          <td key={col} className="px-3 sm:px-4 py-3 text-center">
            {b.settlement && <SettlementBadge status={b.settlement.status} lang={lang} />}
          </td>
        );
      case "netResult":
        return (
          <td key={col} className="px-3 sm:px-4 py-3 text-right">
            <NetResult value={b.settlement?.netResult} lang={lang} />
          </td>
        );
      case "dataQuality":
        return (
          <td key={col} className="px-3 sm:px-4 py-3 text-center">
            <StatusBadge status={b.dataQuality} size="xs" />
          </td>
        );
      default:
        return <td key={col} className="px-3 sm:px-4 py-3">—</td>;
    }
  }

  /* ── Sort icon helper ── */
  function SortIcon({ colKey }) {
    const col = allColumns[colKey];
    if (!col?.sortable) return null;
    const key = col.sortKey || colKey;
    const isActive = sortCol === key;
    if (!isActive) return <ArrowUpDown size={10} className="ml-1 text-slate-300" />;
    return sortDir === "asc"
      ? <ArrowUp size={10} className="ml-1 text-slate-600" />
      : <ArrowDown size={10} className="ml-1 text-slate-600" />;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">

        {/* Title + view badge + count */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-semibold" style={{ color: brand.navy }}>
              {pageTitle}
            </h1>
            {activeView && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-[11px] font-medium text-slate-500">
                <LayoutGrid size={14} />
                {lang === "nl" ? "Weergave" : "View"}
              </span>
            )}
            <span className="text-sm text-slate-400">
              {sorted.length > PAGE_SIZE
                ? `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, sorted.length)} / ${sorted.length}`
                : sorted.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Year badge for settlement views */}
            {isViewWithYear && (
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-sm font-semibold tabular-nums text-slate-600">
                {year}
              </span>
            )}
          </div>
        </div>

        {/* ── Saved Views bar ── */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mr-1">
            <Eye size={14} className="inline -mt-0.5 mr-1" />
            {lang === "nl" ? "Weergaven" : "Views"}
          </span>
          {/* Default / no view */}
          <button
            onClick={() => setSearchParams({})}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              !activeView
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <LayoutGrid size={14} />
            {lang === "nl" ? "Alle complexen" : "All complexes"}
          </button>
          {/* Saved views */}
          {data.savedViews
            .filter((v) => v.objectType === "buildings")
            .map((v) => {
              const isActive = viewId === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSearchParams({ view: v.id })}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <Bookmark size={14} className={isActive ? "fill-current" : ""} />
                  {v.name[lang] || v.name.en}
                </button>
              );
            })}
        </div>

        {/* Settlement summary bar (past year view only) */}
        {isPastYear && settlementSummary && showSettlement && (
          <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mr-2">
              {lang === "nl" ? "Afrekening" : "Settlement"} {year}
            </span>
            {Object.entries(settlementSummary).map(([status, count]) => {
              const cfg = settlementConfig[status];
              if (!cfg) return null;
              const Icon = cfg.icon;
              const isActive = settlementFilter === status;
              return (
                <button
                  key={status}
                  onClick={() =>
                    setSettlementFilter(isActive ? "all" : status)
                  }
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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
                  <span className="tabular-nums font-semibold">{count}</span>
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
              className="w-full h-8 pl-8 pr-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3EB1C8]/30 focus:border-[#3EB1C8] transition-colors"
            />
          </div>

          {/* Quality filter */}
          <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5">
            {qualityFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setQualityFilter(f.value)}
                className={`px-3 h-7 rounded-lg text-xs font-medium transition-colors ${
                  qualityFilter === f.value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f.label[lang] || f.label.en}
              </button>
            ))}
          </div>

          {/* Utility filter (only on default complexes view, not settlement views) */}
          {!isViewWithYear && (
            <div className="flex items-center gap-1">
              {utilityFilterOptions.map((u) => {
                const Icon = u.icon;
                const isActive = utilityFilters.includes(u.value);
                return (
                  <button
                    key={u.value}
                    onClick={() => toggleUtility(u.value)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? "ring-2 ring-offset-1 shadow-sm"
                        : "hover:bg-slate-100"
                    }`}
                    style={{
                      background: isActive ? u.color + "15" : "transparent",
                      ringColor: isActive ? u.color : undefined,
                    }}
                    title={u.label[lang] || u.label.en}
                  >
                    <Icon size={14} style={{ color: isActive ? u.color : "#94A3B8" }} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Mobile card view ── */}
        <div className="block md:hidden space-y-3">
          {paged.map((b) => (
            <button
              key={b.id}
              onClick={() => navigate(`/${orgId}/buildings/${b.id}${isViewWithYear ? `?year=${year}` : ""}`)}
              className="w-full text-left rounded-lg border border-slate-200 bg-white p-4 hover:border-[#3EB1C8] hover:shadow-md transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div
                    className="text-sm font-semibold"
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

              {showSettlement && b.settlement ? (
                <div className="flex items-center justify-between gap-3">
                  <SettlementBadge status={b.settlement.status} lang={lang} />
                  <NetResult value={b.settlement.netResult} lang={lang} />
                </div>
              ) : (
                <UtilityIcons utilities={b.utilities} lang={lang} />
              )}
            </button>
          ))}
          {sorted.length === 0 && (
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
                {visibleColumns.map((colKey) => {
                  const col = allColumns[colKey] || { align: "left" };
                  const isSortable = col.sortable;
                  return (
                    <th
                      key={colKey}
                      className={`text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 sm:px-4 py-3 text-${col.align} whitespace-nowrap ${
                        isSortable ? "cursor-pointer select-none hover:text-slate-700" : ""
                      }`}
                      onClick={() => handleSort(colKey)}
                    >
                      <span className="inline-flex items-center">
                        {col.label ? (col.label[lang] || col.label.en) : t(colKey, lang)}
                        {isSortable && <SortIcon colKey={colKey} />}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paged.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => navigate(`/${orgId}/buildings/${b.id}${isViewWithYear ? `?year=${year}` : ""}`)}
                >
                  {visibleColumns.map((colKey) => renderCell(colKey, b))}
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td
                    colSpan={visibleColumns.length}
                    className="px-3 sm:px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("noResults", lang)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <span className="text-xs text-slate-400">
              {lang === "nl" ? "Pagina" : "Page"} {page + 1} / {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let p;
                if (totalPages <= 7) {
                  p = i;
                } else if (page < 4) {
                  p = i;
                } else if (page > totalPages - 5) {
                  p = totalPages - 7 + i;
                } else {
                  p = page - 3 + i;
                }
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                      p === page
                        ? "bg-white shadow-sm border border-slate-200 text-slate-900"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {p + 1}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
