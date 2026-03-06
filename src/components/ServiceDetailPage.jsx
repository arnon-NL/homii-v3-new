import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Building2,
  FileText,
  TrendingUp,
  TrendingDown,
  Filter,
  BarChart3,
} from "lucide-react";
import { brand } from "@/lib/brand";
import { t, useLang } from "@/lib/i18n";
import {
  services,
  buildings,
  serviceCategories,
  getLedgerByService,
  getLedgerSummaryByService,
} from "@/lib/mockData";

/* ── Formatters ── */
const fmtEur = (v) =>
  new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v);

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

/* ── Status config ── */
const statusConfig = {
  booked:  { color: brand.green, bg: "#F0FDF4", label: { en: "Booked", nl: "Geboekt" }, icon: CheckCircle2 },
  pending: { color: brand.amber, bg: "#FFFBEB", label: { en: "Pending", nl: "In afwachting" }, icon: Clock },
  flagged: { color: brand.red, bg: "#FEF2F2", label: { en: "Flagged", nl: "Gemarkeerd" }, icon: AlertTriangle },
};

function LedgerStatusBadge({ status }) {
  const cfg = statusConfig[status];
  if (!cfg) return null;
  const Icon = cfg.icon;
  const lang = useLang();
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

/* ── Mini bar chart for monthly totals ── */
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

/* ── Main component ── */
export default function ServiceDetailPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const lang = useLang();

  const service = services.find((s) => s.id === serviceId);
  const category = serviceCategories.find((c) => c.id === service?.category);

  const [year] = useState(2025);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedBuilding, setExpandedBuilding] = useState(null);

  // Ledger data
  const allEntries = useMemo(() => getLedgerByService(serviceId, year), [serviceId, year]);
  const summary = useMemo(() => getLedgerSummaryByService(serviceId, year), [serviceId, year]);

  // Building rows with aggregated data
  const buildingRows = useMemo(() => {
    return Object.entries(summary)
      .map(([bldId, data]) => {
        const bld = buildings.find((b) => b.id === bldId);
        if (!bld) return null;
        const budgetForService = (service?.avgCostPerVhe || 0) * bld.vhe;
        const variance = data.total - budgetForService;
        const variancePct = budgetForService > 0 ? (variance / budgetForService) * 100 : 0;
        return {
          ...data,
          building: bld,
          budgetForService,
          variance,
          variancePct,
        };
      })
      .filter(Boolean)
      .filter((row) => {
        if (statusFilter === "flagged") return row.flagged > 0;
        if (statusFilter === "pending") return row.pending > 0;
        if (statusFilter === "issues") return row.flagged > 0 || row.pending > 0 || Math.abs(row.variancePct) > 15;
        return true;
      })
      .filter((row) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          row.building.complex.toLowerCase().includes(q) ||
          row.building.complexId.toLowerCase().includes(q) ||
          row.building.location.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        // Issues first
        const aIssues = a.flagged + a.pending;
        const bIssues = b.flagged + b.pending;
        if (aIssues !== bIssues) return bIssues - aIssues;
        return b.total - a.total;
      });
  }, [summary, statusFilter, search, service]);

  // Totals
  const totalBooked = allEntries.reduce((s, e) => s + e.amount, 0);
  const totalBudget = buildingRows.reduce((s, r) => s + r.budgetForService, 0);
  const totalFlagged = allEntries.filter((e) => e.status === "flagged").length;
  const totalPending = allEntries.filter((e) => e.status === "pending").length;
  const completeness = allEntries.length > 0 ? Math.round(
    (allEntries.filter((e) => e.status === "booked").length / allEntries.length) * 100
  ) : 0;

  if (!service) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        Service not found
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* ── Back + Title ── */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate("/services")}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={16} className="text-slate-500" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-mono text-slate-400">{service.code}</span>
              {category && (
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{ background: "#F1F5F9", color: brand.subtle }}
                >
                  {category.label[lang]}
                </span>
              )}
            </div>
            <h1 className="text-lg font-semibold truncate" style={{ color: brand.navy }}>
              {service.name[lang] || service.name.en}
            </h1>
          </div>
          <div
            className="px-3 py-1 rounded-full text-[12px] font-semibold"
            style={{ background: "#EFF6FF", color: brand.navy }}
          >
            {year}
          </div>
        </div>

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {[
            {
              label: { en: "Total Booked", nl: "Totaal geboekt" },
              value: fmtEur(totalBooked),
              sub: `${lang === "nl" ? "Budget" : "Budget"}: ${fmtEur(totalBudget)}`,
              color: brand.navy,
            },
            {
              label: { en: "Variance", nl: "Afwijking" },
              value: fmtEur(totalBooked - totalBudget),
              sub: `${totalBudget > 0 ? (((totalBooked - totalBudget) / totalBudget) * 100).toFixed(1) : 0}%`,
              color: totalBooked > totalBudget ? brand.red : brand.green,
            },
            {
              label: { en: "Completeness", nl: "Volledigheid" },
              value: `${completeness}%`,
              sub: `${allEntries.length} ${lang === "nl" ? "boekingen" : "entries"}`,
              color: completeness >= 90 ? brand.green : completeness >= 70 ? brand.amber : brand.red,
            },
            {
              label: { en: "Flagged", nl: "Gemarkeerd" },
              value: totalFlagged,
              sub: lang === "nl" ? "Vereist actie" : "Needs action",
              color: totalFlagged > 0 ? brand.red : brand.green,
            },
            {
              label: { en: "Pending", nl: "In afwachting" },
              value: totalPending,
              sub: lang === "nl" ? "Nog te boeken" : "Awaiting booking",
              color: totalPending > 0 ? brand.amber : brand.green,
            },
          ].map((card, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 bg-white p-3"
            >
              <div className="text-[11px] text-slate-500 font-medium mb-1">
                {card.label[lang]}
              </div>
              <div
                className="text-[18px] font-bold tabular-nums"
                style={{ color: card.color }}
              >
                {card.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{card.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Monthly distribution chart ── */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={14} className="text-slate-400" />
            <span className="text-[13px] font-semibold" style={{ color: brand.navy }}>
              {lang === "nl" ? "Maandoverzicht alle complexen" : "Monthly Overview All Complexes"}
            </span>
          </div>
          <MonthlyBarChart
            entries={allEntries}
            budgetPerMonth={totalBudget / 12}
          />
        </div>

        {/* ── Filter bar ── */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-[300px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`${t("search", lang)} ${lang === "nl" ? "complexen" : "complexes"}...`}
              className="w-full h-8 pl-8 pr-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3EB1C8]/30 focus:border-[#3EB1C8] transition-all"
            />
          </div>

          <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5">
            {[
              { value: "all", label: { en: "All", nl: "Alle" } },
              { value: "issues", label: { en: "Issues", nl: "Aandachtspunten" } },
              { value: "flagged", label: { en: "Flagged", nl: "Gemarkeerd" } },
              { value: "pending", label: { en: "Pending", nl: "In afwachting" } },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 h-7 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                  statusFilter === f.value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f.label[lang]}
              </button>
            ))}
          </div>

          <span className="text-[12px] text-slate-400 ml-auto">
            {buildingRows.length} {lang === "nl" ? "complexen" : "complexes"}
          </span>
        </div>

        {/* ── Building ledger rows ── */}
        <div className="space-y-2">
          {buildingRows.map((row) => {
            const isExpanded = expandedBuilding === row.building.id;
            const entries = isExpanded
              ? allEntries
                  .filter((e) => e.buildingId === row.building.id)
                  .sort((a, b) => b.date.localeCompare(a.date))
              : [];
            const hasIssues = row.flagged > 0 || row.pending > 0;

            return (
              <div
                key={row.building.id}
                className="rounded-lg border bg-white overflow-hidden transition-all"
                style={{
                  borderColor: hasIssues ? "#FDE68A" : "#E2E8F0",
                }}
              >
                {/* Building summary row */}
                <button
                  onClick={() =>
                    setExpandedBuilding(isExpanded ? null : row.building.id)
                  }
                  className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center justify-center w-5">
                    {isExpanded ? (
                      <ChevronDown size={14} className="text-slate-400" />
                    ) : (
                      <ChevronRight size={14} className="text-slate-400" />
                    )}
                  </div>

                  {/* Building info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Building2 size={12} className="text-slate-400 shrink-0" />
                      <span
                        className="text-[13px] font-medium truncate"
                        style={{ color: brand.navy }}
                      >
                        {row.building.complex}
                      </span>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {row.building.complexId}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 pl-5">
                      {row.building.location} · {row.building.vhe} VHE · {row.count}{" "}
                      {lang === "nl" ? "boekingen" : "entries"}
                    </div>
                  </div>

                  {/* Status indicators */}
                  <div className="hidden sm:flex items-center gap-3 shrink-0">
                    {row.flagged > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: brand.red }}>
                        <AlertTriangle size={11} />
                        {row.flagged}
                      </span>
                    )}
                    {row.pending > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: brand.amber }}>
                        <Clock size={11} />
                        {row.pending}
                      </span>
                    )}
                  </div>

                  {/* Amounts */}
                  <div className="text-right shrink-0">
                    <div className="text-[13px] font-semibold tabular-nums" style={{ color: brand.navy }}>
                      {fmtEur(row.total)}
                    </div>
                    <div
                      className="text-[11px] tabular-nums flex items-center justify-end gap-1"
                      style={{ color: row.variance > 0 ? brand.red : brand.green }}
                    >
                      {row.variance > 0 ? (
                        <TrendingUp size={10} />
                      ) : (
                        <TrendingDown size={10} />
                      )}
                      {row.variancePct > 0 ? "+" : ""}
                      {row.variancePct.toFixed(1)}%
                    </div>
                  </div>
                </button>

                {/* Expanded: ledger entries */}
                {isExpanded && (
                  <div className="border-t border-slate-100">
                    {/* Mini bar */}
                    <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                      <MonthlyBarChart
                        entries={allEntries.filter(
                          (e) => e.buildingId === row.building.id
                        )}
                        budgetPerMonth={row.budgetForService / 12}
                      />
                    </div>

                    {/* Entry table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50/60 border-b border-slate-100">
                            <th className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2 text-left">
                              {t("date", lang)}
                            </th>
                            <th className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2 text-left">
                              {t("description", lang)}
                            </th>
                            <th className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2 text-left hidden lg:table-cell">
                              {t("supplier", lang)}
                            </th>
                            <th className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2 text-left hidden md:table-cell">
                              {lang === "nl" ? "Factuur" : "Invoice"}
                            </th>
                            <th className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2 text-right">
                              {lang === "nl" ? "Bedrag" : "Amount"}
                            </th>
                            <th className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2 text-center">
                              {t("status", lang)}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {entries.map((entry) => (
                            <tr
                              key={entry.id}
                              className="hover:bg-slate-50/40 transition-colors"
                              style={
                                entry.status === "flagged"
                                  ? { background: "#FFFBEB40" }
                                  : {}
                              }
                            >
                              <td className="px-4 py-2.5 text-[12px] text-slate-500 tabular-nums whitespace-nowrap">
                                {fmtDate(entry.date)}
                              </td>
                              <td className="px-4 py-2.5">
                                <div className="text-[12px] text-slate-700">
                                  {entry.description}
                                </div>
                                {entry.flag && (
                                  <div className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: brand.red }}>
                                    <AlertTriangle size={9} />
                                    {entry.flag[lang] || entry.flag.en}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-2.5 text-[12px] text-slate-500 hidden lg:table-cell">
                                {entry.supplier || "—"}
                              </td>
                              <td className="px-4 py-2.5 text-[11px] font-mono text-slate-400 hidden md:table-cell">
                                {entry.invoiceRef}
                              </td>
                              <td className="px-4 py-2.5 text-right text-[12px] font-medium tabular-nums" style={{ color: brand.navy }}>
                                {fmtEur2(entry.amount)}
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <LedgerStatusBadge status={entry.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-slate-200 bg-slate-50/60">
                            <td
                              colSpan={4}
                              className="px-4 py-2.5 text-[12px] font-semibold text-slate-500"
                            >
                              {lang === "nl" ? "Totaal" : "Total"} ·{" "}
                              <span className="font-normal text-slate-400">
                                {lang === "nl" ? "Budget" : "Budget"}:{" "}
                                {fmtEur(row.budgetForService)}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-right text-[13px] font-bold tabular-nums" style={{ color: brand.navy }}>
                              {fmtEur2(row.total)}
                            </td>
                            <td />
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* View building detail link */}
                    <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/30">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/buildings/${row.building.id}`);
                        }}
                        className="text-[12px] font-medium hover:underline transition-colors"
                        style={{ color: brand.blue }}
                      >
                        {lang === "nl"
                          ? `Bekijk ${row.building.complex} →`
                          : `View ${row.building.complex} →`}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {buildingRows.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-400">
              {t("noResults", lang)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
