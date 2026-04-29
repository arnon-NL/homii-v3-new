import costFlowData from "@/data/costFlow.json";

/* ─────────────────────────────────────────────────────────────
 * Cost-flow data accessors
 *
 * The new (post-migration) data shape:
 *   Group           — a bundle of VHEs (Complex / Block / ad-hoc)
 *   CostSource      — the input to the graph (meter, contract, recurring)
 *   Division /
 *   DivisionDef     — split rules + their materializations
 *   CostCenter      — anchored ledger coordinate
 *   SettlementPeriod — the settlement target
 *
 * The mock JSON encodes one worked example (Zeverijnstraat 2024) as a
 * graph: lanes (visual rows), nodes (typed), edges (with amounts).
 * ──────────────────────────────────────────────────────────── */

export function getCostFlow() {
  return costFlowData;
}

export function getNodeById(id) {
  return costFlowData.nodes.find((n) => n.id === id) || null;
}

export function getNodesByLane(laneId) {
  return costFlowData.nodes.filter((n) => n.laneId === laneId);
}

export function getEdgesForNode(nodeId) {
  return {
    incoming: costFlowData.edges.filter((e) => e.to === nodeId),
    outgoing: costFlowData.edges.filter((e) => e.from === nodeId),
  };
}

export function getSourceNodes() {
  return costFlowData.nodes.filter((n) => n.type === "source");
}

/* Service codes carried by settlement nodes within a lane (one lane can carry
 * multiple services — the shared electricity meter feeds SV1370G + SV1372G). */
export function getLaneServiceCodes(laneId) {
  const codes = new Set();
  for (const n of costFlowData.nodes) {
    if (n.laneId === laneId && n.type === "settlement" && n.serviceCode) {
      codes.add(n.serviceCode);
    }
  }
  return [...codes];
}

/* Settlements that share a Group (used for sibling navigation in the inspector) */
export function getSettlementsByGroup(groupId, exceptId = null) {
  return costFlowData.nodes.filter(
    (n) =>
      n.type === "settlement" &&
      !n.outOfScope &&
      n.groupId === groupId &&
      n.id !== exceptId
  );
}

/*
 * Connected subgraph through nodeId — the union of:
 *   • all ancestors reachable by walking edges backwards (edge.to === current)
 *   • all descendants reachable by walking edges forwards
 *   • all edges that touch any of those nodes on either side
 *
 * Returned as Sets so look-ups in render are O(1).
 */
export function getConnectedSubgraph(nodeId) {
  if (!nodeId) return { nodes: new Set(), edges: new Set() };
  const edges = costFlowData.edges;
  const reached = new Set([nodeId]);

  // Upstream BFS
  const upQ = [nodeId];
  while (upQ.length) {
    const cur = upQ.shift();
    for (const e of edges) {
      if (e.to === cur && !reached.has(e.from)) {
        reached.add(e.from);
        upQ.push(e.from);
      }
    }
  }
  // Downstream BFS
  const downQ = [nodeId];
  while (downQ.length) {
    const cur = downQ.shift();
    for (const e of edges) {
      if (e.from === cur && !reached.has(e.to)) {
        reached.add(e.to);
        downQ.push(e.to);
      }
    }
  }

  // Edges where both endpoints are in `reached`
  const touchingEdges = new Set();
  edges.forEach((e, idx) => {
    if (reached.has(e.from) && reached.has(e.to)) touchingEdges.add(idx);
  });

  return { nodes: reached, edges: touchingEdges };
}

/* Subgraph for a whole lane: union of connected subgraphs of each source in the lane */
export function getLaneSubgraph(laneId) {
  const sources = costFlowData.nodes.filter(
    (n) => n.laneId === laneId && n.type === "source"
  );
  const nodes = new Set();
  const edges = new Set();
  for (const s of sources) {
    const sub = getConnectedSubgraph(s.id);
    sub.nodes.forEach((n) => nodes.add(n));
    sub.edges.forEach((e) => edges.add(e));
  }
  return { nodes, edges };
}

/*
 * Audiences = the Groups that receive cost via in-scope settlement nodes.
 * Each audience's subgraph is the union of subgraphs of all settlement nodes
 * whose groupId matches.
 */
export function getAudienceSubgraph(groupId) {
  const settlements = costFlowData.nodes.filter(
    (n) => n.type === "settlement" && !n.outOfScope && n.groupId === groupId
  );
  const nodes = new Set();
  const edges = new Set();
  for (const s of settlements) {
    const sub = getConnectedSubgraph(s.id);
    sub.nodes.forEach((n) => nodes.add(n));
    sub.edges.forEach((e) => edges.add(e));
  }
  return { nodes, edges };
}

