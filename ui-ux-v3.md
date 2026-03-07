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
4. **Run the visual system checks** — See "Minimalist Color Philosophy", "Minimalist Typography Philosophy", "Spacing System Philosophy", "Border Radius Philosophy", "Icon Sizing Philosophy", "Elevation & Shadow Philosophy", "Interactive Element Sizing Philosophy", and "Motion & Transition Philosophy."
5. **Run the visual hierarchy and component checks** — See "Visual Hierarchy", "Visual Anti-Patterns", and "Component Patterns."
6. **Produce a structured report** — Use the output format described at the bottom.

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

## Minimalist Color Philosophy

This is the most critical visual principle. It separates professional, trustworthy tools from cluttered dashboards. The reference standard is Apple (HIG), Attio (B2B CRM), and Notion (workspace) — products that feel calm, confident, and information-dense without ever feeling busy.

**The core rule: Color is information, not decoration.** Every distinct color in the UI must earn its place by encoding a unique, unambiguous meaning. If a color doesn't help the user make a decision faster, remove it.

### Maximum Color Budget

A well-designed B2B data tool should use **at most 8-9 distinct color values** across the entire application:

1. **One brand accent** — for interactive elements (links, focus rings, active tabs, primary buttons, progress bars in healthy state). This is the product's signature. It should be used consistently and exclusively for "interactive" or "selected" states.
2. **One heading color** — a deep, near-black tone (e.g., slate-900 or a branded navy) for headings and primary data.
3. **2-3 neutral grays** — for secondary text, muted labels, borders, and backgrounds. These do the heavy lifting of hierarchy through weight, not hue.
4. **White + one off-white background** — surface and page background.
5. **One signal color: red** — for genuine problems (errors, over-budget, flagged items). Used sparingly.
6. **One caution color: amber** — for warnings, items trending toward problems. Even more sparingly.

That's it. Count the distinct hex values in the codebase. If there are more than 10-12 (including background tints), the palette has drifted.

### Colors That Should NOT Exist

**No green for "good" status.** This is the most counterintuitive but most impactful rule. Apple, Notion, and Attio all follow it. The absence of red *is* the signal that things are fine. When every healthy row is painted green, the green becomes invisible noise — and the page looks like a Christmas tree. Green should only appear in momentary success confirmations (a toast after saving, a brief checkmark animation), never as a persistent state color on rows, badges, or data cells.

**No purple, pink, or additional hues for category differentiation.** Categories (types of service, types of document, departments) should be differentiated through icons and text labels, not color. When you assign a color to each category *and* use colors for status, the two systems collide — the user can't tell if amber means "management category" or "needs review." If absolutely necessary, use very subtle background tints (slate-50 vs. warm-gray-50), not chromatic colors.

**No duplicate blues.** The brand accent color is the only blue in the system. If there are two or three different blues (a teal, a mid-blue, a standard blue) competing for attention, they add visual noise without adding meaning. Consolidate to one.

**No colored backgrounds on status badges.** Status badges should use the text color for the status (red text, amber text) on a uniform neutral background (slate-50 or white). Giving each status its own background tint (green-50 for approved, amber-50 for pending, red-50 for flagged) creates a patchwork quilt effect. Notion's status system works precisely because the badges are typographic, not chromatic.

### The "Anomaly-Only" Principle

**The default visual state of every element should be neutral.** No color, or at most a very subtle gray. Color appears *only* on items that need attention. This means:

- In a table of 20 services, 17 should have no color indicator at all. Only the 3 that are over-budget or flagged should show red or amber.
- A thin 1.5-2px status bar on the left edge of a row/card is sufficient to signal problems. Don't color the entire row, cell, or background.
- Progress bars in their normal state should use the brand accent color, not green. They switch to amber only when ahead of pace, and red only when over-budget.

**Why this works:** When everything is neutral by default, the single red indicator on a page immediately pulls the eye. When half the page is green and the other half is red, neither stands out. The user has to read every row. The anomaly-only approach makes the interface *scannable* — the user can find what needs attention in under 2 seconds.

### Color Collision Prevention

