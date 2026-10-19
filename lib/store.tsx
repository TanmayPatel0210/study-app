"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { StudyPackage } from "@/lib/api";

export interface QuizResult { date: string; score: number; total: number }

interface Saved {
  studyPackage: StudyPackage | null;
  sessions: number;
  mastered: number[];        // flashcard indexes mastered in the current package
  lifetimeMastered: number;
  quizResults: QuizResult[];
  activeDays: string[];      // YYYY-MM-DD, local time
}

const EMPTY: Saved = { studyPackage: null, sessions: 0, mastered: [], lifetimeMastered: 0, quizResults: [], activeDays: [] };
const KEY = "mindforge:v1";

export const dayKey = (d = new Date()) => d.toLocaleDateString("en-CA");

const withToday = (s: Saved): Saved =>
  s.activeDays.includes(dayKey()) ? s : { ...s, activeDays: [...s.activeDays, dayKey()] };

export function calcStreak(days: string[]) {
  const set = new Set(days);
  const d = new Date();
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1); // today not studied yet: streak is still alive
  let n = 0;
  while (set.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

interface Ctx extends Saved {
  ready: boolean;
  streak: number;
  avgScore: number | null;
  setPackage: (p: StudyPackage) => void;
  toggleMastered: (i: number) => void;
  addQuizResult: (score: number, total: number) => void;
  resetAll: () => void;
}

const StudyContext = createContext<Ctx | null>(null);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Saved>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setData({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }, [data, ready]);

  const setPackage = useCallback((p: StudyPackage) =>
    setData((s) => withToday({ ...s, studyPackage: p, mastered: [], sessions: s.sessions + 1 })), []);

  const toggleMastered = useCallback((i: number) =>
    setData((s) => {
      const has = s.mastered.includes(i);
      return withToday({
        ...s,
        mastered: has ? s.mastered.filter((x) => x !== i) : [...s.mastered, i],
        lifetimeMastered: Math.max(0, s.lifetimeMastered + (has ? -1 : 1)),
      });
    }), []);

  const addQuizResult = useCallback((score: number, total: number) =>
    setData((s) => withToday({ ...s, quizResults: [...s.quizResults, { date: dayKey(), score, total }] })), []);

  const resetAll = useCallback(() => setData(EMPTY), []);

  const value = useMemo<Ctx>(() => {
    const r = data.quizResults;
    const avgScore = r.length
      ? Math.round((r.reduce((a, x) => a + x.score / x.total, 0) / r.length) * 100)
      : null;
    return { ...data, ready, streak: calcStreak(data.activeDays), avgScore, setPackage, toggleMastered, addQuizResult, resetAll };
  }, [data, ready, setPackage, toggleMastered, addQuizResult, resetAll]);

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error("useStudy must be used inside <StudyProvider>");
  return ctx;
}