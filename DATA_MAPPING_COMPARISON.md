# Mock Data ↔ Production DB Comparison

> **DB export:** `homii_export_rochdale.db` (Rochdale, org_id=15)
> **Mock data:** `src/lib/mockData.js` (v3 prototype)

---

## 1. Entity-level mapping

| # | Mock entity | DB source table(s) | Match | Notes |
|---|------------|-------------------|-------|-------|
| 1 | `buildings` | `real_estate_complex` | ✅ Partial | Core fields map; mock adds budget/utility aggregates not in DB |
| 2 | `services` | `service_charges_service` + `service_charges_servicetypemapping` | ✅ Good | Service code (`GDG…`) is the join key; mock enriches with i18n descriptions |
| 3 | `serviceCategories` | `service_charges_servicetypemapping` → `service_type` | ✅ Good | DB uses codes `EW/IT/CO/MS/OI`; mock uses human labels |
| 4 | `buildingServices` | `service_charges_serviceperiod` + `service_charges_costcategoryperiod` | ⚠️ Derived | Must be computed from `serviceperiod` (total_cost) + `billingperiod` (budget year) |
| 5 | `vhes` (rental units) | `real_estate_rentalunit` (**0 rows!**) / `usage_monitor_apartment` (7300 rows) | ⚠️ Split | `real_estate_rentalunit` is empty; apartment data lives in `usage_monitor_apartment` |
| 6 | `meters` | `usage_monitor_meterstatus` | ⚠️ Partial | DB has inventory (serial, provider, type) but **no reading values** |
| 7 | `suppliers` | ❌ **Not in DB** | ❌ Missing | No supplier master table; only `supplier_name`/`supplier_code` on `costcategory` |
| 8 | `distributionMethods` | `usage_monitor_building.division_method` | ⚠️ Minimal | DB has one field per building; mock has per-service distribution |
| 9 | `buildingSettlements` | `service_charges_billingperiod.settled` | ⚠️ Minimal | DB has a boolean `settled` + progress scores; mock has full lifecycle statuses |
| 10 | `activities` | ❌ **Not in DB** | ❌ Missing | No activity/event log in this export |

---

## 2. Field-by-field mapping per entity

### 2.1 Buildings (`buildings` ↔ `real_estate_complex`)

| Mock field | DB field | Match | Notes |
|-----------|---------|-------|-------|
| `id` | `id` | ✅ | Mock uses `BLD-001` format; DB uses numeric IDs |
| `complex` | `name` | ✅ | Direct match |
| `complexId` | `code` / `key` | ✅ | DB has both `key` and `code` (often identical) |
| `location` | `location` | ⚠️ | DB `location` is mostly NULL; city available via `usage_monitor_building.city` |
| `vhe` | `vhe_count` | ✅ | Direct match |
| `components` | — | ⚠️ Derived | Count of related `service_charges_service` rows per complex |
| `utilities` | `has_heating`, `has_electricity` | ⚠️ Partial | DB has boolean flags; no water/warmWater flags |
| `budgetTotal` | — | ❌ Missing | Not in DB; must be aggregated from advances or cost data |
| `budgetSpent` | — | ❌ Missing | Must be computed from `finance_entry` or `serviceperiod.total_cost` |
| `dataQuality` | — | ⚠️ Derived | Can be derived from `usage_monitor_building.data_integrity_status` / `manual_data_integrity_status` |

**Additional DB fields not in mock:** `organization_id`, `onboarded`, `assigned_to_id`, `latest_settled_billing_period_id`, `to_be_settled_billing_period_id`, `current_billing_period_id`, `recently_active`

**Also available from `usage_monitor_building`:** `street`, `city`, `coordinates`, `division_method`, `onboarding_status`, `gas_connection_type`, `electricity_connection_type`, `water_connection_type`, `district_heating_connection_type`, `advance_component_codes`

---

### 2.2 Services (`services` ↔ `service_charges_service`)

