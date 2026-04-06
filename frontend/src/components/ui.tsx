import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_20px_60px_-12px_rgba(16,185,129,0.15)]">{children}</div>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none",
        "shadow-sm transition duration-150 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100",
        "hover:bg-white hover:border-slate-300",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function Button({
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-4 select-none cursor-pointer";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 focus:ring-emerald-300 disabled:opacity-50"
      : "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-200 disabled:opacity-50";
  return <button {...props} className={[base, styles, props.className ?? ""].join(" ")} />;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-1 text-xs font-medium text-slate-700">{children}</div>;
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}

