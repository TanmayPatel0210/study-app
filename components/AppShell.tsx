"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useStudy } from "@/lib/store";

const NAV = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/flashcards", label: "Flashcards", icon: "🎴" },
  { href: "/quizzes", label: "Quizzes", icon: "📝" },
  { href: "/analytics", label: "Analytics", icon: "📈" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { streak, studyPackage, mastered } = useStudy();
  const current = NAV.find((n) => n.href === pathname) ?? NAV[0];
  const total = studyPackage?.flashcards.length ?? 0;
  const pct = total ? Math.round((mastered.length / total) * 100) : 0;

  return (
    <div className="flex h-full">
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900/50 p-6 md:flex">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 font-bold text-white shadow-lg shadow-indigo-500/20">⚡</div>
          <div>
            <h1 className="font-bold tracking-tight text-white">MindForge</h1>
            <p className="text-xs text-indigo-400 font-medium">Terra Copilot v1.0</p>
          </div>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map((n) => {
            const active = n.href === pathname;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                  active
                    ? "bg-indigo-600/10 font-semibold text-indigo-400 border border-indigo-500/20"
                    : "font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
                }`}
              >
                {n.icon} {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Real progress widget (replaces the placeholder farm status) */}
        <div className="mt-auto rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/40 to-slate-900/80 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-300">Current deck</span>
            <span className="text-xs text-slate-400">{total ? `${mastered.length}/${total}` : "–"}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-400">{total ? `${pct}% of cards mastered` : "No deck generated yet"}</p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/30 px-6 backdrop-blur-md">
          <span className="text-sm font-medium text-slate-400">
            Workspace / <span className="text-white">{current.label}</span>
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-300">
              <span>🔥</span> {streak} day streak
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white">ME</div>
          </div>
        </header>

        {/* Mobile nav: the sidebar is hidden below md, so give phones their own tabs */}
        <nav className="flex gap-1 overflow-x-auto border-b border-slate-800 bg-slate-900/30 px-4 py-2 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                n.href === pathname ? "bg-indigo-600/20 text-indigo-300" : "text-slate-400"
              }`}
            >
              {n.icon} {n.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto bg-slate-950 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}