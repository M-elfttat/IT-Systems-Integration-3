import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">{children}</div>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none",
        "focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100",
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
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-4";
  const styles =
    variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-200 disabled:opacity-50"
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