| Mock field | DB field | Match | Notes |
|-----------|---------|-------|-------|
| `id` | `id` | ✅ | Different ID formats (mock: `SVC-102`, DB: numeric) |
| `code` | `code` | ✅ | **Key join field** — e.g. `GDG102`, `GDG108` |
| `name.nl` | `name` | ✅ | DB has NL name only; mock has `{en, nl}` |
| `name.en` | — | ❌ Missing | No English translations in DB |
| `description` | — | ❌ Missing | Not in DB; mock has `{en, nl}` descriptions |
| `category` | `service_type` via `servicetypemapping` | ✅ | DB codes: `EW`=energy, `IT`=installations, `CO`=cleaning, `MS`=management, `OI`=other |
| `regulation` | — | ❌ Missing | Hardcoded in mock; not stored in DB |
| `variable` | — | ❌ Missing | Not in DB; business logic in mock |
| `metered` | — | ❌ Missing | Not in DB; business logic in mock |
| `buildingCount` | `is_significant_in_complex` (derived) | ⚠️ Derived | Can be counted from `service` rows per code |
| `suppliers` | `costcategory.supplier_name` | ⚠️ Indirect | Must aggregate distinct `supplier_name` from related `costcategory` rows |
| `avgCostPerVhe` | — | ⚠️ Derived | Can be computed: `serviceperiod.total_cost / complex.vhe_count` |
| `status` | — | ❌ Missing | Not in DB |

**Additional DB fields not in mock:** `complex_id` (service is per-complex, not global), `key`, `is_significant_in_complex`, `cost_perc_unknown`, `has_advances`, `has_costs`, `has_significant_unknowns`

**Important structural difference:** In the mock, services are global entities. In the DB, each `service_charges_service` is **per complex** — so `GDG108` (Warmtekosten) appears as a separate row for each complex that uses it.

---

### 2.3 Building-Services (`buildingServices` ↔ computed)

| Mock field | DB source | Match | Notes |
|-----------|----------|-------|-------|
| `buildingId` | `service.complex_id` → `complex.id` | ✅ | |
| `serviceId` | `service.code` | ✅ | Join via service code |
| `year` | `billingperiod.start` / `billingperiod.end` | ✅ | |
| `distributionMethod` | — | ❌ Missing | Not per-service in DB; only per-building in `usage_monitor` |
| `budget` | — | ❌ Missing | No budget data in this export |
| `actual` | `serviceperiod.total_cost` | ✅ | |
| `ledgerEntries` | `costcategoryperiod.entry_count` | ✅ | Sum across cost categories for a service |
| `expectedEntries` | `costcategoryperiod.expected_entries_count_min/max` | ⚠️ Partial | DB has min/max range; mock has single number |
| `completeness` | `billingperiod.entries_progress_score` | ✅ | DB has 0.0–1.0 float; mock has 0–100 int |
| `status` | `billingperiod.settled` | ⚠️ Minimal | DB: boolean; mock: "complete"/"incomplete" |
| `locked` | — | ❌ Missing | Not in DB |

---

### 2.4 VHEs / Rental Units (`vhes` ↔ `usage_monitor_apartment`)

> ⚠️ `real_estate_rentalunit` is **empty** (0 rows). VHE data is in `usage_monitor_apartment` (7300 rows).

| Mock field | DB field (`usage_monitor_apartment`) | Match | Notes |
|-----------|-------------------------------------|-------|-------|
| `id` | `id` / `apartment_id` (UUID) | ✅ | Different formats |
| `buildingId` | `building_id` | ✅ | References `usage_monitor_building`, not `real_estate_complex` |
| `address` | `street` + `number` + `addition` | ✅ | Must concatenate |
| `unit` | `number` | ✅ | |
| `type` | `apartment_type` | ✅ | DB: `RESIDENTIAL`; mock: `apartment`/`studio` |
| `floor` | — | ❌ Missing | Not in DB |
| `m2` | — | ❌ Missing | Not in DB |
| `contract` | via `usage_monitor_rentalcontract` | ✅ | Separate table with `rental_start`, `rental_end` |
| `voorschot` | `costattributionperiod.total_advance` | ✅ | 16K rows have this value (see §2.7) |
| `status` | derived from contract presence | ⚠️ Derived | Infer from `rental_end` being NULL (active) or set (ended) |
| `voorschotBreakdown` | — | ❌ Missing | No per-service advance breakdown in this export |

**Additional DB fields not in mock:** `cu_token`, `erp_id`, `postal_code`, `in_portfolio`

---

### 2.5 Meters (`meters` ↔ `usage_monitor_meterstatus`)

| Mock field | DB field | Match | Notes |
|-----------|---------|-------|-------|
| `id` | `id` | ✅ | |
| `buildingId` | via `heating_season_id` → `building_id` | ⚠️ Indirect | Must join through `heatingseason` |
| `vheId` | `apartment_id` | ✅ | |
| `type` | — | ❌ Missing | DB doesn't distinguish main/sub |
| `utility` | `meter_type` | ✅ | See meter type mapping below |
| `meterNumber` | `serial_number` | ✅ | |
| `ean` | — | ❌ Missing | EAN codes on `usage_monitor_building` (deprecated fields) |
| `unit` | — | ❌ Missing | Implied by `meter_type` |
| `readings` | — | ❌ Missing | **No reading values in export** — only `latest_date` |
| `status` | `data_integrity_status` | ⚠️ Partial | DB: numeric (0/1); mock: "active"/"warning" |

