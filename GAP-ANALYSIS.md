# Gap Analysis: v3 Prototype vs Live Energy Module

**Date**: 2026-03-06
**Source**: Live product at `admin.homii.app/buildings/70257` (De Lindeborg, Gorinchem)
**Target**: v3-new prototype at `homii-v3-new.vercel.app`

---

## 1. Global Navigation & Pages

### Live product sidebar
| Page | Live | v3 | Gap |
|---|---|---|---|
| Dashboard | ✅ KPI cards (week view, huurder stats) | ❌ | Missing entirely |
| Inbox | ✅ Badge count (31) | ❌ | Missing entirely |
| Gebouwen (list) | ✅ | ✅ "Complexes" | Partial (see §2) |
| Meters (global) | ✅ Cross-building meter list | ❌ | Missing entirely |
| Onboarding | ✅ Building onboarding workflow | ❌ | Missing entirely |
| Taken (global) | ✅ Task management with filters | ❌ | Missing entirely |
| Tarieven | ✅ Tariff management per utility | ❌ | Missing entirely |
| Grootboek | ✅ Settlement overview per complex | ❌ | Missing entirely |

### v3-only sidebar items (not in live)
| Item | Purpose | Assessment |
|---|---|---|
| Services list page | Browse all services | ✅ New concept, intentional |
| Views section | Saved filtered views | ✅ New concept, intentional |

**Verdict**: The v3 prototype focuses on the CRM-shell (Objects + Views), which is intentional. But it's useful to know the live product has 8 top-level pages vs our 2 functional ones.

---

## 2. Buildings List Page

### Columns in live product
| Column | Live | v3 | Notes |
|---|---|---|---|
| Complex (name) | ✅ | ✅ | — |
| Stad (city) | ✅ | ✅ as "City" | — |
| Afrekening (settlement provider) | ✅ ista/Techem | ❌ | **GAP**: Which metering company handles settlement |
| VHE (count) | ✅ | ✅ as "Units" | — |
| Huurder app gebruikers | ✅ | ❌ | **GAP**: Tenant app user count |
| Meldingen (alerts) | ✅ "Bewoners app" status | ❌ | **GAP**: Notification/alert indicators per building |
| Datakwaliteit | ✅ Green checkmark | ❌ | **GAP**: Data quality status indicator |

### Features in live product
| Feature | Live | v3 | Notes |
|---|---|---|---|
| "+ Gebouw" button | ✅ | ❌ | **GAP**: Add building action |
| Column selector | ✅ "Kolommen selecteren" | ❌ | **GAP**: Dynamic column visibility |
| Export button | ✅ "Exporteren" | ❌ | **GAP**: Export to file |
| Search | ✅ "Zoeken op ID en gebouw" | ✅ | — |

---

## 3. Building Detail Page — Overview Tab

### Sections in live product

#### 3a. Energie & tarieven (Energy & Tariffs)
| Data point | Live | v3 | Notes |
|---|---|---|---|
| Utility type (Gas) | ✅ with icon | Partial | v3 has utility icons but no tariff card |
| Tariff per unit | ✅ "€1.29 per m³ incl BTW" | ❌ | **GAP**: Tariff rate display |
| Verbruik tot nu (consumption YTD) | ✅ 35,129.64 m³ | Partial | v3 has consumption summary card |
| Verbr. verwacht 31-12 (forecast) | ✅ 96,951.52 m³ | ❌ | **GAP**: Year-end consumption forecast |
| Kosten tot nu (costs YTD) | ✅ €45,317 | ❌ | **GAP**: Cost tracking YTD |
| Kosten verwacht 31-12 (cost forecast) | ✅ €125,067 | ❌ | **GAP**: Year-end cost forecast |
| EAN code | ✅ 871689250000045847 | ✅ | In meter cards |
| Laatste meting (last reading date) | ✅ 01/03/2026 | ✅ | In meter cards |
| Unit (joule) | ✅ | ❌ | **GAP**: Energy unit type |