export function getAudienceSummary(groupId) {
  const sibling = costFlowData.siblingGroups?.find((g) => g.id === groupId);
  const settlements = costFlowData.nodes.filter(
    (n) => n.type === "settlement" && !n.outOfScope && n.groupId === groupId
  );
  let settled = 0;
  let flagCount = 0;
  for (const s of settlements) {
    settled += s.amount || 0;
    flagCount += (s.flags?.length || 0);
  }
  // Lanes that touch this audience (at least one settlement node lives in)
  const laneIds = new Set(settlements.map((s) => s.laneId));
  return {
    id: groupId,
    name: sibling?.name || groupId,
    kind: sibling?.kind || "adhoc",
    vheCount: sibling?.vheCount,
    active: sibling?.active || false,
    settled,
    settlementCount: settlements.length,
    laneCount: laneIds.size,
    flagCount,
  };
}

export function getAllAudiences() {
  const sg = costFlowData.siblingGroups || [];
  return sg
    .map((g) => getAudienceSummary(g.id))
    .filter((s) => s.settlementCount > 0); // hide computational-only groups
}

/* Lane summary used by the left rail */
export function summariseLane(laneId) {
  const nodes = getNodesByLane(laneId);
  const sources = nodes.filter((n) => n.type === "source");
  const settlements = nodes.filter((n) => n.type === "settlement" && !n.outOfScope);

  const expected = sources.reduce((s, n) => s + (n.amount || 0), 0);
  const settled = settlements.reduce((s, n) => s + (n.amount || 0), 0);

  // Worst anchor status across all nodes in lane
  const statuses = nodes.flatMap((n) => (n.anchors || []).map((a) => a.status));
  const flagKinds = nodes.flatMap((n) => (n.flags || []).map((f) => f.kind));

  let health = "matched";
  if (statuses.includes("wrong_account") || flagKinds.includes("error")) health = "error";
  else if (statuses.includes("matched_partial") || statuses.includes("missing") || statuses.includes("duplicate") || flagKinds.includes("warning")) health = "warning";
  else if (statuses.length === 0 && nodes.some((n) => n.type === "deduction" || n.type === "addition")) health = "warning";

  const issueCount = nodes.reduce((c, n) => c + (n.flags?.length || 0), 0);

  // Net delta across in-scope settlements: + = collect from tenants, − = refund
  const deltaContributors = settlements.filter((n) => n.delta != null);
  const netDelta = deltaContributors.reduce((s, n) => s + n.delta, 0);
  const hasDelta = deltaContributors.length > 0;
  const settlementDirection = !hasDelta
    ? "none"
    : netDelta > 1
    ? "collect"
    : netDelta < -1
    ? "refund"
    : "balanced";

  // YoY % vs prior year, taken from the dominant source node (largest by amount)
  let yoyPct = null;
  const dominantSource = sources.reduce((m, s) => (!m || (s.amount || 0) > (m.amount || 0) ? s : m), null);
  if (dominantSource && dominantSource.yoyComparison && dominantSource.yoyComparison.length >= 2) {
    const sorted = [...dominantSource.yoyComparison].sort((a, b) => a.year - b.year);
    const last = sorted[sorted.length - 1];
    const prev = sorted[sorted.length - 2];
    if (prev && prev.amount > 0) yoyPct = (last.amount - prev.amount) / prev.amount;
  }

  return {
    laneId,
    expected,
    settled,
    health,
    issueCount,
    sourceCount: sources.length,
    settlementCount: settlements.length,
    netDelta: hasDelta ? netDelta : null,
    settlementDirection,
    yoyPct,
  };
}

/* Anchor status → semantic colour bucket */
export function anchorStatusBucket(status) {
  switch (status) {
    case "matched":         return "ok";
    case "matched_partial": return "warn";
    case "wrong_account":   return "error";
    case "duplicate":       return "warn";
    case "missing":         return "error";
    case "none":
    default:                return "neutral";
  }
}

/* Trust meter computation across the whole flow */
export function computeTrust() {
  const ts = costFlowData.trustSummary;
  const reconciledPct = ts.totalAnchored / ts.totalExpected;
  return {
    ...ts,
    reconciledPct,
    formattedPct: Math.round(reconciledPct * 100),
  };
}

/* Format helpers */
export const fmtEur = (v) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);

export const fmtEur2 = (v) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

export const fmtPct = (v) =>
  new Intl.NumberFormat("nl-NL", { style: "percent", maximumFractionDigits: 0 }).format(v);

export const fmtSignedEur = (v) => {
  if (v == null) return "—";
  const sign = v >= 0 ? "+" : "";
  return sign + fmtEur(v);
};
