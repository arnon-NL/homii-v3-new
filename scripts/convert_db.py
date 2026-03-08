#!/usr/bin/env python3
"""
convert_db.py — One-time SQLite → JSON conversion for homii v3 prototype.

Reads homii_export_rochdale.db and produces JSON files in src/data/
that match the shape expected by the existing mockData.js getters.

Usage:
    python scripts/convert_db.py [path_to_db]

If no path given, looks for the DB in common locations.
"""

import json
import math
import os
import random
import sqlite3
import sys
from collections import defaultdict
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DATA_DIR = PROJECT_DIR / "src" / "data"

# Try to find the DB
DB_CANDIDATES = [
    Path(sys.argv[1]) if len(sys.argv) > 1 else None,
    PROJECT_DIR / "homii_export_rochdale.db",
    PROJECT_DIR.parent / "uploads" / "homii_export_rochdale (1).db",
]

DB_PATH = None
for candidate in DB_CANDIDATES:
    if candidate and candidate.exists():
        DB_PATH = candidate
        break

if not DB_PATH:
    print("ERROR: Cannot find homii_export_rochdale.db")
    print("Usage: python scripts/convert_db.py <path_to_db>")
    sys.exit(1)

print(f"Using DB: {DB_PATH}")
DATA_DIR.mkdir(parents=True, exist_ok=True)

# ── DB Connection ──────────────────────────────────────────────────

conn = sqlite3.connect(str(DB_PATH))
conn.row_factory = sqlite3.Row


def query(sql, params=()):
    return [dict(row) for row in conn.execute(sql, params).fetchall()]


def query_one(sql, params=()):
    row = conn.execute(sql, params).fetchone()
    return dict(row) if row else None


# ── Service type mapping ───────────────────────────────────────────

SERVICE_TYPE_TO_CATEGORY = {
    "EW": "energy",
    "IT": "installations",
    "CO": "cleaning",
    "MS": "management",
    "OI": "other",
}

