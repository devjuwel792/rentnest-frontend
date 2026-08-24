import Image from "next/image";
import Link from "next/link";
import HeroSearch from "./_components/home/HeroSearch";
import HeroActions from "./_components/home/HeroActions";
import CategoryShowcase from "./_components/home/CategoryShowcase";
import FeaturedProperties from "./_components/home/FeaturedProperties";
import WhyChooseUs from "./_components/home/WhyChooseUs";
import HowItWorks from "./_components/home/HowItWorks";
import CtaBanner from "./_components/home/CtaBanner";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section with High-Contrast Background Image & Perfect Spacing */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-16 sm:px-6 sm:py-24 text-center">
        {/* Background Image & Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero_bg.png"
            alt="Luxury Rental Property Architecture"
            fill
            priority
            className="scale-105 object-cover object-center brightness-60 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/35 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-indigo-200 shadow-xl backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            ✨ Next-Generation Rental Marketplace
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl sm:leading-tight drop-shadow-md">
            Find Your Dream{" "}
            <span className="bg-gradient-to-r from-indigo-200 via-purple-200 to-amber-200 bg-clip-text text-transparent">
              Sanctuary &amp; Home
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-gray-100 sm:text-lg drop-shadow-sm">
            Browse 100% verified luxury apartments, studio flats, and executive homes with digital move-in requests &amp; bank-grade Stripe escrow payments.
          </p>

          <HeroSearch />

          <HeroActions />

          <CategoryShowcase />

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-gray-100 sm:gap-5">
            <span className="flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/60 px-4 py-2 shadow-lg backdrop-blur-md">
              <span>🏙️</span> Verified Top Locations
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/60 px-4 py-2 shadow-lg backdrop-blur-md">
              <span>🛡️</span> Verified Host Listings
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/60 px-4 py-2 shadow-lg backdrop-blur-md">
              <span>🔒</span> Instant Stripe Escrow
            </span>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Curated Listings
            </span>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Featured Properties
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Handpicked premium rentals available for immediate booking.
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 transition-colors hover:bg-indigo-100"
          >
            Explore all listings →
          </Link>
        </div>

        <FeaturedProperties />
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* How It Works */}
      <HowItWorks />

      {/* CTA Banner */}
      <CtaBanner />
    </main>
  );
}
