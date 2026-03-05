// Mock data based on real building data from admin.homii.app
// Budget calculation: ~€250 per component per year per VHE
// Budget progress: budgeted amount vs spent-to-date (March = ~20% through year)

export const buildings = [
  {
    id: "BLD-001",
    complex: "B. Toren Havend.",
    complexId: "GRC-2401",
    location: "Gorinchem",
    vhe: 26,
    components: 8,
    utilities: ["heat", "water", "electricity"],
    budgetTotal: 52000,
    budgetSpent: 11440,
    dataQuality: "good",
  },
  {
    id: "BLD-002",
    complex: "De Bogerd Flats",
    complexId: "GRC-2402",
    location: "Gorinchem",
    vhe: 86,
    components: 11,
    utilities: ["heat", "water", "warmWater", "electricity"],
    budgetTotal: 236500,
    budgetSpent: 49665,
    dataQuality: "good",
  },
  {
    id: "BLD-003",
    complex: "De Korenbloem",
    complexId: "GRC-2403",
    location: "Gorinchem",
    vhe: 33,
    components: 7,
    utilities: ["heat", "water", "electricity"],
    budgetTotal: 57750,
    budgetSpent: 13860,
    dataQuality: "good",
  },
  {
    id: "BLD-004",
    complex: "De Lindeborg",
    complexId: "GRC-2404",
    location: "Gorinchem",
    vhe: 144,
    components: 12,
    utilities: ["heat", "water", "warmWater", "electricity"],
    budgetTotal: 432000,
    budgetSpent: 82080,
    dataQuality: "good",
  },
  {
    id: "BLD-005",
    complex: "De Vicaris",
    complexId: "GRC-2405",
    location: "Gorinchem",
    vhe: 16,
    components: 6,
    utilities: ["heat", "water"],
    budgetTotal: 24000,
    budgetSpent: 5520,
    dataQuality: "good",
  },
  {
    id: "BLD-006",
    complex: "Kennelweg 31-98",
    complexId: "GRC-2406",
    location: "Gorinchem",
    vhe: 30,
    components: 9,
    utilities: ["heat", "water", "warmWater", "electricity"],
    budgetTotal: 67500,
    budgetSpent: 14175,
    dataQuality: "good",
  },
  {
    id: "BLD-007",
    complex: "Kloostergang",
    complexId: "GRC-2407",
    location: "Gorinchem",
    vhe: 44,
    components: 10,
    utilities: ["heat", "water", "warmWater", "electricity"],
    budgetTotal: 110000,
    budgetSpent: 25300,
    dataQuality: "good",
  },
  {
    id: "BLD-008",
    complex: "Kop van de IJsbaan",
    complexId: "GRC-2408",
    location: "Gorinchem",
    vhe: 65,
    components: 13,
    utilities: ["heat", "water", "warmWater", "electricity"],
    budgetTotal: 211250,
    budgetSpent: 48588,
    dataQuality: "good",
  },
  {
    id: "BLD-009",
    complex: "Munterflat",
    complexId: "GRC-2409",
    location: "Gorinchem",
    vhe: 96,
    components: 14,
    utilities: ["heat", "water", "warmWater", "electricity"],
    budgetTotal: 336000,
    budgetSpent: 77280,
    dataQuality: "good",
  },
  {
    id: "BLD-010",
    complex: "Schelluinsevliet A",
    complexId: "GRC-2410",
    location: "Gorinchem",
    vhe: 9,
    components: 5,
    utilities: ["heat", "water"],
    budgetTotal: 11250,
    budgetSpent: 2588,
    dataQuality: "good",
  },
  {
    id: "BLD-011",
    complex: "Schelluinsevliet B",
    complexId: "GRC-2411",
    location: "Gorinchem",
    vhe: 40,
    components: 9,
    utilities: ["heat", "water", "warmWater"],
    budgetTotal: 90000,
    budgetSpent: 19800,
    dataQuality: "good",
  },
  {
    id: "BLD-012",
    complex: "Tichelaarflat",
    complexId: "GRC-2412",
    location: "Gorinchem",
    vhe: 90,
    components: 12,
    utilities: ["heat", "water", "warmWater", "electricity"],
    budgetTotal: 270000,
    budgetSpent: 64800,
    dataQuality: "good",
  },
  {
    id: "BLD-013",
    complex: "Valkeniersweg 1-59",
    complexId: "GRC-2413",
    location: "Gorinchem",
    vhe: 30,
    components: 8,
    utilities: ["heat", "water", "warmWater", "electricity"],
    budgetTotal: 60000,
    budgetSpent: 12600,
    dataQuality: "good",
  },
  {
    id: "BLD-014",
    complex: "Valkeniersweg 109-155",
    complexId: "GRC-2414",
    location: "Gorinchem",
    vhe: 24,
    components: 7,
    utilities: ["heat", "water", "warmWater"],
    budgetTotal: 42000,
    budgetSpent: 9660,
    dataQuality: "good",
  },
  {
    id: "BLD-015",
    complex: "Valkeniersweg 157-191",
    complexId: "GRC-2415",
    location: "Gorinchem",
    vhe: 18,
    components: 6,
    utilities: ["heat", "water", "electricity"],
    budgetTotal: 27000,
    budgetSpent: 5670,
    dataQuality: "good",
  },
  {
    id: "BLD-016",
    complex: "Valkeniersweg 61-107",
    complexId: "GRC-2416",
    location: "Gorinchem",
    vhe: 24,
    components: 7,
    utilities: ["heat", "water", "warmWater"],
    budgetTotal: 42000,
    budgetSpent: 8820,
    dataQuality: "good",
  },
  {
    id: "BLD-017",
    complex: "VVE Frisoflat",
    complexId: "GRC-2417",
    location: "Gorinchem",
    vhe: 138,
    components: 14,
    utilities: ["heat", "water", "warmWater", "electricity"],
    budgetTotal: 483000,
    budgetSpent: 106260,
    dataQuality: "good",
  },
  {
    id: "BLD-018",
    complex: "Aanl.Won.Clara",
    complexId: "GRC-2418",
    location: "Gorinchem",
    vhe: 10,
    components: 5,
    utilities: ["heat", "water"],
    budgetTotal: 12500,
    budgetSpent: 3375,
    dataQuality: "warning",
  },
  {
    id: "BLD-019",
    complex: "de Blauwe Keizer",
    complexId: "GRC-2419",
    location: "Gorinchem",
    vhe: 25,
    components: 8,
    utilities: ["heat", "water", "warmWater"],
    budgetTotal: 50000,
    budgetSpent: 13500,
    dataQuality: "warning",
  },
  {
    id: "BLD-020",
    complex: "Piazzaflat",
    complexId: "GRC-2420",
    location: "Gorinchem",
    vhe: 135,
    components: 13,
    utilities: ["heat", "water", "warmWater", "electricity"],
    budgetTotal: 438750,
    budgetSpent: 114075,
    dataQuality: "error",
  },
  {
    id: "BLD-021",
    complex: "VVE Boogflat I",
    complexId: "GRC-2421",
    location: "Gorinchem",
    vhe: 71,
    components: 11,
    utilities: ["heat", "water", "warmWater", "electricity"],
    budgetTotal: 195250,
    budgetSpent: 54670,
    dataQuality: "error",
  },
];

