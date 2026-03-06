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
  { id: "energy",       icon: "Zap",        label: { en: "Energy & Water",               nl: "Energie & Water" } },
  { id: "installations",icon: "Wrench",     label: { en: "Installations & Maintenance",  nl: "Installaties & Technisch Beheer" } },
  { id: "cleaning",     icon: "Sparkles",   label: { en: "Cleaning & Exterior",          nl: "Schoonmaak & Buitenruimte" } },
  { id: "management",   icon: "HardHat",    label: { en: "Management & Services",        nl: "Beheer & Woonservices" } },
  { id: "other",        icon: "FolderOpen", label: { en: "Other & Insurance",            nl: "Overig & Verzekeringen" } },
];

export const services = [
  // ═══ ENERGIE & WATER ═══
  {
    id: "SVC-102", code: "GDG102", gdh: "GDH102",
    name: { en: "Cold Water (residential)", nl: "Koud water woonruimte" },
    description: { en: "Cold water supply for residential units, communal and individual metering", nl: "Koud waterlevering voor woonruimten, gemeenschappelijke en individuele meting" },
    category: "energy", regulation: "Servicekosten Besluit Art. 1",
    variable: true, metered: true, buildingCount: 16, suppliers: ["Oasen"], avgCostPerVhe: 45, status: "active",
  },
  {
    id: "SVC-104", code: "GDG104",
    name: { en: "Hot Water (residential)", nl: "Warm water woonruimte" },
    description: { en: "Hot water supply for residential units, typically via central boiler or district heating", nl: "Warm waterlevering voor woonruimten, doorgaans via centrale ketel of stadsverwarming" },
    category: "energy", regulation: "Servicekosten Besluit Art. 1",
    variable: true, metered: true, buildingCount: 8, suppliers: ["ENGIE Energie Nederland"], avgCostPerVhe: 65, status: "active",
  },
  {
    id: "SVC-105", code: "GDG105", gdh: "GDH105",
    name: { en: "Communal Electricity", nl: "Elektrakosten algemeen" },
    description: { en: "Electricity for shared spaces: hallways, stairwells, elevators, parking, and outdoor lighting", nl: "Elektriciteit voor gemeenschappelijke ruimten: gangen, trappenhuizen, liften, parkeergarages en buitenverlichting" },
    category: "energy", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: true, buildingCount: 21, suppliers: ["ENGIE Energie Nederland"], avgCostPerVhe: 65, status: "active",
  },
  {
    id: "SVC-106", code: "GDG106", gdh: "GDG109",
    name: { en: "Electricity (residential)", nl: "Elektra woonruimte" },
    description: { en: "Individual electricity supply and metering for residential units", nl: "Individueel elektriciteitsverbruik en meting voor woonruimten" },
    category: "energy", regulation: "Servicekosten Besluit Art. 1",
    variable: true, metered: true, buildingCount: 2, suppliers: ["ENGIE Energie Nederland"], avgCostPerVhe: 35, status: "active",
  },
  {
    id: "SVC-107", code: "GDG107",
    name: { en: "Gas (communal facilities)", nl: "Levering gas gemeenschappelijke voorzieningen" },
    description: { en: "Gas delivery for communal facilities such as shared kitchens and common area heating", nl: "Gaslevering voor gemeenschappelijke voorzieningen zoals gedeelde keukens en verwarming algemene ruimten" },
    category: "energy", regulation: "Servicekosten Besluit Art. 1",
    variable: true, metered: true, buildingCount: 5, suppliers: ["ENGIE Energie Nederland"], avgCostPerVhe: 40, status: "active",
  },
  {
    id: "SVC-108", code: "GDG108", gdh: "GDH108",
    name: { en: "Heating Costs", nl: "Warmtekosten" },
    description: { en: "Central heating supply, gas delivery, metering services, and transport costs for heat distribution", nl: "Centrale verwarming, gaslevering, meetdiensten en transportkosten voor warmtedistributie" },
    category: "energy", regulation: "Servicekosten Besluit Art. 1",
    variable: true, metered: true, buildingCount: 12, suppliers: ["ENGIE Energie Nederland", "Techem Energy Services BV", "Joulz Meetbedrijf B.V.", "Stedin Netbeh BV"], avgCostPerVhe: 185, status: "active",
  },
  {
    id: "SVC-110", code: "GDG110", gdh: "GDH110",
    name: { en: "Electricity (commercial)", nl: "Elektra BOG" },
    description: { en: "Electricity for commercial spaces (Bedrijfs Onroerend Goed)", nl: "Elektriciteit voor bedrijfsmatig onroerend goed" },
    category: "energy", regulation: "Servicekosten Besluit Art. 1",
    variable: true, metered: true, buildingCount: 3, suppliers: ["ENGIE Energie Nederland"], avgCostPerVhe: 80, status: "active",
  },
  {
    id: "SVC-091", code: "GDH091",
    name: { en: "Solar Panel Credit", nl: "Vergoeding zonnepanelen" },
    description: { en: "Credit for solar panel energy generation, distributed across participating units", nl: "Vergoeding voor opwekking zonnepanelen, verdeeld over deelnemende eenheden" },
    category: "energy", regulation: "Servicekosten Besluit Art. 1",
    variable: true, metered: true, buildingCount: 4, suppliers: [], avgCostPerVhe: -25, status: "active",
  },

  // ═══ INSTALLATIES & TECHNISCH BEHEER ═══
  {
    id: "SVC-111", code: "GDG111", gdh: "GDH111",
    name: { en: "Consumption Meters", nl: "Verbruiksmeters" },
    description: { en: "Maintenance, calibration, and replacement of consumption meters for utilities", nl: "Onderhoud, ijking en vervanging van verbruiksmeters voor nutsvoorzieningen" },
    category: "installations", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 14, suppliers: ["Techem Energy Services BV", "Joulz Meetbedrijf B.V."], avgCostPerVhe: 18, status: "active",
  },
  {
    id: "SVC-115", code: "GDG115", gdh: "GDH115",
    name: { en: "24h Emergency Service (heating)", nl: "24 uur storingsdienst CV" },
    description: { en: "Around-the-clock emergency repair service for central heating system breakdowns", nl: "24-uurs storingsdienst voor storingen aan de centrale verwarmingsinstallatie" },
    category: "installations", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 10, suppliers: [], avgCostPerVhe: 22, status: "active",
  },
  {
    id: "SVC-120", code: "GDG120",
    name: { en: "24h Emergency Service (hydrophore)", nl: "24 uur storingsdienst hydrofoor" },
    description: { en: "Emergency service for hydrophore/water pressure pump system failures", nl: "Storingsdienst voor hydrofoorsysteem en waterdrukverhogingsinstallatie" },
    category: "installations", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 3, suppliers: [], avgCostPerVhe: 12, status: "active",
  },
  {
    id: "SVC-126", code: "GDG126",
    name: { en: "Geyser Cleaning", nl: "Reinigen geisers e.d." },
    description: { en: "Periodic cleaning and maintenance of gas water heaters and geysers", nl: "Periodiek reinigen en onderhoud van gasboilers en geisers" },
    category: "installations", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 2, suppliers: [], avgCostPerVhe: 15, status: "active",
  },
  {
    id: "SVC-127", code: "GDG127",
    name: { en: "Mechanical Ventilation (communal)", nl: "Mechanische ventilatie (collectief)" },
    description: { en: "Maintenance and energy for communal mechanical ventilation systems", nl: "Onderhoud en energie voor collectieve mechanische ventilatiesystemen" },
    category: "installations", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 7, suppliers: [], avgCostPerVhe: 28, status: "active",
  },
  {
    id: "SVC-132", code: "GDG132", gdh: "GDH132",
    name: { en: "24h Emergency Service (elevator)", nl: "24 uur storingsdienst lift" },
    description: { en: "Around-the-clock emergency service for elevator breakdowns and entrapment", nl: "24-uurs storingsdienst voor liftstoringen en insluiting" },
    category: "installations", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 6, suppliers: [], avgCostPerVhe: 35, status: "active",
  },
  {
    id: "SVC-133", code: "GDG133",
    name: { en: "Elevator Electricity", nl: "Elektriciteit lift" },
    description: { en: "Electricity consumption specifically for elevator operation", nl: "Elektriciteitsverbruik specifiek voor liftbediening" },
    category: "installations", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: true, buildingCount: 6, suppliers: [], avgCostPerVhe: 20, status: "active",
  },
  {
    id: "SVC-171", code: "GDG171",
    name: { en: "24h Service Electric Doors", nl: "24 uur service elektrische deuren" },
    description: { en: "Emergency service and maintenance for automatic/electric door systems", nl: "Storingsdienst en onderhoud voor automatische/elektrische deursystemen" },
    category: "installations", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 4, suppliers: [], avgCostPerVhe: 10, status: "active",
  },

  // ═══ SCHOONMAAK & BUITENRUIMTE ═══
  {
    id: "SVC-116", code: "GDG116", gdh: "GDH116",
    name: { en: "Lamp Replacement", nl: "Vervangen lampen" },
    description: { en: "Replacement of lighting in communal areas: hallways, stairwells, parking, and exterior", nl: "Vervanging van verlichting in gemeenschappelijke ruimten: gangen, trappenhuizen, parkeergarage en buitenruimte" },
    category: "cleaning", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 15, suppliers: [], avgCostPerVhe: 8, status: "active",
  },
  {
    id: "SVC-118", code: "GDG118",
    name: { en: "Cleaning Common Areas", nl: "Schoonmaken algemene ruimte" },
    description: { en: "Regular cleaning of shared spaces: hallways, stairwells, elevators, entrance halls", nl: "Reguliere schoonmaak van gemeenschappelijke ruimten: gangen, trappenhuizen, liften, entrees" },
    category: "cleaning", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 19, suppliers: [], avgCostPerVhe: 55, status: "active",
  },
  {
    id: "SVC-122", code: "GDG122", gdh: "GDH122",
    name: { en: "Drain Cleaning", nl: "Ontstoppen riool" },
    description: { en: "Periodic and emergency drain and sewer cleaning for communal systems", nl: "Periodiek en nood-ontstoppen van riool en afvoersystemen voor gemeenschappelijke systemen" },
    category: "cleaning", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 8, suppliers: [], avgCostPerVhe: 12, status: "active",
  },
  {
    id: "SVC-123", code: "GDG123",
    name: { en: "Landscaping", nl: "Tuinonderhoud" },
    description: { en: "Maintenance of gardens, lawns, hedges, trees, and green areas", nl: "Onderhoud van tuinen, gazons, hagen, bomen en groenvoorzieningen" },
    category: "cleaning", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 8, suppliers: [], avgCostPerVhe: 50, status: "active",
  },
  {
    id: "SVC-124", code: "GDG124",
    name: { en: "Gutter Cleaning", nl: "Reinigen dakgoten e.d." },
    description: { en: "Periodic cleaning of gutters, downpipes, and roof drainage systems", nl: "Periodiek reinigen van dakgoten, regenpijpen en dakafwatering" },
    category: "cleaning", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 5, suppliers: [], avgCostPerVhe: 10, status: "active",
  },
  {
    id: "SVC-140", code: "GDG140",
    name: { en: "Window Cleaning", nl: "Glasbewassing" },
    description: { en: "Professional exterior window cleaning for building facades and communal glass surfaces", nl: "Professionele glasbewassing van gevels en gemeenschappelijke glasoppervlakken" },
    category: "cleaning", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 1, suppliers: [], avgCostPerVhe: 25, status: "active",
  },

  // ═══ BEHEER & WOONSERVICES ═══
  {
    id: "SVC-131", code: "GDG131",
    name: { en: "District Management / Caretaker", nl: "Wijkbeheer / Huismeester" },
    description: { en: "On-site caretaker and neighbourhood management: supervision, minor repairs, resident liaison", nl: "Huismeester en wijkbeheer: toezicht, kleine reparaties, bewonerscontact" },
    category: "management", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 17, suppliers: [], avgCostPerVhe: 120, status: "active",
  },
  {
    id: "SVC-137", code: "GDG137",
    name: { en: "Residential Support Services", nl: "Woon ondersteunende diensten" },
    description: { en: "Housing support services for tenants such as social assistance and wellbeing programs", nl: "Woonondersteunende diensten voor huurders zoals sociale begeleiding en welzijnsprogramma's" },
    category: "management", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 3, suppliers: [], avgCostPerVhe: 30, status: "active",
  },
  {
    id: "SVC-142", code: "GDG142",
    name: { en: "Internet Subscription", nl: "Internetabonnement" },
    description: { en: "Communal internet subscription for the building (Huurcommissie max ~€30/month)", nl: "Collectief internetabonnement voor het gebouw (Huurcommissie max ~€30/maand)" },
    category: "management", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 2, suppliers: [], avgCostPerVhe: 25, status: "active",
  },

  // ═══ OVERIG & VERZEKERINGEN ═══
  {
    id: "SVC-036", code: "GDG036",
    name: { en: "Glass Insurance", nl: "Glasverzekering" },
    description: { en: "Collective glass breakage insurance covering all communal and private glass surfaces", nl: "Collectieve glasbrakverzekering, dekkend alle gemeenschappelijke en privé glasoppervlakken" },
    category: "other", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 1, suppliers: [], avgCostPerVhe: 15, status: "active",
  },
  {
    id: "SVC-099", code: "GDG099",
    name: { en: "Miscellaneous", nl: "Diversen" },
    description: { en: "Uncategorised service charges — requires mandatory description (compliance risk)", nl: "Niet-gecategoriseerde servicekosten — verplichte toelichting vereist (compliance risico)" },
    category: "other", regulation: "Servicekosten Besluit Art. 1",
    variable: false, metered: false, buildingCount: 1, suppliers: [], avgCostPerVhe: 10, status: "active",
  },
];

