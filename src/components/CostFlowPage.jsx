import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Layers,
  Calendar,
  Eye,
  EyeOff,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  Zap,
  Flame,
  Sparkles,
  HardHat,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Split,
  Users,
  CircleDot,
  Link2,
  ChevronRight,
  Gauge,
  FlaskConical,
  Search,
  ChevronDown,
  ArrowUpDown,
  Filter,
  Check,
  Focus,
  Receipt,
  Repeat,
  Droplets,
  HelpCircle,
  MoreHorizontal,
  Settings2,
} from "lucide-react";
import { brand } from "@/lib/brand";
import { useLang } from "@/lib/i18n";
import {
  getCostFlow,
  getNodeById,
  getEdgesForNode,
  getSettlementsByGroup,
  getConnectedSubgraph,
  getLaneSubgraph,
  getAudienceSubgraph,
  getAllAudiences,
  getLaneServiceCodes,
  summariseLane,
  anchorStatusBucket,
  computeTrust,
  fmtEur,
  fmtEur2,
  fmtSignedEur,
} from "@/lib/costFlow";

/* ── Layout constants ── */
const COL_WIDTH = 240;
const ROW_HEIGHT = 96;
const LANE_TITLE_HEIGHT = 32;
const LANE_PADDING_TOP = 8;
const LANE_PADDING_BOTTOM = 16;
const CANVAS_LEFT_PAD = 16;

/* Per-type node geometry. Sources and settlements are full-size cards;
 * splits are operator-sized; passthroughs are tiny in-line markers;
 * deductions and additions are slim chips. */
const NODE_SIZES = {
  source:      { w: 208, h: 84 },
  settlement:  { w: 220, h: 84 },
  split:       { w: 164, h: 60 },
  deduction:   { w: 184, h: 48 },
  addition:    { w: 184, h: 48 },
  passthrough: { w: 156, h: 36 },
};
function nodeSize(type) {
  return NODE_SIZES[type] || { w: 188, h: 64 };
}

/* Category icons (neutral palette — type differentiated by glyph only) */
const categoryIcon = {
  energy: Zap,
  cleaning: Sparkles,
  management: HardHat,
  other: FileText,
};

/* Node type → glyph */
const typeIcon = {
  source: CircleDot,
  split: Split,
  passthrough: ChevronRight,
  deduction: Minus,
  addition: Plus,
  settlement: Users,
};

/* Health → text */
const healthBadge = {
  matched: { dot: "bg-slate-300", label: "Reconciled" },
  warning: { dot: "bg-amber-500", label: "Has warnings" },
  error: { dot: "bg-red-500", label: "Has errors" },
};

const COLLAPSED_LANE_HEIGHT = 32;

/* Compute lane geometry. activeLaneIds (optional Set) marks lanes that should
 * render at full height; everything else collapses to a thin strip. */
function buildLaneLayout(flow, activeLaneIds = null) {
  const layout = {};
  let y = 0;
  for (const lane of flow.lanes) {
    const nodes = flow.nodes.filter((n) => n.laneId === lane.id);
    const maxRow = nodes.reduce((m, n) => Math.max(m, n.row || 0), 0);
    const rowsCount = maxRow + 1;
    const isCollapsed =
      activeLaneIds != null && !activeLaneIds.has(lane.id);
    const height = isCollapsed
      ? COLLAPSED_LANE_HEIGHT
      : LANE_TITLE_HEIGHT + LANE_PADDING_TOP + rowsCount * ROW_HEIGHT + LANE_PADDING_BOTTOM;
    layout[lane.id] = { y, height, rowsCount, isCollapsed };
    y += height;
  }
  return { lanes: layout, totalHeight: y };
}

function nodePosition(node, laneLayout) {
  const lane = laneLayout.lanes[node.laneId];
  const { w, h } = nodeSize(node.type);
  // Slot left + center horizontally within slot column
  const slotLeft = CANVAS_LEFT_PAD + node.col * COL_WIDTH;
  const slotInnerWidth = COL_WIDTH - 12;
  const x = slotLeft + (slotInnerWidth - w) / 2;
  // Slot top + center vertically within row
  const slotTop = lane.y + LANE_TITLE_HEIGHT + LANE_PADDING_TOP + (node.row || 0) * ROW_HEIGHT;
  const y = slotTop + (ROW_HEIGHT - h) / 2;
  return { x, y, width: w, height: h };
}

/* ──────────────────────────────────────────────────────────── */
/* Header strip                                                 */
/* ──────────────────────────────────────────────────────────── */
function ViewOptionsMenu({
  overlay,
  setOverlay,
  focusMode,
  setFocusMode,
  focusActive,
  showEdgeLabels,
  setShowEdgeLabels,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const Toggle = ({ checked, onChange, disabled, label, hint }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`w-full flex items-start gap-2.5 px-2.5 py-1.5 rounded-md text-left transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"
      }`}
    >
      <span
        className={`mt-0.5 w-7 h-4 rounded-full p-0.5 transition-colors shrink-0 ${
          checked ? "bg-slate-900" : "bg-slate-200"
        }`}
      >
        <span
          className={`block w-3 h-3 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-3" : "translate-x-0"
          }`}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] text-slate-800 font-medium leading-tight">{label}</span>
        {hint && <span className="block text-[10px] text-slate-500 leading-tight mt-0.5">{hint}</span>}
      </span>
    </button>
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-[11px] font-medium transition-colors ${
          open ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        <Settings2 size={12} />
        View
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-72 rounded-lg border border-slate-200 bg-white shadow-md z-30 py-1.5">
          <Toggle
            checked={overlay}
            onChange={setOverlay}
            label="Bookkeeping overlay"
            hint="Show ledger anchor pills under each node"
          />
          <Toggle
            checked={focusMode}
            onChange={setFocusMode}
            disabled={!focusActive}
            label="Focus on selected"
            hint={focusActive ? "Hide non-connected lanes" : "Select a node, lane, or audience first"}
          />
          <div className="h-px bg-slate-100 my-1 mx-2" />
          <Toggle
            checked={showEdgeLabels}
            onChange={setShowEdgeLabels}
            label="Always show edge labels"
            hint="Default: shown only on hover"
          />
        </div>
      )}
    </div>
  );
}

/* Tiny tile used in the toolbar */
function ToolbarTile({ label, value, sub, accent }) {
  const accentValue = {
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
    <div className={`rounded-md border px-2 py-1 min-w-[84px] ${borderClass}`}>
      <div className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold leading-none">
        {label}
      </div>
      <div className={`text-[13px] font-semibold tabular-nums leading-tight mt-0.5 ${accentValue}`}>
        {value}
      </div>
      {sub && (
        <div className="text-[9px] text-slate-500 leading-tight">{sub}</div>
      )}
    </div>
  );
}

const TOOLBAR_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "issues", label: "Issues" },
  { value: "settle", label: "To settle" },
];

function Header({
  flow,
  overlay, setOverlay,
  focusMode, setFocusMode,
  focusActive,
  showEdgeLabels, setShowEdgeLabels,
  onOpenHelp,
  onBack,
  compact = false,
}) {

  // Standalone (legacy /:orgId/cost-flow route) — keeps the identity bar
  if (!compact) {
    return (
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-700 mb-2"
            >
              <ArrowLeft size={12} /> Buildings
            </button>
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
          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-600">
              <Calendar size={12} className="text-slate-400" />
              Period {flow.period}
            </div>
            <button
              onClick={onOpenHelp}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              title="How to read this"
            >
              <HelpCircle size={14} />
            </button>
            <ViewOptionsMenu
              overlay={overlay}
              setOverlay={setOverlay}
              focusMode={focusMode}
              setFocusMode={setFocusMode}
              focusActive={focusActive}
              showEdgeLabels={showEdgeLabels}
              setShowEdgeLabels={setShowEdgeLabels}
            />
          </div>
        </div>
      </div>
    );
  }

  // Compact (in-tab) — no toolbar. Help + View options live in the
  // audiences band's right edge (see CostFlowView).
  return null;
}

/* ──────────────────────────────────────────────────────────── */
/* Audiences band                                              */
/* ──────────────────────────────────────────────────────────── */

const AUDIENCE_KIND = {
  complex:  { label: "Complex",   stripe: "bg-slate-700",  badge: "text-slate-700 bg-slate-100 border-slate-200" },
  block:    { label: "Block",     stripe: "bg-slate-500",  badge: "text-slate-700 bg-slate-100 border-slate-200" },
  adhoc:    { label: "Ad-hoc",    stripe: "bg-amber-500",  badge: "text-amber-800 bg-amber-50 border-amber-200" },
  external: { label: "External",  stripe: "bg-slate-300",  badge: "text-slate-500 bg-slate-50 border-slate-200" },
};