Every color in the system must serve **exactly one semantic purpose**. Before adding a color, check:

- Is this hue already used for something else? (e.g., is red used for both "energy category" and "error status"?)
- Could this information be communicated through icon, typography (weight/size), or position instead of color?
- If I removed this color and made the element gray, would the user lose important information?

If the answer to the last question is "no," the color is decorative and should be removed.

### Practical Audit Checklist

When reviewing color usage in any interface, run this audit:

- [ ] Count distinct hex values in the codebase. Target: ≤12 including background tints.
- [ ] Count distinct chromatic (non-gray) colors. Target: ≤4 (brand accent, red, amber, and at most one more).
- [ ] Check for green used as persistent "good" status. Flag and replace with neutral.
- [ ] Check for category-based color systems that conflict with status colors. Flag and simplify.
- [ ] Check for colored backgrounds on badges/pills. Replace with text-only color on neutral background.
- [ ] Check for multiple blues/teals. Consolidate to one brand accent.
- [ ] Verify that the default (healthy/normal) state of every row, card, and badge is visually neutral.

---

## Minimalist Typography Philosophy

Typography is the single largest contributor to perceived quality in a data-dense B2B tool. The reference standard is the same: Apple (SF Pro / HIG), Attio (CRM), and Notion (workspace). These products feel precise and calm because their type systems are extremely constrained. Every size and weight maps to a clear semantic role — there are no ad-hoc pixel values.

**The core rule: Pick roles, not pixel values.** A developer should never think "this feels like it should be 13px." They should think "this is a body element" or "this is a caption" and the system provides the correct size + weight + color. If the developer is choosing between adjacent pixel values (11 vs 12, 13 vs 14), the type scale is broken.

### Maximum Type Budget

A well-designed B2B data tool should use **at most 4-5 distinct font sizes** and **at most 3 font weights** across the entire application. Combined with color (dark vs muted), this gives you 15-20 distinct typographic "voices" — more than enough for any interface.

**Size scale (4 sizes recommended, 5 maximum):**

1. **Title** (~20px) — Page headings only. One per page. Semibold.
2. **Heading** (~16px) — Card titles, section headers, KPI hero numbers. Semibold.
3. **Body** (~14px) — Table cells, form inputs, descriptions, paragraphs. Regular weight for content, medium weight for emphasis (entity names, links, important values).
4. **Caption** (~12px) — Filter pills, meta information, timestamps, secondary values, column headers. Regular weight for data, medium weight for labels.
5. **Micro** (~11px, optional) — Section labels (UPPERCASE + tracking-wider), service codes. Medium weight. This is the absolute floor. Nothing below 11px.

**Weight scale (3 weights maximum):**

1. **Regular (400)** — All body text, descriptions, secondary values
2. **Medium (500)** — Emphasis within body/caption: entity names, column headers, status badges, section labels
3. **Semibold (600)** — Headings and page titles only

**What gets eliminated:** Bold (700) — absorbed into Semibold. The visual difference between 600 and 700 at heading sizes is negligible, and using both creates a false hierarchy level. Extrabold (800) — never needed in a data UI. Light/Thin (300/100) — too faint for professional data tools viewed on low-contrast monitors.

### Font Families

**Maximum 2 font families:**

1. **Brand sans-serif** — for everything. All text, headings, labels, numbers.
2. **Monospace** — only for machine-readable identifiers (service codes like "GDG108", API keys, technical references). Never for financial amounts, dates, or percentages.

**For numeric alignment in tables**, use `font-variant-numeric: tabular-nums` (Tailwind: `tabular-nums`) on the brand sans-serif font. This gives fixed-width digits without switching the visual texture to monospace. Never use `font-mono` for currency amounts — it creates a "code editor" feeling that undermines trust in a financial tool.

### Sizes That Should NOT Exist

**No 8px or 9px text.** This is below the accessibility floor. A significant percentage of users cannot read text this small, especially on non-retina displays. If you think something needs to be this small, the information probably doesn't belong on screen at all.

**No 13px text.** This is the most dangerous size — it's "almost 14" and creates no perceptible distinction from 14px body text. The user's eye registers it as "body text that looks slightly off." Always promote to 14px (body) or demote to 12px (caption).