// ── Services (Components) ──
// Based on Servicekosten Besluit regulation — component codes from ERP system
// Gathered from ledger pages across all buildings

export const serviceCategories = [
  { id: "energy",    label: { en: "Energy",          nl: "Energie" } },
  { id: "water",     label: { en: "Water",           nl: "Water" } },
  { id: "building",  label: { en: "Building",        nl: "Gebouw" } },
  { id: "exterior",  label: { en: "Exterior",        nl: "Buitenruimte" } },
  { id: "insurance", label: { en: "Insurance",       nl: "Verzekering" } },
];

export const services = [
  {
    id: "SVC-201",
    code: "201",
    name: { en: "Heating Costs", nl: "Stookkosten" },
    description: {
      en: "Central heating supply, gas delivery, metering services, and transport costs for heat distribution",
      nl: "Centrale verwarming, gaslevering, meetdiensten en transportkosten voor warmtedistributie",
    },
    category: "energy",
    regulation: "Servicekosten Besluit Art. 1",
    variable: true,
    metered: true,
    buildingCount: 12,
    suppliers: ["ENGIE Energie Nederland", "Techem Energy Services BV", "Joulz Meetbedrijf B.V.", "Stedin Netbeh BV"],
    avgCostPerVhe: 185,
    status: "active",
  },
  {
    id: "SVC-202",
    code: "202",
    name: { en: "Water", nl: "Water" },
    description: {
      en: "Communal water supply and distribution, including metering for shared consumption",
      nl: "Gemeenschappelijk waterverbruik en distributie, inclusief meetdiensten voor gedeeld verbruik",
    },
    category: "water",
    regulation: "Servicekosten Besluit Art. 1",
    variable: true,
    metered: true,
    buildingCount: 16,
    suppliers: ["Oasen"],
    avgCostPerVhe: 45,
    status: "active",
  },
  {
    id: "SVC-204",
    code: "204",
    name: { en: "Communal Electricity", nl: "Gemeenschappelijke elektra" },
    description: {
      en: "Electricity for shared spaces: hallways, stairwells, elevators, parking garages, and outdoor lighting",
      nl: "Elektriciteit voor gemeenschappelijke ruimten: gangen, trappenhuizen, liften, parkeergarages en buitenverlichting",
    },
    category: "energy",
    regulation: "Servicekosten Besluit Art. 1",
    variable: false,
    metered: true,
    buildingCount: 21,
    suppliers: ["ENGIE Energie Nederland"],
    avgCostPerVhe: 65,
    status: "active",
  },
  {
    id: "SVC-212",
    code: "212",
    name: { en: "Common Interior Costs", nl: "Kosten algemene binnenruimte" },
    description: {
      en: "Maintenance and upkeep of shared interior spaces: lobbies, corridors, laundry rooms, and communal areas",
      nl: "Onderhoud en beheer van gemeenschappelijke binnenruimten: entrees, gangen, wasruimten en gemeenschappelijke ruimten",
    },
    category: "building",
    regulation: "Servicekosten Besluit Art. 1",
    variable: false,
    metered: false,
    buildingCount: 1,
    suppliers: [],
    avgCostPerVhe: 30,
    status: "active",
  },
  {
    id: "SVC-214",
    code: "214",
    name: { en: "Cleaning", nl: "Schoonmaak" },
    description: {
      en: "Regular cleaning of shared spaces: hallways, stairwells, elevators, windows of common areas, and entrance halls",
      nl: "Reguliere schoonmaak van gemeenschappelijke ruimten: gangen, trappenhuizen, liften, ramen van gemeenschappelijke ruimten en entrees",
    },
    category: "building",
    regulation: "Servicekosten Besluit Art. 1",
    variable: false,
    metered: false,
    buildingCount: 19,
    suppliers: [],
    avgCostPerVhe: 55,
    status: "active",
  },
  {
    id: "SVC-215",
    code: "215",
    name: { en: "Window Cleaning", nl: "Glasbewassing" },
    description: {
      en: "Professional exterior window cleaning for building facades and communal glass surfaces",
      nl: "Professionele glasbewassing van gevels en gemeenschappelijke glasoppervlakken",
    },
    category: "building",
    regulation: "Servicekosten Besluit Art. 1",
    variable: false,
    metered: false,
    buildingCount: 1,
    suppliers: [],
    avgCostPerVhe: 25,
    status: "active",
  },
  {
    id: "SVC-216",
    code: "216",
    name: { en: "Caretaker", nl: "Huismeester" },
    description: {
      en: "On-site caretaker services: building supervision, minor repairs, resident assistance, and facility management",
      nl: "Huismeesterdiensten: gebouwbeheer, kleine reparaties, bewonersondersteuning en facilitair beheer",
    },
    category: "building",
    regulation: "Servicekosten Besluit Art. 1",
    variable: false,
    metered: false,
    buildingCount: 1,
    suppliers: [],
    avgCostPerVhe: 120,
    status: "active",
  },
  {
    id: "SVC-217",
    code: "217",
    name: { en: "District Management", nl: "Wijkbeheer" },
    description: {
      en: "Neighbourhood and district management services: communal area supervision, tenant liaison, and area coordination",
      nl: "Wijkbeheer en buurtcoördinatie: toezicht gemeenschappelijke ruimten, bewonerscontact en gebiedscoördinatie",
    },
    category: "exterior",
    regulation: "Servicekosten Besluit Art. 1",
    variable: false,
    metered: false,
    buildingCount: 17,
    suppliers: [],
    avgCostPerVhe: 40,
    status: "active",
  },
  {
    id: "SVC-218",
    code: "218",
    name: { en: "Landscaping", nl: "Groenvoorziening" },
    description: {
      en: "Maintenance of gardens, lawns, hedges, trees, and green areas surrounding the building complex",
      nl: "Onderhoud van tuinen, gazons, hagen, bomen en groenvoorzieningen rondom het gebouwcomplex",
    },
    category: "exterior",
    regulation: "Servicekosten Besluit Art. 1",
    variable: false,
    metered: false,
    buildingCount: 8,
    suppliers: [],
    avgCostPerVhe: 50,
    status: "active",
  },
  {
    id: "SVC-220",
    code: "220",
    name: { en: "Glass Insurance (VvE)", nl: "Glasverzekering VvE" },
    description: {
      en: "Collective glass breakage insurance for the owners' association covering all communal and private glass surfaces",
      nl: "Collectieve glasbrakverzekering voor de VvE, dekkend alle gemeenschappelijke en privé glasoppervlakken",
    },
    category: "insurance",
    regulation: "Servicekosten Besluit Art. 1",
    variable: false,
    metered: false,
    buildingCount: 1,
    suppliers: [],
    avgCostPerVhe: 15,
    status: "active",
  },
  {
    id: "SVC-256",
    code: "256",
    name: { en: "Individual Water", nl: "Water Individueel" },
    description: {
      en: "Individual water metering and billing per housing unit, with separate consumption tracking",
      nl: "Individueel waterverbruik per wooneenheid, met afzonderlijke verbruiksregistratie",
    },
    category: "water",
    regulation: "Servicekosten Besluit Art. 1",
    variable: true,
    metered: true,
    buildingCount: 2,
    suppliers: ["Oasen"],
    avgCostPerVhe: 35,
    status: "active",
  },
];

