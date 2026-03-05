import React, { createContext, useContext } from "react";

export const LangCtx = createContext("en");
export const useLang = () => useContext(LangCtx);

const dict = {
  // Navigation — main
  home:          { en: "Home",          nl: "Home" },
  inbox:         { en: "Inbox",         nl: "Inbox" },
  tasks:         { en: "Tasks",         nl: "Taken" },
  workflows:     { en: "Workflows",     nl: "Workflows" },
  onboarding:    { en: "Onboarding",    nl: "Onboarding" },

  // Navigation — objects section
  objects:       { en: "Objects",       nl: "Objecten" },
  buildings:     { en: "Buildings",     nl: "Gebouwen" },
  services:      { en: "Services",     nl: "Diensten" },
  suppliers:     { en: "Suppliers",    nl: "Leveranciers" },
  meters:        { en: "Meters",        nl: "Meters" },

  // Common labels
  overview:      { en: "Overview",      nl: "Overzicht" },
  status:        { en: "Status",        nl: "Status" },
  search:        { en: "Search",        nl: "Zoeken" },
  details:       { en: "Details",       nl: "Details" },
  settings:      { en: "Settings",      nl: "Instellingen" },
  name:          { en: "Name",          nl: "Naam" },
  type:          { en: "Type",          nl: "Type" },
  address:       { en: "Address",       nl: "Adres" },
  date:          { en: "Date",          nl: "Datum" },
  description:   { en: "Description",   nl: "Beschrijving" },
  actions:       { en: "Actions",       nl: "Acties" },
  filter:        { en: "Filter",        nl: "Filter" },
  all:           { en: "All",           nl: "Alle" },
  active:        { en: "Active",        nl: "Actief" },
  inactive:      { en: "Inactive",      nl: "Inactief" },
  noResults:     { en: "No results found", nl: "Geen resultaten gevonden" },

  // Building list columns
  complex:         { en: "Complex",          nl: "Complex" },
  complexId:       { en: "Complex ID",       nl: "Complex ID" },
  location:        { en: "Location",         nl: "Locatie" },
  vhe:             { en: "VHE",              nl: "VHE" },
  components:      { en: "Components",       nl: "Componenten" },
  utilities:       { en: "Utilities",        nl: "Nutsvoorzieningen" },
  budgetProgress:  { en: "Budget",           nl: "Budget" },
  dataQuality:     { en: "Data Quality",     nl: "Datakwaliteit" },

  // Page titles
  homeTitle:     { en: "Dashboard",     nl: "Dashboard" },
  homeSubtitle:  { en: "Welcome back",  nl: "Welkom terug" },
  inboxTitle:    { en: "Inbox",         nl: "Inbox" },
  tasksTitle:    { en: "Tasks",         nl: "Taken" },
  workflowsTitle:    { en: "Workflows",     nl: "Workflows" },
  onboardingTitle:   { en: "Onboarding",    nl: "Onboarding" },
  buildingsTitle:    { en: "Buildings",     nl: "Gebouwen" },
  metersTitle:       { en: "Meters",        nl: "Meters" },
  servicesTitle:     { en: "Services",     nl: "Diensten" },
  suppliersTitle:    { en: "Suppliers",    nl: "Leveranciers" },

  // Service list columns
  code:              { en: "Code",         nl: "Code" },
  service:           { en: "Service",      nl: "Dienst" },
  category:          { en: "Category",     nl: "Categorie" },
  regulation:        { en: "Regulation",   nl: "Regelgeving" },
  metered:           { en: "Metered",      nl: "Gemeten" },
  variable:          { en: "Variable",     nl: "Variabel" },
  buildingCount:     { en: "Buildings",    nl: "Gebouwen" },
  avgCostVhe:        { en: "Avg / VHE",    nl: "Gem. / VHE" },

  // Service categories
  energy:            { en: "Energy & Water",               nl: "Energie & Water" },
  installations:     { en: "Installations & Maintenance",  nl: "Installaties & Technisch Beheer" },
  cleaning:          { en: "Cleaning & Exterior",          nl: "Schoonmaak & Buitenruimte" },
  management:        { en: "Management & Services",        nl: "Beheer & Woonservices" },
  other:             { en: "Other & Insurance",            nl: "Overig & Verzekeringen" },

  // Boolean labels
  yes:               { en: "Yes",          nl: "Ja" },
  no:                { en: "No",           nl: "Nee" },

  // Building detail page
  actual:            { en: "Actual",              nl: "Werkelijk" },
  variance:          { en: "Variance",            nl: "Afwijking" },
  underBudget:       { en: "Under budget",        nl: "Onder budget" },
  overBudget:        { en: "Over budget",         nl: "Over budget" },
  settlementReadiness: { en: "Settlement",        nl: "Afrekening" },
  activeServices:    { en: "Services",            nl: "Diensten" },
  mainMeters:        { en: "Main Meters",         nl: "Hoofdmeters" },
  subMeters:         { en: "Sub Meters",          nl: "Submeters" },
  costBreakdown:     { en: "Cost Breakdown",      nl: "Kostenverdeling" },
  completeness:      { en: "Completeness",        nl: "Volledigheid" },
  distributionMethod: { en: "Distribution",       nl: "Verdeelsleutel" },
  lastReading:       { en: "Last reading",        nl: "Laatste stand" },
  meterNumber:       { en: "Meter No.",           nl: "Meternr." },
  activity:          { en: "Activity",            nl: "Activiteit" },
  vacant:            { en: "Vacant",              nl: "Leegstaand" },
  unit:              { en: "Unit",                nl: "Eenheid" },
  floor:             { en: "Floor",               nl: "Verdieping" },
  m2:                { en: "m²",                  nl: "m²" },
  contractHolder:    { en: "Contract Holder",     nl: "Contracthouder" },
  voorschot:         { en: "Voorschot",           nl: "Voorschot" },

  // VHE
  vheTitle:          { en: "Units",               nl: "Eenheden" },

  // Settlement (eindafrekening)
  settlement:        { en: "Settlement",           nl: "Afrekening" },
  settlementStatus:  { en: "Settlement Status",    nl: "Afrekeningsstatus" },
  netResult:         { en: "Net Result",           nl: "Netto Resultaat" },
  notStarted:        { en: "Not started",          nl: "Niet gestart" },
  monitoring:        { en: "Monitoring",           nl: "Monitoring" },
  inReview:          { en: "In review",            nl: "In controle" },
  approved:          { en: "Approved",             nl: "Goedgekeurd" },
  distributed:       { en: "Distributed",          nl: "Afgerekend" },
  naheffing:         { en: "Surcharge",            nl: "Naheffing" },
  teruggave:         { en: "Refund",               nl: "Teruggave" },
  ledgerComplete:    { en: "Ledger complete",      nl: "Boekhouding compleet" },
  budgetApproved:    { en: "Budget approved",      nl: "Budget goedgekeurd" },
  yoyDeviation:      { en: "YoY deviation",        nl: "Jaarvergelijking" },
  consumptionVerified: { en: "Consumption verified", nl: "Verbruik geverifieerd" },
  checksPerService:  { en: "Checks per service",   nl: "Controles per dienst" },
  verified:          { en: "Verified",             nl: "Geverifieerd" },
  flagged:           { en: "Flagged",              nl: "Gemarkeerd" },
  pending:           { en: "Pending",              nl: "In afwachting" },
};

export function t(key, lang = "en") {
  const entry = dict[key];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
}
