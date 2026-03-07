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

// ── Supplier data ──
export const supplierCategories = [
  { id: "energy", name: { en: "Energy", nl: "Energie" } },
  { id: "water", name: { en: "Water", nl: "Water" } },
  { id: "facilities", name: { en: "Facilities", nl: "Facilitaire diensten" } },
  { id: "security", name: { en: "Security & Safety", nl: "Beveiging & Veiligheid" } },
  { id: "other", name: { en: "Other", nl: "Overig" } },
];

export const suppliers = [
  {
    id: "SUP-001", name: "ENGIE Energie Nederland", category: "energy",
    kvk: "34108453", city: "Zwolle", contactPerson: "R. van Dijk",
    email: "corporaties@engie.nl", phone: "+31 88 895 0000", website: "engie.nl",
    contractStart: "2022-01-01", contractEnd: "2025-12-31",
    serviceIds: ["SVC-104","SVC-105","SVC-106","SVC-107","SVC-108","SVC-110"],
    buildingCount: 21, annualSpend: 285000, status: "active", rating: 4,
    notes: { en: "Main energy supplier. Framework contract via Woonenergie.", nl: "Hoofdleverancier energie. Raamcontract via Woonenergie." },
  },
  {
    id: "SUP-002", name: "Oasen", category: "energy",
    kvk: "24289054", city: "Gouda", contactPerson: "M. Bakker",
    email: "zakelijk@oasen.nl", phone: "+31 182 59 36 36", website: "oasen.nl",
    contractStart: "2020-01-01", contractEnd: null,
    serviceIds: ["SVC-102"], buildingCount: 16, annualSpend: 42000, status: "active", rating: 4,
    notes: { en: "Regional water supplier for Gorinchem area.", nl: "Regionaal waterbedrijf voor regio Gorinchem." },
  },
  {
    id: "SUP-003", name: "Techem Energy Services BV", category: "metering",
    kvk: "30141780", city: "Arnhem", contactPerson: "J. Hendriks",
    email: "service@techem.nl", phone: "+31 26 355 1355", website: "techem.nl",
    contractStart: "2023-07-01", contractEnd: "2026-06-30",
    serviceIds: ["SVC-108","SVC-111"], buildingCount: 14, annualSpend: 38500, status: "active", rating: 3,
    notes: { en: "Metering services & heat cost allocation.", nl: "Meetdiensten & warmtekostenverdeling." },
  },
  {
    id: "SUP-004", name: "Joulz Meetbedrijf B.V.", category: "metering",
    kvk: "27258084", city: "Rotterdam", contactPerson: "A. Smits",
    email: "meetdiensten@joulz.nl", phone: "+31 88 454 5000", website: "joulz.nl",
    contractStart: "2021-04-01", contractEnd: "2025-03-31",
    serviceIds: ["SVC-108","SVC-111"], buildingCount: 8, annualSpend: 22400, status: "active", rating: 4,
    notes: { en: "Independent metering company. Contract renewal pending.", nl: "Onafhankelijk meetbedrijf. Contractverlenging in behandeling." },
  },
  {
    id: "SUP-005", name: "Stedin Netbeheer BV", category: "energy",
    kvk: "24306940", city: "Rotterdam", contactPerson: "Klantenservice Zakelijk",
    email: "zakelijk@stedin.net", phone: "+31 88 896 3096", website: "stedin.net",
    contractStart: "2019-01-01", contractEnd: null,
    serviceIds: ["SVC-108"], buildingCount: 12, annualSpend: 18600, status: "active", rating: 4,
    notes: { en: "Grid operator for Gorinchem region. Transport costs only.", nl: "Netbeheerder regio Gorinchem. Alleen transportkosten." },
  },
  {
    id: "SUP-006", name: "Schindler Liften B.V.", category: "installations",
    kvk: "33148680", city: "'s-Gravenhage", contactPerson: "P. de Groot",
    email: "service.nl@schindler.com", phone: "+31 70 399 2666", website: "schindler.nl",
    contractStart: "2023-01-01", contractEnd: "2027-12-31",
    serviceIds: ["SVC-132","SVC-133"], buildingCount: 6, annualSpend: 31200, status: "active", rating: 5,
    notes: { en: "Elevator maintenance & 24h emergency service.", nl: "Liftonderhoud & 24-uurs storingsdienst." },
  },
  {
    id: "SUP-007", name: "CSU Cleaning Services", category: "cleaning",
    kvk: "17098383", city: "Eindhoven", contactPerson: "K. Meijer",
    email: "corporaties@csu.nl", phone: "+31 40 290 4040", website: "csu.nl",
    contractStart: "2024-01-01", contractEnd: "2026-12-31",
    serviceIds: ["SVC-118","SVC-140"], buildingCount: 19, annualSpend: 89000, status: "active", rating: 3,
    notes: { en: "Cleaning common areas & window washing.", nl: "Schoonmaak algemene ruimten & glasbewassing." },
  },
  {
    id: "SUP-008", name: "ISS Facility Services", category: "cleaning",
    kvk: "33247775", city: "Utrecht", contactPerson: "L. Jansen",
    email: "info@nl.issworld.com", phone: "+31 30 242 4242", website: "issworld.com",
    contractStart: "2022-06-01", contractEnd: "2025-05-31",
    serviceIds: ["SVC-118","SVC-116"], buildingCount: 4, annualSpend: 28500, status: "active", rating: 4,
    notes: { en: "Facility services for larger complexes.", nl: "Facilitaire diensten voor grotere complexen." },
  },
  {
    id: "SUP-009", name: "Van Ginkel Groep B.V.", category: "cleaning",
    kvk: "30143506", city: "Veenendaal", contactPerson: "B. van Ginkel",
    email: "info@vanginkelgroep.nl", phone: "+31 318 54 58 00", website: "vanginkelgroep.nl",
    contractStart: "2023-03-01", contractEnd: "2026-02-28",
    serviceIds: ["SVC-123","SVC-124"], buildingCount: 8, annualSpend: 44000, status: "active", rating: 4,
    notes: { en: "Landscaping & gutter cleaning.", nl: "Tuinonderhoud & dakgootreiniging." },
  },
  {
    id: "SUP-010", name: "Feenstra Verwarming B.V.", category: "installations",
    kvk: "33176855", city: "Heemstede", contactPerson: "T. Visser",
    email: "service@feenstra.com", phone: "+31 23 547 5555", website: "feenstra.com",
    contractStart: "2021-10-01", contractEnd: "2025-09-30",
    serviceIds: ["SVC-115","SVC-126","SVC-127"], buildingCount: 10, annualSpend: 52000, status: "active", rating: 3,
    notes: { en: "Heating maintenance, geyser cleaning, and mechanical ventilation.", nl: "CV-onderhoud, geiserreinigen en mechanische ventilatie." },
  },
  {
    id: "SUP-011", name: "Riool.nl (Rioned Groep)", category: "cleaning",
    kvk: "09060847", city: "Arnhem", contactPerson: "W. Peters",
    email: "service@riool.nl", phone: "+31 26 365 1010", website: "riool.nl",
    contractStart: "2024-04-01", contractEnd: "2027-03-31",
    serviceIds: ["SVC-122"], buildingCount: 8, annualSpend: 12800, status: "active", rating: 5,
    notes: { en: "Drain cleaning & sewer maintenance.", nl: "Rioolontstopping & rioolonderhoud." },
  },
  {
    id: "SUP-012", name: "ASSA ABLOY Entrance Systems", category: "installations",
    kvk: "24337859", city: "Nieuwegein", contactPerson: "D. Mulder",
    email: "nl.entrance@assaabloy.com", phone: "+31 30 291 4444", website: "assaabloyentrance.nl",
    contractStart: "2023-06-01", contractEnd: "2026-05-31",
    serviceIds: ["SVC-171"], buildingCount: 4, annualSpend: 8400, status: "active", rating: 4,
    notes: { en: "Electric doors & access systems.", nl: "Elektrische deuren & toegangssystemen." },
  },
  {
    id: "SUP-013", name: "SWB Wijkbeheer", category: "management",
    kvk: "51434218", city: "Gorinchem", contactPerson: "H. van der Berg",
    email: "info@swb-wijkbeheer.nl", phone: "+31 183 62 44 00", website: "swb-wijkbeheer.nl",
    contractStart: "2020-01-01", contractEnd: "2025-12-31",
    serviceIds: ["SVC-131","SVC-137"], buildingCount: 17, annualSpend: 156000, status: "active", rating: 4,
    notes: { en: "Local caretaker & social support services.", nl: "Lokale huismeester & woonondersteunende diensten." },
  },
  {
    id: "SUP-014", name: "KPN Zakelijk", category: "management",
    kvk: "02045700", city: "Den Haag", contactPerson: "Accountteam Corporaties",
    email: "corporaties@kpn.com", phone: "+31 800 0403", website: "kpn.com/zakelijk",
    contractStart: "2024-07-01", contractEnd: "2026-06-30",
    serviceIds: ["SVC-142"], buildingCount: 2, annualSpend: 7200, status: "active", rating: 3,
    notes: { en: "Communal internet for two complexes. Pilot project.", nl: "Collectief internet voor twee complexen. Pilotproject." },
  },
  {
    id: "SUP-015", name: "Centraal Beheer Verzekeringen", category: "management",
    kvk: "27099838", city: "Apeldoorn", contactPerson: "Verzekeringsdesk Wonen",
    email: "wonen@centraalbeheer.nl", phone: "+31 55 579 8111", website: "centraalbeheer.nl",
    contractStart: "2023-01-01", contractEnd: "2025-12-31",
    serviceIds: ["SVC-036"], buildingCount: 1, annualSpend: 3200, status: "active", rating: 4,
    notes: { en: "Collective glass insurance policy.", nl: "Collectieve glasverzekering." },
  },
  {
    id: "SUP-016", name: "Hydro Building Systems BV", category: "installations",
    kvk: "08098654", city: "Harderwijk", contactPerson: "G. Dijkstra",
    email: "service@hydrobuildingsystems.nl", phone: "+31 341 46 3200", website: "hydrobuildingsystems.nl",
    contractStart: "2022-03-01", contractEnd: "2025-02-28",
    serviceIds: ["SVC-120"], buildingCount: 3, annualSpend: 5400, status: "expiring", rating: 3,
    notes: { en: "Hydrophore pump maintenance. Contract expired, renewal pending.", nl: "Hydrofooronderhoud. Contract verlopen, verlenging in behandeling." },
  },
];