**No 10px for content.** At 10px, the text approaches the readability floor and should only be used in extremely constrained spaces (progress bar percentage labels as a last resort). Prefer 11px micro or 12px caption.

**No arbitrary in-between sizes (15px, 17px, 19px).** The scale steps must be large enough that the human eye can clearly distinguish between adjacent levels. Adjacent sizes need at least a 2px gap to read as "different." The recommended scale (11, 12, 14, 16, 20) has jumps of 1, 2, 2, 4 — each step is clearly visible.

### Text Transform Usage

**Uppercase + tracking-wider** should be reserved exclusively for one role: section labels / field labels above content. This is a powerful hierarchical signal — it says "this is a structural label, not content." But it only works when used consistently and sparingly. If uppercase appears on badges, buttons, headers, AND labels, it stops functioning as a signal.

**Count rule:** On any given page, uppercase text should appear on at most one type of element (e.g., column headers OR section labels, not both).

### Monospace Discipline

Monospace font should appear **only** where the text represents a machine identifier or code:

- Service codes (GDG108, SVC-201) ✓
- API keys, technical IDs ✓
- Code snippets ✓

Monospace should **never** appear on:

- Currency amounts (€12,440) ✗ — use `tabular-nums` on the brand font instead
- Percentages (42%) ✗ — use `tabular-nums`
- Dates (2026-03) ✗ — body text
- Row counts, totals ✗ — caption or body text

**Why this matters:** Monospace has a "technical / code editor" connotation. In a financial tool where users are reviewing invoices, leases, and budgets, monospace on amounts creates subliminal distrust — it looks like debug output, not a polished financial report.

### Practical Typography Audit Checklist

When reviewing typography in any interface, run this audit:

- [ ] Count distinct font sizes across all components. Target: ≤5 (ideally 4).
- [ ] Count distinct font weights. Target: ≤3 (regular, medium, semibold).
- [ ] Check for text below 11px. Flag and promote.
- [ ] Check for 13px text. Flag and reassign to 12px or 14px.
- [ ] Check for font-bold (700) or font-extrabold (800). Flag and downgrade to semibold (600).
- [ ] Check for `font-mono` on currency amounts, percentages, or dates. Replace with `tabular-nums`.
- [ ] Verify that each size + weight combination maps to exactly one semantic role.
- [ ] Check that arbitrary pixel values (`text-[Xpx]`) and Tailwind named classes (`text-sm`) don't duplicate sizes.
- [ ] Count uppercase elements. Should be used for exactly one element type per page.
- [ ] Verify no more than 2 font families (brand sans + monospace for codes only).

---

## Spacing System Philosophy

Spacing is the invisible backbone of visual quality. Users can't articulate why an interface feels "polished" or "sloppy," but inconsistent spacing is almost always the answer. Apple, Attio, and Notion all use a strict spatial grid — every margin, padding, and gap snaps to a predictable rhythm. This creates a visual cadence that the eye perceives as order.

**The core rule: Every spacing value must be a multiple of 4px.** This is the "4px grid" used by virtually every top-tier design system (Apple HIG, Material Design, GitHub Primer, Linear). It means the only valid spacing values are: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. No half-steps (6px, 10px, 14px). No arbitrary values.

### Maximum Spacing Budget

A well-designed B2B data tool should use **at most 7-8 distinct spacing values** across the entire application, drawn from the 4px grid:

| Token | Value | Tailwind | Use cases |
|-------|-------|----------|-----------|
| **xs** | 4px | `gap-1`, `p-1` | Inline element gaps (icon + label), tight badge padding |
| **sm** | 8px | `gap-2`, `p-2`, `px-2` | Compact list item padding, small card internal gaps |
| **md** | 12px | `gap-3`, `p-3`, `px-3` | Standard table cell padding, card internal gaps |
| **base** | 16px | `gap-4`, `p-4`, `px-4` | Card padding, section gaps, primary container padding |
| **lg** | 24px | `gap-6`, `p-6`, `px-6` | Section separation, card-to-card gaps |
| **xl** | 32px | `gap-8`, `py-8` | Major section breaks, empty state vertical padding |
| **2xl** | 48px | `py-12` | Page-level vertical margins (rarely needed) |

