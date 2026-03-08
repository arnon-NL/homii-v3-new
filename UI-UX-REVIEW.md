# homii v3 — Comprehensive UI/UX Review

**Date:** March 8, 2026
**Scope:** Full application audit — code analysis + live browser testing
**Methodology:** First-principles design review against Apple HIG / Attio / Notion standards
**Constraint:** Review only — no code changes

---

## Executive Summary

homii v3 is a well-structured B2B energy management tool with a solid architectural foundation. The multi-org system, module-based feature flags, and saved views pattern are all strong choices. The Sidebar navigation is clean and restrained. The overall visual tone is professional — Plus Jakarta Sans is a good typeface choice, and the slate-based neutral palette creates a calm, information-first environment.

That said, there are meaningful opportunities to tighten the design system and resolve structural inconsistencies — particularly around temporal navigation (broken years vs. calendar years), color semantics, and the visual treatment of status across the application. Several bugs were also discovered during live testing.

Findings are organized by impact: structural issues first, then state coverage, interactions, and visual system.

---

## 1. Structural Issues (Information Architecture)

### 1.1 Temporal Navigation: Broken Years vs. Calendar Years

**What was found:** Portaal buildings use heating seasons (e.g., "sep 2025 – aug 2026") while some historical periods use calendar years. The YearSelector pill bar for a Portaal building shows: `2021 | 2022 | 2023/24 | 2024/25 | 2025/26 | 2026`. This means the pills shift mid-history from single-year labels to slash-format labels — with no visual explanation of the transition.

**Why it matters:** A housing corporation user reviewing historical data will encounter a building that was on calendar years (2021, 2022) and then switched to a broken heating season (2023/24 onward). There is no indication of *why* the format changed, whether there's a gap period, or what the overlap rules are. The subtitle "sep 2025 – aug 2026" only appears for the selected pill — the user can't scan the full timeline at a glance to understand the periodization.

**Suggested fixes:**
- Add a subtle tooltip or info icon on the year pills explaining "This building transitioned to a heating season schedule in 2023."
- Consider showing the month range below *every* pill (not just the active one) in a micro-size caption, so the user can visually scan the timeline structure.
- For calendar-year pills (2021, 2022), show "jan – dec" underneath to make the contrast explicit.
- Visually group the pills: perhaps a thin vertical divider or extra spacing between the last calendar-year pill and the first broken-year pill.

### 1.2 Module Adaptation: Full Mode vs. Energy-Only Mode

**What was found:** The application correctly hides Suppliers from Portaal's sidebar and removes settlement-related views. The building list adapts its columns (no settlement status for Portaal). However, several gaps remain:

- **Building detail page** doesn't visually acknowledge the mode difference. A Portaal building shows the same tab structure (Overview, Services, Meters, VHE, Activity) as a Rochdale building, but many sections will be structurally empty because there's no ledger data. The Overview tab KPI strip still shows "Total Budget" and "Variance" even when no ledger data exists — these should either adapt their labels or be hidden.
- **Service detail page** in energy-only mode should be fundamentally simpler (no cost categories, no ledger entries, no distribution drilldown), but the page structure doesn't communicate this reduced scope upfront.

