import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center py-14">
      <div className="relative w-full max-w-lg">
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-indigo-500/40 via-sky-500/40 to-emerald-500/40 blur-2xl opacity-70" />
        <div className="relative rounded-3xl border border-slate-800/70 bg-slate-900/70 backdrop-blur-xl p-7 shadow-[0_18px_45px_rgba(0,0,0,0.75)]">
          <h2 className="text-2xl font-semibold mb-2">
            ThreadS
          </h2>
          <p className="text-sm text-slate-300 mb-5">
            Create Cards filled with love and care.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-sm font-medium text-slate-950 shadow-md shadow-indigo-500/40 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}