// ── Distribution Methods (verdeelsleutels) ──
// Standardized methods for cost allocation per Servicekosten Besluit

export const distributionMethods = [
  { id: "DM-EQ",   code: "equal",       name: { en: "Equal per VHE",           nl: "Gelijk per VHE" } },
  { id: "DM-M2",   code: "m2",          name: { en: "Based on m² floor area",  nl: "Op basis van m² vloeroppervlak" } },
  { id: "DM-MTR",  code: "metered",     name: { en: "Metered consumption",     nl: "Op basis van meterverbruik" } },
  { id: "DM-PRS",  code: "persons",     name: { en: "Number of persons",       nl: "Aantal personen" } },
  { id: "DM-PRO",  code: "proportional", name: { en: "Proportional to voorschot", nl: "Naar rato van voorschot" } },
];

// ── Building-Service relationships ──
// Junction entity: each row links a building to a service for a given book year
// with its own distribution method, budget, actuals, and completeness status

export const buildingServices = [
  // Kloostergang (BLD-007) — 6 services
  { id: "BS-007-201", buildingId: "BLD-007", serviceId: "SVC-201", year: 2025, distributionMethod: "metered",  budget: 18700,  actual: 4675,  ledgerEntries: 12, expectedEntries: 12, completeness: 100, status: "complete" },
  { id: "BS-007-204", buildingId: "BLD-007", serviceId: "SVC-204", year: 2025, distributionMethod: "equal",    budget: 6600,   actual: 1650,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },
  { id: "BS-007-214", buildingId: "BLD-007", serviceId: "SVC-214", year: 2025, distributionMethod: "m2",       budget: 5280,   actual: 1320,  ledgerEntries: 3,  expectedEntries: 4,  completeness: 75,  status: "incomplete" },
  { id: "BS-007-202", buildingId: "BLD-007", serviceId: "SVC-202", year: 2025, distributionMethod: "metered",  budget: 3960,   actual: 990,   ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },
  { id: "BS-007-217", buildingId: "BLD-007", serviceId: "SVC-217", year: 2025, distributionMethod: "equal",    budget: 3520,   actual: 880,   ledgerEntries: 2,  expectedEntries: 4,  completeness: 50,  status: "incomplete" },
  { id: "BS-007-218", buildingId: "BLD-007", serviceId: "SVC-218", year: 2025, distributionMethod: "equal",    budget: 4400,   actual: 1100,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },

  // De Bolwerken (BLD-002 placeholder) — 4 services
  { id: "BS-002-204", buildingId: "BLD-002", serviceId: "SVC-204", year: 2025, distributionMethod: "equal",    budget: 12900,  actual: 3225,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },
  { id: "BS-002-214", buildingId: "BLD-002", serviceId: "SVC-214", year: 2025, distributionMethod: "m2",       budget: 10320,  actual: 2580,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },
  { id: "BS-002-217", buildingId: "BLD-002", serviceId: "SVC-217", year: 2025, distributionMethod: "equal",    budget: 6880,   actual: 1720,  ledgerEntries: 3,  expectedEntries: 4,  completeness: 75,  status: "incomplete" },
  { id: "BS-002-218", buildingId: "BLD-002", serviceId: "SVC-218", year: 2025, distributionMethod: "equal",    budget: 8600,   actual: 2150,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },

  // De Lindeborg (BLD-004) — 7 services
  { id: "BS-004-201", buildingId: "BLD-004", serviceId: "SVC-201", year: 2025, distributionMethod: "metered",  budget: 57600,  actual: 14400, ledgerEntries: 12, expectedEntries: 12, completeness: 100, status: "complete" },
  { id: "BS-004-204", buildingId: "BLD-004", serviceId: "SVC-204", year: 2025, distributionMethod: "equal",    budget: 18720,  actual: 4680,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },
  { id: "BS-004-202", buildingId: "BLD-004", serviceId: "SVC-202", year: 2025, distributionMethod: "metered",  budget: 12960,  actual: 3240,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },
  { id: "BS-004-212", buildingId: "BLD-004", serviceId: "SVC-212", year: 2025, distributionMethod: "m2",       budget: 8640,   actual: 2160,  ledgerEntries: 2,  expectedEntries: 4,  completeness: 50,  status: "incomplete" },
  { id: "BS-004-214", buildingId: "BLD-004", serviceId: "SVC-214", year: 2025, distributionMethod: "m2",       budget: 15840,  actual: 3960,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },
  { id: "BS-004-216", buildingId: "BLD-004", serviceId: "SVC-216", year: 2025, distributionMethod: "equal",    budget: 34560,  actual: 8640,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },
  { id: "BS-004-218", buildingId: "BLD-004", serviceId: "SVC-218", year: 2025, distributionMethod: "equal",    budget: 14400,  actual: 3600,  ledgerEntries: 3,  expectedEntries: 4,  completeness: 75,  status: "incomplete" },
];