### Values That Should NOT Exist

**No half-step values (gap-1.5, gap-2.5, py-0.5, px-1.5).** These break the 4px grid and create subpixel rendering differences across screens. The 0.5 in Tailwind maps to 2px — which is below the minimum useful spacing for most elements. If 4px feels too tight and 8px feels too loose, the problem is usually in the element sizing, not the spacing.

**No 10px, 14px, or 18px.** These fall between grid lines and create the same "slightly off" feeling as 13px text. Round to the nearest 4px multiple: 10→8 or 12, 14→12 or 16, 18→16 or 20.

**No mixing of px-3 and px-4 for the same element type.** If table cells use `px-3` (12px), ALL table cells must use `px-3`. If cards use `px-4` (16px), ALL cards must use `px-4`. The inconsistency between adjacent elements of the same type is more damaging than choosing the "wrong" value consistently.

### Spacing Hierarchy Rule

Spacing should increase as you move outward from content to container:

1. **Inline** (within a component): xs–sm (4–8px)
2. **Intra-component** (padding inside a card/row): sm–md (8–12px)
3. **Inter-component** (gap between cards/sections): base–lg (16–24px)
4. **Page-level** (major section breaks): lg–xl (24–32px)

**Never use a larger spacing value inside a component than between components.** If card internal padding is 24px but the gap between cards is 16px, the visual grouping breaks — elements inside the card feel further apart than cards from each other.

### Practical Spacing Audit Checklist

- [ ] Count distinct gap values. Target: ≤7, all multiples of 4px.
- [ ] Count distinct padding values. Target: ≤6 distinct px-* and py-* values, all multiples of 4px.
- [ ] Check for half-step values (gap-1.5, gap-2.5, py-0.5, px-1.5). Flag and round to nearest 4px multiple.
- [ ] Verify same element types use identical spacing (all table cells same padding, all cards same padding).
- [ ] Check spacing hierarchy: inline < intra-component < inter-component < page-level.
- [ ] Verify no arbitrary Tailwind values (`p-[7px]`, `gap-[11px]`).

---

## Border Radius Philosophy

Border radius is one of the strongest subconscious signals of visual consistency. When different elements use different radii, the interface feels assembled from parts rather than designed as a whole. Apple uses one radius system-wide. Notion uses one radius plus `rounded-full` for pills. Attio is similar: one radius for containers, full-round for avatars and pills.

**The core rule: Use at most 2 radius values across the entire application.** One "container radius" for cards, modals, dropdowns, and inputs. One "pill radius" (`rounded-full`) for badges, avatars, filter pills, and toggle buttons. Nothing else.

### Maximum Radius Budget

| Token | Value | Tailwind | Use cases |
|-------|-------|----------|-----------|
| **container** | 8px | `rounded-lg` | Cards, modals, dropdowns, inputs, buttons, table containers, tooltips |
| **pill** | 9999px | `rounded-full` | Badges, avatars, filter pills, year pills, status indicators, toggle buttons |
| **none** | 0px | `rounded-none` | Table rows (inside a rounded container), dividers, full-bleed sections |

That's it. Three values, two of which are the real design tokens.

### Radii That Should NOT Exist

**No `rounded-sm` (4px) or `rounded-md` (6px) as separate tokens.** The visual difference between 4px, 6px, and 8px radius is imperceptible at small sizes and creates "nearly the same but not quite" inconsistency. Pick one and use it everywhere. We recommend `rounded-lg` (8px) because it matches the modern, slightly softer aesthetic of Attio/Notion/Linear. Apple's macOS uses ~10px for windows and ~6px for controls — but the key insight is they committed to one value per context.

**No mixing rounded-md for buttons and rounded-lg for cards.** If the card has 8px corners and the button inside has 6px corners, the relationship feels arbitrary. When everything shares the same radius, the interface reads as a unified system.

### Practical Radius Audit Checklist