// ── Distribution Methods (verdeelsleutels) ──
// Standardized methods for cost allocation per Servicekosten Besluit

export const distributionMethods = [
  { id: "DM-EQ",   code: "equal",       name: { en: "Equal per VHE",           nl: "Gelijk per VHE" } },
  { id: "DM-M2",   code: "m2",          name: { en: "Based on m² floor area",  nl: "Op basis van m² vloeroppervlak" } },
  { id: "DM-MTR",  code: "metered",     name: { en: "Metered consumption",     nl: "Op basis van meterverbruik" } },
  { id: "DM-PRO",  code: "proportional", name: { en: "Proportional to voorschot", nl: "Naar rato van voorschot" } },
];

// ── Building-Service relationships ──
// Junction entity: each row links a building to a service for a given book year
// with its own distribution method, budget, actuals, and completeness status

export const buildingServices = [
  // Kloostergang (BLD-007) — 6 services
  { id: "BS-007-108", buildingId: "BLD-007", serviceId: "SVC-108", year: 2025, distributionMethod: "metered",  budget: 18700,  actual: 4675,  ledgerEntries: 12, expectedEntries: 12, completeness: 100, status: "complete" },
  { id: "BS-007-105", buildingId: "BLD-007", serviceId: "SVC-105", year: 2025, distributionMethod: "equal",    budget: 6600,   actual: 1650,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },
  { id: "BS-007-118", buildingId: "BLD-007", serviceId: "SVC-118", year: 2025, distributionMethod: "m2",       budget: 5280,   actual: 1320,  ledgerEntries: 3,  expectedEntries: 4,  completeness: 75,  status: "incomplete" },
  { id: "BS-007-102", buildingId: "BLD-007", serviceId: "SVC-102", year: 2025, distributionMethod: "metered",  budget: 3960,   actual: 990,   ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },
  { id: "BS-007-131", buildingId: "BLD-007", serviceId: "SVC-131", year: 2025, distributionMethod: "equal",    budget: 3520,   actual: 880,   ledgerEntries: 2,  expectedEntries: 4,  completeness: 50,  status: "incomplete" },
  { id: "BS-007-123", buildingId: "BLD-007", serviceId: "SVC-123", year: 2025, distributionMethod: "equal",    budget: 4400,   actual: 1100,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },

  // De Bolwerken (BLD-002 placeholder) — 4 services
  { id: "BS-002-105", buildingId: "BLD-002", serviceId: "SVC-105", year: 2025, distributionMethod: "equal",    budget: 12900,  actual: 3225,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },
  { id: "BS-002-118", buildingId: "BLD-002", serviceId: "SVC-118", year: 2025, distributionMethod: "m2",       budget: 10320,  actual: 2580,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },
  { id: "BS-002-131", buildingId: "BLD-002", serviceId: "SVC-131", year: 2025, distributionMethod: "equal",    budget: 6880,   actual: 1720,  ledgerEntries: 3,  expectedEntries: 4,  completeness: 75,  status: "incomplete" },
  { id: "BS-002-123", buildingId: "BLD-002", serviceId: "SVC-123", year: 2025, distributionMethod: "equal",    budget: 8600,   actual: 2150,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },

  // De Lindeborg (BLD-004) — 7 services
  { id: "BS-004-108", buildingId: "BLD-004", serviceId: "SVC-108", year: 2025, distributionMethod: "metered",  budget: 57600,  actual: 14400, ledgerEntries: 12, expectedEntries: 12, completeness: 100, status: "complete" },
  { id: "BS-004-105", buildingId: "BLD-004", serviceId: "SVC-105", year: 2025, distributionMethod: "equal",    budget: 18720,  actual: 4680,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },
  { id: "BS-004-102", buildingId: "BLD-004", serviceId: "SVC-102", year: 2025, distributionMethod: "metered",  budget: 12960,  actual: 3240,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },
  { id: "BS-004-118a",buildingId: "BLD-004", serviceId: "SVC-118", year: 2025, distributionMethod: "m2",       budget: 8640,   actual: 2160,  ledgerEntries: 2,  expectedEntries: 4,  completeness: 50,  status: "incomplete" },
  { id: "BS-004-118b",buildingId: "BLD-004", serviceId: "SVC-118", year: 2025, distributionMethod: "m2",       budget: 15840,  actual: 3960,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },
  { id: "BS-004-131", buildingId: "BLD-004", serviceId: "SVC-131", year: 2025, distributionMethod: "equal",    budget: 34560,  actual: 8640,  ledgerEntries: 4,  expectedEntries: 4,  completeness: 100, status: "complete" },
  { id: "BS-004-123", buildingId: "BLD-004", serviceId: "SVC-123", year: 2025, distributionMethod: "equal",    budget: 14400,  actual: 3600,  ledgerEntries: 3,  expectedEntries: 4,  completeness: 75,  status: "incomplete" },
];

// ── VHE (Verhuurbare Eenheden / Rental Units) ──
// Each VHE has a unique address and an active contract.
// No person names or resident counts — not available and not relevant for service charges.
// Key attributes:
//   address — unique street address (primary identifier)
//   unit — unit identifier within building
//   type — apartment / studio / parking / commercial (determines which services apply)
//   floor — for elevator service distribution
//   m2 — primary distribution key for area-based services
//   contract — currently active contract { id, status, startDate, endDate }
//   voorschot — total monthly service charge advance
//   voorschotBreakdown — advance per service component [{ serviceId, serviceName, amount }]
//   status — active / vacant / in-mutation

