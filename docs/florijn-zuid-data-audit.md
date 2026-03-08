# Florijn Zuid — Production vs Prototype Data Audit

**Building**: Florijn Zuid (8320)
**Production ID**: 033002322 (objectnummer)
**Ledger**: 2I04202
**Date**: 2026-03-08

---

## Data Successfully Mapped to Prototype

### buildings.json
| Field | Old (fabricated) | New (production) |
|-------|-----------------|------------------|
| complex | Rode Kruislaan | Florijn Zuid |
| complexId | 2212001 | 21042-02 |
| vhe | 423 | 94 |
| components | 12 | 14 |
| utilities | electricity, heat | heat |

### buildingServices.json
42 entries (14 services × 3 years). Real ledger amounts from production:

| Service | Code | 2024 | 2025 | 2026 |
|---------|------|------|------|------|
| Glasverzekering | GDG036 | €2,608 | €2,746 | — |
| Elektrakosten algemeen | GDG105 | €22,232 | €17,800 | €4,634 |
| Warmtekosten | GDG108 | €153,543 | — | — |
| 24u storingsdienst CV | GDG115 | €4,484 | €4,727 | — |
| Schoonmaken | GDG118 | €26,609 | €27,008 | €7,039 |
| 24u storingsdienst hydrof. | GDG120 | €61 | €62 | — |
| Ontstoppen riool | GDG122 | €738 | €1,095 | — |
| Mech. vent. collectief | GDG127 | €1,192 | €1,244 | — |
| Mechanische Ventilatie | GDG128 | €50 | €53 | — |
| Wijkbeheer/Huismeester | GDG131 | €4,819 | — | — |
| 24u storingsdienst lift | GDG132 | €2,284 | €1,681 | — |
| 24u service Elektr. deuren | GDG171 | €47 | €37 | — |
| Warmtekosten (new) | GDH108 | — | €143,776 | — |
| Ontstoppen riool (new) | GDH122 | — | €109 | — |

Consumption data enriched from Energy Module for GDG108 (2024), GDH108 (2025, 2026).

### meters.json
- **Before**: 4 fabricated main + 733 fabricated sub (mixed types)
- **After**: 1 real main GASZ (Vattenfall) + 145 sub WMZ (94 active + 51 dismounted)
- Main meter EAN: 970001000000149081
- Sub-meter provider: techem (Tobias 365 contract)

### vhes.json
- **Before**: 354 VHEs at "Rode Kruislaan 1-99" (all same voorschot €99.83, all 88m²)
- **After**: 94 VHEs at "Florijn 101-907" (voorschot €131-€170, varied m², realistic contracts)
- Contract mix: 88 active, 2 ended, 4 vacant

---

## Production Data WITHOUT a Prototype Home

The following data is visible in production but has **no corresponding field or display** in the prototype:

### 1. Energy Module — Building-Level Fields
| Field | Example Value | Notes |
|-------|---------------|-------|
| `objectnummer` | 033002322 | Primary ID in Corporatie systems |
| `stadswarmte` | Kleinverbruik | District heating type classification |
| `tariffType` | Dynamic | vs Fixed tariff indicator |
| `voorschotcodes` | GDH108 (2025), GDG108 (2024) | Service charge code prefix per year |
| `huurderApp` | true | Whether tenant app is enabled |
| `huurderAppUsers` | 32 | Number of active app users |
| `contractName` | Tobias 365 | Metering service contract name |
| `contractLastUpdate` | 2023-02-26 | When contract was last updated |
| `participants.total` | 113 | Total participants (incl. departed) |
| `participants.active` | 93 | Currently active |
| `participants.departed` | 0 | Left during period |
| `participants.new` | 0 | Joined during period |

### 2. Energy Module — Cost Breakdown Structure
The prototype tracks `actual` (total cost) but does NOT decompose into:
| Component | 2025 Value | Description |
|-----------|-----------|-------------|
| `variableKosten` | €119,384 | Heat consumption charges |
| `gedeeldeKosten.contractkosten` | €23,281 | Shared contract costs |
| `gedeeldeKosten.leidingafgifte` | €30,257 | Shared pipe distribution costs |
| `vasteKosten` | €23,280.99 | Fixed costs (same each year) |

> **Note**: We added these as nested fields in `consumption` on buildingServices, but the UI doesn't display them yet. This breakdown is central to the Energy Module's value prop.

### 3. Energy Module — Per-VHE Budget Status
| Field | Example | Notes |
|-------|---------|-------|
| `budgets.within` | 45 (2025) | VHEs within budget |
| `budgets.over` | 52 (2025) | VHEs over budget |
| `topOverspenders` | Florijn 307: €-1,798 | Top 5 overspenders with amounts |

> The prototype has `tenantExceedingBudget` count but no named top-overspender list.

### 4. Ledger — Supplier/Category Metadata
| Field | Example | Notes |
|-------|---------|-------|
| Per-service supplier | "Engie" on GDG105 | Electricity supplier name |
| Per-service category | "Gebouwbeheer" on GDG131 | Named category (vs "Onbekend") |
| Sub-line items | "Gaslevering" + "Onbekend" on GDG108 | Multiple booking lines per service |
| Booking status icons | Red ⊘ on all services | Error/warning states per service |

### 5. Historical Year Differences
The Energy Module shows important structural differences across years that the prototype doesn't model:

| Year | Notable Difference |
|------|--------------------|
| 2023 | Energy crisis: €84.46/GJ (2× normal). No `leidingafgifte`. Different cost structure. Warning: "usage estimated from previous year" |
| 2024 | Normal: €40.77/GJ. Full 3-component breakdown. Voorschotcode GDG108 |
| 2025 | Normal: €42.06/GJ. Voorschotcode changed to GDH108. New service codes (GDH###) |
| 2026 | Current: €40.05/GJ. YTD vs forecast. Only 2 months of data |

### 6. Voorschotcode Versioning
Production uses two parallel service code prefixes:
- **GDG###** — Used for 2024 and earlier accounting years
- **GDH###** — Used for 2025+ accounting years

This means the SAME logical service (e.g., "Warmtekosten") exists under TWO codes (GDG108 and GDH108) with data in different years. The prototype models these as separate services, which is correct, but there's no UI to show they represent the same underlying service.

---

## Recommendations

1. **Add building info panel** showing objectnummer, stadswarmte type, voorschotcodes, huurderApp status
2. **Add cost breakdown visualization** for energy services (variable / shared / fixed)
3. **Add top-overspenders widget** to VHE tab or Overview
4. **Add supplier name** to service cards in Services tab
5. **Add booking sub-lines** to service detail view
6. **Add historical tariff comparison** chart (shows the 2023 energy crisis impact)
7. **Link GDG↔GDH codes** as "same service, different period" in the UI