// ── VHE (Verhuurbare Eenheden / Rental Units) ──

export const vhes = [
  // Kloostergang (BLD-007) — 44 VHE, showing a representative sample
  { id: "VHE-007-001", buildingId: "BLD-007", unit: "1A",  address: "Kloostergang 1A, Gorinchem",  floor: 0, m2: 62, contractHolder: "M. Jansen",     contractStart: "2019-03-01", voorschot: 125, status: "active" },
  { id: "VHE-007-002", buildingId: "BLD-007", unit: "1B",  address: "Kloostergang 1B, Gorinchem",  floor: 0, m2: 58, contractHolder: "P. de Vries",    contractStart: "2021-07-01", voorschot: 118, status: "active" },
  { id: "VHE-007-003", buildingId: "BLD-007", unit: "2A",  address: "Kloostergang 2A, Gorinchem",  floor: 1, m2: 65, contractHolder: "A. Bakker",      contractStart: "2018-01-15", voorschot: 132, status: "active" },
  { id: "VHE-007-004", buildingId: "BLD-007", unit: "2B",  address: "Kloostergang 2B, Gorinchem",  floor: 1, m2: 58, contractHolder: "K. Meijer",      contractStart: "2022-09-01", voorschot: 118, status: "active" },
  { id: "VHE-007-005", buildingId: "BLD-007", unit: "3A",  address: "Kloostergang 3A, Gorinchem",  floor: 2, m2: 62, contractHolder: "R. Hendriks",    contractStart: "2020-04-01", voorschot: 125, status: "active" },
  { id: "VHE-007-006", buildingId: "BLD-007", unit: "3B",  address: "Kloostergang 3B, Gorinchem",  floor: 2, m2: 58, contractHolder: null,             contractStart: null,         voorschot: 0,   status: "vacant" },
  { id: "VHE-007-007", buildingId: "BLD-007", unit: "4A",  address: "Kloostergang 4A, Gorinchem",  floor: 3, m2: 65, contractHolder: "S. van Dam",     contractStart: "2023-01-01", voorschot: 132, status: "active" },
  { id: "VHE-007-008", buildingId: "BLD-007", unit: "4B",  address: "Kloostergang 4B, Gorinchem",  floor: 3, m2: 58, contractHolder: "T. Visser",      contractStart: "2017-11-01", voorschot: 118, status: "active" },

  // De Lindeborg (BLD-004) — sample
  { id: "VHE-004-001", buildingId: "BLD-004", unit: "101", address: "Lindeborg 101, Gorinchem",    floor: 0, m2: 72, contractHolder: "L. Smit",        contractStart: "2020-06-01", voorschot: 155, status: "active" },
  { id: "VHE-004-002", buildingId: "BLD-004", unit: "102", address: "Lindeborg 102, Gorinchem",    floor: 0, m2: 68, contractHolder: "H. van der Berg", contractStart: "2019-02-01", voorschot: 148, status: "active" },
  { id: "VHE-004-003", buildingId: "BLD-004", unit: "103", address: "Lindeborg 103, Gorinchem",    floor: 0, m2: 72, contractHolder: "G. Dijkstra",    contractStart: "2021-10-01", voorschot: 155, status: "active" },
  { id: "VHE-004-004", buildingId: "BLD-004", unit: "201", address: "Lindeborg 201, Gorinchem",    floor: 1, m2: 68, contractHolder: "W. Mulder",      contractStart: "2022-04-01", voorschot: 148, status: "active" },
  { id: "VHE-004-005", buildingId: "BLD-004", unit: "202", address: "Lindeborg 202, Gorinchem",    floor: 1, m2: 72, contractHolder: null,             contractStart: null,         voorschot: 0,   status: "vacant" },
];

