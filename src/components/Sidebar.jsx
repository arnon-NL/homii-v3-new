import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Inbox,
  CheckSquare,
  GitBranch,
  UserPlus,
  Building2,
  Gauge,
  Search,
} from "lucide-react";
import { brand } from "@/lib/brand";
import { t, useLang } from "@/lib/i18n";

function NavButton({ item, showCount }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      className={({ isActive }) =>
        `w-full flex items-center gap-2.5 h-8 px-2.5 rounded-md text-[13px] transition-colors no-underline ${
          isActive
            ? "bg-slate-200/60 text-slate-900 font-medium"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={15} strokeWidth={isActive ? 2 : 1.5} />
          <span className="flex-1 text-left">{item.label}</span>
          {showCount && item.count != null && (
            <span className="text-[10px] text-slate-400 tabular-nums">
              {item.count}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ lang, setLang }) {
  const navItems = [
    { label: t("home", lang), icon: Home, path: "/" },
    { label: t("inbox", lang), icon: Inbox, path: "/inbox" },
    { label: t("tasks", lang), icon: CheckSquare, path: "/tasks" },
    { label: t("workflows", lang), icon: GitBranch, path: "/workflows" },
    { label: t("onboarding", lang), icon: UserPlus, path: "/onboarding" },
  ];

  const objectItems = [
    { label: t("buildings", lang), icon: Building2, path: "/buildings" },
    { label: t("meters", lang), icon: Gauge, path: "/meters" },
  ];

  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 bg-slate-50 flex flex-col h-full select-none">
      {/* Client logo header */}
      <div className="px-3 pt-4 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-extrabold tracking-wide"
            style={{ background: brand.navy }}
          >
            CLI
          </div>
          <div className="flex-1 min-w-0">
            <span
              className="text-[13px] font-semibold block truncate"
              style={{ color: brand.navy }}
            >
              Client Name
            </span>
            <span className="text-[9px] text-slate-400 font-medium">
              Powered by homii
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 h-8 px-2.5 rounded-md bg-slate-200/50 border border-slate-200/80 text-slate-400 cursor-pointer hover:bg-slate-200/80 transition-colors">
          <Search size={13} strokeWidth={2} />
          <span className="text-[12px]">{t("search", lang)}...</span>
          <span className="ml-auto text-[10px] font-mono text-slate-300 bg-white/60 px-1.5 py-0.5 rounded border border-slate-200/80">
            ⌘K
          </span>
        </div>
      </div>

      <div className="h-px bg-slate-200 mx-3" />

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {/* Main nav */}
        {navItems.map((item) => (
          <NavButton key={item.path} item={item} />
        ))}

        <div className="h-px bg-slate-200 my-2 mx-1" />

        {/* Objects section */}
        <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          {t("objects", lang)}
        </div>
        {objectItems.map((item) => (
          <NavButton key={item.path} item={item} showCount />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
            A
          </div>
          <span className="text-[12px] text-slate-600 font-medium">Admin</span>
        </div>

        {/* Language toggle */}
        <div className="flex items-center gap-0.5 bg-slate-200/60 rounded-md p-0.5">
          {["en", "nl"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase transition-all ${
                lang === l
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