#### 3b. Te verdelen componenten (Cost components to distribute)
| Data point | Live | v3 | Notes |
|---|---|---|---|
| "Kosten verdeel logica" button | ✅ Opens formula modal | ❌ | **GAP**: Distribution logic editor |
| AI-uitleg (experimental) | ✅ "Genereer AI-uitleg" | ❌ | **GAP**: AI-powered formula explanation |
| **Variabele kosten** | | | |
| Verwarming costs (YTD + forecast) | ✅ €41,570 / €84,699 | ❌ | **GAP** |
| Warm Water costs | ✅ €873 / €881 | ❌ | **GAP** |
| **Gedeelde kosten** | | | |
| Contractkosten | ✅ €1,853 / €10,910 | ❌ | **GAP** |
| Leidingafgifte | ✅ €7,895 / €45,304 | ❌ | **GAP** |

#### 3c. Vaste kosten (Fixed costs)
| Data point | Live | v3 | Notes |
|---|---|---|---|
| Warning: estimated from previous year | ✅ Red warning | ❌ | **GAP**: Year-carry warning |
| Editable fixed cost items | ✅ With pencil icon | ❌ | **GAP**: Inline editing |
| "Alles bevestigen" (confirm all) | ✅ | ❌ | **GAP**: Batch confirmation |
| Diensten ista Nederland - Verwarming | ✅ €9672,84 | ❌ | **GAP** |
| Overige kosten in Energiekosten | ✅ €6090 | ❌ | **GAP** |

#### 3d. Contractinformatie
| Data point | Live | v3 | Notes |
|---|---|---|---|
| Data connector info | ✅ "DEOnline Connector · laatste update: 26 feb 2026" | ❌ | **GAP**: Data source provenance |
| **Deelnemers** | | | |
| Totaal (total participants) | ✅ 211 | ❌ | **GAP** |
| Actief (active) | ✅ 142 | ❌ | **GAP** |
| Vertrokken huurders (departed) | ✅ 2 | ❌ | **GAP** |
| Nieuwe huurders (new) | ✅ 1 | ❌ | **GAP** |
| **Budgetten** | | | |
| Binnen budget | ✅ 132 | ❌ | **GAP**: Budget tracking per VHE |
| Buiten budget | ✅ 14 | ❌ | **GAP** |
| **Hoogste uitschieters** (top outliers) | ✅ List with € amounts | ❌ | **GAP**: Outlier detection |

#### 3e. Info banners
| Data point | Live | v3 | Notes |
|---|---|---|---|
| Renovation planned warning | ✅ Blue banner | ❌ | **GAP**: Contextual warnings |
| Fixed costs fallback warning | ✅ Blue banner | ❌ | **GAP** |

### v3 Overview sections NOT in live product
| Section | v3 | Assessment |
|---|---|---|
| Meter Health card | ✅ Per-utility reading status | ✅ New/better — keep |
| Consumption Summary card | ✅ Aggregated per utility | ✅ New/better — keep |
| Settlement status section | ✅ With lifecycle steps | ✅ New concept — keep (not in live yet) |
| Services summary | ✅ Category-grouped list | ✅ Intentional CRM feature |

---

## 4. Building Detail — Right Sidebar (Attributes)

| Attribute | Live | v3 | Notes |
|---|---|---|---|
| Adres | ✅ | ✅ | — |
| Plaats | ✅ | ✅ as city | — |
| Complex | ✅ SCL01-130 | ❌ | **GAP**: Complex code reference |
| Objectnummer | ✅ 70257 | ❌ | **GAP**: Object number |
| Gemiddeld voorschot | ✅ €107 | ❌ | **GAP**: Average advance payment |
| Voorschotcodes | ✅ 201 | ❌ | **GAP**: Advance payment codes |
| Gas | ✅ Kleinverbruik | ❌ | **GAP**: Gas connection type |
| Huurder app ingeschakeld | ✅ Ja | ❌ | **GAP**: Tenant app enabled |
| Huurder app gebruikers | ✅ 0 | ❌ | **GAP**: Tenant app users |