**Additional DB fields not in mock:** `vendor_id`, `provider` (e.g. "techem"), `proportion`, `dismounted_date`

**Meter type mapping (55,451 rows total):**

| DB `meter_type` | Count | Likely utility |
|-----------------|-------|---------------|
| `WMZ` | 27,001 | Heat (Wärmemengenzähler) |
| `EHKV` | 11,786 | Heat cost allocator (Heizkostenverteiler) |
| `WWZ` | 8,295 | Warm water (Warmwasserzähler) |
| `O` | 3,640 | Other |
| `K` | 1,990 | Cold water (Kaltwasser) |
| `KWZ` | 1,975 | Cold water (Kaltwasserzähler) |
| `W` | 532 | Water |
| `GASZ` | 173 | Gas |
| `STRZ` | 14 | Electricity (Stromzähler) |
| `H` | 4 | Heat |
| *(empty)* | 41 | Unknown |

---

### 2.6 Suppliers (`suppliers` — ❌ No DB table)

The mock has a rich `suppliers` array with: `name`, `kvk`, `city`, `contactPerson`, `email`, `phone`, `website`, `contractStart`, `contractEnd`, `serviceIds`, `buildingCount`, `annualSpend`, `status`, `rating`, `notes`.

**In the DB:** Supplier data is fragmented across:
- `service_charges_costcategory.supplier_name` — partial, often empty
- `service_charges_costcategory.supplier_code` — partial, often empty
- `finance_entry.upstream_vendor` — partial, often empty

**Verdict:** Supplier master data must remain as mock data or come from a different source.

---

### 2.7 Cost & consumption data per apartment (`costattributionperiod`)

> This is the **richest per-VHE dataset** and the closest thing to meter reading data in the export.

**`usage_monitor_costattributionperiod`** — 27,513 rows, per apartment per heating season:

| Field | Populated rows | Mock equivalent | Notes |
|-------|---------------|----------------|-------|
| `total_advance` | 15,963 | `vhes[].voorschot` | ✅ The total advance paid by the tenant |
| `ytd_budget` | 15,963 | `buildingServices[].budget` (per VHE) | ✅ Budget year-to-date |
| `ytd_total_cost` | 23,457 | — | Actual cost year-to-date (total: fixed + variable) |
| `ytd_variable_cost` | 23,457 | — | Variable (consumption-based) portion of cost |
| `ytd_balance` | 15,962 | — | Advance minus cost (positive = overpaid) |
| `end_total_cost` | 23,482 | — | Projected or final year-end total cost |
| `end_balance` | 15,963 | — | Projected or final year-end balance |
| `suggested_average_advance` | 20,633 | — | Recommended monthly advance for next period |

**Example row:**
```
Apt: Hofgeest 147 | Season: 2024
  total_advance=€2,980.86  ytd_budget=€2,980.86
  ytd_total_cost=€3,958.30  ytd_variable_cost=€3,306.79
  ytd_balance=-€977.44 (underpaying!)
  suggested_advance=€329.86/month
```

**What this means for the prototype:** While you don't have raw GJ/m³ readings, you *do* have the computed € cost per apartment per year, split into fixed and variable portions. This is arguably more useful for the prototype's VHE detail views than raw meter readings would be.

---

### 2.8 Heating season data per building (`usage_monitor_heatingseason`)

**`usage_monitor_heatingseason`** — 131 rows, per building per year:

| Field | Populated | Notes |
|-------|-----------|-------|
| `gj_price` | 55 seasons | GJ unit price (e.g. €39.59, €74.51) |
| `m3_price` | 41 seasons | Gas m³ unit price (e.g. €1.65, €2.40) |
| `cold_water_m3_price` | 11 seasons | Sparsely filled |
| `warm_water_m3_price` | 0 seasons | Not filled |
| `electricity_price` | 0 seasons | Not filled |
| `ytd_total_cost` | ✅ | Building-level cost to date |
| `ytd_cost_per_apartment` | ✅ | Average cost per VHE |
| `end_cost_per_apartment` | ✅ | Projected year-end cost per VHE |
| `average_advance` | ✅ | Average monthly advance |
| `data_integrity_status` | ✅ | 0/1/2 quality indicator |

---

### 2.9 Settlements (`buildingSettlements` ↔ `service_charges_billingperiod`)

