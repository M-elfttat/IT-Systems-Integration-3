import type { ReactNode } from "react";
import { Card } from "./ui";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 py-10">
      {/* Decorative gradient orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -z-10"></div>

      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-10 rounded-[2rem] border border-slate-700/50 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm p-6 shadow-[0_18px_60px_-32px_rgba(16,185,129,0.15)] sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.32em] text-emerald-400">MediBook</div>
            <p className="mt-2 max-w-xl text-sm text-slate-300">A polished appointment experience for patients, doctors, and clinics.</p>
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm text-slate-300 sm:mt-0">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 animate-pulse" />
            Secure and reliable
          </div>
        </header>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1.6fr_1.1fr]">
        <div className="space-y-8 rounded-[2rem] border border-slate-700/50 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm p-10 shadow-[0_24px_80px_-40px_rgba(16,185,129,0.1)]">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Healthcare appointments, <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">made simple.</span>
            </h1>
            <p className="mt-6 max-w-xl text-slate-300">
              Book appointments with qualified doctors, track your visit history, and manage your healthcare — all in one place.
            </p>
          </div>

          <ul className="space-y-4 text-slate-200">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-3 w-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex-shrink-0" />
              Browse doctors by specialization and availability.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-3 w-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex-shrink-0" />
              Book and manage appointments in real time.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-3 w-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex-shrink-0" />
              Secure login with role-based access.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-3 w-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex-shrink-0" />
              Admin tools for doctors and schedule management.
            </li>
          </ul>
        </div>

        <Card>
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-950 to-slate-800 bg-clip-text text-transparent">{title}</h2>
              <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            </div>
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
}