---

## 5. Building Detail — VHE Tab

### Columns
| Column | Live | v3 | Notes |
|---|---|---|---|
| Straat (address) | ✅ "Haarstraat 101" | ❌ (removed) | We removed address, live has it as primary identifier |
| App | ✅ Checkbox | ❌ | **GAP**: App enrollment status |
| Contract | ✅ Actief/Leegstand | ✅ as "status" | Similar concept |
| Start periode | ✅ Date | ❌ | **GAP**: Billing period start |
| Status | ✅ Green checkmark | ✅ | — |
| Totaal verwachte kosten | ✅ | ❌ | **GAP**: Expected total costs per VHE |
| Totale voorschot | ✅ | ✅ as "voorschot" | — |
| Maandelijks voorschot | ✅ | ❌ | **GAP**: Monthly advance amount |
| Advies voorschot | ✅ | ❌ | **GAP**: Recommended advance |
| Verschil voorschot | ✅ Color-coded +/- | ❌ | **GAP**: Advance difference (over/under) |
| "Bekijk in App" link | ✅ | ❌ | **GAP**: Deep link to tenant app |

### v3 VHE columns NOT in live
| Column | v3 | Assessment |
|---|---|---|
| Type (apartment/studio) | ✅ | ✅ Keep — useful for distribution |
| Persons | ✅ | ✅ Keep — distribution key |
| Floor | ✅ | Neutral — nice to have |
| m² | ✅ | ✅ Keep — distribution key |
| Contract holder name | ✅ | Missing from live list view too |

### VHE Detail page (clicking a VHE)
| Feature | Live | v3 | Notes |
|---|---|---|---|
| Dedicated VHE page | ✅ Full page with sections | ❌ | **MAJOR GAP**: No VHE detail page |
| Verbruiksgegevens (consumption data) | ✅ Start/end period, costs | ❌ | **GAP** |
| Kosten breakdown | ✅ | ❌ | **GAP** |
| Contractgegevens sidebar | ✅ Address, contract nr, VHE ID | ❌ | **GAP** |
| "Bekijk in App" button | ✅ | ❌ | **GAP** |
| Exporteren button | ✅ | ❌ | **GAP** |
| Verbruik (experimenteel) section | ✅ | ❌ | **GAP** |

---

## 6. Building Detail — Meters Tab

| Feature | Live | v3 | Notes |
|---|---|---|---|
| **Layout** | Flat list (all 778 meters) | Main/Sub hierarchy | Different approach — both valid |
| Adres column | ✅ | ✅ as VHE reference | — |
| Serienummer | ✅ | ✅ as "meterNumber" | — |
| Leverancier ID | ✅ Long hash | ❌ | **GAP**: Supplier/provider meter ID |
| Meter type | ✅ WMZ etc. | ✅ as "utility" | Different naming |
| Provider | ✅ ista/Techem | ❌ | **GAP**: Meter provider |
| Laatste datum | ✅ | ✅ as "readingDate" | — |
| Demontage datum | ✅ | ❌ | **GAP**: Decommission date |
| Status | ✅ Green check | ✅ | — |
| Consumption (reading values) | ❌ Not in list view | ✅ | v3 is richer here |
| EAN code | ❌ Not in list view | ✅ on main meters | v3 is richer here |
| Column selector | ✅ | ❌ | **GAP** |

---

## 7. Building Detail — Berichten & Activiteit Tab

| Feature | Live | v3 | Notes |
|---|---|---|---|
| Threaded messages | ✅ Per-user with dates | ✅ as Activity tab | v3 has simpler activity log |
| Rich text editor | ✅ Full toolbar (B/U/I/H2/H3/code/lists) | ❌ | **GAP**: No message composition |
| "Staff only" visibility label | ✅ | ❌ | **GAP**: Internal-only notes |
| Status change entries | ✅ "Voltooid", "homii bezig met onboarden" | ✅ | Similar |
| Attachment support | ✅ Paperclip icon | ❌ | **GAP** |
| Send button | ✅ "Versturen" | ❌ | **GAP** |

