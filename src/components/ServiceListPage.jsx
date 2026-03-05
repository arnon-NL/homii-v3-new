import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Wrench,
  Flame,
  Droplets,
  Building2,
  TreePine,
  Shield,
  Activity,
  BarChart3,
} from "lucide-react";
import { brand } from "@/lib/brand";
import { services, serviceCategories } from "@/lib/mockData";
import { t, useLang } from "@/lib/i18n";
import { StatusBadge } from "./ui/status-badge";

/* ── Category icon map ── */
const categoryConfig = {
  energy:    { icon: Flame,     color: "#EF4444", bg: "#FEF2F2" },
  water:     { icon: Droplets,  color: "#3B82F6", bg: "#EFF6FF" },
  building:  { icon: Building2, color: "#8B5CF6", bg: "#F5F3FF" },
  exterior:  { icon: TreePine,  color: "#22C55E", bg: "#F0FDF4" },
  insurance: { icon: Shield,    color: "#F59E0B", bg: "#FFFBEB" },
};

function CategoryBadge({ categoryId, lang }) {
  const cfg = categoryConfig[categoryId];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon size={11} />
      {t(categoryId, lang)}
    </div>
  );
}

/* ── Metered / Variable indicator ── */
function BoolDot({ value }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full"
      style={{ background: value ? brand.green : brand.muted }}
    />
  );
}

/* ── Category filter tabs ── */
const categoryFilters = [
  { value: "all", label: { en: "All", nl: "Alle" } },
  ...serviceCategories.map((c) => ({ value: c.id, label: c.label })),
];

/* ── Main component ── */
export default function ServiceListPage() {
  const lang = useLang();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return services.filter((s) => {
      const matchSearch =
        !q ||
        s.code.includes(q) ||
        (s.name[lang] || s.name.en).toLowerCase().includes(q) ||
        (s.description[lang] || s.description.en).toLowerCase().includes(q);
      const matchCategory =
        categoryFilter === "all" || s.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [search, categoryFilter, lang]);

  const fmt = (v) =>
    new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(v);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Title + count */}
        <div className="flex items-baseline gap-2.5 mb-5">
          <h1 className="text-xl font-semibold" style={{ color: brand.navy }}>
            {t("servicesTitle", lang)}
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

          {/* Category filter */}
          <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5 overflow-x-auto">
            {categoryFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setCategoryFilter(f.value)}
                className={`px-3 h-7 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                  categoryFilter === f.value
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
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/services/${s.id}`)}
              className="w-full text-left rounded-lg border border-slate-200 bg-white p-4 hover:border-[#3EB1C8] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background:
                        categoryConfig[s.category]?.bg || "#F1F5F9",
                    }}
                  >
                    <Wrench
                      size={14}
                      style={{
                        color:
                          categoryConfig[s.category]?.color || brand.muted,
                      }}
                    />
                  </div>
                  <div>
                    <div
                      className="text-[13px] font-semibold"
                      style={{ color: brand.navy }}
                    >
                      {s.name[lang] || s.name.en}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {s.code}
                    </div>
                  </div>
                </div>
                <StatusBadge status={s.status} size="xs" />
              </div>

              <p className="text-[12px] text-slate-500 leading-relaxed mb-3 line-clamp-2">
                {s.description[lang] || s.description.en}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge categoryId={s.category} lang={lang} />
                <span className="text-[11px] text-slate-400">
                  {s.buildingCount} {t("buildings", lang).toLowerCase()}
                </span>
                <span className="w-px h-3 bg-slate-200" />
                <span className="text-[11px] text-slate-500 font-medium tabular-nums">
                  {fmt(s.avgCostPerVhe)} / VHE
                </span>
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
                  { key: "code", align: "left" },
                  { key: "service", align: "left" },
                  { key: "category", align: "left" },
                  { key: "metered", align: "center" },
                  { key: "variable", align: "center" },
                  { key: "buildingCount", align: "right" },
                  { key: "avgCostVhe", align: "right" },
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
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => navigate(`/services/${s.id}`)}
                >
                  {/* Code */}
                  <td className="px-3 sm:px-4 py-3">
                    <span className="text-[12px] font-mono font-semibold text-slate-600">
                      {s.code}
                    </span>
                  </td>

                  {/* Service name + description */}
                  <td className="px-3 sm:px-4 py-3 max-w-[320px]">
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background:
                            categoryConfig[s.category]?.bg || "#F1F5F9",
                        }}
                      >
                        <Wrench
                          size={13}
                          style={{
                            color:
                              categoryConfig[s.category]?.color || brand.muted,
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div
                          className="text-[13px] font-medium truncate"
                          style={{ color: brand.navy }}
                        >
                          {s.name[lang] || s.name.en}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate leading-relaxed">
                          {s.description[lang] || s.description.en}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-3 sm:px-4 py-3">
                    <CategoryBadge categoryId={s.category} lang={lang} />
                  </td>

                  {/* Metered */}
                  <td className="px-3 sm:px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <BoolDot value={s.metered} />
                      <span className="text-[11px] text-slate-500">
                        {s.metered ? t("yes", lang) : t("no", lang)}
                      </span>
                    </div>
                  </td>

                  {/* Variable */}
                  <td className="px-3 sm:px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <BoolDot value={s.variable} />
                      <span className="text-[11px] text-slate-500">
                        {s.variable ? t("yes", lang) : t("no", lang)}
                      </span>
                    </div>
                  </td>

                  {/* Building count */}
                  <td className="px-3 sm:px-4 py-3 text-right">
                    <span className="text-[13px] font-semibold tabular-nums text-slate-700">
                      {s.buildingCount}
                    </span>
                  </td>

                  {/* Avg cost per VHE */}
                  <td className="px-3 sm:px-4 py-3 text-right">
                    <span className="text-[13px] tabular-nums text-slate-600">
                      {fmt(s.avgCostPerVhe)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-3 sm:px-4 py-3 text-center">
                    <StatusBadge status={s.status} size="xs" />
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