# Mock enrichment for English names, descriptions, etc.
# Keyed by GDG code → extra fields not in DB
MOCK_SERVICE_ENRICHMENT = {
    "GDG102": {"name_en": "Cold Water (residential)", "description_en": "Cold water supply for residential units", "description_nl": "Koud waterlevering voor woonruimten", "regulation": "Servicekosten Besluit Art. 1", "variable": True, "metered": True},
    "GDG104": {"name_en": "Hot Water (residential)", "description_en": "Hot water supply for residential units", "description_nl": "Warm waterlevering voor woonruimten", "regulation": "Servicekosten Besluit Art. 1", "variable": True, "metered": True},
    "GDG105": {"name_en": "Communal Electricity", "description_en": "Electricity for shared spaces", "description_nl": "Elektriciteit voor gemeenschappelijke ruimten", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": True},
    "GDG106": {"name_en": "Electricity (residential)", "description_en": "Individual electricity for residential units", "description_nl": "Individueel elektriciteitsverbruik voor woonruimten", "regulation": "Servicekosten Besluit Art. 1", "variable": True, "metered": True},
    "GDG107": {"name_en": "Gas (communal facilities)", "description_en": "Gas delivery for communal facilities", "description_nl": "Gaslevering voor gemeenschappelijke voorzieningen", "regulation": "Servicekosten Besluit Art. 1", "variable": True, "metered": True},
    "GDG108": {"name_en": "Heating Costs", "description_en": "Central heating supply and distribution", "description_nl": "Centrale verwarming en warmtedistributie", "regulation": "Servicekosten Besluit Art. 1", "variable": True, "metered": True},
    "GDG110": {"name_en": "Electricity (commercial)", "description_en": "Electricity for commercial spaces", "description_nl": "Elektriciteit voor bedrijfsmatig onroerend goed", "regulation": "Servicekosten Besluit Art. 1", "variable": True, "metered": True},
    "GDG111": {"name_en": "Consumption Meters", "description_en": "Maintenance and calibration of meters", "description_nl": "Onderhoud en ijking van verbruiksmeters", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG115": {"name_en": "24h Emergency Service (heating)", "description_en": "Emergency repair service for heating", "description_nl": "24-uurs storingsdienst CV", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG116": {"name_en": "Lamp Replacement", "description_en": "Replacement of communal lighting", "description_nl": "Vervanging verlichting gemeenschappelijke ruimten", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG118": {"name_en": "Cleaning Common Areas", "description_en": "Regular cleaning of shared spaces", "description_nl": "Schoonmaak gemeenschappelijke ruimten", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG120": {"name_en": "24h Emergency Service (hydrophore)", "description_en": "Emergency service for water pressure systems", "description_nl": "Storingsdienst hydrofoor", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG122": {"name_en": "Drain Cleaning", "description_en": "Drain and sewer cleaning", "description_nl": "Riool- en afvoerreiniging", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG123": {"name_en": "Landscaping", "description_en": "Garden and green area maintenance", "description_nl": "Tuin- en groenonderhoud", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG124": {"name_en": "Gutter Cleaning", "description_en": "Periodic cleaning of gutters and drainage", "description_nl": "Periodiek reinigen dakgoten en afwatering", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG126": {"name_en": "Geyser Cleaning", "description_en": "Cleaning of gas water heaters", "description_nl": "Reinigen gasboilers en geisers", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG127": {"name_en": "Mechanical Ventilation", "description_en": "Communal ventilation maintenance", "description_nl": "Onderhoud collectieve ventilatie", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG131": {"name_en": "District Management / Caretaker", "description_en": "On-site caretaker and management", "description_nl": "Huismeester en wijkbeheer", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG132": {"name_en": "24h Emergency Service (elevator)", "description_en": "Emergency service for elevators", "description_nl": "24-uurs storingsdienst lift", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG133": {"name_en": "Elevator Electricity", "description_en": "Electricity for elevator operation", "description_nl": "Elektriciteitsverbruik lift", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": True},
    "GDG137": {"name_en": "Residential Support Services", "description_en": "Housing support and wellbeing programs", "description_nl": "Woonondersteunende diensten", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG140": {"name_en": "Window Cleaning", "description_en": "Professional exterior window cleaning", "description_nl": "Professionele glasbewassing", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG142": {"name_en": "Internet Subscription", "description_en": "Communal internet subscription", "description_nl": "Collectief internetabonnement", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG171": {"name_en": "24h Service Electric Doors", "description_en": "Maintenance for automatic door systems", "description_nl": "Service elektrische deursystemen", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG036": {"name_en": "Glass Insurance", "description_en": "Collective glass breakage insurance", "description_nl": "Collectieve glasbrakverzekering", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
    "GDG099": {"name_en": "Miscellaneous", "description_en": "Uncategorised service charges", "description_nl": "Niet-gecategoriseerde servicekosten", "regulation": "Servicekosten Besluit Art. 1", "variable": False, "metered": False},
}

# Meter type → utility mapping
METER_TYPE_MAP = {
    "WMZ": "heat",
    "EHKV": "heat",
    "KWZ": "water",
    "K": "water",
    "WWZ": "warmWater",
    "W": "warmWater",
    "STRZ": "electricity",
    "GASZ": "gas",
    "H": "heat",
    "O": "other",
}

# Service code → utility mapping for building utility detection
SERVICE_TO_UTILITY = {
    "GDG108": "heat", "GDH108": "heat",
    "GDG102": "water", "GDH102": "water",
    "GDG104": "warmWater",
    "GDG105": "electricity", "GDH105": "electricity",
    "GDG106": "electricity",
    "GDG107": "gas",
    "GDG109": "electricity",
    "GDG110": "electricity",
    "GDG111": "metering", "GDH111": "metering",
    "GDH091": "solar",
}

# Energy service code → heatingseason price field + unit
ENERGY_SERVICE_PRICE_MAP = {
    "GDG108": {"priceField": "gjPrice", "unit": "GJ", "utility": "heat"},
    "GDH108": {"priceField": "gjPrice", "unit": "GJ", "utility": "heat"},
    "GDG107": {"priceField": "m3Price", "unit": "m³", "utility": "gas"},
    "GDG102": {"priceField": "coldWaterM3Price", "unit": "m³", "utility": "water"},
    "GDH102": {"priceField": "coldWaterM3Price", "unit": "m³", "utility": "water"},
    "GDG104": {"priceField": "warmWaterM3Price", "unit": "m³", "utility": "warmWater"},
    "GDG105": {"priceField": "electricityPrice", "unit": "kWh", "utility": "electricity"},
    "GDH105": {"priceField": "electricityPrice", "unit": "kWh", "utility": "electricity"},
    "GDG106": {"priceField": "electricityPrice", "unit": "kWh", "utility": "electricity"},
}

# Utility → meter types that measure it
UTILITY_METER_TYPES = {
    "heat": {"WMZ", "EHKV", "H"},
    "gas": {"GASZ"},
    "water": {"KWZ", "K"},
    "warmWater": {"WWZ", "W"},
    "electricity": {"STRZ"},
}


# ═══════════════════════════════════════════════════════════════════
# STEP 1a: REAL DATA EXTRACTION
# ═══════════════════════════════════════════════════════════════════

def extract_buildings():
    """Extract 879 buildings from real_estate_complex + usage_monitor enrichment."""
    print("Extracting buildings...")

    complexes = query("SELECT * FROM real_estate_complex ORDER BY name")

    # Get service counts per complex
    svc_counts = {}
    for row in query("""
        SELECT complex_id, COUNT(DISTINCT code) as cnt
        FROM service_charges_service
        GROUP BY complex_id
    """):
        svc_counts[row["complex_id"]] = row["cnt"]

    # Get utility types per complex from service codes
    svc_codes_per_complex = defaultdict(set)
    for row in query("SELECT complex_id, code FROM service_charges_service"):
        svc_codes_per_complex[row["complex_id"]].add(row["code"])

    # Get data quality from usage_monitor_building (only 39 rows, keyed by object_number)
    # Note: real_estate_complex.code and usage_monitor_building.object_number don't match,
    # so we match by name (best-effort) and use definitive_data_integrity_status
    um_by_name = {}
    for row in query("""
        SELECT name, definitive_data_integrity_status, city
        FROM usage_monitor_building
    """):
        um_by_name[row["name"]] = {
            "status": row["definitive_data_integrity_status"],
            "city": row["city"],
        }

    # Service completeness as fallback data quality indicator
    completeness_data = {}
    for row in query("""
        SELECT s.complex_id,
               AVG(CASE WHEN sp.total_cost IS NOT NULL AND sp.total_cost > 0 THEN 1.0 ELSE 0.0 END) as pct
        FROM service_charges_serviceperiod sp
        JOIN service_charges_service s ON sp.service_id = s.id
        GROUP BY s.complex_id
    """):
        completeness_data[row["complex_id"]] = row["pct"]

    # Get budget data from serviceperiod (no total_budget column — derive from total_cost)
    budget_data = {}
    for row in query("""
        SELECT s.complex_id,
               SUM(sp.total_cost) as total_cost
        FROM service_charges_serviceperiod sp
        JOIN service_charges_billingperiod bp ON sp.billing_period_id = bp.id
        JOIN service_charges_service s ON sp.service_id = s.id
        WHERE bp."start" >= '2025-01-01' AND bp."start" < '2026-01-01'
        GROUP BY s.complex_id
    """):
        budget_data[row["complex_id"]] = {
            "spent": round(row["total_cost"] or 0, 2),
        }

    buildings = []
    for c in complexes:
        cid = c["id"]
        name = c["name"]

        # Derive utilities from service codes
        codes = svc_codes_per_complex.get(cid, set())
        utilities = sorted(set(
            SERVICE_TO_UTILITY[code]
            for code in codes
            if code in SERVICE_TO_UTILITY
        ))

        # Data quality — try usage_monitor match first, then derive from completeness
        um = um_by_name.get(name, {})
        dq_status = um.get("status")
        if dq_status == 1:
            data_quality = "good"
        elif dq_status == 2:
            data_quality = "warning"
        elif dq_status is not None and dq_status >= 3:
            data_quality = "error"
        else:
            # Derive from service data completeness
            pct = completeness_data.get(cid, 0)
            if pct >= 0.8:
                data_quality = "good"
            elif pct >= 0.4:
                data_quality = "warning"
            elif svc_counts.get(cid, 0) > 0:
                data_quality = "error"
            else:
                data_quality = "unknown"

        # Budget
        bd = budget_data.get(cid, {})

        # Derive operational status from onboarding + activity
        vhe_count = c["vhe_count"] or 0
        onboarded = c.get("onboarded")
        has_services = svc_counts.get(cid, 0) > 0
        if onboarded and has_services:
            status = "active"
        elif onboarded:
            status = "onboarded"
        elif vhe_count > 0:
            status = "pending"
        else:
            status = "inactive"

        buildings.append({
            "id": str(cid),
            "complex": name,
            "complexId": c["code"] or f"RDL-{cid}",
            "location": um.get("city") or c["location"] or "Amsterdam",
            "vhe": vhe_count,
            "components": svc_counts.get(cid, 0),
            "utilities": utilities,
            "budgetTotal": round((bd.get("spent") or 0) * 1.05, 2),  # derived: 5% buffer over actual
            "budgetSpent": bd.get("spent", 0),
            "dataQuality": data_quality,
            "status": status,
        })

    print(f"  → {len(buildings)} buildings")
    return buildings


def extract_services():
    """Extract global service definitions, deduped by code."""
    print("Extracting services...")

    # Get service type mappings
    type_map = {}
    for row in query("SELECT * FROM service_charges_servicetypemapping"):
        type_map[row["service_type"]] = row

    # Get all services, group by code
    all_svcs = query("""
        SELECT s.*, COUNT(DISTINCT s.complex_id) as building_count
        FROM service_charges_service s
        GROUP BY s.code
        ORDER BY s.code
    """)

    # Get avg cost per VHE per service code
    avg_costs = {}
    for row in query("""
        SELECT s.code,
               AVG(sp.total_cost / NULLIF(c.vhe_count, 0)) as avg_per_vhe
        FROM service_charges_serviceperiod sp
        JOIN service_charges_service s ON sp.service_id = s.id
        JOIN real_estate_complex c ON s.complex_id = c.id
        JOIN service_charges_billingperiod bp ON sp.billing_period_id = bp.id
        WHERE bp."start" >= '2024-01-01' AND c.vhe_count > 0
        GROUP BY s.code
    """):
        avg_costs[row["code"]] = round(row["avg_per_vhe"] or 0, 2)

    # Get actual building counts per code
    bld_counts = {}
    for row in query("""
        SELECT code, COUNT(DISTINCT complex_id) as cnt
        FROM service_charges_service
        GROUP BY code
    """):
        bld_counts[row["code"]] = row["cnt"]

    services = []
    seen_codes = set()
    for s in all_svcs:
        code = s["code"]
        if code in seen_codes:
            continue
        seen_codes.add(code)

        # Map service_type to category
        stype = s.get("service_type", "")
        category = SERVICE_TYPE_TO_CATEGORY.get(stype, "other")

        # Get mock enrichment
        enrich = MOCK_SERVICE_ENRICHMENT.get(code, {})

        svc_id = f"SVC-{code[3:]}" if code.startswith("GDG") else f"SVC-{code}"

        services.append({
            "id": svc_id,
            "code": code,
            "name": {
                "en": enrich.get("name_en", s["name"]),
                "nl": s["name"],
            },
            "description": {
                "en": enrich.get("description_en", ""),
                "nl": enrich.get("description_nl", ""),
            },
            "category": category,
            "regulation": enrich.get("regulation", "Servicekosten Besluit Art. 1"),
            "variable": enrich.get("variable", False),
            "metered": enrich.get("metered", False),
            "buildingCount": bld_counts.get(code, 0),
            "suppliers": [],
            "avgCostPerVhe": avg_costs.get(code, 0),
            "status": "active",
        })

    print(f"  → {len(services)} unique service codes")
    return services


def extract_service_categories():
    """Return the 5 standard categories."""
    return [
        {"id": "energy",        "icon": "Zap",        "label": {"en": "Energy & Water",              "nl": "Energie & Water"}},
        {"id": "installations", "icon": "Wrench",     "label": {"en": "Installations & Maintenance", "nl": "Installaties & Technisch Beheer"}},
        {"id": "cleaning",      "icon": "Sparkles",   "label": {"en": "Cleaning & Exterior",         "nl": "Schoonmaak & Buitenruimte"}},
        {"id": "management",    "icon": "HardHat",    "label": {"en": "Management & Services",       "nl": "Beheer & Woonservices"}},
        {"id": "other",         "icon": "FolderOpen", "label": {"en": "Other & Insurance",           "nl": "Overig & Verzekeringen"}},
    ]


def extract_building_services(buildings, services):
    """Extract per-building per-year service cost data."""
    print("Extracting building services...")

    svc_id_map = {s["code"]: s["id"] for s in services}

    rows = query("""
        SELECT s.complex_id,
               s.code as service_code,
               bp."start" as period_start,
               sp.total_cost,
               bp.entries_progress_score
        FROM service_charges_serviceperiod sp
        JOIN service_charges_service s ON sp.service_id = s.id
        JOIN service_charges_billingperiod bp ON sp.billing_period_id = bp.id
        ORDER BY s.complex_id, s.code, bp."start"
    """)

    # Build VHE count lookup
    vhe_lookup = {b["id"]: b["vhe"] for b in buildings}

    entries = []
    for r in rows:
        bld_id = str(r["complex_id"])
        code = r["service_code"]
        svc_id = svc_id_map.get(code)
        if not svc_id:
            continue

        start = r["period_start"]
        if not start:
            continue
        year = int(start[:4])

        actual = round(r["total_cost"] or 0, 2)
        budget = round(actual * 1.05, 2)  # derived: no budget column in DB
        completeness = round((r["entries_progress_score"] or 0) * 100)

        entries.append({
            "id": f"BS-{bld_id}-{code}-{year}",
            "buildingId": bld_id,
            "serviceId": svc_id,
            "serviceCode": code,
            "year": year,
            "distributionMethod": "equal",
            "budget": budget,
            "actual": actual,
            "ledgerEntries": max(1, round(completeness / 100 * 12)),
            "expectedEntries": 12,
            "completeness": completeness,
            "status": "complete" if completeness >= 100 else "incomplete",
            "locked": year < 2025,
        })

    print(f"  → {len(entries)} building-service entries")
    return entries


def _build_um_to_complex_map(buildings):
    """Build a mapping from usage_monitor_building → real_estate_complex id.

    The two DB systems (usage_monitor_* and real_estate_*) have no direct FK.
    We use a multi-pass matching strategy:
      1. Exact name match
      2. erp_id (with dashes removed) → RE complex key
      3. erp_id base (before first dash) → RE complex key
    Returns: { um_building_name: complex_id_str, ... }
    Also returns: { um_object_number: complex_id_str, ... } for apt lookups.
    """
    bld_by_name = {b["complex"]: b["id"] for b in buildings}
    bld_by_key = {b.get("complexId", ""): b["id"] for b in buildings if b.get("complexId")}

    um_buildings = query("SELECT object_number, name, erp_id FROM usage_monitor_building")
    name_map = {}  # um_name → complex_id
    objnum_map = {}  # um_object_number_int → complex_id
    for ub in um_buildings:
        cid = None

        # Pass 1: exact name match
        cid = bld_by_name.get(ub["name"])

        # Pass 2: erp_id (dashes removed) → RE key
        if not cid and ub.get("erp_id"):
            erp_nodash = ub["erp_id"].replace("-", "")
            cid = bld_by_key.get(erp_nodash)

        # Pass 3: erp_id base (before dash) → RE key
        if not cid and ub.get("erp_id") and "-" in ub["erp_id"]:
            erp_base = ub["erp_id"].split("-")[0]
            cid = bld_by_key.get(erp_base)

        if cid:
            name_map[ub["name"]] = cid
            objnum_map[int(ub["object_number"])] = cid

    print(f"  UM→Complex matches: {len(name_map)} / {len(um_buildings)}")
    return name_map, objnum_map


def extract_vhes(buildings, services):
    """Generate VHEs for all 879 buildings.

    Strategy:
    - For the ~5 buildings that match between usage_monitor and real_estate,
      use REAL apartment data (addresses, contracts) from usage_monitor_apartment.
    - For the remaining ~874 buildings, generate SYNTHETIC VHEs using the
      building's vhe_count with derived addresses.
    """
    print("Extracting VHEs...")

    name_map, objnum_map = _build_um_to_complex_map(buildings)

    # ── Real apartments (from matched buildings) ──
    apts = query("""
        SELECT a.*, b.name as building_name, a.building_id as um_bld_id
        FROM usage_monitor_apartment a
        JOIN usage_monitor_building b ON a.building_id = CAST(b.object_number AS INTEGER)
        ORDER BY a.id
    """)

    contracts = query("""
        SELECT * FROM usage_monitor_rentalcontract
        ORDER BY apartment_id, rental_start DESC
    """)
    contract_by_apt = defaultdict(list)
    for c in contracts:
        contract_by_apt[c["apartment_id"]].append(c)

    vhes = []
    real_apt_building_ids = set()  # complex IDs that got real apartments
    apt_id_remap = {}  # old VHE-{apt_id} → new id (for cost attribution)

    for a in apts:
        complex_id = objnum_map.get(a["um_bld_id"])
        if not complex_id:
            continue  # skip apartments from unmatched buildings

        real_apt_building_ids.add(complex_id)

        street = a.get("street") or ""
        number = a.get("number") or ""
        addition = a.get("addition") or ""
        address = f"{street} {number}{addition}".strip()

        apt_contracts = contract_by_apt.get(a["id"], [])
        contract = None
        if apt_contracts:
            c = apt_contracts[0]
            contract = {
                "id": f"CTR-{c['id']}",
                "status": "active" if not c.get("rental_end") else "ended",
                "startDate": c.get("rental_start"),
                "endDate": c.get("rental_end"),
            }

        vhe_id = f"VHE-{complex_id}-{a['id']}"
        apt_id_remap[f"VHE-{a['id']}"] = vhe_id

        vhes.append({
            "id": vhe_id,
            "buildingId": complex_id,
            "address": address,
            "unit": str(a.get("number", "")),
            "type": "apartment",
            "floor": None,
            "m2": None,
            "contract": contract,
            "voorschot": 0,
            "status": "active" if contract else "vacant",
            "voorschotBreakdown": [],
        })

    real_count = len(vhes)
    print(f"  → {real_count} real VHEs from {len(real_apt_building_ids)} matched buildings")

    # ── Synthetic VHEs (for remaining buildings) ──
    random.seed(123)
    synth_count = 0
    for b in buildings:
        if b["id"] in real_apt_building_ids:
            continue  # already have real data
        vhe_count = b.get("vhe") or 0
        if vhe_count <= 0:
            continue

        # Generate synthetic apartments using building name for address base
        base_name = b["complex"]
        for i in range(1, vhe_count + 1):
            vhe_id = f"VHE-{b['id']}-S{i}"
            address = f"{base_name} {i}"

            # ~85% occupied
            has_contract = random.random() < 0.85
            contract = None
            if has_contract:
                start_year = random.choice([2018, 2019, 2020, 2021, 2022, 2023])
                contract = {
                    "id": f"CTR-S-{b['id']}-{i}",
                    "status": "active",
                    "startDate": f"{start_year}-{random.randint(1,12):02d}-01",
                    "endDate": None,
                }

            vhes.append({
                "id": vhe_id,
                "buildingId": b["id"],
                "address": address,
                "unit": str(i),
                "type": "apartment",
                "floor": None,
                "m2": None,
                "contract": contract,
                "voorschot": 0,
                "status": "active" if has_contract else "vacant",
                "voorschotBreakdown": [],
            })
            synth_count += 1

    print(f"  → {synth_count} synthetic VHEs for {len(buildings) - len(real_apt_building_ids)} remaining buildings")
    print(f"  → {len(vhes)} total VHEs")
    return vhes, apt_id_remap


def extract_meters(buildings, apt_id_remap, heating_seasons):
    """Extract meters from usage_monitor_meterstatus, deduplicated by serial number.

    The DB stores one meterstatus row per meter per heating season. A physical
    meter with serial '00003446693MGNLD01' will appear 3-4 times (once per
    season). We deduplicate to one record per physical meter, keeping the
    latest season's data, matching how Portaal structures its meters.

    Also populates `readings` dict from costAttribution data, keyed by year.
    """
    print("Extracting meters...")

    _, objnum_map = _build_um_to_complex_map(buildings)

    # Build heatingseason lookup for seasonId enrichment
    hs_by_id = {hs["id"]: hs for hs in heating_seasons}

    rows = query("""
        SELECT ms.*, a.building_id as um_bld_id, a.id as apartment_db_id,
               hs.season_start, hs.season_end
        FROM usage_monitor_meterstatus ms
        LEFT JOIN usage_monitor_apartment a ON ms.apartment_id = a.id
        LEFT JOIN usage_monitor_heatingseason hs ON ms.heating_season_id = hs.id
        ORDER BY ms.serial_number, hs.season_start DESC
    """)

    # ── Pre-load cost attribution per (apartment_id, heating_season_id) ──
    ca_rows = query("""
        SELECT apartment_id, heating_season_id,
               ytd_variable_cost, ytd_total_cost, end_total_cost
        FROM usage_monitor_costattributionperiod
    """)
    ca_lookup = {}  # (apt_id, hs_id) → cost record
    for cr in ca_rows:
        ca_lookup[(cr["apartment_id"], cr["heating_season_id"])] = cr

    # ── Pre-load unit prices per heating_season_id ──
    hs_prices = {}  # hs_id → (price, unit)
    for hs in heating_seasons:
        # Find the first non-null price in the heatingseason
        for price_field, unit in [
            ("gjPrice", "GJ"), ("m3Price", "m³"),
            ("coldWaterM3Price", "m³"), ("warmWaterM3Price", "m³"),
            ("electricityPrice", "kWh"),
        ]:
            val = hs.get(price_field)
            if val and val > 0:
                hs_prices[hs["id"]] = (val, unit)
                break

    # ── Pre-load meter counts per (apartment_id, heating_season_id, meter_type) ──
    mc_rows = query("""
        SELECT apartment_id, heating_season_id, meter_type, COUNT(*) as cnt
        FROM usage_monitor_meterstatus
        GROUP BY apartment_id, heating_season_id, meter_type
    """)
    meter_counts = {}  # (apt_id, hs_id, meter_type) → count
    for mc in mc_rows:
        meter_counts[(mc["apartment_id"], mc["heating_season_id"], mc["meter_type"])] = mc["cnt"]

    # ── Collect ALL season rows per serial, keep latest as primary ──
    serial_rows = defaultdict(list)  # serial → [(row, bld_id), ...]
    skipped_orphan = 0
    skipped_unmatched = 0

    for r in rows:
        um_bld_id = r.get("um_bld_id")
        if not um_bld_id:
            skipped_orphan += 1
            continue

        bld_id = objnum_map.get(um_bld_id)
        if not bld_id:
            skipped_unmatched += 1
            continue

        serial = r.get("serial_number") or f"M-{r['id']}"
        serial_rows[serial].append((r, bld_id))

    # ── Build meter records with readings ──
    meters = []
    meters_with_readings = 0
    readings_populated = 0

    for serial, row_list in serial_rows.items():
        # First entry is latest season (rows ordered by season_start DESC)
        r, bld_id = row_list[0]

        meter_type = r.get("meter_type", "O")
        utility = METER_TYPE_MAP.get(meter_type, "other")

        # Remap VHE ID
        old_vhe = f"VHE-{r['apartment_db_id']}" if r["apartment_db_id"] else None
        vhe_id = apt_id_remap.get(old_vhe) if old_vhe else None
        is_sub = vhe_id is not None

        # Determine status from dismounted_date
        dismounted = bool(r.get("dismounted_date"))
        status = "dismounted" if dismounted else "active"
        if not dismounted and r.get("data_integrity_status", 1) >= 3:
            status = "error"

        # Season enrichment (from latest season)
        hs_id = r.get("heating_season_id")
        hs = hs_by_id.get(hs_id)
        season_id = hs_id if hs else None
        year_key = hs.get("yearKey") if hs else None
        year_label = hs.get("yearLabel") if hs else None

        # ── Build readings from ALL seasons ──
        readings = {}
        for (sr, _) in row_list:
            sr_hs_id = sr.get("heating_season_id")
            sr_apt_id = sr.get("apartment_db_id")
            sr_season_start = sr.get("season_start")
            sr_mtype = sr.get("meter_type", "O")

            if not sr_hs_id or not sr_apt_id or not sr_season_start:
                continue

            yr = int(sr_season_start[:4])

            # Get cost attribution for this VHE + season
            ca = ca_lookup.get((sr_apt_id, sr_hs_id))
            if not ca:
                continue

            var_cost = ca.get("ytd_variable_cost")
            total_cost = ca.get("ytd_total_cost")
            end_cost = ca.get("end_total_cost")

            # Use the best available cost figure
            cost = var_cost if var_cost is not None else total_cost
            if cost is None or cost == 0:
                # Try end_total_cost as fallback
                cost = end_cost
            if cost is None:
                continue

            # Divide cost among meters of same type for this VHE in this season
            n_meters = meter_counts.get((sr_apt_id, sr_hs_id, sr_mtype), 1)
            per_meter_cost = cost / max(n_meters, 1)

            # Try to derive consumption from unit price
            price_info = hs_prices.get(sr_hs_id)
            consumption = None
            if price_info:
                unit_price, _ = price_info
                if unit_price > 0:
                    consumption = round(per_meter_cost / unit_price, 2)

            # If no unit price available, use cost as a proxy for consumption display
            if consumption is None:
                consumption = round(per_meter_cost, 2)

            reading_date = sr.get("latest_date") or sr_season_start

            readings[yr] = {
                "start": 0,
                "end": consumption,
                "consumption": consumption,
                "cost": round(per_meter_cost, 2),
                "readingDate": reading_date,
            }
            readings_populated += 1

        if readings:
            meters_with_readings += 1

        meters.append({
            "id": f"MTR-{r['id']}",
            "buildingId": bld_id,
            "vheId": vhe_id,
            "type": "sub" if is_sub else "main",
            "utility": utility,
            "meterType": meter_type,
            "meterNumber": serial,
            "ean": None,
            "unit": {"heat": "GJ", "water": "m³", "warmWater": "m³", "electricity": "kWh", "gas": "m³"}.get(utility, ""),
            "readings": readings,
            "status": status,
            "dismounted": dismounted,
            "dismountedDate": r.get("dismounted_date"),
            "provider": r.get("provider") or "",
            "proportion": r.get("proportion"),
            "latestDate": r.get("latest_date"),
            "seasonId": season_id,
            "yearKey": year_key,
            "yearLabel": year_label,
            "vendorId": r.get("vendor_id"),
        })

    print(f"  → {len(meters)} unique physical meters (from {len(rows)} meterstatus rows)")
    print(f"  → {meters_with_readings} meters have readings, {readings_populated} total reading entries")
    if skipped_orphan:
        print(f"    Skipped {skipped_orphan} orphaned rows (no apartment)")
    if skipped_unmatched:
        print(f"    Skipped {skipped_unmatched} rows from unmatched buildings")
    return meters


def generate_synthetic_meters(buildings, real_meters, vhes):
    """Generate synthetic meters for buildings that have utilities but no real meters."""
    print("Generating synthetic meters...")

    random.seed(456)
    blds_with_meters = set(m["buildingId"] for m in real_meters)
    vhes_by_building = defaultdict(list)
    for v in vhes:
        vhes_by_building[v["buildingId"]].append(v)

    synth = []
    mid = 900000  # start synthetic IDs high to avoid collision

    for b in buildings:
        if b["id"] in blds_with_meters:
            continue
        utilities = b.get("utilities", [])
        if not utilities:
            continue

        # 1 main meter per utility
        for util in utilities:
            mid += 1
            unit = {"heat": "GJ", "water": "m³", "warmWater": "m³", "electricity": "kWh", "gas": "m³"}.get(util, "")
            synth.append({
                "id": f"MTR-S{mid}",
                "buildingId": b["id"],
                "vheId": None,
                "type": "main",
                "utility": util,
                "meterNumber": f"M-{b['id']}-{util[:3].upper()}",
                "ean": None,
                "unit": unit,
                "readings": {},
                "status": "active",
                "provider": "",
                "latestDate": None,
            })

        # Sub-meters: ~30% of VHEs get a heat/water submeter
        bld_vhes = vhes_by_building.get(b["id"], [])
        metered_utils = [u for u in utilities if u in ("heat", "water", "warmWater")]
        for vhe in bld_vhes:
            if random.random() > 0.30:
                continue
            for util in metered_utils:
                mid += 1
                unit = {"heat": "GJ", "water": "m³", "warmWater": "m³"}.get(util, "")
                synth.append({
                    "id": f"MTR-S{mid}",
                    "buildingId": b["id"],
                    "vheId": vhe["id"],
                    "type": "sub",
                    "utility": util,
                    "meterNumber": f"SM-{vhe['id'][-6:]}-{util[:3].upper()}",
                    "ean": None,
                    "unit": unit,
                    "readings": {},
                    "status": "active",
                    "provider": "",
                    "latestDate": None,
                })

    print(f"  → {len(synth)} synthetic meters for {len(buildings) - len(blds_with_meters)} buildings")
    return synth


def extract_cost_attribution(apt_id_remap):
    """Extract 27K per-VHE cost records from costattributionperiod."""
    print("Extracting cost attribution...")

    rows = query("""
        SELECT cap.*, a.id as apt_id,
               hs.season_start as hs_start, hs.season_end as hs_end
        FROM usage_monitor_costattributionperiod cap
        JOIN usage_monitor_apartment a ON cap.apartment_id = a.id
        JOIN usage_monitor_heatingseason hs ON cap.heating_season_id = hs.id
        ORDER BY cap.id
    """)

    records = []
    for r in rows:
        old_vhe = f"VHE-{r['apt_id']}"
        vhe_id = apt_id_remap.get(old_vhe)
        if not vhe_id:
            continue  # skip cost records for unmatched apartments

        year = int(r["start_date"][:4]) if r.get("start_date") else None
        records.append({
            "id": f"CA-{r['id']}",
            "vheId": vhe_id,
            "year": year,
            "totalAdvance": r.get("total_advance"),
            "ytdTotalCost": r.get("ytd_total_cost"),
            "ytdVariableCost": r.get("ytd_variable_cost"),
            "ytdBalance": r.get("ytd_balance"),
            "endTotalCost": r.get("end_total_cost"),
            "suggestedAdvance": r.get("suggested_average_advance"),
        })

    print(f"  → {len(records)} cost attribution records (from matched buildings)")
    return records


def extract_heating_seasons(buildings):
    """Extract heating seasons from usage_monitor_heatingseason, mapped to complex IDs."""
    print("Extracting heating seasons...")

    _, objnum_map = _build_um_to_complex_map(buildings)

    rows = query("""
        SELECT hs.*, ub.object_number
        FROM usage_monitor_heatingseason hs
        JOIN usage_monitor_building ub ON hs.building_id = CAST(ub.object_number AS INTEGER)
        ORDER BY hs.id
    """)

    seasons = []
    for r in rows:
        um_bld_id = int(r["object_number"])
        bld_id = objnum_map.get(um_bld_id)
        if not bld_id:
            continue  # skip seasons for unmatched buildings

        start = r.get("season_start") or ""
        end = r.get("season_end") or ""
        start_month = int(start[5:7]) if len(start) >= 7 else 1
        end_month = int(end[5:7]) if len(end) >= 7 else 12
        start_year = int(start[:4]) if len(start) >= 4 else 2024
        end_year = int(end[:4]) if len(end) >= 4 else start_year

        # Build yearLabel like "2024/25" or "2024" for calendar-year seasons
        if start_month == 1 and end_month == 12:
            year_label = str(start_year)
            year_key = start_year
        else:
            year_label = f"{start_year}/{str(end_year)[-2:]}"
            year_key = start_year

        seasons.append({
            "id": r["id"],
            "buildingId": bld_id,
            "seasonStart": start,
            "seasonEnd": end,
            "startMonth": start_month,
            "endMonth": end_month,
            "yearLabel": year_label,
            "yearKey": year_key,
            "gjPrice": r.get("gj_price"),
            "m3Price": r.get("m3_price"),
            "coldWaterM3Price": r.get("cold_water_m3_price"),
            "warmWaterM3Price": r.get("warm_water_m3_price"),
            "ytdTotalCost": r.get("ytd_total_cost"),
            "ytdCostPerApartment": r.get("ytd_cost_per_apartment"),
            "ytdDebtorRisk": r.get("ytd_debtor_risk"),
            "avgAdvance": r.get("average_advance"),
            "endCostPerApartment": r.get("end_cost_per_apartment"),
            "endDebtorRisk": r.get("end_debtor_risk"),
            "tenantExceedingBudget": r.get("ytd_count_tenants_significant_exceeding_budget"),
            "dataIntegrity": r.get("data_integrity_status", 3),
        })

    print(f"  → {len(seasons)} heating seasons (from matched buildings)")
    return seasons


def enrich_energy_building_services(building_services, heating_seasons, buildings):
    """Enrich energy buildingServices with consumption data from heatingSeasons.

    For each energy service (GDG108, GDG102, etc.), find the matching
    heatingseason by building + year overlap and add consumption metrics.
    """
    print("Enriching energy building-services with consumption data...")

    # Index heatingSeasons by (buildingId, yearKey)
    hs_by_bld_year = {}
    for hs in heating_seasons:
        key = (hs["buildingId"], hs["yearKey"])
        hs_by_bld_year[key] = hs

    # Also index by (buildingId, calendar year from seasonStart)
    for hs in heating_seasons:
        if hs.get("seasonStart"):
            cal_year = int(hs["seasonStart"][:4])
            alt_key = (hs["buildingId"], cal_year)
            if alt_key not in hs_by_bld_year:
                hs_by_bld_year[alt_key] = hs

    # Get meter counts per building per season per utility from DB
    meter_counts = _get_meter_counts_by_season()

    enriched = 0
    for bs in building_services:
        svc_code = bs.get("serviceCode", "")
        price_info = ENERGY_SERVICE_PRICE_MAP.get(svc_code)
        if not price_info:
            continue  # not an energy service

        bld_id = bs["buildingId"]
        year = bs["year"]

        # Find matching heatingseason
        hs = hs_by_bld_year.get((bld_id, year))
        if not hs:
            continue  # no heating season for this building/year

        # Get the price for this specific energy type
        price_field = price_info["priceField"]
        unit_price = hs.get(price_field)

        # Get meter count for this utility type in this season
        utility = price_info["utility"]
        season_id = hs["id"]
        m_counts = meter_counts.get(season_id, {})
        relevant_types = UTILITY_METER_TYPES.get(utility, set())
        meter_count = sum(m_counts.get(mt, 0) for mt in relevant_types)

        # Add season linkage
        bs["seasonId"] = season_id
        bs["seasonStart"] = hs.get("seasonStart")
        bs["seasonEnd"] = hs.get("seasonEnd")
        bs["yearLabel"] = hs.get("yearLabel")
        if utility in ("heat", "gas", "water", "warmWater", "electricity"):
            bs["distributionMethod"] = "metered"

        # Add consumption data nested on service
        bs["consumption"] = {
            "utility": utility,
            "unitPrice": unit_price,
            "unit": price_info["unit"],
            "meterCount": meter_count,
            "endCostPerVhe": hs.get("endCostPerApartment"),
            "avgAdvance": hs.get("avgAdvance"),
            "endDebtorRisk": hs.get("endDebtorRisk"),
            "ytdTotalCost": hs.get("ytdTotalCost"),
            "ytdCostPerVhe": hs.get("ytdCostPerApartment"),
            "tenantExceedingBudget": hs.get("tenantExceedingBudget"),
            "dataIntegrity": hs.get("dataIntegrity"),
        }

        enriched += 1

    print(f"  → {enriched} energy building-services enriched with consumption data")
    return building_services


def _get_meter_counts_by_season():
    """Get meter counts grouped by heating_season_id and meter_type."""
    rows = query("""
        SELECT heating_season_id, meter_type, COUNT(*) as cnt
        FROM usage_monitor_meterstatus
        GROUP BY heating_season_id, meter_type
    """)
    result = defaultdict(dict)
    for r in rows:
        result[r["heating_season_id"]][r["meter_type"]] = r["cnt"]
    return result


def enrich_meters_with_season(meters, heating_seasons):
    """Add meterType and seasonId to Rochdale meters based on heatingseason data."""
    print("Enriching meters with meterType and seasonId...")

    # Build a lookup of heating_season_id → our season record
    # We need the original DB heating_season_id, which is hs["id"]
    hs_by_id = {hs["id"]: hs for hs in heating_seasons}

    # Get meter → heating_season_id mapping from DB
    rows = query("""
        SELECT ms.id, ms.heating_season_id, ms.meter_type
        FROM usage_monitor_meterstatus ms
    """)
    db_meter_info = {}
    for r in rows:
        db_meter_info[r["id"]] = {
            "heating_season_id": r["heating_season_id"],
            "meter_type": r["meter_type"],
        }

    enriched = 0
    for m in meters:
        # Extract original DB ID from "MTR-{id}"
        mid_str = m["id"]
        if mid_str.startswith("MTR-S"):
            continue  # synthetic meter, skip
        try:
            db_id = int(mid_str.replace("MTR-", ""))
        except ValueError:
            continue

        info = db_meter_info.get(db_id)
        if not info:
            continue

        # Add meterType
        m["meterType"] = info["meter_type"]

        # Add seasonId if we have a matching heating season
        hs_id = info["heating_season_id"]
        hs = hs_by_id.get(hs_id)
        if hs:
            m["seasonId"] = hs_id
            m["yearKey"] = hs.get("yearKey")
            m["yearLabel"] = hs.get("yearLabel")
            enriched += 1

    print(f"  → {enriched} meters enriched with seasonId and meterType")
    return meters


# ═══════════════════════════════════════════════════════════════════
# STEP 1b: MOCK DATA GENERATION FOR REAL BUILDINGS
# ═══════════════════════════════════════════════════════════════════

def generate_suppliers():
    """Return mock supplier data (unchanged from mockData.js)."""
    return [
        {"id": "SUP-001", "name": "ENGIE Energie Nederland", "category": "energy", "kvk": "34108453", "city": "Zwolle", "contactPerson": "R. van Dijk", "email": "corporaties@engie.nl", "phone": "+31 88 895 0000", "website": "engie.nl", "contractStart": "2022-01-01", "contractEnd": "2025-12-31", "serviceIds": ["SVC-104","SVC-105","SVC-106","SVC-107","SVC-108","SVC-110"], "buildingCount": 21, "annualSpend": 285000, "status": "active", "rating": 4, "notes": {"en": "Main energy supplier.", "nl": "Hoofdleverancier energie."}},
        {"id": "SUP-002", "name": "Oasen", "category": "energy", "kvk": "24289054", "city": "Gouda", "contactPerson": "M. Bakker", "email": "zakelijk@oasen.nl", "phone": "+31 182 59 36 36", "website": "oasen.nl", "contractStart": "2020-01-01", "contractEnd": None, "serviceIds": ["SVC-102"], "buildingCount": 16, "annualSpend": 42000, "status": "active", "rating": 4, "notes": {"en": "Regional water supplier.", "nl": "Regionaal waterbedrijf."}},
        {"id": "SUP-003", "name": "Techem Energy Services BV", "category": "metering", "kvk": "30141780", "city": "Arnhem", "contactPerson": "J. Hendriks", "email": "service@techem.nl", "phone": "+31 26 355 1355", "website": "techem.nl", "contractStart": "2023-07-01", "contractEnd": "2026-06-30", "serviceIds": ["SVC-108","SVC-111"], "buildingCount": 14, "annualSpend": 38500, "status": "active", "rating": 3, "notes": {"en": "Metering services.", "nl": "Meetdiensten."}},
        {"id": "SUP-004", "name": "Joulz Meetbedrijf B.V.", "category": "metering", "kvk": "27258084", "city": "Rotterdam", "contactPerson": "A. Smits", "email": "meetdiensten@joulz.nl", "phone": "+31 88 454 5000", "website": "joulz.nl", "contractStart": "2021-04-01", "contractEnd": "2025-03-31", "serviceIds": ["SVC-108","SVC-111"], "buildingCount": 8, "annualSpend": 22400, "status": "active", "rating": 4, "notes": {"en": "Independent metering company.", "nl": "Onafhankelijk meetbedrijf."}},
        {"id": "SUP-005", "name": "Stedin Netbeheer BV", "category": "energy", "kvk": "24306940", "city": "Rotterdam", "contactPerson": "Klantenservice Zakelijk", "email": "zakelijk@stedin.net", "phone": "+31 88 896 3096", "website": "stedin.net", "contractStart": "2019-01-01", "contractEnd": None, "serviceIds": ["SVC-108"], "buildingCount": 12, "annualSpend": 18600, "status": "active", "rating": 4, "notes": {"en": "Grid operator.", "nl": "Netbeheerder."}},
        {"id": "SUP-006", "name": "Schindler Liften B.V.", "category": "installations", "kvk": "33148680", "city": "'s-Gravenhage", "contactPerson": "P. de Groot", "email": "service.nl@schindler.com", "phone": "+31 70 399 2666", "website": "schindler.nl", "contractStart": "2023-01-01", "contractEnd": "2027-12-31", "serviceIds": ["SVC-132","SVC-133"], "buildingCount": 6, "annualSpend": 31200, "status": "active", "rating": 5, "notes": {"en": "Elevator maintenance.", "nl": "Liftonderhoud."}},
        {"id": "SUP-007", "name": "CSU Cleaning Services", "category": "cleaning", "kvk": "17098383", "city": "Eindhoven", "contactPerson": "K. Meijer", "email": "corporaties@csu.nl", "phone": "+31 40 290 4040", "website": "csu.nl", "contractStart": "2024-01-01", "contractEnd": "2026-12-31", "serviceIds": ["SVC-118","SVC-140"], "buildingCount": 19, "annualSpend": 89000, "status": "active", "rating": 3, "notes": {"en": "Cleaning services.", "nl": "Schoonmaakdiensten."}},
    ]


def generate_supplier_categories():
    return [
        {"id": "energy", "name": {"en": "Energy", "nl": "Energie"}},
        {"id": "water", "name": {"en": "Water", "nl": "Water"}},
        {"id": "facilities", "name": {"en": "Facilities", "nl": "Facilitaire diensten"}},
        {"id": "security", "name": {"en": "Security & Safety", "nl": "Beveiging & Veiligheid"}},
        {"id": "other", "name": {"en": "Other", "nl": "Overig"}},
    ]


def generate_distribution_methods():
    return [
        {"id": "DM-EQ",  "code": "equal",        "name": {"en": "Equal per VHE",            "nl": "Gelijk per VHE"}},
        {"id": "DM-M2",  "code": "m2",            "name": {"en": "Based on m² floor area",   "nl": "Op basis van m² vloeroppervlak"}},
        {"id": "DM-MTR", "code": "metered",       "name": {"en": "Metered consumption",      "nl": "Op basis van meterverbruik"}},
        {"id": "DM-PRO", "code": "proportional",  "name": {"en": "Proportional to voorschot", "nl": "Naar rato van voorschot"}},
    ]


def generate_settlements(buildings, building_services):
    """Generate settlement data for all real buildings × 3 years."""
    print("Generating settlements...")

    random.seed(42)
    settlements = []

    for b in buildings:
        bid = b["id"]
        vhe = b["vhe"] or 10

        for year in [2024, 2025, 2026]:
            # Get total costs for this building-year
            year_bs = [bs for bs in building_services if bs["buildingId"] == bid and bs["year"] == year]
            total_cost = sum(bs["actual"] for bs in year_bs) if year_bs else vhe * 250 * 12
            total_voorschot = round(total_cost * (1.02 + random.random() * 0.06), 2)

            if year == 2024:
                status = "distributed"
                approved = f"2025-{random.randint(1,6):02d}-{random.randint(5,25):02d}"
                distributed = f"2025-{random.randint(2,8):02d}-{random.randint(1,28):02d}"
                net = round(total_voorschot - total_cost, 2)
            elif year == 2025:
                r = random.random()
                if r < 0.25:
                    status = "distributed"
                    approved = f"2026-{random.randint(1,2):02d}-{random.randint(5,25):02d}"
                    distributed = f"2026-{random.randint(1,3):02d}-{random.randint(1,28):02d}"
                elif r < 0.50:
                    status = "approved"
                    approved = f"2026-{random.randint(1,3):02d}-{random.randint(1,28):02d}"
                    distributed = None
                elif r < 0.75:
                    status = "in_review"
                    approved = None
                    distributed = None
                else:
                    status = "monitoring"
                    approved = None
                    distributed = None
                net = round(total_voorschot - total_cost, 2)
            else:
                status = "monitoring"
                approved = None
                distributed = None
                total_cost = None
                net = None

            settlements.append({
                "id": f"STL-{bid}-{year}",
                "buildingId": bid,
                "year": year,
                "status": status,
                "approvedAt": approved,
                "distributedAt": distributed,
                "totalCost": round(total_cost, 2) if total_cost else None,
                "totalVoorschot": round(total_voorschot, 2),
                "netResult": net,
            })

    print(f"  → {len(settlements)} settlement entries")
    return settlements


def generate_settlement_checks(buildings, building_services):
    """Generate a subset of settlement checks."""
    print("Generating settlement checks...")
    random.seed(43)

    checks = []
    # Generate checks for ~10% of building-service combos
    sample_bs = [bs for bs in building_services if bs["year"] in [2024, 2025] and random.random() < 0.10]

    for bs in sample_bs:
        variance = round(-5 + random.random() * 15, 1)
        yoy = round(-3 + random.random() * 16, 1)

        checks.append({
            "id": f"SC-{bs['buildingId']}-{bs['serviceCode']}-{bs['year']}",
            "buildingId": bs["buildingId"],
            "serviceId": bs["serviceId"],
            "year": bs["year"],
            "ledgerComplete": random.random() > 0.15,
            "budgetVariance": variance,
            "budgetApproved": abs(variance) < 8,
            "yoyDeviation": yoy,
            "yoyFlagged": abs(yoy) > 10,
            "consumptionVerified": random.random() > 0.2,
            "status": "approved" if abs(variance) < 5 else ("flagged" if abs(variance) > 8 else "verified"),
        })

    print(f"  → {len(checks)} settlement checks")
    return checks


def generate_cost_categories():
    """Return the 35 cost category definitions (service-level, not building-specific)."""
    # Same as mockData.js — these are universal definitions
    return [
        {"id": "CC-108-01", "serviceId": "SVC-108", "name": {"en": "Gas delivery", "nl": "Gaslevering"}, "supplier": "ENGIE Energie Nederland", "invoiceFrequency": "monthly", "budgetShare": 0.55, "unit": "m³", "unitPrice": 1.45},
        {"id": "CC-108-02", "serviceId": "SVC-108", "name": {"en": "Grid operator costs", "nl": "Netbeheerkosten"}, "supplier": "Stedin Netbeheer BV", "invoiceFrequency": "monthly", "budgetShare": 0.15, "unit": None, "unitPrice": None},
        {"id": "CC-108-03", "serviceId": "SVC-108", "name": {"en": "Metering services", "nl": "Meetdiensten"}, "supplier": "Techem Energy Services BV", "invoiceFrequency": "quarterly", "budgetShare": 0.15, "unit": None, "unitPrice": None},
        {"id": "CC-108-04", "serviceId": "SVC-108", "name": {"en": "Heat transport", "nl": "Transportkosten warmtenet"}, "supplier": "ENGIE Energie Nederland", "invoiceFrequency": "monthly", "budgetShare": 0.15, "unit": None, "unitPrice": None},
        {"id": "CC-102-01", "serviceId": "SVC-102", "name": {"en": "Water supply", "nl": "Waterlevering"}, "supplier": "Oasen", "invoiceFrequency": "monthly", "budgetShare": 0.70, "unit": "m³", "unitPrice": 1.85},
        {"id": "CC-102-02", "serviceId": "SVC-102", "name": {"en": "Standing charge", "nl": "Vastrecht"}, "supplier": "Oasen", "invoiceFrequency": "quarterly", "budgetShare": 0.20, "unit": None, "unitPrice": None},
        {"id": "CC-105-01", "serviceId": "SVC-105", "name": {"en": "Electricity supply", "nl": "Elektralevering"}, "supplier": "ENGIE Energie Nederland", "invoiceFrequency": "monthly", "budgetShare": 0.65, "unit": "kWh", "unitPrice": 0.38},
        {"id": "CC-105-02", "serviceId": "SVC-105", "name": {"en": "Standing charge", "nl": "Vastrecht elektra"}, "supplier": "ENGIE Energie Nederland", "invoiceFrequency": "quarterly", "budgetShare": 0.20, "unit": None, "unitPrice": None},
        {"id": "CC-118-01", "serviceId": "SVC-118", "name": {"en": "Cleaning service", "nl": "Schoonmaakdienst"}, "supplier": "CSU Cleaning Services", "invoiceFrequency": "monthly", "budgetShare": 1.0, "unit": None, "unitPrice": None},
        {"id": "CC-131-01", "serviceId": "SVC-131", "name": {"en": "Caretaker services", "nl": "Huismeesterdiensten"}, "supplier": "SWB Wijkbeheer", "invoiceFrequency": "monthly", "budgetShare": 1.0, "unit": None, "unitPrice": None},
        {"id": "CC-111-01", "serviceId": "SVC-111", "name": {"en": "Meter maintenance", "nl": "Onderhoud meters"}, "supplier": "Techem Energy Services BV", "invoiceFrequency": "quarterly", "budgetShare": 1.0, "unit": None, "unitPrice": None},
        {"id": "CC-132-01", "serviceId": "SVC-132", "name": {"en": "Elevator maintenance", "nl": "Liftonderhoud"}, "supplier": "Schindler Liften B.V.", "invoiceFrequency": "quarterly", "budgetShare": 0.70, "unit": None, "unitPrice": None},
        {"id": "CC-123-01", "serviceId": "SVC-123", "name": {"en": "Landscaping", "nl": "Tuinonderhoud"}, "supplier": "Van Ginkel Groep B.V.", "invoiceFrequency": "monthly", "budgetShare": 0.80, "unit": None, "unitPrice": None},
    ]


def generate_ledger_entries(buildings, building_services, services):
    """Generate ledger entries for real buildings."""
    print("Generating ledger entries...")

    random.seed(44)

    # Build lookup maps
    bld_lookup = {b["id"]: b for b in buildings}
    svc_code_lookup = {s["id"]: s["code"] for s in services}

    descriptions = {
        "SVC-108": ["Maandnota warmtelevering", "Vastrecht warmte", "Nacalculatie warmteverbruik", "Meetdiensten warmte"],
        "SVC-102": ["Maandnota waterlevering", "Vastrecht drinkwater", "Rioolheffing gemeenschappelijk"],
        "SVC-105": ["Maandnota elektra algemeen", "Vastrecht elektra", "Verbruik trappenhuisverlichting"],
        "SVC-118": ["Schoonmaak algemene ruimten", "Schoonmaak trappenhuis"],
        "SVC-131": ["Huismeesterdiensten", "Kleine reparaties"],
    }
    default_descs = ["Maandbedrag"]

    supplier_map = {
        "SVC-108": "ENGIE Energie Nederland", "SVC-102": "Oasen",
        "SVC-105": "ENGIE Energie Nederland", "SVC-118": "CSU Cleaning Services",
        "SVC-131": "SWB Wijkbeheer", "SVC-111": "Techem Energy Services BV",
    }

    entries = []
    idx = 1

    # Group building_services by (buildingId, serviceId, year)
    bs_groups = defaultdict(list)
    for bs in building_services:
        bs_groups[(bs["buildingId"], bs["serviceId"], bs["year"])].append(bs)

    for (bid, sid, year), bss in bs_groups.items():
        bld = bld_lookup.get(bid)
        if not bld:
            continue

        vhe = bld["vhe"] or 10
        total_actual = sum(bs["actual"] for bs in bss)
        monthly_avg = total_actual / 12 if total_actual else vhe * 20

        descs = descriptions.get(sid, default_descs)
        supplier = supplier_map.get(sid, "")
        code = svc_code_lookup.get(sid, "")

        months = range(1, 13) if year <= 2025 else range(1, 4)

        for month in months:
            desc = descs[(month - 1) % len(descs)]
            variance = 0.85 + random.random() * 0.3
            amount = round(monthly_avg * variance, 2)
            day = min(28, 5 + random.randint(0, 20))
            date_str = f"{year}-{month:02d}-{day:02d}"

            status = "booked"
            if year == 2025 and month >= 11:
                r = random.random()
                if r < 0.15: status = "flagged"
                elif r < 0.30: status = "pending"
            elif year == 2026:
                r = random.random()
                if r < 0.10: status = "flagged"
                elif r < 0.20: status = "pending"

            flag = None
            if status == "flagged":
                flags = [
                    {"en": "Amount deviates >20% from budget", "nl": "Bedrag wijkt >20% af van budget"},
                    {"en": "Duplicate invoice suspected", "nl": "Mogelijk dubbele factuur"},
                ]
                flag = random.choice(flags)

            entries.append({
                "id": f"LED-{idx:05d}",
                "serviceId": sid,
                "buildingId": bid,
                "costCategoryId": None,
                "year": year,
                "month": month,
                "date": date_str,
                "description": desc,
                "supplier": supplier,
                "invoiceRef": f"INV-{month:02d}{idx:04d}",
                "amount": amount,
                "status": status,
                "flag": flag,
            })
            idx += 1

    print(f"  → {len(entries)} ledger entries")
    return entries


def generate_monthly_close(building_services):
    """Generate monthly close statuses for all building×service×year combos."""
    print("Generating monthly close statuses...")

    random.seed(45)
    statuses = []

    for bs in building_services:
        bid = bs["buildingId"]
        sid = bs["serviceId"]
        year = bs["year"]

        for m in range(1, 13):
            if year == 2024:
                status = "closed"
            elif year == 2025:
                if m <= 9:
                    status = "closed"
                elif m == 10:
                    status = "closed" if random.random() < 0.85 else "review"
                elif m == 11:
                    r = random.random()
                    status = "closed" if r < 0.60 else ("review" if r < 0.85 else "open")
                else:
                    r = random.random()
                    status = "closed" if r < 0.35 else ("review" if r < 0.70 else "open")
            else:  # 2026
                if m == 1:
                    status = "closed" if random.random() < 0.80 else "review"
                elif m == 2:
                    r = random.random()
                    status = "closed" if r < 0.30 else ("review" if r < 0.65 else "open")
                else:
                    status = "future"

            statuses.append({
                "buildingId": bid,
                "serviceId": sid,
                "year": year,
                "month": m,
                "status": status,
                "closedAt": f"{year + (1 if m == 12 else 0)}-{((m % 12) + 1):02d}-15" if status == "closed" else None,
                "closedBy": "system" if status == "closed" else None,
            })

    print(f"  → {len(statuses)} monthly close entries")
    return statuses


def generate_distribution_models(buildings, building_services):
    """Generate distribution models for buildings with heat services."""
    print("Generating distribution models...")

    random.seed(46)
    models = []

    # Find buildings that have SVC-108 (heat)
    heat_buildings = set(
        bs["buildingId"] for bs in building_services
        if bs["serviceId"] == "SVC-108" and bs["year"] == 2025
    )

    # Pick ~20 buildings for detailed models
    sample = sorted(heat_buildings)[:20]

    for bid in sample:
        models.append({
            "id": f"DM-{bid}-108",
            "buildingId": bid,
            "serviceId": "SVC-108",
            "provider": random.choice(["Techem Energy Services BV", "ista Nederland B.V."]),
            "formulaVersion": "2024-v2",
            "lastUpdated": "2024-09-01",
            "inputs": [
                {"id": "gas_cost", "label": {"en": "Gas cost", "nl": "Gaskosten"}, "formula": "Gas × UnitPrice + other_costs('Overige kosten in Energiekosten')", "resolvedValue": round(random.uniform(15000, 200000), 0)},
                {"id": "contracts", "label": {"en": "Contracts", "nl": "Contractkosten"}, "formula": "other_costs('Vaste Lasten') + other_costs('Meetdiensten')", "resolvedValue": round(random.uniform(2000, 15000), 0)},
            ],
            "splits": [
                {"source": "gas_cost", "ratio": round(0.28 + random.random() * 0.10, 5), "method": "fixed_pct", "output": "warm_water_cost", "label": {"en": "Warm water", "nl": "Warm water"}},
                {"source": "gas_cost", "ratio": round(0.62 + random.random() * 0.10, 5), "method": "fixed_pct", "output": "heating_cost", "label": {"en": "Heating", "nl": "Verwarming"}},
                {"source": "heating_cost", "ratio": 0.15, "method": "fixed_pct", "output": "heating_fixed", "label": {"en": "Pipe delivery (fixed)", "nl": "Leidingafgifte (vast)"}},
                {"source": "heating_cost", "ratio": 0.85, "method": "fixed_pct", "output": "heating_variable", "label": {"en": "Heating (variable)", "nl": "Verwarming (variabel)"}},
            ],
            "invoiceLines": [
                {"label": {"en": "Heating", "nl": "Verwarming"}, "source": "heating_variable", "distributionKey": "cost_key_nl_eenheden", "keyLabel": {"en": "By consumption units", "nl": "Op basis van eenheden"}},
                {"label": {"en": "Pipe delivery", "nl": "Leidingafgifte"}, "source": "heating_fixed", "distributionKey": "cost_key_ista_label_hasFixed", "keyLabel": {"en": "Per VHE (ista fixed)", "nl": "Per VHE (ista vast)"}},
                {"label": {"en": "Warm water", "nl": "Warm water"}, "source": "warm_water_cost", "distributionKey": "cost_key_ista_label_hasFixed", "keyLabel": {"en": "Per VHE (ista fixed)", "nl": "Per VHE (ista vast)"}},
                {"label": {"en": "Contracts", "nl": "Contractkosten"}, "source": "contracts", "distributionKey": "cost_key_ista_label_hasFixed", "keyLabel": {"en": "Per VHE (ista fixed)", "nl": "Per VHE (ista vast)"}},
            ],
        })

    print(f"  → {len(models)} distribution models")
    return models


def generate_activities(buildings):
    """Generate a handful of recent activities."""
    random.seed(47)
    sample = random.sample(buildings[:50], min(10, len(buildings)))
    types = ["meter_reading", "ledger_entry", "distribution", "alert"]
    descs = {
        "meter_reading": {"en": "Heat meter reading received", "nl": "Warmtemeterstand ontvangen"},
        "ledger_entry": {"en": "Ledger entry posted", "nl": "Boekingsregel verwerkt"},
        "distribution": {"en": "Distribution method updated", "nl": "Verdeelsleutel gewijzigd"},
        "alert": {"en": "Meter reading overdue", "nl": "Meterstand te laat"},
    }
    activities = []
    for i, b in enumerate(sample):
        t = types[i % len(types)]
        activities.append({
            "id": f"ACT-{i+1:03d}",
            "buildingId": b["id"],
            "type": t,
            "date": f"2026-{random.randint(1,3):02d}-{random.randint(1,28):02d}",
            "description": descs[t],
        })
    return activities


def generate_saved_views():
    """Return saved views (unchanged from mock)."""
    return [
        {"id": "view-all-buildings", "objectType": "buildings", "name": {"en": "All Buildings", "nl": "Alle Gebouwen"}, "icon": "list", "isDefault": True, "columns": ["complex", "complexId", "location", "vhe", "components", "utilities", "dataQuality"], "filters": {}, "year": None},
        {"id": "view-settlement-2024", "objectType": "buildings", "name": {"en": "Settlement 2024", "nl": "Afrekening 2024"}, "icon": "fileCheck", "isDefault": False, "columns": ["complex", "location", "vhe", "components", "settlementStatus", "netResult"], "filters": {}, "year": 2024},
        {"id": "view-settlement-2025", "objectType": "buildings", "name": {"en": "Settlement 2025", "nl": "Afrekening 2025"}, "icon": "fileCheck", "isDefault": False, "columns": ["complex", "location", "vhe", "components", "settlementStatus", "netResult"], "filters": {}, "year": 2025},
        {"id": "view-settlement-2026", "objectType": "buildings", "name": {"en": "Settlement 2026", "nl": "Afrekening 2026"}, "icon": "fileCheck", "isDefault": False, "columns": ["complex", "location", "vhe", "components", "settlementStatus", "netResult"], "filters": {}, "year": 2026},
        {"id": "view-all-units", "objectType": "vhe", "name": {"en": "All Units", "nl": "Alle Eenheden"}, "icon": "list", "isDefault": True, "columns": [], "filters": {}, "year": None},
        {"id": "view-all-services", "objectType": "services", "name": {"en": "All Services", "nl": "Alle Diensten"}, "icon": "list", "isDefault": True, "columns": [], "filters": {}, "year": None},
        {"id": "view-all-suppliers", "objectType": "suppliers", "name": {"en": "All Suppliers", "nl": "Alle Leveranciers"}, "icon": "list", "isDefault": True, "columns": [], "filters": {}, "year": None},
        {"id": "view-all-meters", "objectType": "meters", "name": {"en": "All Meters", "nl": "Alle Meters"}, "icon": "list", "isDefault": True, "columns": [], "filters": {}, "year": None},
    ]


def generate_module_config():
    return {
        "mode": "full",
        "hasLedgerData": True,
        "hasConsumptionData": True,
        "hasNonUtilityServices": True,
    }


# ═══════════════════════════════════════════════════════════════════
# STEP 1c: FIELD SOURCE METADATA
# ═══════════════════════════════════════════════════════════════════

def generate_field_sources():
    """Generate JS module mapping (entity, field) → source type."""
    return """// Auto-generated by convert_db.py — DO NOT EDIT
// Maps (entityType, fieldName) → "real" | "mock" | "derived"

export const FIELD_SOURCES = {
  building: {
    id: "real", complex: "real", complexId: "real", location: "real",
    vhe: "real", components: "derived", utilities: "derived",
    budgetTotal: "derived", budgetSpent: "derived", dataQuality: "derived",
  },
  service: {
    id: "derived", code: "real", "name.nl": "real", "name.en": "mock",
    "description.en": "mock", "description.nl": "mock",
    category: "real", regulation: "mock", variable: "mock", metered: "mock",
    buildingCount: "derived", avgCostPerVhe: "derived", status: "real",
  },
  buildingService: {
    buildingId: "real", serviceId: "real", year: "real",
    budget: "derived", actual: "real", completeness: "real",
    distributionMethod: "mock",
  },
  vhe: {
    id: "real", buildingId: "real", address: "real", unit: "real",
    type: "real", floor: "mock", m2: "mock",
    contract: "real", voorschot: "derived", voorschotBreakdown: "derived",
  },
  meter: {
    id: "real", buildingId: "real", vheId: "real", type: "real",
    utility: "real", meterNumber: "real", readings: "mock",
    status: "real", provider: "real",
  },
  costAttribution: {
    vheId: "real", year: "real", totalAdvance: "real",
    ytdTotalCost: "real", ytdVariableCost: "real",
    ytdBalance: "real", endTotalCost: "real", suggestedAdvance: "real",
  },
  supplier: { _entity: "mock" },
  settlement: { _entity: "mock" },
  settlementCheck: { _entity: "mock" },
  ledgerEntry: { _entity: "mock" },
  costCategory: { _entity: "mock" },
  distributionModel: { _entity: "mock" },
  monthlyClose: { _entity: "mock" },
  activity: { _entity: "mock" },
  savedView: { _entity: "mock" },
};

export function getFieldSource(entityType, fieldName) {
  const entity = FIELD_SOURCES[entityType];
  if (!entity) return "unknown";
  if (entity._entity) return entity._entity;
  return entity[fieldName] || "unknown";
}

export function getEntitySource(entityType) {
  const entity = FIELD_SOURCES[entityType];
  if (!entity) return "unknown";
  if (entity._entity) return entity._entity;
  // If entity has any "real" fields, it's primarily real
  const values = Object.values(entity);
  if (values.includes("real")) return "real";
  if (values.includes("derived")) return "derived";
  return "mock";
}

export default FIELD_SOURCES;
"""


# ═══════════════════════════════════════════════════════════════════
# MAIN — Run everything and write JSON
# ═══════════════════════════════════════════════════════════════════

def write_json(filename, data):
    path = DATA_DIR / filename
    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False, default=str)
    size = path.stat().st_size
    print(f"  Wrote {filename} ({size:,} bytes)")


def main():
    print("=" * 60)
    print("homii v3 — SQLite → JSON Conversion")
    print("=" * 60)

    # Step 1a: Real data
    buildings = extract_buildings()
    services = extract_services()
    service_categories = extract_service_categories()
    building_services = extract_building_services(buildings, services)
    vhes, apt_id_remap = extract_vhes(buildings, services)
    cost_attribution = extract_cost_attribution(apt_id_remap)
    heating_seasons = extract_heating_seasons(buildings)

    # Extract meters (deduplicated by serial, enriched with season data)
    real_meters = extract_meters(buildings, apt_id_remap, heating_seasons)
    synth_meters = generate_synthetic_meters(buildings, real_meters, vhes)
    meters = real_meters + synth_meters
    print(f"  → {len(meters)} total meters")

    # Enrich energy building-services with consumption data from heatingSeasons
    building_services = enrich_energy_building_services(building_services, heating_seasons, buildings)

    # Enrich VHEs with voorschotBreakdown from building-services
    print("Enriching VHEs with voorschot breakdown...")
    bld_map = {b["id"]: b for b in buildings}
    bs_by_building = defaultdict(list)
    for bs in building_services:
        bs_by_building[bs["buildingId"]].append(bs)

    svc_map = {s["id"]: s for s in services}
    for vhe in vhes:
        bld = bld_map.get(vhe["buildingId"])
        if not bld:
            continue
        vhe_count = bld.get("vhe") or 1
        bld_svcs = bs_by_building.get(vhe["buildingId"], [])
        # Use the most recent year's services
        years = set(bs["year"] for bs in bld_svcs)
        latest_year = max(years) if years else 2025
        latest_svcs = [bs for bs in bld_svcs if bs["year"] == latest_year]

        breakdown = []
        total_voorschot = 0
        for bs in latest_svcs:
            per_vhe = round((bs.get("actual") or 0) / vhe_count, 2)
            total_voorschot += per_vhe
            breakdown.append({
                "s": bs["serviceId"],   # compact: serviceId
                "a": per_vhe,           # compact: amount
            })

        vhe["voorschotBreakdown"] = breakdown
        vhe["voorschot"] = round(total_voorschot, 2)

    print(f"  → enriched {sum(1 for v in vhes if v['voorschotBreakdown'])} VHEs with cost data")

    # Step 1b: Mock data for real buildings
    suppliers = generate_suppliers()
    supplier_categories = generate_supplier_categories()
    distribution_methods = generate_distribution_methods()
    settlements = generate_settlements(buildings, building_services)
    settlement_checks = generate_settlement_checks(buildings, building_services)
    cost_categories = generate_cost_categories()
    ledger_entries = generate_ledger_entries(buildings, building_services, services)
    monthly_close = generate_monthly_close(building_services)
    distribution_models = generate_distribution_models(buildings, building_services)
    activities = generate_activities(buildings)
    saved_views = generate_saved_views()
    module_config = generate_module_config()

    # Write everything
    print("\nWriting JSON files...")
    write_json("buildings.json", buildings)
    write_json("services.json", services)
    write_json("serviceCategories.json", service_categories)
    write_json("buildingServices.json", building_services)
    write_json("vhes.json", vhes)
    write_json("meters.json", meters)
    write_json("costAttribution.json", cost_attribution)
    write_json("heatingSeasons.json", heating_seasons)
    write_json("suppliers.json", suppliers)
    write_json("supplierCategories.json", supplier_categories)
    write_json("distributionMethods.json", distribution_methods)
    write_json("settlements.json", settlements)
    write_json("settlementChecks.json", settlement_checks)
    write_json("costCategories.json", cost_categories)
    write_json("ledgerEntries.json", ledger_entries)
    write_json("monthlyCloseStatuses.json", monthly_close)
    write_json("distributionModels.json", distribution_models)
    write_json("activities.json", activities)
    write_json("savedViews.json", saved_views)
    write_json("moduleConfig.json", module_config)

    # Step 1c: Field sources (JS module)
    fs_path = DATA_DIR / "_fieldSources.js"
    with open(fs_path, "w") as f:
        f.write(generate_field_sources())
    print(f"  Wrote _fieldSources.js ({fs_path.stat().st_size:,} bytes)")

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"  Buildings:        {len(buildings)}")
    print(f"  Services:         {len(services)}")
    print(f"  Building-Services:{len(building_services)}")
    print(f"  VHEs:             {len(vhes)}")
    print(f"  Meters:           {len(meters)}")
    print(f"  Cost Attribution: {len(cost_attribution)}")
    print(f"  Heating Seasons:  {len(heating_seasons)}")
    print(f"  Settlements:      {len(settlements)}")
    print(f"  Ledger Entries:   {len(ledger_entries)}")
    print(f"  Monthly Close:    {len(monthly_close)}")
    print(f"  Dist. Models:     {len(distribution_models)}")
    print(f"\nAll files written to: {DATA_DIR}")
    print("Done!")

    conn.close()


if __name__ == "__main__":
    main()
