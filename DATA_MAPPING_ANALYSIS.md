# Real Data → Prototype Mapping Analysis

## Executive Summary

Three production database exports were analyzed against the current `mockData.js` structure. The real data is **richer and better-structured** than the mock data in several areas, but there are important gaps and mismatches. This document maps every mock entity to its real-world equivalent, flags what's missing, and proposes a migration strategy.

**Recommendation:** Use **Rochdale** as the primary data source (richest overall: ledger + rental units + advances), supplemented by **DUWO** for ledger depth and **Portaal** for the usage monitor module.

---

## 1. Buildings (`buildings[]`)

### Mock Structure
```
{ id, complex, complexId, location, vhe, components, utilities, budgetTotal, budgetSpent, dataQuality }
```

### Real Source → `real_estate_complex`

| Mock Field | Real Column | Status | Notes |
|---|---|---|---|
| `id` | `id` (integer) | ✅ Direct map | Need to convert to string ID format (e.g., `"BLD-{id}"`) |
| `complex` | `name` | ✅ Direct map | Real names: "Koornmarkt 34-38", "De Koepel", etc. |
| `complexId` | `code` | ✅ Direct map | Real codes: "20089", "20001", etc. (not GRC-prefixed) |
| `location` | `location` | ✅ Direct map | Real values: "Delft", "Den Haag", "Rotterdam" |
| `vhe` | `vhe_count` | ✅ Direct map | Only in Rochdale; DUWO has no vhe_count (must COUNT rental units) |
| `components` | — | 🔶 Derived | COUNT of services per complex from `service_charges_service` |
| `utilities` | — | 🔶 Derived | Derived from service types (EW services → heat/water/electricity) |
| `budgetTotal` | — | 🔶 Derived | SUM of `service_charges_serviceperiod.total_cost` for prior year × adjustment |
| `budgetSpent` | — | 🔶 Derived | SUM of `finance_entry.amount` for current billing period |
| `dataQuality` | — | 🔶 Derived | Based on `entries_progress_score` + `categories_progress_score` from billing period |

### New Fields Available in Real Data (not in mock)
- `onboarded` (boolean) — whether the complex is fully onboarded
- `has_heating` / `has_electricity` (boolean) — utility flags
- `latest_settled_billing_period_id` — pointer to last settled year
- `to_be_settled_billing_period_id` — the year currently being settled
- `current_billing_period_id` — the year currently being monitored
- `organization_id` — multi-tenant key (7=Rochdale, 8=DUWO, 13=Portaal)

### Gap Analysis
- **Mock has 21 buildings** (all in Gorinchem). Real data: DUWO=425 complexes, Rochdale=879. We should pick ~20-30 representative ones.
- **Mock invents budgetTotal/budgetSpent**. Real data derives these from actual billing period totals and ledger entries.
- **Real data has no explicit "dataQuality" field** but has `entries_progress_score` (0-100) and `categories_progress_score` (0-100) on billing periods which serve the same purpose.

---

## 2. Services (`services[]`)

### Mock Structure
```
{ id, code, gdh, name:{en,nl}, description:{en,nl}, category, regulation, variable, metered, buildingCount, suppliers, avgCostPerVhe, status }
```

### Real Source → `service_charges_service` + `service_charges_costcategorytype`

| Mock Field | Real Column | Status | Notes |
|---|---|---|---|
| `id` | `id` (integer) | ✅ Direct map | Convert to `"SVC-{code}"` |
| `code` | `code` | ✅ Direct map | Real: "GDG108", "GDG102", "COM069", "COM074" |
| `name.nl` | `name` | ✅ Direct map | Real: "Warmtekosten", "Koud water woonruimte" |
| `name.en` | — | ❌ Missing | Real data is NL-only. English names must be manually added or translated. |
| `description` | — | ❌ Missing | Not in DB. Must be manually authored. |
| `category` | `service_type` | ✅ Map needed | Real: EW→"energy", CO→"cleaning", IT→"installations", MS→"management", OI→"other" |
| `regulation` | — | ❌ Missing | Static text, keep from mock. |
| `variable` | — | 🔶 Derivable | Based on service type (EW typically variable) |
| `metered` | — | 🔶 Derivable | Based on whether cost categories include metered types (GAS_SUPPLY, WATER_SUPPLY, etc.) |
| `buildingCount` | — | 🔶 Derived | COUNT DISTINCT complex_id per service code |
| `suppliers` | — | 🔶 Derived | From `cost_category.supplier_name` for this service |
| `avgCostPerVhe` | — | 🔶 Derived | total_cost / vhe_count from service periods |
| `status` | — | 🔶 Derived | Based on whether service has costs in current billing period |

