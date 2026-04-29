import React, { useState, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Workflow,
  LayoutGrid,
  BookOpen,
  Send,
  Gauge,
  Activity,
  AlertCircle,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  ExternalLink,
  Filter,
  Search,
  ChevronRight,
  Users,
} from "lucide-react";
import {
  getCostFlow,
  getAllAudiences,
  computeTrust,
  summariseLane,
  fmtEur,
  fmtEur2,
  fmtSignedEur,
  anchorStatusBucket,
} from "@/lib/costFlow";
import { CostFlowView } from "./CostFlowPage";

/* ─── Tab definitions ─────────────────────────────────── */
const TABS = [
  { id: "overview",    label: "Overview",    icon: LayoutGrid },
  { id: "cost-flow",   label: "Cost flow",   icon: Workflow },
  { id: "bookkeeping", label: "Bookkeeping", icon: BookOpen },
  { id: "settlements", label: "Settlements", icon: Send },
  { id: "meters",      label: "Meters",      icon: Gauge },
  { id: "activity",    label: "Activity",    icon: Activity },
];

const PERIODS = [2024, 2023, 2022];

/* ─── Shell ────────────────────────────────────────────── */
function ShellHeader({ flow, period, setPeriod, onBack }) {
  return (
    <div className="border-b border-slate-200 bg-white px-6 pt-3 pb-0">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-700 mb-2"
      >
        <ArrowLeft size={12} /> Buildings
      </button>
      <div className="flex items-center justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-semibold text-slate-900">
              {flow.group.name}
            </h1>
            <span className="text-xs text-slate-400">
              {flow.group.city} · {flow.group.vheCount} VHE · merged from{" "}
              {flow.group.sourceComplexes.map((c) => `cpl ${c}`).join(" + ")}
            </span>
          </div>
        </div>
        <div className="shrink-0">
          {/* Period selector */}
          <label className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-600">
            <Calendar size={12} className="text-slate-400" />
            <span className="text-[10px] uppercase tracking-widest text-slate-400">Period</span>
            <select
              value={period}
              onChange={(e) => setPeriod(parseInt(e.target.value, 10))}
              className="bg-transparent outline-none text-slate-700 font-medium tabular-nums"
            >
              {PERIODS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

function TabBar({ tabs, activeId, onChange }) {
  return (
    <div className="border-b border-slate-200 bg-white px-6 -mt-px">
      <nav className="flex items-center gap-1" role="tablist">
        {tabs.map((t) => {
          const isActive = activeId === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(t.id)}
              className={`relative inline-flex items-center gap-1.5 px-3 h-9 text-[12px] transition-colors ${
                isActive
                  ? "text-slate-900 font-medium"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon size={13} strokeWidth={isActive ? 2 : 1.5} />
              {t.label}
              {isActive && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-slate-900" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* ─── Overview tab ─────────────────────────────────────── */
function KpiCard({ label, value, sub, accent }) {
  const accentClass = {
    amber:   "text-amber-800",
    emerald: "text-emerald-800",
    red:     "text-red-700",
    slate:   "text-slate-800",
  }[accent || "slate"];
  const borderClass = {
    amber:   "border-amber-200 bg-amber-50/40",
    emerald: "border-emerald-200 bg-emerald-50/40",
    red:     "border-red-200 bg-red-50/40",
    slate:   "border-slate-200 bg-white",
  }[accent || "slate"];
  return (
    <div className={`rounded-lg border p-3 ${borderClass}`}>
      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
        {label}
      </div>
      <div className={`text-xl font-semibold tabular-nums leading-tight mt-1 ${accentClass}`}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

/* Derive a status label + tone for a settlement row in Costs at a glance.
 * Priority: wrong_account > missing > matched_partial > settlesViaIsta > matched. */
function deriveSettlementStatus(node, flow) {
  const sourcesInLane = flow.nodes.filter((n) => n.laneId === node.laneId && n.type === "source");
  const allAnchors = sourcesInLane.flatMap((n) => n.anchors || []);

  const wrongAccountTotal = allAnchors
    .filter((a) => a.status === "wrong_account")
    .reduce((s, a) => s + a.amount, 0);
  if (wrongAccountTotal > 0) {
    return { tone: "error", label: `Wrong account ${fmtEur(wrongAccountTotal)}` };
  }
  if (allAnchors.some((a) => a.status === "missing")) {
    return { tone: "error", label: "Missing entries" };
  }
  if (allAnchors.some((a) => a.status === "matched_partial")) {
    return { tone: "warn", label: "Partially reconciled" };
  }
  if (node.settlesViaIsta) {
    return { tone: "info", label: "Settled via Ista" };
  }
  return { tone: "ok", label: "Reconciled" };
}

function CostRowDelta({ delta }) {
  if (delta == null) return <span className="text-slate-400">—</span>;
  if (Math.abs(delta) <= 1) return <span className="text-slate-500 tabular-nums">€0</span>;
  const positive = delta > 0;
  return (
    <span className={`inline-flex items-center gap-1 tabular-nums ${positive ? "text-amber-700" : "text-emerald-700"}`}>
      {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {fmtSignedEur(delta)}
    </span>
  );
}

function CostStatusBadge({ tone, label }) {
  const cfg = {
    ok:    { Icon: CheckCircle2, className: "text-slate-600" },
    warn:  { Icon: AlertTriangle, className: "text-amber-700" },
    error: { Icon: AlertCircle,   className: "text-red-700" },
    info:  { Icon: Info,          className: "text-slate-500" },
  }[tone] || { Icon: Info, className: "text-slate-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] ${cfg.className}`}>
      <cfg.Icon size={12} />
      {label}
    </span>
  );
}

function CostsAtAGlance({ flow, onJumpToCostFlow }) {
  const rows = useMemo(() => {
    return flow.nodes
      .filter((n) => n.type === "settlement" && !n.outOfScope)
      .map((n) => {
        const status = deriveSettlementStatus(n, flow);
        // Strip the trailing service code from the label for a cleaner Service column
        const serviceName = (n.label || "").replace(/\s*[\/—]\s*[A-Z]+\d+G$/, "").trim();
        return {
          ...n,
          serviceName,
          status,
        };
      });
  }, [flow]);

  const totalCost = rows.reduce((s, r) => s + (r.amount || 0), 0);
  const totalIssues = rows.filter((r) => r.status.tone === "error" || r.status.tone === "warn").length;

  return (
    <section>
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-sm font-semibold text-slate-900">Costs at a glance</h2>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500">
            click any row to open it in the flow
          </span>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-[12px]">
          <thead className="bg-slate-50/80 text-[10px] uppercase tracking-widest text-slate-500">
            <tr>
              <th className="text-left font-semibold px-3 py-2">Service</th>
              <th className="text-left font-semibold px-3 py-2">Audience</th>
              <th className="text-right font-semibold px-3 py-2">Cost</th>
              <th className="text-right font-semibold px-3 py-2">Advance</th>
              <th className="text-right font-semibold px-3 py-2">Delta</th>
              <th className="text-left font-semibold px-3 py-2">Status</th>
              <th className="px-3 py-2 w-6" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr
                key={r.id}
                onClick={() => onJumpToCostFlow?.(r.laneId)}
                className="cursor-pointer hover:bg-slate-50 transition-colors group"
              >
                <td className="px-3 py-2">
                  <div className="text-slate-800 font-medium leading-tight truncate">{r.serviceName}</div>
                  <div className="text-[10px] text-slate-400 font-mono leading-tight">{r.serviceCode}</div>
                </td>
                <td className="px-3 py-2 text-slate-600 truncate max-w-[220px]">{r.subLabel}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-800">{fmtEur(r.amount)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-500">
                  {r.advance != null ? fmtEur(r.advance) : "—"}
                </td>
                <td className="px-3 py-2 text-right">
                  <CostRowDelta delta={r.delta} />
                </td>
                <td className="px-3 py-2">
                  <CostStatusBadge tone={r.status.tone} label={r.status.label} />
                </td>
                <td className="px-3 py-2 text-slate-300 group-hover:text-slate-500">
                  <ChevronRight size={13} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50/40 text-[11px]">
            <tr>
              <td className="px-3 py-2 text-slate-600 font-medium" colSpan={2}>
                Total · {rows.length} services
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-800 font-semibold">
                {fmtEur(totalCost)}
              </td>
              <td className="px-3 py-2" />
              <td className="px-3 py-2" />
              <td className="px-3 py-2 text-slate-500">
                {totalIssues > 0
                  ? `${totalIssues} ${totalIssues === 1 ? "issue" : "issues"} to review`
                  : "All reconciled"}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

function AudienceRow({ audience, onOpenInCostFlow }) {
  const stripeColor = {
    complex: "bg-slate-700",
    block:   "bg-slate-500",
    adhoc:   "bg-amber-500",
  }[audience.kind] || "bg-slate-300";
  return (
    <div className="flex items-stretch rounded-lg border border-slate-200 bg-white">
      <span className={`w-1 rounded-l-lg ${stripeColor}`} aria-hidden />
      <div className="flex-1 px-3 py-2.5 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
              {audience.kind === "complex" ? "Complex" : audience.kind === "block" ? "Block" : "Ad-hoc"}
            </span>
            <span className="text-sm font-medium text-slate-800">{audience.name}</span>
            <span className="text-[11px] text-slate-400">· {audience.vheCount} VHE</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {audience.settlementCount} {audience.settlementCount === 1 ? "service" : "services"}
            {audience.flagCount > 0 && (
              <span className="ml-2 text-amber-700">· {audience.flagCount} flag{audience.flagCount === 1 ? "" : "s"}</span>
            )}
          </div>
        </div>
        <div className="text-sm font-semibold text-slate-800 tabular-nums shrink-0">
          {fmtEur(audience.settled)}
        </div>
        <button
          onClick={() => onOpenInCostFlow?.(audience.id)}
          className="text-[11px] text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 shrink-0"
          title="Filter Cost Flow to this audience"
        >
          Open <ChevronRight size={11} />
        </button>
      </div>
    </div>
  );
}

function IssueRow({ icon: Icon, severity, title, detail, action, onClick }) {
  const colorClass =
    severity === "error"
      ? "text-red-700 border-red-200 bg-red-50/40 hover:bg-red-50"
      : "text-amber-800 border-amber-200 bg-amber-50/40 hover:bg-amber-50";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`w-full text-left rounded-lg border p-3 flex items-start gap-2.5 transition-colors ${colorClass} ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <Icon size={14} className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold leading-tight">{title}</div>
        <div className="text-[11px] text-slate-700 mt-0.5">{detail}</div>
      </div>
      {action && (
        <span className="shrink-0 text-[11px] text-slate-700 underline">
          {action}
        </span>
      )}
    </button>
  );
}

function OverviewTab({ flow, onJumpToCostFlow }) {
  const trust = computeTrust();
  const audiences = useMemo(() => getAllAudiences(), []);

  // Topline figures (matches the rail topline)
  const totals = useMemo(() => {
    let totalExpected = 0;
    let collectTotal = 0;
    let refundTotal = 0;
    for (const lane of flow.lanes) {
      const s = summariseLane(lane.id);
      totalExpected += s.expected;
      if (s.netDelta != null) {
        if (s.netDelta > 0) collectTotal += s.netDelta;
        else if (s.netDelta < 0) refundTotal += Math.abs(s.netDelta);
      }
    }
    return { totalExpected, collectTotal, refundTotal };
  }, [flow.lanes]);

  // Curated issue list — auto-built from real flags
  const issues = useMemo(() => {
    const out = [];
    for (const node of flow.nodes) {
      for (const f of (node.flags || [])) {
        out.push({ severity: f.kind, node, note: f.note, laneId: node.laneId });
      }
    }
    // Rank by severity, then by amount
    const rank = { error: 0, warning: 1 };
    out.sort((a, b) => {
      const r = rank[a.severity] - rank[b.severity];
      if (r !== 0) return r;
      return Math.abs(b.node.amount || 0) - Math.abs(a.node.amount || 0);
    });
    return out.slice(0, 6);
  }, [flow.nodes]);

  // Mock recent activity
  const activity = [
    { when: "2 days ago", who: "M. de Vries", what: 'Updated 80/20 split rule on "Electricity meter Blok 2"' },
    { when: "5 days ago", who: "M. de Vries", what: 'Flagged €92,203 Engie gas booking on cpl 2397' },
    { when: "1 week ago", who: "L. Bakker",   what: 'Created ad-hoc audience "Riolering audience (117 VHE)"' },
    { when: "2 weeks ago", who: "M. de Vries", what: 'Confirmed advance recommendation for SV1313G — Huismeester' },
  ];

  return (
    <div className="overflow-y-auto h-full">
      <div className="p-6 max-w-[1400px] space-y-6">
        {/* KPI grid */}
        <div className="grid grid-cols-4 gap-3">
          <KpiCard
            label="Total cost"
            value={fmtEur(totals.totalExpected)}
            sub={`Across ${flow.lanes.length} cost sources`}
          />
          <KpiCard
            label="Reconciled"
            value={trust.formattedPct + "%"}
            sub={`${trust.issuesCount} flag${trust.issuesCount === 1 ? "" : "s"} · ${fmtEur(trust.wrongAccountAmount)} wrong account`}
            accent={trust.formattedPct >= 95 ? "slate" : trust.formattedPct >= 80 ? "amber" : "red"}
          />
          <KpiCard
            label="Collect from tenants"
            value={fmtEur(totals.collectTotal)}
            sub="Net positive deltas"
            accent="amber"
          />
          <KpiCard
            label="Refund to tenants"
            value={fmtEur(totals.refundTotal)}
            sub="Net negative deltas"
            accent="emerald"
          />
        </div>

        {/* Costs at a glance — the simple table view */}
        <CostsAtAGlance flow={flow} onJumpToCostFlow={onJumpToCostFlow} />

        {/* Audiences */}
        <section>
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-900">Audiences</h2>
            <span className="text-[11px] text-slate-500">
              who pays which slice of cost
            </span>
          </div>
          <div className="space-y-2">
            {audiences.map((a) => (
              <AudienceRow
                key={a.id}
                audience={a}
                onOpenInCostFlow={(id) => onJumpToCostFlow?.({ groupId: id })}
              />
            ))}
          </div>
        </section>

        {/* Things to look at */}
        <section>
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-900">Things to look at</h2>
            <span className="text-[11px] text-slate-500">
              auto-curated from flags · highest impact first
            </span>
          </div>
          <div className="space-y-2">
            {issues.length === 0 && (
              <div className="rounded-lg border border-slate-200 p-3 text-[11px] text-slate-500">
                No flags right now — all sources reconcile cleanly.
              </div>
            )}
            {issues.map((i, idx) => (
              <IssueRow
                key={idx}
                icon={i.severity === "error" ? AlertCircle : AlertTriangle}
                severity={i.severity}
                title={i.node.label}
                detail={i.note}
                action="Open in flow"
                onClick={() => onJumpToCostFlow?.(i.laneId)}
              />
            ))}
          </div>
        </section>

        {/* Recent activity */}
        <section>
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
            <span className="text-[11px] text-slate-500">last 30 days</span>
          </div>
          <ul className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
            {activity.map((a, idx) => (
              <li key={idx} className="px-3 py-2 flex items-start gap-3 text-[11px]">
                <span className="text-slate-400 w-20 shrink-0">{a.when}</span>
                <span className="text-slate-700 font-medium w-28 shrink-0 truncate">{a.who}</span>
                <span className="text-slate-600 flex-1 min-w-0">{a.what}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

/* ─── Bookkeeping tab ──────────────────────────────────── */
function StatusPill({ status }) {
  const map = {
    matched:         { color: "text-slate-700",  bg: "bg-slate-100", label: "Matched" },
    matched_partial: { color: "text-amber-700",  bg: "bg-amber-50",  label: "Partial" },
    wrong_account:   { color: "text-red-700",    bg: "bg-red-50",    label: "Wrong account" },
    duplicate:       { color: "text-amber-700",  bg: "bg-amber-50",  label: "Duplicate" },
    missing:         { color: "text-red-700",    bg: "bg-red-50",    label: "Missing" },
  };
  const cfg = map[status] || { color: "text-slate-500", bg: "bg-slate-50", label: status };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.color} ${cfg.bg}`}>
      {cfg.label}
    </span>
  );
}

function BookkeepingTab({ flow }) {
  // Build flat ledger view from anchors on every node
  const rows = useMemo(() => {
    const out = [];
    for (const node of flow.nodes) {
      const settlementCode = node.serviceCode;
      for (const a of node.anchors || []) {
        out.push({
          ledgerAccount: a.ledgerAccount,
          amount: a.amount,
          status: a.status,
          note: a.note,
          source: node.label,
          sourceType: node.type,
          serviceCode:
            settlementCode ||
            // Best-guess: extract trailing service code from ledger account
            (a.ledgerAccount.match(/-(SV\d+G|SN\d+G)/)?.[1] ?? null),
          laneId: node.laneId,
          nodeId: node.id,
        });
      }
    }
    return out;
  }, [flow.nodes]);

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filter === "issues" && r.status === "matched") return false;
      const q = query.toLowerCase().trim();
      if (q && !`${r.ledgerAccount} ${r.source} ${r.serviceCode || ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, filter, query]);

  const totals = useMemo(() => {
    let total = 0;
    let wrongAccount = 0;
    let unanchored = 0;
    for (const r of filtered) {
      total += r.amount;
      if (r.status === "wrong_account") wrongAccount += r.amount;
      if (r.status === "missing") unanchored += r.amount;
    }
    return { total, wrongAccount, unanchored };
  }, [filtered]);

  return (
    <div className="overflow-y-auto h-full">
      <div className="p-6 max-w-[1400px] space-y-4">
        {/* Description */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-3 text-[12px] text-slate-700">
          <div className="font-medium mb-0.5">The inverse-of-graph view</div>
          <div className="text-[11px] text-slate-600">
            Same data as Cost Flow, rotated: every ledger anchor on every node
            of the flow shown as a flat row. Use this tab to reconcile against
            the ERP after the conceptual story checks out in Cost Flow.
          </div>
        </div>

        {/* Topline */}
        <div className="grid grid-cols-3 gap-3">
          <KpiCard label="Anchored amount" value={fmtEur(totals.total)} sub={`${filtered.length} entries`} />
          <KpiCard label="Wrong account" value={fmtEur(totals.wrongAccount)} accent="red" sub="Booked on a different complex/service" />
          <KpiCard label="Missing / unanchored" value={fmtEur(totals.unanchored)} accent="amber" sub="In the conceptual model but not the ledger" />
        </div>

        {/* Filter strip */}
        <div className="flex items-center gap-2 sticky top-0 bg-white z-10 py-1">
          <div className="relative flex-1 max-w-md">
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ledger account, source, service code…"
              className="w-full h-7 pl-6 pr-2 rounded-md border border-slate-200 bg-white text-[11px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
            />
          </div>
          <div className="inline-flex items-center bg-slate-200/60 rounded-md p-0.5 text-[10px]">
            {[
              { v: "all", l: "All" },
              { v: "issues", l: "Issues" },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => setFilter(o.v)}
                className={`px-2 h-5 rounded transition-colors ${
                  filter === o.v
                    ? "bg-white text-slate-900 shadow-sm font-medium"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-400 ml-auto">{filtered.length} of {rows.length}</span>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-[11px]">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="text-left font-semibold px-3 py-2">Ledger account</th>
                <th className="text-left font-semibold px-3 py-2">Service</th>
                <th className="text-left font-semibold px-3 py-2">Source / settlement</th>
                <th className="text-right font-semibold px-3 py-2">Amount</th>
                <th className="text-left font-semibold px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="px-3 py-1.5 font-mono text-[10px] text-slate-700">{r.ledgerAccount}</td>
                  <td className="px-3 py-1.5 font-mono text-[10px] text-slate-600">{r.serviceCode || "—"}</td>
                  <td className="px-3 py-1.5">
                    <div className="text-slate-700 truncate">{r.source}</div>
                    {r.note && <div className="text-[10px] text-slate-400 italic truncate">{r.note}</div>}
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-slate-800">{fmtEur2(r.amount)}</td>
                  <td className="px-3 py-1.5"><StatusPill status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Settlements tab ──────────────────────────────────── */
function SettlementsTab({ flow }) {
  const settlements = useMemo(
    () => flow.nodes.filter((n) => n.type === "settlement" && !n.outOfScope),
    [flow.nodes]
  );

  function dirOf(d) {
    if (d == null) return null;
    if (d > 1) return "collect";
    if (d < -1) return "refund";
    return "balanced";
  }

  return (
    <div className="overflow-y-auto h-full">
      <div className="p-6 max-w-[1400px] space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-3 text-[12px] text-slate-700">
          <div className="font-medium mb-0.5">Settlements on this Complex</div>
          <div className="text-[11px] text-slate-600">
            One row per (Service × Audience × Period). Deep-link into the
            existing settlement workflow to walk the validation → comparison →
            control → publish steps.
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-[11px]">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="text-left font-semibold px-3 py-2">Service</th>
                <th className="text-left font-semibold px-3 py-2">Audience</th>
                <th className="text-right font-semibold px-3 py-2">VHE</th>
                <th className="text-right font-semibold px-3 py-2">Actual</th>
                <th className="text-right font-semibold px-3 py-2">Advance</th>
                <th className="text-right font-semibold px-3 py-2">Delta</th>
                <th className="text-left font-semibold px-3 py-2">Direction</th>
                <th className="text-left font-semibold px-3 py-2">Status</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settlements.map((s) => {
                const dir = dirOf(s.delta);
                const dirColor =
                  dir === "collect" ? "text-amber-700" : dir === "refund" ? "text-emerald-700" : "text-slate-400";
                return (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <td className="px-3 py-1.5 font-mono text-[10px] text-slate-700">{s.serviceCode}</td>
                    <td className="px-3 py-1.5 text-slate-700">{s.subLabel}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-slate-600">{s.vheCount}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-slate-800">{fmtEur(s.amount)}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-slate-600">{s.advance != null ? fmtEur(s.advance) : "—"}</td>
                    <td className={`px-3 py-1.5 text-right tabular-nums font-medium ${dirColor}`}>
                      {s.delta != null ? fmtSignedEur(s.delta) : "—"}
                    </td>
                    <td className="px-3 py-1.5">
                      {dir === "collect" ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 text-[10px]"><TrendingUp size={11} /> Collect</span>
                      ) : dir === "refund" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-[10px]"><TrendingDown size={11} /> Refund</span>
                      ) : dir === "balanced" ? (
                        <span className="inline-flex items-center gap-1 text-slate-500 text-[10px]"><Minus size={11} /> Balanced</span>
                      ) : (
                        <span className="text-slate-400 text-[10px] italic">via Ista</span>
                      )}
                    </td>
                    <td className="px-3 py-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                          s.settlementStatus === "blocked" ? "bg-amber-500" :
                          s.settlementStatus === "finalised" ? "bg-slate-700" :
                          s.settlementStatus === "closed" ? "bg-slate-900" :
                          "bg-slate-400"
                        }`} />
                        {s.settlementStatus || "draft"}
                      </span>
                    </td>
                    <td className="px-3 py-1.5">
                      <button className="text-[10px] text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
                        Open <ExternalLink size={10} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Meters tab (placeholder list) ────────────────────── */
function MetersTab({ flow }) {
  const meters = useMemo(() => {
    const out = [];
    for (const n of flow.nodes) {
      if (n.type !== "source") continue;
      const eanMatch = n.subLabel?.match(/EAN\s+(\d+)/);
      const ean = eanMatch ? eanMatch[1] : null;
      out.push({
        id: n.id,
        name: n.label,
        ean,
        utility: n.utility || "—",
        supplier: n.supplier === "multi" ? "Multiple" : (n.supplier || "—"),
        consumption: n.expectedConsumption,
        unit: n.consumptionUnit,
        amount: n.amount,
      });
    }
    return out;
  }, [flow.nodes]);

  return (
    <div className="overflow-y-auto h-full">
      <div className="p-6 max-w-[1400px] space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-3 text-[12px] text-slate-700">
          <div className="font-medium mb-0.5">Physical assets feeding cost sources</div>
          <div className="text-[11px] text-slate-600">
            Mostly the energy team's tab — meter readings, calibration, EAN
            registry. Most users never need to come here once the Cost Flow's
            sources are mature.
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-[11px]">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="text-left font-semibold px-3 py-2">Source</th>
                <th className="text-left font-semibold px-3 py-2">EAN / identifier</th>
                <th className="text-left font-semibold px-3 py-2">Utility</th>
                <th className="text-left font-semibold px-3 py-2">Supplier</th>
                <th className="text-right font-semibold px-3 py-2">Consumption</th>
                <th className="text-right font-semibold px-3 py-2">Annual cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {meters.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60">
                  <td className="px-3 py-1.5 text-slate-700">{m.name}</td>
                  <td className="px-3 py-1.5 font-mono text-[10px] text-slate-600">{m.ean || "—"}</td>
                  <td className="px-3 py-1.5 capitalize text-slate-600">{m.utility}</td>
                  <td className="px-3 py-1.5 text-slate-600">{m.supplier}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-slate-600">
                    {m.consumption != null ? `${m.consumption.toLocaleString("nl-NL")} ${m.unit || ""}` : "—"}
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-slate-800">{fmtEur(m.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Activity tab (mock log) ──────────────────────────── */
function ActivityTab() {
  const events = [
    { when: "2026-04-21 14:32", who: "M. de Vries", what: "Updated 80/20 split rule", target: 'Electricity meter Blok 2' },
    { when: "2026-04-19 10:11", who: "M. de Vries", what: "Flagged Engie gas booking", target: 'Wrong-account: cpl 2397 instead of 2379 (€92,203)' },
    { when: "2026-04-15 16:08", who: "L. Bakker",   what: "Created ad-hoc audience", target: 'Riolering audience (117 VHE)' },
    { when: "2026-04-12 09:45", who: "M. de Vries", what: "Confirmed advance recommendation", target: 'SV1313G — Huismeester (lower €4.50→€4 mid-year)' },
    { when: "2026-04-08 13:20", who: "L. Bakker",   what: "Linked invoices", target: 'Maro 4-line LED armature → SV1372G Common Blok 1' },
    { when: "2026-04-02 11:55", who: "M. de Vries", what: "Edited deduction", target: 'Privégebruik gem. elektra Blok 2 (-€456.24)' },
    { when: "2026-03-28 17:02", who: "system",      what: "Imported invoices",  target: 'Engie Q1 2024 (12 invoices)' },
    { when: "2026-03-22 08:15", who: "system",      what: "Merged complexes",   target: 'cpl 2379 + cpl 2380 → Zeverijnstraat 30-484' },
  ];
  return (
    <div className="overflow-y-auto h-full">
      <div className="p-6 max-w-[1000px] space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-3 text-[12px] text-slate-700">
          <div className="font-medium mb-0.5">Audit log</div>
          <div className="text-[11px] text-slate-600">
            Every change to splits, audiences, advances, manual adjustments,
            invoice links, and structural moves (merges, recodes) shows up
            here, attributed and timestamped.
          </div>
        </div>
        <ul className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
          {events.map((e, idx) => (
            <li key={idx} className="px-3 py-2 grid grid-cols-[140px_140px_1fr_2fr] gap-3 text-[11px] items-start">
              <span className="text-slate-400 tabular-nums">{e.when}</span>
              <span className="text-slate-700 font-medium truncate">{e.who}</span>
              <span className="text-slate-700">{e.what}</span>
              <span className="text-slate-500 truncate">{e.target}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────── */
export default function GroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [period, setPeriod] = useState(2024);
  // Pending focus the Overview clicked into; threaded into CostFlowView
  const [pendingFocus, setPendingFocus] = useState(null);
  const flow = getCostFlow();

  const activeTab =
    TABS.find((t) => t.id === searchParams.get("tab"))?.id || "overview";

  function setTab(id) {
    const next = new URLSearchParams(searchParams);
    next.set("tab", id);
    setSearchParams(next, { replace: true });
  }

  function jumpToCostFlow(target) {
    // target can be a string (laneId, legacy) or { laneId, groupId }
    const focus =
      typeof target === "string"
        ? { laneId: target }
        : target || {};
    if (focus.laneId || focus.groupId) {
      setPendingFocus({ ...focus, key: Date.now() });
    }
    setTab("cost-flow");
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <ShellHeader
        flow={flow}
        period={period}
        setPeriod={setPeriod}
        onBack={() => navigate(-1)}
      />
      <TabBar tabs={TABS} activeId={activeTab} onChange={setTab} />

      <div className="flex-1 min-h-0 overflow-hidden bg-slate-50/30">
        {activeTab === "overview"    && <OverviewTab flow={flow} onJumpToCostFlow={jumpToCostFlow} />}
        {activeTab === "cost-flow"   && (
          <CostFlowView
            compact={true}
            initialLaneId={pendingFocus?.laneId}
            initialGroupId={pendingFocus?.groupId}
            onJumpToMeters={() => setTab("meters")}
            // remount when key changes so the focus + scroll fire reliably
            key={pendingFocus?.key || "default"}
          />
        )}
        {activeTab === "bookkeeping" && <BookkeepingTab flow={flow} />}
        {activeTab === "settlements" && <SettlementsTab flow={flow} />}
        {activeTab === "meters"      && <MetersTab flow={flow} />}
        {activeTab === "activity"    && <ActivityTab />}
      </div>
    </div>
  );
}
