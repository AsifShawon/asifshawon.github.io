import type { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from "react";

export type Tone = "accent" | "success" | "warning" | "neutral" | "danger";

const TONE_SOFT_BG: Record<Tone, string> = {
  accent: "bg-[#76ABAE]/15 text-[#76ABAE]",
  success: "bg-emerald-500/15 text-emerald-400",
  warning: "bg-amber-500/15 text-amber-400",
  neutral: "bg-white/8 text-gray-300",
  danger: "bg-red-500/15 text-red-400",
};

const TONE_DOT: Record<Tone, string> = {
  accent: "bg-[#76ABAE]",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  neutral: "bg-gray-400",
  danger: "bg-red-400",
};

export function AdminCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-[#0C161C] p-4 sm:p-6 shadow-lg shadow-black/30 ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="min-w-0">
        <h1 className="font-display text-xl font-bold tracking-tight gradient-text sm:text-2xl md:text-[28px]">
          {title}
        </h1>
        {subtitle && <p className="mt-0.5 text-xs text-gray-400 sm:text-sm">{subtitle}</p>}
      </div>
      {action && <div className="w-full shrink-0 sm:w-auto">{action}</div>}
    </div>
  );
}

export function AdminLabel(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={`mb-1.5 block text-xs uppercase tracking-wider text-gray-400 ${props.className ?? ""}`}
    />
  );
}

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-white/10 bg-[#0A141A] px-3.5 py-2.5 text-base sm:text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-[#76ABAE] focus:ring-2 focus:ring-[#76ABAE]/25 ${props.className ?? ""}`}
    />
  );
}

export function AdminTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-white/10 bg-[#0A141A] px-3.5 py-2.5 text-base sm:text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-[#76ABAE] focus:ring-2 focus:ring-[#76ABAE]/25 ${props.className ?? ""}`}
    />
  );
}

export function AdminButton({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  const styles = {
    primary:
      "rounded-full bg-gradient-to-r from-[#76ABAE] to-[#5a9ca0] text-[#061317] shadow-md shadow-[#76ABAE]/10 hover:opacity-90",
    secondary: "rounded-xl border border-white/15 text-gray-200 hover:bg-white/5",
    danger: "rounded-xl border border-red-500/25 bg-red-500/10 text-red-300 hover:bg-red-500/20",
  }[variant];

  return (
    <button
      {...props}
      className={`inline-flex h-10 items-center justify-center gap-2 px-5 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 ${styles} ${className}`}
    />
  );
}

export function IconChip({
  children,
  tone = "accent",
  size = "md",
}: {
  children: React.ReactNode;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
}) {
  const sizeStyles = { sm: "h-8 w-8", md: "h-10 w-10 sm:h-11 sm:w-11", lg: "h-11 w-11 sm:h-12 sm:w-12" }[size];
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl ${sizeStyles} ${TONE_SOFT_BG[tone]}`}
    >
      {children}
    </div>
  );
}

export function StatusPill({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${TONE_SOFT_BG[tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[tone]}`} />
      {children}
    </span>
  );
}

export function Avatar({
  label,
  size = "md",
}: {
  label: string;
  size?: "sm" | "md" | "lg";
}) {
  const initial = label.trim().charAt(0).toUpperCase() || "?";
  const sizeStyles = { sm: "h-7 w-7 text-xs", md: "h-8 w-8 sm:h-9 sm:w-9 text-sm", lg: "h-10 w-10 sm:h-11 sm:w-11 text-base" }[
    size
  ];
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#76ABAE] to-[#3f6b6e] font-display font-semibold text-[#061317] ${sizeStyles}`}
    >
      {initial}
    </div>
  );
}

export function StatTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <AdminCard className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
      {icon && <IconChip size="lg">{icon}</IconChip>}
      <div className="min-w-0">
        <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">{value}</p>
        <p className="mt-0.5 text-[11px] sm:text-xs uppercase tracking-wider text-gray-400 truncate">{label}</p>
      </div>
    </AdminCard>
  );
}