export const vhes = [
  // Kloostergang (BLD-007) — 44 VHE, showing a representative sample
  {
    id: "VHE-007-001", buildingId: "BLD-007", address: "Kloostergang 1A", unit: "1A", type: "apartment", floor: 0, m2: 62,
    contract: { id: "CTR-007-001", status: "active", startDate: "2019-03-01", endDate: null },
    voorschot: 125, status: "active",
    voorschotBreakdown: [
      { serviceId: "SVC-108", serviceName: "Warmtekosten", amount: 48 },
      { serviceId: "SVC-105", serviceName: "Elektra algemeen", amount: 15 },
      { serviceId: "SVC-102", serviceName: "Koud water", amount: 12 },
      { serviceId: "SVC-118", serviceName: "Schoonmaak", amount: 14 },
      { serviceId: "SVC-131", serviceName: "Huismeester", amount: 22 },
      { serviceId: "SVC-123", serviceName: "Tuinonderhoud", amount: 14 },
    ],
  },
  {
    id: "VHE-007-002", buildingId: "BLD-007", address: "Kloostergang 1B", unit: "1B", type: "apartment", floor: 0, m2: 58,
    contract: { id: "CTR-007-002", status: "active", startDate: "2021-07-01", endDate: null },
    voorschot: 118, status: "active",
    voorschotBreakdown: [
      { serviceId: "SVC-108", serviceName: "Warmtekosten", amount: 44 },
      { serviceId: "SVC-105", serviceName: "Elektra algemeen", amount: 15 },
      { serviceId: "SVC-102", serviceName: "Koud water", amount: 11 },
      { serviceId: "SVC-118", serviceName: "Schoonmaak", amount: 12 },
      { serviceId: "SVC-131", serviceName: "Huismeester", amount: 22 },
      { serviceId: "SVC-123", serviceName: "Tuinonderhoud", amount: 14 },
    ],
  },
  {
    id: "VHE-007-003", buildingId: "BLD-007", address: "Kloostergang 2A", unit: "2A", type: "apartment", floor: 1, m2: 65,
    contract: { id: "CTR-007-003", status: "active", startDate: "2018-01-15", endDate: null },
    voorschot: 132, status: "active",
    voorschotBreakdown: [
      { serviceId: "SVC-108", serviceName: "Warmtekosten", amount: 52 },
      { serviceId: "SVC-105", serviceName: "Elektra algemeen", amount: 15 },
      { serviceId: "SVC-102", serviceName: "Koud water", amount: 13 },
      { serviceId: "SVC-118", serviceName: "Schoonmaak", amount: 14 },
      { serviceId: "SVC-131", serviceName: "Huismeester", amount: 22 },
      { serviceId: "SVC-123", serviceName: "Tuinonderhoud", amount: 16 },
    ],
  },
  {
    id: "VHE-007-004", buildingId: "BLD-007", address: "Kloostergang 2B", unit: "2B", type: "apartment", floor: 1, m2: 58,
    contract: { id: "CTR-007-004", status: "active", startDate: "2022-09-01", endDate: null },
    voorschot: 118, status: "active",
    voorschotBreakdown: [
      { serviceId: "SVC-108", serviceName: "Warmtekosten", amount: 44 },
      { serviceId: "SVC-105", serviceName: "Elektra algemeen", amount: 15 },
      { serviceId: "SVC-102", serviceName: "Koud water", amount: 11 },
      { serviceId: "SVC-118", serviceName: "Schoonmaak", amount: 12 },
      { serviceId: "SVC-131", serviceName: "Huismeester", amount: 22 },
      { serviceId: "SVC-123", serviceName: "Tuinonderhoud", amount: 14 },
    ],
  },
  {
    id: "VHE-007-005", buildingId: "BLD-007", address: "Kloostergang 3A", unit: "3A", type: "apartment", floor: 2, m2: 62,
    contract: { id: "CTR-007-005", status: "active", startDate: "2020-04-01", endDate: null },
    voorschot: 125, status: "active",
    voorschotBreakdown: [
      { serviceId: "SVC-108", serviceName: "Warmtekosten", amount: 48 },
      { serviceId: "SVC-105", serviceName: "Elektra algemeen", amount: 15 },
      { serviceId: "SVC-102", serviceName: "Koud water", amount: 12 },
      { serviceId: "SVC-118", serviceName: "Schoonmaak", amount: 14 },
      { serviceId: "SVC-131", serviceName: "Huismeester", amount: 22 },
      { serviceId: "SVC-123", serviceName: "Tuinonderhoud", amount: 14 },
    ],
  },
  {
    id: "VHE-007-006", buildingId: "BLD-007", address: "Kloostergang 3B", unit: "3B", type: "apartment", floor: 2, m2: 58,
    contract: null,
    voorschot: 0, status: "vacant",
    voorschotBreakdown: [],
  },
  {
    id: "VHE-007-007", buildingId: "BLD-007", address: "Kloostergang 4A", unit: "4A", type: "apartment", floor: 3, m2: 65,
    contract: { id: "CTR-007-007", status: "active", startDate: "2023-01-01", endDate: null },
    voorschot: 132, status: "active",
    voorschotBreakdown: [
      { serviceId: "SVC-108", serviceName: "Warmtekosten", amount: 52 },
      { serviceId: "SVC-105", serviceName: "Elektra algemeen", amount: 15 },
      { serviceId: "SVC-102", serviceName: "Koud water", amount: 13 },
      { serviceId: "SVC-118", serviceName: "Schoonmaak", amount: 14 },
      { serviceId: "SVC-131", serviceName: "Huismeester", amount: 22 },
      { serviceId: "SVC-123", serviceName: "Tuinonderhoud", amount: 16 },
    ],
  },
  {
    id: "VHE-007-008", buildingId: "BLD-007", address: "Kloostergang 4B", unit: "4B", type: "studio", floor: 3, m2: 58,
    contract: { id: "CTR-007-008", status: "active", startDate: "2017-11-01", endDate: null },
    voorschot: 118, status: "active",
    voorschotBreakdown: [
      { serviceId: "SVC-108", serviceName: "Warmtekosten", amount: 44 },
      { serviceId: "SVC-105", serviceName: "Elektra algemeen", amount: 15 },
      { serviceId: "SVC-102", serviceName: "Koud water", amount: 11 },
      { serviceId: "SVC-118", serviceName: "Schoonmaak", amount: 12 },
      { serviceId: "SVC-131", serviceName: "Huismeester", amount: 22 },
      { serviceId: "SVC-123", serviceName: "Tuinonderhoud", amount: 14 },
    ],
  },

  // De Lindeborg (BLD-004) — sample
  {
    id: "VHE-004-001", buildingId: "BLD-004", address: "Haarstraat 101", unit: "101", type: "apartment", floor: 0, m2: 72,
    contract: { id: "CTR-004-001", status: "active", startDate: "2020-06-01", endDate: null },
    voorschot: 155, status: "active",
    voorschotBreakdown: [
      { serviceId: "SVC-108", serviceName: "Warmtekosten", amount: 55 },
      { serviceId: "SVC-105", serviceName: "Elektra algemeen", amount: 18 },
      { serviceId: "SVC-102", serviceName: "Koud water", amount: 14 },
      { serviceId: "SVC-118", serviceName: "Schoonmaak", amount: 16 },
      { serviceId: "SVC-131", serviceName: "Huismeester", amount: 28 },
      { serviceId: "SVC-123", serviceName: "Tuinonderhoud", amount: 14 },
      { serviceId: "SVC-104", serviceName: "Warm water", amount: 10 },
    ],
  },
  {
    id: "VHE-004-002", buildingId: "BLD-004", address: "Haarstraat 102", unit: "102", type: "apartment", floor: 0, m2: 68,
    contract: { id: "CTR-004-002", status: "active", startDate: "2019-02-01", endDate: null },
    voorschot: 148, status: "active",
    voorschotBreakdown: [
      { serviceId: "SVC-108", serviceName: "Warmtekosten", amount: 51 },
      { serviceId: "SVC-105", serviceName: "Elektra algemeen", amount: 18 },
      { serviceId: "SVC-102", serviceName: "Koud water", amount: 13 },
      { serviceId: "SVC-118", serviceName: "Schoonmaak", amount: 15 },
      { serviceId: "SVC-131", serviceName: "Huismeester", amount: 28 },
      { serviceId: "SVC-123", serviceName: "Tuinonderhoud", amount: 14 },
      { serviceId: "SVC-104", serviceName: "Warm water", amount: 9 },
    ],
  },
  {
    id: "VHE-004-003", buildingId: "BLD-004", address: "Haarstraat 103", unit: "103", type: "apartment", floor: 0, m2: 72,
    contract: { id: "CTR-004-003", status: "active", startDate: "2021-10-01", endDate: null },
    voorschot: 155, status: "active",
    voorschotBreakdown: [
      { serviceId: "SVC-108", serviceName: "Warmtekosten", amount: 55 },
      { serviceId: "SVC-105", serviceName: "Elektra algemeen", amount: 18 },
      { serviceId: "SVC-102", serviceName: "Koud water", amount: 14 },
      { serviceId: "SVC-118", serviceName: "Schoonmaak", amount: 16 },
      { serviceId: "SVC-131", serviceName: "Huismeester", amount: 28 },
      { serviceId: "SVC-123", serviceName: "Tuinonderhoud", amount: 14 },
      { serviceId: "SVC-104", serviceName: "Warm water", amount: 10 },
    ],
  },
  {
    id: "VHE-004-004", buildingId: "BLD-004", address: "Haarstraat 201", unit: "201", type: "apartment", floor: 1, m2: 68,
    contract: { id: "CTR-004-004", status: "active", startDate: "2022-04-01", endDate: null },
    voorschot: 148, status: "active",
    voorschotBreakdown: [
      { serviceId: "SVC-108", serviceName: "Warmtekosten", amount: 51 },
      { serviceId: "SVC-105", serviceName: "Elektra algemeen", amount: 18 },
      { serviceId: "SVC-102", serviceName: "Koud water", amount: 13 },
      { serviceId: "SVC-118", serviceName: "Schoonmaak", amount: 15 },
      { serviceId: "SVC-131", serviceName: "Huismeester", amount: 28 },
      { serviceId: "SVC-123", serviceName: "Tuinonderhoud", amount: 14 },
      { serviceId: "SVC-104", serviceName: "Warm water", amount: 9 },
    ],
  },
  {
    id: "VHE-004-005", buildingId: "BLD-004", address: "Haarstraat 202", unit: "202", type: "studio", floor: 1, m2: 72,
    contract: null,
    voorschot: 0, status: "vacant",
    voorschotBreakdown: [],
  },
];