**Suggested fixes:**
- In energy-only mode, simplify the building detail Overview to focus on consumption data and meter health rather than showing budget/variance KPIs that won't have meaningful values.
- Consider removing or collapsing tabs that will always be empty in energy-only mode (e.g., if a building never has ledger entries, don't show the cost hierarchy at all — show a summary card instead).

### 1.3 Views System: Portaal Has "Data Quality Issues" but Rochdale Doesn't

**What was found:** Portaal's saved views include "Data Quality Issues" (a filtered view showing buildings with quality problems), while Rochdale only has settlement views. This is a structural inconsistency — data quality is relevant to both orgs, and settlement tracking could be relevant to future Portaal use cases.

**Why it matters:** The views system should feel like a consistent framework, not an org-specific feature set. Users who switch between orgs will develop expectations about what views are available.

**Suggested fix:** Consider making "Data Quality Issues" a default view template available to all orgs (hidden if no buildings have quality issues). Settlement views should only appear for orgs with the serviceCharges module — this is already correct.

### 1.4 Navigation Item Count

**What was found:** The sidebar has 5 main nav items (Home, Inbox, Tasks, Workflows, Onboarding) + 5 object items (Buildings, VHE, Services, Suppliers, Meters) + a views section. That's 10+ items before views. Four of the main nav items (Home, Inbox, Tasks, Workflows) are currently placeholder pages with no functionality.

**Why it matters:** Placeholder pages create a "construction site" feeling. They occupy prime navigation real estate with no payoff, which dilutes focus on the pages that actually work.

**Suggested fix:** For the current prototype/demo, consider collapsing placeholder items into a single "Coming Soon" group or dimming them visually. In production, only add nav items when the underlying functionality is ready.

---

## 2. State Coverage Gaps

### 2.1 Empty States Need Guidance

**What was found:** When a building has zero services, the Services tab shows "No results found" with no context or call-to-action. The same flat empty state appears on Meters and other tabs.

**Why it matters:** "No results found" is ambiguous — does it mean the data hasn't been loaded yet? The filter is too narrow? The building genuinely has no services? For a user onboarding a new building, this is a dead end.

**Suggested fix:** Differentiate between "no data exists yet" and "no data matches your filter." For truly empty entities, show a guided empty state: "No services configured for this building yet — services will appear here once they're added in the system."

### 2.2 Settlement Lifecycle: All 879 Buildings in "Distributed"

**What was found:** The Settlement 2024 summary bar shows `0 Not started | 0 Monitoring | 0 In review | 0 Approved | 879 Distributed`. While this may be correct for a completed settlement cycle, the UI doesn't communicate *that this period is complete/closed*.

**Why it matters:** A user landing on this page might wonder if something is wrong (why is everything in the last state?). There's no "completed" banner, timestamp, or visual distinction that says "Settlement 2024 is finalized."

**Suggested fix:** When all buildings in a settlement period reach the terminal state, show a completion indicator — e.g., a subtle banner: "Settlement 2024 — Completed" with a timestamp. Optionally, make the data visually read-only (slightly muted) to signal it's a historical record.

### 2.3 Year Context Not Always Visible

**What was found:** On the building detail page, the selected year pill (e.g., "2025/26") determines all data shown on the page. But once the user scrolls past the header area, the year context disappears from view. On the Services and Meters tabs, there's no year indicator at all within the tab content.

**Why it matters:** In a financial/energy tool, "which period am I looking at?" is the most dangerous question to lose track of. If a user is reviewing meter readings on the Meters tab and can't see which year is selected without scrolling back up, they may misinterpret data.

**Suggested fix:** Consider a sticky header or a subtle year/period breadcrumb that remains visible when scrolling. At minimum, each tab should repeat the period context in its content area (e.g., "Services — 2025/26 (sep 2025 – aug 2026)").

### 2.4 Bugs Discovered in Live Testing

**Bug 1 — "€ NaN/VHE" on Portaal Services list:** Every service row on the Portaal services page shows "€ NaN/VHE" as the per-unit cost. This is a data computation bug — likely dividing by zero or encountering undefined VHE counts.

**Bug 2 — Blank Suppliers page:** Navigating to `/rochdale/suppliers` after switching from Portaal renders a completely white page with no content. Even after a full page reload, the page remains blank. This may be an org context synchronization issue or a rendering error in `SupplierListPage`.

---

## 3. Interaction Issues

### 3.1 Building Detail: 3-Level Service Hierarchy is Dense

**What was found:** On a Rochdale building with services, the Overview tab shows a deep hierarchy: Service → Cost Categories → UNCLASSIFIED ledger entries. Each service has a progress bar, an expand toggle, cost category rows, and individual ledger entry rows with "Booked" badges. When multiple services are expanded, the page becomes extremely long and hard to scan.

**Why it matters:** The 3-level nesting is functionally correct but creates cognitive overload. Users scanning for problems have to mentally parse which level they're at. The hierarchy depth is appropriate for a dedicated "audit" or "drill-in" view, but not for the building Overview.

**Suggested fix:**
- On the Overview tab, show only service-level summaries (name, budget progress bar, verdict). Keep the hierarchy collapsed by default.
- Move the full 3-level drill-in (cost categories + ledger entries) to the Services tab or to a dedicated "Service Detail" modal/page.
- Use indentation + subtle left-border to make the hierarchy levels visually distinct when expanded.

### 3.2 Data Quality Values Are Text, Not Visual

**What was found:** In the Portaal buildings list, the "Data Quality" column shows text values: "Good", "medium", "low" (note: inconsistent capitalization). These are not visually differentiated beyond text.

**Why it matters:** Data quality is a key triage metric — users need to scan for problems quickly. Text-only values require reading every cell rather than scanning visually.

**Suggested fix:** Use the anomaly-only principle: "Good" quality should be neutral (no indicator or just the text in muted gray). "Medium" should show amber text. "Low" should show red text. This lets the user spot problems without reading every row.

### 3.3 Filter Bar: No Search or Sort on Main List Pages

**What was found:** The building list pages have a views bar and (for Rochdale services) category filter tabs, but no search field for filtering by building name/address and no sort controls on table columns.

**Why it matters:** With 879 buildings, finding a specific one requires scrolling through the entire table. In production, this will be a significant usability issue.

**Suggested fix:** Add a search input to the filter bar (matching against building name, complex, address). Add clickable column headers for sorting. These are table-stakes features for any list page with more than ~20 items.

---

## 4. Visual System Issues

### 4.1 Color: Green Used for "Good"/"Active" Status (Critical)

**What was found:** The `status-badge.jsx` component maps "good", "active", and "success" states to emerald green (`#10B981`). This appears on building detail pages as a green "Good" data quality badge and green "Active" status badge. Meter cards show "Readings up to date" in a teal/green color. Ledger entries show "Booked" status in teal/green.

**Why it matters:** This is the single highest-impact visual issue. Following the anomaly-only principle used by Apple, Notion, and Attio: the absence of red *is* the signal that things are fine. When every healthy row has a green badge, the green becomes invisible noise — the user can't instantly spot the one amber or red item that needs attention. The page looks like a dashboard rather than a professional tool.

**Suggested fix:**
- Remove green from all persistent status badges. "Good" → neutral gray text on a gray background. "Active" → neutral or no badge at all (active is the expected state). "Booked" → neutral.
- Reserve green exclusively for momentary success confirmations (toast notifications, checkmark animations after save).
- Red for genuine problems. Amber for warnings. Everything else is neutral.
- The brand teal (`#3EB1C8`) should be used only for interactive elements, not status indicators.

### 4.2 Color: Colored Badge Backgrounds Create Patchwork Effect

**What was found:** Status badges use colored backgrounds: green-50 for good, amber-50 for pending, red-50 for flagged, etc. Each status gets its own tint, creating a patchwork quilt of colored pills across the page.

**Suggested fix:** Status badges should use colored *text* (red text, amber text) on a uniform neutral background (slate-100 or white). This is the Notion approach — typographic, not chromatic.

### 4.3 Color: Utility Icons Use Per-Category Colors

**What was found:** In `BuildingListPage.jsx`, utility icons use distinct colors: electricity gets one color, gas another, water another, heating another. This per-category color coding collides with the status color system — users can't tell if a color means "utility type" or "health status."

**Suggested fix:** All utility icons should use the same neutral gray. Differentiate utility types by *icon shape*, not color. Color is reserved exclusively for status/health.

### 4.4 Color: Off-Brand Hex Values

**What was found:** The `attribute-panel.jsx` component uses hardcoded `#3B8EA5` for link colors — this is not in the brand palette (`brand.jsx` defines navy, blue/teal, red, amber). The `ServiceDetailPage.jsx` introduces green (`#10B981`) and purple (`#8B5CF6`) outside the brand palette.

**Suggested fix:** All colors must come from the brand palette. If a new color is genuinely needed, add it to `brand.jsx` with a clear semantic name. No hardcoded hex values in components.

### 4.5 Typography: Too Many Font Sizes

**What was found:** Across the codebase, the following font sizes appear: `text-[10px]`, `text-[11px]`, `text-[13px]`, `text-xs` (12px), `text-sm` (14px), `text-base` (16px), `text-lg` (18px), `text-xl` (20px), `text-2xl` (24px). That's 9+ distinct sizes, well above the recommended 4-5.

Key offenders:
- `text-[10px]` — below the 11px accessibility floor. Used in BuildingDetailPage for some labels.
- `text-[13px]` — the most dangerous size (indistinguishable from 14px). Used in the org switcher dropdown.
- `text-[11px]` — used for section labels, which is fine, but also for "Powered by homii" and keyboard shortcuts.

**Suggested fix:** Consolidate to 5 sizes maximum:
- **Title:** 20px — page headings
- **Heading:** 16px — card titles, section headers, KPI numbers
- **Body:** 14px (`text-sm`) — table cells, descriptions, form inputs
- **Caption:** 12px (`text-xs`) — column headers, meta info, timestamps
- **Micro:** 11px — section labels (UPPERCASE), service codes only

Eliminate all `text-[10px]` (promote to 11px), all `text-[13px]` (promote to 14px or demote to 12px), and `text-lg`/`text-2xl` (consolidate to 16px heading or 20px title).

### 4.6 Typography: Font Weight Drift

**What was found:** The codebase uses `font-normal` (400), `font-medium` (500), `font-semibold` (600), and `font-bold` (700). That's 4 weights — one more than recommended.

**Suggested fix:** Eliminate `font-bold` (700). Replace all instances with `font-semibold` (600). The visual difference between 600 and 700 at heading sizes is negligible, and using both creates a false hierarchy level.

### 4.7 Spacing: Half-Step Values Break the 4px Grid

**What was found:** Throughout the codebase: `gap-1.5` (6px), `gap-2.5` (10px), `py-0.5` (2px), `px-1.5` (6px), `px-2.5` (10px), `pr-2.5` (10px), `pb-2.5` (10px). These values fall off the 4px grid and create subpixel rendering inconsistencies.

Specific examples:
- Sidebar: `py-2.5` on the org switcher, `py-0.5` on the filter bar
- BuildingDetailPage: `gap-1.5` between icon and label, `px-2.5` on various elements
- Cards and badges: `py-0.5` for tight vertical padding

**Suggested fix:** Round all half-step values to the nearest 4px multiple:
- `gap-1.5` (6px) → `gap-1` (4px) or `gap-2` (8px)
- `gap-2.5` (10px) → `gap-2` (8px) or `gap-3` (12px)
- `py-0.5` (2px) → `py-1` (4px)
- `px-1.5` (6px) → `px-1` (4px) or `px-2` (8px)
- `px-2.5` / `py-2.5` (10px) → `px-2` (8px) or `px-3` (12px)

### 4.8 Icon Sizes: Too Many Variations

**What was found:** Icons across the app use: `size={11}`, `size={13}`, `size={14}`, `size={15}`, `size={16}`, `size={18}`, `size={20}`. That's 7 distinct sizes — more than double the recommended 3.

Specific inconsistencies:
- Sidebar nav items: `size={15}` with `strokeWidth={1.5/2}`
- Sidebar view items: `size={13}` with `strokeWidth={1.5/2}`
- Sidebar search icon: `size={13}` with `strokeWidth={2}`
- Plus button in sidebar: `size={11}` with `strokeWidth={2.5}`
- Filter bar icons: `size={14}`

**Suggested fix:** Consolidate to 3 sizes:
- **14px** — all inline/caption-level icons (view items, meta labels, badges)
- **16px** — all body-level icons (nav items, table rows, buttons)
- **20px** — all heading-level icons (page actions, empty states)

The `size={11}` plus button and `size={13}` icons should be promoted to 14px. The `size={15}` sidebar nav icons should be promoted to 16px.

### 4.9 Border Radius: Three+ Values in Use

**What was found:** The codebase uses `rounded-lg` (8px), `rounded-xl` (12px), `rounded-md` (6px), and `rounded-full`. That's 4 radius values where 2 should suffice.

**Suggested fix:** Consolidate to `rounded-lg` (containers) + `rounded-full` (pills/avatars). Replace all `rounded-md` → `rounded-lg`, all `rounded-xl` → `rounded-lg`.

### 4.10 Shadows: shadow-sm on Static Cards

**What was found:** The `card.jsx` component applies `shadow-sm` to all cards by default. These are static, always-visible containers — not floating elements.

**Suggested fix:** Remove `shadow-sm` from the card component default. Use `border border-slate-200` instead. Reserve `shadow-sm` for hover states and `shadow-md` for floating elements (the org switcher dropdown already correctly uses `shadow-lg`, which should be `shadow-md`).

### 4.11 Shadows: Org Switcher Dropdown Uses shadow-lg

**What was found:** The org switcher dropdown in the Sidebar uses `shadow-lg`, which is heavier than necessary for a floating element in a data tool.

**Suggested fix:** Downgrade to `shadow-md` for consistency with the elevation system.

### 4.12 Motion: `transition-colors` Is Used Correctly (Positive Note)

**What was found:** The codebase consistently uses `transition-colors` rather than `transition-all` for hover states. Durations are in the ~150ms range. No bounce/spring animations were found.

**This is good.** The animation system is restrained and professional. Keep this approach.

---

## 5. Specific Page-Level Findings

### 5.1 Building List Page (Rochdale — Default View)

**Strengths:** Clean table layout. Column selection adapts to the active view. The views bar with pill-style tabs is a good pattern. Utility icons provide a quick visual scan of what's connected.

**Issues:**
- Utility icons use per-category colors (see §4.3)
- Data Quality column could use color-coded text for anomaly scanning
- No search field or column sorting
- No pagination visible (879 buildings in one table)

### 5.2 Building List Page (Rochdale — Settlement View)

**Strengths:** The settlement summary bar is an excellent pattern — it gives an at-a-glance distribution of buildings across lifecycle states. The Net Result column clearly shows financial outcomes.

**Issues:**
- Net Result amounts use a teal/brand-blue color for positive (refund) values. This introduces yet another semantic use of the brand color. Consider: positive amounts in neutral (the default/expected outcome), negative amounts in red (the anomaly).
- Summary bar pills use colored backgrounds per status — should use neutral backgrounds with colored text only for anomaly states.

### 5.3 Building Detail Page

**Strengths:** The year pill selector is clever and handles the complex heating season logic well. The right-side attribute panel is a good pattern for metadata. The verdict card with attention items is an excellent way to surface problems.

**Issues:**
- Green "Good" badge and green "Active" badge (see §4.1)
- Year context not sticky (see §2.3)
- 3-level service hierarchy is too deep for Overview (see §3.1)
- `text-[10px]` used below accessibility floor (see §4.5)
- The attribute panel uses hardcoded `#3B8EA5` link color (see §4.4)

### 5.4 Service Detail Page (Portaal — Energy Mode)

**Strengths:** Good use of KPI strip at top (Buildings, Total Budget, Variance, Meters). Clean table with per-building breakdown.

**Issues:**
- Variance KPI uses red for over-budget — this is correct and good
- The page could benefit from a clearer mode indicator: "Energy-only service — no ledger data available"

### 5.5 Service List Page (Rochdale)

**Strengths:** Category filter tabs (All, Energy & Water, Installations, etc.) are a strong interaction pattern. Service cards are clean and scannable.

**Issues:**
- "€ NaN/VHE" bug on Portaal (see §2.4)
- Category grouping uses accordion-style headers that could benefit from consistent icons

### 5.6 Supplier List Page (Rochdale)

**Issue:** Page renders completely blank/white. This is a bug (see §2.4).

### 5.7 Placeholder Pages (Home, Inbox, Tasks, Workflows, Onboarding)

These are intentionally placeholder and were not evaluated for design quality. The recommendation in §1.4 applies: consider dimming or collapsing these until they're functional.

---

## 6. What's Working Well

It's worth calling out the things that should be preserved and expanded:

1. **Sidebar navigation structure** — Clean, restrained, well-organized into logical groups. The org switcher is well-implemented with a Notion-style dropdown.

2. **Saved Views pattern** — URL-based view switching with `?view=` params is architecturally sound. The views bar UI is clean.

3. **Module-based feature flags** — The `hasModule()` / `moduleConfig` system correctly adapts the UI between org modes. This is a strong architectural pattern.

4. **Year/Season selector** — The heating season logic is complex, and the pill-based selector handles it reasonably well. The subtitle showing the date range is a good detail.

5. **Plus Jakarta Sans** — Excellent typeface choice for a B2B data tool. Modern, clean, good numeric rendering.

6. **Slate-based neutral palette** — The overall color foundation is correct. The issue is the chromatic colors added on top, not the base palette.

7. **Verdict card + attention items** — On the building detail page, the summary verdict with listed attention items is an excellent pattern for surfacing problems. This is the right way to guide user attention.

8. **Progress bars with pace markers** — The budget progress bars that show a "pace" tick mark are a sophisticated touch that communicates "ahead of schedule" vs. "behind schedule" in a visually compact way.

9. **Animation discipline** — `transition-colors` used consistently, no `transition-all`, no bounce effects. This is professional-grade motion design.

10. **Pre-indexed data lookups** — While not a UI concern, the O(1) Map-based data layer ensures the interface stays snappy. Performance is a UX feature.

---

## 7. Priority Recommendations (Ranked by Impact)

| Priority | Issue | Effort | Section |
|----------|-------|--------|---------|
| **P0** | Fix "€ NaN/VHE" bug (Portaal Services) | Low | §2.4 |
| **P0** | Fix blank Suppliers page | Low | §2.4 |
| **P1** | Remove green from persistent status badges → neutral | Medium | §4.1 |
| **P1** | Add year/period context to tab content areas | Low | §2.3 |
| **P1** | Add search + sort to list pages | Medium | §3.3 |
| **P2** | Consolidate icon sizes to 3 (14/16/20) | Medium | §4.8 |
| **P2** | Consolidate font sizes to 5, eliminate 10px/13px | Medium | §4.5 |
| **P2** | Remove half-step spacing values | Medium | §4.7 |
| **P2** | Remove colored badge backgrounds → text-only color | Low | §4.2 |
| **P2** | Remove per-category utility icon colors | Low | §4.3 |
| **P3** | Improve empty states with guidance text | Low | §2.1 |
| **P3** | Add broken-year transition indicator | Low | §1.1 |
| **P3** | Consolidate border-radius to 2 values | Low | §4.9 |
| **P3** | Remove shadow-sm from static cards | Low | §4.10 |
| **P3** | Consolidate all hex values to brand palette | Low | §4.4 |
| **P3** | Dim/collapse placeholder nav items | Low | §1.4 |

---

*Review conducted against the UI/UX QA framework (Apple HIG, Attio, Notion reference standards). Focus: structural correctness, state coverage, visual system consistency, and interaction quality for a B2B energy management platform serving Dutch housing corporations.*