- [ ] Count distinct border-radius values. Target: 2 (container + pill) + optional `rounded-none`.
- [ ] Check for `rounded-sm` or `rounded-md`. Flag and consolidate to the container radius.
- [ ] Verify buttons and inputs use the same radius as their parent cards.
- [ ] Verify all badges/pills/avatars use `rounded-full`.

---

## Icon Sizing Philosophy

Icons are the punctuation of a UI — they guide the eye and reinforce meaning. But when icon sizes vary by 1-2px across the interface, they create the same "drift" problem as typography. Apple uses exactly 3 icon sizes in their system apps. Notion uses 2. Attio uses 2-3.

**The core rule: Use at most 3 icon sizes, each mapped to a semantic role.** An icon should never be sized ad-hoc to "fit" a particular layout. The layout should accommodate the standard icon sizes.

### Maximum Icon Size Budget

| Token | Size | Use cases |
|-------|------|-----------|
| **sm** | 14px | Inline with caption/micro text: meta labels, breadcrumbs, badge icons, secondary indicators |
| **md** | 16px | Inline with body text: table row icons, nav items, button icons, form field icons |
| **lg** | 20px | Standalone or heading-level: page header actions, empty state icons, KPI card icons |

Three sizes. Every icon in the application is one of these three. No 9px, 10px, 11px, 12px, 13px, 18px — these intermediate sizes create visual noise without adding hierarchy.

### Sizes That Should NOT Exist

**No icons below 14px.** At 12px or smaller, icons lose detail and become unrecognizable blobs, especially on non-retina screens. If the icon needs to be this small, the space is too tight for an icon — use text or remove it.

**No 1-2px differences between icons in the same context.** If one table row uses `size={13}` and another uses `size={14}`, the inconsistency is visible but not meaningful. Standardize to the role-based size.

**No icons larger than 20px in data-dense views.** Icons at 24px+ dominate the visual hierarchy and compete with actual content. Reserve large icons (24-48px) exclusively for empty states, onboarding, and illustration contexts — never in tables, cards, or list items.

### Icon Style Consistency

Beyond size, icon *style* must be uniform:

- **One icon library.** Don't mix Lucide, Heroicons, and Phosphor. Each library has a different stroke width, corner radius, and visual weight.
- **One stroke width.** If using Lucide (1.5px default), never mix with 2px-stroke icons.
- **Consistent optical alignment.** Icons should vertically center with their adjacent text. Use `items-center` consistently.

### Practical Icon Audit Checklist

- [ ] Count distinct icon sizes (the `size={}` prop). Target: ≤3.
- [ ] Check for icons below 14px. Flag and promote to 14px (sm).
- [ ] Check for icons in the 15-19px range. Flag and consolidate to 16px (md) or 20px (lg).
- [ ] Verify one icon library used across the entire app.
- [ ] Check that icons are vertically aligned with adjacent text.

---

## Elevation & Shadow Philosophy

Shadow and elevation signal depth — what's "above" what. Apple uses shadows only for floating elements (menus, modals, popovers). Notion uses essentially zero shadows in its default view — cards are defined by borders, not shadows. Attio uses one subtle shadow for hover states and floating panels.

**The core rule: Use at most 2 shadow levels across the entire application.** The page is flat by default. Only elements that float above the page (dropdowns, modals, tooltips, popovers) get shadow. Cards, tables, and containers live at the base level and use borders for definition, not shadows.

### Maximum Shadow Budget

| Token | Tailwind | Use cases |
|-------|----------|-----------|
| **none** | (default) | Cards, tables, containers, sections — everything at the base level |
| **subtle** | `shadow-sm` | Hover states on interactive cards, sticky headers, floating action buttons |
| **elevated** | `shadow-md` | Dropdowns, modals, tooltips, popovers — elements that float above the page |

Two shadow values plus the default (no shadow). That's it.

### Shadows That Should NOT Exist

**No `shadow-lg` or `shadow-xl` in the base interface.** These heavy shadows belong in marketing pages, hero sections, and image galleries — not in data-dense B2B tools. They make elements look like they're physically hovering above the page, which contradicts the flat, information-first aesthetic.

