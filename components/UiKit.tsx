import React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const ShellCard: React.FC<DivProps> = ({ className = "", ...props }) => (
  <div
    className={
      "rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 " + className
    }
    {...props}
  />
);

export const SubtleCard: React.FC<DivProps> = ({ className = "", ...props }) => (
  <div
    className={
      "rounded-xl bg-slate-50/70 ring-1 ring-slate-100 " + className
    }
    {...props}
  />
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <div className="mb-3 flex items-baseline justify-between gap-2">
    <div>
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      {subtitle && (
        <p className="text-xs text-slate-500">{subtitle}</p>
      )}
    </div>
  </div>
);

export const StatusPill: React.FC<{
  label: string;
  tone?: "success" | "warn" | "danger" | "info" | "neutral";
}> = ({ label, tone = "neutral" }) => {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize";

  const toneClass =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "warn"
      ? "bg-amber-50 text-amber-800"
      : tone === "danger"
      ? "bg-rose-50 text-rose-700"
      : tone === "info"
      ? "bg-sky-50 text-sky-700"
      : "bg-slate-50 text-slate-700";

  return <span className={base + " " + toneClass}>{label}</span>;
};