---

## 8. Building Detail — Taken (Tasks) Tab

| Feature | Live | v3 | Notes |
|---|---|---|---|
| Task list per building | ✅ | ❌ | **MAJOR GAP**: No Tasks tab at all |
| Columns: Taak, Meldingen, Object, Toegewezen aan, etc. | ✅ | ❌ | **GAP** |
| Task status (In behandeling, Afgerond, Openstaand) | ✅ | ❌ | **GAP** |
| "Klantcontrole vereist" alert labels | ✅ | ❌ | **GAP** |
| Filters (meldingen, persoon, gebouwstatus) | ✅ | ❌ | **GAP** |
| "Nieuwe taak" button | ✅ | ❌ | **GAP** |

---

## 9. Cross-Cutting Features

| Feature | Live | v3 | Notes |
|---|---|---|---|
| Year picker | ✅ Top-right | ✅ Top-right | ✅ Matching |
| Column selector on tables | ✅ Everywhere | ❌ | **GAP**: Configurable columns |
| Export button on tables | ✅ Everywhere | ❌ | **GAP**: Data export |
| Search on tables | ✅ Everywhere | ✅ On building list | Partial |
| Breadcrumb navigation | ✅ "← Gebouwen" | ✅ | — |
| Edit building name (pencil) | ✅ | ❌ | **GAP**: Inline editing |

---

## 10. Priority Ranking of Gaps

### P0 — Critical (core use cases missing from Overview)
1. **Energie & tarieven card** — Tariff rate, consumption YTD, forecast, costs YTD/forecast
2. **Te verdelen componenten** — Variable vs shared cost breakdown with YTD + forecast
3. **Contractinformatie / Deelnemers** — Participant counts (total, active, departed, new)
4. **Budgetten section** — Within/outside budget counts
5. **Hoogste uitschieters** — Top outlier VHEs by budget overrun

### P1 — Important (missing tabs/pages)
6. **VHE financial columns** — Expected costs, monthly/advised/difference voorschot
7. **VHE detail page** — Clicking a VHE should open a consumption/cost detail page
8. **Building sidebar attributes** — Complex code, objectnummer, gemiddeld voorschot, voorschotcodes, gas type, huurder app status
9. **Vaste kosten section** — Fixed costs with inline editing and confirmation flow

### P2 — Nice to have
10. **Column selector** on all tables
11. **Export button** on all tables
12. **Kosten verdeel logica modal** — Distribution formula viewer
13. **Berichten rich text editor** — Message composition with formatting
14. **Staff-only notes** visibility control
15. **Meter provider column** — ista/Techem in meter list
16. **Afrekening provider column** — In building list
17. **Data quality indicator** — Green checkmark column
18. **AI formula explanation** — Experimental feature

### Intentionally different in v3 (keep as-is)
- **Meter hierarchy** (main/sub grouping) — v3 approach is better for understanding
- **Services tab** — New concept not in live product
- **Views system** — New concept not in live product
- **Settlement lifecycle** — New concept not in live product
- **Meter Health / Consumption Summary** cards — More actionable than live
- **VHE type + persons columns** — Useful for distribution, not in live

---

## 11. Recommended Next Steps

1. **Enrich Overview tab** with the Energie & tarieven card (consumption + cost data)
2. **Add Te verdelen componenten section** (variable/shared/fixed cost breakdown)
3. **Add Contractinformatie section** (participant stats + budget status + outliers)
4. **Enrich building sidebar attributes** (complex code, objectnummer, voorschot stats)
5. **Add financial columns to VHE tab** (expected costs, voorschot comparison)
6. **Build VHE detail page** (when clicking a VHE row)
7. **Add column selector + export buttons** to all table views
