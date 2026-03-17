import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Circle,
  ArrowLeft,
  Building2,
  CalendarDays,
  Send,
  ShieldCheck,
  Flag,
  Users,
  Gauge,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Lock,
  FileCheck,
  ArrowUpRight,
} from "lucide-react";
import { brand } from "@/lib/brand";
import {
  getDistributionById,
  getBuilding,
  getService,
  getDistributionModel,
} from "@/lib/mockData";
import { useOrg } from "@/lib/OrgContext";
import { useLang } from "@/lib/i18n";
import { STEP_ORDER, STEP_CONFIG } from "@/lib/data/distributions";
import Breadcrumbs from "./Breadcrumbs";
import { Card, CardContent } from "./ui/card";

/* ── Formatters ── */
const fmtEur = (v, decimals = 0) =>
  v == null ? "—" :
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(v);
const fmtPct = (v) => v == null ? "—" : `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("nl-NL", { day: "2-digit", month: "short", year: "numeric" }) : "—";

/* ── Step status config ── */
const STEP_STATUS = {
  complete:    { icon: CheckCircle2, color: "#16A34A", bg: "#F0FDF4", label: { en: "Complete",     nl: "Afgerond"        } },
  in_progress: { icon: Clock,        color: "#2563EB", bg: "#EFF6FF", label: { en: "In progress",  nl: "In uitvoering"   } },
  pending:     { icon: Circle,       color: "#94A3B8", bg: "#F8FAFC", label: { en: "Pending",      nl: "In afwachting"   } },
  flagged:     { icon: AlertTriangle,color: "#D97706", bg: "#FFFBEB", label: { en: "Flagged",      nl: "Aandacht"        } },
};

function StepStatusBadge({ status, lang }) {
  const cfg = STEP_STATUS[status] || STEP_STATUS.pending;
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium" style={{ background: cfg.bg, color: cfg.color }}>
      <Icon size={12} />
      {cfg.label[lang] || cfg.label.en}
    </span>
  );
}

/* ── Variance badge ── */
function VarianceBadge({ pct, threshold = 10 }) {
  if (pct == null) return <span className="text-xs text-slate-400">—</span>;
  const exceeded = Math.abs(pct) > threshold;
  const color = exceeded ? "#D97706" : pct > 0 ? "#64748B" : "#16A34A";
  const bg    = exceeded ? "#FFFBEB" : pct > 0 ? "#F8FAFC" : "#F0FDF4";
  const Icon  = pct > 0 ? TrendingUp : pct < 0 ? TrendingDown : Minus;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: bg, color }}>
      <Icon size={11} />
      {fmtPct(pct)}
      {exceeded && <Flag size={10} />}
    </span>
  );
}

/* ── Step navigator (vertical left panel) ── */
function StepNavigator({ distribution, activeStep, onSelectStep, lang }) {
  const currentIdx = distribution.currentStep === "complete" ? 6 : STEP_ORDER.indexOf(distribution.currentStep);
  const isComplete = distribution.currentStep === "complete";

  return (
    <div className="flex flex-col gap-1">
      {STEP_ORDER.map((step, i) => {
        const stepData = distribution.steps?.[step];
        const done = isComplete || i < currentIdx;
        const active = step === activeStep;
        const isCurrent = !isComplete && i === currentIdx;
        const stepCfg = STEP_CONFIG[step];
        const status = stepData?.status || (done ? "complete" : "pending");
        const hasFlagged = status === "in_progress" && step === "control" && (distribution.steps?.control?.excesses || []).some(e => e.exceeded);
        const hasFlaggedCheck = status === "in_progress" && step === "check" && (distribution.steps?.check?.tenantOutcomes || []).some(t => t.status === "flagged");

        return (
          <button
            key={step}
            onClick={() => onSelectStep(step)}
            disabled={!done && !isCurrent}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
              active
                ? "bg-slate-100 text-slate-900"
                : done || isCurrent
                ? "hover:bg-slate-50 text-slate-600 cursor-pointer"
                : "text-slate-300 cursor-not-allowed"
            }`}
          >
            {/* Step number / status icon */}
            <div className="w-6 h-6 flex items-center justify-center flex-none">
              {done ? (
                <CheckCircle2 size={16} style={{ color: brand.teal || "#3EB1C8" }} />
              ) : isCurrent ? (
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "#2563EB" }}>
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-slate-300">{i + 1}</span>
                </div>
              )}
            </div>

            {/* Label */}
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium leading-tight ${active ? "text-slate-900" : done ? "text-slate-600" : isCurrent ? "text-slate-800" : "text-slate-300"}`}>
                {stepCfg.label[lang] || stepCfg.label.en}
              </p>
              {stepData?.completedAt && done && (
                <p className="text-[10px] text-slate-400 mt-0.5">{fmtDate(stepData.completedAt)}</p>
              )}
              {isCurrent && (
                <p className="text-[10px] text-blue-500 mt-0.5">{lang === "nl" ? "Actief" : "Active"}</p>
              )}
            </div>

            {/* Flag indicators */}
            {(hasFlagged || hasFlaggedCheck) && (
              <Flag size={11} className="text-amber-500 flex-none" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STEP PANELS
═══════════════════════════════════════════════════════════════ */

/* ── Step 1: Validation ── */
function ValidationPanel({ distribution, lang }) {
  const step = distribution.steps?.validation;
  const issues = step?.issues || [];
  return (
    <div className="space-y-4">
      <StepHeader
        title={lang === "nl" ? "Validatie" : "Validation"}
        description={lang === "nl"
          ? "Controleer of alle kosten per dienst volledig zijn ingeboekt voor deze periode."
          : "Verify that all costs per service are fully booked for this period."}
        status={step?.status}
        completedAt={step?.completedAt}
        completedBy={step?.completedBy}
        lang={lang}
      />

      {/* Service completeness */}
      <Card className="border-slate-200 bg-white">
        <CardContent className="py-0">
          {distribution.services.map((svc, idx) => {
            const service = getService(svc.serviceId);
            const name = service?.name?.[lang] || service?.name?.en || svc.serviceId;
            const completeness = svc.completeness ?? 0;
            const isOk = completeness === 100;
            return (
              <div key={svc.serviceId} className={`flex items-center gap-3 py-3 ${idx < distribution.services.length - 1 ? "border-b border-slate-100" : ""}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{name}</p>
                  <p className="text-[11px] text-slate-400">{svc.serviceId}</p>
                </div>
                {/* Completeness bar */}
                <div className="w-32 hidden sm:block">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${completeness}%`, background: isOk ? "#3EB1C8" : "#F59E0B" }}
                      />
                    </div>
                    <span className="text-[11px] tabular-nums text-slate-500 w-8 text-right">{completeness}%</span>
                  </div>
                </div>
                <div className="flex-none">
                  {isOk ? (
                    <CheckCircle2 size={15} className="text-green-500" />
                  ) : (
                    <AlertTriangle size={15} className="text-amber-500" />
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Issues */}
      {issues.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {lang === "nl" ? "Aandachtspunten" : "Issues"}
          </p>
          {issues.map((issue, i) => {
            const svc = getService(issue.serviceId);
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                <AlertTriangle size={14} className="text-amber-500 flex-none mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-800">{svc?.name?.[lang] || issue.serviceId}</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">{issue.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {issues.length === 0 && step?.status === "complete" && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
          <CheckCircle2 size={14} className="text-green-500 flex-none" />
          <p className="text-xs text-green-700">
            {lang === "nl" ? "Alle kosten volledig ingeboekt. Klaar voor volgende stap." : "All costs fully booked. Ready for next step."}
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Step 2: Comparison ── */
function ComparisonPanel({ distribution, lang }) {
  const step = distribution.steps?.comparison;
  const deviations = step?.deviations || [];
  return (
    <div className="space-y-4">
      <StepHeader
        title={lang === "nl" ? "Vergelijking" : "Comparison"}
        description={lang === "nl"
          ? "Vergelijk de werkelijke kosten per dienst met het voorgaande jaar."
          : "Compare actual costs per service against the previous year."}
        status={step?.status}
        completedAt={step?.completedAt}
        completedBy={step?.completedBy}
        lang={lang}
      />

      <Card className="border-slate-200 bg-white">
        <CardContent className="py-0">
          <div className="grid grid-cols-5 gap-2 px-3 py-2 border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <span className="col-span-2">{lang === "nl" ? "Dienst" : "Service"}</span>
            <span className="text-right">{lang === "nl" ? "Vorig jaar" : "Prev. year"}</span>
            <span className="text-right">{lang === "nl" ? "Dit jaar" : "This year"}</span>
            <span className="text-right">{lang === "nl" ? "Verschil" : "Variance"}</span>
          </div>
          {distribution.services.map((svc, idx) => {
            const service = getService(svc.serviceId);
            const name = service?.name?.[lang] || service?.name?.en || svc.serviceId;
            const deviation = deviations.find(d => d.serviceId === svc.serviceId);
            return (
              <div key={svc.serviceId} className={`grid grid-cols-5 gap-2 items-center px-3 py-3 ${idx < distribution.services.length - 1 ? "border-b border-slate-100" : ""}`}>
                <div className="col-span-2 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{name}</p>
                </div>
                <span className="text-xs text-right text-slate-500 tabular-nums">{fmtEur(svc.previousActual)}</span>
                <span className="text-xs text-right font-medium text-slate-800 tabular-nums">{fmtEur(svc.actual)}</span>
                <div className="flex justify-end">
                  <VarianceBadge pct={svc.variancePct} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Step 3: Control ── */
function ControlPanel({ distribution, lang }) {
  const step = distribution.steps?.control;
  const excesses = step?.excesses || [];
  const threshold = step?.threshold || 10;
  return (
    <div className="space-y-4">
      <StepHeader
        title={lang === "nl" ? "Controle" : "Control"}
        description={lang === "nl"
          ? `Controleer diensten waarvan de kosten meer dan ${threshold}% zijn gestegen ten opzichte van vorig jaar.`
          : `Review services whose costs increased by more than ${threshold}% compared to the previous year.`}
        status={step?.status}
        completedAt={step?.completedAt}
        completedBy={step?.completedBy}
        lang={lang}
      />

      {/* Threshold indicator */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <Gauge size={14} className="text-slate-400 flex-none" />
        <span className="text-xs text-slate-500">
          {lang === "nl" ? "Drempelwaarde" : "Threshold"}:
          <span className="font-semibold text-slate-700 ml-1">{threshold}%</span>
        </span>
      </div>

      {/* All services with threshold check */}
      <Card className="border-slate-200 bg-white">
        <CardContent className="py-0">
          {distribution.services.map((svc, idx) => {
            const service = getService(svc.serviceId);
            const name = service?.name?.[lang] || service?.name?.en || svc.serviceId;
            const excess = excesses.find(e => e.serviceId === svc.serviceId);
            const exceeded = excess?.exceeded || false;
            const pct = svc.variancePct;
            return (
              <div key={svc.serviceId} className={`flex items-start gap-3 py-3 px-3 ${idx < distribution.services.length - 1 ? "border-b border-slate-100" : ""} ${exceeded ? "bg-amber-50/40" : ""}`}>
                <div className="flex-none mt-0.5">
                  {exceeded
                    ? <AlertTriangle size={15} className="text-amber-500" />
                    : <CheckCircle2 size={15} className="text-green-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-slate-700">{name}</p>
                    <VarianceBadge pct={pct} threshold={threshold} />
                  </div>
                  {exceeded && excess?.note && (
                    <p className="text-[11px] text-amber-700 mt-1 bg-amber-50 rounded px-2 py-1 border border-amber-100">
                      {excess.note}
                    </p>
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-700 tabular-nums">{fmtEur(svc.actual)}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {excesses.length === 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
          <CheckCircle2 size={14} className="text-green-500 flex-none" />
          <p className="text-xs text-green-700">
            {lang === "nl" ? `Geen diensten overschrijden de ${threshold}% drempelwaarde.` : `No services exceed the ${threshold}% threshold.`}
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Step 4: Check ── */
function CheckPanel({ distribution, lang }) {
  const step = distribution.steps?.check;
  const outcomes = step?.tenantOutcomes || [];
  const hasTenants = outcomes.length > 0;

  const totalRefund = outcomes.filter(t => t.delta < 0).reduce((s, t) => s + t.delta, 0);
  const totalOwed   = outcomes.filter(t => t.delta > 0).reduce((s, t) => s + t.delta, 0);
  const flaggedTenants = outcomes.filter(t => t.status === "flagged");

  return (
    <div className="space-y-4">
      <StepHeader
        title={lang === "nl" ? "Check" : "Check"}
        description={lang === "nl"
          ? "Controleer per huurder het resultaat van de servicekosten versus het betaalde voorschot."
          : "Review per tenant the outcome of service costs versus the advance payment (voorschot) paid."}
        status={step?.status}
        completedAt={step?.completedAt}
        completedBy={step?.completedBy}
        lang={lang}
      />

      {/* Totals summary */}
      {hasTenants && (
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <p className="text-[11px] text-slate-400 mb-1">{lang === "nl" ? "Huurders" : "Tenants"}</p>
            <p className="text-lg font-bold text-slate-800">{outcomes.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-green-50 border border-green-100 text-center">
            <p className="text-[11px] text-green-600 mb-1">{lang === "nl" ? "Teruggave" : "Refund"}</p>
            <p className="text-lg font-bold text-green-700 tabular-nums">{fmtEur(totalRefund)}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <p className="text-[11px] text-slate-500 mb-1">{lang === "nl" ? "Bijbetaling" : "To collect"}</p>
            <p className="text-lg font-bold text-slate-700 tabular-nums">+{fmtEur(totalOwed)}</p>
          </div>
        </div>
      )}

      {/* Flagged tenants warning */}
      {flaggedTenants.length > 0 && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-amber-500" />
            <p className="text-xs font-semibold text-amber-800">
              {flaggedTenants.length} {lang === "nl" ? "huurder(s) met hoog uitstaand bedrag" : "tenant(s) with high outstanding amount"}
            </p>
          </div>
          {flaggedTenants.map((t) => (
            <div key={t.vheId} className="flex items-center justify-between text-xs mt-1">
              <span className="text-amber-700">{t.address}</span>
              <span className="font-semibold text-amber-800 tabular-nums">+{fmtEur(t.delta)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tenant table */}
      {hasTenants && (
        <Card className="border-slate-200 bg-white">
          <CardContent className="py-0">
            <div className="grid grid-cols-4 gap-2 px-3 py-2 border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <span className="col-span-2">{lang === "nl" ? "Adres" : "Address"}</span>
              <span className="text-right">{lang === "nl" ? "Voorschot" : "Advance"}</span>
              <span className="text-right">{lang === "nl" ? "Resultaat" : "Outcome"}</span>
            </div>
            {outcomes.map((tenant, idx) => {
              const positive = tenant.delta > 0;
              return (
                <div
                  key={tenant.vheId}
                  className={`grid grid-cols-4 gap-2 items-center px-3 py-2.5 ${idx < outcomes.length - 1 ? "border-b border-slate-100" : ""} ${tenant.status === "flagged" ? "bg-amber-50/30" : ""}`}
                >
                  <div className="col-span-2 flex items-center gap-2 min-w-0">
                    {tenant.status === "flagged" && <Flag size={10} className="text-amber-500 flex-none" />}
                    <span className="text-xs text-slate-700 truncate">{tenant.address}</span>
                  </div>
                  <span className="text-xs text-right text-slate-500 tabular-nums">{fmtEur(tenant.voorschot)}</span>
                  <div className="flex items-center justify-end gap-1">
                    <span className={`text-xs font-semibold tabular-nums ${positive ? "text-slate-700" : "text-green-600"}`}>
                      {positive ? "+" : ""}{fmtEur(tenant.delta)}
                    </span>
                    {positive
                      ? <TrendingUp size={11} className="text-slate-400" />
                      : <TrendingDown size={11} className="text-green-500" />
                    }
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {!hasTenants && step?.status !== "complete" && (
        <div className="text-center py-8 text-slate-400">
          <Users size={20} className="mx-auto mb-2 opacity-40" />
          <p className="text-xs">{lang === "nl" ? "Huurderuitkomsten worden berekend zodra vorige stappen zijn afgerond." : "Tenant outcomes are calculated once previous steps are completed."}</p>
        </div>
      )}
    </div>
  );
}

/* ── Step 5: Approval ── */
function ApprovalPanel({ distribution, lang }) {
  const step = distribution.steps?.approval;
  return (
    <div className="space-y-4">
      <StepHeader
        title={lang === "nl" ? "Goedkeuring" : "Approval"}
        description={lang === "nl"
          ? "Vraag goedkeuring aan een andere gebruiker voordat de verdeling definitief wordt gemaakt."
          : "Request approval from another user before the distribution is finalised."}
        status={step?.status}
        completedAt={step?.completedAt}
        completedBy={step?.completedBy}
        lang={lang}
      />

      <Card className="border-slate-200 bg-white">
        <CardContent className="py-4 space-y-3">
          {step?.requestedFrom ? (
            <>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{lang === "nl" ? "Aangevraagd bij" : "Requested from"}</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                    <Users size={11} className="text-slate-500" />
                  </div>
                  <span className="font-medium text-slate-700">{step.requestedFrom}</span>
                </div>
              </div>
              {step?.requestedAt && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{lang === "nl" ? "Aangevraagd op" : "Requested on"}</span>
                  <span className="font-medium text-slate-700">{fmtDate(step.requestedAt)}</span>
                </div>
              )}
              {step?.note && (
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 italic">
                  "{step.note}"
                </div>
              )}
              {step?.status === "in_progress" && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700">
                  <Clock size={12} />
                  {lang === "nl" ? "Wacht op goedkeuring…" : "Waiting for approval…"}
                </div>
              )}
              {step?.approvedBy && (
                <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3">
                  <span className="text-slate-400">{lang === "nl" ? "Goedgekeurd door" : "Approved by"}</span>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={13} className="text-green-500" />
                    <span className="font-medium text-slate-700">{step.approvedBy}</span>
                    <span className="text-slate-400">{fmtDate(step.approvedAt)}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <Users size={20} className="mx-auto mb-2 text-slate-300" />
              <p className="text-xs text-slate-400">
                {lang === "nl" ? "Nog geen goedkeuringsverzoek verstuurd." : "No approval request sent yet."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Step 6: Distribution ── */
function DistributionPanel({ distribution, lang }) {
  const step = distribution.steps?.distribution;
  return (
    <div className="space-y-4">
      <StepHeader
        title={lang === "nl" ? "Verdeling" : "Distribution"}
        description={lang === "nl"
          ? "Definitieve verdeling — finaliseer en stuur de afrekening terug naar het ERP-systeem."
          : "Final distribution — finalise and send the billing back to the ERP system."}
        status={step?.status}
        completedAt={step?.completedAt}
        completedBy={step?.completedBy}
        lang={lang}
      />

      <Card className="border-slate-200 bg-white">
        <CardContent className="py-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{lang === "nl" ? "ERP-export" : "ERP export"}</span>
            {step?.sentToErp ? (
              <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                <CheckCircle2 size={13} />
                {lang === "nl" ? "Verzonden" : "Sent"}
              </span>
            ) : (
              <span className="text-slate-400">{lang === "nl" ? "Nog niet verzonden" : "Not sent yet"}</span>
            )}
          </div>
          {step?.erpReference && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{lang === "nl" ? "ERP-referentie" : "ERP reference"}</span>
              <span className="font-mono text-sm font-semibold text-slate-700">{step.erpReference}</span>
            </div>
          )}
          {step?.completedAt && (
            <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3">
              <span className="text-slate-400">{lang === "nl" ? "Afgerekend op" : "Distributed on"}</span>
              <span className="font-medium text-slate-700">{fmtDate(step.completedAt)}</span>
            </div>
          )}

          {/* Summary totals */}
          {distribution.totals?.totalCost != null && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{lang === "nl" ? "Totale kosten" : "Total costs"}</span>
                <span className="font-semibold text-slate-800 tabular-nums">{fmtEur(distribution.totals.totalCost)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{lang === "nl" ? "Totaal voorschot" : "Total advance"}</span>
                <span className="font-medium text-slate-600 tabular-nums">{fmtEur(distribution.totals.totalVoorschot)}</span>
              </div>
              {distribution.totals?.netResult != null && (
                <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2">
                  <span className="font-semibold text-slate-600">{lang === "nl" ? "Nettoresultaat" : "Net result"}</span>
                  <span className={`font-bold tabular-nums text-sm ${distribution.totals.netResult >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {distribution.totals.netResult >= 0 ? "+" : ""}{fmtEur(distribution.totals.netResult, 2)}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Shared step header ── */
function StepHeader({ title, description, status, completedAt, completedBy, lang }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5 max-w-lg">{description}</p>
      </div>
      <div className="flex-none">
        <StepStatusBadge status={status || "pending"} lang={lang} />
        {completedAt && (
          <p className="text-[10px] text-slate-400 mt-1 text-right">{fmtDate(completedAt)}</p>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function DistributionDetailPage() {
  const { distributionId } = useParams();
  const navigate = useNavigate();
  const { orgId } = useOrg();
  const lang = useLang();

  const distribution = getDistributionById(distributionId);
  const building = distribution ? getBuilding(distribution.buildingId) : null;

  // Default active step = currentStep (or first step)
  const defaultStep = distribution?.currentStep === "complete" ? "distribution" : (distribution?.currentStep || "validation");
  const [activeStep, setActiveStep] = useState(defaultStep);

  if (!distribution) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <p className="text-sm">{lang === "nl" ? "Verdeling niet gevonden" : "Distribution not found"}</p>
      </div>
    );
  }

  const isComplete = distribution.currentStep === "complete";
  const currentStepIdx = isComplete ? 6 : STEP_ORDER.indexOf(distribution.currentStep);
  const flaggedCount = distribution.services.filter(s => s.status === "flagged").length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Header ── */}
      <div className="flex-none px-6 pt-5 pb-4 border-b border-slate-200 bg-white">
        <Breadcrumbs
          items={[
            { label: lang === "nl" ? "Verdeling" : "Distribution", href: `/${orgId}/distribution` },
            { label: `${building?.complex || distribution.buildingId} · ${distribution.period}` },
          ]}
        />
        <div className="flex items-start justify-between mt-3 gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{building?.complex || distribution.buildingId}</h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays size={12} className="text-slate-400" />
                {distribution.period}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Building2 size={12} className="text-slate-400" />
                {building?.location}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                {distribution.services.length} {lang === "nl" ? "diensten" : "services"}
              </div>
              {flaggedCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                  <Flag size={9} />
                  {flaggedCount} {lang === "nl" ? "aandacht" : "flagged"}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-none">
            {isComplete ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-100 text-xs font-semibold text-green-700">
                <CheckCircle2 size={13} />
                {lang === "nl" ? "Afgerond" : "Complete"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
                <Clock size={13} />
                {lang === "nl" ? "Stap" : "Step"} {currentStepIdx + 1}/6
              </span>
            )}
            {/* Link to building */}
            <button
              onClick={() => navigate(`/${orgId}/buildings/${distribution.buildingId}`)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors"
            >
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Body: left nav + right panel ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: step navigator */}
        <div className="w-52 flex-none border-r border-slate-200 bg-slate-50 px-3 py-4 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-3 mb-3">
            {lang === "nl" ? "Stappen" : "Steps"}
          </p>
          <StepNavigator
            distribution={distribution}
            activeStep={activeStep}
            onSelectStep={setActiveStep}
            lang={lang}
          />

          {/* Divider + totals summary */}
          {distribution.totals?.totalCost != null && (
            <div className="mt-4 pt-4 border-t border-slate-200 px-3 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">{lang === "nl" ? "Totaal" : "Total"}</span>
                <span className="font-semibold text-slate-700 tabular-nums">{fmtEur(distribution.totals.totalCost)}</span>
              </div>
              {distribution.totals.netResult != null && (
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">{lang === "nl" ? "Resultaat" : "Result"}</span>
                  <span className={`font-bold tabular-nums ${distribution.totals.netResult >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {distribution.totals.netResult >= 0 ? "+" : ""}{fmtEur(distribution.totals.netResult)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: active step content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeStep === "validation"   && <ValidationPanel   distribution={distribution} lang={lang} />}
          {activeStep === "comparison"   && <ComparisonPanel   distribution={distribution} lang={lang} />}
          {activeStep === "control"      && <ControlPanel      distribution={distribution} lang={lang} />}
          {activeStep === "check"        && <CheckPanel        distribution={distribution} lang={lang} />}
          {activeStep === "approval"     && <ApprovalPanel     distribution={distribution} lang={lang} />}
          {activeStep === "distribution" && <DistributionPanel distribution={distribution} lang={lang} />}
        </div>
      </div>
    </div>
  );
}
