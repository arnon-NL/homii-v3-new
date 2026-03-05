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
  { id: "DM-PRS",  code: "persons",     name: { en: "Number of persons",       nl: "Aantal personen" } },
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
  { id: "MTR-007-H1",  buildingId: "BLD-007", serviceId: "SVC-108", vheId: null,          type: "main",   utility: "heat",        meterNumber: "HM-20154782", unit: "GJ",  lastReading: 842.5,   readingDate: "2025-02-28", status: "active" },
  { id: "MTR-007-W1",  buildingId: "BLD-007", serviceId: "SVC-102", vheId: null,          type: "main",   utility: "water",       meterNumber: "WM-30298741", unit: "m³",  lastReading: 1256.3,  readingDate: "2025-02-28", status: "active" },
  { id: "MTR-007-E1",  buildingId: "BLD-007", serviceId: "SVC-105", vheId: null,          type: "main",   utility: "electricity", meterNumber: "EM-40187623", unit: "kWh", lastReading: 28450,   readingDate: "2025-02-28", status: "active" },
  // Kloostergang submeters (linked to VHEs)
  { id: "MTR-007-H1A", buildingId: "BLD-007", serviceId: "SVC-108", vheId: "VHE-007-001", type: "sub",    utility: "heat",        meterNumber: "HS-20154782-1A", unit: "GJ",  lastReading: 18.2,  readingDate: "2025-02-28", status: "active" },
  { id: "MTR-007-H1B", buildingId: "BLD-007", serviceId: "SVC-108", vheId: "VHE-007-002", type: "sub",    utility: "heat",        meterNumber: "HS-20154782-1B", unit: "GJ",  lastReading: 21.4,  readingDate: "2025-02-28", status: "active" },
  { id: "MTR-007-H2A", buildingId: "BLD-007", serviceId: "SVC-108", vheId: "VHE-007-003", type: "sub",    utility: "heat",        meterNumber: "HS-20154782-2A", unit: "GJ",  lastReading: 16.8,  readingDate: "2025-02-28", status: "active" },
  { id: "MTR-007-H2B", buildingId: "BLD-007", serviceId: "SVC-108", vheId: "VHE-007-004", type: "sub",    utility: "heat",        meterNumber: "HS-20154782-2B", unit: "GJ",  lastReading: 22.1,  readingDate: "2025-01-31", status: "active" },
  { id: "MTR-007-W1A", buildingId: "BLD-007", serviceId: "SVC-102", vheId: "VHE-007-001", type: "sub",    utility: "water",       meterNumber: "WS-30298741-1A", unit: "m³",  lastReading: 28.7,  readingDate: "2025-02-28", status: "active" },
  { id: "MTR-007-W1B", buildingId: "BLD-007", serviceId: "SVC-102", vheId: "VHE-007-002", type: "sub",    utility: "water",       meterNumber: "WS-30298741-1B", unit: "m³",  lastReading: 32.1,  readingDate: "2025-02-28", status: "active" },

  // De Lindeborg (BLD-004) main meters
  { id: "MTR-004-H1",  buildingId: "BLD-004", serviceId: "SVC-108", vheId: null,          type: "main",   utility: "heat",        meterNumber: "HM-20198432", unit: "GJ",  lastReading: 2810.6,  readingDate: "2025-02-28", status: "active" },
  { id: "MTR-004-W1",  buildingId: "BLD-004", serviceId: "SVC-102", vheId: null,          type: "main",   utility: "water",       meterNumber: "WM-30345612", unit: "m³",  lastReading: 4520.8,  readingDate: "2025-02-28", status: "active" },
  { id: "MTR-004-E1",  buildingId: "BLD-004", serviceId: "SVC-105", vheId: null,          type: "main",   utility: "electricity", meterNumber: "EM-40223198", unit: "kWh", lastReading: 95200,   readingDate: "2025-01-31", status: "warning" },
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
  // 2024 — completed year, various states
  { id: "STL-001-2024", buildingId: "BLD-001", year: 2024, status: "distributed", approvedAt: "2025-02-15", distributedAt: "2025-03-01", totalCost: 49800, totalVoorschot: 52000, netResult: 2200 },
  { id: "STL-002-2024", buildingId: "BLD-002", year: 2024, status: "approved",    approvedAt: "2025-02-28", distributedAt: null, totalCost: 231400, totalVoorschot: 236500, netResult: 5100 },
  { id: "STL-003-2024", buildingId: "BLD-003", year: 2024, status: "distributed", approvedAt: "2025-01-20", distributedAt: "2025-02-10", totalCost: 59200, totalVoorschot: 57750, netResult: -1450 },
  { id: "STL-004-2024", buildingId: "BLD-004", year: 2024, status: "in_review",   approvedAt: null, distributedAt: null, totalCost: 428600, totalVoorschot: 432000, netResult: 3400 },
  { id: "STL-005-2024", buildingId: "BLD-005", year: 2024, status: "in_review",   approvedAt: null, distributedAt: null, totalCost: 52100, totalVoorschot: 54000, netResult: 1900 },
  { id: "STL-006-2024", buildingId: "BLD-006", year: 2024, status: "approved",    approvedAt: "2025-03-01", distributedAt: null, totalCost: 23800, totalVoorschot: 24000, netResult: 200 },
  { id: "STL-007-2024", buildingId: "BLD-007", year: 2024, status: "distributed", approvedAt: "2025-01-15", distributedAt: "2025-02-01", totalCost: 41200, totalVoorschot: 42460, netResult: 1260 },
  { id: "STL-008-2024", buildingId: "BLD-008", year: 2024, status: "not_started", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 28500, netResult: null },
  { id: "STL-009-2024", buildingId: "BLD-009", year: 2024, status: "in_review",   approvedAt: null, distributedAt: null, totalCost: 107800, totalVoorschot: 110000, netResult: 2200 },
  { id: "STL-010-2024", buildingId: "BLD-010", year: 2024, status: "not_started", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 94500, netResult: null },
  { id: "STL-011-2024", buildingId: "BLD-011", year: 2024, status: "approved",    approvedAt: "2025-02-20", distributedAt: null, totalCost: 12400, totalVoorschot: 12500, netResult: 100 },
  { id: "STL-012-2024", buildingId: "BLD-012", year: 2024, status: "distributed", approvedAt: "2025-01-10", distributedAt: "2025-01-25", totalCost: 39600, totalVoorschot: 40250, netResult: 650 },
  { id: "STL-013-2024", buildingId: "BLD-013", year: 2024, status: "not_started", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 31500, netResult: null },
  { id: "STL-014-2024", buildingId: "BLD-014", year: 2024, status: "in_review",   approvedAt: null, distributedAt: null, totalCost: 118200, totalVoorschot: 121000, netResult: 2800 },
  { id: "STL-015-2024", buildingId: "BLD-015", year: 2024, status: "distributed", approvedAt: "2025-02-05", distributedAt: "2025-02-20", totalCost: 138500, totalVoorschot: 140000, netResult: 1500 },
  { id: "STL-016-2024", buildingId: "BLD-016", year: 2024, status: "approved",    approvedAt: "2025-03-02", distributedAt: null, totalCost: 27200, totalVoorschot: 27500, netResult: 300 },
  { id: "STL-017-2024", buildingId: "BLD-017", year: 2024, status: "not_started", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 42000, netResult: null },
  { id: "STL-018-2024", buildingId: "BLD-018", year: 2024, status: "in_review",   approvedAt: null, distributedAt: null, totalCost: 167400, totalVoorschot: 170000, netResult: 2600 },
  { id: "STL-019-2024", buildingId: "BLD-019", year: 2024, status: "distributed", approvedAt: "2025-01-30", distributedAt: "2025-02-15", totalCost: 34800, totalVoorschot: 35000, netResult: 200 },
  { id: "STL-020-2024", buildingId: "BLD-020", year: 2024, status: "approved",    approvedAt: "2025-02-25", distributedAt: null, totalCost: 155800, totalVoorschot: 157500, netResult: 1700 },
  { id: "STL-021-2024", buildingId: "BLD-021", year: 2024, status: "distributed", approvedAt: "2025-01-25", distributedAt: "2025-02-08", totalCost: 74200, totalVoorschot: 75000, netResult: 800 },

  // 2025 — current year, all monitoring
  ...buildings.map((b) => ({
    id: `STL-${b.id.replace("BLD-", "")}-2025`,
    buildingId: b.id,
    year: 2025,
    status: "monitoring",
    approvedAt: null,
    distributedAt: null,
    totalCost: null,
    totalVoorschot: b.budgetTotal,
    netResult: null,
  })),
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

export function getServicesByCategory() {
  return serviceCategories.map((cat) => ({
    ...cat,
    services: services.filter((s) => s.category === cat.id),
  }));
}

export function getCategory(categoryId) {
  return serviceCategories.find((c) => c.id === categoryId);
}