**No `shadow-sm` on static cards.** If a card is always visible and doesn't float or move, it should be defined by its border (`border border-slate-200`), not by shadow. Shadow implies interactivity or elevation — using it on every card cheapens the signal.

**No mixing shadow levels for the same element type.** If dropdown menus use `shadow-md`, all dropdowns use `shadow-md`. If some modals use `shadow-lg` and others use `shadow-md`, the depth system is broken.

### The Border-First Principle

Attio and Notion both follow this rule: **borders define containers, shadows define floaters.** A card has a 1px border. A dropdown has a shadow (and may also have a border). A table has a border around it. A modal has a shadow. This distinction makes the depth hierarchy instinctive.

### Practical Shadow Audit Checklist

- [ ] Count distinct shadow values. Target: ≤2 (`shadow-sm` + `shadow-md`) plus default (none).
- [ ] Check for `shadow-lg` or `shadow-xl`. Flag and downgrade to `shadow-md` or remove.
- [ ] Check for `shadow-sm` on static (non-interactive) cards. Replace with border.
- [ ] Verify floating elements (dropdowns, modals, tooltips) all share the same shadow level.
- [ ] Verify base-level elements (cards, tables, sections) use border, not shadow.

---

## Interactive Element Sizing Philosophy

Control sizing — the height and padding of buttons, inputs, filter pills, and select elements — is where "the UI doesn't quite feel right" problems often hide. When a filter pill is 28px tall, an input is 32px, and a button is 40px, nothing lines up. Apple HIG defines exactly 3 control sizes. Linear uses 2. Attio uses 2.

**The core rule: Use at most 3 control heights, each mapped to a context.** Every interactive element snaps to one of these heights. No in-between values.

### Maximum Control Height Budget

| Token | Height | Tailwind | Use cases |
|-------|--------|----------|-----------|
| **compact** | 28px | `h-7` | Filter pills, year pills, tab buttons, badge-like controls, inline actions |
| **standard** | 32px | `h-8` | Text inputs, select dropdowns, search fields, secondary buttons |
| **prominent** | 40px | `h-10` | Primary action buttons, main CTAs, modal action buttons |

Three heights. Every clickable/tappable element in the application is one of these three.

### Heights That Should NOT Exist

**No h-9 (36px).** This falls between standard and prominent and creates "almost but not quite" misalignment. If an element feels too small at 32px and too large at 40px, the issue is usually padding or font size, not height.

**No h-6 (24px) for interactive elements.** At 24px, the touch/click target is too small for comfortable interaction (Apple recommends 44px minimum touch target on mobile, 28px minimum on desktop). Use h-7 (28px) as the floor.

**No h-12 (48px) in data-dense views.** 48px buttons dominate the visual hierarchy and waste vertical space. Reserve for landing pages and onboarding, not for tool UIs.

### Alignment Rule

**All controls on the same row must share the same height.** A search input (`h-8`) next to filter pills (`h-7`) next to a button (`h-10`) creates a jagged baseline that looks sloppy. When controls share a row, they all use the same height token — typically `compact` for filter bars and `standard` for form rows.

### Practical Control Sizing Audit Checklist

- [ ] Count distinct control heights (h-* classes on interactive elements). Target: ≤3.
- [ ] Check for h-9 or h-11. Flag and consolidate to nearest standard height.
- [ ] Check for interactive elements below h-7 (28px). Flag as too small for comfortable interaction.
- [ ] Verify all controls on the same row share the same height.
- [ ] Verify buttons, inputs, and selects in the same form share the same height.

---

## Motion & Transition Philosophy

Animation is the final layer of polish. Apple's animations feel "inevitable" — they're so smooth and purposeful that you don't notice them. Notion barely animates at all, and when it does, it's instant and subtle. Attio uses very restrained hover transitions. The common thread: animation should be invisible. The moment a user notices a transition, it's too slow or too flashy.

**The core rule: Animate only opacity and transform. Animate only on user-initiated interactions. Keep durations under 200ms.**

### Transition Budget

