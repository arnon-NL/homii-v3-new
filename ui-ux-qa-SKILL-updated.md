---
name: ui-ux-qa
description: >
  Reviews UI/UX designs, prototypes, and front-end code for B2B SaaS applications against
  first-principles design thinking. Use this skill whenever the user asks to review, audit,
  critique, or QA any user interface — whether that's a React prototype, Figma mockup,
  HTML page, wireframe description, or navigation structure. Also trigger when the user asks
  to "check my UI", "review this page", "is this good UX", "audit the design", "QA the
  interface", or discusses information architecture, navigation patterns, page structure, or
  component hierarchy for an admin panel, dashboard, or internal tool. Works on screenshots,
  code files, written descriptions, or live URLs. Even if the user just shares a UI
  component and asks "what do you think?", this skill should trigger.
---

# UI/UX QA Review

This skill helps you perform structured, first-principles UI/UX reviews of B2B SaaS interfaces. It's grounded in real patterns discovered through deep product design work on complex admin tools (energy management, financial workflows, multi-entity platforms), but the principles are universal.

The goal is not to nitpick pixels. It's to catch structural problems — the kind that make users confused, create tech debt, or silently erode trust. A good review asks: "Does this interface reflect how the domain actually works?"

## How to use this skill

When reviewing UI/UX, follow this sequence:

1. **Understand what you're looking at** — Read the code, screenshot, or description. Identify: what type of page is this (list, detail, form, dashboard)? What domain does it serve? Who are the users?
2. **Run the information architecture check** — This is the most important layer. See the "Information Architecture" section below.
3. **Run the interaction and state checks** — See "Interaction Design" and "State Coverage."
4. **Run the visual and component checks** — See "Visual Hierarchy" and "Component Patterns."
5. **Produce a structured report** — Use the output format described at the bottom.

Don't skip straight to visual polish. The most expensive UI/UX bugs are structural ones (wrong navigation, misplaced concepts, missing states), not cosmetic ones.

---

## Information Architecture

This is where most B2B SaaS products go wrong. The structure of the interface should mirror the structure of the domain — not the structure of the database or the org chart.

### One Concept, One Home

Every domain object (a building, a customer, an invoice, a project) should live in exactly one place in the navigation. If a concept appears in multiple places, users have to learn which version is the "real" one, and developers have to keep them in sync.

**What to check:**
- Can you reach the same entity from multiple navigation paths? If so, is one clearly the canonical home and the others just links/references?
- Are there parallel modules that duplicate the same underlying objects? (e.g., "Energy Module" and "Service Charges Module" both showing buildings — they should be unified)
- When drilling into a detail page, is it clear which list you came from and how to get back?

**Red flag:** If deleting a navigation item would make some data unreachable, that data probably doesn't have a proper home.

### Depth Proportional to Complexity

Not all entities in a system deserve the same depth of UI. A consumption-based utility with meter readings, forecasts, and distribution logic needs significantly more interface depth than a simple contract cost. The interface should scale its complexity to match the domain complexity of what it's showing.

