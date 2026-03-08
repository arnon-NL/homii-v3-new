import React from "react";

const variants = {
  active:    { bg: "bg-slate-100",  text: "text-slate-500" },
  success:   { bg: "bg-slate-100",  text: "text-slate-500" },
  good:      { bg: "bg-slate-100",  text: "text-slate-500" },
  onboarded: { bg: "bg-slate-100",  text: "text-slate-500" },
  warning:   { bg: "bg-slate-100",  text: "text-amber-600" },
  offline:   { bg: "bg-slate-100",  text: "text-amber-600" },
  pending:   { bg: "bg-slate-100",  text: "text-amber-600" },
  error:     { bg: "bg-slate-100",  text: "text-red-600" },
  bad:       { bg: "bg-slate-100",  text: "text-red-600" },
  inactive:  { bg: "bg-slate-100",  text: "text-slate-400" },
  vacant:    { bg: "bg-slate-100",  text: "text-slate-400" },
  ended:     { bg: "bg-slate-100",  text: "text-slate-400" },
  neutral:   { bg: "bg-slate-100",  text: "text-slate-500" },
  unknown:   { bg: "bg-slate-100",  text: "text-slate-400" },
};

const statusLabels = {
  active: "Active", success: "Success", good: "Good",
  onboarded: "Onboarded", warning: "Warning", offline: "Offline",
  pending: "Pending", error: "Error", bad: "Bad",
  inactive: "Inactive", vacant: "Vacant", ended: "Ended",
  neutral: "Neutral", unknown: "Unknown",
};

export function StatusBadge({ status, label, size = "sm" }) {
  const v = variants[status] || variants.neutral;
  const sizeClass = size === "xs" ? "text-[11px] px-2 py-0" : "text-[11px] px-2 py-1";
  const displayLabel = label || statusLabels[status] || status;
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${v.bg} ${v.text} ${sizeClass}`}>
      {displayLabel}
    </span>
  );
}

export function StatusDot({ status, size = 6 }) {
  const colors = {
    active: "#94A3B8", success: "#94A3B8", good: "#94A3B8", onboarded: "#94A3B8",
    warning: "#F59E0B", offline: "#F59E0B", pending: "#F59E0B",
    error: "#EF4444", bad: "#EF4444",
    inactive: "#94A3B8", vacant: "#94A3B8", ended: "#94A3B8", neutral: "#94A3B8", unknown: "#94A3B8",
    high: "#94A3B8", medium: "#F59E0B", low: "#EF4444",
  };
  return <span className="inline-block rounded-full shrink-0" style={{ width: size, height: size, background: colors[status] || colors.neutral }} />;
}