| Property | Tailwind | When to use |
|----------|----------|-------------|
| **Colors** | `transition-colors` | Hover/focus state changes: button backgrounds, link colors, border highlights |
| **Opacity** | `transition-opacity` | Fade in/out: tooltips appearing, elements entering/leaving, skeleton loading |
| **Transform** | `transition-transform` | Micro-interactions: chevron rotation on expand, scale on press, slide-in panels |

Three transition properties. Never `transition-all` — it's a performance anti-pattern that animates layout properties (width, height, padding, margin), causing jank and repaints. It also animates properties you didn't intend to animate, creating unexpected visual noise.

### Duration Scale

| Token | Duration | Use cases |
|-------|----------|-----------|
| **instant** | 100ms | Color changes, opacity toggles, focus rings |
| **fast** | 150ms | Hover states, expand/collapse, tooltip show/hide |
| **smooth** | 200ms | Panel slides, modal entrance, page transitions |

**Nothing above 200ms in a data tool.** Users of B2B tools are performing repetitive, efficiency-focused tasks. A 300ms animation that plays every time they hover a table row costs cumulative seconds per session. Notion's hover transitions are ~100ms. Attio's are ~120ms.

### Animations That Should NOT Exist

**No `transition-all`.** This is the most common animation anti-pattern. It animates every CSS property that changes, including layout-triggering ones (width, height, padding). This causes browser repaints on every frame, degrading scroll performance. Always specify exactly which property to animate.

**No bounce, spring, or elastic easing in data tools.** These belong in consumer apps and games. In a financial tool, a bouncing button undermines credibility. Use `ease-out` (Tailwind default) for all transitions.

**No loading spinners longer than 2 seconds without feedback.** If an operation takes more than 2s, show a skeleton screen or progress bar — not an infinite spinner. Spinners beyond 2s create anxiety.

**No animation on initial page load.** Elements should appear immediately, already in their final state. "Fade-in on scroll" and "stagger animation" patterns are for marketing sites, not tools.

### Practical Motion Audit Checklist

- [ ] Count `transition-all` occurrences. Target: 0. Replace each with specific property.
- [ ] Verify all transition durations are ≤200ms (Tailwind `duration-100`, `duration-150`, `duration-200`).
- [ ] Check for bounce/spring/elastic easing. Flag and replace with ease-out.
- [ ] Verify animations only trigger on user interaction (hover, click, focus), never on load.
- [ ] Check for layout-animating transitions (width, height, padding). Flag and remove or replace with transform.

---

## Visual Hierarchy

### Information Density

B2B tools serve professional users who work in the interface daily. They want density, not decoration. But density without hierarchy is chaos.

**What to check:**
- Are the most important numbers/metrics visually prominent? (larger font, bold weight, prominent position)
- Is there clear visual grouping? Related items should be visually proximate.
- Is there consistent use of type scale? Run the Minimalist Typography Philosophy audit above. (At most 4-5 distinct sizes across the app)
- Are secondary/supporting labels clearly de-emphasized? (smaller, lighter, uppercase tracking)
- Is the color palette functional? Run the Minimalist Color Philosophy audit above.

### Status Communication

Users should understand the health/status of things at a glance — but "at a glance" means the *anomalies* should pop, not every item.

**What to check:**
- Does the interface follow the anomaly-only principle? (Healthy items are neutral, only problems get color)
- Are status indicators consistent in form across the entire application? (Pick one: thin side bar, text color, or small dot — and use it everywhere)
- Can the user scan a list of 20+ items and identify the 2-3 needing attention in under 2 seconds?
- Is there exactly one color system for status (not overlapping with categories, types, or utilities)?

### Whitespace and Breathing Room

**What to check:**
- Is there sufficient padding inside cards and containers?
- Are sections visually separated (spacing, dividers, background color changes)?
- Does the page feel calm and structured, or busy and overwhelming?
- Is the page width constrained (max-width ~1100-1300px for content) to prevent lines from becoming too long to scan?

---

## Visual Anti-Patterns

Certain visual patterns that seem logical in isolation create a cartoonish or unprofessional impression in a B2B SaaS context. Flag these immediately.