### Service Code Mapping

**Rochdale uses official GDG/GDH codes** (same as our mock):
- GDG102 = Koud water woonruimte ✅
- GDG104 = Warm water woonruimte ✅
- GDG105 = Elektrakosten algemeen ✅
- GDG108 = Warmtekosten ✅
- GDG118 = Schoonmaken algemene ruimte ✅
- GDG131 = Wijkbeheer / Huismeester ✅

**DUWO uses COM-prefix codes** (need mapping):
- COM069 = Elektra → maps to GDG105/106
- COM070 = Gas → maps to GDG107/108
- COM074 = Water → maps to GDG102
- COM088 = Afvalstoffenheffing (waste levy)
- COM089 = Rioolheffing (sewer levy)
- COM099 = Ziggo (internet/TV)

### Gap Analysis
- **Service codes differ per corporation**. DUWO uses COM-prefix, Rochdale uses GDG/GDH. The product maps these in `service_charges_costcategorytype`.
- **Real data has `service_type` field** (EW/CO/IT/MS/OI) which maps cleanly to our `category` concept.
- **Real data has additional fields**: `is_significant_in_complex`, `cost_perc_unknown`, `has_advances`, `has_costs`, `has_significant_unknowns` — all useful for data quality indicators.
- **English translations are not in the DB** — must be maintained separately.

---

## 3. Service Categories (`serviceCategories[]`)

### Mock Structure
```
{ id, icon, label:{en,nl} }
```

### Real Source → `service_type` field on services

The real data uses a simpler enum: `EW`, `CO`, `IT`, `MS`, `OI`. Our 5 mock categories map perfectly:

| Mock Category | Real service_type | Match |
|---|---|---|
| `energy` | `EW` | ✅ |
| `installations` | `IT` | ✅ |
| `cleaning` | `CO` | ✅ |
| `management` | `MS` | ✅ |
| `other` | `OI` | ✅ |

**No gaps.** This is a clean 1:1 mapping.

---

## 4. Building-Services (`buildingServices[]`)

### Mock Structure (generated)
```
{ id, buildingId, serviceId, year, distributionMethod, budget, actual, ledgerEntries, expectedEntries, completeness, status, locked }
```

### Real Source → `service_charges_serviceperiod` + `service_charges_billingperiod`

| Mock Field | Real Column | Status | Notes |
|---|---|---|---|
| `buildingId` | `service.complex_id` | ✅ Via join | service → complex |
| `serviceId` | `service_id` | ✅ Direct | |
| `year` | `billing_period.start` / `billing_period.end` | ✅ Derived | Extract year from billing period dates |
| `budget` | `expected_total` on cost_category_period | 🔶 Derived | SUM of expected_total across cost categories |
| `actual` | `total_cost` on service_period | ✅ Direct | |
| `ledgerEntries` | `entry_count` on cost_category_period | 🔶 Derived | SUM across cost categories |
| `expectedEntries` | `expected_entries_count_min/max` | ✅ Direct | On cost_category_period |
| `completeness` | `entries_progress_score` on billing_period | ✅ Direct | Already 0-100 |
| `status` | `settled` on billing_period | 🔶 Derived | settled=true→"complete", else based on progress |
| `locked` | `settled` on billing_period | ✅ Direct | |
| `distributionMethod` | — | ❌ Missing | Not in this DB export. May need manual config. |

