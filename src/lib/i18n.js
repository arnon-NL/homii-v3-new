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
};

export function t(key, lang = "en") {
  const entry = dict[key];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
}