// ── Meters ──

export const meters = [
  // Kloostergang (BLD-007) main meters
  { id: "MTR-007-H1",  buildingId: "BLD-007", serviceId: "SVC-201", vheId: null,          type: "main",   utility: "heat",        meterNumber: "HM-20154782", unit: "GJ",  lastReading: 842.5,   readingDate: "2025-02-28", status: "active" },
  { id: "MTR-007-W1",  buildingId: "BLD-007", serviceId: "SVC-202", vheId: null,          type: "main",   utility: "water",       meterNumber: "WM-30298741", unit: "m³",  lastReading: 1256.3,  readingDate: "2025-02-28", status: "active" },
  { id: "MTR-007-E1",  buildingId: "BLD-007", serviceId: "SVC-204", vheId: null,          type: "main",   utility: "electricity", meterNumber: "EM-40187623", unit: "kWh", lastReading: 28450,   readingDate: "2025-02-28", status: "active" },
  // Kloostergang submeters (linked to VHEs)
  { id: "MTR-007-H1A", buildingId: "BLD-007", serviceId: "SVC-201", vheId: "VHE-007-001", type: "sub",    utility: "heat",        meterNumber: "HS-20154782-1A", unit: "GJ",  lastReading: 18.2,  readingDate: "2025-02-28", status: "active" },
  { id: "MTR-007-H1B", buildingId: "BLD-007", serviceId: "SVC-201", vheId: "VHE-007-002", type: "sub",    utility: "heat",        meterNumber: "HS-20154782-1B", unit: "GJ",  lastReading: 21.4,  readingDate: "2025-02-28", status: "active" },
  { id: "MTR-007-H2A", buildingId: "BLD-007", serviceId: "SVC-201", vheId: "VHE-007-003", type: "sub",    utility: "heat",        meterNumber: "HS-20154782-2A", unit: "GJ",  lastReading: 16.8,  readingDate: "2025-02-28", status: "active" },
  { id: "MTR-007-H2B", buildingId: "BLD-007", serviceId: "SVC-201", vheId: "VHE-007-004", type: "sub",    utility: "heat",        meterNumber: "HS-20154782-2B", unit: "GJ",  lastReading: 22.1,  readingDate: "2025-01-31", status: "active" },
  { id: "MTR-007-W1A", buildingId: "BLD-007", serviceId: "SVC-202", vheId: "VHE-007-001", type: "sub",    utility: "water",       meterNumber: "WS-30298741-1A", unit: "m³",  lastReading: 28.7,  readingDate: "2025-02-28", status: "active" },
  { id: "MTR-007-W1B", buildingId: "BLD-007", serviceId: "SVC-202", vheId: "VHE-007-002", type: "sub",    utility: "water",       meterNumber: "WS-30298741-1B", unit: "m³",  lastReading: 32.1,  readingDate: "2025-02-28", status: "active" },

  // De Lindeborg (BLD-004) main meters
  { id: "MTR-004-H1",  buildingId: "BLD-004", serviceId: "SVC-201", vheId: null,          type: "main",   utility: "heat",        meterNumber: "HM-20198432", unit: "GJ",  lastReading: 2810.6,  readingDate: "2025-02-28", status: "active" },
  { id: "MTR-004-W1",  buildingId: "BLD-004", serviceId: "SVC-202", vheId: null,          type: "main",   utility: "water",       meterNumber: "WM-30345612", unit: "m³",  lastReading: 4520.8,  readingDate: "2025-02-28", status: "active" },
  { id: "MTR-004-E1",  buildingId: "BLD-004", serviceId: "SVC-204", vheId: null,          type: "main",   utility: "electricity", meterNumber: "EM-40223198", unit: "kWh", lastReading: 95200,   readingDate: "2025-01-31", status: "warning" },
];