### Gap Analysis
- **Real data has `entries_progress_score` and `categories_progress_score`** — much better than our simple `completeness` percentage.
- **Budget is derived differently**: Real data uses `expected_total` on cost_category_period (the system's prediction of what costs should be), which is more sophisticated than our `baseAmt * vheCount * 12` formula.
- **Distribution method is NOT in the DB export**. This is likely configured in the application but not exported. We'd need to keep mock/manual values for now. **→ CONTEXT NEEDED FROM USER.**

---

## 5. Cost Categories (`costCategories[]`)

### Mock Structure
```
{ id, serviceId, name:{en,nl}, supplier, invoiceFrequency, budgetShare, unit, unitPrice }
```

### Real Source → `service_charges_costcategory` + `service_charges_costcategorytype`

| Mock Field | Real Column | Status | Notes |
|---|---|---|---|
| `id` | `id` | ✅ Direct | |
| `serviceId` | `service_id` | ✅ Direct | |
| `name.nl` | `costcategorytype.name` | ✅ Via type lookup | e.g., "GAS_SUPPLY" → "Gaslevering" |
| `name.en` | — | ❌ Missing | Must translate from type codes |
| `supplier` | `supplier_name` | ✅ Direct | Real: "Greenchoice", "Evides", "Stedin", "Joulz" |
| `invoiceFrequency` | — | ❌ Missing | Not stored. Derivable from entry patterns. |
| `budgetShare` | — | 🔶 Derivable | cost_category_period.total_cost / service_period.total_cost |
| `unit` | — | ❌ Missing | Would need to map from category type (GAS_SUPPLY→m³, WATER_SUPPLY→m³, ELECTRICITY_SUPPLY→kWh) |
| `unitPrice` | — | ❌ Missing | Not in DB. Could be derived from cost/consumption. |

### Cost Category Type Mapping (30 types in DB)

The real DB has a `service_charges_costcategorytype` table with 30 standardized types. Here's how they map to our prototype needs:

**Utility/Metered types** (→ these get unit + unitPrice):
- `GAS_SUPPLY` → unit: m³, maps to mock CC-108-01 / CC-107-01
- `WATER_SUPPLY` → unit: m³, maps to mock CC-102-01
- `ELECTRICITY_SUPPLY` → unit: kWh, maps to mock CC-105-01 / CC-106-01
- `DISTRICT_HEATING_SUPPLY` → unit: GJ
- `WOOD_PELLET_SUPPLY` → unit: kg (uncommon)
- `INTERNET_SUPPLY` → no unit

**Infrastructure types** (fixed costs):
- `TRANSPORT_COSTS` → grid/network charges
- `METERING_SERVICE` → meter reading/maintenance
- `ENERGY_TAX` → energiebelasting

**Service types:**
- `CLEANING`, `WINDOW_CLEANING`, `BUILDING_MANAGER`, `LANDSCAPING`
- `GLASS_INSURANCE`, `ADMINISTRATION`, `MAINTENANCE_REPAIR`
- `WASTE_COLLECTION_LEVY`, `SEWERAGE_LEVY`, `WASTEWATER_TREATMENT_LEVY`
- `WASTE_REMOVAL`, `DEPRECIATION`
- `EMERGENCY_REPAIR_SERVICE`, `STELPOST`, `PROVISIONAL_SUM`

**Quality/adjustment types:**
- `ROUNDING_DIFFERENCE`, `ERROR_CORRECTION`, `UNKNOWN`, `NON_RECOVERABLE`, `TTB`, `OTHER`

### Gap Analysis
- **Real data is per-complex**, not global. Each complex×service has its own set of cost categories with potentially different suppliers. Our mock defines cost categories globally per service. **This is a significant structural difference.**
- **invoiceFrequency and unitPrice are not stored** — we'd need to keep derived/manual values.
- **The 30 type codes are very useful** for automatic categorization and icon/color mapping.
- **`has_enough_data_to_extrapolate`** and **`has_extreme_variance`** and **`is_significant_in_service`** are quality signals we don't have in mock.

---

## 6. Ledger Entries (`ledgerEntries[]`)

### Mock Structure (generated)
```
{ id, serviceId, buildingId, year, month, date, description, supplier, invoiceRef, amount, status, flag }
```

### Real Source → `finance_entry`

| Mock Field | Real Column | Status | Notes |
|---|---|---|---|
| `id` | `id` | ✅ Direct | |
| `serviceId` | `service_id` | ✅ Direct | |
| `buildingId` | — | 🔶 Derived | Via service → complex join |
| `year` | `billing_period_id` → `billing_period.start` | 🔶 Via join | |
| `month` | `posted_on` | ✅ Extract month | |
| `date` | `posted_on` | ✅ Direct | ISO date string |
| `description` | `description` | ✅ Direct | Real: "01 Evides deel 2 3602", "12 Stedin", "Joulz 2026" |
| `supplier` | `upstream_vendor` or `guessed_supplier` | ✅ Direct | |
| `invoiceRef` | `reference` | ✅ Direct | |
| `amount` | `amount` | ✅ Direct | Real amounts, not generated |
| `status` | `confirmed` (boolean) | 🔶 Map needed | confirmed=true→"booked", else→"pending" |
| `flag` | — | 🔶 Derivable | From cost_category's `anomalous_cost_pattern`, `has_extreme_variance` |

### Additional Real Fields
- `vat_amount` / `vat_percentage` — VAT tracking (not in mock)
- `cost_category_id` — direct link to cost category (mock doesn't have this)
- `cost_category_confirmed` — whether the category assignment is confirmed
- `guessed_cost_category_type_id` — AI-suggested category (interesting for UI)
- `key` — external reference key from ERP

### Gap Analysis
- **Real data has `cost_category_id`** — each entry is linked to a specific cost category. Our mock doesn't have this; we assign descriptions cyclically. **This is a major improvement** — it enables the cost category breakdown in the Services tab.
- **`confirmed` boolean** replaces our tristate status. We'd need to derive "flagged" from other signals.
- **VAT data** is available but not used in current UI. Consider for future.
- **Volume**: DUWO has 247K entries, Rochdale has 158K. For the prototype, we should filter to ~20 complexes worth.

---

## 7. Billing Periods (new concept not explicitly in mock)

### Real Source → `service_charges_billingperiod`

The real data has an explicit billing period concept that our mock handles implicitly through `year` fields.

```
{ id, complex_id, start, end, settled, entries_progress_score, categories_progress_score }
```

Each complex has one billing period per year (e.g., 2021-01-01 to 2021-12-31). Key fields:
- `settled` (boolean) — whether the year is finalized
- `entries_progress_score` (0-100) — completeness of ledger entries
- `categories_progress_score` (0-100) — completeness of category assignments

**This maps to our `buildingSettlements[]` array** but is structurally cleaner — each billing period IS the settlement tracking unit.

---

## 8. VHE / Rental Units (`vhes[]`)

### Mock Structure (generated)
```
{ id, buildingId, address, unit, type, floor, m2, contract:{id,status,startDate,endDate}, voorschot, status, voorschotBreakdown }
```

### Real Source → `real_estate_rentalunit` + `tenancy_rentalcontract` + `tenancy_advance`

| Mock Field | Real Column | Status | Notes |
|---|---|---|---|
| `id` | `rentalunit.id` | ✅ Direct | |
| `buildingId` | `rentalunitcomplexassignment.complex_id` | ✅ Via join | |
| `address` | `street` + `number` | ✅ Compose | Real: "Pieter de Hoochweg", "104" |
| `unit` | `code` | ✅ Direct | Real: "20A004-01", "GHKL001" |
| `type` | — | ❌ Missing | Not in this export |
| `floor` | — | ❌ Missing | Not in this export |
| `m2` | — | ❌ Missing | Not in this export |
| `contract.id` | `rentalcontract.id` | ✅ Direct | |
| `contract.startDate` | `rentalcontract.period_start` | ✅ Direct | |
| `contract.endDate` | `rentalcontract.period_end` | ✅ Direct | null = ongoing |
| `voorschot` | SUM of `advance.amount` | ✅ Derived | Per rental contract |
| `voorschotBreakdown` | `advance` rows | ✅ Direct | Each advance has `code` (GDG/GDH) + `amount` |

### Gap Analysis
- **Only Rochdale has rental unit data** (39K units, 890 contracts, 24K advances). DUWO and Portaal have none.
- **`type`, `floor`, `m2` are NOT in the export** — these are likely in the full DB but not exported. We can omit or keep placeholder values.
- **Advances (voorschot)** are beautifully structured in Rochdale with real GDG/GDH codes per advance line. This maps perfectly to our `voorschotBreakdown`.
- **Portaal has apartments** in `usage_monitor_apartment` with some address data but no financial data.

---

## 9. Meters (`meters[]`)

### Mock Structure (generated)
```
{ id, buildingId, vheId, type, utility, meterNumber, ean, unit, readings:{year:{start,end,consumption,readingDate}}, status }
```

### Real Source → **No direct meter table in service charges data**

The service charges export does NOT contain meter data. However, **Portaal's `usage_monitor_building`** has:
- Connection type fields: `gas_connection_type`, `electricity_connection_type`, `water_connection_type`, `district_heating_connection_type`
- Consumption data in `usage_monitor_heatingseason`: `ytd_total_cost`, `ytd_cost_per_apartment`, energy prices per unit

### Gap Analysis
- **Meter readings are NOT in the exported data.** The meter module is a separate part of the homii platform.
- **Portaal has the best consumption data** but in aggregate form (per building per heating season), not per-meter readings.
- **For the prototype, we should keep generated meter data** or ask if there's a meter data export available.
- **→ CONTEXT NEEDED FROM USER:** Is there a separate meter data export? Or should we keep mock data for meters?

---

## 10. Suppliers (`suppliers[]`)

### Mock Structure
```
{ id, name, category, kvk, city, contactPerson, email, phone, website, contractStart, contractEnd, serviceIds, buildingCount, annualSpend, status, rating, notes }
```

### Real Source → `service_charges_costcategory.supplier_name` + `finance_entry.upstream_vendor`

| Mock Field | Real Source | Status | Notes |
|---|---|---|---|
| `name` | `costcategory.supplier_name` | ✅ Partial | Real: "Greenchoice", "Evides", "Stedin", "Joulz" |
| `buildingCount` | COUNT DISTINCT | 🔶 Derived | |
| `annualSpend` | SUM of entry amounts | 🔶 Derived | |
| All other fields | — | ❌ Missing | KvK, contact, contract details, rating not in export |

### Gap Analysis
- **Real data has supplier names but not supplier profiles.** The mock has rich supplier metadata (KvK, contact, contracts) that doesn't exist in the export.
- **Real supplier names are different**: "Greenchoice" instead of "ENGIE", "Evides" instead of "Oasen", "Stedin" matches, "Joulz" matches.
- **For the prototype, we can use real supplier names** but keep mock metadata (contact details etc.) or omit the supplier detail page.

---

## 11. Settlements (`buildingSettlements[]`)

### Mock Structure
```
{ id, buildingId, year, status, approvedAt, distributedAt, totalCost, totalVoorschot, netResult }
```

### Real Source → `service_charges_billingperiod`

| Mock Field | Real Column | Status | Notes |
|---|---|---|---|
| `buildingId` | `complex_id` | ✅ Direct | |
| `year` | Derived from `start` date | ✅ | |
| `status` | `settled` | 🔶 Simplified | Real is boolean; mock has 5 states |
| `totalCost` | SUM of service_period.total_cost | 🔶 Derived | |
| `totalVoorschot` | SUM of advances | 🔶 Derived | Only for Rochdale |
| `netResult` | totalVoorschot - totalCost | 🔶 Derived | |
| `approvedAt` / `distributedAt` | — | ❌ Missing | Not in export |

### Gap Analysis
- **Real data only has `settled` boolean** — our mock has a richer lifecycle (not_started → monitoring → in_review → approved → distributed). This is UI-level state that the product would track but the export doesn't include.
- **→ CONTEXT NEEDED:** Should we keep the mock settlement lifecycle, or simplify to settled/unsettled based on real data?

---

## 12. Monthly Close Status (`monthlyCloseStatuses[]`)

### Mock Structure (generated)
```
{ buildingId, serviceId, year, month, status, closedAt, closedBy }
```

### Real Source → **Not directly available**

Monthly closing status is an application-level concept that isn't in the database export. The closest proxy:
- `finance_entry.posted_on` — tells us which months have entries
- `cost_category_period.entry_count` vs `expected_entries_count_min/max` — tells us if entries are missing

### Gap Analysis
- **Monthly close status must remain generated** based on the presence/absence of ledger entries per month.
- The real data gives us better inputs for this generation: `expected_entries_count_min/max` tells us exactly how many entries to expect.

---

## 13. Usage Monitor (Portaal-only data)

### Source Tables
- `usage_monitor_building` — 152 buildings with connection types, divider, division_method
- `usage_monitor_apartment` — 6,945 apartments with addresses
- `usage_monitor_heatingseason` — 391 heating seasons with energy prices and consumption

### Prototype Mapping
This data has **no current representation in mockData.js**. It would feed:
- Meter readings (aggregate consumption)
- Energy prices per unit (GJ price, m³ price, kWh price)
- Building-level consumption monitoring
- Apartment-level consumption allocation

### Recommendation
Keep as future enhancement. The current prototype focuses on service charges/ledger workflow. Usage monitor data could enhance the "Consumption vs. Cost" control in the Services tab.

---

## Migration Strategy

### Phase 1: Pick Representative Data

Choose ~20 complexes from **Rochdale** (has the most complete data: ledger + rental units + advances). Selection criteria:
- Mix of sizes (small 10-20 VHE, medium 50-100, large 100+)
- Mix of service types (some with heating, some without)
- At least 3-4 billing periods worth of data
- Include some with `has_significant_unknowns = true` for interesting edge cases

### Phase 2: Static Data Export

Write a Python script that:
1. Queries the Rochdale DB for the selected complexes
2. Extracts all related: services, billing periods, service periods, cost categories, cost category periods, finance entries, rental units, contracts, advances
3. Transforms into the mockData.js format
4. Generates derived fields (budget, completeness, monthly close status, etc.)
5. Outputs a new `mockData.js` with real data

### Phase 3: Gap Filling

For fields not in the real data:
- **English translations**: Add manually for the ~25 service codes we use
- **Distribution methods**: Use sensible defaults (metered for EW services, equal for others)
- **Supplier metadata**: Use real names, add placeholder contact details
- **Meter readings**: Keep generated, or ask for meter export
- **Settlement lifecycle**: Keep mock lifecycle states, use `settled` boolean as the anchor
- **Monthly close status**: Generate from entry dates + expected entry counts

### Phase 4: Validation

Verify the real data renders correctly in all views:
- Building list page (correct VHE counts, budget numbers)
- Building detail Overview tab (verdict card, budget monitor)
- Building detail Services tab (cost categories, ledger entries)
- VHE tab (voorschot breakdown from real advances)
- Service detail page (cross-building view)

---

## Questions That Need Your Input

1. **Which corporation should be primary?** Rochdale has the most complete data, but DUWO has more ledger entries. Should we use Rochdale, or do you prefer DUWO (and accept no rental unit data)?

2. **How many buildings?** The mock has 21. Should we keep ~20 or go bigger (50+)?

3. **Meter data** — Is there a separate export for actual meter readings? Or should we keep generated meter data?

4. **Distribution methods** — These aren't in the export. Do you have a mapping of which services use which distribution methods? Or should we use defaults (metered for EW, equal for others)?

5. **Settlement lifecycle** — Keep the rich mock lifecycle (monitoring → in_review → approved → distributed) and map `settled=true` → `distributed`, `settled=false` → `monitoring`? Or simplify?

6. **Supplier detail level** — The real data only has supplier names. Drop the supplier detail page, or keep mock metadata for those named suppliers?

7. **Should the prototype stay single-org?** Or should we support showing data from all three orgs (multi-tenant)?