// ── Building-Service relationships ──
function generateBuildingServices() {
  const entries = [];
  let id = 1;

  // Service-building mapping (which services each building has)
  const serviceBuildingMap = [
    { bld: "BLD-001", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-111","SVC-127","SVC-123"] },
    { bld: "BLD-002", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-132","SVC-111","SVC-123","SVC-116","SVC-106"] },
    { bld: "BLD-003", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-127"] },
    { bld: "BLD-004", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-132","SVC-111","SVC-115","SVC-123","SVC-116","SVC-106"] },
    { bld: "BLD-005", svcs: ["SVC-108","SVC-102","SVC-118","SVC-131","SVC-123","SVC-115"] },
    { bld: "BLD-006", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-111","SVC-132","SVC-123"] },
    { bld: "BLD-007", svcs: ["SVC-108","SVC-102","SVC-105","SVC-131","SVC-118","SVC-127","SVC-123"] },
    { bld: "BLD-008", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-132","SVC-111","SVC-115","SVC-123","SVC-116","SVC-106","SVC-127"] },
    { bld: "BLD-009", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-123","SVC-111","SVC-132","SVC-115","SVC-116","SVC-106","SVC-127","SVC-120"] },
    { bld: "BLD-010", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-111","SVC-127","SVC-123","SVC-122"] },
    { bld: "BLD-011", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-123","SVC-132","SVC-115"] },
    { bld: "BLD-012", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-131","SVC-132","SVC-111","SVC-123","SVC-116","SVC-118","SVC-115","SVC-127"] },
    { bld: "BLD-013", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-127","SVC-104"] },
    { bld: "BLD-014", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-104"] },
    { bld: "BLD-015", svcs: ["SVC-108","SVC-102","SVC-105","SVC-131","SVC-127","SVC-123","SVC-091"] },
    { bld: "BLD-016", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-132","SVC-104"] },
    { bld: "BLD-017", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-111","SVC-123","SVC-132","SVC-116","SVC-115","SVC-106","SVC-127","SVC-127"] },
    { bld: "BLD-018", svcs: ["SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-122"] },
    { bld: "BLD-019", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-111","SVC-127","SVC-123"] },
    { bld: "BLD-020", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-132","SVC-111","SVC-123","SVC-116","SVC-106","SVC-115","SVC-127"] },
    { bld: "BLD-021", svcs: ["SVC-108","SVC-102","SVC-105","SVC-131","SVC-127","SVC-123","SVC-091","SVC-104"] },
  ];

  const baseAmounts = {
    "SVC-108": 185, "SVC-102": 45, "SVC-104": 65, "SVC-105": 65,
    "SVC-106": 35, "SVC-118": 55, "SVC-131": 120, "SVC-132": 35,
    "SVC-111": 18, "SVC-115": 22, "SVC-127": 28, "SVC-123": 50,
    "SVC-116": 8, "SVC-122": 12, "SVC-091": -25, "SVC-120": 12,
  };

  const distributionMethods = {
    "SVC-108": "metered", "SVC-102": "metered", "SVC-104": "metered", "SVC-105": "equal",
    "SVC-106": "metered", "SVC-118": "m2", "SVC-131": "equal", "SVC-132": "equal",
    "SVC-111": "equal", "SVC-115": "equal", "SVC-127": "equal", "SVC-123": "equal",
    "SVC-116": "equal", "SVC-122": "equal", "SVC-091": "equal", "SVC-120": "equal",
  };

  serviceBuildingMap.forEach(({ bld, svcs }) => {
    const bldData = buildings.find(b => b.id === bld);
    const vheCount = bldData ? bldData.vhe : 20;

    svcs.forEach(svc => {
      const baseAmt = baseAmounts[svc] || 30;
      const distMethod = distributionMethods[svc] || "equal";

      // 2024 - fully complete
      const amt2024 = Math.round(baseAmt * vheCount * 12 * 100) / 100;
      entries.push({
        id: `BS-${bld.split("-")[1]}-${svc.split("-")[1]}-2024`,
        buildingId: bld,
        serviceId: svc,
        year: 2024,
        distributionMethod: distMethod,
        budget: amt2024,
        actual: Math.round(amt2024 * (0.95 + Math.random() * 0.1) * 100) / 100,
        ledgerEntries: 12,
        expectedEntries: 12,
        completeness: 100,
        status: "complete",
        locked: true,
      });

      // 2025 - mixed completeness
      const amt2025 = Math.round(baseAmt * vheCount * 12 * 1.02 * 100) / 100;
      const completeness2025 = 75 + Math.floor(Math.random() * 26);
      const status2025 = completeness2025 === 100 ? "complete" : "incomplete";
      entries.push({
        id: `BS-${bld.split("-")[1]}-${svc.split("-")[1]}-2025`,
        buildingId: bld,
        serviceId: svc,
        year: 2025,
        distributionMethod: distMethod,
        budget: amt2025,
        actual: Math.round(amt2025 * (completeness2025 / 100) * (0.95 + Math.random() * 0.1) * 100) / 100,
        ledgerEntries: Math.floor(completeness2025 / 100 * 12),
        expectedEntries: 12,
        completeness: completeness2025,
        status: status2025,
      });

      // 2026 - Q1 only (25% completeness at most)
      const amt2026 = Math.round(baseAmt * vheCount * 3 * 1.03 * 100) / 100;
      entries.push({
        id: `BS-${bld.split("-")[1]}-${svc.split("-")[1]}-2026`,
        buildingId: bld,
        serviceId: svc,
        year: 2026,
        distributionMethod: distMethod,
        budget: Math.round(baseAmt * vheCount * 12 * 1.03 * 100) / 100,
        actual: amt2026,
        ledgerEntries: 3,
        expectedEntries: 12,
        completeness: 25,
        status: "incomplete",
      });
    });
  });

  return entries;
}

export const buildingServices = generateBuildingServices();

// ── VHE (Verhuurbare Eenheden / Rental Units) ──
function generateVhes() {
  const vhes = [];
  let vheCounter = 1;

  const vheConfigs = [
    { buildingId: "BLD-001", count: 26, street: "Havendijk", startNum: 1, m2Range: [55, 85], floors: 4 },
    { buildingId: "BLD-002", count: 86, street: "Bogerdstraat", startNum: 1, m2Range: [48, 95], floors: 8 },
    { buildingId: "BLD-003", count: 33, street: "Korenbloemplein", startNum: 1, m2Range: [52, 80], floors: 4 },
    { buildingId: "BLD-004", count: 144, street: "Haarstraat", startNum: 101, m2Range: [60, 95], floors: 10 },
    { buildingId: "BLD-005", count: 16, street: "Vicarisweg", startNum: 1, m2Range: [48, 72], floors: 3 },
    { buildingId: "BLD-006", count: 30, street: "Kennelweg", startNum: 31, m2Range: [55, 85], floors: 3 },
    { buildingId: "BLD-007", count: 44, street: "Kloostergang", startNum: 1, m2Range: [55, 85], floors: 4 },
    { buildingId: "BLD-008", count: 65, street: "IJsbaanlaan", startNum: 1, m2Range: [52, 90], floors: 7 },
    { buildingId: "BLD-009", count: 96, street: "Munterhof", startNum: 1, m2Range: [48, 88], floors: 9 },
    { buildingId: "BLD-010", count: 9, street: "Schelluinsevliet", startNum: 1, m2Range: [50, 75], floors: 2 },
    { buildingId: "BLD-011", count: 40, street: "Schelluinsevliet", startNum: 50, m2Range: [52, 82], floors: 4 },
    { buildingId: "BLD-012", count: 90, street: "Tichelaarsweg", startNum: 1, m2Range: [55, 90], floors: 8 },
    { buildingId: "BLD-013", count: 30, street: "Valkeniersweg", startNum: 1, m2Range: [55, 80], floors: 3 },
    { buildingId: "BLD-014", count: 24, street: "Valkeniersweg", startNum: 109, m2Range: [52, 78], floors: 3 },
    { buildingId: "BLD-015", count: 18, street: "Valkeniersweg", startNum: 157, m2Range: [50, 75], floors: 2 },
    { buildingId: "BLD-016", count: 24, street: "Valkeniersweg", startNum: 61, m2Range: [52, 78], floors: 3 },
    { buildingId: "BLD-017", count: 138, street: "Frisoplein", startNum: 1, m2Range: [48, 95], floors: 10 },
    { buildingId: "BLD-018", count: 10, street: "Clarastraat", startNum: 1, m2Range: [50, 72], floors: 2 },
    { buildingId: "BLD-019", count: 25, street: "Blauwe Keizerstraat", startNum: 1, m2Range: [55, 85], floors: 3 },
    { buildingId: "BLD-020", count: 135, street: "Piazza", startNum: 1, m2Range: [48, 92], floors: 9 },
    { buildingId: "BLD-021", count: 71, street: "Boogstraat", startNum: 1, m2Range: [52, 88], floors: 7 },
  ];

  // Services per building (for voorschotBreakdown)
  const buildingServicesList = {
    "BLD-001": ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-111","SVC-127","SVC-123"],
    "BLD-002": ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-132","SVC-111","SVC-123","SVC-116","SVC-106"],
    "BLD-003": ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-127"],
    "BLD-004": ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-132","SVC-111","SVC-115","SVC-123","SVC-116","SVC-106"],
    "BLD-005": ["SVC-108","SVC-102","SVC-118","SVC-131","SVC-123","SVC-115"],
    "BLD-006": ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-111","SVC-132","SVC-123"],
    "BLD-007": ["SVC-108","SVC-102","SVC-105","SVC-131","SVC-118","SVC-127","SVC-123"],
    "BLD-008": ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-132","SVC-111","SVC-115","SVC-123","SVC-116","SVC-106","SVC-127"],
    "BLD-009": ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-123","SVC-111","SVC-132","SVC-115","SVC-116","SVC-106","SVC-127","SVC-120"],
    "BLD-010": ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-111","SVC-127","SVC-123","SVC-122"],
    "BLD-011": ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-123","SVC-132","SVC-115"],
    "BLD-012": ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-131","SVC-132","SVC-111","SVC-123","SVC-116","SVC-118","SVC-115","SVC-127"],
    "BLD-013": ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-127","SVC-104"],
    "BLD-014": ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-104"],
    "BLD-015": ["SVC-108","SVC-102","SVC-105","SVC-131","SVC-127","SVC-123","SVC-091"],
    "BLD-016": ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-132","SVC-104"],
    "BLD-017": ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-111","SVC-123","SVC-132","SVC-116","SVC-115","SVC-106","SVC-127"],
    "BLD-018": ["SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-122"],
    "BLD-019": ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-111","SVC-127","SVC-123"],
    "BLD-020": ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-132","SVC-111","SVC-123","SVC-116","SVC-106","SVC-115","SVC-127"],
    "BLD-021": ["SVC-108","SVC-102","SVC-105","SVC-131","SVC-127","SVC-123","SVC-091","SVC-104"],
  };

  const serviceLongNames = {
    "SVC-108": "Warmtekosten",
    "SVC-102": "Koud water",
    "SVC-104": "Warm water",
    "SVC-105": "Elektra algemeen",
    "SVC-106": "Elektra woonruimte",
    "SVC-118": "Schoonmaak",
    "SVC-131": "Huismeester",
    "SVC-132": "Lift onderhoud",
    "SVC-111": "Verbruiksmeters",
    "SVC-115": "Storingsdienst CV",
    "SVC-127": "Ventilatie",
    "SVC-123": "Tuinonderhoud",
    "SVC-116": "Lampen vervanging",
    "SVC-122": "Rioolreiniging",
    "SVC-091": "Zonnepanelen",
    "SVC-120": "Hydrofoor",
  };

  vheConfigs.forEach(config => {
    const bldData = buildings.find(b => b.id === config.buildingId);
    const bldServices = buildingServicesList[config.buildingId] || [];

    for (let i = 0; i < config.count; i++) {
      const unitNum = config.startNum + i;
      const floor = i % config.floors;
      const m2 = config.m2Range[0] + Math.floor(Math.random() * (config.m2Range[1] - config.m2Range[0] + 1));

      // Determine address suffix
      let addressSuffix = "";
      if (unitNum % 2 === 0) addressSuffix = "A";
      else addressSuffix = "B";
      if (floor > 0) addressSuffix += floor;

      const address = `${config.street} ${unitNum}${addressSuffix}`;
      const isVacant = Math.random() < 0.03; // 3% vacancy rate
      const isInMutation = !isVacant && Math.random() < 0.02; // 2% in-mutation

      // Calculate voorschot breakdown
      const vorschootBreakdown = [];
      let totalVoorscht = 0;

      bldServices.forEach(svcId => {
        const service = services.find(s => s.id === svcId);
        const baseAmount = service ? service.avgCostPerVhe : 50;

        // Scale by m2 for metered services
        let amount = baseAmount;
        if (["SVC-108", "SVC-102", "SVC-104", "SVC-106"].includes(svcId)) {
          amount = Math.round(baseAmount * (m2 / 70) * 100) / 100;
        }

        vorschootBreakdown.push({
          serviceId: svcId,
          serviceName: serviceLongNames[svcId] || service.name.nl,
          amount: amount,
        });
        totalVoorscht += amount;
      });

      totalVoorscht = Math.round(totalVoorscht * 100) / 100;

      vhes.push({
        id: `VHE-${config.buildingId.split("-")[1]}-${String(i + 1).padStart(3, "0")}`,
        buildingId: config.buildingId,
        address,
        unit: String(unitNum),
        type: Math.random() < 0.1 ? "studio" : "apartment",
        floor,
        m2,
        contract: isVacant || isInMutation ? null : {
          id: `CTR-${config.buildingId.split("-")[1]}-${String(i + 1).padStart(3, "0")}`,
          status: "active",
          startDate: new Date(2015 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28)).toISOString().split("T")[0],
          endDate: null,
        },
        voorschot: isVacant || isInMutation ? 0 : totalVoorscht,
        status: isVacant ? "vacant" : isInMutation ? "in-mutation" : "active",
        voorschotBreakdown: isVacant || isInMutation ? [] : vorschootBreakdown,
      });
    }
  });

  return vhes;
}

export const vhes = generateVhes();

// ── Meters ──
function generateMeters() {
  const meters = [];
  let idx = 1;

  const vheConfigs = [
    { buildingId: "BLD-001", count: 26 },
    { buildingId: "BLD-002", count: 86 },
    { buildingId: "BLD-003", count: 33 },
    { buildingId: "BLD-004", count: 144 },
    { buildingId: "BLD-005", count: 16 },
    { buildingId: "BLD-006", count: 30 },
    { buildingId: "BLD-007", count: 44 },
    { buildingId: "BLD-008", count: 65 },
    { buildingId: "BLD-009", count: 96 },
    { buildingId: "BLD-010", count: 9 },
    { buildingId: "BLD-011", count: 40 },
    { buildingId: "BLD-012", count: 90 },
    { buildingId: "BLD-013", count: 30 },
    { buildingId: "BLD-014", count: 24 },
    { buildingId: "BLD-015", count: 18 },
    { buildingId: "BLD-016", count: 24 },
    { buildingId: "BLD-017", count: 138 },
    { buildingId: "BLD-018", count: 10 },
    { buildingId: "BLD-019", count: 25 },
    { buildingId: "BLD-020", count: 135 },
    { buildingId: "BLD-021", count: 71 },
  ];

  vheConfigs.forEach(config => {
    const bldNum = config.buildingId.split("-")[1].padStart(3, "0");
    const bldVhes = vhes.filter(v => v.buildingId === config.buildingId);

    // Main meters per utility
    const utilities = ["heat", "water", "electricity"];
    let mainHeatStart = 500 + Math.random() * 300;
    let mainWaterStart = 1000 + Math.random() * 400;
    let mainElecStart = 20000 + Math.random() * 10000;

    const mainHeatEnd = mainHeatStart + (50 + Math.random() * 150);
    const mainWaterEnd = mainWaterStart + (100 + Math.random() * 250);
    const mainElecEnd = mainElecStart + (5000 + Math.random() * 15000);

    // 2024-2026 readings for main meters
    const heatReadings = {
      2024: { start: mainHeatStart * 0.7, end: mainHeatStart, consumption: mainHeatStart * 0.3, readingDate: "2024-12-31" },
      2025: { start: mainHeatStart, end: mainHeatEnd, consumption: mainHeatEnd - mainHeatStart, readingDate: "2025-12-31" },
      2026: { start: mainHeatEnd, end: mainHeatEnd + (mainHeatEnd - mainHeatStart) * 0.23, consumption: (mainHeatEnd - mainHeatStart) * 0.23, readingDate: "2026-02-28" },
    };

    const waterReadings = {
      2024: { start: mainWaterStart * 0.7, end: mainWaterStart, consumption: mainWaterStart * 0.3, readingDate: "2024-12-31" },
      2025: { start: mainWaterStart, end: mainWaterEnd, consumption: mainWaterEnd - mainWaterStart, readingDate: "2025-12-31" },
      2026: { start: mainWaterEnd, end: mainWaterEnd + (mainWaterEnd - mainWaterStart) * 0.23, consumption: (mainWaterEnd - mainWaterStart) * 0.23, readingDate: "2026-02-28" },
    };

    const elecReadings = {
      2024: { start: mainElecStart * 0.7, end: mainElecStart, consumption: mainElecStart * 0.3, readingDate: "2024-12-31" },
      2025: { start: mainElecStart, end: mainElecEnd, consumption: mainElecEnd - mainElecStart, readingDate: "2025-12-31" },
      2026: { start: mainElecEnd, end: mainElecEnd + (mainElecEnd - mainElecStart) * 0.23, consumption: (mainElecEnd - mainElecStart) * 0.23, readingDate: "2026-02-28" },
    };

    // Main meters
    meters.push({
      id: `MTR-${bldNum}-H`,
      buildingId: config.buildingId,
      vheId: null,
      type: "main",
      utility: "heat",
      meterNumber: `HM-${20000 + Math.floor(Math.random() * 89999)}`,
      ean: `871687${Math.random().toString().substring(2, 8)}${Math.floor(Math.random() * 1e13)}`,
      unit: "GJ",
      readings: heatReadings,
      status: "active",
    });

    meters.push({
      id: `MTR-${bldNum}-W`,
      buildingId: config.buildingId,
      vheId: null,
      type: "main",
      utility: "water",
      meterNumber: `WM-${30000 + Math.floor(Math.random() * 89999)}`,
      ean: null,
      unit: "m³",
      readings: waterReadings,
      status: "active",
    });

    meters.push({
      id: `MTR-${bldNum}-E`,
      buildingId: config.buildingId,
      vheId: null,
      type: "main",
      utility: "electricity",
      meterNumber: `EM-${40000 + Math.floor(Math.random() * 89999)}`,
      ean: `871687${Math.random().toString().substring(2, 8)}${Math.floor(Math.random() * 1e13)}`,
      unit: "kWh",
      readings: elecReadings,
      status: Math.random() < 0.1 ? "warning" : "active",
    });

    // Submeters for each VHE with active contracts
    const activeVhes = bldVhes.filter(v => v.contract !== null);
    const vheCount = activeVhes.length;

    // Pre-calculate factors for each VHE to ensure they sum to 1.0
    const heatFactors = [];
    const waterFactors = [];
    let heatFactorSum = 0;
    let waterFactorSum = 0;

    activeVhes.forEach(() => {
      const hf = 0.8 + Math.random() * 0.4;
      const wf = 0.8 + Math.random() * 0.4;
      heatFactors.push(hf);
      waterFactors.push(wf);
      heatFactorSum += hf;
      waterFactorSum += wf;
    });

    // Normalize factors to sum to 1.0
    const normalizedHeatFactors = heatFactors.map(f => f / heatFactorSum);
    const normalizedWaterFactors = waterFactors.map(f => f / waterFactorSum);

    activeVhes.forEach((vhe, idx) => {
      const vheNum = vhe.id.split("-")[2];

      // Submeter heat - use normalized factor
      const subHeatConsumption2025 = (mainHeatEnd - mainHeatStart) * normalizedHeatFactors[idx];
      const subHeatStart = mainHeatStart * 0.7 * normalizedHeatFactors[idx];
      const subHeatEnd = subHeatStart + subHeatConsumption2025;

      meters.push({
        id: `MTR-${bldNum}-H-${vheNum}`,
        buildingId: config.buildingId,
        vheId: vhe.id,
        type: "sub",
        utility: "heat",
        meterNumber: `HS-${20000 + Math.floor(Math.random() * 89999)}-${vheNum}`,
        ean: null,
        unit: "GJ",
        readings: {
          2024: { start: subHeatStart * 0.7, end: subHeatStart, consumption: subHeatStart * 0.3, readingDate: "2024-12-31" },
          2025: { start: subHeatStart, end: subHeatEnd, consumption: subHeatConsumption2025, readingDate: "2025-12-31" },
          2026: { start: subHeatEnd, end: subHeatEnd + subHeatConsumption2025 * 0.23, consumption: subHeatConsumption2025 * 0.23, readingDate: "2026-02-28" },
        },
        status: "active",
      });

      // Submeter water - use normalized factor
      const subWaterConsumption2025 = (mainWaterEnd - mainWaterStart) * normalizedWaterFactors[idx];
      const subWaterStart = mainWaterStart * 0.7 * normalizedWaterFactors[idx];
      const subWaterEnd = subWaterStart + subWaterConsumption2025;

      meters.push({
        id: `MTR-${bldNum}-W-${vheNum}`,
        buildingId: config.buildingId,
        vheId: vhe.id,
        type: "sub",
        utility: "water",
        meterNumber: `WS-${30000 + Math.floor(Math.random() * 89999)}-${vheNum}`,
        ean: null,
        unit: "m³",
        readings: {
          2024: { start: subWaterStart * 0.7, end: subWaterStart, consumption: subWaterStart * 0.3, readingDate: "2024-12-31" },
          2025: { start: subWaterStart, end: subWaterEnd, consumption: subWaterConsumption2025, readingDate: "2025-12-31" },
          2026: { start: subWaterEnd, end: subWaterEnd + subWaterConsumption2025 * 0.23, consumption: subWaterConsumption2025 * 0.23, readingDate: "2026-02-28" },
        },
        status: "active",
      });
    });
  });

  return meters;
}

export const meters = generateMeters();

// ── Activities ──
export const activities = [
  { id: "ACT-001", buildingId: "BLD-007", type: "meter_reading",   date: "2026-02-28", description: { en: "Heat meter reading received: 842.5 GJ",            nl: "Warmtemeterstand ontvangen: 842,5 GJ" } },
  { id: "ACT-002", buildingId: "BLD-007", type: "ledger_entry",    date: "2026-02-15", description: { en: "Ledger entry posted: Cleaning Q1 2026 — €1,320",    nl: "Boekingsregel verwerkt: Schoonmaak Q1 2026 — €1.320" } },
  { id: "ACT-003", buildingId: "BLD-007", type: "distribution",    date: "2026-01-10", description: { en: "Distribution method updated for Cleaning: m² → equal", nl: "Verdeelsleutel gewijzigd voor Schoonmaak: m² → gelijk" } },
  { id: "ACT-004", buildingId: "BLD-004", type: "meter_reading",   date: "2026-02-28", description: { en: "Heat meter reading received: 2,810.6 GJ",          nl: "Warmtemeterstand ontvangen: 2.810,6 GJ" } },
  { id: "ACT-005", buildingId: "BLD-004", type: "alert",           date: "2026-02-18", description: { en: "Electricity meter reading overdue (last: Jan 31)",   nl: "Elektrameterstand te laat (laatste: 31 jan)" } },
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

export function getBuildingServicesByYear(buildingId) {
  const result = {};
  [2024, 2025, 2026].forEach(year => {
    result[year] = buildingServices.filter((bs) => bs.buildingId === buildingId && bs.year === year);
  });
  return result;
}

export function getVhesByBuilding(buildingId) {
  return vhes.filter((v) => v.buildingId === buildingId);
}

export function getMetersByBuilding(buildingId) {
  return meters.filter((m) => m.buildingId === buildingId);
}

export function getSubmetersByVhe(vheId) {
  return meters.filter((m) => m.vheId === vheId && m.type === "sub");
}

export function getVheMeterReadings(vheId, year) {
  const vheMeters = getSubmetersByVhe(vheId);
  return vheMeters.map(m => ({
    meterId: m.id,
    utility: m.utility,
    readings: m.readings[year] || null,
  }));
}

export function getActivitiesByBuilding(buildingId) {
  return activities.filter((a) => a.buildingId === buildingId).sort((a, b) => b.date.localeCompare(a.date));
}

export function getDistributionMethod(code) {
  return distributionMethods.find((dm) => dm.code === code);
}

export function getSupplier(id) {
  return suppliers.find((s) => s.id === id);
}

export function getSuppliersByService(serviceId) {
  return suppliers.filter((s) => s.serviceIds?.includes(serviceId));
}

export function getSuppliersByCategory(categoryId) {
  return suppliers.filter((s) => s.category === categoryId);
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
  { id: "STL-008-2024", buildingId: "BLD-008", year: 2024, status: "distributed", approvedAt: "2025-06-10", distributedAt: "2025-07-01", totalCost: 208800, totalVoorschot: 211250, netResult: 2450 },
  { id: "STL-009-2024", buildingId: "BLD-009", year: 2024, status: "distributed", approvedAt: "2025-04-22", distributedAt: "2025-05-10", totalCost: 328800, totalVoorschot: 336000, netResult: 7200 },
  { id: "STL-010-2024", buildingId: "BLD-010", year: 2024, status: "distributed", approvedAt: "2025-07-05", distributedAt: "2025-07-20", totalCost: 10800,  totalVoorschot: 11250,  netResult: 450 },
  { id: "STL-011-2024", buildingId: "BLD-011", year: 2024, status: "distributed", approvedAt: "2025-02-20", distributedAt: "2025-03-10", totalCost: 87000,  totalVoorschot: 90000,  netResult: 3000 },
  { id: "STL-012-2024", buildingId: "BLD-012", year: 2024, status: "distributed", approvedAt: "2025-01-10", distributedAt: "2025-01-25", totalCost: 262000, totalVoorschot: 270000, netResult: 8000 },
  { id: "STL-013-2024", buildingId: "BLD-013", year: 2024, status: "distributed", approvedAt: "2025-08-01", distributedAt: "2025-08-15", totalCost: 57600,  totalVoorschot: 60000,  netResult: 2400 },
  { id: "STL-014-2024", buildingId: "BLD-014", year: 2024, status: "distributed", approvedAt: "2025-05-20", distributedAt: "2025-06-05", totalCost: 40500,  totalVoorschot: 42000,  netResult: 1500 },
  { id: "STL-015-2024", buildingId: "BLD-015", year: 2024, status: "distributed", approvedAt: "2025-02-05", distributedAt: "2025-02-20", totalCost: 25900,  totalVoorschot: 27000,  netResult: 1100 },
  { id: "STL-016-2024", buildingId: "BLD-016", year: 2024, status: "distributed", approvedAt: "2025-03-02", distributedAt: "2025-03-18", totalCost: 40200,  totalVoorschot: 42000,  netResult: 1800 },
  { id: "STL-017-2024", buildingId: "BLD-017", year: 2024, status: "distributed", approvedAt: "2025-09-10", distributedAt: "2025-09-25", totalCost: 468000, totalVoorschot: 483000, netResult: 15000 },
  { id: "STL-018-2024", buildingId: "BLD-018", year: 2024, status: "distributed", approvedAt: "2025-06-15", distributedAt: "2025-07-01", totalCost: 11900,  totalVoorschot: 12500,  netResult: 600 },
  { id: "STL-019-2024", buildingId: "BLD-019", year: 2024, status: "distributed", approvedAt: "2025-01-30", distributedAt: "2025-02-15", totalCost: 48000,  totalVoorschot: 50000,  netResult: 2000 },
  { id: "STL-020-2024", buildingId: "BLD-020", year: 2024, status: "distributed", approvedAt: "2025-02-25", distributedAt: "2025-03-12", totalCost: 424000, totalVoorschot: 438750, netResult: 14750 },
  { id: "STL-021-2024", buildingId: "BLD-021", year: 2024, status: "distributed", approvedAt: "2025-01-25", distributedAt: "2025-02-08", totalCost: 187800, totalVoorschot: 195250, netResult: 7450 },

  // 2025 — settlement year (we are in March 2026, various settlement states)
  { id: "STL-001-2025", buildingId: "BLD-001", year: 2025, status: "distributed", approvedAt: "2026-01-20", distributedAt: "2026-02-05", totalCost: 50400,  totalVoorschot: 52000,  netResult: 1600 },
  { id: "STL-002-2025", buildingId: "BLD-002", year: 2025, status: "approved",    approvedAt: "2026-02-28", distributedAt: null,         totalCost: 234200, totalVoorschot: 236500, netResult: 2300 },
  { id: "STL-003-2025", buildingId: "BLD-003", year: 2025, status: "distributed", approvedAt: "2026-01-15", distributedAt: "2026-02-01", totalCost: 58100,  totalVoorschot: 57750,  netResult: -350 },
  { id: "STL-004-2025", buildingId: "BLD-004", year: 2025, status: "in_review",   approvedAt: null,         distributedAt: null,         totalCost: 430500, totalVoorschot: 432000, netResult: 1500 },
  { id: "STL-005-2025", buildingId: "BLD-005", year: 2025, status: "in_review",   approvedAt: null,         distributedAt: null,         totalCost: 53200,  totalVoorschot: 54000,  netResult: 800 },
  { id: "STL-006-2025", buildingId: "BLD-006", year: 2025, status: "approved",    approvedAt: "2026-03-01", distributedAt: null,         totalCost: 65800,  totalVoorschot: 67500,  netResult: 1700 },
  { id: "STL-007-2025", buildingId: "BLD-007", year: 2025, status: "distributed", approvedAt: "2026-01-10", distributedAt: "2026-01-25", totalCost: 108200, totalVoorschot: 110000, netResult: 1800 },
  { id: "STL-008-2025", buildingId: "BLD-008", year: 2025, status: "in_review",   approvedAt: null,         distributedAt: null,         totalCost: 207500, totalVoorschot: 211250, netResult: 3750 },
  { id: "STL-009-2025", buildingId: "BLD-009", year: 2025, status: "in_review",   approvedAt: null,         distributedAt: null,         totalCost: 332000, totalVoorschot: 336000, netResult: 4000 },
  { id: "STL-010-2025", buildingId: "BLD-010", year: 2025, status: "monitoring",  approvedAt: null,         distributedAt: null,         totalCost: 10900,  totalVoorschot: 11250,  netResult: 350 },
  { id: "STL-011-2025", buildingId: "BLD-011", year: 2025, status: "approved",    approvedAt: "2026-02-15", distributedAt: null,         totalCost: 88500,  totalVoorschot: 90000,  netResult: 1500 },
  { id: "STL-012-2025", buildingId: "BLD-012", year: 2025, status: "distributed", approvedAt: "2026-01-05", distributedAt: "2026-01-20", totalCost: 267500, totalVoorschot: 270000, netResult: 2500 },
  { id: "STL-013-2025", buildingId: "BLD-013", year: 2025, status: "monitoring",  approvedAt: null,         distributedAt: null,         totalCost: 58200,  totalVoorschot: 60000,  netResult: 1800 },
  { id: "STL-014-2025", buildingId: "BLD-014", year: 2025, status: "in_review",   approvedAt: null,         distributedAt: null,         totalCost: 41200,  totalVoorschot: 42000,  netResult: 800 },
  { id: "STL-015-2025", buildingId: "BLD-015", year: 2025, status: "distributed", approvedAt: "2026-02-01", distributedAt: "2026-02-18", totalCost: 26200,  totalVoorschot: 27000,  netResult: 800 },
  { id: "STL-016-2025", buildingId: "BLD-016", year: 2025, status: "approved",    approvedAt: "2026-03-02", distributedAt: null,         totalCost: 41500,  totalVoorschot: 42000,  netResult: 500 },
  { id: "STL-017-2025", buildingId: "BLD-017", year: 2025, status: "monitoring",  approvedAt: null,         distributedAt: null,         totalCost: 475000, totalVoorschot: 483000, netResult: 8000 },
  { id: "STL-018-2025", buildingId: "BLD-018", year: 2025, status: "in_review",   approvedAt: null,         distributedAt: null,         totalCost: 12100,  totalVoorschot: 12500,  netResult: 400 },
  { id: "STL-019-2025", buildingId: "BLD-019", year: 2025, status: "distributed", approvedAt: "2026-01-28", distributedAt: "2026-02-12", totalCost: 49200,  totalVoorschot: 50000,  netResult: 800 },
  { id: "STL-020-2025", buildingId: "BLD-020", year: 2025, status: "approved",    approvedAt: "2026-02-20", distributedAt: null,         totalCost: 436000, totalVoorschot: 438750, netResult: 2750 },
  { id: "STL-021-2025", buildingId: "BLD-021", year: 2025, status: "distributed", approvedAt: "2026-01-22", distributedAt: "2026-02-05", totalCost: 193800, totalVoorschot: 195250, netResult: 1450 },

  // 2026 — just beginning (Q1 data only, monitoring status)
  { id: "STL-001-2026", buildingId: "BLD-001", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 52000, netResult: null },
  { id: "STL-002-2026", buildingId: "BLD-002", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 236500, netResult: null },
  { id: "STL-003-2026", buildingId: "BLD-003", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 57750, netResult: null },
  { id: "STL-004-2026", buildingId: "BLD-004", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 432000, netResult: null },
  { id: "STL-005-2026", buildingId: "BLD-005", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 54000, netResult: null },
  { id: "STL-006-2026", buildingId: "BLD-006", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 67500, netResult: null },
  { id: "STL-007-2026", buildingId: "BLD-007", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 110000, netResult: null },
  { id: "STL-008-2026", buildingId: "BLD-008", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 211250, netResult: null },
  { id: "STL-009-2026", buildingId: "BLD-009", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 336000, netResult: null },
  { id: "STL-010-2026", buildingId: "BLD-010", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 11250, netResult: null },
  { id: "STL-011-2026", buildingId: "BLD-011", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 90000, netResult: null },
  { id: "STL-012-2026", buildingId: "BLD-012", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 270000, netResult: null },
  { id: "STL-013-2026", buildingId: "BLD-013", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 60000, netResult: null },
  { id: "STL-014-2026", buildingId: "BLD-014", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 42000, netResult: null },
  { id: "STL-015-2026", buildingId: "BLD-015", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 27000, netResult: null },
  { id: "STL-016-2026", buildingId: "BLD-016", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 42000, netResult: null },
  { id: "STL-017-2026", buildingId: "BLD-017", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 483000, netResult: null },
  { id: "STL-018-2026", buildingId: "BLD-018", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 12500, netResult: null },
  { id: "STL-019-2026", buildingId: "BLD-019", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 50000, netResult: null },
  { id: "STL-020-2026", buildingId: "BLD-020", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 438750, netResult: null },
  { id: "STL-021-2026", buildingId: "BLD-021", year: 2026, status: "monitoring", approvedAt: null, distributedAt: null, totalCost: null, totalVoorschot: 195250, netResult: null },
];

// Settlement checks per building-service
export const settlementChecks = [
  // BLD-007 2024
  { id: "SC-007-108-2024", buildingId: "BLD-007", serviceId: "SVC-108", year: 2024, ledgerComplete: true,  budgetVariance: -2.1,  budgetApproved: true,  yoyDeviation: 3.5,   yoyFlagged: false, consumptionVerified: true,  status: "approved" },
  { id: "SC-007-105-2024", buildingId: "BLD-007", serviceId: "SVC-105", year: 2024, ledgerComplete: true,  budgetVariance: 1.8,   budgetApproved: true,  yoyDeviation: -1.2,  yoyFlagged: false, consumptionVerified: true,  status: "approved" },
  { id: "SC-007-118-2024", buildingId: "BLD-007", serviceId: "SVC-118", year: 2024, ledgerComplete: true,  budgetVariance: -4.5,  budgetApproved: true,  yoyDeviation: 8.2,   yoyFlagged: false, consumptionVerified: false, status: "approved" },
  { id: "SC-007-102-2024", buildingId: "BLD-007", serviceId: "SVC-102", year: 2024, ledgerComplete: true,  budgetVariance: 0.8,   budgetApproved: true,  yoyDeviation: -2.1,  yoyFlagged: false, consumptionVerified: true,  status: "approved" },

  // BLD-004 2024
  { id: "SC-004-108-2024", buildingId: "BLD-004", serviceId: "SVC-108", year: 2024, ledgerComplete: true,  budgetVariance: -3.2,  budgetApproved: true,  yoyDeviation: 5.8,   yoyFlagged: false, consumptionVerified: true,  status: "verified" },
  { id: "SC-004-105-2024", buildingId: "BLD-004", serviceId: "SVC-105", year: 2024, ledgerComplete: true,  budgetVariance: 8.5,   budgetApproved: false, yoyDeviation: 12.3,  yoyFlagged: true,  consumptionVerified: true,  status: "flagged" },

  // BLD-007 2025
  { id: "SC-007-108-2025", buildingId: "BLD-007", serviceId: "SVC-108", year: 2025, ledgerComplete: true,  budgetVariance: -1.5,  budgetApproved: true,  yoyDeviation: 2.1,   yoyFlagged: false, consumptionVerified: true,  status: "verified" },
  { id: "SC-007-105-2025", buildingId: "BLD-007", serviceId: "SVC-105", year: 2025, ledgerComplete: true,  budgetVariance: 0.3,   budgetApproved: true,  yoyDeviation: 1.5,   yoyFlagged: false, consumptionVerified: true,  status: "verified" },
  { id: "SC-007-118-2025", buildingId: "BLD-007", serviceId: "SVC-118", year: 2025, ledgerComplete: false, budgetVariance: null,  budgetApproved: false, yoyDeviation: null,  yoyFlagged: false, consumptionVerified: false, status: "pending" },
];

export function getSettlementsByYear(year) {
  return buildingSettlements.filter((s) => s.year === year);
}

export function getSettlement(buildingId, year) {
  return buildingSettlements.find((s) => s.buildingId === buildingId && s.year === year);
}

export function getSettlementChecks(buildingId, year) {
  return settlementChecks.filter((sc) => sc.buildingId === buildingId && sc.year === year);
}

// ── Saved views ──
export const savedViews = [
  // ── Buildings views ──
  {
    id: "view-all-buildings",
    objectType: "buildings",
    name: { en: "All Buildings", nl: "Alle Gebouwen" },
    icon: "list",
    isDefault: true,
    columns: ["complex", "complexId", "location", "vhe", "components", "utilities", "dataQuality"],
    filters: {},
    year: null,
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
  {
    id: "view-settlement-2026",
    objectType: "buildings",
    name: { en: "Settlement 2026", nl: "Afrekening 2026" },
    icon: "fileCheck",
    isDefault: false,
    columns: ["complex", "location", "vhe", "components", "settlementStatus", "netResult"],
    filters: {},
    year: 2026,
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
// ═══════════════════════════════════════════════════════════════════

function generateLedgerEntries() {
  const entries = [];
  let idx = 1;

  const serviceBuildingMap = [
    { bld: "BLD-001", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-111","SVC-127","SVC-123"] },
    { bld: "BLD-002", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-132","SVC-111","SVC-123","SVC-116","SVC-106"] },
    { bld: "BLD-003", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-127"] },
    { bld: "BLD-004", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-132","SVC-111","SVC-115","SVC-123","SVC-116","SVC-106"] },
    { bld: "BLD-005", svcs: ["SVC-108","SVC-102","SVC-118","SVC-131","SVC-123","SVC-115"] },
    { bld: "BLD-006", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-111","SVC-132","SVC-123"] },
    { bld: "BLD-007", svcs: ["SVC-108","SVC-102","SVC-105","SVC-131","SVC-118","SVC-127","SVC-123"] },
    { bld: "BLD-008", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-132","SVC-111","SVC-115","SVC-123","SVC-116","SVC-106","SVC-127"] },
    { bld: "BLD-009", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-123","SVC-111","SVC-132","SVC-115","SVC-116","SVC-106","SVC-127","SVC-120"] },
    { bld: "BLD-010", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-111","SVC-127","SVC-123","SVC-122"] },
    { bld: "BLD-011", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-123","SVC-132","SVC-115"] },
    { bld: "BLD-012", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-131","SVC-132","SVC-111","SVC-123","SVC-116","SVC-118","SVC-115","SVC-127"] },
    { bld: "BLD-013", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-127","SVC-104"] },
    { bld: "BLD-014", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-104"] },
    { bld: "BLD-015", svcs: ["SVC-108","SVC-102","SVC-105","SVC-131","SVC-127","SVC-123","SVC-091"] },
    { bld: "BLD-016", svcs: ["SVC-108","SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-132","SVC-104"] },
    { bld: "BLD-017", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-111","SVC-123","SVC-132","SVC-116","SVC-115","SVC-106","SVC-127"] },
    { bld: "BLD-018", svcs: ["SVC-102","SVC-105","SVC-118","SVC-131","SVC-123","SVC-122"] },
    { bld: "BLD-019", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-111","SVC-127","SVC-123"] },
    { bld: "BLD-020", svcs: ["SVC-108","SVC-102","SVC-104","SVC-105","SVC-118","SVC-131","SVC-132","SVC-111","SVC-123","SVC-116","SVC-106","SVC-115","SVC-127"] },
    { bld: "BLD-021", svcs: ["SVC-108","SVC-102","SVC-105","SVC-131","SVC-127","SVC-123","SVC-091","SVC-104"] },
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
    "SVC-120": ["Hydrofoor onderhoud", "Storingsdienst hydrofoor"],
  };

  const descToCostCategory = {
    // SVC-108 Warmtekosten
    "Maandnota warmtelevering": "CC-108-01",     // Gas delivery
    "Vastrecht warmte": "CC-108-04",              // Heat transport (standing)
    "Nacalculatie warmteverbruik": "CC-108-01",   // Gas delivery adjustment
    "Meetdiensten warmte": "CC-108-03",           // Metering services
    "Transportkosten warmtenet": "CC-108-04",     // Heat transport
    // SVC-102 Koud water
    "Maandnota waterlevering": "CC-102-01",       // Water supply
    "Vastrecht drinkwater": "CC-102-02",          // Standing charge
    "Rioolheffing gemeenschappelijk": "CC-102-03",// Sewer levy
    // SVC-104 Warm water
    "Maandnota warm water": "CC-104-01",          // Hot water delivery
    "Vastrecht warm water": "CC-104-02",          // Standing charge
    "Nacalculatie warmwaterverbruik": "CC-104-01", // Hot water adjustment
    // SVC-105 Elektra algemeen
    "Maandnota elektra algemeen": "CC-105-01",    // Electricity supply
    "Vastrecht elektra": "CC-105-02",             // Standing charge
    "Verbruik trappenhuisverlichting": "CC-105-01",// Electricity supply
    "Verbruik parkeergarage": "CC-105-01",        // Electricity supply
    // SVC-106 Elektra woonruimte
    "Maandnota elektra woonruimte": "CC-106-01",  // Electricity supply
    "Vastrecht elektra individueel": "CC-106-02",  // Standing charge
    // SVC-118 Schoonmaak
    "Schoonmaak algemene ruimten": "CC-118-01",
    "Schoonmaak trappenhuis": "CC-118-01",
    "Glasbewassing": "CC-118-01",
    // SVC-131 Huismeester
    "Huismeesterdiensten": "CC-131-01",
    "Kleine reparaties": "CC-131-01",
    "Sociale dienstverlening": "CC-131-01",
    // SVC-132 Lift
    "Onderhoudscontract lift": "CC-132-01",       // Elevator maintenance
    "Storingsafhandeling lift": "CC-132-01",
    "Keuring lift": "CC-132-02",                  // Elevator inspection
    // SVC-111 Meters
    "Plaatsing verbruiksmeters": "CC-111-01",
    "IJking meters": "CC-111-01",
    "Afleesservice": "CC-111-01",
    // SVC-115 Storingsdienst
    "24-uur storingsdienst CV": "CC-115-01",
    "Noodreparatie verwarming": "CC-115-01",
    // SVC-127 Ventilatie
    "Onderhoud ventilatie": "CC-127-01",
    "Filtervervanging MV": "CC-127-01",
    "Energieverbruik ventilatie": "CC-127-01",
    // SVC-123 Tuinonderhoud
    "Tuinonderhoud": "CC-123-01",                 // Landscaping
    "Groenvoorziening seizoen": "CC-123-02",      // Seasonal work
    "Snoeiwerkzaamheden": "CC-123-02",
    // SVC-116 Lampen
    "Vervanging lampen": "CC-116-01",
    "Noodverlichting controle": "CC-116-01",
    // SVC-122 Riool
    "Rioolreiniging": "CC-122-01",
    "Ontstopping collectief": "CC-122-01",
    // SVC-091 Zonnepanelen
    "Opbrengst zonnepanelen": "CC-091-01",
    "Saldering zonnepanelen": "CC-091-01",
    // SVC-120 Hydrofoor
    "Hydrofoor onderhoud": "CC-120-01",
    "Storingsdienst hydrofoor": "CC-120-01",
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
    "SVC-120": "Feenstra Verwarming B.V.",
  };

  const baseAmounts = {
    "SVC-108": 185, "SVC-102": 45, "SVC-104": 65, "SVC-105": 65,
    "SVC-106": 35, "SVC-118": 55, "SVC-131": 120, "SVC-132": 35,
    "SVC-111": 18, "SVC-115": 22, "SVC-127": 28, "SVC-123": 50,
    "SVC-116": 8, "SVC-122": 12, "SVC-091": -25, "SVC-120": 12,
  };

  // Generate 2024, 2025, and 2026 (Q1) ledger entries
  const years = [
    { year: 2024, months: Array.from({ length: 12 }, (_, i) => i + 1) },
    { year: 2025, months: Array.from({ length: 12 }, (_, i) => i + 1) },
    { year: 2026, months: Array.from({ length: 3 }, (_, i) => i + 1) },
  ];

  years.forEach(({ year, months }) => {
    serviceBuildingMap.forEach(({ bld, svcs }) => {
      const bldData = buildings.find(b => b.id === bld);
      const vheCount = bldData ? bldData.vhe : 20;

      svcs.forEach(svc => {
        const descs = descriptions[svc] || ["Maandbedrag"];
        const supplier = supplierMap[svc] || "";
        const baseAmt = baseAmounts[svc] || 30;

        months.forEach(month => {
          const desc = descs[(month - 1) % descs.length];
          const variance = 0.85 + Math.random() * 0.3;
          const amount = Math.round(baseAmt * vheCount * variance / 12 * 100) / 100;
          const day = Math.min(28, 5 + Math.floor(Math.random() * 20));
          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const invoiceRef = `INV-${String(month).padStart(2, "0")}${idx.toString().padStart(4, "0")}`;

          let status = "booked";
          if (year === 2025 && month >= 11) {
            const r = Math.random();
            if (r < 0.15) status = "flagged";
            else if (r < 0.30) status = "pending";
          } else if (year === 2026) {
            const r = Math.random();
            if (r < 0.10) status = "flagged";
            else if (r < 0.20) status = "pending";
          }

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

          // Resolve description string for lookup
          const descStr = typeof desc === "object" ? desc.en : desc;
          const mappedCcId = descToCostCategory[descStr] || null;
          // ~5% unassigned for data quality signal
          const costCategoryId = (mappedCcId && Math.random() > 0.05) ? mappedCcId : null;

          entries.push({
            id: `LED-${String(idx).padStart(5, "0")}`,
            serviceId: svc,
            buildingId: bld,
            costCategoryId,
            year,
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

export function getLedgerGroupedByCostCategory(serviceId, buildingId, year = 2025) {
  const entries = getLedgerByServiceAndBuilding(serviceId, buildingId, year);
  const grouped = {};
  const unassigned = [];

  entries.forEach(e => {
    if (e.costCategoryId) {
      if (!grouped[e.costCategoryId]) grouped[e.costCategoryId] = [];
      grouped[e.costCategoryId].push(e);
    } else {
      unassigned.push(e);
    }
  });

  return { grouped, unassigned };
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

// ═══════════════════════════════════════════════════════════════════
// COST CATEGORIES — breakdown of costs within a service
// Each service has one or more cost categories representing actual
// supplier invoices. This is the level at which ledger entries match.
// ═══════════════════════════════════════════════════════════════════

export const costCategories = [
  // ── SVC-108: Warmtekosten ──
  { id: "CC-108-01", serviceId: "SVC-108", name: { en: "Gas delivery", nl: "Gaslevering" }, supplier: "ENGIE Energie Nederland", invoiceFrequency: "monthly", budgetShare: 0.55, unit: "m³", unitPrice: 1.45 },
  { id: "CC-108-02", serviceId: "SVC-108", name: { en: "Grid operator costs", nl: "Netbeheerkosten" }, supplier: "Stedin Netbeheer BV", invoiceFrequency: "monthly", budgetShare: 0.15, unit: null, unitPrice: null },
  { id: "CC-108-03", serviceId: "SVC-108", name: { en: "Metering services", nl: "Meetdiensten" }, supplier: "Techem Energy Services BV", invoiceFrequency: "quarterly", budgetShare: 0.15, unit: null, unitPrice: null },
  { id: "CC-108-04", serviceId: "SVC-108", name: { en: "Heat transport", nl: "Transportkosten warmtenet" }, supplier: "ENGIE Energie Nederland", invoiceFrequency: "monthly", budgetShare: 0.15, unit: null, unitPrice: null },

  // ── SVC-102: Koud water ──
  { id: "CC-102-01", serviceId: "SVC-102", name: { en: "Water supply", nl: "Waterlevering" }, supplier: "Oasen", invoiceFrequency: "monthly", budgetShare: 0.70, unit: "m³", unitPrice: 1.85 },
  { id: "CC-102-02", serviceId: "SVC-102", name: { en: "Standing charge", nl: "Vastrecht" }, supplier: "Oasen", invoiceFrequency: "quarterly", budgetShare: 0.20, unit: null, unitPrice: null },
  { id: "CC-102-03", serviceId: "SVC-102", name: { en: "Sewer levy", nl: "Rioolheffing" }, supplier: "Gemeente Gorinchem", invoiceFrequency: "annual", budgetShare: 0.10, unit: null, unitPrice: null },

  // ── SVC-104: Warm water ──
  { id: "CC-104-01", serviceId: "SVC-104", name: { en: "Hot water delivery", nl: "Warmwaterlevering" }, supplier: "ENGIE Energie Nederland", invoiceFrequency: "monthly", budgetShare: 0.75, unit: "m³", unitPrice: 8.50 },
  { id: "CC-104-02", serviceId: "SVC-104", name: { en: "Standing charge", nl: "Vastrecht warm water" }, supplier: "ENGIE Energie Nederland", invoiceFrequency: "quarterly", budgetShare: 0.25, unit: null, unitPrice: null },

  // ── SVC-105: Elektra algemeen ──
  { id: "CC-105-01", serviceId: "SVC-105", name: { en: "Electricity supply", nl: "Elektralevering" }, supplier: "ENGIE Energie Nederland", invoiceFrequency: "monthly", budgetShare: 0.65, unit: "kWh", unitPrice: 0.38 },
  { id: "CC-105-02", serviceId: "SVC-105", name: { en: "Standing charge", nl: "Vastrecht elektra" }, supplier: "ENGIE Energie Nederland", invoiceFrequency: "quarterly", budgetShare: 0.20, unit: null, unitPrice: null },
  { id: "CC-105-03", serviceId: "SVC-105", name: { en: "Grid costs", nl: "Netbeheerkosten" }, supplier: "Stedin Netbeheer BV", invoiceFrequency: "monthly", budgetShare: 0.15, unit: null, unitPrice: null },

  // ── SVC-106: Elektra woonruimte ──
  { id: "CC-106-01", serviceId: "SVC-106", name: { en: "Electricity supply", nl: "Elektralevering" }, supplier: "ENGIE Energie Nederland", invoiceFrequency: "monthly", budgetShare: 0.80, unit: "kWh", unitPrice: 0.38 },
  { id: "CC-106-02", serviceId: "SVC-106", name: { en: "Standing charge", nl: "Vastrecht" }, supplier: "ENGIE Energie Nederland", invoiceFrequency: "quarterly", budgetShare: 0.20, unit: null, unitPrice: null },

  // ── SVC-107: Gas gemeenschappelijk ──
  { id: "CC-107-01", serviceId: "SVC-107", name: { en: "Gas delivery", nl: "Gaslevering" }, supplier: "ENGIE Energie Nederland", invoiceFrequency: "monthly", budgetShare: 0.75, unit: "m³", unitPrice: 1.45 },
  { id: "CC-107-02", serviceId: "SVC-107", name: { en: "Grid costs", nl: "Netbeheerkosten" }, supplier: "Stedin Netbeheer BV", invoiceFrequency: "monthly", budgetShare: 0.25, unit: null, unitPrice: null },

  // ── SVC-110: Elektra BOG ──
  { id: "CC-110-01", serviceId: "SVC-110", name: { en: "Electricity supply", nl: "Elektralevering BOG" }, supplier: "ENGIE Energie Nederland", invoiceFrequency: "monthly", budgetShare: 1.0, unit: "kWh", unitPrice: 0.38 },

  // ── SVC-091: Zonnepanelen (credit) ──
  { id: "CC-091-01", serviceId: "SVC-091", name: { en: "Solar generation credit", nl: "Opbrengst zonnepanelen" }, supplier: null, invoiceFrequency: "quarterly", budgetShare: 1.0, unit: "kWh", unitPrice: -0.12 },

  // ── Non-utility services (single cost category each) ──
  { id: "CC-111-01", serviceId: "SVC-111", name: { en: "Meter maintenance", nl: "Onderhoud meters" }, supplier: "Techem Energy Services BV", invoiceFrequency: "quarterly", budgetShare: 1.0, unit: null, unitPrice: null },
  { id: "CC-115-01", serviceId: "SVC-115", name: { en: "24h emergency service", nl: "24-uur storingsdienst" }, supplier: "Feenstra Verwarming B.V.", invoiceFrequency: "quarterly", budgetShare: 1.0, unit: null, unitPrice: null },
  { id: "CC-120-01", serviceId: "SVC-120", name: { en: "Hydrophore service", nl: "Hydrofoor onderhoud" }, supplier: "Hydro Building Systems BV", invoiceFrequency: "quarterly", budgetShare: 1.0, unit: null, unitPrice: null },
  { id: "CC-126-01", serviceId: "SVC-126", name: { en: "Geyser cleaning", nl: "Reinigen geisers" }, supplier: null, invoiceFrequency: "annual", budgetShare: 1.0, unit: null, unitPrice: null },
  { id: "CC-127-01", serviceId: "SVC-127", name: { en: "Ventilation maintenance", nl: "Onderhoud ventilatie" }, supplier: "Feenstra Verwarming B.V.", invoiceFrequency: "quarterly", budgetShare: 1.0, unit: null, unitPrice: null },
  { id: "CC-132-01", serviceId: "SVC-132", name: { en: "Elevator maintenance", nl: "Liftonderhoud" }, supplier: "Schindler Liften B.V.", invoiceFrequency: "quarterly", budgetShare: 0.70, unit: null, unitPrice: null },
  { id: "CC-132-02", serviceId: "SVC-132", name: { en: "Elevator inspection", nl: "Liftkeuring" }, supplier: "Schindler Liften B.V.", invoiceFrequency: "annual", budgetShare: 0.30, unit: null, unitPrice: null },
  { id: "CC-133-01", serviceId: "SVC-133", name: { en: "Elevator electricity", nl: "Elektra lift" }, supplier: null, invoiceFrequency: "monthly", budgetShare: 1.0, unit: "kWh", unitPrice: 0.38 },
  { id: "CC-171-01", serviceId: "SVC-171", name: { en: "Electric doors service", nl: "Service elektrische deuren" }, supplier: "ASSA ABLOY Entrance Systems", invoiceFrequency: "quarterly", budgetShare: 1.0, unit: null, unitPrice: null },
  { id: "CC-116-01", serviceId: "SVC-116", name: { en: "Lamp replacement", nl: "Vervanging lampen" }, supplier: "ISS Facility Services", invoiceFrequency: "irregular", budgetShare: 1.0, unit: null, unitPrice: null },
  { id: "CC-118-01", serviceId: "SVC-118", name: { en: "Cleaning service", nl: "Schoonmaakdienst" }, supplier: "CSU Cleaning Services", invoiceFrequency: "monthly", budgetShare: 1.0, unit: null, unitPrice: null },
  { id: "CC-122-01", serviceId: "SVC-122", name: { en: "Drain cleaning", nl: "Rioolreiniging" }, supplier: "Riool.nl (Rioned Groep)", invoiceFrequency: "annual", budgetShare: 1.0, unit: null, unitPrice: null },
  { id: "CC-123-01", serviceId: "SVC-123", name: { en: "Landscaping", nl: "Tuinonderhoud" }, supplier: "Van Ginkel Groep B.V.", invoiceFrequency: "monthly", budgetShare: 0.80, unit: null, unitPrice: null },
  { id: "CC-123-02", serviceId: "SVC-123", name: { en: "Seasonal work", nl: "Seizoenswerk" }, supplier: "Van Ginkel Groep B.V.", invoiceFrequency: "quarterly", budgetShare: 0.20, unit: null, unitPrice: null },
  { id: "CC-124-01", serviceId: "SVC-124", name: { en: "Gutter cleaning", nl: "Dakgootreiniging" }, supplier: "Van Ginkel Groep B.V.", invoiceFrequency: "annual", budgetShare: 1.0, unit: null, unitPrice: null },
  { id: "CC-140-01", serviceId: "SVC-140", name: { en: "Window cleaning", nl: "Glasbewassing" }, supplier: "CSU Cleaning Services", invoiceFrequency: "quarterly", budgetShare: 1.0, unit: null, unitPrice: null },
  { id: "CC-131-01", serviceId: "SVC-131", name: { en: "Caretaker services", nl: "Huismeesterdiensten" }, supplier: "SWB Wijkbeheer", invoiceFrequency: "monthly", budgetShare: 1.0, unit: null, unitPrice: null },
  { id: "CC-137-01", serviceId: "SVC-137", name: { en: "Support services", nl: "Woonondersteuning" }, supplier: "SWB Wijkbeheer", invoiceFrequency: "monthly", budgetShare: 1.0, unit: null, unitPrice: null },
  { id: "CC-142-01", serviceId: "SVC-142", name: { en: "Internet subscription", nl: "Internetabonnement" }, supplier: "KPN Zakelijk", invoiceFrequency: "monthly", budgetShare: 1.0, unit: null, unitPrice: null },
  { id: "CC-036-01", serviceId: "SVC-036", name: { en: "Glass insurance", nl: "Glasverzekering" }, supplier: "Centraal Beheer Verzekeringen", invoiceFrequency: "annual", budgetShare: 1.0, unit: null, unitPrice: null },
  { id: "CC-099-01", serviceId: "SVC-099", name: { en: "Miscellaneous", nl: "Diversen" }, supplier: null, invoiceFrequency: "irregular", budgetShare: 1.0, unit: null, unitPrice: null },
];

export function getCostCategoriesByService(serviceId) {
  return costCategories.filter(cc => cc.serviceId === serviceId);
}

// ═══════════════════════════════════════════════════════════════════
// MONTHLY CLOSE STATUS — per building × service × month
// Tracks whether each month's costs have been reviewed and closed.
// Status: closed (green), review (amber), open (red), future (gray)
// ═══════════════════════════════════════════════════════════════════

function generateMonthlyCloseStatus() {
  const statuses = [];
  const currentYear = 2026;
  const currentMonth = 3; // March 2026

  // For each building-service relationship, generate monthly statuses
  buildingServices.forEach(bs => {
    if (bs.year === 2024) {
      // 2024: all months closed
      for (let m = 1; m <= 12; m++) {
        statuses.push({
          buildingId: bs.buildingId,
          serviceId: bs.serviceId,
          year: 2024,
          month: m,
          status: "closed",
          closedAt: `2025-${String(m + 1 > 12 ? 1 : m + 1).padStart(2, "0")}-15`,
          closedBy: "system",
        });
      }
    } else if (bs.year === 2025) {
      // 2025: months 1-10 mostly closed, 11-12 mixed
      for (let m = 1; m <= 12; m++) {
        let status;
        if (m <= 9) {
          status = "closed";
        } else if (m === 10) {
          status = Math.random() < 0.85 ? "closed" : "review";
        } else if (m === 11) {
          const r = Math.random();
          status = r < 0.60 ? "closed" : r < 0.85 ? "review" : "open";
        } else {
          // December 2025
          const r = Math.random();
          status = r < 0.35 ? "closed" : r < 0.70 ? "review" : "open";
        }
        statuses.push({
          buildingId: bs.buildingId,
          serviceId: bs.serviceId,
          year: 2025,
          month: m,
          status,
          closedAt: status === "closed" ? `2026-${String(Math.min(m + 1, 12)).padStart(2, "0")}-${10 + Math.floor(Math.random() * 15)}` : null,
          closedBy: status === "closed" ? "user" : null,
        });
      }
    } else if (bs.year === 2026) {
      // 2026: Jan mostly closed, Feb mixed, Mar future
      for (let m = 1; m <= 12; m++) {
        let status;
        if (m === 1) {
          status = Math.random() < 0.80 ? "closed" : "review";
        } else if (m === 2) {
          const r = Math.random();
          status = r < 0.30 ? "closed" : r < 0.65 ? "review" : "open";
        } else {
          status = "future";
        }
        statuses.push({
          buildingId: bs.buildingId,
          serviceId: bs.serviceId,
          year: 2026,
          month: m,
          status,
          closedAt: status === "closed" ? `2026-${String(m + 1 > 12 ? 1 : m + 1).padStart(2, "0")}-${10 + Math.floor(Math.random() * 10)}` : null,
          closedBy: status === "closed" ? "user" : null,
        });
      }
    }
  });

  return statuses;
}

export const monthlyCloseStatuses = generateMonthlyCloseStatus();

export function getMonthlyCloseForBuilding(buildingId, year) {
  return monthlyCloseStatuses.filter(s => s.buildingId === buildingId && s.year === year);
}

export function getMonthlyCloseForBuildingService(buildingId, serviceId, year) {
  return monthlyCloseStatuses.filter(s => s.buildingId === buildingId && s.serviceId === serviceId && s.year === year);
}

// Aggregated monthly close status per service for a building
// Returns { serviceId, months: [{ month, status }], closedCount, totalMonths }
export function getMonthlyCloseGridForBuilding(buildingId, year) {
  const bsRelations = buildingServices.filter(bs => bs.buildingId === buildingId && bs.year === year);
  const closeData = monthlyCloseStatuses.filter(s => s.buildingId === buildingId && s.year === year);

  const currentMonth = year === 2026 ? 2 : 12; // Feb 2026 is the last closeable month

  return bsRelations.map(bs => {
    const serviceMonths = closeData
      .filter(s => s.serviceId === bs.serviceId)
      .sort((a, b) => a.month - b.month);

    const closedCount = serviceMonths.filter(s => s.status === "closed").length;
    const reviewCount = serviceMonths.filter(s => s.status === "review").length;
    const openCount = serviceMonths.filter(s => s.status === "open").length;
    const applicableMonths = serviceMonths.filter(s => s.status !== "future").length;

    return {
      buildingId,
      serviceId: bs.serviceId,
      year,
      months: serviceMonths,
      closedCount,
      reviewCount,
      openCount,
      applicableMonths,
      overallStatus: openCount > 0 ? "open" : reviewCount > 0 ? "review" : closedCount === applicableMonths && applicableMonths > 0 ? "closed" : "future",
    };
  });
}

// ═══════════════════════════════════════════════════════════════════
// MODULE CONFIGURATION — controls which features are visible
// "full" = all features, "energy" = energy module only, "serviceCharges" = service charges only
// ═══════════════════════════════════════════════════════════════════

export const moduleConfig = {
  mode: "full", // "full" | "energy" | "serviceCharges"
  hasLedgerData: true,
  hasConsumptionData: true,
  hasNonUtilityServices: true,
};

export function isFeatureEnabled(feature) {
  switch (feature) {
    case "ledger": return moduleConfig.mode === "full" || moduleConfig.mode === "serviceCharges";
    case "consumption": return moduleConfig.mode === "full" || moduleConfig.mode === "energy";
    case "nonUtilityServices": return moduleConfig.mode === "full" || moduleConfig.mode === "serviceCharges";
    case "consumptionControl": return moduleConfig.mode === "full"; // needs both ledger AND consumption
    case "monthlyClose": return moduleConfig.mode === "full" || moduleConfig.mode === "serviceCharges";
    default: return true;
  }
}