// ── Activity log ──

export const activities = [
  { id: "ACT-001", buildingId: "BLD-007", type: "meter_reading",   date: "2025-02-28", description: { en: "Heat meter reading received: 842.5 GJ",            nl: "Warmtemeterstand ontvangen: 842,5 GJ" } },
  { id: "ACT-002", buildingId: "BLD-007", type: "ledger_entry",    date: "2025-02-15", description: { en: "Ledger entry posted: Cleaning Q1 2025 — €1,320",    nl: "Boekingsregel verwerkt: Schoonmaak Q1 2025 — €1.320" } },
  { id: "ACT-003", buildingId: "BLD-007", type: "distribution",    date: "2025-01-10", description: { en: "Distribution method updated for Cleaning: m² → equal", nl: "Verdeelsleutel gewijzigd voor Schoonmaak: m² → gelijk" } },
  { id: "ACT-004", buildingId: "BLD-007", type: "contract_change", date: "2025-01-01", description: { en: "Unit 3B: Contract ended — now vacant",             nl: "Eenheid 3B: Contract beëindigd — nu leegstaand" } },
  { id: "ACT-005", buildingId: "BLD-007", type: "alert",           date: "2025-02-20", description: { en: "Missing ledger entry: District Management Q4 2024",  nl: "Ontbrekende boeking: Wijkbeheer Q4 2024" } },
  { id: "ACT-006", buildingId: "BLD-004", type: "meter_reading",   date: "2025-02-28", description: { en: "Heat meter reading received: 2,810.6 GJ",          nl: "Warmtemeterstand ontvangen: 2.810,6 GJ" } },
  { id: "ACT-007", buildingId: "BLD-004", type: "alert",           date: "2025-02-18", description: { en: "Electricity meter reading overdue (last: Jan 31)",   nl: "Elektrameterstand te laat (laatste: 31 jan)" } },
];

// ── Getter functions ──

export function getBuilding(id) {
  return buildings.find((b) => b.id === id);
}

export function getBuildingByComplexId(complexId) {
  return buildings.find((b) => b.complexId === complexId);
}

export function getService(id) {
  return services.find((s) => s.id === id);
}

export function getServiceByCode(code) {
  return services.find((s) => s.code === code);
}

export function getBuildingServices(buildingId, year = 2025) {
  return buildingServices.filter((bs) => bs.buildingId === buildingId && bs.year === year);
}

export function getVhesByBuilding(buildingId) {
  return vhes.filter((v) => v.buildingId === buildingId);
}

export function getMetersByBuilding(buildingId) {
  return meters.filter((m) => m.buildingId === buildingId);
}

export function getActivitiesByBuilding(buildingId) {
  return activities.filter((a) => a.buildingId === buildingId).sort((a, b) => b.date.localeCompare(a.date));
}

export function getDistributionMethod(code) {
  return distributionMethods.find((dm) => dm.code === code);
}
