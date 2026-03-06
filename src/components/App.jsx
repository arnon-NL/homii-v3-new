import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { brand } from "@/lib/brand";
import { LangCtx, t } from "@/lib/i18n";
import Sidebar from "./Sidebar";
import PlaceholderPage from "./PlaceholderPage";
import BuildingListPage from "./BuildingListPage";
import ServiceListPage from "./ServiceListPage";
import BuildingDetailPage from "./BuildingDetailPage";
import SupplierListPage from "./SupplierListPage";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const location = useLocation();

  // Close mobile sidebar on navigation
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <LangCtx.Provider value={lang}>
      <div
        className="h-screen flex overflow-hidden"
        style={{
          fontFamily: "'Plus Jakarta Sans','Poppins',system-ui,sans-serif",
          background: brand.bg,
        }}
      >
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Mobile header bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-12 bg-white border-b border-slate-200 flex items-center px-4 gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span
            className="text-[13px] font-semibold"
            style={{ color: brand.navy }}
          >
            homii
          </span>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed lg:static z-50 h-full transition-transform duration-200 ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <Sidebar lang={lang} setLang={setLang} />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden pt-12 lg:pt-0">
          <Routes>
            <Route
              path="/"
              element={
                <PlaceholderPage
                  title={t("homeTitle", lang)}
                  subtitle={t("homeSubtitle", lang)}
                />
              }
            />
            <Route
              path="/inbox"
              element={<PlaceholderPage title={t("inboxTitle", lang)} />}
            />
            <Route
              path="/tasks"
              element={<PlaceholderPage title={t("tasksTitle", lang)} />}
            />
            <Route
              path="/workflows"
              element={<PlaceholderPage title={t("workflowsTitle", lang)} />}
            />
            <Route
              path="/onboarding"
              element={<PlaceholderPage title={t("onboardingTitle", lang)} />}
            />
            <Route path="/buildings" element={<BuildingListPage />} />
            <Route path="/buildings/:buildingId" element={<BuildingDetailPage />} />
            <Route
              path="/vhe"
              element={<PlaceholderPage title={t("vheTitle", lang)} />}
            />
            <Route
              path="/vhe/:vheId"
              element={<PlaceholderPage title={t("vheTitle", lang)} />}
            />
            <Route path="/services" element={<ServiceListPage />} />
            <Route path="/services/:serviceId" element={<PlaceholderPage title={t("servicesTitle", lang)} />} />
            <Route path="/suppliers" element={<SupplierListPage />} />
            <Route path="/suppliers/:supplierId" element={<PlaceholderPage title={t("suppliersTitle", lang)} />} />
            <Route
              path="/meters"
              element={<PlaceholderPage title={t("metersTitle", lang)} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </LangCtx.Provider>
  );
}