// ── Meters ──
// Each meter now tracks: current reading, previous reading (start of year), and consumption (delta).
// Main meters have EAN codes (energy supply point identifier).
// "utility" is the meter type — NOT to be confused with "services" (delivered service charges).

export const meters = [
  // Kloostergang (BLD-007) main meters
  { id: "MTR-007-H1",  buildingId: "BLD-007", vheId: null,          type: "main", utility: "heat",        meterNumber: "HM-20154782", ean: "871687320000012345", unit: "GJ",  previousReading: 724.1,  lastReading: 842.5,  consumption: 118.4,  readingDate: "2025-02-28", previousDate: "2025-01-01", status: "active" },
  { id: "MTR-007-W1",  buildingId: "BLD-007", vheId: null,          type: "main", utility: "water",       meterNumber: "WM-30298741", ean: null,                 unit: "m³",  previousReading: 1108.0, lastReading: 1256.3, consumption: 148.3,  readingDate: "2025-02-28", previousDate: "2025-01-01", status: "active" },
  { id: "MTR-007-E1",  buildingId: "BLD-007", vheId: null,          type: "main", utility: "electricity", meterNumber: "EM-40187623", ean: "871687320000054321", unit: "kWh", previousReading: 24200,  lastReading: 28450,  consumption: 4250,   readingDate: "2025-02-28", previousDate: "2025-01-01", status: "active" },
  // Kloostergang submeters (linked to VHEs)
  { id: "MTR-007-H1A", buildingId: "BLD-007", vheId: "VHE-007-001", type: "sub",  utility: "heat",        meterNumber: "HS-20154782-1A", ean: null, unit: "GJ",  previousReading: 14.0, lastReading: 18.2,  consumption: 4.2,  readingDate: "2025-02-28", previousDate: "2025-01-01", status: "active" },
  { id: "MTR-007-H1B", buildingId: "BLD-007", vheId: "VHE-007-002", type: "sub",  utility: "heat",        meterNumber: "HS-20154782-1B", ean: null, unit: "GJ",  previousReading: 16.5, lastReading: 21.4,  consumption: 4.9,  readingDate: "2025-02-28", previousDate: "2025-01-01", status: "active" },
  { id: "MTR-007-H2A", buildingId: "BLD-007", vheId: "VHE-007-003", type: "sub",  utility: "heat",        meterNumber: "HS-20154782-2A", ean: null, unit: "GJ",  previousReading: 12.8, lastReading: 16.8,  consumption: 4.0,  readingDate: "2025-02-28", previousDate: "2025-01-01", status: "active" },
  { id: "MTR-007-H2B", buildingId: "BLD-007", vheId: "VHE-007-004", type: "sub",  utility: "heat",        meterNumber: "HS-20154782-2B", ean: null, unit: "GJ",  previousReading: 17.2, lastReading: 22.1,  consumption: 4.9,  readingDate: "2025-01-31", previousDate: "2025-01-01", status: "active" },
  { id: "MTR-007-W1A", buildingId: "BLD-007", vheId: "VHE-007-001", type: "sub",  utility: "water",       meterNumber: "WS-30298741-1A", ean: null, unit: "m³",  previousReading: 22.1, lastReading: 28.7,  consumption: 6.6,  readingDate: "2025-02-28", previousDate: "2025-01-01", status: "active" },
  { id: "MTR-007-W1B", buildingId: "BLD-007", vheId: "VHE-007-002", type: "sub",  utility: "water",       meterNumber: "WS-30298741-1B", ean: null, unit: "m³",  previousReading: 25.8, lastReading: 32.1,  consumption: 6.3,  readingDate: "2025-02-28", previousDate: "2025-01-01", status: "active" },

  // De Lindeborg (BLD-004) main meters
  { id: "MTR-004-H1",  buildingId: "BLD-004", vheId: null,          type: "main", utility: "heat",        meterNumber: "HM-20198432", ean: "871687320000098765", unit: "GJ",  previousReading: 2420.0, lastReading: 2810.6, consumption: 390.6,  readingDate: "2025-02-28", previousDate: "2025-01-01", status: "active" },
  { id: "MTR-004-W1",  buildingId: "BLD-004", vheId: null,          type: "main", utility: "water",       meterNumber: "WM-30345612", ean: null,                 unit: "m³",  previousReading: 3810.0, lastReading: 4520.8, consumption: 710.8,  readingDate: "2025-02-28", previousDate: "2025-01-01", status: "active" },
  { id: "MTR-004-E1",  buildingId: "BLD-004", vheId: null,          type: "main", utility: "electricity", meterNumber: "EM-40223198", ean: "871687320000067890", unit: "kWh", previousReading: 82400,  lastReading: 95200,  consumption: 12800,  readingDate: "2025-01-31", previousDate: "2025-01-01", status: "warning" },
  // De Lindeborg submeters (linked to VHEs) — heat and water per unit
  { id: "MTR-004-H101", buildingId: "BLD-004", vheId: "VHE-004-001", type: "sub", utility: "heat",        meterNumber: "HS-20198432-101", ean: null, unit: "GJ",  previousReading: 8.4,  lastReading: 12.1, consumption: 3.7, readingDate: "2025-02-28", previousDate: "2025-01-01", status: "active" },
  { id: "MTR-004-H102", buildingId: "BLD-004", vheId: "VHE-004-002", type: "sub", utility: "heat",        meterNumber: "HS-20198432-102", ean: null, unit: "GJ",  previousReading: 9.1,  lastReading: 13.5, consumption: 4.4, readingDate: "2025-02-28", previousDate: "2025-01-01", status: "active" },
  { id: "MTR-004-H103", buildingId: "BLD-004", vheId: "VHE-004-003", type: "sub", utility: "heat",        meterNumber: "HS-20198432-103", ean: null, unit: "GJ",  previousReading: 7.2,  lastReading: 10.8, consumption: 3.6, readingDate: "2025-02-28", previousDate: "2025-01-01", status: "active" },
  { id: "MTR-004-W101", buildingId: "BLD-004", vheId: "VHE-004-001", type: "sub", utility: "water",       meterNumber: "WS-30345612-101", ean: null, unit: "m³",  previousReading: 18.2, lastReading: 24.8, consumption: 6.6, readingDate: "2025-02-28", previousDate: "2025-01-01", status: "active" },
  { id: "MTR-004-W102", buildingId: "BLD-004", vheId: "VHE-004-002", type: "sub", utility: "water",       meterNumber: "WS-30345612-102", ean: null, unit: "m³",  previousReading: 20.5, lastReading: 27.9, consumption: 7.4, readingDate: "2025-02-28", previousDate: "2025-01-01", status: "active" },
  { id: "MTR-004-W103", buildingId: "BLD-004", vheId: "VHE-004-003", type: "sub", utility: "water",       meterNumber: "WS-30345612-103", ean: null, unit: "m³",  previousReading: 15.8, lastReading: 21.0, consumption: 5.2, readingDate: "2025-02-28", previousDate: "2025-01-01", status: "active" },
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

// ── Settlement data ──
// Settlement status per building per year — tracks the eindafrekening lifecycle
// Statuses: not_started | monitoring | in_review | approved | distributed

export const buildingSettlements = [
  // 2024 — fully settled (we are now in 2026, so 2024 is completely done)
  { id: "STL-001-2024", buildingId: "BLD-001", year: 2024, status: "distributed", approvedAt: "2025-02-15", distributedAt: "2025-03-01", totalCost: 49800,  totalVoorschot: 52000,  netResult: 2200 },
  { id: "STL-002-2024", buildingId: "BLD-002", year: 2024, status: "distributed", approvedAt: "2025-02-28", distributedAt: "2025-04-10", totalCost: 231400, totalVoorschot: 236500, netResult: 5100 },
  { id: "STL-003-2024", buildingId: "BLD-003", year: 2024, status: "distributed", approvedAt: "2025-01-20", distributedAt: "2025-02-10", totalCost: 59200,  totalVoorschot: 57750,  netResult: -1450 },
  { id: "STL-004-2024", buildingId: "BLD-004", year: 2024, status: "distributed", approvedAt: "2025-05-12", distributedAt: "2025-06-01", totalCost: 428600, totalVoorschot: 432000, netResult: 3400 },
  { id: "STL-005-2024", buildingId: "BLD-005", year: 2024, status: "distributed", approvedAt: "2025-04-18", distributedAt: "2025-05-15", totalCost: 52100,  totalVoorschot: 54000,  netResult: 1900 },
  { id: "STL-006-2024", buildingId: "BLD-006", year: 2024, status: "distributed", approvedAt: "2025-03-01", distributedAt: "2025-03-20", totalCost: 23800,  totalVoorschot: 24000,  netResult: 200 },
  { id: "STL-007-2024", buildingId: "BLD-007", year: 2024, status: "distributed", approvedAt: "2025-01-15", distributedAt: "2025-02-01", totalCost: 41200,  totalVoorschot: 42460,  netResult: 1260 },
  { id: "STL-008-2024", buildingId: "BLD-008", year: 2024, status: "distributed", approvedAt: "2025-06-10", distributedAt: "2025-07-01", totalCost: 27800,  totalVoorschot: 28500,  netResult: 700 },
  { id: "STL-009-2024", buildingId: "BLD-009", year: 2024, status: "distributed", approvedAt: "2025-04-22", distributedAt: "2025-05-10", totalCost: 107800, totalVoorschot: 110000, netResult: 2200 },
  { id: "STL-010-2024", buildingId: "BLD-010", year: 2024, status: "distributed", approvedAt: "2025-07-05", distributedAt: "2025-07-20", totalCost: 93200,  totalVoorschot: 94500,  netResult: 1300 },
  { id: "STL-011-2024", buildingId: "BLD-011", year: 2024, status: "distributed", approvedAt: "2025-02-20", distributedAt: "2025-03-10", totalCost: 12400,  totalVoorschot: 12500,  netResult: 100 },
  { id: "STL-012-2024", buildingId: "BLD-012", year: 2024, status: "distributed", approvedAt: "2025-01-10", distributedAt: "2025-01-25", totalCost: 39600,  totalVoorschot: 40250,  netResult: 650 },
  { id: "STL-013-2024", buildingId: "BLD-013", year: 2024, status: "distributed", approvedAt: "2025-08-01", distributedAt: "2025-08-15", totalCost: 30800,  totalVoorschot: 31500,  netResult: 700 },
  { id: "STL-014-2024", buildingId: "BLD-014", year: 2024, status: "distributed", approvedAt: "2025-05-20", distributedAt: "2025-06-05", totalCost: 118200, totalVoorschot: 121000, netResult: 2800 },
  { id: "STL-015-2024", buildingId: "BLD-015", year: 2024, status: "distributed", approvedAt: "2025-02-05", distributedAt: "2025-02-20", totalCost: 138500, totalVoorschot: 140000, netResult: 1500 },
  { id: "STL-016-2024", buildingId: "BLD-016", year: 2024, status: "distributed", approvedAt: "2025-03-02", distributedAt: "2025-03-18", totalCost: 27200,  totalVoorschot: 27500,  netResult: 300 },
  { id: "STL-017-2024", buildingId: "BLD-017", year: 2024, status: "distributed", approvedAt: "2025-09-10", distributedAt: "2025-09-25", totalCost: 41200,  totalVoorschot: 42000,  netResult: 800 },
  { id: "STL-018-2024", buildingId: "BLD-018", year: 2024, status: "distributed", approvedAt: "2025-06-15", distributedAt: "2025-07-01", totalCost: 167400, totalVoorschot: 170000, netResult: 2600 },
  { id: "STL-019-2024", buildingId: "BLD-019", year: 2024, status: "distributed", approvedAt: "2025-01-30", distributedAt: "2025-02-15", totalCost: 34800,  totalVoorschot: 35000,  netResult: 200 },
  { id: "STL-020-2024", buildingId: "BLD-020", year: 2024, status: "distributed", approvedAt: "2025-02-25", distributedAt: "2025-03-12", totalCost: 155800, totalVoorschot: 157500, netResult: 1700 },
  { id: "STL-021-2024", buildingId: "BLD-021", year: 2024, status: "distributed", approvedAt: "2025-01-25", distributedAt: "2025-02-08", totalCost: 74200,  totalVoorschot: 75000,  netResult: 800 },

  // 2025 — settlement year (we are in March 2026, various settlement states)
  { id: "STL-001-2025", buildingId: "BLD-001", year: 2025, status: "distributed", approvedAt: "2026-01-20", distributedAt: "2026-02-05", totalCost: 50400,  totalVoorschot: 52000,  netResult: 1600 },
  { id: "STL-002-2025", buildingId: "BLD-002", year: 2025, status: "approved",    approvedAt: "2026-02-28", distributedAt: null,         totalCost: 234200, totalVoorschot: 236500, netResult: 2300 },
  { id: "STL-003-2025", buildingId: "BLD-003", year: 2025, status: "distributed", approvedAt: "2026-01-15", distributedAt: "2026-02-01", totalCost: 58100,  totalVoorschot: 57750,  netResult: -350 },
  { id: "STL-004-2025", buildingId: "BLD-004", year: 2025, status: "in_review",   approvedAt: null,         distributedAt: null,         totalCost: 430500, totalVoorschot: 432000, netResult: 1500 },
  { id: "STL-005-2025", buildingId: "BLD-005", year: 2025, status: "in_review",   approvedAt: null,         distributedAt: null,         totalCost: 53200,  totalVoorschot: 54000,  netResult: 800 },
  { id: "STL-006-2025", buildingId: "BLD-006", year: 2025, status: "approved",    approvedAt: "2026-03-01", distributedAt: null,         totalCost: 65800,  totalVoorschot: 67500,  netResult: 1700 },
  { id: "STL-007-2025", buildingId: "BLD-007", year: 2025, status: "distributed", approvedAt: "2026-01-10", distributedAt: "2026-01-25", totalCost: 108200, totalVoorschot: 110000, netResult: 1800 },
  { id: "STL-008-2025", buildingId: "BLD-008", year: 2025, status: "not_started", approvedAt: null,         distributedAt: null,         totalCost: null,   totalVoorschot: 211250, netResult: null },
  { id: "STL-009-2025", buildingId: "BLD-009", year: 2025, status: "in_review",   approvedAt: null,         distributedAt: null,         totalCost: 332000, totalVoorschot: 336000, netResult: 4000 },
  { id: "STL-010-2025", buildingId: "BLD-010", year: 2025, status: "not_started", approvedAt: null,         distributedAt: null,         totalCost: null,   totalVoorschot: 11250,  netResult: null },
  { id: "STL-011-2025", buildingId: "BLD-011", year: 2025, status: "approved",    approvedAt: "2026-02-15", distributedAt: null,         totalCost: 88500,  totalVoorschot: 90000,  netResult: 1500 },
  { id: "STL-012-2025", buildingId: "BLD-012", year: 2025, status: "distributed", approvedAt: "2026-01-05", distributedAt: "2026-01-20", totalCost: 267500, totalVoorschot: 270000, netResult: 2500 },
  { id: "STL-013-2025", buildingId: "BLD-013", year: 2025, status: "not_started", approvedAt: null,         distributedAt: null,         totalCost: null,   totalVoorschot: 60000,  netResult: null },
  { id: "STL-014-2025", buildingId: "BLD-014", year: 2025, status: "in_review",   approvedAt: null,         distributedAt: null,         totalCost: 41200,  totalVoorschot: 42000,  netResult: 800 },
  { id: "STL-015-2025", buildingId: "BLD-015", year: 2025, status: "distributed", approvedAt: "2026-02-01", distributedAt: "2026-02-18", totalCost: 26200,  totalVoorschot: 27000,  netResult: 800 },
  { id: "STL-016-2025", buildingId: "BLD-016", year: 2025, status: "approved",    approvedAt: "2026-03-02", distributedAt: null,         totalCost: 41500,  totalVoorschot: 42000,  netResult: 500 },
  { id: "STL-017-2025", buildingId: "BLD-017", year: 2025, status: "not_started", approvedAt: null,         distributedAt: null,         totalCost: null,   totalVoorschot: 483000, netResult: null },
  { id: "STL-018-2025", buildingId: "BLD-018", year: 2025, status: "in_review",   approvedAt: null,         distributedAt: null,         totalCost: 12100,  totalVoorschot: 12500,  netResult: 400 },
  { id: "STL-019-2025", buildingId: "BLD-019", year: 2025, status: "distributed", approvedAt: "2026-01-28", distributedAt: "2026-02-12", totalCost: 49200,  totalVoorschot: 50000,  netResult: 800 },
  { id: "STL-020-2025", buildingId: "BLD-020", year: 2025, status: "approved",    approvedAt: "2026-02-20", distributedAt: null,         totalCost: 436000, totalVoorschot: 438750, netResult: 2750 },
  { id: "STL-021-2025", buildingId: "BLD-021", year: 2025, status: "distributed", approvedAt: "2026-01-22", distributedAt: "2026-02-05", totalCost: 193800, totalVoorschot: 195250, netResult: 1450 },
];

// Settlement checks per building-service (for 2024 — the year under settlement)
// Each check tracks: ledger completeness, budget variance, YoY comparison, consumption verification
export const settlementChecks = [
  // BLD-007 Kloostergang 2024 — fully verified (was distributed)
  { id: "SC-007-108", buildingId: "BLD-007", serviceId: "SVC-108", year: 2024, ledgerComplete: true,  budgetVariance: -2.1,  budgetApproved: true,  yoyDeviation: 3.5,   yoyFlagged: false, consumptionVerified: true,  status: "approved" },
  { id: "SC-007-105", buildingId: "BLD-007", serviceId: "SVC-105", year: 2024, ledgerComplete: true,  budgetVariance: 1.8,   budgetApproved: true,  yoyDeviation: -1.2,  yoyFlagged: false, consumptionVerified: true,  status: "approved" },
  { id: "SC-007-118", buildingId: "BLD-007", serviceId: "SVC-118", year: 2024, ledgerComplete: true,  budgetVariance: -4.5,  budgetApproved: true,  yoyDeviation: 8.2,   yoyFlagged: false, consumptionVerified: false, status: "approved" },
  { id: "SC-007-102", buildingId: "BLD-007", serviceId: "SVC-102", year: 2024, ledgerComplete: true,  budgetVariance: 0.8,   budgetApproved: true,  yoyDeviation: -2.1,  yoyFlagged: false, consumptionVerified: true,  status: "approved" },
  { id: "SC-007-131", buildingId: "BLD-007", serviceId: "SVC-131", year: 2024, ledgerComplete: true,  budgetVariance: -1.2,  budgetApproved: true,  yoyDeviation: 5.0,   yoyFlagged: false, consumptionVerified: false, status: "approved" },
  { id: "SC-007-123", buildingId: "BLD-007", serviceId: "SVC-123", year: 2024, ledgerComplete: true,  budgetVariance: 2.3,   budgetApproved: true,  yoyDeviation: -0.5,  yoyFlagged: false, consumptionVerified: false, status: "approved" },

  // BLD-004 De Lindeborg 2024 — in review (some issues)
  { id: "SC-004-108", buildingId: "BLD-004", serviceId: "SVC-108", year: 2024, ledgerComplete: true,  budgetVariance: -3.2,  budgetApproved: true,  yoyDeviation: 5.8,   yoyFlagged: false, consumptionVerified: true,  status: "verified" },
  { id: "SC-004-105", buildingId: "BLD-004", serviceId: "SVC-105", year: 2024, ledgerComplete: true,  budgetVariance: 8.5,   budgetApproved: false, yoyDeviation: 12.3,  yoyFlagged: true,  consumptionVerified: true,  status: "flagged" },
  { id: "SC-004-102", buildingId: "BLD-004", serviceId: "SVC-102", year: 2024, ledgerComplete: true,  budgetVariance: -1.5,  budgetApproved: true,  yoyDeviation: 2.1,   yoyFlagged: false, consumptionVerified: true,  status: "verified" },
  { id: "SC-004-118a",buildingId: "BLD-004", serviceId: "SVC-118", year: 2024, ledgerComplete: false, budgetVariance: null,  budgetApproved: false, yoyDeviation: null,  yoyFlagged: false, consumptionVerified: false, status: "pending" },
  { id: "SC-004-118b",buildingId: "BLD-004", serviceId: "SVC-118", year: 2024, ledgerComplete: true,  budgetVariance: -6.1,  budgetApproved: true,  yoyDeviation: -3.4,  yoyFlagged: false, consumptionVerified: false, status: "verified" },
  { id: "SC-004-131", buildingId: "BLD-004", serviceId: "SVC-131", year: 2024, ledgerComplete: true,  budgetVariance: 18.2,  budgetApproved: false, yoyDeviation: 22.5,  yoyFlagged: true,  consumptionVerified: false, status: "flagged" },
  { id: "SC-004-123", buildingId: "BLD-004", serviceId: "SVC-123", year: 2024, ledgerComplete: true,  budgetVariance: -0.8,  budgetApproved: true,  yoyDeviation: 1.2,   yoyFlagged: false, consumptionVerified: false, status: "verified" },
];

export function getSettlement(buildingId, year) {
  return buildingSettlements.find((s) => s.buildingId === buildingId && s.year === year);
}

export function getSettlementsByYear(year) {
  return buildingSettlements.filter((s) => s.year === year);
}

export function getSettlementChecks(buildingId, year) {
  return settlementChecks.filter((sc) => sc.buildingId === buildingId && sc.year === year);
}

// ── Suppliers ──
// Realistic suppliers for a woningcorporatie service charge administration
// Each supplier provides one or more services and is linked to buildings through those services

export const supplierCategories = [
  { id: "energy",        label: { en: "Energy & Utilities",        nl: "Energie & Nutsbedrijven" } },
  { id: "installations", label: { en: "Technical & Installations", nl: "Techniek & Installaties" } },
  { id: "cleaning",      label: { en: "Cleaning & Maintenance",    nl: "Schoonmaak & Onderhoud" } },
  { id: "metering",      label: { en: "Metering & Data",           nl: "Meetdiensten & Data" } },
  { id: "management",    label: { en: "Management & Advisory",     nl: "Beheer & Advies" } },
];

export const suppliers = [
  {
    id: "SUP-001",
    name: "ENGIE Energie Nederland",
    category: "energy",
    kvk: "34108453",
    city: "Zwolle",
    contactPerson: "R. van Dijk",
    email: "corporaties@engie.nl",
    phone: "+31 88 895 0000",
    website: "engie.nl",
    contractStart: "2022-01-01",
    contractEnd: "2025-12-31",
    serviceIds: ["SVC-104", "SVC-105", "SVC-106", "SVC-107", "SVC-108", "SVC-110"],
    buildingCount: 21,
    annualSpend: 285000,
    status: "active",
    rating: 4,
    notes: { en: "Main energy supplier. Framework contract via Woonenergie.", nl: "Hoofdleverancier energie. Raamcontract via Woonenergie." },
  },
  {
    id: "SUP-002",
    name: "Oasen",
    category: "energy",
    kvk: "24289054",
    city: "Gouda",
    contactPerson: "M. Bakker",
    email: "zakelijk@oasen.nl",
    phone: "+31 182 59 36 36",
    website: "oasen.nl",
    contractStart: "2020-01-01",
    contractEnd: null,
    serviceIds: ["SVC-102"],
    buildingCount: 16,
    annualSpend: 42000,
    status: "active",
    rating: 4,
    notes: { en: "Regional water supplier for Gorinchem area. No fixed contract, regulated tariffs.", nl: "Regionaal waterbedrijf voor regio Gorinchem. Geen vast contract, gereguleerde tarieven." },
  },
  {
    id: "SUP-003",
    name: "Techem Energy Services BV",
    category: "metering",
    kvk: "30141780",
    city: "Arnhem",
    contactPerson: "J. Hendriks",
    email: "service@techem.nl",
    phone: "+31 26 355 1355",
    website: "techem.nl",
    contractStart: "2023-07-01",
    contractEnd: "2026-06-30",
    serviceIds: ["SVC-108", "SVC-111"],
    buildingCount: 14,
    annualSpend: 38500,
    status: "active",
    rating: 3,
    notes: { en: "Metering services & heat cost allocation. Some delays in reading uploads.", nl: "Meetdiensten & warmtekostenverdeling. Enige vertraging bij het uploaden van standen." },
  },
  {
    id: "SUP-004",
    name: "Joulz Meetbedrijf B.V.",
    category: "metering",
    kvk: "27258084",
    city: "Rotterdam",
    contactPerson: "A. Smits",
    email: "meetdiensten@joulz.nl",
    phone: "+31 88 454 5000",
    website: "joulz.nl",
    contractStart: "2021-04-01",
    contractEnd: "2025-03-31",
    serviceIds: ["SVC-108", "SVC-111"],
    buildingCount: 8,
    annualSpend: 22400,
    status: "active",
    rating: 4,
    notes: { en: "Independent metering company for gas and electricity. Contract renewal pending.", nl: "Onafhankelijk meetbedrijf voor gas en elektriciteit. Contractverlenging in behandeling." },
  },
  {
    id: "SUP-005",
    name: "Stedin Netbeheer BV",
    category: "energy",
    kvk: "24306940",
    city: "Rotterdam",
    contactPerson: "Klantenservice Zakelijk",
    email: "zakelijk@stedin.net",
    phone: "+31 88 896 3096",
    website: "stedin.net",
    contractStart: "2019-01-01",
    contractEnd: null,
    serviceIds: ["SVC-108"],
    buildingCount: 12,
    annualSpend: 18600,
    status: "active",
    rating: 4,
    notes: { en: "Grid operator for Gorinchem region. Transport costs only, regulated.", nl: "Netbeheerder regio Gorinchem. Alleen transportkosten, gereguleerd." },
  },
  {
    id: "SUP-006",
    name: "Schindler Liften B.V.",
    category: "installations",
    kvk: "33148680",
    city: "'s-Gravenhage",
    contactPerson: "P. de Groot",
    email: "service.nl@schindler.com",
    phone: "+31 70 399 2666",
    website: "schindler.nl",
    contractStart: "2023-01-01",
    contractEnd: "2027-12-31",
    serviceIds: ["SVC-132", "SVC-133"],
    buildingCount: 6,
    annualSpend: 31200,
    status: "active",
    rating: 5,
    notes: { en: "Elevator maintenance & 24h emergency service. Excellent response times.", nl: "Liftonderhoud & 24-uurs storingsdienst. Uitstekende responstijden." },
  },
  {
    id: "SUP-007",
    name: "CSU Cleaning Services",
    category: "cleaning",
    kvk: "17098383",
    city: "Eindhoven",
    contactPerson: "K. Meijer",
    email: "corporaties@csu.nl",
    phone: "+31 40 290 4040",
    website: "csu.nl",
    contractStart: "2024-01-01",
    contractEnd: "2026-12-31",
    serviceIds: ["SVC-118", "SVC-140"],
    buildingCount: 19,
    annualSpend: 89000,
    status: "active",
    rating: 3,
    notes: { en: "Cleaning common areas & window washing. Quality inconsistent at some locations.", nl: "Schoonmaak algemene ruimten & glasbewassing. Kwaliteit wisselend op enkele locaties." },
  },
  {
    id: "SUP-008",
    name: "ISS Facility Services",
    category: "cleaning",
    kvk: "33247775",
    city: "Utrecht",
    contactPerson: "L. Jansen",
    email: "info@nl.issworld.com",
    phone: "+31 30 242 4242",
    website: "issworld.com",
    contractStart: "2022-06-01",
    contractEnd: "2025-05-31",
    serviceIds: ["SVC-118", "SVC-116"],
    buildingCount: 4,
    annualSpend: 28500,
    status: "active",
    rating: 4,
    notes: { en: "Facility services for larger complexes. Also handles lamp replacement.", nl: "Facilitaire diensten voor grotere complexen. Verzorgt ook lampvervanging." },
  },
  {
    id: "SUP-009",
    name: "Van Ginkel Groep B.V.",
    category: "cleaning",
    kvk: "30143506",
    city: "Veenendaal",
    contactPerson: "B. van Ginkel",
    email: "info@vanginkelgroep.nl",
    phone: "+31 318 54 58 00",
    website: "vanginkelgroep.nl",
    contractStart: "2023-03-01",
    contractEnd: "2026-02-28",
    serviceIds: ["SVC-123", "SVC-124"],
    buildingCount: 8,
    annualSpend: 44000,
    status: "active",
    rating: 4,
    notes: { en: "Landscaping & gutter cleaning. Reliable seasonal scheduling.", nl: "Tuinonderhoud & dakgootreiniging. Betrouwbare seizoensplanning." },
  },
  {
    id: "SUP-010",
    name: "Feenstra Verwarming B.V.",
    category: "installations",
    kvk: "33176855",
    city: "Heemstede",
    contactPerson: "T. Visser",
    email: "service@feenstra.com",
    phone: "+31 23 547 5555",
    website: "feenstra.com",
    contractStart: "2021-10-01",
    contractEnd: "2025-09-30",
    serviceIds: ["SVC-115", "SVC-126", "SVC-127"],
    buildingCount: 10,
    annualSpend: 52000,
    status: "active",
    rating: 3,
    notes: { en: "Heating maintenance, geyser cleaning, and mechanical ventilation. Contract renewal under negotiation.", nl: "CV-onderhoud, geiserreinigen en mechanische ventilatie. Contractverlenging in onderhandeling." },
  },
  {
    id: "SUP-011",
    name: "Riool.nl (Rioned Groep)",
    category: "cleaning",
    kvk: "09060847",
    city: "Arnhem",
    contactPerson: "W. Peters",
    email: "service@riool.nl",
    phone: "+31 26 365 1010",
    website: "riool.nl",
    contractStart: "2024-04-01",
    contractEnd: "2027-03-31",
    serviceIds: ["SVC-122"],
    buildingCount: 8,
    annualSpend: 12800,
    status: "active",
    rating: 5,
    notes: { en: "Drain cleaning & sewer maintenance. Fast emergency response.", nl: "Rioolontstopping & rioolonderhoud. Snelle noodrespons." },
  },
  {
    id: "SUP-012",
    name: "ASSA ABLOY Entrance Systems",
    category: "installations",
    kvk: "24337859",
    city: "Nieuwegein",
    contactPerson: "D. Mulder",
    email: "nl.entrance@assaabloy.com",
    phone: "+31 30 291 4444",
    website: "assaabloyentrance.nl",
    contractStart: "2023-06-01",
    contractEnd: "2026-05-31",
    serviceIds: ["SVC-171"],
    buildingCount: 4,
    annualSpend: 8400,
    status: "active",
    rating: 4,
    notes: { en: "Electric doors & access systems. 24h service contract.", nl: "Elektrische deuren & toegangssystemen. 24-uurs servicecontract." },
  },
  {
    id: "SUP-013",
    name: "SWB Wijkbeheer",
    category: "management",
    kvk: "51434218",
    city: "Gorinchem",
    contactPerson: "H. van der Berg",
    email: "info@swb-wijkbeheer.nl",
    phone: "+31 183 62 44 00",
    website: "swb-wijkbeheer.nl",
    contractStart: "2020-01-01",
    contractEnd: "2025-12-31",
    serviceIds: ["SVC-131", "SVC-137"],
    buildingCount: 17,
    annualSpend: 156000,
    status: "active",
    rating: 4,
    notes: { en: "Local caretaker & social support services. Embedded in the community.", nl: "Lokale huismeester & woonondersteunende diensten. Geworteld in de wijk." },
  },
  {
    id: "SUP-014",
    name: "KPN Zakelijk",
    category: "management",
    kvk: "02045700",
    city: "Den Haag",
    contactPerson: "Accountteam Corporaties",
    email: "corporaties@kpn.com",
    phone: "+31 800 0403",
    website: "kpn.com/zakelijk",
    contractStart: "2024-07-01",
    contractEnd: "2026-06-30",
    serviceIds: ["SVC-142"],
    buildingCount: 2,
    annualSpend: 7200,
    status: "active",
    rating: 3,
    notes: { en: "Communal internet for two complexes. Pilot project, may expand.", nl: "Collectief internet voor twee complexen. Pilotproject, mogelijk uitbreiding." },
  },
  {
    id: "SUP-015",
    name: "Centraal Beheer Verzekeringen",
    category: "management",
    kvk: "27099838",
    city: "Apeldoorn",
    contactPerson: "Verzekeringsdesk Wonen",
    email: "wonen@centraalbeheer.nl",
    phone: "+31 55 579 8111",
    website: "centraalbeheer.nl",
    contractStart: "2023-01-01",
    contractEnd: "2025-12-31",
    serviceIds: ["SVC-036"],
    buildingCount: 1,
    annualSpend: 3200,
    status: "active",
    rating: 4,
    notes: { en: "Collective glass insurance policy. Single complex only.", nl: "Collectieve glasverzekering. Slechts één complex." },
  },
  {
    id: "SUP-016",
    name: "Hydro Building Systems BV",
    category: "installations",
    kvk: "08098654",
    city: "Harderwijk",
    contactPerson: "G. Dijkstra",
    email: "service@hydrobuildingsystems.nl",
    phone: "+31 341 46 3200",
    website: "hydrobuildingsystems.nl",
    contractStart: "2022-03-01",
    contractEnd: "2025-02-28",
    serviceIds: ["SVC-120"],
    buildingCount: 3,
    annualSpend: 5400,
    status: "expiring",
    rating: 3,
    notes: { en: "Hydrophore pump maintenance. Contract expired, renewal pending.", nl: "Hydrofooronderhoud. Contract verlopen, verlenging in behandeling." },
  },
];

export function getSupplier(id) {
  return suppliers.find((s) => s.id === id);
}

export function getSuppliersByService(serviceId) {
  return suppliers.filter((s) => s.serviceIds.includes(serviceId));
}

export function getSuppliersByCategory(categoryId) {
  return suppliers.filter((s) => s.category === categoryId);
}

// ── Saved Views ──
// Views are saved column/filter configurations per object type.
// Each view defines which columns to show and which filters to apply.
// objectType matches the sidebar object (buildings, vhe, services, meters, suppliers).

export const savedViews = [
  // ── Complexes views ──
  {
    id: "view-all-complexes",
    objectType: "buildings",
    name: { en: "All Complexes", nl: "Alle Complexen" },
    icon: "list",
    isDefault: true,
    columns: ["complex", "complexId", "location", "vhe", "components", "utilities", "dataQuality"],
    filters: {},
    year: null, // null = current year
  },
  {
    id: "view-settlement-2024",
    objectType: "buildings",
    name: { en: "Settlement 2024", nl: "Afrekening 2024" },
    icon: "fileCheck",
    isDefault: false,
    columns: ["complex", "location", "vhe", "components", "settlementStatus", "netResult"],
    filters: {},
    year: 2024,
  },
  {
    id: "view-settlement-2025",
    objectType: "buildings",
    name: { en: "Settlement 2025", nl: "Afrekening 2025" },
    icon: "fileCheck",
    isDefault: false,
    columns: ["complex", "location", "vhe", "components", "settlementStatus", "netResult"],
    filters: {},
    year: 2025,
  },

  // ── Units views ──
  {
    id: "view-all-units",
    objectType: "vhe",
    name: { en: "All Units", nl: "Alle Eenheden" },
    icon: "list",
    isDefault: true,
    columns: [],
    filters: {},
    year: null,
  },

  // ── Services views ──
  {
    id: "view-all-services",
    objectType: "services",
    name: { en: "All Services", nl: "Alle Diensten" },
    icon: "list",
    isDefault: true,
    columns: [],
    filters: {},
    year: null,
  },

  // ── Suppliers views ──
  {
    id: "view-all-suppliers",
    objectType: "suppliers",
    name: { en: "All Suppliers", nl: "Alle Leveranciers" },
    icon: "list",
    isDefault: true,
    columns: [],
    filters: {},
    year: null,
  },

  // ── Meters views ──
  {
    id: "view-all-meters",
    objectType: "meters",
    name: { en: "All Meters", nl: "Alle Meters" },
    icon: "list",
    isDefault: true,
    columns: [],
    filters: {},
    year: null,
  },
  {
    id: "view-overdue-readings",
    objectType: "meters",
    name: { en: "Overdue Readings", nl: "Achterstallige Standen" },
    icon: "alertTriangle",
    isDefault: false,
    columns: [],
    filters: { overdue: true },
    year: null,
  },
];

export function getViewsForObject(objectType) {
  return savedViews.filter((v) => v.objectType === objectType);
}

export function getView(viewId) {
  return savedViews.find((v) => v.id === viewId);
}

export function getServicesByCategory() {
  return serviceCategories.map((cat) => ({
    ...cat,
    services: services.filter((s) => s.category === cat.id),
  }));
}

export function getCategory(categoryId) {
  return serviceCategories.find((c) => c.id === categoryId);
}

// ═══════════════════════════════════════════════════════════════════
// LEDGER ENTRIES — journal entries per service per building
// These represent actual booked costs from the ERP / financial system.
// Housing corporations monitor these throughout the year to ensure
// costs are correct, complete, and booked on the right Service + Building.
// ═══════════════════════════════════════════════════════════════════

const ledgerStatuses = ["booked", "pending", "flagged"];

function generateLedgerEntries() {
  const entries = [];
  let idx = 1;

  // For each building, generate entries for a realistic subset of services
  const serviceBuildingMap = [
    { bld: "BLD-001", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-111","SVC-127","SVC-123"] },
    { bld: "BLD-002", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-106","SVC-118","SVC-131","SVC-132","SVC-111","SVC-123","SVC-116"] },
    { bld: "BLD-003", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-127"] },
    { bld: "BLD-004", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-106","SVC-118","SVC-131","SVC-132","SVC-111","SVC-115","SVC-123","SVC-116"] },
    { bld: "BLD-005", svcs: ["SVC-108","SVC-102","SVC-118","SVC-131","SVC-123","SVC-115"] },
    { bld: "BLD-006", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-111","SVC-132","SVC-123"] },
    { bld: "BLD-007", svcs: ["SVC-108","SVC-102","SVC-105","SVC-131","SVC-118","SVC-127","SVC-123"] },
    { bld: "BLD-008", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-106","SVC-118","SVC-131","SVC-132","SVC-111","SVC-115","SVC-123","SVC-116"] },
    { bld: "BLD-009", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123"] },
    { bld: "BLD-010", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-111","SVC-127","SVC-123","SVC-122"] },
    { bld: "BLD-011", svcs: ["SVC-102","SVC-105","SVC-118","SVC-131","SVC-123"] },
    { bld: "BLD-012", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-131","SVC-132","SVC-111","SVC-123","SVC-116"] },
    { bld: "BLD-013", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-127"] },
    { bld: "BLD-014", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123"] },
    { bld: "BLD-015", svcs: ["SVC-108","SVC-102","SVC-105","SVC-131","SVC-127","SVC-123","SVC-091"] },
    { bld: "BLD-016", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-132"] },
    { bld: "BLD-017", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-111","SVC-123","SVC-132","SVC-116"] },
    { bld: "BLD-018", svcs: ["SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-122"] },
    { bld: "BLD-019", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-111","SVC-127","SVC-123"] },
    { bld: "BLD-020", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-132","SVC-111","SVC-123","SVC-116"] },
    { bld: "BLD-021", svcs: ["SVC-108","SVC-102","SVC-105","SVC-131","SVC-127","SVC-123","SVC-091"] },
  ];

  const descriptions = {
    "SVC-108": ["Maandnota warmtelevering", "Vastrecht warmte", "Nacalculatie warmteverbruik", "Meetdiensten warmte", "Transportkosten warmtenet"],
    "SVC-102": ["Maandnota waterlevering", "Vastrecht drinkwater", "Rioolheffing gemeenschappelijk"],
    "SVC-104": ["Maandnota warm water", "Vastrecht warm water", "Nacalculatie warmwaterverbruik"],
    "SVC-105": ["Maandnota elektra algemeen", "Vastrecht elektra", "Verbruik trappenhuisverlichting", "Verbruik parkeergarage"],
    "SVC-106": ["Maandnota elektra woonruimte", "Vastrecht elektra individueel"],
    "SVC-118": ["Schoonmaak algemene ruimten", "Schoonmaak trappenhuis", "Glasbewassing"],
    "SVC-131": ["Huismeesterdiensten", "Kleine reparaties", "Sociale dienstverlening"],
    "SVC-132": ["Onderhoudscontract lift", "Storingsafhandeling lift", "Keuring lift"],
    "SVC-111": ["Plaatsing verbruiksmeters", "IJking meters", "Afleesservice"],
    "SVC-115": ["24-uur storingsdienst CV", "Noodreparatie verwarming"],
    "SVC-127": ["Onderhoud ventilatie", "Filtervervanging MV", "Energieverbruik ventilatie"],
    "SVC-123": ["Tuinonderhoud", "Groenvoorziening seizoen", "Snoeiwerkzaamheden"],
    "SVC-116": ["Vervanging lampen", "Noodverlichting controle"],
    "SVC-122": ["Rioolreiniging", "Ontstopping collectief"],
    "SVC-091": ["Opbrengst zonnepanelen", "Saldering zonnepanelen"],
  };

  const supplierMap = {
    "SVC-108": "ENGIE Energie Nederland",
    "SVC-102": "Oasen",
    "SVC-104": "ENGIE Energie Nederland",
    "SVC-105": "ENGIE Energie Nederland",
    "SVC-106": "ENGIE Energie Nederland",
    "SVC-118": "Hago Nederland B.V.",
    "SVC-131": "SWB Wijkbeheer",
    "SVC-132": "ASSA ABLOY Entrance Systems",
    "SVC-111": "Techem Energy Services BV",
    "SVC-115": "Feenstra Verwarming B.V.",
    "SVC-127": "Feenstra Verwarming B.V.",
    "SVC-123": "Van Ginkel Groep B.V.",
    "SVC-116": "ISS Facility Services",
    "SVC-122": "Riool.nl (Rioned Groep)",
    "SVC-091": "",
  };

  // Base monthly amounts per service (total for building, will scale by VHE)
  const baseAmounts = {
    "SVC-108": 185, "SVC-102": 45, "SVC-104": 65, "SVC-105": 65,
    "SVC-106": 35, "SVC-118": 32, "SVC-131": 40, "SVC-132": 25,
    "SVC-111": 18, "SVC-115": 22, "SVC-127": 28, "SVC-123": 22,
    "SVC-116": 8, "SVC-122": 12, "SVC-091": -25,
  };

  // Generate Jan-Dec 2025 entries (we're in March 2026, so full year)
  const months2025 = Array.from({ length: 12 }, (_, i) => i + 1);

  serviceBuildingMap.forEach(({ bld, svcs }) => {
    const bldData = buildings.find(b => b.id === bld);
    const vheCount = bldData ? bldData.vhe : 20;

    svcs.forEach(svc => {
      const descs = descriptions[svc] || ["Maandbedrag"];
      const supplier = supplierMap[svc] || "";
      const baseAmt = baseAmounts[svc] || 30;

      months2025.forEach(month => {
        // Pick a description (cycle through available ones)
        const desc = descs[(month - 1) % descs.length];
        // Amount varies slightly per month (+/- 15%)
        const variance = 0.85 + Math.random() * 0.3;
        const amount = Math.round(baseAmt * vheCount * variance / 12 * 100) / 100;
        const day = Math.min(28, 5 + Math.floor(Math.random() * 20));
        const dateStr = `2025-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
        const invoiceRef = `INV-${String(month).padStart(2,"0")}${idx.toString().padStart(4,"0")}`;

        // Most entries booked, a few flagged or pending for recent months
        let status = "booked";
        if (month >= 11) {
          const r = Math.random();
          if (r < 0.15) status = "flagged";
          else if (r < 0.30) status = "pending";
        }

        // Flagged entries get a reason
        let flag = null;
        if (status === "flagged") {
          const flags = [
            { en: "Amount deviates >20% from budget", nl: "Bedrag wijkt >20% af van budget" },
            { en: "Duplicate invoice suspected", nl: "Mogelijk dubbele factuur" },
            { en: "Wrong cost center", nl: "Verkeerde kostenplaats" },
            { en: "Missing supplier reference", nl: "Ontbrekende leveranciersreferentie" },
          ];
          flag = flags[Math.floor(Math.random() * flags.length)];
        }

        entries.push({
          id: `LED-${String(idx).padStart(5,"0")}`,
          serviceId: svc,
          buildingId: bld,
          year: 2025,
          month,
          date: dateStr,
          description: desc,
          supplier,
          invoiceRef,
          amount,
          status,
          flag,
        });
        idx++;
      });
    });
  });

  return entries;
}

export const ledgerEntries = generateLedgerEntries();

// ── Ledger helper functions ──

export function getLedgerByService(serviceId, year = 2025) {
  return ledgerEntries.filter(e => e.serviceId === serviceId && e.year === year);
}

export function getLedgerByBuilding(buildingId, year = 2025) {
  return ledgerEntries.filter(e => e.buildingId === buildingId && e.year === year);
}

export function getLedgerByServiceAndBuilding(serviceId, buildingId, year = 2025) {
  return ledgerEntries.filter(e => e.serviceId === serviceId && e.buildingId === buildingId && e.year === year);
}

export function getLedgerSummaryByService(serviceId, year = 2025) {
  const entries = getLedgerByService(serviceId, year);
  const byBuilding = {};
  entries.forEach(e => {
    if (!byBuilding[e.buildingId]) {
      byBuilding[e.buildingId] = { total: 0, count: 0, flagged: 0, pending: 0 };
    }
    byBuilding[e.buildingId].total += e.amount;
    byBuilding[e.buildingId].count++;
    if (e.status === "flagged") byBuilding[e.buildingId].flagged++;
    if (e.status === "pending") byBuilding[e.buildingId].pending++;
  });
  return byBuilding;
}

export function getLedgerSummaryByBuilding(buildingId, year = 2025) {
  const entries = getLedgerByBuilding(buildingId, year);
  const byService = {};
  entries.forEach(e => {
    if (!byService[e.serviceId]) {
      byService[e.serviceId] = { total: 0, count: 0, flagged: 0, pending: 0 };
    }
    byService[e.serviceId].total += e.amount;
    byService[e.serviceId].count++;
    if (e.status === "flagged") byService[e.serviceId].flagged++;
    if (e.status === "pending") byService[e.serviceId].pending++;
  });
  return byService;
}