function AudienceCard({ audience, isSelected, isHovered, onClick, onHoverEnter, onHoverLeave }) {
  const cfg = AUDIENCE_KIND[audience.kind] || AUDIENCE_KIND.adhoc;

  return (
    <button
      onClick={onClick}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
      className={`relative shrink-0 flex items-stretch rounded-lg border bg-white text-left transition-all ${
        isSelected
          ? "border-slate-900 shadow-sm ring-1 ring-slate-900"
          : isHovered
          ? "border-slate-400"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Identity stripe */}
      <span className={`w-1 rounded-l-lg ${cfg.stripe}`} aria-hidden />

      <div className="px-3 py-2 min-w-[180px]">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`inline-flex items-center px-1.5 h-4 rounded text-[9px] uppercase tracking-widest font-semibold border ${cfg.badge}`}>
            {cfg.label}
          </span>
          <span className="text-[10px] text-slate-400 tabular-nums">
            {audience.vheCount} VHE
          </span>
        </div>
        <div className="text-[12px] text-slate-800 truncate font-medium leading-tight">
          {audience.name}
        </div>
        <div className="mt-1 flex items-center gap-2 text-[10px]">
          <span className="text-slate-500 tabular-nums">{fmtEur(audience.settled)}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500">
            {audience.settlementCount} {audience.settlementCount === 1 ? "service" : "services"}
          </span>
          {audience.flagCount > 0 && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-amber-700 font-semibold">{audience.flagCount} flag{audience.flagCount === 1 ? "" : "s"}</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}

function AudiencesBand({ selectedGroupId, setSelectedGroupId, setHoveredGroupId, hoveredGroupId, rightActions }) {
  const audiences = useMemo(() => getAllAudiences(), []);

  return (
    <div className="border-b border-slate-200 bg-slate-50/40 px-6 py-2.5">
      <div className="flex items-center gap-3">
        <div className="shrink-0 flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
            Audiences
          </span>
          <span className="text-[10px] text-slate-400">
            who pays this cost
          </span>
        </div>
        <div className="flex items-stretch gap-2 flex-1 min-w-0 overflow-x-auto pb-0.5">
          {audiences.map((a) => (
            <AudienceCard
              key={a.id}
              audience={a}
              isSelected={selectedGroupId === a.id}
              isHovered={hoveredGroupId === a.id}
              onClick={() => setSelectedGroupId(selectedGroupId === a.id ? null : a.id)}
              onHoverEnter={() => setHoveredGroupId(a.id)}
              onHoverLeave={() => setHoveredGroupId((p) => (p === a.id ? null : p))}
            />
          ))}
          {selectedGroupId && (
            <button
              onClick={() => setSelectedGroupId(null)}
              className="shrink-0 px-2 self-center text-[10px] text-slate-500 hover:text-slate-900 underline"
            >
              clear
            </button>
          )}
        </div>
        {rightActions && (
          <div className="shrink-0 flex items-center gap-1.5 pl-2 border-l border-slate-200">
            {rightActions}
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Source rail (left)                                           */
/* ──────────────────────────────────────────────────────────── */

const CATEGORY_ORDER = ["energy", "cleaning", "management", "other"];
const categoryLabel = {
  energy: "Energy",
  cleaning: "Cleaning",
  management: "Management",
  other: "Other",
};

const SORT_OPTIONS = [
  { value: "category", label: "By category" },
  { value: "cost", label: "By cost (largest)" },
  { value: "health", label: "By health (issues first)" },
  { value: "alpha", label: "Alphabetical" },
];

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "issues", label: "Issues" },
  { value: "settle", label: "To settle" },
];

function laneTotalsTopline(lanes) {
  let totalExpected = 0;
  let issueCount = 0;
  let issueLanes = 0;
  let collectTotal = 0;
  let refundTotal = 0;
  for (const lane of lanes) {
    const s = summariseLane(lane.id);
    totalExpected += s.expected;
    issueCount += s.issueCount;
    if (s.health !== "matched") issueLanes++;
    if (s.netDelta != null) {
      if (s.netDelta > 0) collectTotal += s.netDelta;
      else if (s.netDelta < 0) refundTotal += Math.abs(s.netDelta);
    }
  }
  return { totalExpected, issueCount, issueLanes, collectTotal, refundTotal };
}

function LaneRow({ lane, summary, isSelected, onClick }) {
  const Icon = categoryIcon[lane.category] || FileText;
  const health = healthBadge[summary.health];
  const yoyPct = summary.yoyPct;
  const yoyVisible = yoyPct != null && Math.abs(yoyPct) >= 0.02;
  const yoyColor = yoyPct > 0.02 ? "text-amber-700" : yoyPct < -0.02 ? "text-emerald-700" : "text-slate-500";

  const dir = summary.settlementDirection;
  const deltaColor = dir === "collect" ? "text-amber-700" : dir === "refund" ? "text-emerald-700" : "text-slate-400";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-2.5 px-4 py-2.5 border-l-2 text-left transition-colors ${
        isSelected
          ? "bg-white border-l-slate-900"
          : "border-l-transparent hover:bg-slate-100/60"
      }`}
    >
      <div className="mt-0.5 w-6 h-6 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-500 shrink-0">
        <Icon size={12} strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] text-slate-800 leading-tight truncate">{lane.title}</div>
        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${health.dot}`} />
          <span className="text-[11px] text-slate-500 tabular-nums">{fmtEur(summary.expected)}</span>
          {summary.netDelta != null && Math.abs(summary.netDelta) > 1 && (
            <span className={`text-[10px] tabular-nums ${deltaColor}`}>
              {fmtSignedEur(summary.netDelta)}
            </span>
          )}
          {yoyVisible && (
            <span className={`inline-flex items-center text-[10px] ${yoyColor}`}>
              {yoyPct > 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              {Math.abs(Math.round(yoyPct * 100))}%
            </span>
          )}
          {summary.issueCount > 0 && (
            <span className="ml-auto text-[10px] uppercase tracking-widest text-amber-700 font-semibold">
              {summary.issueCount} flag{summary.issueCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function SourceRail({
  flow,
  selectedLaneId,
  effectiveLaneId,
  setSelectedLaneId,
  scrollToLane,
  query,
  setQuery,
}) {
  // Sections start expanded — explicit Set initialised with every category
  const [expanded, setExpanded] = useState(() => new Set(CATEGORY_ORDER));

  const summaries = useMemo(() => {
    const m = {};
    for (const lane of flow.lanes) m[lane.id] = summariseLane(lane.id);
    return m;
  }, [flow.lanes]);

  const laneCodes = useMemo(() => {
    const m = {};
    for (const lane of flow.lanes) m[lane.id] = getLaneServiceCodes(lane.id);
    return m;
  }, [flow.lanes]);

  // Search-only filter
  const filteredLanes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return flow.lanes;
    return flow.lanes.filter((lane) => {
      const titleMatch = lane.title.toLowerCase().includes(q);
      const codeMatch = laneCodes[lane.id]?.some((c) => c.toLowerCase().includes(q));
      return titleMatch || codeMatch;
    });
  }, [flow.lanes, query, laneCodes]);

  // Always group by category — the only ordering the rail ever uses now
  const grouped = useMemo(() => {
    const out = {};
    for (const c of CATEGORY_ORDER) out[c] = [];
    for (const lane of filteredLanes) {
      const c = CATEGORY_ORDER.includes(lane.category) ? lane.category : "other";
      out[c].push(lane);
    }
    return out;
  }, [filteredLanes]);


  function toggleSection(cat) {
    setExpanded((e) => {
      const next = new Set(e);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  return (
    <aside className="w-[260px] shrink-0 border-r border-slate-200 bg-slate-50/50 flex flex-col h-full">
      {/* Sticky search — only thing in the rail header now */}
      <div className="border-b border-slate-200 bg-slate-50/95 backdrop-blur sticky top-0 z-10 px-3 py-2">
        <div className="relative">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lane or code…"
            className="w-full h-7 pl-6 pr-6 rounded-md border border-slate-200 bg-white text-[11px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-sm flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X size={10} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {filteredLanes.length === 0 && (
          <div className="px-4 py-8 text-center text-[11px] text-slate-400">
            No matching lanes.
            <button
              onClick={() => setQuery("")}
              className="block mx-auto mt-2 text-[11px] text-slate-600 hover:text-slate-900 underline"
            >
              Clear search
            </button>
          </div>
        )}

        {CATEGORY_ORDER.map((cat) => {
          const lanes = grouped[cat];
          if (!lanes || lanes.length === 0) return null;
          const isOpen = expanded.has(cat);
          const Icon = categoryIcon[cat] || FileText;
          const sectionTotal = lanes.reduce((s, l) => s + summaries[l.id].expected, 0);
          const sectionFlags = lanes.reduce((s, l) => s + summaries[l.id].issueCount, 0);
          return (
            <div key={cat}>
              <button
                onClick={() => toggleSection(cat)}
                aria-expanded={isOpen}
                className="w-full px-3 py-1.5 flex items-center gap-2 text-left bg-slate-100/40 border-y border-slate-200/60 hover:bg-slate-100/80 group"
              >
                <Icon size={11} className="text-slate-400 shrink-0" />
                <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-500">
                  {categoryLabel[cat] || cat}
                </span>
                <span className="text-[10px] text-slate-400">· {lanes.length}</span>
                <span className="ml-auto text-[10px] text-slate-400 tabular-nums">
                  {fmtEur(sectionTotal)}
                  {sectionFlags > 0 && (
                    <span className="ml-1 text-amber-700">· {sectionFlags}</span>
                  )}
                </span>
                <ChevronDown
                  size={11}
                  className={`text-slate-400 shrink-0 transition-transform ${isOpen ? "" : "-rotate-90"}`}
                />
              </button>
              {isOpen && (
                <ul className="list-none m-0 p-0">
                  {lanes.map((lane) => (
                    <li key={lane.id} className="list-none">
                      <LaneRow
                        lane={lane}
                        summary={summaries[lane.id]}
                        isSelected={(effectiveLaneId || selectedLaneId) === lane.id}
                        onClick={() => {
                          setSelectedLaneId(lane.id);
                          scrollToLane(lane.id);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Canvas — SVG edges + absolutely-positioned node cards        */
/* ──────────────────────────────────────────────────────────── */
/* Map a settlement node's audience kind to a stripe colour */
function audienceStripeFor(node) {
  // Look up the sibling group to read its `kind`
  const flow = getCostFlow();
  const g = flow.siblingGroups?.find((x) => x.id === node.groupId);
  const kind = g?.kind || "adhoc";
  return AUDIENCE_KIND[kind]?.stripe || "bg-slate-300";
}

const SOURCE_STRIPES = {
  electricity: "bg-slate-700",
  gas: "bg-slate-700",
  water: "bg-slate-700",
  default: "bg-slate-500",
};

/* Source kind taxonomy — every source belongs to exactly one. The icon
 * for "metered" comes from utility (Zap/Flame/Droplets); other kinds use
 * a fixed icon. Labels are short — they're what shows in the chip. */
const SOURCE_KIND = {
  metered:      { label: "Metered",      defaultIcon: Gauge },
  contracted:   { label: "Contract",     defaultIcon: FileText },
  pass_through: { label: "Pass-through", defaultIcon: Receipt },
  recurring:    { label: "Recurring",    defaultIcon: Repeat },
  internal:     { label: "Internal",     defaultIcon: HardHat },
};

const UTILITY_ICONS = {
  electricity: Zap,
  gas: Flame,
  water: Droplets,
  heat: Flame,
};

function sourceKindIcon(node) {
  if (node.sourceKind === "metered" && node.utility) {
    return UTILITY_ICONS[node.utility] || Gauge;
  }
  return SOURCE_KIND[node.sourceKind]?.defaultIcon || CircleDot;
}

const CADENCE_LABEL = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  annual: "Annual",
  ad_hoc: "On-demand",
};

/* Build the canvas subtitle. Same format for every source so the user
 * reads one pattern, not five exceptions:  "{counterparty} · {origin}". */
function sourceCanvasSubtitle(node) {
  const isMulti = node.supplier === "multi";
  const primary = isMulti
    ? node.supplierBreakdown?.[0]?.name
    : node.supplier;
  const supplierLabel = isMulti
    ? `${primary || "Multi"} +${(node.supplierBreakdown?.length || 1) - 1}`
    : primary || "—";

  if (node.sourceKind === "metered") {
    if (node.expectedConsumption && node.consumptionUnit) {
      return `${supplierLabel} · ${node.expectedConsumption.toLocaleString("nl-NL")} ${node.consumptionUnit}`;
    }
    return `${supplierLabel} · ${CADENCE_LABEL[node.cadence] || node.cadence}`;
  }
  if (node.sourceKind === "contracted") {
    return `${supplierLabel} · ${CADENCE_LABEL[node.cadence] || node.cadence}`;
  }
  if (node.sourceKind === "pass_through") {
    return `On-demand · variable invoices`;
  }
  if (node.sourceKind === "recurring") {
    return `${supplierLabel} · ${CADENCE_LABEL[node.cadence] || node.cadence}`;
  }
  if (node.sourceKind === "internal") {
    return `Internal · ${CADENCE_LABEL[node.cadence] || node.cadence}`;
  }
  return supplierLabel;
}

function NodeCard({ node, overlay, isSelected, isHovered, dim, onSelect, onHoverEnter, onHoverLeave }) {
  const dimClass = node.outOfScope ? "opacity-50" : dim ? "opacity-30" : "";
  const ringClass = isSelected
    ? "ring-2 ring-slate-900 ring-offset-2"
    : isHovered
    ? "ring-1 ring-slate-500"
    : "";

  const errorFlag = node.flags?.find((f) => f.kind === "error");
  const warnFlag = node.flags?.find((f) => f.kind === "warning");
  const flagIcon = errorFlag
    ? { Icon: AlertCircle, color: "text-red-600", note: errorFlag.note }
    : warnFlag
    ? { Icon: AlertTriangle, color: "text-amber-600", note: warnFlag.note }
    : null;

  const anchorBucket =
    node.anchors && node.anchors.length > 0
      ? Math.max(
          ...node.anchors.map((a) => {
            const b = anchorStatusBucket(a.status);
            return b === "error" ? 3 : b === "warn" ? 2 : b === "ok" ? 1 : 0;
          })
        )
      : 0;
  const anchorColor =
    anchorBucket === 3
      ? "text-red-600"
      : anchorBucket === 2
      ? "text-amber-700"
      : anchorBucket === 1
      ? "text-slate-500"
      : "text-slate-300";

  const containerProps = {
    onClick: (e) => { e.stopPropagation(); onSelect(node.id); },
    onMouseEnter: () => onHoverEnter && onHoverEnter(node.id),
    onMouseLeave: () => onHoverLeave && onHoverLeave(node.id),
    className: `absolute cursor-pointer transition-[box-shadow,opacity] duration-150 ${dimClass} ${ringClass}`,
    style: { left: node._x, top: node._y, width: node._w, height: node._h },
  };

  /* ── Source (input — identity stripe + chip on the LEFT) ── */
  if (node.type === "source") {
    const stripe = SOURCE_STRIPES[node.utility] || SOURCE_STRIPES.default;
    const KindIcon = sourceKindIcon(node);
    const kindLabel = SOURCE_KIND[node.sourceKind]?.label || "Source";
    const subtitle = sourceCanvasSubtitle(node);
    return (
      <div {...containerProps} className={`${containerProps.className} flex items-stretch rounded-lg border border-slate-300 bg-white hover:shadow-sm`}>
        <span className={`w-1.5 rounded-l-lg ${stripe}`} aria-hidden />
        <div className="flex-1 min-w-0 px-2.5 py-2 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1.5">
            <span className="inline-flex items-center gap-1 px-1.5 h-[18px] rounded text-[10px] uppercase tracking-widest font-semibold text-slate-700 bg-slate-100 border border-slate-200">
              <KindIcon size={10} strokeWidth={2} />
              {kindLabel}
            </span>
            {flagIcon && (
              <span className={flagIcon.color} title={flagIcon.note}>
                <flagIcon.Icon size={12} />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-slate-900 leading-tight truncate">
              {node.label}
            </div>
            <div className="text-[11px] text-slate-500 leading-tight truncate">
              {subtitle}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-[12px] font-semibold tabular-nums text-slate-800">
              {fmtEur(node.amount)}
            </div>
            {overlay && node.anchors && node.anchors.length > 0 && (
              <span className={`inline-flex items-center gap-0.5 text-[10px] ${anchorColor}`}>
                <Link2 size={10} /> {node.anchors.length}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Settlement (output — audience pill + identity stripe on the RIGHT,
   * subtle slate-50 inner bg to feel like a "destination"). ── */
  if (node.type === "settlement") {
    const stripe = audienceStripeFor(node);
    const flow = getCostFlow();
    const sibling = flow.siblingGroups?.find((g) => g.id === node.groupId);
    const audienceName = sibling?.name || node.groupId;
    const audienceVhe = node.vheCount;
    const audienceKind = sibling?.kind || "adhoc";

    // For the Complex audience the page header already names the building.
    // The pill says just "Complex" + count to avoid redundancy. Block / ad-hoc
    // keep their (typically short) name.
    const pillLabel = audienceKind === "complex" ? "Complex" : audienceName;
    const pillTone =
      audienceKind === "complex"
        ? "text-slate-700 bg-slate-100 border-slate-200"
        : audienceKind === "block"
        ? "text-slate-700 bg-slate-50 border-slate-200"
        : "text-amber-800 bg-amber-50 border-amber-200";

    // External (out-of-scope) settlements use a calmer treatment
    if (node.outOfScope) {
      return (
        <div {...containerProps} className={`${containerProps.className} flex items-stretch rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:shadow-sm`}>
          <div className="flex-1 min-w-0 px-2.5 py-2 flex flex-col justify-between">
            <span className="inline-flex items-center px-1.5 h-[18px] rounded text-[10px] uppercase tracking-widest font-semibold text-slate-500 bg-white border border-slate-200 self-start">
              External
            </span>
            <div className="text-[12px] text-slate-700 leading-tight truncate">{node.label}</div>
            <div className="text-[12px] font-semibold tabular-nums text-slate-700">
              {fmtEur(node.amount)}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div {...containerProps} className={`${containerProps.className} flex items-stretch rounded-lg border border-slate-300 bg-slate-50/50 hover:shadow-sm`}>
        <div className="flex-1 min-w-0 px-2.5 py-2 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1.5">
            {flagIcon && (
              <span className={`order-2 ${flagIcon.color}`} title={flagIcon.note}>
                <flagIcon.Icon size={12} />
              </span>
            )}
            {/* Audience pill — kind label + VHE count, truncates if long. */}
            <span
              className={`inline-flex items-center gap-1 px-1.5 h-[18px] rounded text-[10px] uppercase tracking-widest font-semibold border ml-auto max-w-[170px] ${pillTone}`}
            >
              <span className={`inline-block w-1 h-2.5 rounded-sm shrink-0 ${stripe}`} aria-hidden />
              <span className="truncate">{pillLabel}</span>
              {audienceVhe != null && (
                <span className="text-slate-400 normal-case tracking-normal font-normal shrink-0">· {audienceVhe} VHE</span>
              )}
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-slate-900 leading-tight truncate">
              {node.label}
            </div>
            <div className="text-[11px] text-slate-500 leading-tight truncate">
              Settles to {audienceName.toLowerCase()}
            </div>
          </div>
          <div className="flex items-end justify-between gap-1.5">
            <div className="text-[12px] font-semibold tabular-nums text-slate-800">
              {fmtEur(node.amount)}
            </div>
            {node.delta != null && (
              <span
                className={`inline-flex items-center gap-0.5 text-[11px] tabular-nums font-medium ${
                  node.delta > 0
                    ? "text-amber-700"
                    : node.delta < 0
                    ? "text-emerald-700"
                    : "text-slate-400"
                }`}
              >
                {node.delta > 0 ? <TrendingUp size={10} /> : node.delta < 0 ? <TrendingDown size={10} /> : null}
                {fmtSignedEur(node.delta)}
              </span>
            )}
          </div>
        </div>
        <span className={`w-1.5 rounded-r-lg ${stripe}`} aria-hidden />
      </div>
    );
  }

  /* ── Split (compact dashed operator — rule is the headline) ── */
  if (node.type === "split") {
    const ruleSummary =
      node.rule === "fixed_pct"
        ? Object.entries(node.ruleSpec || {})
            .map(([, v]) => `${Math.round(v * 100)}%`)
            .join(" / ")
        : node.rule === "by_count"
        ? `${node.ruleSpec?.denominator ? "n/" + node.ruleSpec.denominator : "by count"}`
        : node.rule === "by_meter"
        ? "by meter"
        : node.rule === "by_area"
        ? "by area"
        : "split";
    return (
      <div {...containerProps} className={`${containerProps.className} rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-slate-400 hover:shadow-sm`}>
        <div className="h-full flex flex-col px-2.5 py-1.5">
          {/* Chip row — chip left, optional flag right */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-1.5 h-[16px] rounded text-[10px] uppercase tracking-widest font-semibold text-slate-700 bg-white border border-slate-200">
              <Split size={9} strokeWidth={2} /> Split
            </span>
            {flagIcon && (
              <span className={flagIcon.color} title={flagIcon.note}>
                <flagIcon.Icon size={11} />
              </span>
            )}
          </div>
          {/* Rule + sub-label centered in the remaining space */}
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center">
            <div className="text-[12px] font-semibold text-slate-800 tabular-nums leading-none">
              {ruleSummary}
            </div>
            <div className="text-[11px] text-slate-500 truncate w-full mt-0.5">
              {node.subLabel || node.label}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Deduction / Addition (slim signed chips, sign carries the type) ── */
  if (node.type === "deduction" || node.type === "addition") {
    const isAdd = node.type === "addition";
    const SignIcon = isAdd ? Plus : Minus;
    return (
      <div {...containerProps} className={`${containerProps.className} flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white hover:shadow-sm px-2.5`}>
        <span
          className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
            isAdd
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
          title={isAdd ? "Addition" : "Deduction"}
        >
          <SignIcon size={13} strokeWidth={2.5} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[12px] text-slate-800 leading-tight truncate font-medium">
            {node.label}
          </div>
          {node.subLabel && (
            <div className="text-[11px] text-slate-500 leading-tight truncate">
              {node.subLabel}
            </div>
          )}
        </div>
        <div className="shrink-0 text-[12px] font-semibold tabular-nums text-slate-800">
          {isAdd ? "+" : "−"}
          {fmtEur(Math.abs(node.amount))}
        </div>
        {flagIcon && (
          <span className={`shrink-0 ${flagIcon.color}`} title={flagIcon.note}>
            <flagIcon.Icon size={12} />
          </span>
        )}
      </div>
    );
  }

  /* ── Passthrough (slim inline marker carrying name + amount) ── */
  if (node.type === "passthrough") {
    return (
      <div {...containerProps} className={`${containerProps.className} flex items-center gap-2 rounded-md bg-slate-100/80 border border-slate-200 px-2.5 hover:bg-slate-100`}>
        <ChevronRight size={11} className="text-slate-400 shrink-0" />
        <div className="min-w-0 flex-1 text-[11px] text-slate-700 truncate" title={node.label}>
          {node.label}
        </div>
        <div className="text-[11px] tabular-nums text-slate-800 font-medium shrink-0">
          {fmtEur(node.amount)}
        </div>
      </div>
    );
  }

  return null;
}

function Canvas({
  flow,
  selectedNodeId,
  setSelectedNodeId,
  overlay,
  hoveredNodeId,
  setHoveredNodeId,
  hoverHighlight,
  focusVisibility,
  showEdgeLabels,
  setSelectedLaneId,
  canvasRef,
  laneRefs,
  onBackgroundClick,
}) {
  // Lanes that contain at least one visible node when focusVisibility is set.
  // When no focus is active, all lanes are active (full height).
  const activeLaneIds = useMemo(() => {
    if (!focusVisibility) return null;
    const set = new Set();
    for (const n of flow.nodes) {
      if (focusVisibility.nodes.has(n.id)) set.add(n.laneId);
    }
    return set;
  }, [flow.nodes, focusVisibility]);

  const layout = useMemo(
    () => buildLaneLayout(flow, activeLaneIds),
    [flow, activeLaneIds]
  );

  // Decorate nodes with computed pixel positions and per-type size
  const positionedNodes = useMemo(() => {
    return flow.nodes.map((n) => {
      const pos = nodePosition(n, layout);
      return { ...n, _x: pos.x, _y: pos.y, _w: pos.width, _h: pos.height };
    });
  }, [flow, layout]);

  const nodeById = useMemo(() => {
    const m = {};
    for (const n of positionedNodes) m[n.id] = n;
    return m;
  }, [positionedNodes]);

  // Hover-driven highlight subgraph (passed in from the page)
  const hoverSet = hoverHighlight;

  // Compute canvas width
  const maxCol = positionedNodes.reduce((m, n) => Math.max(m, n.col), 0);
  const canvasWidth = CANVAS_LEFT_PAD + (maxCol + 1) * COL_WIDTH + 80;

  return (
    <div
      ref={canvasRef}
      className="relative flex-1 overflow-auto bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.04)_1px,transparent_0)] [background-size:20px_20px]"
      onClick={(e) => { if (e.target === e.currentTarget) onBackgroundClick?.(); }}
    >
      <div
        className="relative"
        style={{ width: canvasWidth, height: layout.totalHeight, minWidth: "100%" }}
        onClick={(e) => { if (e.target === e.currentTarget) onBackgroundClick?.(); }}
      >
        {/* Lane bands + titles */}
        {flow.lanes.map((lane, i) => {
          const l = layout.lanes[lane.id];
          const summary = summariseLane(lane.id);
          const Icon = categoryIcon[lane.category] || FileText;
          const health = healthBadge[summary.health];

          if (l.isCollapsed) {
            // Compact strip — click to switch focus to this lane
            return (
              <button
                key={lane.id}
                ref={(el) => (laneRefs.current[lane.id] = el)}
                onClick={() => setSelectedLaneId?.(lane.id)}
                className="absolute left-0 right-0 px-4 flex items-center gap-2 bg-slate-50/60 border-b border-slate-200/60 hover:bg-slate-100/60 group text-left"
                style={{ top: l.y, height: l.height }}
                title={`Switch focus to ${lane.title}`}
              >
                <Icon size={11} strokeWidth={1.5} className="text-slate-400 shrink-0" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 shrink-0">
                  {lane.title}
                </span>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${health.dot} shrink-0`} />
                <span className="text-[10px] text-slate-400 ml-auto pr-2 tabular-nums shrink-0 group-hover:text-slate-600">
                  {fmtEur(summary.expected)}
                  {summary.netDelta != null && Math.abs(summary.netDelta) > 1 && (
                    <span
                      className={`ml-2 ${
                        summary.netDelta > 0 ? "text-amber-700" : "text-emerald-700"
                      }`}
                    >
                      {fmtSignedEur(summary.netDelta)}
                    </span>
                  )}
                  <span className="ml-2 text-slate-400 group-hover:text-slate-700">↗</span>
                </span>
              </button>
            );
          }

          return (
            <div
              key={lane.id}
              ref={(el) => (laneRefs.current[lane.id] = el)}
              className={`absolute left-0 right-0 ${i % 2 === 0 ? "bg-white/60" : "bg-slate-50/40"}`}
              style={{ top: l.y, height: l.height }}
            >
              {/* Lane title — primary navigation surface now that the rail is gone */}
              <div className="absolute left-0 right-0 top-0 h-8 px-4 flex items-center gap-2 border-b border-dashed border-slate-200">
                <Icon size={12} strokeWidth={1.5} className="text-slate-400 shrink-0" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 shrink-0">
                  {lane.title}
                </span>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${health.dot} shrink-0`} />
                {summary.issueCount > 0 && (
                  <span className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold shrink-0">
                    {summary.issueCount} flag{summary.issueCount === 1 ? "" : "s"}
                  </span>
                )}
                <span className="ml-auto flex items-center gap-2.5 pr-2 shrink-0">
                  <span className="text-[11px] text-slate-500 tabular-nums">
                    {fmtEur(summary.expected)}
                  </span>
                  {summary.netDelta != null && Math.abs(summary.netDelta) > 1 && (
                    <span
                      className={`text-[10px] tabular-nums font-medium ${
                        summary.netDelta > 0 ? "text-amber-700" : "text-emerald-700"
                      }`}
                    >
                      {fmtSignedEur(summary.netDelta)}
                    </span>
                  )}
                  {summary.yoyPct != null && Math.abs(summary.yoyPct) >= 0.02 && (
                    <span
                      className={`inline-flex items-center text-[10px] tabular-nums ${
                        summary.yoyPct > 0 ? "text-amber-700" : "text-emerald-700"
                      }`}
                    >
                      {summary.yoyPct > 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                      {Math.abs(Math.round(summary.yoyPct * 100))}%
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}

        {/* SVG edges */}
        <svg
          className="absolute inset-0"
          width={canvasWidth}
          height={layout.totalHeight}
          style={{ pointerEvents: "none" }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="#94A3B8" />
            </marker>
            <marker
              id="arrowhead-strong"
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="#1E293B" />
            </marker>
          </defs>
          {flow.edges.map((edge, idx) => {
            const fromNode = nodeById[edge.from];
            const toNode = nodeById[edge.to];
            if (!fromNode || !toNode) return null;

            const visible = !focusVisibility || focusVisibility.edges.has(idx);
            if (!visible) return null;

            const isHoverHighlighted = hoverSet ? hoverSet.edges.has(idx) : false;
            const isHoverDimmed = !!hoverSet && !isHoverHighlighted;

            // Show edge label when: toggle is on, edge is in hover path, or
            // one of the endpoints is the selected node.
            const labelVisible =
              !!edge.edgeLabel &&
              (showEdgeLabels ||
                isHoverHighlighted ||
                edge.from === selectedNodeId ||
                edge.to === selectedNodeId);

            const x1 = fromNode._x + fromNode._w;
            const y1 = fromNode._y + fromNode._h / 2;
            const x2 = toNode._x;
            const y2 = toNode._y + toNode._h / 2;
            const midX = (x1 + x2) / 2;

            const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
            const labelX = midX;
            const labelY = (y1 + y2) / 2;

            const stroke = isHoverHighlighted ? "#1E293B" : "#CBD5E1";
            const opacity = isHoverDimmed ? 0.25 : 1;

            return (
              <g key={idx} opacity={opacity}>
                {/* Visible path */}
                <path
                  d={path}
                  stroke={stroke}
                  strokeWidth={isHoverHighlighted ? "2" : "1.5"}
                  fill="none"
                  markerEnd={isHoverHighlighted ? "url(#arrowhead-strong)" : "url(#arrowhead)"}
                />
                {/* Wider invisible hit area for hover/click */}
                <path
                  d={path}
                  stroke="transparent"
                  strokeWidth="14"
                  fill="none"
                  style={{ pointerEvents: "stroke", cursor: "pointer" }}
                  onMouseEnter={() => setHoveredNodeId(edge.from)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={(e) => { e.stopPropagation(); setSelectedNodeId(edge.from); }}
                >
                  <title>
                    {edge.edgeLabel ? `${edge.edgeLabel} · ` : ""}{fmtEur2(edge.amount)}
                  </title>
                </path>
                {labelVisible && (
                  <g style={{ pointerEvents: "none" }}>
                    <rect
                      x={labelX - 18}
                      y={labelY - 8}
                      width="36"
                      height="16"
                      rx="3"
                      fill="white"
                      stroke={isHoverHighlighted ? "#1E293B" : "#E2E8F0"}
                      strokeWidth="1"
                    />
                    <text
                      x={labelX}
                      y={labelY + 3}
                      textAnchor="middle"
                      fontSize="10"
                      fill={isHoverHighlighted ? "#1E293B" : "#64748B"}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: isHoverHighlighted ? 600 : 400 }}
                    >
                      {edge.edgeLabel}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Node cards */}
        {positionedNodes.map((node) => {
          const visible = !focusVisibility || focusVisibility.nodes.has(node.id);
          if (!visible) return null;
          const isInHover = hoverSet ? hoverSet.nodes.has(node.id) : false;
          const dim = !!hoverSet && !isInHover;
          return (
            <NodeCard
              key={node.id}
              node={node}
              overlay={overlay}
              isSelected={selectedNodeId === node.id}
              isHovered={hoveredNodeId === node.id}
              dim={dim}
              onSelect={setSelectedNodeId}
              onHoverEnter={setHoveredNodeId}
              onHoverLeave={(id) => setHoveredNodeId((prev) => (prev === id ? null : prev))}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Inspector (right)                                            */
/* ──────────────────────────────────────────────────────────── */
function StatusPill({ status }) {
  const map = {
    matched:         { color: "text-slate-700",  bg: "bg-slate-100",  label: "Matched" },
    matched_partial: { color: "text-amber-700",  bg: "bg-amber-50",   label: "Partially matched" },
    wrong_account:   { color: "text-red-700",    bg: "bg-red-50",     label: "Wrong account" },
    duplicate:       { color: "text-amber-700",  bg: "bg-amber-50",   label: "Duplicate" },
    missing:         { color: "text-red-700",    bg: "bg-red-50",     label: "Missing" },
  };
  const cfg = map[status] || { color: "text-slate-500", bg: "bg-slate-50", label: status };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.color} ${cfg.bg}`}>
      {cfg.label}
    </span>
  );
}

