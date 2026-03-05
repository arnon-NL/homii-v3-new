import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Building2, Droplets, Flame, ShowerHead, Zap } from "lucide-react";
import { brand } from "@/lib/brand";
import { buildings } from "@/lib/mockData";
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

/* ── Data quality filter options ── */
const qualityFilters = [
  { value: "all",     label: { en: "All",     nl: "Alle" } },
  { value: "good",    label: { en: "Good",    nl: "Goed" } },
  { value: "warning", label: { en: "Warning", nl: "Waarschuwing" } },
  { value: "error",   label: { en: "Error",   nl: "Fout" } },
];

/* ── Main component ── */
export default function BuildingListPage() {
  const lang = useLang();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [qualityFilter, setQualityFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return buildings.filter((b) => {
      const matchSearch =
        !q ||
        b.complex.toLowerCase().includes(q) ||
        b.complexId.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q);
      const matchQuality =
        qualityFilter === "all" || b.dataQuality === qualityFilter;
      return matchSearch && matchQuality;
    });
  }, [search, qualityFilter]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">

        {/* Title + count */}
        <div className="flex items-baseline gap-2.5 mb-5">
          <h1 className="text-xl font-semibold" style={{ color: brand.navy }}>
            {t("buildingsTitle", lang)}
          </h1>
          <span className="text-sm text-slate-400">{filtered.length}</span>
        </div>

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

              <div className="flex items-center justify-between gap-3">
                <UtilityIcons utilities={b.utilities} lang={lang} />
                <BudgetBar spent={b.budgetSpent} total={b.budgetTotal} />
              </div>
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
                  { key: "budgetProgress",align: "left" },
                  { key: "dataQuality",   align: "center" },
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

                  {/* Budget progress */}
                  <td className="px-3 sm:px-4 py-3">
                    <BudgetBar spent={b.budgetSpent} total={b.budgetTotal} />
                  </td>

                  {/* Data quality */}
                  <td className="px-3 sm:px-4 py-3 text-center">
                    <StatusBadge status={b.dataQuality} size="xs" />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
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
