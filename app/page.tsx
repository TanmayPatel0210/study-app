"use client";

import { useState } from "react";
import Link from "next/link";
import { generateStudyMaterials } from "@/lib/api";
import { useStudy } from "@/lib/store";

export default function DashboardPage() {
  const { studyPackage, setPackage, sessions, lifetimeMastered, avgScore, mastered } = useStudy();
  const [studyText, setStudyText] = useState("");
  const [gradeLevel, setGradeLevel] = useState("college");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (studyText.trim().length < 30) return;
    setLoading(true);
    setError(null);
    try {
      setPackage(await generateStudyMaterials(studyText, gradeLevel));
    } catch (err: any) {
      setError(err.message || "Could not reach the server. Is the FastAPI backend running?");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Study sessions", value: sessions, color: "text-white" },
    { label: "Flashcards mastered", value: lifetimeMastered, color: "text-indigo-400" },
    { label: "Quiz average", value: avgScore === null ? "–" : `${avgScore}%`, color: "text-emerald-400" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 via-slate-900/50 to-slate-900/80 p-8 shadow-2xl">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">Welcome back to MindForge 🚀</h2>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
          Paste your notes and get a summary, flashcards and a quiz you can actually practise with.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-xs text-slate-400 font-medium">{s.label}</span>
              <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 lg:p-8 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">✨ Generate new study materials</h3>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label htmlFor="level" className="block text-xs font-semibold text-slate-400 mb-2">Academic level</label>
            <select
              id="level"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="high_school">High school</option>
              <option value="college">College / undergraduate</option>
              <option value="advanced">Advanced / graduate</option>
            </select>
          </div>
          <div>
            <label htmlFor="notes" className="block text-xs font-semibold text-slate-400 mb-2">Notes</label>
            <textarea
              id="notes"
              rows={6}
              value={studyText}
              onChange={(e) => setStudyText(e.target.value)}
              placeholder="Paste lecture notes or a textbook excerpt (at least 30 characters)…"
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-slate-500">{studyText.length} characters</p>
          </div>
          {error && <div role="alert" className="rounded-xl bg-red-950/50 border border-red-500/20 p-4 text-sm text-red-400">{error}</div>}
          <button
            type="submit"
            disabled={loading || studyText.trim().length < 30}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? (<><span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />Generating…</>) : "Generate study package"}
          </button>
        </form>
      </div>

      {studyPackage && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 lg:p-8">
            <h4 className="text-sm font-bold text-indigo-400 mb-3">📌 Summary</h4>
            <p className="text-slate-300 leading-relaxed">{studyPackage.summary}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/flashcards" className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 hover:border-indigo-500/40 transition-all">
              <p className="text-2xl">🎴</p>
              <p className="mt-2 font-bold text-white">Study {studyPackage.flashcards.length} flashcards</p>
              <p className="text-sm text-slate-400">{mastered.length} mastered so far</p>
            </Link>
            <Link href="/quizzes" className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 hover:border-indigo-500/40 transition-all">
              <p className="text-2xl">📝</p>
              <p className="mt-2 font-bold text-white">Take the {studyPackage.quiz.length}-question quiz</p>
              <p className="text-sm text-slate-400">Answers stay hidden until you pick one</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 