function LaneOverview({ flow, laneId, onClose, onPickNode }) {
  const lane = flow.lanes.find((l) => l.id === laneId);
  if (!lane) return null;
  const nodes = flow.nodes.filter((n) => n.laneId === laneId);
  const summary = summariseLane(laneId);
  const sources = nodes.filter((n) => n.type === "source");
  const settlements = nodes.filter((n) => n.type === "settlement");
  const splits = nodes.filter((n) => n.type === "split");
  const adjustments = nodes.filter((n) => n.type === "deduction" || n.type === "addition");
  const serviceCodes = getLaneServiceCodes(laneId);
  const Icon = categoryIcon[lane.category] || FileText;
  const health = healthBadge[summary.health];

  return (
    <aside className="w-[380px] shrink-0 border-l border-slate-200 bg-white overflow-y-auto">
      {/* Sticky header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-slate-200 flex items-start justify-between gap-2">
        <div className="min-w-0 flex items-start gap-2">
          <div className="mt-0.5 w-7 h-7 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
            <Icon size={14} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
              Lane overview
            </div>
            <div className="text-sm font-semibold text-slate-900 leading-tight">
              {lane.title}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 capitalize">
              {lane.category} · {lane.complexity} flow
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Health + totals */}
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${health.dot}`} />
            <span className="text-[11px] text-slate-700">{health.label}</span>
            {summary.issueCount > 0 && (
              <span className="ml-auto text-[10px] text-amber-700 uppercase tracking-widest">
                {summary.issueCount} flag{summary.issueCount === 1 ? "" : "s"}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded border border-slate-100 p-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-400">
                Source total
              </div>
              <div className="text-slate-800 font-semibold tabular-nums">
                {fmtEur(summary.expected)}
              </div>
            </div>
            <div className="rounded border border-slate-100 p-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-400">
                Settled total
              </div>
              <div className="text-slate-800 font-semibold tabular-nums">
                {fmtEur(summary.settled)}
              </div>
            </div>
          </div>
        </div>

        {/* Service codes — quiet bridge to the bookkeeping vocabulary */}
        {serviceCodes.length > 0 && (
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
              Service code{serviceCodes.length === 1 ? "" : "s"}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {serviceCodes.map((code) => (
                <span
                  key={code}
                  className="inline-flex items-center px-1.5 h-5 rounded text-[10px] font-mono text-slate-700 bg-slate-100 border border-slate-200"
                >
                  {code}
                </span>
              ))}
            </div>
            <div className="mt-1.5 text-[10px] text-slate-400">
              ERP-side codes for this lane's settlements
            </div>
          </div>
        )}

        {/* Composition */}
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
            Composition
          </div>
          <ul className="space-y-1.5 text-[11px]">
            <li className="flex justify-between">
              <span className="text-slate-500 inline-flex items-center gap-1.5">
                <CircleDot size={10} /> Sources
              </span>
              <span className="text-slate-700">{sources.length}</span>
            </li>
            {splits.length > 0 && (
              <li className="flex justify-between">
                <span className="text-slate-500 inline-flex items-center gap-1.5">
                  <Split size={10} /> Splits
                </span>
                <span className="text-slate-700">{splits.length}</span>
              </li>
            )}
            {adjustments.length > 0 && (
              <li className="flex justify-between">
                <span className="text-slate-500 inline-flex items-center gap-1.5">
                  <Plus size={10} /> Adjustments
                </span>
                <span className="text-slate-700">{adjustments.length}</span>
              </li>
            )}
            <li className="flex justify-between">
              <span className="text-slate-500 inline-flex items-center gap-1.5">
                <Users size={10} /> Settlements
              </span>
              <span className="text-slate-700">{settlements.length}</span>
            </li>
          </ul>
        </div>

        {/* Quick-pick nodes */}
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
            Open a node
          </div>
          <ul className="space-y-1">
            {nodes.map((n) => {
              const TIcon = typeIcon[n.type] || CircleDot;
              return (
                <li key={n.id}>
                  <button
                    onClick={() => onPickNode(n.id)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-50 text-left text-[11px]"
                  >
                    <TIcon size={11} className="text-slate-400 shrink-0" />
                    <span className="text-slate-700 truncate flex-1">{n.label}</span>
                    <span className="text-slate-500 tabular-nums shrink-0">
                      {n.type === "deduction"
                        ? `−${fmtEur(Math.abs(n.amount))}`
                        : n.type === "addition"
                        ? `+${fmtEur(n.amount)}`
                        : fmtEur(n.amount)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Help / glossary panel                                        */
/* ──────────────────────────────────────────────────────────── */
function HelpPanel({ onClose }) {
  const Item = ({ Icon, label, children }) => (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 w-6 h-6 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-600 shrink-0">
        <Icon size={12} strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <div className="text-[12px] font-semibold text-slate-800 leading-tight">{label}</div>
        <div className="text-[11px] text-slate-600 leading-snug mt-0.5">{children}</div>
      </div>
    </li>
  );

  return (
    <aside className="w-[380px] shrink-0 border-l border-slate-200 bg-white overflow-y-auto">
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-slate-200 flex items-start justify-between gap-2">
        <div className="min-w-0 flex items-start gap-2">
          <div className="mt-0.5 w-7 h-7 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
            <HelpCircle size={14} strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
              How to read this
            </div>
            <div className="text-sm font-semibold text-slate-900 leading-tight">
              Cost flow vocabulary
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1.5">
            Read it like a story
          </div>
          <div className="text-[11px] text-slate-700 leading-snug">
            Costs come in from <strong>sources on the left</strong> — meters, contracts,
            invoices, recurring fees. They flow through <strong>splits and adjustments</strong>
            in the middle until they land on <strong>settlements on the right</strong>: the
            (Service × Audience) buckets where tenants actually pay.
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-3">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
            What you'll see on the canvas
          </div>
          <ul className="space-y-2.5">
            <Item Icon={CircleDot} label="Source">
              Where money enters. Five kinds: <em>Metered</em> (utility meter readings × tariff),
              <em> Contract</em> (fixed service contract like cleaning),
              <em> Pass-through</em> (variable per-incident invoices like sewer unblocking),
              <em> Recurring</em> (annual fee like glass insurance), and
              <em> Internal</em> (in-house labour or computed surcharge).
            </Item>
            <Item Icon={Split} label="Split rule">
              How a cost gets divided. The dashed card shows the rule itself —
              "80%/20%", "96/108", or a per-meter measurement.
            </Item>
            <Item Icon={Minus} label="Deduction">
              Subtracts from the flow. Usually a manual carve-out the bookkeeping
              doesn't see (e.g. private commercial use of common electricity).
            </Item>
            <Item Icon={Plus} label="Addition">
              Adds to the flow. Usually a related cost booked on a different
              ledger account that conceptually belongs here.
            </Item>
            <Item Icon={Users} label="Settlement target">
              Where money lands. Each one is a <em>(Service × Audience × Period)</em>
              — what the tenants actually settle against. Carries the advance,
              the actual cost, and the delta.
            </Item>
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 p-3">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
            Audiences
          </div>
          <div className="text-[11px] text-slate-600 leading-snug mb-2">
            Groups of VHEs that share a charge. Three kinds:
          </div>
          <ul className="space-y-1.5 text-[11px]">
            <li className="flex items-baseline gap-2">
              <span className="inline-block w-1 h-3 bg-slate-700 rounded-sm shrink-0" />
              <strong className="text-slate-700">Complex</strong>
              <span className="text-slate-500">— the whole 216-VHE building</span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="inline-block w-1 h-3 bg-slate-500 rounded-sm shrink-0" />
              <strong className="text-slate-700">Block</strong>
              <span className="text-slate-500">— a sub-group like Blok 1 or Blok 2</span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="inline-block w-1 h-3 bg-amber-500 rounded-sm shrink-0" />
              <strong className="text-slate-700">Ad-hoc</strong>
              <span className="text-slate-500">— a custom set, e.g. the 117 VHEs that share a sewer stack</span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 p-3">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
            What the dots mean
          </div>
          <ul className="space-y-1.5 text-[11px]">
            <li className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
              <span className="text-slate-700">Reconciled — matches the bookkeeping cleanly</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span className="text-slate-700">Has warnings — partial match or manual adjustment</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span className="text-slate-700">Has errors — wrong account, missing entries, etc.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 p-3">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
            Quick interactions
          </div>
          <ul className="space-y-1 text-[11px] text-slate-700">
            <li><strong>Hover</strong> a node to highlight its full upstream and downstream path.</li>
            <li><strong>Click</strong> a node to open the details panel on the right.</li>
            <li><strong>Click an audience card</strong> to filter to costs that audience pays.</li>
            <li><strong>Search by name or service code</strong> in the rail.</li>
            <li><strong>View options</strong> turns the bookkeeping overlay or focus mode on/off.</li>
            <li><strong>ESC</strong> walks back through hover → selection.</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

function Inspector({ nodeId, onClose, onJumpToMeters }) {
  if (!nodeId) return null;
  const node = getNodeById(nodeId);
  if (!node) return null;

  const { incoming, outgoing } = getEdgesForNode(nodeId);
  const isSource = node.type === "source";

  return (
    <aside className="w-[380px] shrink-0 border-l border-slate-200 bg-white overflow-y-auto">
      {/* Sticky header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-slate-200 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
            {node.type}
          </div>
          <div className="text-sm font-semibold text-slate-900 leading-tight">
            {node.label}
          </div>
          {node.subLabel && (
            <div className="text-[11px] text-slate-500 mt-0.5">{node.subLabel}</div>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Amount panel */}
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">
            Conceptual amount
          </div>
          <div className="text-2xl font-semibold text-slate-900 tabular-nums">
            {node.type === "deduction"
              ? `−${fmtEur2(Math.abs(node.amount))}`
              : node.type === "addition"
              ? `+${fmtEur2(node.amount)}`
              : fmtEur2(node.amount)}
          </div>
          {node.consumptionUnit && (
            <div className="text-[11px] text-slate-500 mt-1">
              {node.expectedConsumption?.toLocaleString("nl-NL")} {node.consumptionUnit} from metering
            </div>
          )}
        </div>

        {/* Type-specific content */}
        {node.type === "source" && (
          <SourceInspectorBody
            node={node}
            edges={{ incoming, outgoing }}
            onJumpToMeters={onJumpToMeters}
          />
        )}

        {node.type === "split" && (
          <SplitInspectorBody node={node} outgoing={outgoing} />
        )}

        {(node.type === "deduction" || node.type === "addition") && (
          <AdjustmentInspectorBody node={node} />
        )}

        {node.type === "settlement" && (
          <SettlementInspectorBody node={node} />
        )}

        {/* Universal Bookkeeping anchors / Flags / Connections — sources own these
         * via NeedsAttentionPanel + BookkeepingPanel + FlowConnectionsPanel,
         * so suppress for source nodes to avoid duplication. */}
        {!isSource && node.anchors && node.anchors.length > 0 && (
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
              Bookkeeping anchors
            </div>
            <ul className="space-y-2">
              {node.anchors.map((anchor, idx) => (
                <li key={idx} className="text-[11px]">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <code className="text-[10px] text-slate-700 font-mono break-all">
                      {anchor.ledgerAccount}
                    </code>
                    <StatusPill status={anchor.status} />
                  </div>
                  <div className="text-slate-600 tabular-nums">{fmtEur2(anchor.amount)}</div>
                  {anchor.note && (
                    <div className="text-[10px] text-slate-500 italic mt-0.5">{anchor.note}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Flags */}
        {!isSource && node.flags && node.flags.length > 0 && (
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
              Reconciliation flags
            </div>
            <ul className="space-y-1.5">
              {node.flags.map((f, idx) => (
                <li
                  key={idx}
                  className={`flex items-start gap-2 text-[11px] ${
                    f.kind === "error" ? "text-red-700" : "text-amber-800"
                  }`}
                >
                  {f.kind === "error" ? <AlertCircle size={12} className="mt-0.5 shrink-0" /> : <AlertTriangle size={12} className="mt-0.5 shrink-0" />}
                  <span>{f.note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Connections (debug-y, but useful for the wireframe) */}
        {!isSource && (incoming.length > 0 || outgoing.length > 0) && (
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
              Connected nodes
            </div>
            {incoming.length > 0 && (
              <div className="mb-2">
                <div className="text-[10px] text-slate-500 mb-1">Inputs</div>
                {incoming.map((e, i) => {
                  const n = getNodeById(e.from);
                  return (
                    <div key={i} className="text-[11px] text-slate-700 flex items-center justify-between">
                      <span className="truncate">{n?.label}</span>
                      <span className="tabular-nums text-slate-500">{fmtEur(e.amount)}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {outgoing.length > 0 && (
              <div>
                <div className="text-[10px] text-slate-500 mb-1">Outputs</div>
                {outgoing.map((e, i) => {
                  const n = getNodeById(e.to);
                  return (
                    <div key={i} className="text-[11px] text-slate-700 flex items-center justify-between">
                      <span className="truncate">{n?.label}</span>
                      <span className="tabular-nums text-slate-500">{fmtEur(e.amount)}{e.edgeLabel ? ` · ${e.edgeLabel}` : ""}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

function YoyTrend({ yoy }) {
  if (!yoy || yoy.length < 2) return null;
  const sorted = [...yoy].sort((a, b) => a.year - b.year);
  const max = Math.max(...sorted.map((y) => y.amount));
  const latest = sorted[sorted.length - 1];
  const prev = sorted[sorted.length - 2];
  const pct = prev && prev.amount > 0 ? (latest.amount - prev.amount) / prev.amount : 0;
  const trendIcon = pct > 0.02 ? TrendingUp : pct < -0.02 ? TrendingDown : Minus;
  const TrendIcon = trendIcon;
  const trendColor =
    pct > 0.02 ? "text-amber-700" : pct < -0.02 ? "text-emerald-700" : "text-slate-500";

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
          Year over year
        </div>
        <div className={`inline-flex items-center gap-1 text-[11px] ${trendColor}`}>
          <TrendIcon size={11} />
          <span className="tabular-nums">
            {pct > 0 ? "+" : ""}
            {Math.round(pct * 100)}% vs {prev.year}
          </span>
        </div>
      </div>
      <div className="space-y-1">
        {sorted.map((y) => {
          const w = max > 0 ? (y.amount / max) * 100 : 0;
          const isLatest = y.year === latest.year;
          return (
            <div key={y.year} className="flex items-center gap-2 text-[11px]">
              <span className={`w-9 ${isLatest ? "text-slate-700 font-medium" : "text-slate-500"}`}>
                {y.year}
              </span>
              <div className="flex-1 h-2 rounded bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded ${isLatest ? "bg-slate-700" : "bg-slate-300"}`}
                  style={{ width: `${w}%` }}
                />
              </div>
              <span className={`tabular-nums ${isLatest ? "text-slate-700 font-medium" : "text-slate-500"}`}>
                {fmtEur(y.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SupplierBreakdown({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
        Supplier breakdown
      </div>
      <ul className="space-y-2">
        {items.map((s, i) => (
          <li key={i} className="text-[11px]">
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <div className="min-w-0 flex-1">
                <div className="text-slate-800 truncate">{s.name}</div>
                {s.role && (
                  <div className="text-[10px] text-slate-400 truncate">{s.role}</div>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="text-slate-700 tabular-nums">{fmtEur(s.amount)}</div>
                <div className="text-[10px] text-slate-400">{s.evidenceCount} boekstuk</div>
              </div>
            </div>
            {s.status && s.status !== "matched" && (
              <div className="mt-1">
                <StatusPill status={s.status} />
              </div>
            )}
            {s.note && (
              <div className="text-[10px] text-slate-500 italic mt-1">{s.note}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function TemporalCoverage({ coverage }) {
  if (!coverage) return null;
  const cadence = coverage.cadence || "monthly";
  const missing = new Set(coverage.missing || []);

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
          Temporal coverage
        </div>
        <div className="text-[10px] text-slate-500 capitalize">{cadence.replace("_", " ")}</div>
      </div>

      {cadence === "monthly" && (
        <div>
          <div className="grid grid-cols-12 gap-1 mb-1.5">
            {MONTHS_SHORT.map((m) => {
              const isMissing = missing.has(m);
              return (
                <div
                  key={m}
                  title={`${m} ${isMissing ? "— missing" : "— booked"}`}
                  className={`h-5 rounded-sm flex items-center justify-center text-[9px] tabular-nums ${
                    isMissing
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {m[0]}
                </div>
              );
            })}
          </div>
          <div className="text-[11px] text-slate-600">
            {coverage.bookedMonths} of {coverage.expectedMonths} months booked
            {coverage.missing && coverage.missing.length > 0 && (
              <span className="text-amber-700"> · missing {coverage.missing.join(", ")}</span>
            )}
          </div>
        </div>
      )}

      {cadence === "quarterly" && (
        <div>
          <div className="grid grid-cols-4 gap-1 mb-1.5">
            {["Q1", "Q2", "Q3", "Q4"].map((q, i) => {
              const isMissing = (coverage.bookedQuarters || 0) <= i;
              return (
                <div
                  key={q}
                  className={`h-5 rounded-sm flex items-center justify-center text-[9px] ${
                    isMissing
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {q}
                </div>
              );
            })}
          </div>
          <div className="text-[11px] text-slate-600">
            {coverage.bookedQuarters} of {coverage.expectedQuarters} quarters booked
          </div>
        </div>
      )}

      {(cadence === "annual" || cadence === "ad_hoc") && (
        <div className="text-[11px] text-slate-600">{coverage.note}</div>
      )}

      {coverage.note && cadence !== "annual" && cadence !== "ad_hoc" && (
        <div className="text-[10px] text-slate-500 italic mt-1.5">{coverage.note}</div>
      )}
    </div>
  );
}

function ManualNotes({ notes }) {
  if (!notes || notes.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
        Notes
      </div>
      <ul className="space-y-1.5">
        {notes.map((n, i) => (
          <li
            key={i}
            className={`flex items-start gap-2 text-[11px] ${
              n.kind === "warn" ? "text-amber-800" : "text-slate-600"
            }`}
          >
            {n.kind === "warn" ? (
              <AlertTriangle size={11} className="mt-0.5 shrink-0" />
            ) : (
              <Info size={11} className="mt-0.5 shrink-0 text-slate-400" />
            )}
            <span>{n.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Plain-language one-line description per source kind */
const KIND_EXPLANATION = {
  metered:      "Cost = metered consumption × tariff.",
  contracted:   "Cost = fixed contractual fee on the agreed cadence.",
  pass_through: "Cost = sum of incident-driven invoices in the period.",
  recurring:    "Cost = recurring fixed fee booked once per cadence.",
  internal:     "Cost = allocated internally (labour or surcharge).",
};

/* ─── Needs attention ── consolidates flags, missing months, wrong-account,
 * cross-complex warnings into one prominent panel. Renders only when there
 * is something to surface. */
function NeedsAttentionPanel({ node }) {
  const items = [];

  for (const a of node.anchors || []) {
    if (a.status === "wrong_account") {
      items.push({
        kind: "error",
        title: `Wrong account · ${fmtEur(a.amount)}`,
        detail: a.note || `Booked on ${a.ledgerAccount}`,
      });
    } else if (a.status === "missing") {
      items.push({
        kind: "error",
        title: `Missing in ledger · ${fmtEur(a.amount)}`,
        detail: a.note || `Expected on ${a.ledgerAccount}`,
      });
    } else if (a.status === "duplicate") {
      items.push({
        kind: "warn",
        title: `Possible duplicate · ${fmtEur(a.amount)}`,
        detail: a.note || `Check ${a.ledgerAccount}`,
      });
    } else if (a.status === "matched_partial" && a.note) {
      items.push({ kind: "warn", title: "Partially anchored", detail: a.note });
    }
  }

  // Missing periods from ledger
  if (node.temporalCoverage?.missing && node.temporalCoverage.missing.length > 0) {
    const missing = node.temporalCoverage.missing;
    const cadence = node.temporalCoverage.cadence || "monthly";
    const unit = cadence === "monthly" ? "month" : cadence === "quarterly" ? "quarter" : "period";
    items.push({
      kind: "warn",
      title: `${missing.length} ${unit}${missing.length === 1 ? "" : "s"} missing from ledger`,
      detail:
        `${missing.join(", ")} ${missing.length === 1 ? "is" : "are"} not yet booked` +
        (node.temporalCoverage.note ? ` — ${node.temporalCoverage.note.toLowerCase()}` : ""),
    });
  }

  // Cross-complex
  if (node.crossesComplex) {
    items.push({
      kind: "warn",
      title: "Crosses bookkeeping complex",
      detail: "This meter feeds VHEs in another complex too — settlement uses a cross-complex split downstream.",
    });
  }

  // Manual flags + warning notes
  for (const f of node.flags || []) {
    items.push({ kind: f.kind === "error" ? "error" : "warn", title: f.note });
  }
  for (const n of node.manualNotes || []) {
    if (n.kind === "warn") items.push({ kind: "warn", title: n.text });
  }

  if (items.length === 0) return null;

  // Dedupe by title
  const seen = new Set();
  const unique = items.filter((i) => {
    if (seen.has(i.title)) return false;
    seen.add(i.title);
    return true;
  });

  const hasError = unique.some((i) => i.kind === "error");
  const containerClass = hasError
    ? "border-red-200 bg-red-50/40"
    : "border-amber-200 bg-amber-50/40";
  const headingClass = hasError ? "text-red-800" : "text-amber-800";

  return (
    <div className={`rounded-lg border p-3 ${containerClass}`}>
      <div className={`text-[10px] uppercase tracking-widest font-semibold mb-2 ${headingClass}`}>
        Needs attention · {unique.length}
      </div>
      <ul className="space-y-2">
        {unique.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-[11px]">
            {it.kind === "error" ? (
              <AlertCircle size={12} className="text-red-700 mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle size={12} className="text-amber-700 mt-0.5 shrink-0" />
            )}
            <div className="min-w-0">
              <div className={`${it.kind === "error" ? "text-red-800" : "text-amber-900"} font-medium leading-tight`}>
                {it.title}
              </div>
              {it.detail && (
                <div className="text-slate-600 mt-0.5 leading-snug">{it.detail}</div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Source details — kind-aware brief ──
 * Metered: EAN / supplier / consumption / cost  + link to Meters tab
 * Contracted: contract / supplier / cadence / cost
 * Pass-through: counterparty / cadence / cost
 * Recurring: issuer / cadence / cost
 * Internal: basis / cadence / cost
 */
const PANEL_TITLE_BY_KIND = {
  metered: "Consumption",
  contracted: "Contract",
  pass_through: "Invoices",
  recurring: "Recurring fee",
  internal: "Calculation",
};
const ID_LABEL_BY_KIND = {
  metered: "EAN",
  contracted: "Contract",
  pass_through: "Reference",
  recurring: "Reference",
  internal: "Reference",
};

function SourceDetailsPanel({ node, onJumpToMeters }) {
  const KindIcon = sourceKindIcon(node);
  const kindLabel = SOURCE_KIND[node.sourceKind]?.label || "Source";
  const panelTitle = PANEL_TITLE_BY_KIND[node.sourceKind] || "Source";
  const idLabel = ID_LABEL_BY_KIND[node.sourceKind] || "ID";

  // For metered, strip the "EAN " prefix so the row label carries that
  const idValue =
    node.sourceKind === "metered" && node.identifier?.startsWith("EAN ")
      ? node.identifier.replace(/^EAN\s+/, "")
      : node.identifier;

  const supplierLabel =
    node.supplier === "multi"
      ? `Multiple (${node.supplierBreakdown?.length || "?"})`
      : node.supplier;

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
          {panelTitle}
        </div>
        <span className="inline-flex items-center gap-1 px-1.5 h-4 rounded text-[9px] uppercase tracking-widest font-semibold text-slate-700 bg-slate-100 border border-slate-200">
          <KindIcon size={9} strokeWidth={2} />
          {kindLabel}
        </span>
      </div>

      <div className="text-[11px] text-slate-600 leading-snug mb-2.5">
        {KIND_EXPLANATION[node.sourceKind] || ""}
      </div>

      <div className="space-y-1 text-[11px]">
        {idValue && (
          <div className="flex justify-between gap-2">
            <span className="text-slate-500 shrink-0">{idLabel}</span>
            <span className="text-slate-800 font-mono text-[10px] break-all text-right">
              {idValue}
            </span>
          </div>
        )}
        {supplierLabel && supplierLabel !== "Internal" && (
          <div className="flex justify-between">
            <span className="text-slate-500">Supplier</span>
            <span className="text-slate-800">{supplierLabel}</span>
          </div>
        )}
        {node.sourceKind === "metered" && node.expectedConsumption != null && (
          <div className="flex justify-between">
            <span className="text-slate-500">Annual consumption</span>
            <span className="text-slate-800 tabular-nums">
              {node.expectedConsumption.toLocaleString("nl-NL")} {node.consumptionUnit}
            </span>
          </div>
        )}
        {node.cadence && (
          <div className="flex justify-between">
            <span className="text-slate-500">Cadence</span>
            <span className="text-slate-800">{CADENCE_LABEL[node.cadence] || node.cadence}</span>
          </div>
        )}
        <div className="h-px bg-slate-100 my-1.5" />
        <div className="flex justify-between">
          <span className="text-slate-500 font-medium">Annual cost</span>
          <span className="text-slate-800 tabular-nums font-semibold">{fmtEur2(node.amount)}</span>
        </div>
      </div>

      {/* Submeter / informational notes (small, secondary) */}
      {node.manualNotes?.some((n) => n.kind === "info") && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
          {node.manualNotes
            .filter((n) => n.kind === "info")
            .map((n, i) => (
              <div key={i} className="text-[10px] text-slate-500 leading-snug">
                {n.text}
              </div>
            ))}
        </div>
      )}

      {node.sourceKind === "metered" && onJumpToMeters && (
        <button
          onClick={onJumpToMeters}
          className="mt-3 w-full h-7 rounded-md border border-slate-200 bg-slate-50 text-[11px] text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center gap-1.5"
        >
          View in Meters tab <ChevronRight size={11} />
        </button>
      )}
    </div>
  );
}

/* ─── Bookkeeping reconciliation ── booked vs expected, anchor list,
 * coverage strip showing booked/missing periods. */
function BookkeepingPanel({ node }) {
  const anchors = node.anchors || [];
  const totalBooked = anchors.reduce((s, a) => s + (a.amount || 0), 0);
  const expected = Math.abs(node.amount || 0);
  const diff = totalBooked - expected;
  const coverage = node.temporalCoverage;

  const noAnchors = anchors.length === 0;
  if (noAnchors && !coverage) return null;

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
        Bookkeeping
      </div>

      {anchors.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="rounded border border-slate-100 p-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-400">Booked</div>
              <div className="text-[12px] font-semibold tabular-nums text-slate-800">
                {fmtEur(totalBooked)}
              </div>
            </div>
            <div className="rounded border border-slate-100 p-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-400">Expected</div>
              <div className="text-[12px] font-semibold tabular-nums text-slate-800">
                {fmtEur(expected)}
              </div>
            </div>
          </div>

          {Math.abs(diff) > 1 && (
            <div className={`text-[11px] mb-2 ${diff < 0 ? "text-amber-800" : "text-slate-700"}`}>
              {diff < 0
                ? `${fmtEur(Math.abs(diff))} not yet anchored to the ledger`
                : `${fmtEur(diff)} booked over expected`}
            </div>
          )}

          <ul className="space-y-2">
            {anchors.map((a, idx) => (
              <li key={idx} className="text-[11px]">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <code className="text-[10px] text-slate-700 font-mono break-all">
                    {a.ledgerAccount}
                  </code>
                  <StatusPill status={a.status} />
                </div>
                <div className="text-slate-600 tabular-nums">{fmtEur2(a.amount)}</div>
                {a.note && (
                  <div className="text-[10px] text-slate-500 italic mt-0.5">{a.note}</div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {coverage && coverage.cadence === "monthly" && coverage.expectedMonths && (
        <div className={`${anchors.length > 0 ? "mt-3 pt-2.5 border-t border-slate-100" : ""}`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[10px] uppercase tracking-widest text-slate-400">
              Month coverage
            </div>
            <div className="text-[10px] text-slate-500">
              {coverage.bookedMonths} of {coverage.expectedMonths} booked
              {coverage.missing?.length > 0 && (
                <span className="text-amber-700"> · missing {coverage.missing.join(", ")}</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-12 gap-0.5">
            {MONTHS_SHORT.map((m) => {
              const isMissing = (coverage.missing || []).includes(m);
              return (
                <div
                  key={m}
                  title={`${m} ${isMissing ? "— missing" : "— booked"}`}
                  className={`h-4 rounded-sm flex items-center justify-center text-[8px] ${
                    isMissing
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {m[0]}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {coverage && coverage.cadence === "quarterly" && coverage.expectedQuarters && (
        <div className={`${anchors.length > 0 ? "mt-3 pt-2.5 border-t border-slate-100" : ""}`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[10px] uppercase tracking-widest text-slate-400">
              Quarter coverage
            </div>
            <div className="text-[10px] text-slate-500">
              {coverage.bookedQuarters} of {coverage.expectedQuarters} booked
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {["Q1", "Q2", "Q3", "Q4"].map((q, i) => {
              const isMissing = (coverage.bookedQuarters || 0) <= i;
              return (
                <div
                  key={q}
                  className={`h-5 rounded-sm flex items-center justify-center text-[9px] ${
                    isMissing
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {q}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Where does this flow to? — outgoing connections, plain-language ── */
function FlowConnectionsPanel({ node, edges }) {
  const outgoing = edges?.outgoing || [];
  if (outgoing.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
        Where does this flow to?
      </div>
      <ul className="space-y-1">
        {outgoing.map((e, i) => {
          const target = getNodeById(e.to);
          return (
            <li key={i} className="text-[11px] flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 text-slate-700 truncate min-w-0">
                <ChevronRight size={11} className="text-slate-400 shrink-0" />
                <span className="truncate">{target?.label || e.to}</span>
              </span>
              <span className="tabular-nums text-slate-500 shrink-0">
                {fmtEur(e.amount)}
                {e.edgeLabel ? ` · ${e.edgeLabel}` : ""}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SourceInspectorBody({ node, edges, onJumpToMeters }) {
  return (
    <>
      <NeedsAttentionPanel node={node} />
      <SourceDetailsPanel node={node} onJumpToMeters={onJumpToMeters} />
      {node.supplier === "multi" && <SupplierBreakdown items={node.supplierBreakdown} />}
      <BookkeepingPanel node={node} />
      <YoyTrend yoy={node.yoyComparison} />
      <FlowConnectionsPanel node={node} edges={edges} />
    </>
  );
}

function SplitInspectorBody({ node, outgoing }) {
  const ruleLabel = {
    fixed_pct: "Fixed percentage",
    by_count: "By VHE count",
    by_meter: "By submeter reading",
    by_area: "By floor area",
  }[node.rule] || node.rule;

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
        Rule
      </div>
      <div className="text-[11px] text-slate-700 mb-2">{ruleLabel}</div>
      <pre className="text-[10px] text-slate-500 bg-slate-50 rounded p-2 overflow-x-auto">
{JSON.stringify(node.ruleSpec, null, 2)}
      </pre>
      <div className="mt-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
        Outputs
      </div>
      <ul className="space-y-1">
        {outgoing.map((e, i) => {
          const n = getNodeById(e.to);
          return (
            <li key={i} className="text-[11px] flex items-center justify-between">
              <span className="text-slate-700 truncate">{n?.label}</span>
              <span className="tabular-nums text-slate-500">{fmtEur(e.amount)}{e.edgeLabel ? ` · ${e.edgeLabel}` : ""}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AdjustmentInspectorBody({ node }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
        {node.type === "deduction" ? "Deduction" : "Addition"}
      </div>
      <p className="text-[11px] text-slate-600">
        {node.type === "deduction"
          ? "Reduces the cost flowing through this node. Often an Excel-only adjustment that doesn't (yet) have a corresponding ledger entry."
          : "Adds cost from a separate source — typically a related ledger account that should be folded into this lane."}
      </p>
    </div>
  );
}

/* Settlement direction → "collect", "refund", or "balanced" */
function settlementDirection(delta) {
  if (delta == null) return null;
  if (delta > 1) return "collect";
  if (delta < -1) return "refund";
  return "balanced";
}

const directionConfig = {
  collect:  { label: "Collect from tenants", color: "text-amber-800", bg: "bg-amber-50",  border: "border-amber-200",  Icon: TrendingUp },
  refund:   { label: "Refund to tenants",    color: "text-emerald-800", bg: "bg-emerald-50", border: "border-emerald-200", Icon: TrendingDown },
  balanced: { label: "Balanced — no settlement", color: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200", Icon: Minus },
};

const settlementStatusConfig = {
  draft:     { label: "Draft",     dot: "bg-slate-300" },
  proposed:  { label: "Proposed",  dot: "bg-slate-500" },
  finalised: { label: "Finalised", dot: "bg-slate-700" },
  closed:    { label: "Closed",    dot: "bg-slate-900" },
  blocked:   { label: "Blocked",   dot: "bg-amber-500" },
};

function PerVhe({ amount, vheCount, label, color }) {
  if (amount == null || !vheCount) return null;
  const per = amount / vheCount;
  return (
    <div className="flex justify-between text-[11px]">
      <span className="text-slate-500">{label}</span>
      <span className={`tabular-nums ${color || "text-slate-700"}`}>
        {fmtEur2(per)} <span className="text-[10px] text-slate-400">/ VHE</span>
      </span>
    </div>
  );
}

function SettlementYoy({ yoy }) {
  if (!yoy || yoy.length === 0) return null;
  const sorted = [...yoy].sort((a, b) => a.year - b.year);
  const allDeltasNull = sorted.every((y) => y.delta == null);
  const max = Math.max(
    ...sorted.flatMap((y) => [y.actual || 0, y.advance || 0])
  );
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
        Year-over-year settlement
      </div>
      <div className="space-y-2">
        {sorted.map((y) => {
          const isLatest = y.year === sorted[sorted.length - 1].year;
          const advW = max > 0 && y.advance != null ? (y.advance / max) * 100 : 0;
          const actW = max > 0 && y.actual != null ? (y.actual / max) * 100 : 0;
          const dir = settlementDirection(y.delta);
          return (
            <div key={y.year} className="text-[11px]">
              <div className="flex items-center justify-between mb-0.5">
                <span className={isLatest ? "text-slate-700 font-medium" : "text-slate-500"}>
                  {y.year}
                </span>
                {y.delta != null ? (
                  <span
                    className={`tabular-nums text-[10px] ${
                      dir === "collect" ? "text-amber-700" : dir === "refund" ? "text-emerald-700" : "text-slate-500"
                    }`}
                  >
                    {fmtSignedEur(y.delta)}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">—</span>
                )}
              </div>
              <div className="space-y-0.5">
                {y.advance != null && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 w-12">Adv</span>
                    <div className="flex-1 h-1.5 rounded bg-slate-100 overflow-hidden">
                      <div className="h-full bg-slate-300" style={{ width: `${advW}%` }} />
                    </div>
                    <span className="text-[10px] tabular-nums text-slate-500 w-16 text-right">
                      {fmtEur(y.advance)}
                    </span>
                  </div>
                )}
                {y.actual != null && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 w-12">Act</span>
                    <div className="flex-1 h-1.5 rounded bg-slate-100 overflow-hidden">
                      <div className={`h-full ${isLatest ? "bg-slate-700" : "bg-slate-400"}`} style={{ width: `${actW}%` }} />
                    </div>
                    <span className={`text-[10px] tabular-nums w-16 text-right ${isLatest ? "text-slate-700" : "text-slate-500"}`}>
                      {fmtEur(y.actual)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {allDeltasNull && (
        <div className="mt-2 text-[10px] text-slate-500 italic">
          Advance paid is not tracked at this settlement target — see Ista per-VHE allocation.
        </div>
      )}
    </div>
  );
}

function NewAdvancePanel({ rec, vheCount }) {
  if (!rec) return null;
  const stepUp = rec.perVheJul != null && rec.perVheJan != null && rec.perVheJul !== rec.perVheJan;
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
        Recommended advance for next period
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded border border-slate-100 p-2">
          <div className="text-[10px] uppercase tracking-widest text-slate-400">Per VHE / month</div>
          <div className="text-slate-800 font-semibold tabular-nums">
            {fmtEur2(rec.perVheJan)}
            {stepUp && (
              <span className="text-[10px] text-slate-500">
                {" → "}{fmtEur2(rec.perVheJul)}
              </span>
            )}
          </div>
          {stepUp && (
            <div className="text-[10px] text-slate-400">Jan → Jul step-up</div>
          )}
        </div>
        <div className="rounded border border-slate-100 p-2">
          <div className="text-[10px] uppercase tracking-widest text-slate-400">Total annual</div>
          <div className="text-slate-800 font-semibold tabular-nums">{fmtEur(rec.totalAnnual)}</div>
          {rec.expectedCost2025 != null && (
            <div className="text-[10px] text-slate-400">
              vs. expected {fmtEur(rec.expectedCost2025)}
            </div>
          )}
        </div>
      </div>
      {rec.generalIncrease != null && (
        <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-slate-500">
          <span className="uppercase tracking-widest">Index</span>
          <span className={`tabular-nums ${rec.generalIncrease > 0 ? "text-amber-700" : rec.generalIncrease < 0 ? "text-emerald-700" : "text-slate-500"}`}>
            {rec.generalIncrease > 0 ? "+" : ""}
            {Math.round(rec.generalIncrease * 100)}%
          </span>
        </div>
      )}
      {rec.rationale && (
        <div className="mt-2 text-[10px] text-slate-600">{rec.rationale}</div>
      )}
      {rec.marginNote && (
        <div className="mt-1.5 text-[10px] text-amber-800 italic flex items-start gap-1">
          <Info size={10} className="mt-0.5 shrink-0" />
          <span>{rec.marginNote}</span>
        </div>
      )}
    </div>
  );
}

function SiblingSettlements({ node }) {
  const siblings = getSettlementsByGroup(node.groupId, node.id);
  if (siblings.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
        Other charges for this Group
      </div>
      <ul className="space-y-1">
        {siblings.map((s) => {
          const dir = settlementDirection(s.delta);
          return (
            <li key={s.id} className="text-[11px] flex items-center justify-between">
              <span className="text-slate-700 truncate">
                {s.label}
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="tabular-nums text-slate-500">
                  {fmtEur(s.amount)}
                </span>
                {s.delta != null && dir && (
                  <span className={`text-[10px] tabular-nums ${
                    dir === "collect" ? "text-amber-700" : dir === "refund" ? "text-emerald-700" : "text-slate-400"
                  }`}>
                    {fmtSignedEur(s.delta)}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AudienceComposition({ composition }) {
  if (!composition) return null;
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
        Audience composition
      </div>
      <ul className="space-y-1.5">
        {composition.byBlock?.map((b) => {
          const pct = b.vheTotal > 0 ? (b.vheInGroup / b.vheTotal) * 100 : 0;
          return (
            <li key={b.blockId} className="text-[11px]">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-slate-700">{b.blockName}</span>
                <span className="text-slate-500 tabular-nums">
                  {b.vheInGroup} of {b.vheTotal}
                </span>
              </div>
              <div className="h-1.5 rounded bg-slate-100 overflow-hidden">
                <div className="h-full bg-slate-400" style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
      {composition.rationale && (
        <div className="mt-2 text-[10px] text-slate-500 italic">{composition.rationale}</div>
      )}
    </div>
  );
}

function SettlementInspectorBody({ node }) {
  if (node.outOfScope) {
    return (
      <div className="rounded-lg border border-slate-200 p-3 text-[11px] text-slate-600">
        This share settles outside the current Group ({node.groupId}). Open the
        target Group to view its full cost flow.
      </div>
    );
  }

  if (node.settlesViaIsta) {
    return (
      <>
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3">
          <div className="text-[10px] uppercase tracking-widest text-amber-800 font-semibold mb-1">
            Settled via Ista
          </div>
          <div className="text-[11px] text-amber-900">
            {node.audienceNote || "Per-VHE allocation handled by external metering — not a flat per-VHE charge."}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
            Settlement
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Audience</span>
              <span className="text-slate-800">{node.subLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Service code</span>
              <span className="text-slate-800 font-mono text-[10px]">{node.serviceCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">VHE count</span>
              <span className="text-slate-800">{node.vheCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total cost</span>
              <span className="text-slate-800 tabular-nums">{fmtEur2(node.amount)}</span>
            </div>
          </div>
        </div>
        <SettlementYoy yoy={node.yoyComparison} />
        <SiblingSettlements node={node} />
      </>
    );
  }

  const dir = settlementDirection(node.delta);
  const dCfg = dir ? directionConfig[dir] : null;
  const sCfg = node.settlementStatus ? settlementStatusConfig[node.settlementStatus] : null;
  const DirIcon = dCfg?.Icon;

  return (
    <>
      {/* Direction + status banner */}
      {(dCfg || sCfg) && (
        <div className={`rounded-lg border p-3 ${dCfg ? `${dCfg.border} ${dCfg.bg}` : "border-slate-200"}`}>
          <div className="flex items-center justify-between gap-2">
            {dCfg && (
              <div className={`inline-flex items-center gap-1.5 ${dCfg.color}`}>
                <DirIcon size={14} />
                <span className="text-[12px] font-semibold">{dCfg.label}</span>
              </div>
            )}
            {sCfg && (
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-slate-500">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${sCfg.dot}`} />
                {sCfg.label}
              </span>
            )}
          </div>
          {node.delta != null && (
            <div className={`mt-1.5 text-2xl font-semibold tabular-nums ${dCfg?.color || "text-slate-700"}`}>
              {fmtSignedEur(node.delta)}
            </div>
          )}
        </div>
      )}

      {/* Per-VHE breakdown */}
      <div className="rounded-lg border border-slate-200 p-3">
        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
          Per VHE
        </div>
        <div className="space-y-1">
          <PerVhe amount={node.amount} vheCount={node.vheCount} label="Actual cost" color="text-slate-800" />
          {node.advance != null && (
            <PerVhe amount={node.advance} vheCount={node.vheCount} label="Advance paid" />
          )}
          {node.delta != null && (
            <PerVhe
              amount={node.delta}
              vheCount={node.vheCount}
              label="Delta to settle"
              color={dir === "collect" ? "text-amber-700" : dir === "refund" ? "text-emerald-700" : "text-slate-700"}
            />
          )}
        </div>
      </div>

      {/* Identity facts */}
      <div className="rounded-lg border border-slate-200 p-3">
        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
          Settlement
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-500">Audience</span>
            <span className="text-slate-800">{node.subLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Service code</span>
            <span className="text-slate-800 font-mono text-[10px]">{node.serviceCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">VHE count</span>
            <span className="text-slate-800">{node.vheCount}</span>
          </div>
          {node.regulation && (
            <div className="flex justify-between">
              <span className="text-slate-500">Regulation</span>
              <span className="text-slate-800 text-[10px]">{node.regulation}</span>
            </div>
          )}
          {node.audienceNote && (
            <div className="mt-2 text-[10px] text-slate-500 italic">{node.audienceNote}</div>
          )}
        </div>
      </div>

      <SettlementYoy yoy={node.yoyComparison} />
      <NewAdvancePanel rec={node.newAdvanceRecommendation} vheCount={node.vheCount} />
      <AudienceComposition composition={node.audienceComposition} />
      <SiblingSettlements node={node} />

      <button className="w-full h-8 rounded-md border border-slate-300 bg-slate-100 text-[11px] text-slate-700 hover:bg-slate-200 inline-flex items-center justify-center gap-1.5">
        Open settlement workflow <ChevronRight size={12} />
      </button>
    </>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Page                                                          */
/* ──────────────────────────────────────────────────────────── */
/* CostFlowView — the embeddable body. Used standalone via CostFlowPage and
 * embedded via GroupDetailPage's "Cost flow" tab. When `compact` is true the
 * Header skips the identity / period (those live in the wrapping shell).
 * `initialLaneId` / `initialGroupId` let a parent (e.g. Overview tab) pre-focus
 * a lane or filter to an audience Group. */
export function CostFlowView({
  compact = false,
  onBack,
  initialLaneId = null,
  initialGroupId = null,
  onJumpToMeters = null,
} = {}) {
  const flow = getCostFlow();
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedLaneId, setSelectedLaneId] = useState(initialGroupId ? null : initialLaneId);
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [hoveredGroupId, setHoveredGroupId] = useState(null);
  const [overlay, setOverlay] = useState(false); // default OFF — less noise on first arrival
  const [focusMode, setFocusMode] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [showEdgeLabels, setShowEdgeLabels] = useState(false);
  // Search lives in the rail; nothing else filters at page level
  const [searchQuery, setSearchQuery] = useState("");
  const canvasRef = useRef(null);
  const laneRefs = useRef({});

  // Lane → service codes (for code-aware search)
  const laneCodes = useMemo(() => {
    const m = {};
    for (const lane of flow.lanes) m[lane.id] = getLaneServiceCodes(lane.id);
    return m;
  }, [flow.lanes]);

  // Search visibility — when the user types in the rail search, build a
  // subgraph union over matching lanes. Treated like focus visibility:
  // non-matching lanes collapse to strips.
  const filterVisibility = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matching = flow.lanes.filter((lane) => {
      const titleMatch = lane.title.toLowerCase().includes(q);
      const codeMatch = laneCodes[lane.id]?.some((c) => c.toLowerCase().includes(q));
      return titleMatch || codeMatch;
    });

    if (matching.length === flow.lanes.length) return null;

    const nodes = new Set();
    const edges = new Set();
    for (const lane of matching) {
      const sub = getLaneSubgraph(lane.id);
      sub.nodes.forEach((n) => nodes.add(n));
      sub.edges.forEach((e) => edges.add(e));
    }
    return { nodes, edges };
  }, [flow.lanes, searchQuery, laneCodes]);

  // ESC closes hover first, then node, then lane
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (hoveredNodeId) setHoveredNodeId(null);
        else if (hoveredGroupId) setHoveredGroupId(null);
        else if (selectedNodeId) setSelectedNodeId(null);
        else if (selectedGroupId) setSelectedGroupId(null);
        else if (selectedLaneId) setSelectedLaneId(null);
        else if (focusMode) setFocusMode(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hoveredNodeId, hoveredGroupId, selectedNodeId, selectedGroupId, selectedLaneId, focusMode]);

  function scrollToLane(laneId) {
    const el = laneRefs.current[laneId];
    if (el && canvasRef.current) {
      const top = el.offsetTop - 16;
      canvasRef.current.scrollTo({ top, behavior: "smooth" });
    }
  }

  // Honour incoming initialLaneId / initialGroupId on mount or when they change
  useEffect(() => {
    if (initialGroupId) {
      setSelectedGroupId(initialGroupId);
      setSelectedNodeId(null);
      setSelectedLaneId(null);
    } else if (initialLaneId) {
      setSelectedLaneId(initialLaneId);
      setSelectedNodeId(null);
      setSelectedGroupId(null);
      const t = setTimeout(() => scrollToLane(initialLaneId), 50);
      return () => clearTimeout(t);
    }
  }, [initialLaneId, initialGroupId]);

  // Focus visibility = subgraph that should remain visible.
  // Priority: audience > toolbar search/filter > focus-mode + selection.
  const focusVisibility = useMemo(() => {
    if (selectedGroupId) return getAudienceSubgraph(selectedGroupId);
    if (filterVisibility) return filterVisibility;
    if (!focusMode) return null;
    if (selectedNodeId) return getConnectedSubgraph(selectedNodeId);
    if (selectedLaneId) return getLaneSubgraph(selectedLaneId);
    return null;
  }, [focusMode, selectedNodeId, selectedLaneId, selectedGroupId, filterVisibility]);

  // Hover-driven highlight on top of focus
  const hoverHighlight = useMemo(() => {
    if (hoveredNodeId) return getConnectedSubgraph(hoveredNodeId);
    if (hoveredGroupId) return getAudienceSubgraph(hoveredGroupId);
    return null;
  }, [hoveredNodeId, hoveredGroupId]);

  const focusActive = !!(selectedNodeId || selectedLaneId || selectedGroupId);

  // Lane the rail should *highlight* (not strictly the same as selectedLaneId —
  // a clicked node also implies a "current lane" for visual orientation).
  const effectiveLaneId = useMemo(() => {
    if (selectedLaneId) return selectedLaneId;
    if (selectedNodeId) return getNodeById(selectedNodeId)?.laneId || null;
    return null;
  }, [selectedLaneId, selectedNodeId]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <Header
        flow={flow}
        overlay={overlay}
        setOverlay={setOverlay}
        focusMode={focusMode}
        setFocusMode={setFocusMode}
        focusActive={focusActive}
        showEdgeLabels={showEdgeLabels}
        setShowEdgeLabels={setShowEdgeLabels}
        onOpenHelp={() => setHelpOpen(true)}
        onBack={onBack}
        compact={compact}
      />
      <AudiencesBand
        selectedGroupId={selectedGroupId}
        setSelectedGroupId={(id) => {
          setSelectedGroupId(id);
          // Clear node/lane selection so audience scope drives the view
          if (id) {
            setSelectedNodeId(null);
            setSelectedLaneId(null);
          }
        }}
        hoveredGroupId={hoveredGroupId}
        setHoveredGroupId={setHoveredGroupId}
        rightActions={compact ? (
          <>
            <button
              onClick={() => setHelpOpen(true)}
              className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              title="How to read this"
            >
              <HelpCircle size={13} />
            </button>
            <ViewOptionsMenu
              overlay={overlay}
              setOverlay={setOverlay}
              focusMode={focusMode}
              setFocusMode={setFocusMode}
              focusActive={focusActive}
              showEdgeLabels={showEdgeLabels}
              setShowEdgeLabels={setShowEdgeLabels}
            />
          </>
        ) : null}
      />

      <div className="flex flex-1 min-h-0">
        <SourceRail
          flow={flow}
          selectedLaneId={selectedLaneId}
          effectiveLaneId={effectiveLaneId}
          setSelectedLaneId={(id) => {
            setSelectedLaneId(id);
            setSelectedNodeId(null);
          }}
          scrollToLane={scrollToLane}
          query={searchQuery}
          setQuery={setSearchQuery}
        />
        <Canvas
          flow={flow}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={(id) => {
            // Don't implicitly sync selectedLaneId — closing the node
            // inspector should not leave a Lane Overview behind.
            setSelectedNodeId(id);
          }}
          overlay={overlay}
          hoveredNodeId={hoveredNodeId}
          setHoveredNodeId={setHoveredNodeId}
          hoverHighlight={hoverHighlight}
          focusVisibility={focusVisibility}
          showEdgeLabels={showEdgeLabels}
          setSelectedLaneId={(id) => {
            setSelectedLaneId(id);
            setSelectedNodeId(null);
            setSelectedGroupId(null);
          }}
          canvasRef={canvasRef}
          laneRefs={laneRefs}
          onBackgroundClick={() => {
            setSelectedNodeId(null);
            setSelectedLaneId(null);
            setSelectedGroupId(null);
          }}
        />
        {helpOpen ? (
          <HelpPanel onClose={() => setHelpOpen(false)} />
        ) : selectedNodeId ? (
          <Inspector
            nodeId={selectedNodeId}
            onClose={() => setSelectedNodeId(null)}
            onJumpToMeters={onJumpToMeters}
          />
        ) : selectedLaneId ? (
          <LaneOverview
            flow={flow}
            laneId={selectedLaneId}
            onClose={() => setSelectedLaneId(null)}
            onPickNode={(id) => setSelectedNodeId(id)}
          />
        ) : null}
      </div>

    </div>
  );
}

/* Thin wrapper preserving the legacy /:orgId/cost-flow standalone route. */
export default function CostFlowPage() {
  const navigate = useNavigate();
  return <CostFlowView compact={false} onBack={() => navigate(-1)} />;
}