| Mock field | DB field | Match | Notes |
|-----------|---------|-------|-------|
| `buildingId` | `complex_id` | ✅ | |
| `year` | derived from `start`/`end` | ✅ | |
| `status` | `settled` (boolean) | ⚠️ Minimal | Mock has 5 statuses: `not_started`, `monitoring`, `in_review`, `approved`, `distributed` |
| `approvedAt` | — | ❌ Missing | |
| `distributedAt` | — | ❌ Missing | |
| `totalCost` | derived from `serviceperiod.total_cost` | ⚠️ Derived | Sum of all service costs for the billing period |
| `totalVoorschot` | — | ❌ Missing | No advance totals in billing period |
| `netResult` | — | ⚠️ Derived | Would be `totalVoorschot - totalCost` |

**Additional DB fields not in mock:** `entries_progress_score`, `categories_progress_score`

---

## 3. Summary: What can be replaced vs. what stays mock

### ✅ Can replace with real data
| Entity | Coverage | Source |
|--------|----------|-------|
| Building list | ~90% of fields | `real_estate_complex` — names, codes, vhe_count |
| Services per building | Code + name + type | `service_charges_service` + `servicetypemapping` |
| Cost actuals per period | Good | `serviceperiod.total_cost` per billing period |
| Finance entries | Full | `finance_entry` — 158K rows of real ledger data |
| Cost categories | Good | `costcategory` + `costcategoryperiod` |
| Apartments/VHEs | Core fields | `usage_monitor_apartment` (7,300 rows) |
| Rental contracts | Core fields | `usage_monitor_rentalcontract` (7,741 rows) |
| Per-VHE costs & balances | Rich | `costattributionperiod` — advance, cost, balance (27K rows) |
| Meter inventory | Serial, type, provider | `usage_monitor_meterstatus` (55K rows) |
| Energy prices per building | Partial | `heatingseason` — GJ price (55), m³ price (41) |
| Billing periods | Good | `service_charges_billingperiod` (2,187 rows) |

### ❌ Must stay as mock / enrichment data
| Entity | Reason |
|--------|--------|
| Suppliers (full master data) | Not in DB; only fragments on cost categories |
| English translations | DB is NL-only |
| Service descriptions | Not in DB |
| Voorschot breakdown per VHE per service | Not available (only total advance) |
| Raw meter readings (GJ, m³, kWh values) | Not in `meterstatus`; only dates and inventory |
| Settlement lifecycle statuses | DB only has boolean `settled` |
| Activities / event log | Not in DB |
| Distribution methods per service | Not per-service in DB |
| Floor / m² per VHE | Not in DB |

### ⚠️ Can be computed / derived
| Data point | How to compute |
|-----------|----------------|
| `components` count per building | `COUNT(DISTINCT service.code) WHERE service.complex_id = X` |
| `buildingCount` per service | `COUNT(DISTINCT complex_id) WHERE code = 'GDGxxx'` |
| `avgCostPerVhe` | `serviceperiod.total_cost / complex.vhe_count` |
| `dataQuality` | Map `data_integrity_status` (0/1/2) to good/warning/error |
| `completeness` | `billingperiod.entries_progress_score * 100` |
| VHE status | `rental_end IS NULL` → active; set → ended |
| `budgetSpent` per building | Sum of `serviceperiod.total_cost` for current billing period |

---

## 4. Key structural differences

1. **Services are per-complex in DB, global in mock.** The mock treats `GDG108` as one global service entity. The DB creates a separate `service_charges_service` row for each complex that uses it. You'll need a deduplication/grouping layer (group by `code`).

2. **Two parallel data models.** The DB has both `usage_monitor_*` tables (the old warmtekosten system) and `service_charges_*` / `real_estate_*` tables (the new servicekosten system). VHE data currently lives only in the old system.

3. **`real_estate_rentalunit` is empty.** Despite the schema existing, all 0 rows. The `usage_monitor_apartment` table has the actual data (7,300 rows). Same for `tenancy_rentalcontract` (0 rows) vs. `usage_monitor_rentalcontract` (7,741 rows). And `tenancy_advance` (0 rows) — advance data is in `costattributionperiod`.

4. **No raw meter readings, but rich cost data.** The `meterstatus` table has 55K rows of meter inventory (serial numbers, types, providers) but no actual GJ/m³/kWh values. However, `costattributionperiod` has 27K rows of **computed cost data per apartment** including advances, variable costs, balances, and suggested adjustments — which is the monetary result of those readings.

5. **Rochdale, not Gorinchem.** The DB is Rochdale (Amsterdam area, org_id=15, 879 complexes). The mock is modeled after a Gorinchem corporation (21 buildings). Building names, addresses, and scales are completely different.
