import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Save,
  X,
  SlidersHorizontal,
  MapPin,
  Trash2,
} from "lucide-react";
import { brand } from "@/lib/brand";
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

/* ── Sortable column options ── */
const sortOptions = [
  { value: "",             label: { en: "Default",    nl: "Standaard" } },
  { value: "vhe",          label: { en: "VHE",        nl: "VHE" } },
  { value: "components",   label: { en: "Components", nl: "Componenten" } },
  { value: "utilityCount", label: { en: "Utilities",  nl: "Nutsvoorzieningen" } },
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
  dataQuality:      { align: "center", sortable: false },
};

/* ── Default columns ── */
const defaultComplexColumns = [
  "complex", "complexId", "location", "vhe", "components", "utilities", "dataQuality",
];

/* ── Saved filters persistence ── */
const STORAGE_KEY = "homii-building-filters";

function loadSavedFilters(orgId) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}-${orgId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function persistSavedFilters(orgId, filters) {
  localStorage.setItem(`${STORAGE_KEY}-${orgId}`, JSON.stringify(filters));
}

/* ── Dropdown component ── */
function Dropdown({ trigger, children, align = "left" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={`absolute top-full mt-1 ${align === "right" ? "right-0" : "left-0"} z-50 min-w-[180px] rounded-lg border border-slate-200 bg-white shadow-lg py-1`}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Main component ── */
export default function BuildingListPage() {
  const lang = useLang();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [qualityFilter, setQualityFilter] = useState("all");
  const [utilityFilters, setUtilityFilters] = useState([]);
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("desc");
  const { data, orgId } = useOrg();

  // Saved filters
  const [savedFilters, setSavedFilters] = useState(() => loadSavedFilters(orgId));
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [filterName, setFilterName] = useState("");
  const saveInputRef = useRef(null);

  // Sync saved filters when org changes
  useEffect(() => {
    setSavedFilters(loadSavedFilters(orgId));
  }, [orgId]);

  // Focus save input when shown
  useEffect(() => {
    if (showSaveInput && saveInputRef.current) saveInputRef.current.focus();
  }, [showSaveInput]);

  // Extract unique locations from building data
  const locations = useMemo(() => {
    const locs = [...new Set(data.buildings.map((b) => b.location))].sort();
    return locs;
  }, [data.buildings]);

  // Columns — always default for now (settlement views handled separately)
  const visibleColumns = defaultComplexColumns;

  // Enrich buildings
  const enriched = useMemo(() => {
    return data.buildings.map((b) => ({
      ...b,
      utilityCount: b.utilities.length,
    }));
  }, [data.buildings]);

  // Filter
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
      const matchLocation =
        locationFilter === "all" || b.location === locationFilter;
      return matchSearch && matchQuality && matchUtility && matchLocation;
    });
  }, [search, qualityFilter, utilityFilters, locationFilter, enriched]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortCol] ?? 0;
      const bv = b[sortCol] ?? 0;
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
  useMemo(() => setPage(0), [search, qualityFilter, utilityFilters, locationFilter]);

  // Check if any filters are active
  const hasActiveFilters =
    qualityFilter !== "all" ||
    utilityFilters.length > 0 ||
    locationFilter !== "all" ||
    sortCol !== null ||
    search !== "";

  // Current filter state snapshot
  function getCurrentFilterState() {
    return {
      qualityFilter,
      utilityFilters: [...utilityFilters],
      locationFilter,
      sortCol,
      sortDir,
      search,
    };
  }

  // Apply a saved filter
  function applyFilter(f) {
    setQualityFilter(f.qualityFilter || "all");
    setUtilityFilters(f.utilityFilters || []);
    setLocationFilter(f.locationFilter || "all");
    setSortCol(f.sortCol || null);
    setSortDir(f.sortDir || "desc");
    setSearch(f.search || "");
  }

  // Save current filter
  function handleSaveFilter() {
    if (!filterName.trim()) return;
    const newFilter = {
      id: `filter-${Date.now()}`,
      name: filterName.trim(),
      ...getCurrentFilterState(),
    };
    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    persistSavedFilters(orgId, updated);
    setFilterName("");
    setShowSaveInput(false);
  }

  // Delete a saved filter
  function handleDeleteFilter(id) {
    const updated = savedFilters.filter((f) => f.id !== id);
    setSavedFilters(updated);
    persistSavedFilters(orgId, updated);
  }

  // Clear all filters
  function clearFilters() {
    setQualityFilter("all");
    setUtilityFilters([]);
    setLocationFilter("all");
    setSortCol(null);
    setSortDir("desc");
    setSearch("");
  }

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

        {/* Title + count */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-semibold" style={{ color: brand.navy }}>
              {t("buildingsTitle", lang)}
            </h1>
            <span className="text-sm text-slate-400">
              {sorted.length > PAGE_SIZE
                ? `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, sorted.length)} / ${sorted.length}`
                : sorted.length}
            </span>
          </div>
        </div>

        {/* ── Filter & Sort toolbar ── */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mr-1">
            <SlidersHorizontal size={14} className="inline -mt-0.5 mr-1" />
            {lang === "nl" ? "Filters" : "Filters"}
          </span>

          {/* Search input */}
          <div className="relative min-w-[180px] max-w-[260px]">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`${t("search", lang)}...`}
              className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3EB1C8]/30 focus:border-[#3EB1C8] transition-colors"
            />
          </div>

          {/* Location filter */}
          {locations.length > 1 && (
            <Dropdown
              trigger={
                <button
                  className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium transition-colors border ${
                    locationFilter !== "all"
                      ? "border-[#3EB1C8] bg-[#3EB1C8]/5 text-[#3EB1C8]"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <MapPin size={13} />
                  {locationFilter === "all"
                    ? (lang === "nl" ? "Locatie" : "Location")
                    : locationFilter}
                  <ChevronDown size={12} />
                </button>
              }
            >
              <button
                onClick={() => setLocationFilter("all")}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 ${
                  locationFilter === "all" ? "font-semibold text-slate-900" : "text-slate-600"
                }`}
              >
                {lang === "nl" ? "Alle locaties" : "All locations"}
              </button>
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocationFilter(loc)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 ${
                    locationFilter === loc ? "font-semibold text-slate-900" : "text-slate-600"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </Dropdown>
          )}

          {/* Quality filter dropdown */}
          <Dropdown
            trigger={
              <button
                className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium transition-colors border ${
                  qualityFilter !== "all"
                    ? "border-[#3EB1C8] bg-[#3EB1C8]/5 text-[#3EB1C8]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {qualityFilter === "all"
                  ? (lang === "nl" ? "Datakwaliteit" : "Data quality")
                  : qualityFilters.find((f) => f.value === qualityFilter)?.label[lang] ||
                    qualityFilters.find((f) => f.value === qualityFilter)?.label.en}
                <ChevronDown size={12} />
              </button>
            }
          >
            {qualityFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setQualityFilter(f.value)}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 ${
                  qualityFilter === f.value ? "font-semibold text-slate-900" : "text-slate-600"
                }`}
              >
                {f.label[lang] || f.label.en}
              </button>
            ))}
          </Dropdown>

          {/* Utility filter icons */}
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

          {/* Divider */}
          <div className="w-px h-5 bg-slate-200 mx-1" />

          {/* Sort dropdown */}
          <Dropdown
            trigger={
              <button
                className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium transition-colors border ${
                  sortCol
                    ? "border-[#3EB1C8] bg-[#3EB1C8]/5 text-[#3EB1C8]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ArrowUpDown size={13} />
                {sortCol
                  ? `${sortOptions.find((s) => s.value === sortCol)?.label[lang] || sortCol} ${sortDir === "asc" ? "↑" : "↓"}`
                  : (lang === "nl" ? "Sorteren" : "Sort")}
                <ChevronDown size={12} />
              </button>
            }
          >
            {sortOptions.map((s) => (
              <button
                key={s.value}
                onClick={() => {
                  if (!s.value) {
                    setSortCol(null);
                    setSortDir("desc");
                  } else if (sortCol === s.value) {
                    setSortDir(sortDir === "asc" ? "desc" : "asc");
                  } else {
                    setSortCol(s.value);
                    setSortDir("desc");
                  }
                }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between ${
                  sortCol === s.value || (!sortCol && !s.value)
                    ? "font-semibold text-slate-900"
                    : "text-slate-600"
                }`}
              >
                {s.label[lang] || s.label.en}
                {sortCol === s.value && (
                  <span className="text-slate-400">{sortDir === "asc" ? "↑" : "↓"}</span>
                )}
              </button>
            ))}
          </Dropdown>

          {/* Clear all filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-2 h-7 rounded-lg text-[11px] font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={12} />
              {lang === "nl" ? "Wissen" : "Clear"}
            </button>
          )}

          {/* Save filter button */}
          {hasActiveFilters && (
            <>
              <div className="w-px h-5 bg-slate-200 mx-1" />
              {!showSaveInput ? (
                <button
                  onClick={() => setShowSaveInput(true)}
                  className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium text-slate-500 border border-dashed border-slate-300 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Save size={13} />
                  {lang === "nl" ? "Opslaan" : "Save"}
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5">
                  <input
                    ref={saveInputRef}
                    type="text"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveFilter();
                      if (e.key === "Escape") { setShowSaveInput(false); setFilterName(""); }
                    }}
                    placeholder={lang === "nl" ? "Naam..." : "Name..."}
                    className="h-8 w-32 px-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3EB1C8]/30 focus:border-[#3EB1C8]"
                  />
                  <button
                    onClick={handleSaveFilter}
                    disabled={!filterName.trim()}
                    className="h-8 px-3 rounded-lg text-xs font-medium text-white transition-colors disabled:opacity-40"
                    style={{ background: brand.teal }}
                  >
                    {lang === "nl" ? "Opslaan" : "Save"}
                  </button>
                  <button
                    onClick={() => { setShowSaveInput(false); setFilterName(""); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Saved filters bar ── */}
        {savedFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mr-1">
              <Save size={13} className="inline -mt-0.5 mr-1" />
              {lang === "nl" ? "Opgeslagen" : "Saved"}
            </span>
            {savedFilters.map((f) => (
              <div
                key={f.id}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors group"
              >
                <button
                  onClick={() => applyFilter(f)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  {f.name}
                </button>
                <button
                  onClick={() => handleDeleteFilter(f.id)}
                  className="pr-2 py-1.5 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title={lang === "nl" ? "Verwijderen" : "Delete"}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Mobile card view ── */}
        <div className="block md:hidden space-y-3">
          {paged.map((b) => (
            <button
              key={b.id}
              onClick={() => navigate(`/${orgId}/buildings/${b.id}`)}
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

              <UtilityIcons utilities={b.utilities} lang={lang} />
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
                  onClick={() => navigate(`/${orgId}/buildings/${b.id}`)}
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