### Colored Dot Grids

**Never use rows of small colored dots (green/amber/red) to represent per-period or per-item status.** This pattern — common when showing monthly closing status, pipeline stages, or multi-step completeness — looks like a game or a children's activity tracker.

**What to do instead:**
- Use a single **progress bar** (thin, 3-6px) showing percentage of budget/target used, with a pace marker tick
- For overall status, use **count-based summaries** ("5 on track, 2 over budget") rather than per-item dot grids
- For monthly/period tracking, use **collapsible text detail** per period, not visual dot arrays

### The Traffic-Light Trap

**Don't color-code every row or element with green/amber/red.** This is the most common and most harmful pattern in B2B dashboards. When the page looks like a traffic-light grid, it feels like a toy. Notion's entire billion-dollar product has essentially zero traffic-light coloring in its core interface.

**The fix:** Default state is neutral. Color only the exceptions. If 80% of rows would be green, that green is noise — remove it and only color the 20% that are amber/red.

### Decorative Icons in Data Cells

**Don't put status icons (checkmarks, clocks, warning triangles) inside dense data grids.** A table with an icon in every cell looks cluttered. Icons are for headers, empty states, and action buttons — not for encoding per-cell status in a data table.

### Color-per-Category Systems

**Don't assign a distinct chromatic color to each category/type.** This is a common temptation: energy = red, installations = purple, cleaning = green, management = amber. It creates a rainbow effect and collides with status colors. Use icons and text labels for categories instead.

### The 1px Font Size Drift

**Don't use adjacent pixel values for different elements (11px vs 12px, 13px vs 14px).** The human eye cannot reliably distinguish a 1px difference at reading distance. This creates "it looks slightly off" unease without real hierarchy. The minimum distinguishable step between type sizes is 2px. If two elements look like they *should* be the same size but aren't, they should be consolidated to the same role in the type scale.

### Monospace for Financial Data

**Don't use `font-mono` for currency amounts, percentages, or dates.** Monospace has a "code editor" / "debug output" connotation. In a financial tool, currency displayed in monospace looks like a terminal printout, not a professional report. Use the brand sans-serif with `tabular-nums` for digit alignment instead.

### Weight Stacking

**Don't use more than 3 font weights on a single page.** When regular, medium, semibold, bold, and extrabold all appear in the same view, the hierarchy collapses — every weight competes and none wins. The fix: regular for body, medium for emphasis, semibold for headings. That's it.

### Half-Step Spacing

**Don't use Tailwind half-step values (gap-1.5, gap-2.5, py-0.5, px-1.5).** These map to 6px, 10px, 2px, and 6px — all off the 4px grid. They create subpixel rendering artifacts on non-retina screens and break the spatial rhythm that makes an interface feel "tight." Round to the nearest 4px multiple.

### Radius Soup

**Don't use 3+ border-radius values (rounded-sm, rounded-md, rounded-lg) as if they're meaningfully different.** At button and card sizes, the difference between 4px, 6px, and 8px radius is invisible. Yet mixing them creates a subtle "assembled from parts" feeling. Pick one container radius and commit. Apple's entire macOS uses essentially one radius per context.

### Heavy Shadows on Static Elements

**Don't put `shadow-lg` or `shadow-xl` on cards, panels, or containers that don't float.** Heavy shadows make elements look like they're physically hovering, which contradicts the flat, information-dense aesthetic. Use borders for static containers, shadow-sm for hover states, and shadow-md for floating elements (dropdowns, modals). That's the complete depth system.

### Jagged Control Heights

**Don't mix 3+ different heights on controls in the same row.** A search input at h-8, filter pills at h-7, and a button at h-10 creates a ragged baseline that looks unpolished. All controls sharing a horizontal row must share the same height token.

### transition-all Everywhere

**Don't use `transition-all` as a default.** It animates layout properties (width, height, padding) on every change, causing browser repaints and unexpected visual noise. Always specify the exact property: `transition-colors` for hover states, `transition-opacity` for fade effects, `transition-transform` for scale/rotation. This is both a performance and a design discipline issue.

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
