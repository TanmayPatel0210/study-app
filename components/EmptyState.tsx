import Link from "next/link";

export default function EmptyState({ title = "Nothing here yet" }: { title?: string }) {
  return (
    <div className="max-w-xl mx-auto mt-16 rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center">
      <p className="text-lg font-bold text-white">{title}</p>
      <p className="mt-2 text-sm text-slate-400">Paste your notes on the dashboard to generate a study package first.</p>
      <Link href="/" className="mt-6 inline-block rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white">
        Go to dashboard
      </Link>
    </div>
  );
}