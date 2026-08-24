import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 sm:px-6">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-pink-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-xl text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
              🏠
            </span>
            <span className="text-3xl font-black tracking-tight text-white">
              Rent<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Nest</span>
            </span>
          </Link>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-indigo-300">
            Next-Generation Rental Marketplace
          </p>
        </div>
        {children}
      </div>
    </main>
  );
}