**What to check:**
- Do simple items get the same amount of screen real estate as complex ones? (They shouldn't)
- Is there a way to progressively reveal depth — showing a summary by default and allowing drill-in for complexity?
- Are there tabs or sections that exist for completeness but will usually be empty for most records?

**Red flag:** If a page has 8 tabs but most users only ever use 2, the architecture is probably wrong.

### Functional Placement

Elements should live where they're functionally relevant, not where they're administratively convenient. Ask: "When a user is thinking about X, what question are they actually trying to answer?"

**What to check:**
- For each section/tab, what user question does it answer? Can you articulate it in plain language?
- Are related data points close together, or does the user have to jump between pages to connect them?
- Is data placed where it's a *source* (it feeds into the next step) or where it's a *result* (it was produced by the previous step)? The placement should match the user's mental model of cause → effect.

**Example:** A main meter is a *cost source* — it determines the invoice. So it belongs on the cost/consumption page, not on a generic "meters" page. Submeters are *distribution variables* — they determine allocation. So they belong in the distribution view, not with the main meter.

**Red flag:** If you have to explain to a user why something is on a particular page, the placement is probably wrong.

### Navigation Restraint

Resist the temptation to give everything its own tab or sidebar item. Every navigation element adds cognitive load. Before adding a tab, ask: "Is this a fundamentally different user task, or is it a sub-step of an existing task?"

**What to check:**
- Count the top-level navigation items. More than 7-8 for a B2B tool is a yellow flag.
- Count tabs on detail pages. More than 5 is a yellow flag.
- Are there tabs that could be sections within another tab?
- Is the navigation serving the user's workflow, or the system's data model?

**Red flag:** Navigation that mirrors database tables (Users, Roles, Permissions, Sessions, Logs, Tokens...) instead of user tasks (People, Settings, Activity...).

---

## State Coverage

Most UIs are designed for the happy path. Real applications spend a huge amount of their life in non-happy states. Every page should account for these:

### Lifecycle States

Entities often have lifecycle phases that fundamentally change what the user can do and see. The same page structure should adapt to the lifecycle state rather than creating separate pages.

**What to check:**
- Does the entity have lifecycle states (e.g., Draft → Active → Archived, or Onboarding → Live → Paused)? If so, are they reflected in the UI?
- When an entity is in an early state (onboarding, setup), does the page show setup progress or guidance — or is it just empty?
- When an entity is in a terminal state (archived, settled), is the data clearly frozen/read-only, or could users mistake it for editable?
- Is the lifecycle state visible at a glance (badge, color, banner), or hidden?

**Red flag:** An empty page with no guidance when an entity is newly created.

### Temporal Dimensions

Many B2B applications have a time dimension (fiscal years, seasons, billing periods, sprints). This is a common source of UI confusion.

**What to check:**
- Is the time period clearly indicated? The user should never wonder "which year/period am I looking at?"
- Is the time selector a global control (good) or do users have to set it per-section (bad)?
- When viewing a past/settled period, is the UI clearly distinct from the current period?
- Can users accidentally edit data in a closed period?

**Red flag:** A page where the time period is only visible in a small dropdown that defaults to "current" without clearly labeling it.

### Empty, Loading, Error, and Edge States

**What to check:**
- **Empty state:** When there's no data yet, does the page explain why and what to do? ("No services configured yet — add your first service")
- **Loading state:** Is there a clear indication that data is loading? No blank screens.
- **Error state:** If data fails to load, is there a recovery path? ("Failed to load meter data — retry" not just a blank area)
- **Partial data:** What happens when some data exists but is incomplete? (e.g., consumption data available but no forecast yet)
- **Scale:** How does the page behave with 5 items vs. 500? Tables should have pagination or virtual scrolling. Cards don't scale past ~20.

**Red flag:** A design that only looks good with the exact amount of sample data shown in the mockup.

---

## Interaction Design

### Workflow Alignment

The interface should support the user's actual workflow — the sequence of tasks they perform. Not every possible task, but the common paths.

**What to check:**
- For each page, what are the 2-3 most common actions a user takes? Are those actions prominent and easy to reach?
- Does the UI support the natural sequence of a workflow? (e.g., review data → validate → approve → finalize, with clear transitions between steps)
- Are approval/confirmation workflows clearly indicated with status badges and action buttons?
- Can the user understand where they are in a multi-step process?

### Progressive Disclosure

Show the right information at the right time. Don't front-load everything.

**What to check:**
- List views should show summary metrics that help the user decide *which* item to click into
- Detail views should start with an overview and allow drill-in
- Are there collapsible sections for secondary information?
- Is advanced functionality hidden behind an intentional interaction (click, expand, more menu) rather than displayed by default?

### Data Tables

Tables are the backbone of B2B SaaS. They deserve special attention.

**What to check:**
- Does the table have consistent column alignment? (numbers right-aligned, text left-aligned, status badges centered)
- Are rows scannable? The user should be able to find what they're looking for without reading every cell.
- Is there a clear visual indicator for rows that need attention (highlighting, warning icons, color)?
- Are column headers descriptive and concise?
- Is there sorting, filtering, or search when the table can have many rows?
- Do numeric columns use tabular (monospace) number formatting for easy comparison?

---

## Visual Hierarchy

### Information Density

B2B tools serve professional users who work in the interface daily. They want density, not decoration. But density without hierarchy is chaos.

**What to check:**
- Are the most important numbers/metrics visually prominent? (larger font, bold weight, prominent position)
- Is there clear visual grouping? Related items should be visually proximate.
- Is there consistent use of type scale? (At most 4-5 distinct sizes on a page)
- Are secondary/supporting labels clearly de-emphasized? (smaller, lighter, uppercase tracking)
- Is the color palette functional? Color should encode meaning (status, type, severity), not decoration.

### Status Communication

Users should understand the health/status of things at a glance.

**What to check:**
- Is there a consistent color system for status? (green = good/complete, orange = warning/in-progress, red = error/critical, gray = neutral/inactive)
- Are status indicators consistent in form? (dots, badges, icons — pick one system and use it everywhere)
- Can the user scan a list/table and immediately identify which items need attention?
- Are anomalies visually distinct from normal states?

### Whitespace and Breathing Room

**What to check:**
- Is there sufficient padding inside cards and containers?
- Are sections visually separated (spacing, dividers, background color changes)?
- Does the page feel calm and structured, or busy and overwhelming?
- Is the page width constrained (max-width ~1100-1300px for content) to prevent lines from becoming too long to scan?

---

## Visual Anti-Patterns

Certain visual patterns that seem logical in isolation create a cartoonish or unprofessional impression when deployed in a B2B SaaS context. Watch out for these and flag them immediately.

### Colored Dot Grids

**Never use rows of small colored dots (green/amber/red) to represent per-period or per-item status.** This pattern — common when showing monthly closing status, pipeline stages, or multi-step completeness — looks like a game or a children's activity tracker, not a professional tool.

**Why it's harmful:**
- Dense clusters of colored dots dominate the visual hierarchy, pulling attention away from the actual data (numbers, names, trends)
- The pattern doesn't scale — 12 dots per row across 15 rows creates visual noise, not information
- Users can't extract meaningful insight from a row of dots at a glance; they still have to hover/click to understand each one
- The visual weight is disproportionate to the information value

**What to do instead:**
- Use a single **progress bar** showing percentage of budget/target used (e.g., `actual/budget` as a thin bar with a percentage label)
- Use a **pace marker** on the progress bar to show where the entity *should* be at this point in time (a small vertical tick at the year-percentage mark)
- For overall status, use **count-based summaries** ("5 on track, 2 over budget") rather than per-item dot grids
- For monthly/period tracking, use **collapsible detail** with textual status per period, not visual dot arrays

### Excessive Traffic-Light Coloring

**Don't color-code every row or element with green/amber/red.** When everything is colored, nothing stands out. Reserve strong colors for genuine anomalies.

**What to do instead:**
- Default state should be **neutral** (no color, or very subtle). Only items needing attention get color.
- Use a thin **status bar** (2px vertical stripe on the left of a row/card) rather than coloring entire cells or backgrounds
- Limit red/amber to genuinely actionable items — if 80% of rows are green, the green isn't adding information

### Decorative Icons in Data Cells

**Don't put status icons (checkmarks, clocks, warning triangles) inside dense data grids.** A table with an icon in every cell looks cluttered. Icons work in summary/header contexts; in data grids they fight with the numbers.

**What to do instead:**
- Use subtle visual signals (a colored dot or bar) at the row level, not per-cell icons
- Reserve icons for empty states, headers, and action buttons
- If status needs to be shown per cell, use background tinting or font color/weight changes

---

## Component Patterns

### Consistency

**What to check:**
- Are similar components used for similar purposes throughout the interface? (e.g., the same badge style for all status indicators)
- Are cards, tables, and panels consistent in border radius, padding, and shadow treatment?
- Is there a clear component hierarchy? (page → sections → cards → inline elements)
- Are interactive elements visually consistent? (all buttons same border-radius, all links same color)

### Reusable Patterns to Look For

These patterns appear frequently in well-designed B2B interfaces:

- **SummaryBar / KPI strip:** Top of a list or detail page, showing 3-5 aggregate numbers with labels. Should use consistent layout (label above, number below, dividers between).
- **Filter bar:** Status filters as pills/buttons with counts, search input, sort control.
- **Status badge:** Small pill with colored text and background for lifecycle/status.
- **Progress indicators:** For multi-step processes (dots, segmented bar, ring).
- **Collapsible sections:** For secondary data (meter details, raw bookings, audit trail).
- **Alert/signal cards:** Colored background tint matching severity, with icon, title, description, and timestamp.

---

## Output Format

When producing a review, structure it as follows:

### Structure

Organize findings by severity:

1. **Structural issues** (information architecture, navigation, concept placement) — These are the most impactful. A beautiful interface with broken IA will confuse users.
2. **State coverage gaps** (missing lifecycle states, empty states, edge cases) — These cause user frustration in production.
3. **Interaction issues** (workflow alignment, progressive disclosure, table design) — These affect efficiency.
4. **Visual issues** (hierarchy, consistency, spacing) — These affect perceived quality.

### For each finding

- **What you found** — Be specific. Quote the component, page, or pattern.
- **Why it matters** — Connect it to a user outcome, not an abstract principle.
- **Suggested fix** — Propose a concrete alternative, not just "make it better."

### Tone

Write for a product team that cares about quality. Be direct without being harsh. Acknowledge what's working well — good design decisions are worth calling out because they tell the team "keep doing this." Focus your criticism on the things that will have the highest impact if fixed.

If the interface is a prototype or early draft, calibrate your expectations. Don't criticize placeholder content. Focus on structural decisions that are hard to change later.

---

## Quick Checklist

Read `references/checklist.md` for a condensed, line-by-line checklist version of all the above. Use it as a rapid scan tool after you've done the deeper analysis, to make sure you haven't missed anything obvious.
